'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Schedule } from '@/lib/types'
import { DAYS_OF_WEEK } from '@/lib/types'

export default function TutorSchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('schedules')
        .select('*, courses(title), profiles!schedules_student_id_fkey(full_name)')
        .eq('tutor_id', user.id)
        .eq('is_active', true)
        .order('day_of_week').order('start_time')

      if (data) setSchedules(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  const today = new Date().getDay()

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '2rem' }}>My Teaching Schedule</h2>

      {DAYS_OF_WEEK.map((day, index) => {
        const sessions = schedules.filter(s => s.day_of_week === index)
        const isToday = index === today
        return (
          <div key={index} className="card-static" style={{
            marginBottom: '0.75rem',
            borderLeft: isToday ? '3px solid var(--brand-primary)' : undefined,
            background: isToday ? 'rgba(108, 92, 231, 0.05)' : undefined,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h4>{day}</h4>
              {isToday && <span className="badge badge-primary">Today</span>}
              {sessions.length === 0 && <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)', marginLeft: 'auto' }}>Free</span>}
            </div>
            {sessions.map(s => (
              <div key={s.id} className="calendar-event" style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{(s.course as unknown as { title: string })?.title}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', opacity: 0.8 }}>with {(s as unknown as { profiles: { full_name: string } }).profiles?.full_name}</div>
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
