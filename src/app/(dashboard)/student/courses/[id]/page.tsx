'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Course, Lesson, Note, Assignment } from '@/lib/types'

export default function CourseDetailPage() {
  const { id } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [activeTab, setActiveTab] = useState('lessons')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()

      const { data: courseData } = await supabase
        .from('courses')
        .select('*, subjects(name, icon_url), profiles!courses_tutor_id_fkey(full_name)')
        .eq('id', id)
        .single()

      if (courseData) setCourse(courseData)

      const { data: lessonData } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .order('order_index', { ascending: true })

      if (lessonData) setLessons(lessonData)

      const { data: noteData } = await supabase
        .from('notes')
        .select('*')
        .eq('course_id', id)
        .order('created_at', { ascending: false })

      if (noteData) setNotes(noteData)

      const { data: assignData } = await supabase
        .from('assignments')
        .select('*')
        .eq('course_id', id)
        .order('created_at', { ascending: false })

      if (assignData) setAssignments(assignData)

      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="loading-center"><div className="spinner" /></div>
  if (!course) return <div className="empty-state"><div className="empty-state-title">Course not found</div></div>

  return (
    <div className="animate-fade-in">
      {/* Course Header */}
      <div className="card-static" style={{
        marginBottom: '2rem',
        background: 'var(--gradient-card)',
        display: 'flex', alignItems: 'center', gap: '1.5rem',
        flexWrap: 'wrap',
      }}>
        <div style={{
          width: 72, height: 72,
          background: 'rgba(108, 92, 231, 0.15)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem',
        }}>
          {(course.subject as unknown as { icon_url: string })?.icon_url || '📖'}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h2 style={{ marginBottom: '0.5rem' }}>{course.title}</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            <span>📚 {(course.subject as unknown as { name: string })?.name}</span>
            <span>🎓 Grade {course.grade_level}</span>
            <span>👩‍🏫 {(course as unknown as { profiles: { full_name: string } }).profiles?.full_name}</span>
            <span>🎥 {lessons.length} lessons</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {['lessons', 'notes', 'assignments'].map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'lessons' && '🎥 '}
            {tab === 'notes' && '📄 '}
            {tab === 'assignments' && '📝 '}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="badge badge-primary" style={{ marginLeft: '0.5rem', fontSize: '0.65rem' }}>
              {tab === 'lessons' ? lessons.length : tab === 'notes' ? notes.length : assignments.length}
            </span>
          </button>
        ))}
      </div>

      {/* Lessons Tab */}
      {activeTab === 'lessons' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {lessons.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎥</div>
              <div className="empty-state-title">No lessons yet</div>
              <div className="empty-state-text">Your tutor hasn&apos;t uploaded any lessons yet.</div>
            </div>
          ) : lessons.map((lesson, i) => (
            <Link key={lesson.id} href={`/student/courses/${id}/lessons/${lesson.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={`card animate-fade-in-up stagger-${(i % 6) + 1}`} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem 1.5rem',
              }}>
                <div style={{
                  width: 40, height: 40,
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)',
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{lesson.title}</div>
                  {lesson.description && (
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      {lesson.description}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  {lesson.duration_minutes && (
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                      {lesson.duration_minutes} min
                    </span>
                  )}
                  <span style={{ color: 'var(--brand-primary-light)', fontSize: '1.25rem' }}>▶</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {notes.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <div className="empty-state-icon">📄</div>
              <div className="empty-state-title">No notes yet</div>
            </div>
          ) : notes.map(note => (
            <a key={note.id} href={note.file_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
                  {note.file_type === 'pdf' ? '📕' : note.file_type === 'image' ? '🖼️' : '📄'}
                </div>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', marginBottom: '0.25rem' }}>{note.title}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                  {new Date(note.created_at).toLocaleDateString()}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {assignments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <div className="empty-state-title">No assignments yet</div>
            </div>
          ) : assignments.map(a => (
            <Link key={a.id} href={`/student/assignments?id=${a.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{a.title}</div>
                  {a.description && (
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      {a.description.slice(0, 100)}...
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {a.due_date && (
                    <span className="badge badge-warning">Due {new Date(a.due_date).toLocaleDateString()}</span>
                  )}
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                    Max score: {a.max_score}
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
