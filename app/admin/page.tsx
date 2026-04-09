'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
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
  first_name?: string | null
  last_name?: string | null
  date_of_birth?: string | null
  affiliate?: string | null
  city?: string | null
  country?: string | null
  profile_photo_url?: string | null
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

type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled'

const REGISTRATION_STATUS_OPTIONS: Array<{
  value: RegistrationStatus
  label: string
}> = [
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'cancelled', label: 'Annulée' },
]

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [athleteProfiles, setAthleteProfiles] = useState<Profile[]>([])
  const [selectedAthleteId, setSelectedAthleteId] = useState('')
  const [athleteEditFeedback, setAthleteEditFeedback] = useState('')
  const [savingAthlete, setSavingAthlete] = useState(false)
  const [athleteForm, setAthleteForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    affiliate: '',
    city: '',
    country: '',
    profilePhotoUrl: '',
  })
  const [events, setEvents] = useState<EventItem[]>([])
  const [registrations, setRegistrations] = useState<RegistrationDetail[]>([])
  const [registrationSearch, setRegistrationSearch] = useState('')
  const [registrationEventFilter, setRegistrationEventFilter] = useState('all')
  const [registrationStatusFilter, setRegistrationStatusFilter] = useState('all')
  const [selectedRegistrationId, setSelectedRegistrationId] = useState('')
  const [registrationStatus, setRegistrationStatus] =
    useState<RegistrationStatus>('pending')
  const [registrationEditFeedback, setRegistrationEditFeedback] = useState('')
  const [savingRegistration, setSavingRegistration] = useState(false)

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    setProfile(data)
    return (data || null) as Profile | null
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
    const athletes = ((profilesData || []) as Profile[]).filter(
      (item) => item.role === 'athlete'
    )
    setAthleteProfiles(athletes)
    setEvents((eventsData || []) as EventItem[])
    setRegistrations((registrationsData || []) as RegistrationDetail[])
  }

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)

      if (data.user) {
        const loadedProfile = await loadProfile(data.user.id)
        if (loadedProfile?.role === 'admin') {
          await loadAdminData()
        }
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
        const loadedProfile = await loadProfile(data.user.id)
        if (loadedProfile?.role === 'admin') {
          await loadAdminData()
        }
      }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setProfiles([])
    setAthleteProfiles([])
    setEvents([])
    setRegistrations([])
    setSelectedRegistrationId('')
    setRegistrationSearch('')
    setRegistrationEventFilter('all')
    setRegistrationStatusFilter('all')
    setRegistrationEditFeedback('')
  }

  const saveAthleteProfile = async () => {
    if (!selectedAthleteId) return
    setSavingAthlete(true)
    setAthleteEditFeedback('')

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: athleteForm.firstName || null,
        last_name: athleteForm.lastName || null,
        date_of_birth: athleteForm.dateOfBirth || null,
        affiliate: athleteForm.affiliate || null,
        city: athleteForm.city || null,
        country: athleteForm.country || null,
        profile_photo_url: athleteForm.profilePhotoUrl || null,
      })
      .eq('id', selectedAthleteId)

    if (error) {
      setAthleteEditFeedback('Impossible de sauvegarder ce profil athlète.')
      setSavingAthlete(false)
      return
    }

    await loadAdminData()
    setAthleteEditFeedback('Profil athlète mis à jour.')
    setSavingAthlete(false)
  }

  const selectedRegistration = useMemo(
    () => registrations.find((item) => item.id === selectedRegistrationId) || null,
    [registrations, selectedRegistrationId]
  )

  const registrationEventOptions = useMemo(() => {
    return Array.from(new Set(registrations.map((item) => item.event_name))).sort((a, b) =>
      a.localeCompare(b, 'fr')
    )
  }, [registrations])

  const filteredRegistrations = useMemo(() => {
    const search = registrationSearch.trim().toLowerCase()

    return registrations.filter((item) => {
      if (registrationEventFilter !== 'all' && item.event_name !== registrationEventFilter) {
        return false
      }

      if (registrationStatusFilter !== 'all' && item.status !== registrationStatusFilter) {
        return false
      }

      if (!search) return true

      const haystack = [
        item.athlete_email,
        item.event_name,
        item.category_name,
        item.status,
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(search)
    })
  }, [registrations, registrationEventFilter, registrationStatusFilter, registrationSearch])

  const selectRegistration = (item: RegistrationDetail) => {
    setSelectedRegistrationId(item.id)
    setRegistrationEditFeedback('')
    const status = REGISTRATION_STATUS_OPTIONS.some((option) => option.value === item.status)
      ? (item.status as RegistrationStatus)
      : 'pending'
    setRegistrationStatus(status)

    const linkedAthlete = athleteProfiles.find((profileItem) => profileItem.id === item.athlete_id)
    if (!linkedAthlete) {
      setSelectedAthleteId('')
      setAthleteForm({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        affiliate: '',
        city: '',
        country: '',
        profilePhotoUrl: '',
      })
      return
    }

    setSelectedAthleteId(linkedAthlete.id)
    setAthleteEditFeedback('')
    setAthleteForm({
      firstName: linkedAthlete.first_name || '',
      lastName: linkedAthlete.last_name || '',
      dateOfBirth: linkedAthlete.date_of_birth || '',
      affiliate: linkedAthlete.affiliate || '',
      city: linkedAthlete.city || '',
      country: linkedAthlete.country || '',
      profilePhotoUrl: linkedAthlete.profile_photo_url || '',
    })
  }

  const saveRegistrationStatus = async () => {
    if (!selectedRegistrationId) return
    setSavingRegistration(true)
    setRegistrationEditFeedback('')

    const { error } = await supabase
      .from('registrations')
      .update({ status: registrationStatus })
      .eq('id', selectedRegistrationId)

    if (error) {
      setRegistrationEditFeedback("Impossible de mettre à jour le statut d'inscription.")
      setSavingRegistration(false)
      return
    }

    await loadAdminData()
    setRegistrationEditFeedback('Statut d’inscription mis à jour.')
    setSavingRegistration(false)
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
            <h2 className="text-2xl font-semibold text-white">Athlètes</h2>
            <div className="mt-6 space-y-4">
              {athleteProfiles.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border bg-slate-950/70 p-4 ${
                    selectedAthleteId === item.id
                      ? 'border-fuchsia-400/40'
                      : 'border-white/10'
                  }`}
                >
                  <div className="font-medium text-white">{item.email}</div>
                  <div className="mt-2 text-sm text-slate-400">
                    {item.first_name || 'Prénom manquant'} {item.last_name || ''}
                  </div>
                  <button
                    onClick={() => {
                      const linkedRegistration = registrations.find(
                        (registration) => registration.athlete_id === item.id
                      )

                      if (linkedRegistration) {
                        selectRegistration(linkedRegistration)
                        return
                      }

                      setSelectedRegistrationId('')
                      setSelectedAthleteId(item.id)
                      setAthleteEditFeedback(
                        "Cet athlète n'a pas d'inscription active à corriger pour le moment."
                      )
                      setAthleteForm({
                        firstName: item.first_name || '',
                        lastName: item.last_name || '',
                        dateOfBirth: item.date_of_birth || '',
                        affiliate: item.affiliate || '',
                        city: item.city || '',
                        country: item.country || '',
                        profilePhotoUrl: item.profile_photo_url || '',
                      })
                    }}
                    className="mt-3 rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
                  >
                    Ouvrir depuis ses inscriptions
                  </button>
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
            <h2 className="text-2xl font-semibold text-white">Inscriptions athlètes</h2>
            <p className="mt-2 text-sm text-slate-300">
              Recherche rapide + filtres MVP pour corriger un inscrit.
            </p>

            <div className="mt-6 space-y-3">
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                placeholder="Rechercher (email, événement, catégorie...)"
                value={registrationSearch}
                onChange={(e) => setRegistrationSearch(e.target.value)}
              />
              <div className="grid gap-3 md:grid-cols-2">
                <select
                  className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none"
                  value={registrationEventFilter}
                  onChange={(e) => setRegistrationEventFilter(e.target.value)}
                >
                  <option value="all">Tous les événements</option>
                  {registrationEventOptions.map((eventName) => (
                    <option key={eventName} value={eventName}>
                      {eventName}
                    </option>
                  ))}
                </select>
                <select
                  className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none"
                  value={registrationStatusFilter}
                  onChange={(e) => setRegistrationStatusFilter(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  {REGISTRATION_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {filteredRegistrations.map((registration) => (
                <div
                  key={registration.id}
                  className={`rounded-2xl border bg-slate-950/70 p-4 ${
                    selectedRegistrationId === registration.id
                      ? 'border-fuchsia-400/40'
                      : 'border-white/10'
                  }`}
                >
                  <div className="font-medium text-white">
                    {registration.athlete_email}
                  </div>
                  <div className="mt-2 text-sm text-slate-300">
                    {registration.event_name} · {registration.category_name}
                  </div>
                  <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                    {registration.status}
                  </div>
                  <button
                    onClick={() => selectRegistration(registration)}
                    className="mt-3 rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
                  >
                    Voir et corriger
                  </button>
                </div>
              ))}

              {filteredRegistrations.length === 0 && (
                <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                  Aucune inscription ne correspond aux filtres actuels.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold text-white">
            Détail inscription + correction athlète
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Capacité admin MVP : corriger un profil athlète inscrit et piloter
            son statut d’inscription.
          </p>

          {!selectedRegistration && (
            <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
              Sélectionne une inscription dans la colonne “Inscriptions athlètes”.
            </div>
          )}

          {selectedRegistration && (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <div className="text-sm text-slate-400">Inscription sélectionnée</div>
                <div className="mt-2 text-white">
                  {selectedRegistration.athlete_email}
                </div>
                <div className="mt-2 text-sm text-slate-300">
                  {selectedRegistration.event_name} · {selectedRegistration.category_name}
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  Créée le {new Date(selectedRegistration.created_at).toLocaleString('fr-FR')}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <div className="text-sm font-semibold text-white">
                  Statut de l’inscription
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                  <select
                    className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none"
                    value={registrationStatus}
                    onChange={(e) =>
                      setRegistrationStatus(e.target.value as RegistrationStatus)
                    }
                  >
                    {REGISTRATION_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={saveRegistrationStatus}
                    disabled={savingRegistration}
                    className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {savingRegistration ? 'Sauvegarde...' : 'Enregistrer le statut'}
                  </button>
                </div>
                {registrationEditFeedback && (
                  <div className="mt-3 rounded-xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
                    {registrationEditFeedback}
                  </div>
                )}
              </div>

              {!selectedAthleteId && (
                <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                  Profil athlète introuvable pour cette inscription. Le statut peut
                  néanmoins être modifié.
                </div>
              )}

              {selectedAthleteId && (
                <>
                  <div className="text-sm font-semibold text-white">
                    Édition du profil athlète lié
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                      placeholder="Prénom"
                      value={athleteForm.firstName}
                      onChange={(e) =>
                        setAthleteForm((prev) => ({ ...prev, firstName: e.target.value }))
                      }
                    />
                    <input
                      className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                      placeholder="Nom"
                      value={athleteForm.lastName}
                      onChange={(e) =>
                        setAthleteForm((prev) => ({ ...prev, lastName: e.target.value }))
                      }
                    />
                    <input
                      className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                      type="date"
                      placeholder="Date de naissance"
                      value={athleteForm.dateOfBirth}
                      onChange={(e) =>
                        setAthleteForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))
                      }
                    />
                    <input
                      className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                      placeholder="Pays"
                      value={athleteForm.country}
                      onChange={(e) =>
                        setAthleteForm((prev) => ({ ...prev, country: e.target.value }))
                      }
                    />
                    <input
                      className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                      placeholder="Affiliate / Box"
                      value={athleteForm.affiliate}
                      onChange={(e) =>
                        setAthleteForm((prev) => ({ ...prev, affiliate: e.target.value }))
                      }
                    />
                    <input
                      className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                      placeholder="Ville"
                      value={athleteForm.city}
                      onChange={(e) =>
                        setAthleteForm((prev) => ({ ...prev, city: e.target.value }))
                      }
                    />
                  </div>

                  <input
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="URL photo de profil"
                    value={athleteForm.profilePhotoUrl}
                    onChange={(e) =>
                      setAthleteForm((prev) => ({
                        ...prev,
                        profilePhotoUrl: e.target.value,
                      }))
                    }
                  />

                  {athleteEditFeedback && (
                    <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
                      {athleteEditFeedback}
                    </div>
                  )}

                  <button
                    onClick={saveAthleteProfile}
                    disabled={savingAthlete}
                    className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {savingAthlete
                      ? 'Sauvegarde...'
                      : 'Enregistrer les modifications'}
                  </button>
                </>
              )}
            </div>
          )}
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
