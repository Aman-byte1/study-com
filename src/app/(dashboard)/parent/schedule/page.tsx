'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Schedule } from '@/lib/types'
import { DAYS_OF_WEEK } from '@/lib/types'

export default function ParentSchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: kids } = await supabase.from('profiles').select('id').eq('parent_id', user.id)
      if (kids && kids.length > 0) {
        const { data } = await supabase
          .from('schedules')
          .select('*, courses(title), profiles!schedules_tutor_id_fkey(full_name), profiles!schedules_student_id_fkey(full_name)')
          .in('student_id', kids.map(k => k.id))
          .eq('is_active', true)
          .order('day_of_week').order('start_time')
        if (data) setSchedules(data)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  const today = new Date().getDay()

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '2rem' }}>Child&apos;s Schedule</h2>
      {schedules.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <div className="empty-state-title">No schedule yet</div>
          <div className="empty-state-text">Your child&apos;s tutoring sessions will appear here.</div>
        </div>
      ) : DAYS_OF_WEEK.map((day, index) => {
        const sessions = schedules.filter(s => s.day_of_week === index)
        if (sessions.length === 0) return null
        return (
          <div key={index} className="card-static" style={{ marginBottom: '0.75rem', borderLeft: index === today ? '3px solid var(--brand-primary)' : undefined }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <h4>{day}</h4>
              {index === today && <span className="badge badge-primary">Today</span>}
            </div>
            {sessions.map(s => (
              <div key={s.id} className="calendar-event" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{(s.course as unknown as { title: string })?.title}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', opacity: 0.8 }}>Tutor: {(s as unknown as { profiles: { full_name: string } }).profiles?.full_name}</div>
                </div>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}</div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
