'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Course } from '@/lib/types'

export default function TutorQuizzesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [timeLimit, setTimeLimit] = useState('')
  const [isExamPrep, setIsExamPrep] = useState(false)
  const [questions, setQuestions] = useState<{ text: string; options: string[]; correct: string }[]>([
    { text: '', options: ['', '', '', ''], correct: '' },
  ])
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('courses').select('*, subjects(name)').eq('tutor_id', user.id)
      if (data) setCourses(data)
      setLoading(false)
    }
    load()
  }, [])

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correct: '' }])
  }

  const updateQuestion = (index: number, field: string, value: string) => {
    const updated = [...questions]
    if (field === 'text') updated[index].text = value
    else if (field === 'correct') updated[index].correct = value
    setQuestions(updated)
  }

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions]
    updated[qIndex].options[oIndex] = value
    setQuestions(updated)
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const handleCreate = async () => {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: quiz } = await supabase.from('quizzes').insert({
      course_id: selectedCourse,
      tutor_id: user.id,
      title,
      description: description || null,
      time_limit_minutes: timeLimit ? parseInt(timeLimit) : null,
      is_exam_prep: isExamPrep,
    }).select().single()

    if (quiz) {
      const questionsToInsert = questions.filter(q => q.text.trim()).map((q, i) => ({
        quiz_id: quiz.id,
        question_text: q.text,
        options: q.options.filter(o => o.trim()),
        correct_answer: q.correct,
        order_index: i,
      }))

      await supabase.from('quiz_questions').insert(questionsToInsert)
    }

    setSuccess('Quiz created successfully!')
    setShowCreate(false)
    setTitle(''); setDescription(''); setTimeLimit(''); setIsExamPrep(false)
    setQuestions([{ text: '', options: ['', '', '', ''], correct: '' }])
    setSaving(false)
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2>Quizzes</h2>
        <button className="btn btn-primary" onClick={() => { setShowCreate(!showCreate); setSuccess('') }}>
          {showCreate ? 'Cancel' : '+ Create Quiz'}
        </button>
      </div>

      {success && (
        <div style={{
          padding: '1rem', background: 'rgba(0, 184, 148, 0.1)',
          border: '1px solid rgba(0, 184, 148, 0.3)', borderRadius: 'var(--radius-lg)',
          color: 'var(--brand-success)', marginBottom: '1.5rem',
        }}>✅ {success}</div>
      )}

      {showCreate && (
        <div className="card-static animate-scale-in" style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1.5rem' }}>Create New Quiz</h4>

          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <label className="input-label">Course *</label>
            <select className="input select" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
              <option value="">Select course...</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>

          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <label className="input-label">Quiz Title *</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Chapter 1 Review" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Time Limit (minutes)</label>
              <input className="input" type="number" value={timeLimit} onChange={e => setTimeLimit(e.target.value)} placeholder="30" />
            </div>
            <div className="input-group">
              <label className="input-label">Type</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.5rem' }}>
                <input type="checkbox" checked={isExamPrep} onChange={e => setIsExamPrep(e.target.checked)} />
                <span style={{ fontSize: 'var(--font-size-sm)' }}>🎯 National Exam Prep</span>
              </label>
            </div>
          </div>

          <h5 style={{ marginBottom: '1rem', marginTop: '1.5rem' }}>Questions</h5>
          {questions.map((q, qi) => (
            <div key={qi} style={{
              padding: '1.5rem', background: 'var(--bg-glass)',
              borderRadius: 'var(--radius-lg)', marginBottom: '1rem',
              border: '1px solid var(--border-secondary)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Question {qi + 1}</span>
                {questions.length > 1 && (
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--brand-danger)' }} onClick={() => removeQuestion(qi)}>Remove</button>
                )}
              </div>
              <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                <input className="input" value={q.text} onChange={e => updateQuestion(qi, 'text', e.target.value)} placeholder="Question text..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {q.options.map((opt, oi) => (
                  <input key={oi} className="input" value={opt} onChange={e => updateOption(qi, oi, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                    style={{ fontSize: 'var(--font-size-sm)' }}
                  />
                ))}
              </div>
              <div className="input-group">
                <label className="input-label" style={{ fontSize: 'var(--font-size-xs)' }}>Correct Answer</label>
                <select className="input select" value={q.correct} onChange={e => updateQuestion(qi, 'correct', e.target.value)} style={{ fontSize: 'var(--font-size-sm)' }}>
                  <option value="">Select correct answer...</option>
                  {q.options.filter(o => o.trim()).map((opt, oi) => (
                    <option key={oi} value={opt}>{String.fromCharCode(65 + oi)}: {opt}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          <button className="btn btn-secondary" onClick={addQuestion} style={{ marginBottom: '1.5rem' }}>+ Add Question</button>
          <br />
          <button className="btn btn-primary btn-lg" onClick={handleCreate}
            disabled={saving || !selectedCourse || !title.trim() || questions.every(q => !q.text.trim())}
            style={{ width: '100%' }}>
            {saving ? 'Creating...' : 'Create Quiz'}
          </button>
        </div>
      )}

      {!showCreate && (
        <div className="empty-state">
          <div className="empty-state-icon">❓</div>
          <div className="empty-state-title">Create quizzes for your students</div>
          <div className="empty-state-text">Click &quot;Create Quiz&quot; to build a quiz with multiple choice questions.</div>
        </div>
      )}
    </div>
  )
}
