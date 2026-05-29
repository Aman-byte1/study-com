'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

export default function ParentProgressPage() {
  const [children, setChildren] = useState<Profile[]>([])
  const [progressData, setProgressData] = useState<Record<string, { courseName: string; completed: number; total: number; quizAvg: number }[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: kids } = await supabase.from('profiles').select('*').eq('parent_id', user.id).eq('role', 'student')
      if (kids) {
        setChildren(kids)
        const pd: typeof progressData = {}
        for (const kid of kids) {
          const { data: enrollments } = await supabase.from('enrollments').select('course_id, courses(title, lessons(count))').eq('student_id', kid.id)
          const { data: completedLessons } = await supabase.from('lesson_progress').select('lesson_id').eq('student_id', kid.id).eq('completed', true)
          const { data: quizAttempts } = await supabase.from('quiz_attempts').select('score, total_points').eq('student_id', kid.id)

          const completedIds = new Set((completedLessons || []).map((l: { lesson_id: string }) => l.lesson_id))
          const avgScore = quizAttempts && quizAttempts.length > 0
            ? Math.round(quizAttempts.reduce((a: number, q: { score: number; total_points: number }) => a + (q.score / q.total_points) * 100, 0) / quizAttempts.length)
            : 0

          pd[kid.id] = (enrollments || []).map((e: Record<string, unknown>) => {
            const course = e.courses as unknown as { title: string; lessons: { count: number }[] }
            return {
              courseName: course?.title || 'Unknown',
              completed: 0,
              total: course?.lessons?.[0]?.count || 0,
              quizAvg: avgScore,
            }
          })
        }
        setProgressData(pd)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '2rem' }}>Child Progress</h2>

      {children.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👨‍👩‍👧</div>
          <div className="empty-state-title">No children linked</div>
          <div className="empty-state-text">Ask the admin to link your child&apos;s student account.</div>
        </div>
      ) : children.map(child => (
        <div key={child.id} className="card-static" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="avatar avatar-lg">{child.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</div>
            <div>
              <h3>{child.full_name}</h3>
              <span className="badge badge-primary">Grade {child.grade_level}</span>
            </div>
          </div>

          {(progressData[child.id] || []).length === 0 ? (
            <p style={{ color: 'var(--text-tertiary)' }}>Not enrolled in any courses yet.</p>
          ) : (progressData[child.id] || []).map((p, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 500 }}>{p.courseName}</span>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                  {p.completed}/{p.total} lessons
                </span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: p.total > 0 ? `${(p.completed / p.total) * 100}%` : '0%' }} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
