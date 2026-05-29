'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Stats {
  students: number; tutors: number; parents: number;
  courses: number; lessons: number; quizzes: number;
  assignments: number; submissions: number; messages: number;
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats>({ students: 0, tutors: 0, parents: 0, courses: 0, lessons: 0, quizzes: 0, assignments: 0, submissions: 0, messages: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const results = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'tutor'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'parent'),
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('lessons').select('id', { count: 'exact', head: true }),
        supabase.from('quizzes').select('id', { count: 'exact', head: true }),
        supabase.from('assignments').select('id', { count: 'exact', head: true }),
        supabase.from('submissions').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }),
      ])

      setStats({
        students: results[0].count || 0, tutors: results[1].count || 0, parents: results[2].count || 0,
        courses: results[3].count || 0, lessons: results[4].count || 0, quizzes: results[5].count || 0,
        assignments: results[6].count || 0, submissions: results[7].count || 0, messages: results[8].count || 0,
      })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  const items = [
    { label: 'Students', value: stats.students, icon: '🎓', color: 'purple' },
    { label: 'Tutors', value: stats.tutors, icon: '👩‍🏫', color: 'teal' },
    { label: 'Parents', value: stats.parents, icon: '👨‍👩‍👧', color: 'pink' },
    { label: 'Courses', value: stats.courses, icon: '📚', color: 'yellow' },
    { label: 'Lessons', value: stats.lessons, icon: '🎥', color: 'green' },
    { label: 'Quizzes', value: stats.quizzes, icon: '❓', color: 'blue' },
    { label: 'Assignments', value: stats.assignments, icon: '📝', color: 'purple' },
    { label: 'Submissions', value: stats.submissions, icon: '📤', color: 'teal' },
    { label: 'Messages', value: stats.messages, icon: '💬', color: 'pink' },
  ]

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '2rem' }}>Platform Analytics</h2>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {items.map((item, i) => (
          <div key={i} className={`stat-card animate-fade-in-up stagger-${(i % 6) + 1}`}>
            <div className={`stat-icon stat-icon-${item.color}`}>{item.icon}</div>
            <div className="stat-info">
              <div className="stat-label">{item.label}</div>
              <div className="stat-value">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-static" style={{ marginTop: '2rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>📊 Platform Health</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Student-to-Tutor Ratio</div>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>
              {stats.tutors > 0 ? (stats.students / stats.tutors).toFixed(1) : '0'}:1
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Avg Lessons per Course</div>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>
              {stats.courses > 0 ? (stats.lessons / stats.courses).toFixed(1) : '0'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Submission Rate</div>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>
              {stats.assignments > 0 && stats.students > 0 ? Math.round((stats.submissions / (stats.assignments * stats.students)) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
