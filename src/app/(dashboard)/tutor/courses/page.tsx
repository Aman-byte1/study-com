'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Course } from '@/lib/types'

export default function TutorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('courses')
        .select('*, subjects(name, icon_url), enrollments(count), lessons(count)')
        .eq('tutor_id', user.id)

      if (data) setCourses(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h2>My Courses</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Manage your courses and content</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <div className="empty-state-title">No courses assigned</div>
          <div className="empty-state-text">Ask your admin to create and assign courses to you.</div>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course, i) => (
            <Link key={course.id} href={`/tutor/courses/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={`course-card animate-fade-in-up stagger-${(i % 6) + 1}`}>
                <div className="course-card-header">
                  {(course.subject as unknown as { icon_url: string })?.icon_url || '📖'}
                </div>
                <div className="course-card-body">
                  <div className="course-card-title">{course.title}</div>
                  <div className="course-card-meta">
                    <span>{(course.subject as unknown as { name: string })?.name}</span>
                    <span>•</span>
                    <span>Grade {course.grade_level}</span>
                  </div>
                  <div className="course-card-footer">
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                      🎓 {(course.enrollments as unknown as { count: number }[])?.[0]?.count || 0} students
                    </span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                      🎥 {(course.lessons as unknown as { count: number }[])?.[0]?.count || 0} lessons
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
