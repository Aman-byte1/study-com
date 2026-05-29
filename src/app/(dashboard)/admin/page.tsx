'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

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
        <div className="stat-card animate-fade-in-up stagger-1">
          <div className="stat-icon stat-icon-purple">🎓</div>
          <div className="stat-info">
            <div className="stat-label">Students</div>
            <div className="stat-value">{stats.totalStudents}</div>
          </div>
        </div>
        <div className="stat-card animate-fade-in-up stagger-2">
          <div className="stat-icon stat-icon-teal">👩‍🏫</div>
          <div className="stat-info">
            <div className="stat-label">Tutors</div>
            <div className="stat-value">{stats.totalTutors}</div>
          </div>
        </div>
        <div className="stat-card animate-fade-in-up stagger-3">
          <div className="stat-icon stat-icon-pink">👨‍👩‍👧</div>
          <div className="stat-info">
            <div className="stat-label">Parents</div>
            <div className="stat-value">{stats.totalParents}</div>
          </div>
        </div>
        <div className="stat-card animate-fade-in-up stagger-4">
          <div className="stat-icon stat-icon-yellow">📚</div>
          <div className="stat-info">
            <div className="stat-label">Courses</div>
            <div className="stat-value">{stats.totalCourses}</div>
          </div>
        </div>
        <div className="stat-card animate-fade-in-up stagger-5">
          <div className="stat-icon stat-icon-green">🎥</div>
          <div className="stat-info">
            <div className="stat-label">Lessons</div>
            <div className="stat-value">{stats.totalLessons}</div>
          </div>
        </div>
        <div className="stat-card animate-fade-in-up stagger-6">
          <div className="stat-icon stat-icon-blue">❓</div>
          <div className="stat-info">
            <div className="stat-label">Quizzes</div>
            <div className="stat-value">{stats.totalQuizzes}</div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        {/* Quick Actions */}
        <div className="card-static animate-fade-in-up">
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>⚡ Admin Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link href="/admin/users" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              👥 Manage Users
            </Link>
            <Link href="/admin/courses" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              📚 Manage Courses
            </Link>
            <Link href="/admin/content" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              📁 Upload Content
            </Link>
            <Link href="/admin/schedules" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              📅 View Schedules
            </Link>
            <Link href="/admin/analytics" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              📊 Analytics
            </Link>
          </div>
        </div>

        {/* Recent Users */}
        <div className="card-static animate-fade-in-up">
          <div className="card-header">
            <h3 className="card-title">👥 Recent Users</h3>
            <Link href="/admin/users" className="btn btn-ghost btn-sm">View All</Link>
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
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
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
