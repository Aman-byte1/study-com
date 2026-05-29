'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Course, Schedule, Assignment, QuizAttempt } from '@/lib/types'

export default function StudentDashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [recentQuizzes, setRecentQuizzes] = useState<QuizAttempt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Enrolled courses
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('course_id, courses(*, subjects(*), lessons(count))')
        .eq('student_id', user.id)

      if (enrollments) {
        setCourses(enrollments.map((e: Record<string, unknown>) => e.courses as unknown as Course))
      }

      // Today's schedule
      const today = new Date().getDay()
      const { data: scheds } = await supabase
        .from('schedules')
        .select('*, courses(title), profiles!schedules_tutor_id_fkey(full_name)')
        .eq('student_id', user.id)
        .eq('day_of_week', today)
        .eq('is_active', true)

      if (scheds) setSchedules(scheds)

      // Pending assignments
      const { data: assigns } = await supabase
        .from('assignments')
        .select('*, courses(title)')
        .in('course_id', (enrollments || []).map((e: Record<string, unknown>) => e.course_id))
        .order('due_date', { ascending: true })
        .limit(5)

      if (assigns) setAssignments(assigns)

      // Recent quiz attempts
      const { data: quizzes } = await supabase
        .from('quiz_attempts')
        .select('*, quizzes(title, course_id)')
        .eq('student_id', user.id)
        .order('started_at', { ascending: false })
        .limit(5)

      if (quizzes) setRecentQuizzes(quizzes)

      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return <div className="loading-center"><div className="spinner" /></div>
  }

  return (
    <div className="animate-fade-in">
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card animate-fade-in-up stagger-1">
          <div className="stat-icon stat-icon-purple">📚</div>
          <div className="stat-info">
            <div className="stat-label">Enrolled Courses</div>
            <div className="stat-value">{courses.length}</div>
          </div>
        </div>
        <div className="stat-card animate-fade-in-up stagger-2">
          <div className="stat-icon stat-icon-teal">📅</div>
          <div className="stat-info">
            <div className="stat-label">Today&apos;s Sessions</div>
            <div className="stat-value">{schedules.length}</div>
          </div>
        </div>
        <div className="stat-card animate-fade-in-up stagger-3">
          <div className="stat-icon stat-icon-pink">📝</div>
          <div className="stat-info">
            <div className="stat-label">Pending Assignments</div>
            <div className="stat-value">{assignments.length}</div>
          </div>
        </div>
        <div className="stat-card animate-fade-in-up stagger-4">
          <div className="stat-icon stat-icon-green">🎯</div>
          <div className="stat-info">
            <div className="stat-label">Quizzes Taken</div>
            <div className="stat-value">{recentQuizzes.length}</div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        {/* Today's Schedule */}
        <div className="card-static animate-fade-in-up stagger-2">
          <div className="card-header">
            <h3 className="card-title">📅 Today&apos;s Schedule</h3>
            <Link href="/student/schedule" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          {schedules.length === 0 ? (
            <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>No sessions scheduled for today</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {schedules.map(s => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-lg)',
                  borderLeft: '3px solid var(--brand-primary)',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                      {(s.course as unknown as { title: string })?.title}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                      {s.start_time} - {s.end_time}
                    </div>
                  </div>
                  <span className="badge badge-primary">Live</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Assignments */}
        <div className="card-static animate-fade-in-up stagger-3">
          <div className="card-header">
            <h3 className="card-title">📝 Assignments</h3>
            <Link href="/student/assignments" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          {assignments.length === 0 ? (
            <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>No pending assignments</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {assignments.map(a => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-lg)',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{a.title}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                      {(a.course as unknown as { title: string })?.title}
                    </div>
                  </div>
                  {a.due_date && (
                    <span className="badge badge-warning">
                      Due {new Date(a.due_date).toLocaleDateString()}
                    </span>
                  )}
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
          <Link href="/student/courses" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
        {courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <div className="empty-state-title">No courses yet</div>
            <div className="empty-state-text">You haven&apos;t been enrolled in any courses. Contact your admin or tutor.</div>
          </div>
        ) : (
          <div className="course-grid">
            {courses.slice(0, 3).map(course => (
              <Link key={course.id} href={`/student/courses/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="course-card">
                  <div className="course-card-header">
                    {(course.subject as unknown as { icon_url: string })?.icon_url || '📖'}
                  </div>
                  <div className="course-card-body">
                    <div className="course-card-title">{course.title}</div>
                    <div className="course-card-meta">
                      <span>Grade {course.grade_level}</span>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: '0%' }} />
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
