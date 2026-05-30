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
  const [studentName, setStudentName] = useState('Student')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Load profile info
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      if (profile?.full_name) {
        setStudentName(profile.full_name.split(' ')[0])
      }

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
    return (
      <div className="loading-center" style={{ minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2 className="welcome-banner-title" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
          Welcome back, {studentName}! 🚀
        </h2>
        <p className="welcome-banner-text">
          Prepare for your entrance exams by browsing syllabus-aligned lessons, doing chapter quizzes, and keeping up with assignments.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>
        Quick Actions
      </h3>
      <div className="quick-actions">
        <Link href="/student/courses" className="quick-action">
          <span className="quick-action-icon">📚</span>
          <span className="quick-action-label">My Courses</span>
        </Link>
        <Link href="/student/exam-prep" className="quick-action">
          <span className="quick-action-icon">🎯</span>
          <span className="quick-action-label">Exam Prep</span>
        </Link>
        <Link href="/student/quizzes" className="quick-action">
          <span className="quick-action-icon">❓</span>
          <span className="quick-action-label">Take Quiz</span>
        </Link>
        <Link href="/student/schedule" className="quick-action">
          <span className="quick-action-icon">📅</span>
          <span className="quick-action-label">Schedule</span>
        </Link>
        <Link href="/student/messages" className="quick-action">
          <span className="quick-action-icon">💬</span>
          <span className="quick-action-label">Ask Tutor</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
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

      {/* Content Columns split */}
      <div className="content-grid" style={{ gap: '2rem' }}>
        {/* Today's Schedule Card */}
        <div className="card-static animate-fade-in-up stagger-2" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card-header" style={{ borderBottom: '1px solid var(--border-secondary)', paddingBottom: '0.75rem' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--font-size-base)', fontWeight: 700 }}>
              📅 Today&apos;s Schedule
            </h3>
            <Link href="/student/schedule" className="btn btn-ghost btn-sm" style={{ color: 'var(--brand-primary-light)' }}>
              View Calendar
            </Link>
          </div>
          {schedules.length === 0 ? (
            <div style={{ padding: '1rem 0', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)', margin: 0 }}>No sessions scheduled for today</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {schedules.map(s => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.85rem 1.25rem',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-xl)',
                  borderLeft: '4px solid var(--brand-primary)',
                  border: '1px solid var(--border-secondary)',
                  borderLeftColor: 'var(--brand-primary)',
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>
                      {(s as any).courses?.title || (s.course as any)?.title}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {s.start_time} - {s.end_time} • {(s as any).profiles?.full_name || 'Tutor'}
                    </div>
                  </div>
                  <span className="badge badge-primary" style={{ padding: '2px 8px', fontSize: '10px' }}>Live</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Assignments Card */}
        <div className="card-static animate-fade-in-up stagger-3" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card-header" style={{ borderBottom: '1px solid var(--border-secondary)', paddingBottom: '0.75rem' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--font-size-base)', fontWeight: 700 }}>
              📝 Pending Assignments
            </h3>
            <Link href="/student/assignments" className="btn btn-ghost btn-sm" style={{ color: 'var(--brand-primary-light)' }}>
              View All
            </Link>
          </div>
          {assignments.length === 0 ? (
            <div style={{ padding: '1rem 0', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)', margin: 0 }}>No pending assignments</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {assignments.map(a => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.85rem 1.25rem',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-secondary)',
                  borderRadius: 'var(--radius-xl)',
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>{a.title}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {(a as any).courses?.title || (a.course as any)?.title}
                    </div>
                  </div>
                  {a.due_date && (
                    <span className="badge badge-warning" style={{ padding: '2px 8px', fontSize: '10px' }}>
                      Due {new Date(a.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* My Courses Section */}
      <div style={{ marginTop: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, fontFamily: 'var(--font-heading)', margin: 0 }}>My Active Courses</h3>
          <Link href="/student/courses" className="btn btn-ghost btn-sm" style={{ color: 'var(--brand-primary-light)' }}>
            All Courses →
          </Link>
        </div>
        {courses.length === 0 ? (
          <div className="empty-state" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-2xl)' }}>
            <div className="empty-state-icon">📚</div>
            <div className="empty-state-title">No Enrolled Courses Yet</div>
            <div className="empty-state-text">You haven&apos;t been registered for any classes. Contact your supervisor or teacher to get started.</div>
            <Link href="/student/messages" className="btn btn-primary btn-sm">Message Tutor</Link>
          </div>
        ) : (
          <div className="course-grid">
            {courses.slice(0, 3).map(course => (
              <Link key={course.id} href={`/student/courses/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="course-card" style={{ transition: 'all var(--transition-base)' }}>
                  <div className="course-card-header" style={{
                    fontSize: '2rem',
                    background: 'rgba(108, 92, 231, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem 1rem',
                    borderBottom: '1px solid var(--border-secondary)',
                  }}>
                    {/* Fallback emoji logic based on subject */}
                    {course.title.toLowerCase().includes('math') ? '📐' : 
                     course.title.toLowerCase().includes('phys') ? '⚛️' :
                     course.title.toLowerCase().includes('chem') ? '🧪' :
                     course.title.toLowerCase().includes('biol') ? '🧬' :
                     course.title.toLowerCase().includes('engl') ? '🗣️' : '📖'}
                  </div>
                  <div className="course-card-body" style={{ padding: '1.5rem' }}>
                    <div className="course-card-title" style={{ fontWeight: 800, fontSize: 'var(--font-size-base)', marginBottom: '0.375rem' }}>
                      {course.title}
                    </div>
                    <div className="course-card-meta" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                      <span>Grade {course.grade_level} Syllabus</span>
                    </div>
                    <div className="progress-bar-container" style={{ height: '6px', background: 'var(--bg-glass)' }}>
                      <div className="progress-bar-fill" style={{ width: '45%', background: 'var(--gradient-brand)' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-tertiary)', marginTop: '0.375rem', fontWeight: 600 }}>
                      <span>PROGRESS</span>
                      <span>45% COMPLETE</span>
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
