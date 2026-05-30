'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Course } from '@/lib/types'
import { uploadToBunny, getLessonVideoPath, isDirectVideoUrl } from '@/lib/bunny'

export default function TutorUploadPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [uploadType, setUploadType] = useState<'lesson' | 'note'>('lesson')
  const [videoSource, setVideoSource] = useState<'youtube' | 'bunny' | 'url'>('youtube')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [duration, setDuration] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
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

  const handleUpload = async () => {
    if (!selectedCourse || !title.trim()) return
    setSaving(true)
    setSuccess('')
    setUploadProgress(0)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (uploadType === 'lesson') {
      let finalVideoUrl = videoUrl || ''

      // If uploading via Bunny CDN
      if (videoSource === 'bunny' && videoFile) {
        const storagePath = getLessonVideoPath(selectedCourse, `lesson-${Date.now()}`, videoFile.name)
        setUploadProgress(25)
        
        const result = await uploadToBunny(videoFile, storagePath)
        if (result.success && result.url) {
          finalVideoUrl = result.url
          setUploadProgress(75)
        } else {
          alert(`Upload failed: ${result.error || 'Unknown error'}. Falling back to URL input.`)
          setUploadProgress(0)
          setSaving(false)
          return
        }
      }

      await supabase.from('lessons').insert({
        course_id: selectedCourse,
        title,
        description: description || null,
        video_url: finalVideoUrl || null,
        duration_minutes: duration ? parseInt(duration) : null,
        order_index: 0,
      })
      setUploadProgress(100)
      setSuccess(videoSource === 'bunny' ? 'Video uploaded to CDN and lesson created!' : 'Lesson uploaded successfully!')
    } else {
      let fileUrl = ''
      if (file) {
        const ext = file.name.split('.').pop()
        const path = `notes/${Date.now()}.${ext}`
        const { data: uploadData } = await supabase.storage.from('notes').upload(path, file)
        if (uploadData) {
          const { data: urlData } = supabase.storage.from('notes').getPublicUrl(path)
          fileUrl = urlData.publicUrl
        }
      }

      if (fileUrl) {
        const fileType = file?.type.includes('pdf') ? 'pdf' : file?.type.includes('image') ? 'image' : 'doc'
        await supabase.from('notes').insert({
          course_id: selectedCourse,
          uploaded_by: user.id,
          title,
          file_url: fileUrl,
          file_type: fileType,
        })
        setSuccess('Note uploaded successfully!')
      }
    }

    setTitle(''); setDescription(''); setVideoUrl(''); setDuration(''); setFile(null); setVideoFile(null)
    setUploadProgress(0)
    setSaving(false)
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="animate-fade-in" style={{ maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Upload Content</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Add video lessons or study notes to your courses</p>

      {success && (
        <div style={{
          padding: '1rem', background: 'rgba(0, 184, 148, 0.1)',
          border: '1px solid rgba(0, 184, 148, 0.3)', borderRadius: 'var(--radius-lg)',
          color: 'var(--brand-success)', fontSize: 'var(--font-size-sm)', marginBottom: '1.5rem',
        }}>
          ✅ {success}
        </div>
      )}

      <div className="card-static">
        {/* Upload type toggle */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button className={`btn ${uploadType === 'lesson' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setUploadType('lesson')}>
            🎥 Video Lesson
          </button>
          <button className={`btn ${uploadType === 'note' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setUploadType('note')}>
            📄 Study Note
          </button>
        </div>

        {/* Course select */}
        <div className="input-group" style={{ marginBottom: '1rem' }}>
          <label className="input-label">Course *</label>
          <select className="input select" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
            <option value="">Select a course...</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title} - {(c.subject as unknown as { name: string })?.name}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="input-group" style={{ marginBottom: '1rem' }}>
          <label className="input-label">Title *</label>
          <input className="input" placeholder={uploadType === 'lesson' ? 'Lesson title...' : 'Note title...'} value={title} onChange={e => setTitle(e.target.value)} />
        </div>

        {uploadType === 'lesson' ? (
          <>
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label">Description</label>
              <textarea className="input textarea" placeholder="What will students learn?" value={description} onChange={e => setDescription(e.target.value)} />
            </div>

            {/* Video Source Tabs */}
            <div className="tabs" style={{ marginBottom: '1rem' }}>
              <button className={`tab ${videoSource === 'youtube' ? 'active' : ''}`} onClick={() => setVideoSource('youtube')}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>YOUTUBE</span>
              </button>
              <button className={`tab ${videoSource === 'bunny' ? 'active' : ''}`} onClick={() => setVideoSource('bunny')}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>BUNNY CDN</span>
              </button>
              <button className={`tab ${videoSource === 'url' ? 'active' : ''}`} onClick={() => setVideoSource('url')}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>DIRECT URL</span>
              </button>
            </div>

            {videoSource === 'youtube' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="input-group">
                  <label className="input-label">YouTube Video URL *</label>
                  <input className="input" placeholder="https://youtube.com/watch?v=..." value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Duration (minutes)</label>
                  <input className="input" type="number" placeholder="45" value={duration} onChange={e => setDuration(e.target.value)} />
                </div>
              </div>
            )}

            {videoSource === 'bunny' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Upload Video File (MP4, WebM, MOV) *</label>
                <div
                  className="file-upload-zone"
                  onClick={() => document.getElementById('video-file-input')?.click()}
                  style={{
                    borderColor: videoFile ? 'var(--brand-primary)' : 'var(--border-primary)',
                    background: videoFile ? 'rgba(216, 168, 56, 0.05)' : 'transparent',
                  }}
                >
                  {videoFile ? (
                    <>
                      <div className="file-upload-icon">🎬</div>
                      <div className="file-upload-text" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{videoFile.name}</div>
                      <div className="file-upload-hint">{(videoFile.size / 1024 / 1024).toFixed(1)} MB — Ready to upload via Bunny CDN</div>
                    </>
                  ) : (
                    <>
                      <div className="file-upload-icon" style={{ fontSize: '2.5rem' }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="1.5">
                          <rect x="2" y="3" width="20" height="14" />
                          <path d="M10 8l5 3-5 3V8z" fill="var(--brand-primary)" />
                        </svg>
                      </div>
                      <div className="file-upload-text">Click to select a video file</div>
                      <div className="file-upload-hint">MP4, WebM, or MOV up to 500MB — Stored on Bunny CDN</div>
                    </>
                  )}
                </div>
                <input
                  id="video-file-input"
                  type="file"
                  style={{ display: 'none' }}
                  accept=".mp4,.webm,.mov,.avi,.mkv"
                  onChange={e => setVideoFile(e.target.files?.[0] || null)}
                />
                <div className="input-group" style={{ marginTop: '0.75rem' }}>
                  <label className="input-label">Duration (minutes)</label>
                  <input className="input" type="number" placeholder="45" value={duration} onChange={e => setDuration(e.target.value)} />
                </div>
              </div>
            )}

            {videoSource === 'url' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="input-group">
                  <label className="input-label">Direct Video URL *</label>
                  <input className="input" placeholder="https://example.com/video.mp4" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Duration (minutes)</label>
                  <input className="input" type="number" placeholder="45" value={duration} onChange={e => setDuration(e.target.value)} />
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>File (PDF, DOC, Image) *</label>
            <div
              className={`file-upload-zone`}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <div className="file-upload-icon">📁</div>
              <div className="file-upload-text">
                {file ? file.name : 'Click to upload or drag & drop'}
              </div>
              <div className="file-upload-hint">PDF, DOC, or images up to 50MB</div>
            </div>
            <input
              id="file-input"
              type="file"
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />
          </div>
        )}

        <button
          className="btn btn-primary btn-lg"
          onClick={handleUpload}
          disabled={saving || !selectedCourse || !title.trim() || (uploadType === 'note' && !file)}
          style={{ width: '100%' }}
        >
          {saving ? 'Uploading...' : `Upload ${uploadType === 'lesson' ? 'Lesson' : 'Note'}`}
        </button>
      </div>
    </div>
  )
}
