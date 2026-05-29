'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Quiz, QuizAttempt } from '@/lib/types'

export default function StudentQuizzesPage() {
  const [quizzes, setQuizzes] = useState<(Quiz & { myAttempt?: QuizAttempt })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('student_id', user.id)

      const courseIds = (enrollments || []).map((e: { course_id: string }) => e.course_id)

      if (courseIds.length > 0) {
        const { data: quizData } = await supabase
          .from('quizzes')
          .select('*, courses(title)')
          .in('course_id', courseIds)
          .eq('is_exam_prep', false)
          .order('created_at', { ascending: false })

        const { data: attempts } = await supabase
          .from('quiz_attempts')
          .select('*')
          .eq('student_id', user.id)

        if (quizData) {
          const enriched = quizData.map(q => ({
            ...q,
            myAttempt: attempts?.find((a: QuizAttempt) => a.quiz_id === q.id),
          }))
          setQuizzes(enriched)
        }
      }

      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '0.5rem' }}>Quizzes</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Test your knowledge with course quizzes</p>

      {quizzes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">❓</div>
          <div className="empty-state-title">No quizzes available</div>
          <div className="empty-state-text">Quizzes will appear here when your tutors create them.</div>
        </div>
      ) : (
        <div className="course-grid">
          {quizzes.map((quiz, i) => (
            <Link key={quiz.id} href={`/student/quizzes/${quiz.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={`card animate-fade-in-up stagger-${(i % 6) + 1}`}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>📋</span>
                  {quiz.myAttempt ? (
                    <span className="badge badge-success">Score: {quiz.myAttempt.score}/{quiz.myAttempt.total_points}</span>
                  ) : (
                    <span className="badge badge-primary">New</span>
                  )}
                </div>
                <h4 style={{ marginBottom: '0.5rem' }}>{quiz.title}</h4>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  {(quiz.course as unknown as { title: string })?.title}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                  {quiz.time_limit_minutes && <span>⏱ {quiz.time_limit_minutes} min</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
