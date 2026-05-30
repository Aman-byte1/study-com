'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Lesson, Note } from '@/lib/types'

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&\n?#]+)/)
  return match ? match[1] : null
}

export default function LessonPlayerPage() {
  const { id, lessonId } = useParams()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  const markProgress = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !lessonId) return

    await supabase.from('lesson_progress').upsert({
      student_id: user.id,
      lesson_id: lessonId as string,
      completed: true,
      completed_at: new Date().toISOString(),
    }, { onConflict: 'student_id,lesson_id' })
  }, [lessonId])

  useEffect(() => {
    async function load() {
      const supabase = createClient()

      const { data: lessonData } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single()

      if (lessonData) setLesson(lessonData)

      const { data: noteData } = await supabase
        .from('notes')
        .select('*')
        .eq('lesson_id', lessonId)

      if (noteData) setNotes(noteData)

      // Mark progress
      markProgress()

      setLoading(false)
    }
    load()
  }, [lessonId, markProgress])

  if (loading) return <div className="loading-center"><div className="spinner" /></div>
  if (!lesson) return <div className="empty-state"><div className="empty-state-title">Lesson not found</div></div>

  const youtubeId = lesson.video_url ? getYouTubeId(lesson.video_url) : null
  const isDirectVideo = lesson.video_url && !youtubeId

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div style={{ marginBottom: '1.5rem', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
        <a href={`/student/courses/${id}`} style={{ color: 'var(--text-link)' }}>← Back to Course</a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Video Player */}
        <div>
          {youtubeId ? (
            <div className="video-player-wrapper" style={{ marginBottom: '1.5rem' }}>
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : isDirectVideo ? (
            <div className="video-player-wrapper" style={{ marginBottom: '1.5rem', overflow: 'hidden', background: '#000', aspectRatio: '16/9' }}>
              <video
                src={lesson.video_url!}
                controls
                style={{ width: '100%', height: '100%', display: 'block' }}
                controlsList="nodownload"
              />
            </div>
          ) : (
            <div className="card-static" style={{
              aspectRatio: '16/9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.5rem',
              background: 'var(--bg-tertiary)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎥</div>
                <p style={{ color: 'var(--text-secondary)' }}>No video available for this lesson</p>
              </div>
            </div>
          )}

          <div className="card-static">
            <h2 style={{ marginBottom: '0.5rem' }}>{lesson.title}</h2>
            {lesson.duration_minutes && (
              <span className="badge badge-primary" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
                ⏱ {lesson.duration_minutes} min
              </span>
            )}
            {lesson.description && (
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '1rem' }}>
                {lesson.description}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar - Notes */}
        <div className="card-static" style={{ position: 'sticky', top: 'calc(var(--topbar-height) + 1rem)' }}>
          <h4 style={{ marginBottom: '1rem' }}>📄 Lesson Notes</h4>
          {notes.length === 0 ? (
            <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>No notes for this lesson</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notes.map(note => (
                <a key={note.id} href={note.file_url} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-lg)',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  transition: 'all 0.2s ease',
                }}>
                  <span style={{ fontSize: '1.5rem' }}>
                    {note.file_type === 'pdf' ? '📕' : '📄'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {note.title}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                      {note.file_type?.toUpperCase()}
                    </div>
                  </div>
                  <span style={{ color: 'var(--text-tertiary)' }}>↗</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
