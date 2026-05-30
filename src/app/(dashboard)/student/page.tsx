'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Course, Schedule, Assignment, QuizAttempt } from '@/lib/types'

// ============================================
// CUSTOM HAND-CRAFTED EDITORIAL SVG ICONS
// ============================================

function CoursesIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="9" y1="6" x2="16" y2="6" />
      <line x1="9" y1="10" x2="16" y2="10" />
    </svg>
  )
}

function ExamPrepIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}

function QuizzesIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" />
    </svg>
  )
}

function ScheduleIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <rect x="3" y="4" width="18" height="18" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function MessagesIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function ScheduleSvgIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <rect x="3" y="4" width="18" height="18" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="12" cy="16" r="1.5" fill="var(--brand-primary)" stroke="none" />
    </svg>
  )
}

function AssignmentSvgIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

const getCourseIcon = (title: string, size = 32) => {
  const t = title.toLowerCase()
  if (t.includes('math')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M18 6h-6l-4 12-2-4H3" />
        <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  if (t.includes('phys')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
        <ellipse cx="12" cy="12" rx="3" ry="9" transform="rotate(30, 12, 12)" />
        <ellipse cx="12" cy="12" rx="3" ry="9" transform="rotate(-30, 12, 12)" />
        <circle cx="12" cy="12" r="1.5" fill="var(--brand-primary)" />
      </svg>
    )
  }
  if (t.includes('chem')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M6 3h12" />
        <path d="M9 3v8L4 19c-.5 1-.2 2 .8 2h14.4c1 0 1.3-1 .8-2L15 11V3" />
      </svg>
    )
  }
  if (t.includes('biol')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M4.5 10.5C4.5 5 12 3 12 3s7.5 2 7.5 7.5c0 5-7.5 10.5-7.5 10.5s-7.5-5.5-7.5-10.5z" />
        <path d="M12 3v18" />
        <path d="M4.5 10.5c3.5 1 7.5 1 15 0" />
      </svg>
    )
  }
  if (t.includes('engl')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <line x1="8" y1="7" x2="16" y2="7" strokeWidth="1.2" />
        <line x1="8" y1="11" x2="14" y2="11" strokeWidth="1.2" />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

const getActionIcon = (label: string) => {
  switch (label.toLowerCase()) {
    case 'my courses': return <CoursesIcon />
    case 'exam prep': return <ExamPrepIcon />
    case 'take quiz': return <QuizzesIcon />
    case 'schedule': return <ScheduleIcon />
    case 'ask tutor': return <MessagesIcon />
    default: return null
  }
}

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
      <div className="welcome-banner" style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--brand-primary)',
        borderRadius: 0,
        boxShadow: '4px 4px 0px rgba(216, 168, 56, 0.1)',
        padding: '2.5rem'
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--brand-primary)', letterSpacing: '0.1em' }}>
          STUDENT LOG: IN-PROGRESS
        </span>
        <h2 className="welcome-banner-title" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 500, fontSize: '2rem', marginTop: '0.25rem' }}>
          Welcome back, <span style={{ fontStyle: 'italic', color: 'var(--brand-primary)' }}>{studentName}</span>!
        </h2>
        <p className="welcome-banner-text" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '0.5rem', maxWidth: '580px' }}>
          Prepare for your entrance exams by browsing syllabus-aligned lessons, completing chapter quizzes, and keeping up with live tutor schedules.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <h3 style={{ fontSize: 'var(--font-size-sm)', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Quick Operations
      </h3>
      <div className="quick-actions" style={{ marginBottom: '2.5rem' }}>
        {[
          { label: 'My Courses', href: '/student/courses' },
          { label: 'Exam Prep', href: '/student/exam-prep' },
          { label: 'Take Quiz', href: '/student/quizzes' },
          { label: 'Schedule', href: '/student/schedule' },
          { label: 'Ask Tutor', href: '/student/messages' }
        ].map((act, i) => (
          <Link key={i} href={act.href} className="quick-action" style={{ borderRadius: 0, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span className="quick-action-icon" style={{ display: 'flex', alignItems: 'center', color: 'var(--brand-primary)' }}>
              {getActionIcon(act.label)}
            </span>
            <span className="quick-action-label" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textTransform: 'uppercase', marginTop: '0.5rem' }}>{act.label}</span>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
        {[
          { label: 'Enrolled Courses', value: courses.length, code: 'STAT-ENR' },
          { label: "Today's Sessions", value: schedules.length, code: 'STAT-SCH' },
          { label: 'Pending Assignments', value: assignments.length, code: 'STAT-ASN' },
          { label: 'Quizzes Taken', value: recentQuizzes.length, code: 'STAT-QZ' }
        ].map((stat, i) => (
          <div key={i} className="stat-card" style={{ borderRadius: 0, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', flexDirection: 'column', gap: '0.5rem', padding: '1.25rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-tertiary)' }}>{stat.code}</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '100%' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{stat.label}</span>
              <span style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--brand-primary)' }}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Columns split */}
      <div className="content-grid" style={{ gap: '2.5rem', marginBottom: '3rem' }}>
        {/* Today's Schedule Card */}
        <div className="card-static" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card-header" style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: '0.75rem' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--font-size-base)', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
              <ScheduleSvgIcon size={16} /> Today's Schedule
            </h3>
            <Link href="/student/schedule" style={{ color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
              VIEW CALENDAR
            </Link>
          </div>
          {schedules.length === 0 ? (
            <div style={{ padding: '1.5rem 0', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)', margin: 0 }}>No sessions scheduled for today</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {schedules.map(s => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  background: 'rgba(255, 255, 255, 0.01)',
                  border: '1px solid var(--border-primary)',
                  borderLeft: '3px solid var(--brand-primary)'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                      {(s as any).courses?.title || (s.course as any)?.title}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      {s.start_time} - {s.end_time} • {(s as any).profiles?.full_name || 'Tutor'}
                    </div>
                  </div>
                  <span style={{
                    padding: '2px 6px',
                    fontSize: '9px',
                    fontFamily: 'var(--font-mono)',
                    border: '1px solid var(--brand-primary)',
                    color: 'var(--brand-primary)'
                  }}>LIVE</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Assignments Card */}
        <div className="card-static" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card-header" style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: '0.75rem' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--font-size-base)', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
              <AssignmentSvgIcon size={16} /> Pending Assignments
            </h3>
            <Link href="/student/assignments" style={{ color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
              VIEW ALL
            </Link>
          </div>
          {assignments.length === 0 ? (
            <div style={{ padding: '1.5rem 0', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)', margin: 0 }}>No pending assignments</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {assignments.map(a => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  background: 'rgba(255, 255, 255, 0.01)',
                  border: '1px solid var(--border-primary)'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{a.title}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {(a as any).courses?.title || (a.course as any)?.title}
                    </div>
                  </div>
                  {a.due_date && (
                    <span style={{
                      padding: '2px 6px',
                      fontSize: '9px',
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(216, 168, 56, 0.1)',
                      color: 'var(--brand-primary)',
                      border: '1px solid rgba(216, 168, 56, 0.2)'
                    }}>
                      DUE {new Date(a.due_date).toLocaleDateString()}
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-primary)', paddingBottom: '0.5rem' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 500, fontFamily: 'var(--font-heading)', margin: 0 }}>My Active Courses</h3>
          <Link href="/student/courses" style={{ color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            ALL COURSES →
          </Link>
        </div>
        {courses.length === 0 ? (
          <div className="empty-state" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 0 }}>
            <div className="empty-state-icon" style={{ display: 'inline-flex', color: 'var(--brand-primary)' }}>
              <CoursesIcon size={40} />
            </div>
            <div className="empty-state-title" style={{ fontFamily: 'var(--font-heading)', marginTop: '1rem' }}>No Enrolled Courses Yet</div>
            <div className="empty-state-text" style={{ fontSize: 'var(--font-size-sm)' }}>You haven&apos;t been registered for any classes. Contact your supervisor or teacher to get started.</div>
            <Link href="/student/messages" className="btn btn-primary btn-sm">Message Tutor</Link>
          </div>
        ) : (
          <div className="course-grid">
            {courses.slice(0, 3).map(course => (
              <Link key={course.id} href={`/student/courses/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="course-card" style={{ borderRadius: 0, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
                  <div className="course-card-header" style={{
                    background: 'rgba(216, 168, 56, 0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2.5rem 1rem',
                    borderBottom: '1px solid var(--border-primary)',
                    borderRadius: 0
                  }}>
                    {getCourseIcon(course.title)}
                  </div>
                  <div className="course-card-body" style={{ padding: '1.25rem' }}>
                    <div className="course-card-title" style={{ fontWeight: 600, fontSize: 'var(--font-size-base)', marginBottom: '0.375rem', fontFamily: 'var(--font-heading)' }}>
                      {course.title}
                    </div>
                    <div className="course-card-meta" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      <span>GRADE {course.grade_level} SYLLABUS</span>
                    </div>
                    <div className="progress-bar-container" style={{ height: '4px', background: 'var(--bg-glass)', borderRadius: 0 }}>
                      <div className="progress-bar-fill" style={{ width: '45%', background: 'var(--brand-primary)', borderRadius: 0 }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginTop: '0.5rem', fontWeight: 600 }}>
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
