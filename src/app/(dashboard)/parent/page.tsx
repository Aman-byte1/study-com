'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

interface ChildProgress {
  courseName: string
  lessonsCompleted: number
  totalLessons: number
  avgQuizScore: number
}

export default function ParentDashboard() {
  const [children, setChildren] = useState<Profile[]>([])
  const [progress, setProgress] = useState<ChildProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get children linked to this parent
      const { data: kids } = await supabase
        .from('profiles')
        .select('*')
        .eq('parent_id', user.id)
        .eq('role', 'student')

      if (kids) setChildren(kids)

      // Get enrollment and progress for each child
      if (kids && kids.length > 0) {
        const childIds = kids.map(k => k.id)
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('*, courses(title, lessons(count))')
          .in('student_id', childIds)

        if (enrollments) {
          const prog: ChildProgress[] = enrollments.map((e: Record<string, unknown>) => {
            const course = e.courses as unknown as { title: string; lessons: { count: number }[] }
            return {
              courseName: course?.title || 'Unknown',
              lessonsCompleted: 0,
              totalLessons: course?.lessons?.[0]?.count || 0,
              avgQuizScore: 0,
            }
          })
          setProgress(prog)
        }
      }

      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="animate-fade-in">
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card animate-fade-in-up stagger-1">
          <div className="stat-icon stat-icon-purple">👨‍👩‍👧</div>
          <div className="stat-info">
            <div className="stat-label">My Children</div>
            <div className="stat-value">{children.length}</div>
          </div>
        </div>
        <div className="stat-card animate-fade-in-up stagger-2">
          <div className="stat-icon stat-icon-teal">📚</div>
          <div className="stat-info">
            <div className="stat-label">Active Courses</div>
            <div className="stat-value">{progress.length}</div>
          </div>
        </div>
        <div className="stat-card animate-fade-in-up stagger-3">
          <div className="stat-icon stat-icon-green">✅</div>
          <div className="stat-info">
            <div className="stat-label">Lessons Completed</div>
            <div className="stat-value">{progress.reduce((acc, p) => acc + p.lessonsCompleted, 0)}</div>
          </div>
        </div>
      </div>

      {/* Children */}
      <div className="content-grid">
        {children.length === 0 ? (
          <div className="card-static">
            <div className="empty-state">
              <div className="empty-state-icon">👨‍👩‍👧</div>
              <div className="empty-state-title">No children linked</div>
              <div className="empty-state-text">
                Ask the admin to link your student&apos;s account to your parent account.
              </div>
            </div>
          </div>
        ) : (
          children.map(child => (
            <div key={child.id} className="card-static animate-fade-in-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="avatar avatar-lg">
                  {child.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h4>{child.full_name}</h4>
                  <span className="badge badge-primary">Grade {child.grade_level}</span>
                </div>
              </div>

              <h5 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Course Progress</h5>
              {progress.length === 0 ? (
                <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                  Not enrolled in any courses yet
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {progress.map((p, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{p.courseName}</span>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                          {p.lessonsCompleted}/{p.totalLessons} lessons
                        </span>
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{
                          width: p.totalLessons > 0 ? `${(p.lessonsCompleted / p.totalLessons) * 100}%` : '0%'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
