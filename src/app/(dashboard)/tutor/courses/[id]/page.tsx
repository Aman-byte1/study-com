'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Course, Lesson } from '@/lib/types'

export default function TutorCourseDetailPage() {
  const { id } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [showAddLesson, setShowAddLesson] = useState(false)
  const [lessonTitle, setLessonTitle] = useState('')
  const [lessonDesc, setLessonDesc] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [duration, setDuration] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  async function loadData() {
    const supabase = createClient()
    const { data: courseData } = await supabase.from('courses').select('*, subjects(name)').eq('id', id).single()
    if (courseData) setCourse(courseData)

    const { data: lessonData } = await supabase.from('lessons').select('*').eq('course_id', id).order('order_index')
    if (lessonData) setLessons(lessonData)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [id]) // eslint-disable-line

  const addLesson = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('lessons').insert({
      course_id: id,
      title: lessonTitle,
      description: lessonDesc || null,
      video_url: videoUrl || null,
      duration_minutes: duration ? parseInt(duration) : null,
      order_index: lessons.length,
    })
    setLessonTitle(''); setLessonDesc(''); setVideoUrl(''); setDuration('')
    setShowAddLesson(false)
    setSaving(false)
    loadData()
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>
  if (!course) return <div className="empty-state"><div className="empty-state-title">Course not found</div></div>

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>{course.title}</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          {(course.subject as unknown as { name: string })?.name} • Grade {course.grade_level}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h3>Lessons ({lessons.length})</h3>
        <button className="btn btn-primary" onClick={() => setShowAddLesson(!showAddLesson)}>
          {showAddLesson ? 'Cancel' : '+ Add Lesson'}
        </button>
      </div>

      {/* Add lesson form */}
      {showAddLesson && (
        <div className="card-static animate-scale-in" style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>Add New Lesson</h4>
          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <label className="input-label">Lesson Title *</label>
            <input className="input" placeholder="e.g. Introduction to Algebra" value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} />
          </div>
          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <label className="input-label">Description</label>
            <textarea className="input textarea" placeholder="Brief description..." value={lessonDesc} onChange={e => setLessonDesc(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="input-group">
              <label className="input-label">YouTube Video URL</label>
              <input className="input" placeholder="https://youtube.com/watch?v=..." value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Duration (minutes)</label>
              <input className="input" type="number" placeholder="30" value={duration} onChange={e => setDuration(e.target.value)} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={addLesson} disabled={saving || !lessonTitle.trim()}>
            {saving ? 'Saving...' : 'Save Lesson'}
          </button>
        </div>
      )}

      {/* Lessons list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {lessons.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎥</div>
            <div className="empty-state-title">No lessons yet</div>
            <div className="empty-state-text">Click &quot;Add Lesson&quot; to create your first lesson.</div>
          </div>
        ) : lessons.map((lesson, i) => (
          <div key={lesson.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-full)',
              background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)',
            }}>
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{lesson.title}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                {lesson.video_url ? '🎥 Has video' : '📄 No video'} {lesson.duration_minutes ? `• ${lesson.duration_minutes} min` : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
