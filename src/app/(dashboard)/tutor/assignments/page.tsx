'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Assignment, Submission, Course } from '@/lib/types'

export default function TutorAssignmentsPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [maxScore, setMaxScore] = useState('100')
  const [gradingSubmission, setGradingSubmission] = useState<string | null>(null)
  const [gradeScore, setGradeScore] = useState('')
  const [gradeFeedback, setGradeFeedback] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  async function loadData() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: courseData } = await supabase.from('courses').select('*, subjects(name)').eq('tutor_id', user.id)
    if (courseData) setCourses(courseData)

    const { data: assignData } = await supabase.from('assignments').select('*, courses(title)').eq('tutor_id', user.id).order('created_at', { ascending: false })
    if (assignData) setAssignments(assignData)

    const assignmentIds = (assignData || []).map(a => a.id)
    if (assignmentIds.length > 0) {
      const { data: subData } = await supabase
        .from('submissions')
        .select('*, profiles!submissions_student_id_fkey(full_name), assignments(title)')
        .in('assignment_id', assignmentIds)
        .order('submitted_at', { ascending: false })
      if (subData) setSubmissions(subData)
    }

    setLoading(false)
  }

  useEffect(() => { loadData() }, []) // eslint-disable-line

  const createAssignment = async () => {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('assignments').insert({
      course_id: selectedCourse,
      tutor_id: user.id,
      title,
      description: description || null,
      due_date: dueDate || null,
      max_score: parseInt(maxScore) || 100,
    })

    setTitle(''); setDescription(''); setDueDate(''); setMaxScore('100'); setSelectedCourse(''); setShowCreate(false)
    setSaving(false)
    loadData()
  }

  const gradeSubmission = async (submissionId: string) => {
    const supabase = createClient()
    await supabase.from('submissions').update({
      score: parseInt(gradeScore),
      feedback: gradeFeedback || null,
      graded_at: new Date().toISOString(),
    }).eq('id', submissionId)

    setGradingSubmission(null); setGradeScore(''); setGradeFeedback('')
    loadData()
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2>Assignments</h2>
        <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? 'Cancel' : '+ Create Assignment'}
        </button>
      </div>

      {showCreate && (
        <div className="card-static animate-scale-in" style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>New Assignment</h4>
          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <label className="input-label">Course *</label>
            <select className="input select" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
              <option value="">Select course...</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <label className="input-label">Title *</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Assignment title..." />
          </div>
          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <label className="input-label">Description</label>
            <textarea className="input textarea" value={description} onChange={e => setDescription(e.target.value)} placeholder="Instructions..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="input-group">
              <label className="input-label">Due Date</label>
              <input className="input" type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Max Score</label>
              <input className="input" type="number" value={maxScore} onChange={e => setMaxScore(e.target.value)} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={createAssignment} disabled={saving || !selectedCourse || !title.trim()}>
            {saving ? 'Creating...' : 'Create Assignment'}
          </button>
        </div>
      )}

      {/* Submissions to grade */}
      <h3 style={{ marginBottom: '1rem' }}>Submissions ({submissions.filter(s => s.score === null).length} ungraded)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {submissions.length === 0 ? (
          <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>No submissions yet</p>
        ) : submissions.map(s => (
          <div key={s.id} className="card-static">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{(s.assignment as unknown as { title: string })?.title}</div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                  by {(s.student as unknown as { full_name: string })?.full_name} • {new Date(s.submitted_at).toLocaleDateString()}
                </div>
                {s.content && <p style={{ fontSize: 'var(--font-size-sm)', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{s.content}</p>}
              </div>
              {s.score !== null ? (
                <span className="badge badge-success">Graded: {s.score}</span>
              ) : (
                <button className="btn btn-primary btn-sm" onClick={() => setGradingSubmission(gradingSubmission === s.id ? null : s.id)}>
                  Grade
                </button>
              )}
            </div>
            {gradingSubmission === s.id && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                <div className="input-group" style={{ flex: 0 }}>
                  <label className="input-label">Score</label>
                  <input className="input" type="number" style={{ width: 100 }} value={gradeScore} onChange={e => setGradeScore(e.target.value)} />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Feedback</label>
                  <input className="input" value={gradeFeedback} onChange={e => setGradeFeedback(e.target.value)} placeholder="Optional feedback..." />
                </div>
                <button className="btn btn-success btn-sm" onClick={() => gradeSubmission(s.id)} disabled={!gradeScore}>Save</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* All assignments */}
      <h3 style={{ marginBottom: '1rem' }}>All Assignments ({assignments.length})</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {assignments.map(a => (
          <div key={a.id} className="card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{a.title}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                {(a.course as unknown as { title: string })?.title} • Max: {a.max_score}
              </div>
            </div>
            {a.due_date && <span className="badge badge-warning">Due {new Date(a.due_date).toLocaleDateString()}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
