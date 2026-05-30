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
          { label: 'My Courses', icon: '📚', href: '/student/courses' },
          { label: 'Exam Prep', icon: '🎯', href: '/student/exam-prep' },
          { label: 'Take Quiz', icon: '❓', href: '/student/quizzes' },
          { label: 'Schedule', icon: '📅', href: '/student/schedule' },
          { label: 'Ask Tutor', icon: '💬', href: '/student/messages' }
        ].map((act, i) => (
          <Link key={i} href={act.href} className="quick-action" style={{ borderRadius: 0, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
            <span className="quick-action-icon">{act.icon}</span>
            <span className="quick-action-label" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textTransform: 'uppercase' }}>{act.label}</span>
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
              📅 Today&apos;s Schedule
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
              📝 Pending Assignments
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
            <div className="empty-state-icon">📚</div>
            <div className="empty-state-title" style={{ fontFamily: 'var(--font-heading)' }}>No Enrolled Courses Yet</div>
            <div className="empty-state-text" style={{ fontSize: 'var(--font-size-sm)' }}>You haven&apos;t been registered for any classes. Contact your supervisor or teacher to get started.</div>
            <Link href="/student/messages" className="btn btn-primary btn-sm">Message Tutor</Link>
          </div>
        ) : (
          <div className="course-grid">
            {courses.slice(0, 3).map(course => (
              <Link key={course.id} href={`/student/courses/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="course-card" style={{ borderRadius: 0, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
                  <div className="course-card-header" style={{
                    fontSize: '2rem',
                    background: 'rgba(216, 168, 56, 0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2.5rem 1rem',
                    borderBottom: '1px solid var(--border-primary)',
                    borderRadius: 0
                  }}>
                    {course.title.toLowerCase().includes('math') ? '📐' : 
                     course.title.toLowerCase().includes('phys') ? '⚛️' :
                     course.title.toLowerCase().includes('chem') ? '🧪' :
                     course.title.toLowerCase().includes('biol') ? '🧬' :
                     course.title.toLowerCase().includes('engl') ? '🗣️' : '📖'}
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
