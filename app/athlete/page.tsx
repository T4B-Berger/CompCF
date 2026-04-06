'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type Profile = {
  id: string
  email: string
  role: string
}

type EventItem = {
  id: string
  name: string
  start_date: string
  end_date: string
  status: string
}

type RegistrationItem = {
  id: string
  event_id: string
  athlete_id: string
  status: string
  created_at: string
  events: {
    id: string
    name: string
    start_date: string
    end_date: string
    status: string
  } | null
}

export default function AthletePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [events, setEvents] = useState<EventItem[]>([])
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([])

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    setProfile(data)
  }

  const loadPublishedEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .order('start_date', { ascending: true })

    setEvents(data || [])
  }

  const loadRegistrations = async () => {
    const { data } = await supabase
      .from('registrations')
      .select(`
        id,
        event_id,
        athlete_id,
        status,
        created_at,
        events (
          id,
          name,
          start_date,
          end_date,
          status
        )
      `)
      .order('created_at', { ascending: false })

    setRegistrations((data as RegistrationItem[]) || [])
  }

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)

      if (data.user) {
        await loadProfile(data.user.id)
        await loadPublishedEvents()
        await loadRegistrations()
      }
    }

    checkUser()
  }, [])

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error) {
      setUser(data.user)

      if (data.user) {
        await loadProfile(data.user.id)
        await loadPublishedEvents()
        await loadRegistrations()
      }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setEvents([])
    setRegistrations([])
  }

  const registerToEvent = async (eventId: string) => {
    if (!user) return

    const { error } = await supabase.from('registrations').insert([
      {
        event_id: eventId,
        athlete_id: user.id,
      },
    ])

    console.log('REGISTRATION ERROR:', error)

    await loadRegistrations()
  }

  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Athlete Login</h1>

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

  if (!profile || profile.role !== 'athlete') {
    return (
      <div style={{ padding: 40 }}>
        <h1>Access denied</h1>
        <button onClick={logout}>Logout</button>
      </div>
    )
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Athlete Area</h1>
      <button onClick={logout}>Logout</button>

      <hr />

      <h2>Published Events</h2>

      {events.map((event) => (
        <div key={event.id}>
          {event.name} — {event.start_date} → {event.end_date}{' '}
          <button onClick={() => registerToEvent(event.id)}>Register</button>
        </div>
      ))}

      <hr />

      <h2>My Registrations</h2>

      {registrations.map((registration) => (
        <div key={registration.id}>
          {registration.events?.name} — {registration.events?.start_date} → {registration.events?.end_date} — {registration.status}
        </div>
      ))}
    </div>
  )
}