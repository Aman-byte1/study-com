'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Assignment, Submission } from '@/lib/types'

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<(Assignment & { mySubmission?: Submission })[]>([])
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null)
  const [submissionText, setSubmissionText] = useState('')
  const [submitting, setSubmitting] = useState(false)
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
        const { data: assigns } = await supabase
          .from('assignments')
          .select('*, courses(title)')
          .in('course_id', courseIds)
          .order('due_date', { ascending: true })

        const { data: subs } = await supabase
          .from('submissions')
          .select('*')
          .eq('student_id', user.id)

        if (assigns) {
          const enriched = assigns.map(a => ({
            ...a,
            mySubmission: subs?.find((s: Submission) => s.assignment_id === a.id),
          }))
          setAssignments(enriched)
        }
      }

      setLoading(false)
    }
    load()
  }, [])

  const handleSubmit = async (assignmentId: string) => {
    setSubmitting(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('submissions').insert({
      assignment_id: assignmentId,
      student_id: user.id,
      content: submissionText,
    })

    setSubmissionText('')
    setSelectedAssignment(null)
    setSubmitting(false)
    window.location.reload()
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '0.5rem' }}>Assignments</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>View and submit your assignments</p>

      {assignments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-title">No assignments</div>
          <div className="empty-state-text">You don&apos;t have any assignments yet.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {assignments.map(a => (
            <div key={a.id} className="card-static">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: '0.25rem' }}>{a.title}</h4>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {(a.course as unknown as { title: string })?.title}
                  </div>
                  {a.description && (
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {a.description}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {a.mySubmission ? (
                    a.mySubmission.score !== null ? (
                      <div>
                        <span className="badge badge-success">Graded</span>
                        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--brand-success)', marginTop: '0.5rem' }}>
                          {a.mySubmission.score}/{a.max_score}
                        </div>
                        {a.mySubmission.feedback && (
                          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '0.25rem', maxWidth: 200 }}>
                            {a.mySubmission.feedback}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="badge badge-info">Submitted</span>
                    )
                  ) : (
                    <div>
                      {a.due_date && (
                        <span className="badge badge-warning" style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>
                          Due {new Date(a.due_date).toLocaleDateString()}
                        </span>
                      )}
                      <br />
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setSelectedAssignment(selectedAssignment === a.id ? null : a.id)}
                        style={{ marginTop: '0.5rem' }}
                      >
                        Submit
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submission form */}
              {selectedAssignment === a.id && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-primary)' }}>
                  <div className="input-group" style={{ marginBottom: '1rem' }}>
                    <label className="input-label">Your Answer</label>
                    <textarea
                      className="input textarea"
                      placeholder="Type your answer here..."
                      value={submissionText}
                      onChange={e => setSubmissionText(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-primary" onClick={() => handleSubmit(a.id)} disabled={submitting || !submissionText.trim()}>
                      {submitting ? 'Submitting...' : 'Submit Assignment'}
                    </button>
                    <button className="btn btn-ghost" onClick={() => setSelectedAssignment(null)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
