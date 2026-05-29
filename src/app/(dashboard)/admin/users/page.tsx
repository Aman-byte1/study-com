'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, UserRole } from '@/lib/types'
import { GRADE_LEVELS } from '@/lib/types'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [filter, setFilter] = useState<UserRole | 'all'>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState<UserRole>('student')
  const [newGrade, setNewGrade] = useState(9)
  const [parentId, setParentId] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadUsers() {
    const supabase = createClient()
    const query = supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (filter !== 'all') query.eq('role', filter)
    const { data } = await query
    if (data) setUsers(data)
    setLoading(false)
  }

  useEffect(() => { loadUsers() }, [filter]) // eslint-disable-line

  const createUser = async () => {
    setSaving(true)
    setSuccess('')
    const supabase = createClient()

    // Sign up user
    const { data, error } = await supabase.auth.signUp({
      email: newEmail, password: newPassword,
      options: { data: { full_name: newName, role: newRole } }
    })

    if (error) { setSuccess(`Error: ${error.message}`); setSaving(false); return }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id, role: newRole, full_name: newName,
        grade_level: newRole === 'student' ? newGrade : null,
        parent_id: newRole === 'student' && parentId ? parentId : null,
      })
      setSuccess(`User ${newName} created!`)
      setNewName(''); setNewEmail(''); setNewPassword(''); setShowCreate(false)
      loadUsers()
    }
    setSaving(false)
  }

  const parents = users.filter(u => u.role === 'parent')

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2>Users ({users.length})</h2>
        <button className="btn btn-primary" onClick={() => { setShowCreate(!showCreate); setSuccess('') }}>
          {showCreate ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {success && (
        <div style={{
          padding: '1rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem',
          background: success.startsWith('Error') ? 'rgba(255,107,107,0.1)' : 'rgba(0,184,148,0.1)',
          border: `1px solid ${success.startsWith('Error') ? 'rgba(255,107,107,0.3)' : 'rgba(0,184,148,0.3)'}`,
          color: success.startsWith('Error') ? 'var(--brand-danger)' : 'var(--brand-success)',
        }}>{success}</div>
      )}

      {showCreate && (
        <div className="card-static animate-scale-in" style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>Create New User</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Full Name *</label>
              <input className="input" value={newName} onChange={e => setNewName(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Role *</label>
              <select className="input select" value={newRole} onChange={e => setNewRole(e.target.value as UserRole)}>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="tutor">Tutor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Email *</label>
              <input className="input" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Password *</label>
              <input className="input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
          </div>
          {newRole === 'student' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Grade Level</label>
                <select className="input select" value={newGrade} onChange={e => setNewGrade(Number(e.target.value))}>
                  {GRADE_LEVELS.map(g => <option key={g} value={g}>Grade {g}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Link to Parent</label>
                <select className="input select" value={parentId} onChange={e => setParentId(e.target.value)}>
                  <option value="">No parent linked</option>
                  {parents.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                </select>
              </div>
            </div>
          )}
          <button className="btn btn-primary" onClick={createUser} disabled={saving || !newName || !newEmail || !newPassword}>
            {saving ? 'Creating...' : 'Create User'}
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="tabs" style={{ marginBottom: '1.5rem' }}>
        {(['all', 'student', 'parent', 'tutor', 'admin'] as const).map(f => (
          <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? '👥 All' : f === 'student' ? '🎓 Students' : f === 'parent' ? '👨‍👩‍👧 Parents' : f === 'tutor' ? '👩‍🏫 Tutors' : '🔧 Admins'}
          </button>
        ))}
      </div>

      {/* Users table */}
      <div className="card-static" style={{ overflow: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Grade</th>
              <th>Phone</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="avatar avatar-sm">{u.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</div>
                    <span style={{ fontWeight: 500 }}>{u.full_name}</span>
                  </div>
                </td>
                <td><span className={`badge ${u.role === 'student' ? 'badge-primary' : u.role === 'tutor' ? 'badge-success' : u.role === 'parent' ? 'badge-info' : 'badge-warning'}`}>{u.role}</span></td>
                <td>{u.grade_level || '-'}</td>
                <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{u.phone || '-'}</td>
                <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
