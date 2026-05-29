'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Quiz, QuizQuestion } from '@/lib/types'

export default function TakeQuizPage() {
  const { quizId } = useParams()
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [totalPoints, setTotalPoints] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()

      const { data: quizData } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single()

      if (quizData) {
        setQuiz(quizData)
        if (quizData.time_limit_minutes) {
          setTimeLeft(quizData.time_limit_minutes * 60)
        }
      }

      const { data: questionData } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order_index', { ascending: true })

      if (questionData) {
        setQuestions(questionData)
        setTotalPoints(questionData.reduce((acc: number, q: QuizQuestion) => acc + q.points, 0))
      }

      setLoading(false)
    }
    load()
  }, [quizId])

  // Timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, submitted])

  const handleSubmit = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let earnedScore = 0
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) {
        earnedScore += q.points
      }
    })

    await supabase.from('quiz_attempts').insert({
      quiz_id: quizId as string,
      student_id: user.id,
      answers,
      score: earnedScore,
      total_points: totalPoints,
      completed_at: new Date().toISOString(),
    })

    setScore(earnedScore)
    setSubmitted(true)
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>
  if (!quiz) return <div className="empty-state"><div className="empty-state-title">Quiz not found</div></div>

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div className="animate-fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div className="card-static" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>{quiz.title}</h2>
          <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '0.25rem' }}>
            {questions.length} questions • {totalPoints} points
          </div>
        </div>
        {timeLeft !== null && !submitted && (
          <div style={{
            padding: '0.5rem 1rem',
            background: timeLeft < 60 ? 'rgba(255, 107, 107, 0.15)' : 'rgba(108, 92, 231, 0.15)',
            borderRadius: 'var(--radius-lg)',
            fontWeight: 700, fontSize: 'var(--font-size-xl)',
            color: timeLeft < 60 ? 'var(--brand-danger)' : 'var(--brand-primary-light)',
          }}>
            ⏱ {formatTime(timeLeft)}
          </div>
        )}
        {submitted && score !== null && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 900, color: score / totalPoints >= 0.7 ? 'var(--brand-success)' : 'var(--brand-danger)' }}>
              {score}/{totalPoints}
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              {Math.round((score / totalPoints) * 100)}%
            </div>
          </div>
        )}
      </div>

      {/* Questions */}
      {questions.map((q, i) => {
        const isCorrect = submitted && answers[q.id] === q.correct_answer
        const isWrong = submitted && answers[q.id] !== q.correct_answer && answers[q.id]

        return (
          <div key={q.id} className={`quiz-question animate-fade-in-up stagger-${(i % 6) + 1}`}>
            <div className="quiz-question-number">Question {i + 1} of {questions.length} • {q.points} pt{q.points > 1 ? 's' : ''}</div>
            <div className="quiz-question-text">{q.question_text}</div>
            <div className="quiz-options">
              {(q.options || []).map((option: string, j: number) => {
                const letter = String.fromCharCode(65 + j)
                const isSelected = answers[q.id] === option
                let className = 'quiz-option'
                if (submitted) {
                  if (option === q.correct_answer) className += ' correct'
                  else if (isSelected && isWrong) className += ' incorrect'
                } else if (isSelected) {
                  className += ' selected'
                }

                return (
                  <div
                    key={j}
                    className={className}
                    onClick={() => {
                      if (!submitted) setAnswers({ ...answers, [q.id]: option })
                    }}
                  >
                    <div className="quiz-option-letter">{letter}</div>
                    <span>{option}</span>
                    {submitted && option === q.correct_answer && <span style={{ marginLeft: 'auto', color: 'var(--brand-success)' }}>✓</span>}
                    {submitted && isSelected && isWrong && option !== q.correct_answer && <span style={{ marginLeft: 'auto', color: 'var(--brand-danger)' }}>✗</span>}
                  </div>
                )
              })}
            </div>
            {submitted && isCorrect && <div style={{ marginTop: '0.75rem', color: 'var(--brand-success)', fontSize: 'var(--font-size-sm)' }}>✓ Correct!</div>}
            {submitted && isWrong && <div style={{ marginTop: '0.75rem', color: 'var(--brand-danger)', fontSize: 'var(--font-size-sm)' }}>✗ Incorrect. Correct answer: {q.correct_answer}</div>}
          </div>
        )
      })}

      {/* Submit / Back */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center' }}>
        {!submitted ? (
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length === 0}
          >
            Submit Quiz
          </button>
        ) : (
          <button className="btn btn-secondary btn-lg" onClick={() => router.back()}>
            ← Back to Quizzes
          </button>
        )}
      </div>
    </div>
  )
}
