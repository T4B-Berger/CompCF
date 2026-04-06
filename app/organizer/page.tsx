'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type EventItem = {
  id: string
  name: string
  start_date: string
  end_date: string
  status: string
}

type Profile = {
  id: string
  email: string
  role: string
}

export default function OrganizerPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [events, setEvents] = useState<EventItem[]>([])

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    setProfile(data)
  }

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)

      if (data.user) {
        await loadProfile(data.user.id)
      }
    }

    checkUser()
  }, [])

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error) {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)

      if (data.user) {
        await loadProfile(data.user.id)
      }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setEvents([])
  }

  const loadEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })

    setEvents(data || [])
  }

  const publishEvent = async (eventId: string) => {
    await supabase.from('events').update({ status: 'published' }).eq('id', eventId)
    await loadEvents()
  }

  const createEvent = async () => {
    if (!user) return

    await supabase.from('events').insert([
      {
        name: 'New Event',
        organizer_id: user.id,
        start_date: '2026-01-01',
        end_date: '2026-01-02',
      },
    ])

    await loadEvents()
  }

  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Login</h1>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
        <br />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="password"
        />
        <br />
        <button onClick={login}>Login</button>
      </div>
    )
  }

  if (!profile || profile.role !== 'organizer') {
    return (
      <div style={{ padding: 40 }}>
        <h1>Access denied</h1>
        <button onClick={logout}>Logout</button>
      </div>
    )
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Organizer Area</h1>

      <button onClick={logout}>Logout</button>

      <hr />

      <button onClick={createEvent}>Create Event</button>
      <button onClick={loadEvents}>Load Events</button>

      {events.map((event) => (
        <div key={event.id}>
          {event.name} — {event.status}{' '}
          {event.status === 'draft' && (
            <button onClick={() => publishEvent(event.id)}>Publish</button>
          )}
        </div>
      ))}
    </div>
  )
}