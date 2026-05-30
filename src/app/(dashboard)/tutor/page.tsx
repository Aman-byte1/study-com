'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Course, Submission } from '@/lib/types'

// ============================================
// CUSTOM TUTOR SVG ICONS
// ============================================
function CoursesIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="9" y1="6" x2="16" y2="6" />
      <line x1="9" y1="10" x2="16" y2="10" />
    </svg>
  )
}

function StudentsIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  )
}

function PendingIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export default function TutorDashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [studentCount, setStudentCount] = useState(0)
  const [pendingSubmissions, setPendingSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // My courses
      const { data: myCourses } = await supabase
        .from('courses')
        .select('*, subjects(name, icon_url), enrollments(count)')
        .eq('tutor_id', user.id)

      if (myCourses) setCourses(myCourses)

      // Total unique students
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('student_id')
        .in('course_id', (myCourses || []).map(c => c.id))

      if (enrollments) {
        const unique = new Set(enrollments.map((e: { student_id: string }) => e.student_id))
        setStudentCount(unique.size)
      }

      // Pending submissions (ungraded)
      const { data: submissions } = await supabase
        .from('submissions')
        .select('*, assignments(title, course_id), profiles!submissions_student_id_fkey(full_name)')
        .is('score', null)
        .in('assignment_id', 
          (await supabase.from('assignments').select('id').eq('tutor_id', user.id)).data?.map((a: { id: string }) => a.id) || []
        )
        .limit(10)

      if (submissions) setPendingSubmissions(submissions)

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
          <div className="stat-icon" style={{ background: 'rgba(216, 168, 56, 0.08)', borderRadius: 0 }}>
            <CoursesIcon size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">My Courses</div>
            <div className="stat-value">{courses.length}</div>
          </div>
        </div>
        <div className="stat-card animate-fade-in-up stagger-2">
          <div className="stat-icon" style={{ background: 'rgba(216, 168, 56, 0.08)', borderRadius: 0 }}>
            <StudentsIcon size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Students</div>
            <div className="stat-value">{studentCount}</div>
          </div>
        </div>
        <div className="stat-card animate-fade-in-up stagger-3">
          <div className="stat-icon" style={{ background: 'rgba(216, 168, 56, 0.08)', borderRadius: 0 }}>
            <PendingIcon size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Pending Grading</div>
            <div className="stat-value">{pendingSubmissions.length}</div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        {/* Quick Actions */}
        <div className="card-static animate-fade-in-up stagger-1">
          <h3 className="card-title" style={{ marginBottom: '1rem', fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-lg)', fontWeight: 500 }}>
            Tutor Operations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link href="/tutor/upload" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 16l-4-4-4 4" /><path d="M12 12v9" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
              UPLOAD CONTENT
            </Link>
            <Link href="/tutor/assignments" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
              ASSIGNMENTS
            </Link>
            <Link href="/tutor/quizzes" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" /></svg>
              QUIZZES
            </Link>
            <Link href="/tutor/messages" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              MESSAGES
            </Link>
          </div>
        </div>

        {/* Pending Submissions */}
        <div className="card-static animate-fade-in-up stagger-2">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-lg)', fontWeight: 500 }}>
              <PendingIcon size={18} /> Pending Grading
            </h3>
            <Link href="/tutor/assignments" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          {pendingSubmissions.length === 0 ? (
            <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>All caught up! No submissions to grade.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pendingSubmissions.map(s => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-lg)',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                      {(s.assignment as unknown as { title: string })?.title}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                      by {(s.student as unknown as { full_name: string })?.full_name}
                    </div>
                  </div>
                  <span className="badge badge-warning">Ungraded</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* My Courses */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3>My Courses</h3>
          <Link href="/tutor/courses" className="btn btn-ghost btn-sm">Manage →</Link>
        </div>
        {courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <div className="empty-state-title">No courses created</div>
            <div className="empty-state-text">Ask your admin to create courses and assign them to you.</div>
          </div>
        ) : (
          <div className="course-grid">
            {courses.map(course => (
              <Link key={course.id} href={`/tutor/courses/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="course-card">
                  <div className="course-card-header">
                    {(course.subject as unknown as { icon_url: string })?.icon_url || '📖'}
                  </div>
                  <div className="course-card-body">
                    <div className="course-card-title">{course.title}</div>
                    <div className="course-card-meta">
                      <span>{(course.subject as unknown as { name: string })?.name}</span>
                      <span>Grade {course.grade_level}</span>
                    </div>
                    <div className="course-card-footer">
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                        {(course.enrollments as unknown as { count: number }[])?.[0]?.count || 0} students
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
