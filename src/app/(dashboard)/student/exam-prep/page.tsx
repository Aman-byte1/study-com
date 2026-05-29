'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Quiz, QuizAttempt } from '@/lib/types'

export default function ExamPrepPage() {
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
          .select('*, courses(title, subjects(name))')
          .in('course_id', courseIds)
          .eq('is_exam_prep', true)
          .order('created_at', { ascending: false })

        const { data: attempts } = await supabase
          .from('quiz_attempts')
          .select('*')
          .eq('student_id', user.id)

        if (quizData) {
          setQuizzes(quizData.map(q => ({
            ...q,
            myAttempt: attempts?.find((a: QuizAttempt) => a.quiz_id === q.id),
          })))
        }
      }

      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '2rem' }}>🇪🇹</span>
          <h2>National Exam Preparation</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Practice quizzes modeled after the Ethiopian University Entrance Exam (EUEE) for Grade 9-12.
        </p>
      </div>

      <div style={{
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.1) 0%, rgba(0, 206, 201, 0.05) 100%)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-brand)',
        marginBottom: '2rem',
      }}>
        <h4 style={{ marginBottom: '0.5rem' }}>💡 Tips for Success</h4>
        <ul style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>Complete all practice quizzes to identify weak areas</li>
          <li>Review incorrect answers carefully to understand the concepts</li>
          <li>Use the timer to practice under exam conditions</li>
          <li>Focus on subjects where you score below 70%</li>
        </ul>
      </div>

      {quizzes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎯</div>
          <div className="empty-state-title">No exam prep quizzes yet</div>
          <div className="empty-state-text">Exam preparation quizzes will appear here when your tutors create them.</div>
        </div>
      ) : (
        <div className="course-grid">
          {quizzes.map((quiz, i) => (
            <Link key={quiz.id} href={`/student/quizzes/${quiz.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={`card animate-fade-in-up stagger-${(i % 6) + 1}`}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>🎯</span>
                  {quiz.myAttempt ? (
                    <span className={`badge ${(quiz.myAttempt.score || 0) / (quiz.myAttempt.total_points || 1) >= 0.7 ? 'badge-success' : 'badge-danger'}`}>
                      {quiz.myAttempt.score}/{quiz.myAttempt.total_points}
                    </span>
                  ) : (
                    <span className="badge badge-primary">Not attempted</span>
                  )}
                </div>
                <h4 style={{ marginBottom: '0.5rem' }}>{quiz.title}</h4>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                  {(quiz.course as unknown as { title: string })?.title}
                </div>
                {quiz.time_limit_minutes && (
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
                    ⏱ {quiz.time_limit_minutes} minutes
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
