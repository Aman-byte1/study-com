'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Course } from '@/lib/types'

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('enrollments')
        .select('courses(*, subjects(name, icon_url))')
        .eq('student_id', user.id)

      if (data) {
        setCourses(data.map((e: Record<string, unknown>) => e.courses as unknown as Course))
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>My Courses</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Access your enrolled courses, video lessons, and study materials
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <div className="empty-state-title">No courses yet</div>
          <div className="empty-state-text">You haven&apos;t been enrolled in any courses. Contact your admin or tutor.</div>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course, i) => (
            <Link key={course.id} href={`/student/courses/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={`course-card animate-fade-in-up stagger-${(i % 6) + 1}`}>
                <div className="course-card-header" style={{
                  background: `linear-gradient(135deg, rgba(${108 + i * 20}, ${92 + i * 15}, 231, 0.3) 0%, rgba(0, 206, 201, 0.1) 100%)`,
                }}>
                  {(course.subject as unknown as { icon_url: string })?.icon_url || '📖'}
                </div>
                <div className="course-card-body">
                  <div className="course-card-title">{course.title}</div>
                  <div className="course-card-meta">
                    <span>{(course.subject as unknown as { name: string })?.name}</span>
                    <span>•</span>
                    <span>Grade {course.grade_level}</span>
                  </div>
                  <div className="progress-bar-container" style={{ marginTop: '0.5rem' }}>
                    <div className="progress-bar-fill" style={{ width: '0%' }} />
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
                    0% complete
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
