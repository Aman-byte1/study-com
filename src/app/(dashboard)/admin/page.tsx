'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useScrollReveal, useCountUp } from '@/lib/animation'

// ============================================
// CUSTOM ADMIN SVG ICONS
// ============================================
function StudentsIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  )
}

function TutorsIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function ParentsIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

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

function LessonsIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <rect x="2" y="3" width="20" height="14" />
      <path d="M10 8l5 3-5 3V8z" fill="var(--brand-primary)" />
    </svg>
  )
}

function QuizzesIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" />
    </svg>
  )
}

function UsersListIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  )
}

// ============================================
// ANIMATED STAT CARD
// ============================================
function AnimatedStatCard({ icon, label, value, code, delay }: { icon: React.ReactNode; label: string; value: number; code: string; delay: number }) {
  const [ref, visible] = useScrollReveal<HTMLDivElement>()
  const count = useCountUp(value, 2000, visible)

  return (
    <div ref={ref} className={`stat-card animate-fade-in-up stagger-${delay} ${visible ? 'visible' : ''}`} style={{ opacity: visible ? 1 : 0 }}>
      <div className="stat-icon" style={{ background: 'rgba(216, 168, 56, 0.08)', borderRadius: 0 }}>
        {icon}
      </div>
      <div className="stat-info">
        <div className="stat-label">{label}</div>
        <div className="stat-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem' }}>{count}</div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-tertiary)' }}>{code}</span>
      </div>
    </div>
  )
}

interface PlatformStats {
  totalStudents: number
  totalTutors: number
  totalParents: number
  totalCourses: number
  totalLessons: number
  totalQuizzes: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<PlatformStats>({
    totalStudents: 0, totalTutors: 0, totalParents: 0,
    totalCourses: 0, totalLessons: 0, totalQuizzes: 0,
  })
  const [recentUsers, setRecentUsers] = useState<{ id: string; full_name: string; role: string; created_at: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()

      // Counts
      const [students, tutors, parents, courses, lessons, quizzes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'tutor'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'parent'),
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('lessons').select('id', { count: 'exact', head: true }),
        supabase.from('quizzes').select('id', { count: 'exact', head: true }),
      ])

      setStats({
        totalStudents: students.count || 0,
        totalTutors: tutors.count || 0,
        totalParents: parents.count || 0,
        totalCourses: courses.count || 0,
        totalLessons: lessons.count || 0,
        totalQuizzes: quizzes.count || 0,
      })

      // Recent users
      const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name, role, created_at')
        .order('created_at', { ascending: false })
        .limit(8)

      if (users) setRecentUsers(users)

      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="animate-fade-in">
      {/* Stats */}
      <div className="stats-grid">
        <AnimatedStatCard icon={<StudentsIcon />} label="Students" value={stats.totalStudents} code="SYS-001" delay={1} />
        <AnimatedStatCard icon={<TutorsIcon />} label="Tutors" value={stats.totalTutors} code="SYS-002" delay={2} />
        <AnimatedStatCard icon={<ParentsIcon />} label="Parents" value={stats.totalParents} code="SYS-003" delay={3} />
        <AnimatedStatCard icon={<CoursesIcon />} label="Courses" value={stats.totalCourses} code="SYS-004" delay={4} />
        <AnimatedStatCard icon={<LessonsIcon />} label="Lessons" value={stats.totalLessons} code="SYS-005" delay={5} />
        <AnimatedStatCard icon={<QuizzesIcon />} label="Quizzes" value={stats.totalQuizzes} code="SYS-006" delay={6} />
      </div>

      <div className="content-grid">
        {/* Quick Actions */}
        <div className="card-static animate-fade-in-up">
          <h3 className="card-title" style={{ marginBottom: '1rem', fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-lg)', fontWeight: 500 }}>
            Admin Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link href="/admin/users" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <UsersListIcon /> MANAGE USERS
            </Link>
            <Link href="/admin/courses" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <CoursesIcon size={16} /> MANAGE COURSES
            </Link>
            <Link href="/admin/content" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <LessonsIcon size={16} /> UPLOAD CONTENT
            </Link>
            <Link href="/admin/schedules" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              VIEW SCHEDULES
            </Link>
            <Link href="/admin/analytics" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg>
              ANALYTICS
            </Link>
          </div>
        </div>

        {/* Recent Users */}
        <div className="card-static animate-fade-in-up">
          <div className="card-header">
            <h3 className="card-title" style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-lg)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UsersListIcon size={18} /> Recent Users
            </h3>
            <Link href="/admin/users" className="btn btn-ghost btn-sm" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>VIEW ALL</Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>{u.full_name}</td>
                  <td>
                    <span className={`badge ${
                      u.role === 'student' ? 'badge-primary' :
                      u.role === 'tutor' ? 'badge-success' :
                      u.role === 'parent' ? 'badge-info' : 'badge-warning'
                    }`} style={{ borderRadius: 0, fontFamily: 'var(--font-mono)', fontSize: '0.6rem' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
