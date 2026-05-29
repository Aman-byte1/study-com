'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Course, Profile, Subject } from '@/lib/types'
import { ETHIOPIAN_SUBJECTS, GRADE_LEVELS } from '@/lib/types'

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [tutors, setTutors] = useState<Profile[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [tutorId, setTutorId] = useState('')
  const [gradeLevel, setGradeLevel] = useState(9)
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadData() {
    const supabase = createClient()
    const { data: courseData } = await supabase.from('courses').select('*, subjects(name), profiles!courses_tutor_id_fkey(full_name), enrollments(count)').order('created_at', { ascending: false })
    if (courseData) setCourses(courseData)

    const { data: tutorData } = await supabase.from('profiles').select('*').eq('role', 'tutor')
    if (tutorData) setTutors(tutorData)

    let { data: subjectData } = await supabase.from('subjects').select('*')
    if (!subjectData || subjectData.length === 0) {
      // Seed subjects
      const toInsert = ETHIOPIAN_SUBJECTS.map(s => ({ name: s.name, icon_url: s.icon }))
      await supabase.from('subjects').insert(toInsert)
      const { data: seeded } = await supabase.from('subjects').select('*')
      subjectData = seeded
    }
    if (subjectData) setSubjects(subjectData)

    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const createCourse = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('courses').insert({
      title, subject_id: subjectId, tutor_id: tutorId,
      grade_level: gradeLevel, description: description || null,
    })
    setSuccess('Course created!'); setTitle(''); setDescription(''); setShowCreate(false)
    setSaving(false); loadData()
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2>Courses ({courses.length})</h2>
        <button className="btn btn-primary" onClick={() => { setShowCreate(!showCreate); setSuccess('') }}>
          {showCreate ? 'Cancel' : '+ Create Course'}
        </button>
      </div>

      {success && (
        <div style={{ padding: '1rem', background: 'rgba(0,184,148,0.1)', border: '1px solid rgba(0,184,148,0.3)', borderRadius: 'var(--radius-lg)', color: 'var(--brand-success)', marginBottom: '1.5rem' }}>
          ✅ {success}
        </div>
      )}

      {showCreate && (
        <div className="card-static animate-scale-in" style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>Create New Course</h4>
          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <label className="input-label">Course Title *</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Grade 10 Mathematics" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Subject *</label>
              <select className="input select" value={subjectId} onChange={e => setSubjectId(e.target.value)}>
                <option value="">Select...</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Tutor *</label>
              <select className="input select" value={tutorId} onChange={e => setTutorId(e.target.value)}>
                <option value="">Select...</option>
                {tutors.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Grade Level *</label>
              <select className="input select" value={gradeLevel} onChange={e => setGradeLevel(Number(e.target.value))}>
                {GRADE_LEVELS.map(g => <option key={g} value={g}>Grade {g}</option>)}
              </select>
            </div>
          </div>
          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label className="input-label">Description</label>
            <textarea className="input textarea" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={createCourse} disabled={saving || !title || !subjectId || !tutorId}>
            {saving ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      )}

      <div className="course-grid">
        {courses.map((c, i) => (
          <div key={c.id} className={`course-card animate-fade-in-up stagger-${(i % 6) + 1}`} style={{ cursor: 'default' }}>
            <div className="course-card-header">
              {(c.subject as unknown as { icon_url: string })?.icon_url || '📖'}
            </div>
            <div className="course-card-body">
              <div className="course-card-title">{c.title}</div>
              <div className="course-card-meta">
                <span>{(c.subject as unknown as { name: string })?.name}</span>
                <span>•</span>
                <span>Grade {c.grade_level}</span>
              </div>
              <div className="course-card-footer">
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                  👩‍🏫 {(c as unknown as { profiles: { full_name: string } }).profiles?.full_name}
                </span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                  🎓 {(c.enrollments as unknown as { count: number }[])?.[0]?.count || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
