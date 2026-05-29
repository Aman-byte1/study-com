'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface GradeEntry { assignmentTitle: string; courseName: string; score: number | null; maxScore: number; date: string; type: 'assignment' | 'quiz' }

export default function ParentGradesPage() {
  const [grades, setGrades] = useState<GradeEntry[]>([])
  const [childName, setChildName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: kids } = await supabase.from('profiles').select('id, full_name').eq('parent_id', user.id).eq('role', 'student')
      if (!kids || kids.length === 0) { setLoading(false); return }

      const child = kids[0]
      setChildName(child.full_name)

      // Assignment grades
      const { data: subs } = await supabase
        .from('submissions')
        .select('score, submitted_at, assignments(title, max_score, courses(title))')
        .eq('student_id', child.id)
        .not('score', 'is', null)
        .order('submitted_at', { ascending: false })

      const assignmentGrades: GradeEntry[] = (subs || []).map((s: Record<string, unknown>) => {
        const assignment = s.assignments as unknown as { title: string; max_score: number; courses: { title: string } }
        return {
          assignmentTitle: assignment?.title || '',
          courseName: assignment?.courses?.title || '',
          score: s.score as number,
          maxScore: assignment?.max_score || 100,
          date: s.submitted_at as string,
          type: 'assignment' as const,
        }
      })

      // Quiz grades
      const { data: quizAttempts } = await supabase
        .from('quiz_attempts')
        .select('score, total_points, completed_at, quizzes(title, courses(title))')
        .eq('student_id', child.id)
        .not('score', 'is', null)
        .order('completed_at', { ascending: false })

      const quizGrades: GradeEntry[] = (quizAttempts || []).map((q: Record<string, unknown>) => {
        const quiz = q.quizzes as unknown as { title: string; courses: { title: string } }
        return {
          assignmentTitle: quiz?.title || '',
          courseName: quiz?.courses?.title || '',
          score: q.score as number,
          maxScore: q.total_points as number || 100,
          date: q.completed_at as string || '',
          type: 'quiz' as const,
        }
      })

      setGrades([...assignmentGrades, ...quizGrades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '0.5rem' }}>Grades</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        {childName ? `${childName}'s` : 'Your child\'s'} assignment and quiz scores
      </p>

      {grades.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏆</div>
          <div className="empty-state-title">No grades yet</div>
          <div className="empty-state-text">Grades will appear here once assignments and quizzes are completed.</div>
        </div>
      ) : (
        <div className="card-static" style={{ overflow: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Course</th>
                <th>Type</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g, i) => {
                const pct = g.score !== null && g.maxScore > 0 ? Math.round((g.score / g.maxScore) * 100) : 0
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{g.assignmentTitle}</td>
                    <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{g.courseName}</td>
                    <td><span className={`badge ${g.type === 'quiz' ? 'badge-info' : 'badge-primary'}`}>{g.type}</span></td>
                    <td style={{ fontWeight: 700 }}>{g.score}/{g.maxScore}</td>
                    <td>
                      <span className={`badge ${pct >= 70 ? 'badge-success' : pct >= 50 ? 'badge-warning' : 'badge-danger'}`}>
                        {pct}%
                      </span>
                    </td>
                    <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                      {g.date ? new Date(g.date).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
