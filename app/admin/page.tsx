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
  status: string
  start_date: string
  end_date: string
}

type RegistrationItem = {
  id: string
  status: string
  created_at: string
  profiles: {
    email: string
  }[]
  events: {
    name: string
  }[]
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [profiles, setProfiles] = useState<Profile[]>([])
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

  const loadAdminData = async () => {
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: eventsData } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: registrationsData } = await supabase
      .from('registrations')
      .select(`
        id,
        status,
        created_at,
        profiles (
          email
        ),
        events (
          name
        )
      `)
      .order('created_at', { ascending: false })

    setProfiles(profilesData || [])
    setEvents(eventsData || [])
    setRegistrations((registrationsData as RegistrationItem[]) || [])
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error) {
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
    setProfiles([])
    setEvents([])
    setRegistrations([])
  }

  useEffect(() => {
    if (profile?.role === 'admin') {
      loadAdminData()
    }
  }, [profile])

  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Admin Login</h1>

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

  if (!profile || profile.role !== 'admin') {
    return (
      <div style={{ padding: 40 }}>
        <h1>Access denied</h1>
        <button onClick={logout}>Logout</button>
      </div>
    )
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Area</h1>
      <button onClick={logout}>Logout</button>

      <hr />

      <h2>Profiles</h2>
      {profiles.map((item) => (
        <div key={item.id}>
          {item.email} — {item.role}
        </div>
      ))}

      <hr />

      <h2>Events</h2>
      {events.map((event) => (
        <div key={event.id}>
          {event.name} — {event.start_date} → {event.end_date} — {event.status}
        </div>
      ))}

      <hr />

      <h2>Registrations</h2>
      {registrations.map((registration) => (
        <div key={registration.id}>
          {registration.events?.[0]?.name} — {registration.profiles?.[0]?.email} — {registration.status}
        </div>
      ))}
    </div>
  )
}