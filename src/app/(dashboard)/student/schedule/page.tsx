'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Schedule } from '@/lib/types'
import { DAYS_OF_WEEK } from '@/lib/types'

export default function StudentSchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('schedules')
        .select('*, courses(title), profiles!schedules_tutor_id_fkey(full_name)')
        .eq('student_id', user.id)
        .eq('is_active', true)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true })

      if (data) setSchedules(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  const today = new Date().getDay()

  const schedulesByDay = DAYS_OF_WEEK.map((day, index) => ({
    day,
    index,
    sessions: schedules.filter(s => s.day_of_week === index),
    isToday: index === today,
  }))

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>My Schedule</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Your weekly tutoring sessions
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {schedulesByDay.map(({ day, index, sessions, isToday }) => (
          <div key={index} className={`card-static animate-fade-in-up`} style={{
            borderLeft: isToday ? '3px solid var(--brand-primary)' : undefined,
            background: isToday ? 'rgba(108, 92, 231, 0.05)' : undefined,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: sessions.length > 0 ? '1rem' : 0 }}>
              <h4 style={{ margin: 0 }}>{day}</h4>
              {isToday && <span className="badge badge-primary">Today</span>}
              {sessions.length === 0 && (
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)', marginLeft: 'auto' }}>No sessions</span>
              )}
            </div>
            {sessions.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {sessions.map(s => (
                  <div key={s.id} className="calendar-event" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                        {(s.course as unknown as { title: string })?.title}
                      </div>
                      <div style={{ fontSize: 'var(--font-size-xs)', opacity: 0.8 }}>
                        with {(s as unknown as { profiles: { full_name: string } }).profiles?.full_name}
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                      {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
