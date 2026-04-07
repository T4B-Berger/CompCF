'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import {
  CalendarDays,
  ClipboardList,
  LogOut,
  Users,
} from 'lucide-react'
import { SiteHeader } from '../../components/marketing/site-header'
import { SiteFooter } from '../../components/marketing/site-footer'

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

type RegistrationDetail = {
  id: string
  event_id: string
  category_id: string
  athlete_id: string
  status: string
  created_at: string
  event_name: string
  event_start_date: string
  event_end_date: string
  event_status: string
  category_name: string
  athlete_email: string
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [registrations, setRegistrations] = useState<RegistrationDetail[]>([])

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
      .from('registration_details')
      .select('*')
      .order('created_at', { ascending: false })

    setProfiles((profilesData || []) as Profile[])
    setEvents((eventsData || []) as EventItem[])
    setRegistrations((registrationsData || []) as RegistrationDetail[])
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

  useEffect(() => {
    if (profile?.role === 'admin') {
      loadAdminData()
    }
  }, [profile])

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

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <SiteHeader />
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md items-center px-6 py-16">
          <div className="w-full rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/30">
            <div className="inline-flex rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-200">
              Connexion admin
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-white">
              Accéder à l’espace admin
            </h1>
            <p className="mt-3 text-slate-300">
              Consulte tous les utilisateurs, événements et inscriptions.
            </p>

            <div className="mt-8 space-y-4">
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Mot de passe"
              />
              <button
                onClick={login}
                className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white"
              >
                Connexion
              </button>
            </div>

            <div className="mt-6">
              <Link href="/" className="text-sm text-sky-300 hover:text-sky-200">
                Retour à l’accueil
              </Link>
            </div>
          </div>
        </div>
        <SiteFooter />
      </main>
    )
  }

  if (!profile || profile.role !== 'admin') {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
            <h1 className="text-3xl font-semibold text-white">
              Accès refusé
            </h1>
            <p className="mt-3 text-slate-300">
              Ce compte ne dispose pas des permissions admin.
            </p>
            <button
              onClick={logout}
              className="mt-6 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
            >
              Déconnexion
            </button>
          </div>
        </div>
        <SiteFooter />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-x-0 top-0 -z-10 overflow-hidden">
        <div className="mx-auto h-[320px] max-w-7xl">
          <div className="absolute left-[-100px] top-[-60px] h-64 w-64 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <div className="absolute right-[-60px] top-[-30px] h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        </div>
      </div>

      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-200">
              Tableau de bord admin
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
              Vue d’ensemble du système
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              Consulte les utilisateurs, l’activité publiée et les inscriptions
              sur l’ensemble de la plateforme.
            </p>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <Users className="h-5 w-5 text-sky-300" />
            <div className="mt-4 text-3xl font-semibold text-white">
              {profiles.length}
            </div>
            <div className="mt-1 text-sm text-slate-400">Profils</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <CalendarDays className="h-5 w-5 text-fuchsia-300" />
            <div className="mt-4 text-3xl font-semibold text-white">
              {events.length}
            </div>
            <div className="mt-1 text-sm text-slate-400">Événements</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <ClipboardList className="h-5 w-5 text-emerald-300" />
            <div className="mt-4 text-3xl font-semibold text-white">
              {registrations.length}
            </div>
            <div className="mt-1 text-sm text-slate-400">Inscriptions</div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold text-white">Profils</h2>
            <div className="mt-6 space-y-4">
              {profiles.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
                >
                  <div className="font-medium text-white">{item.email}</div>
                  <div className="mt-2 text-sm text-slate-400">{item.role}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold text-white">Événements</h2>
            <div className="mt-6 space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
                >
                  <div className="font-medium text-white">{event.name}</div>
                  <div className="mt-2 text-sm text-slate-400">
                    {event.start_date} → {event.end_date}
                  </div>
                  <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                    {event.status === 'published' ? 'Publié' : 'Brouillon'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold text-white">Inscriptions</h2>
            <div className="mt-6 space-y-4">
              {registrations.map((registration) => (
                <div
                  key={registration.id}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
                >
                  <div className="font-medium text-white">
                    {registration.event_name}
                  </div>
                  <div className="mt-2 text-sm text-slate-300">
                    {registration.category_name}
                  </div>
                  <div className="mt-2 text-sm text-slate-400">
                    {registration.athlete_email}
                  </div>
                  <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                    {registration.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/"
            className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
          >
            Retour à l’accueil
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}