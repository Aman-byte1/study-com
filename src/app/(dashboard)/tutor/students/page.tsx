'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

export default function TutorStudentsPage() {
  const [students, setStudents] = useState<(Profile & { courses: string[] })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: courses } = await supabase.from('courses').select('id, title').eq('tutor_id', user.id)
      if (!courses) { setLoading(false); return }

      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('student_id, course_id, profiles!enrollments_student_id_fkey(id, full_name, grade_level, avatar_url, role)')
        .in('course_id', courses.map(c => c.id))

      if (enrollments) {
        const studentMap = new Map<string, Profile & { courses: string[] }>()
        enrollments.forEach((e: Record<string, unknown>) => {
          const profile = e.profiles as unknown as Profile
          if (!profile) return
          const courseTitle = courses.find(c => c.id === e.course_id)?.title || ''
          if (studentMap.has(profile.id)) {
            studentMap.get(profile.id)!.courses.push(courseTitle)
          } else {
            studentMap.set(profile.id, { ...profile, courses: [courseTitle] })
          }
        })
        setStudents(Array.from(studentMap.values()))
      }

      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '0.5rem' }}>My Students</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{students.length} students enrolled</p>

      {students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎓</div>
          <div className="empty-state-title">No students yet</div>
          <div className="empty-state-text">Students will appear here when they enroll in your courses.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {students.map((s, i) => (
            <div key={s.id} className={`card animate-fade-in-up stagger-${(i % 6) + 1}`} style={{ cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div className="avatar">
                  {s.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{s.full_name}</div>
                  <span className="badge badge-primary">Grade {s.grade_level}</span>
                </div>
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Enrolled in:</div>
                {s.courses.map((c, ci) => (
                  <div key={ci}>• {c}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
