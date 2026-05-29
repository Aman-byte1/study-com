'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Message, Profile } from '@/lib/types'

export default function TutorMessagesPage() {
  const [contacts, setContacts] = useState<Profile[]>([])
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      const { data: courses } = await supabase.from('courses').select('id').eq('tutor_id', user.id)
      if (!courses) return

      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('student_id, profiles!enrollments_student_id_fkey(id, full_name, grade_level, role)')
        .in('course_id', courses.map(c => c.id))

      if (enrollments) {
        const unique = new Map<string, Profile>()
        enrollments.forEach((e: Record<string, unknown>) => {
          const p = e.profiles as unknown as Profile
          if (p && !unique.has(p.id)) unique.set(p.id, p)
        })
        setContacts(Array.from(unique.values()))
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!selectedContact || !userId) return
    async function loadMessages() {
      const supabase = createClient()
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${selectedContact}),and(sender_id.eq.${selectedContact},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true })
      if (data) setMessages(data)
    }
    loadMessages()

    const supabase = createClient()
    const channel = supabase
      .channel('tutor-messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new as Message
        if ((msg.sender_id === userId && msg.receiver_id === selectedContact) ||
            (msg.sender_id === selectedContact && msg.receiver_id === userId)) {
          setMessages(prev => [...prev, msg])
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [selectedContact, userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedContact || !userId) return
    setSending(true)
    const supabase = createClient()
    await supabase.from('messages').insert({ sender_id: userId, receiver_id: selectedContact, content: newMessage.trim() })
    setNewMessage('')
    setSending(false)
  }

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', height: 'calc(100vh - var(--topbar-height) - 4rem)' }}>
      <div className="card-static" style={{ overflow: 'auto', padding: '1rem' }}>
        <h4 style={{ padding: '0.5rem', marginBottom: '0.5rem' }}>💬 Students</h4>
        {contacts.map(c => (
          <button key={c.id} onClick={() => setSelectedContact(c.id)} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', width: '100%',
            background: selectedContact === c.id ? 'rgba(108, 92, 231, 0.1)' : 'transparent',
            border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', color: 'var(--text-primary)', textAlign: 'left',
          }}>
            <div className="avatar avatar-sm">{c.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</div>
            <div>
              <div style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>{c.full_name}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Grade {c.grade_level}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="card-static" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        {!selectedContact ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
              <div>Select a student to view messages</div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="avatar avatar-sm">{contacts.find(c => c.id === selectedContact)?.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</div>
              <div style={{ fontWeight: 600 }}>{contacts.find(c => c.id === selectedContact)?.full_name}</div>
            </div>
            <div className="chat-messages" style={{ flex: 1 }}>
              {messages.map(msg => (
                <div key={msg.id} className={`chat-message ${msg.sender_id === userId ? 'sent' : ''}`}>
                  <div>
                    <div className="chat-bubble">{msg.content}</div>
                    <div className="chat-time">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-bar">
              <input className="input" placeholder="Type your response..." value={newMessage}
                onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} style={{ flex: 1 }} />
              <button className="btn btn-primary" onClick={handleSend} disabled={sending || !newMessage.trim()}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
