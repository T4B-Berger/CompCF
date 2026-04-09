'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabaseClient'
import {
  CalendarDays,
  ClipboardList,
  LogOut,
  Plus,
  Rocket,
  Users,
} from 'lucide-react'
import { SiteHeader } from '../../components/marketing/site-header'
import { SiteFooter } from '../../components/marketing/site-footer'

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

export default function OrganizerPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [events, setEvents] = useState<EventItem[]>([])
  const [registrations, setRegistrations] = useState<RegistrationDetail[]>([])
  const [eventName, setEventName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [publishFeedback, setPublishFeedback] = useState<{
    eventId: string
    message: string
    kind: 'success' | 'error'
  } | null>(null)
  const [eventInsights, setEventInsights] = useState<
    Record<
      string,
      {
        activeDivisions: number
        activeCategories: number
        categoriesWithActivePricing: number
        blockers: string[]
      }
    >
  >({})

  const loadProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    setProfile(data)
  }, [])

  const loadEventInsights = useCallback(async (sourceEvents: EventItem[]) => {
    if (sourceEvents.length === 0) {
      setEventInsights({})
      return
    }

    const now = new Date()
    const eventIds = sourceEvents.map((event) => event.id)

    const { data: divisions } = await supabase
      .from('event_divisions')
      .select('id, event_id, is_active')
      .in('event_id', eventIds)

    const { data: categories } = await supabase
      .from('event_categories')
      .select('id, event_id, division_id, is_active')
      .in('event_id', eventIds)

    const categoryIds = ((categories || []) as Array<{ id: string }>).map(
      (category) => category.id
    )

    const { data: pricing } = categoryIds.length
      ? await supabase
          .from('category_pricing_tiers')
          .select('category_id, starts_at, ends_at, is_active')
          .in('category_id', categoryIds)
      : {
          data: [] as Array<{
            category_id: string
            starts_at: string | null
            ends_at: string | null
            is_active: boolean
          }>,
        }

    const activeDivisionsByEvent = new Map<string, number>()
    ;(divisions || []).forEach((division) => {
      if (!division.is_active) return
      activeDivisionsByEvent.set(
        division.event_id,
        (activeDivisionsByEvent.get(division.event_id) || 0) + 1
      )
    })

    const categoriesByEvent = new Map<
      string,
      Array<{ id: string; division_id?: string | null; is_active: boolean }>
    >()
    ;(categories || []).forEach((category) => {
      if (!categoriesByEvent.has(category.event_id)) {
        categoriesByEvent.set(category.event_id, [])
      }
      categoriesByEvent.get(category.event_id)?.push(category)
    })

    const activePricingByCategory = new Map<string, number>()
    ;(pricing || []).forEach((tier) => {
      if (!tier.is_active) return
      const startsAtValid = !tier.starts_at || new Date(tier.starts_at) <= now
      const endsAtValid = !tier.ends_at || new Date(tier.ends_at) >= now
      if (!startsAtValid || !endsAtValid) return
      activePricingByCategory.set(
        tier.category_id,
        (activePricingByCategory.get(tier.category_id) || 0) + 1
      )
    })

    const nextInsights: Record<
      string,
      {
        activeDivisions: number
        activeCategories: number
        categoriesWithActivePricing: number
        blockers: string[]
      }
    > = {}

    sourceEvents.forEach((event) => {
      const eventCategories = categoriesByEvent.get(event.id) || []
      const activeCategories = eventCategories.filter((category) => category.is_active)
      const categoriesWithoutDivision = activeCategories.filter(
        (category) => !category.division_id
      )
      const categoriesWithActivePricing = activeCategories.filter(
        (category) => activePricingByCategory.get(category.id) === 1
      )
      const categoriesWithPricingIssues = activeCategories.filter(
        (category) => (activePricingByCategory.get(category.id) || 0) !== 1
      )

      const blockers: string[] = []
      if ((activeDivisionsByEvent.get(event.id) || 0) === 0) {
        blockers.push('Ajouter au moins une division active.')
      }
      if (activeCategories.length === 0) {
        blockers.push('Ajouter au moins une catégorie active.')
      }
      if (categoriesWithoutDivision.length > 0) {
        blockers.push('Lier chaque catégorie active à une division.')
      }
      if (categoriesWithPricingIssues.length > 0) {
        blockers.push('Assurer exactement un palier tarifaire actif par catégorie.')
      }

      nextInsights[event.id] = {
        activeDivisions: activeDivisionsByEvent.get(event.id) || 0,
        activeCategories: activeCategories.length,
        categoriesWithActivePricing: categoriesWithActivePricing.length,
        blockers,
      }
    })

    setEventInsights(nextInsights)
  }, [])

  const loadRegistrations = useCallback(async (currentEvents?: EventItem[]) => {
    const sourceEvents = currentEvents || events
    const ownEventIds = new Set(sourceEvents.map((event) => event.id))

    const { data } = await supabase
      .from('registration_details')
      .select('*')
      .order('created_at', { ascending: false })

    const ownRegistrations = (data || []).filter((item) =>
      ownEventIds.has(item.event_id)
    )

    setRegistrations(ownRegistrations as RegistrationDetail[])
  }, [events])

  const loadEvents = useCallback(async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })

    const nextEvents = (data || []) as EventItem[]
    setEvents(nextEvents)
    await loadEventInsights(nextEvents)
    await loadRegistrations(nextEvents)
  }, [loadEventInsights, loadRegistrations])

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)

      if (data.user) {
        await loadProfile(data.user.id)

        const { data: eventsData } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false })

        const safeEvents = (eventsData || []) as EventItem[]
        setEvents(safeEvents)
        await loadEventInsights(safeEvents)
        await loadRegistrations(safeEvents)
      }
    }

    checkUser()
  }, [loadEventInsights, loadProfile, loadRegistrations])

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

  const validateEventBeforePublish = async (eventId: string) => {
    const failures: string[] = []
    const now = new Date()

    const { data: divisionsData } = await supabase
      .from('event_divisions')
      .select('id')
      .eq('event_id', eventId)
      .eq('is_active', true)

    if (!divisionsData || divisionsData.length === 0) {
      failures.push('Ajoute au moins une division active avant publication.')
    }

    const { data: categoriesData } = await supabase
      .from('event_categories')
      .select('id, division_id, is_active')
      .eq('event_id', eventId)

    const activeCategories = (categoriesData || []).filter((c) => c.is_active)

    if (activeCategories.length === 0) {
      failures.push('Ajoute au moins une catégorie active avant publication.')
    }

    const missingDivisionLink = activeCategories.filter((c) => !c.division_id)
    if (missingDivisionLink.length > 0) {
      failures.push('Chaque catégorie active doit être liée à une division.')
    }

    if (activeCategories.length > 0) {
      const categoryIds = activeCategories.map((c) => c.id)
      const { data: pricingData } = await supabase
        .from('category_pricing_tiers')
        .select('category_id, starts_at, ends_at, is_active')
        .in('category_id', categoryIds)
        .eq('is_active', true)

      const pricingByCategory = new Map<string, number>()

      ;(pricingData || []).forEach((tier) => {
        const startsAt = tier.starts_at ? new Date(tier.starts_at) : null
        const endsAt = tier.ends_at ? new Date(tier.ends_at) : null

        const withinWindow =
          (!startsAt || startsAt <= now) && (!endsAt || endsAt >= now)

        if (withinWindow) {
          pricingByCategory.set(
            tier.category_id,
            (pricingByCategory.get(tier.category_id) || 0) + 1
          )
        }
      })

      const missingPricing = activeCategories.filter(
        (c) => !pricingByCategory.get(c.id)
      )
      if (missingPricing.length > 0) {
        failures.push(
          'Chaque catégorie active doit avoir un palier tarifaire actif dans une fenêtre valide.'
        )
      }

      const ambiguousPricing = [...pricingByCategory.entries()].filter(
        ([, count]) => count > 1
      )
      if (ambiguousPricing.length > 0) {
        failures.push(
          'Chaque catégorie active doit avoir un seul palier tarifaire actif à l’instant T.'
        )
      }
    }

    return failures
  }

  const publishEvent = async (eventId: string) => {
    setPublishFeedback(null)
    const failures = await validateEventBeforePublish(eventId)

    if (failures.length > 0) {
      setPublishFeedback({
        eventId,
        message: failures.join(' '),
        kind: 'error',
      })
      return
    }

    const { error } = await supabase
      .from('events')
      .update({ status: 'published' })
      .eq('id', eventId)

    if (error) {
      setPublishFeedback({
        eventId,
        message: error.message || 'Impossible de publier l’événement pour le moment.',
        kind: 'error',
      })
      return
    }

    setPublishFeedback({
      eventId,
      message: 'Événement publié avec une structure minimale valide.',
      kind: 'success',
    })
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

  const publishedCount = useMemo(
    () => events.filter((e) => e.status === 'published').length,
    [events]
  )

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <SiteHeader />
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md items-center px-6 py-16">
          <div className="w-full rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/30">
            <div className="inline-flex rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-200">
              Connexion organisateur
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-white">
              Accéder à l’espace organisateur
            </h1>
            <p className="mt-3 text-slate-300">
              Crée des événements, publie les catégories et suis les
              inscriptions.
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

  if (!profile || profile.role !== 'organizer') {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
            <h1 className="text-3xl font-semibold text-white">
              Accès refusé
            </h1>
            <p className="mt-3 text-slate-300">
              Ce compte ne dispose pas des permissions organisateur.
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
              Tableau de bord organisateur
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
              Construis et pilote tes compétitions
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              Publie des événements, suis les inscriptions et structure
              l’exploitation de ta compétition depuis un seul endroit.
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
            <CalendarDays className="h-5 w-5 text-sky-300" />
            <div className="mt-4 text-3xl font-semibold text-white">
              {events.length}
            </div>
            <div className="mt-1 text-sm text-slate-400">
              Événements créés
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <Rocket className="h-5 w-5 text-fuchsia-300" />
            <div className="mt-4 text-3xl font-semibold text-white">
              {publishedCount}
            </div>
            <div className="mt-1 text-sm text-slate-400">
              Événements publiés
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <Users className="h-5 w-5 text-emerald-300" />
            <div className="mt-4 text-3xl font-semibold text-white">
              {registrations.length}
            </div>
            <div className="mt-1 text-sm text-slate-400">
              Inscriptions visibles
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <Plus className="h-5 w-5 text-sky-300" />
              <h2 className="text-2xl font-semibold text-white">
                Créer un événement
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Nom de l’événement"
              />
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="YYYY-MM-DD"
              />
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="YYYY-MM-DD"
              />
              <button
                onClick={createEvent}
                className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white"
              >
                Créer l’événement
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-5 w-5 text-fuchsia-300" />
              <h2 className="text-2xl font-semibold text-white">
                Mes événements
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              {events.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 text-slate-300">
                  Aucun événement pour le moment.
                </div>
              )}

              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="text-lg font-semibold text-white">
                        {event.name}
                      </div>
                      <div className="mt-2 text-sm text-slate-400">
                        {event.start_date} → {event.end_date}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          event.status === 'published'
                            ? 'border border-emerald-400/25 bg-emerald-500/10 text-emerald-200'
                            : 'border border-amber-400/25 bg-amber-500/10 text-amber-200'
                        }`}
                      >
                        {event.status === 'published' ? 'Publié' : 'Brouillon'}
                      </span>

                      {event.status === 'draft' && (
                        <button
                          onClick={() => publishEvent(event.id)}
                          className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                          Publier
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                    <div className="grid gap-2 text-xs text-slate-300 sm:grid-cols-3">
                      <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                        Divisions actives:{' '}
                        {eventInsights[event.id]?.activeDivisions ?? 0}
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                        Catégories actives:{' '}
                        {eventInsights[event.id]?.activeCategories ?? 0}
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                        Catégories avec tarif valide:{' '}
                        {eventInsights[event.id]?.categoriesWithActivePricing ?? 0}
                      </div>
                    </div>

                    {(eventInsights[event.id]?.blockers.length || 0) > 0 && (
                      <ul className="space-y-1 rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
                        {eventInsights[event.id]?.blockers.map((blocker) => (
                          <li key={blocker}>• {blocker}</li>
                        ))}
                      </ul>
                    )}

                    {publishFeedback?.eventId === event.id && (
                      <div
                        className={`rounded-lg border px-3 py-2 text-xs ${
                          publishFeedback.kind === 'success'
                            ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100'
                            : 'border-rose-400/20 bg-rose-500/10 text-rose-100'
                        }`}
                      >
                        {publishFeedback.message}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-sky-300" />
            <h2 className="text-2xl font-semibold text-white">
              Participants
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            {registrations.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 text-slate-300">
                Aucune inscription pour le moment.
              </div>
            )}

            {registrations.map((registration) => (
              <div
                key={registration.id}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
              >
                <div className="grid gap-2 lg:grid-cols-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Événement
                    </div>
                    <div className="mt-1 font-medium text-white">
                      {registration.event_name}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Catégorie
                    </div>
                    <div className="mt-1 font-medium text-white">
                      {registration.category_name}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Athlète
                    </div>
                    <div className="mt-1 font-medium text-white">
                      {registration.athlete_email}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Statut
                    </div>
                    <div className="mt-1 font-medium text-white">
                      {registration.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/events"
            className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
          >
            Événements publics
          </Link>
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
