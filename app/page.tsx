'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type EventItem = {
  id: string
  name: string
  start_date: string
  end_date: string
  status: string
}

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('Test Event')
  const [startDate, setStartDate] = useState('2026-01-01')
  const [endDate, setEndDate] = useState('2026-01-02')
  const [events, setEvents] = useState<EventItem[]>([])

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('LOGIN:', data)
    console.log('ERROR:', error)
  }

  const createEvent = async () => {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id

    const { error } = await supabase.from('events').insert([
      {
        name,
        organizer_id: userId,
        start_date: startDate,
        end_date: endDate,
      },
    ])

    console.log('CREATE ERROR:', error)
  }

  const loadEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })

    console.log('EVENTS:', data)
    console.log('LOAD ERROR:', error)

    setEvents(data || [])
  }

  const publishEvent = async (eventId: string) => {
    const { error } = await supabase
      .from('events')
      .update({ status: 'published' })
      .eq('id', eventId)

    console.log('PUBLISH ERROR:', error)

    await loadEvents()
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>

      <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <br />
      <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <button onClick={login}>Login</button>

      <hr />

      <h2>Create Event</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <br />
      <input value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <br />
      <input value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      <br />
      <button onClick={createEvent}>Create Event</button>

      <hr />

      <h2>My Events</h2>
      <button onClick={loadEvents}>Load Events</button>

      {events.map((event) => (
        <div key={event.id}>
          {event.name} — {event.start_date} → {event.end_date} — {event.status}{' '}
          {event.status === 'draft' && (
            <button onClick={() => publishEvent(event.id)}>Publish</button>
          )}
        </div>
      ))}
    </div>
  )
}