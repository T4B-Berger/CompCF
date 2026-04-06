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

type RegistrationDetail = {
  id: string
  event_id: string
  athlete_id: string
  status: string
  created_at: string
  event_name: string
  event_start_date: string
  event_end_date: string
  event_status: string
  athlete_email: string
  athlete_role: string
}

export default function OrganizerPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [events, setEvents] = useState<EventItem[]>([])
  const [registrations, setRegistrations] = useState<RegistrationDetail[]>([])

  const [eventName, setEventName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    setProfile(data)
  }

  const loadEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })

    setEvents(data || [])
  }

  const loadRegistrations = async () => {
    const { data } = await supabase
      .from('registration_details')
      .select('*')
      .order('created_at', { ascending: false })

    const ownEventIds = new Set(events.map((event) => event.id))
    const ownRegistrations = (data || []).filter((item) =>
      ownEventIds.has(item.event_id)
    )

    setRegistrations(ownRegistrations as RegistrationDetail[])
  }

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)

      if (data.user) {
        await loadProfile(data.user.id)
        await loadEvents()
      }
    }

    checkUser()
  }, [])

  useEffect(() => {
    if (events.length > 0) {
      loadRegistrations()
    } else {
      setRegistrations([])
    }
  }, [events])

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error) {
      setUser(data.user)

      if (data.user) {
        await loadProfile(data.user.id)
        await loadEvents()
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

  const publishEvent = async (eventId: string) => {
    await supabase.from('events').update({ status: 'published' }).eq('id', eventId)
    await loadEvents()
  }

  const createEvent = async () => {
    if (!user) return
    if (!eventName || !startDate || !endDate) return

    await supabase.from('events').insert([
      {
        name: eventName,
        organizer_id: user.id,
        start_date: startDate,
        end_date: endDate,
      },
    ])

    setEventName('')
    setStartDate('')
    setEndDate('')

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

      <h2>Create Event</h2>

      <input
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        placeholder="event name"
      />
      <br />
      <input
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="YYYY-MM-DD"
      />
      <br />
      <input
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="YYYY-MM-DD"
      />
      <br />
      <button onClick={createEvent}>Create Event</button>

      <hr />

      <h2>My Events</h2>

      {events.map((event) => (
        <div key={event.id}>
          {event.name} — {event.start_date} → {event.end_date} — {event.status}{' '}
          {event.status === 'draft' && (
            <button onClick={() => publishEvent(event.id)}>Publish</button>
          )}
        </div>
      ))}

      <hr />

      <h2>Participants</h2>

      {registrations.map((registration) => (
        <div key={registration.id}>
          {registration.event_name} — {registration.athlete_email} — {registration.status}
        </div>
      ))}
    </div>
  )
}