'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabaseClient'
import { isEmailVerified } from '../../lib/authVerification'
import {
  getRegistrationReadiness,
  type RegistrationReadinessCode,
} from '../../lib/registrationReadiness'
import {
  AlertTriangle,
  CalendarDays,
  Camera,
  CheckCircle2,
  LogOut,
  MailCheck,
  Medal,
  Ticket,
  Trophy,
  UserCircle2,
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
  start_date: string
  end_date: string
  status: string
}

type RegistrationDetail = {
  id: string
  event_id: string
  category_id: string
  pricing_tier_id?: string | null
  athlete_id: string
  status: string
  created_at: string
  event_name: string
  event_start_date: string
  event_end_date: string
  event_status: string
  category_name: string
  pricing_tier_name?: string | null
  pricing_tier_price_cents?: number | null
  athlete_email: string
}

type CategoryItem = {
  id: string
  event_id: string
  name: string
  is_active: boolean
}

type PricingTierItem = {
  id: string
  category_id: string
  name: string
  price_cents: number
  starts_at?: string | null
  ends_at?: string | null
  sort_order: number
  is_active: boolean
}

type RegistrationRpcResult = {
  id: string
}

const readinessMessages: Record<RegistrationReadinessCode, string> = {
  email_not_verified: 'Vérifie ton email pour activer les futures inscriptions.',
  missing_first_name: 'Ajoute ton prénom dans le profil athlète.',
  missing_last_name: 'Ajoute ton nom dans le profil athlète.',
  missing_date_of_birth: 'Ajoute ta date de naissance dans le profil athlète.',
  missing_country: 'Ajoute ton pays de résidence dans le profil athlète.',
}

export default function AthletePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [events, setEvents] = useState<EventItem[]>([])
  const [registrations, setRegistrations] = useState<RegistrationDetail[]>([])
  const [requiresVerification, setRequiresVerification] = useState(false)
  const [profileFeedback, setProfileFeedback] = useState('')
  const [profilePhotoUploading, setProfilePhotoUploading] = useState(false)
  const [registrationFeedback, setRegistrationFeedback] = useState('')
  const [registrationError, setRegistrationError] = useState('')
  const [submittingCategoryId, setSubmittingCategoryId] = useState<string | null>(null)
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    affiliate: '',
    city: '',
    country: '',
  })

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    setProfile(data)
    if (data) {
      setProfileForm({
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        dateOfBirth: data.date_of_birth || '',
        affiliate: data.affiliate || '',
        city: data.city || '',
        country: data.country || '',
      })
    }
  }

  const uploadProfilePhoto = async (file: File) => {
    if (!user) return
    setProfileFeedback('')
    setProfilePhotoUploading(true)

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filePath = `${user.id}/avatar-${Date.now()}.${extension}`

    const { error: uploadError } = await supabase.storage
      .from('athlete-profile-photos')
      .upload(filePath, file, {
        upsert: true,
      })

    if (uploadError) {
      setProfileFeedback('Impossible de téléverser la photo de profil.')
      setProfilePhotoUploading(false)
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from('athlete-profile-photos')
      .getPublicUrl(filePath)

    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({
        profile_photo_url: publicUrlData.publicUrl,
      })
      .eq('id', user.id)

    if (profileUpdateError) {
      setProfileFeedback('Photo envoyée, mais impossible de mettre à jour le profil.')
      setProfilePhotoUploading(false)
      return
    }

    await loadProfile(user.id)
    setProfileFeedback('Photo de profil mise à jour.')
    setProfilePhotoUploading(false)
  }

  const saveProfile = async () => {
    if (!user) return
    setProfileFeedback('')

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: profileForm.firstName || null,
        last_name: profileForm.lastName || null,
        date_of_birth: profileForm.dateOfBirth || null,
        affiliate: profileForm.affiliate || null,
        city: profileForm.city || null,
        country: profileForm.country || null,
        profile_photo_url: profile?.profile_photo_url || null,
      })
      .eq('id', user.id)

    if (error) {
      setProfileFeedback('Impossible de sauvegarder le profil pour le moment.')
      return
    }

    await loadProfile(user.id)
    setProfileFeedback('Profil athlète mis à jour.')
  }

  const loadPublishedEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .order('start_date', { ascending: true })

    setEvents((data || []) as EventItem[])
  }

  const loadEventCategories = async (eventIds: string[]) => {
    if (eventIds.length === 0) return {}

    const { data: categories } = await supabase
      .from('event_categories')
      .select('id, event_id, name, is_active')
      .in('event_id', eventIds)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    const categoryRows = (categories || []) as CategoryItem[]
    const categoryIds = categoryRows.map((category) => category.id)

    if (categoryIds.length === 0) return {}

    const { data: pricingTiers } = await supabase
      .from('category_pricing_tiers')
      .select('id, category_id, name, price_cents, starts_at, ends_at, sort_order, is_active')
      .in('category_id', categoryIds)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    const now = new Date()
    const activeTierByCategory = new Map<string, PricingTierItem>()

    ;((pricingTiers || []) as PricingTierItem[]).forEach((tier) => {
      const startsAtValid = !tier.starts_at || new Date(tier.starts_at) <= now
      const endsAtValid = !tier.ends_at || new Date(tier.ends_at) >= now
      if (!startsAtValid || !endsAtValid) return

      const current = activeTierByCategory.get(tier.category_id)
      if (!current || tier.sort_order < current.sort_order) {
        activeTierByCategory.set(tier.category_id, tier)
      }
    })

    return categoryRows.reduce<Record<string, Array<CategoryItem & { pricingTier: PricingTierItem | null }>>>(
      (acc, category) => {
        if (!acc[category.event_id]) acc[category.event_id] = []
        acc[category.event_id].push({
          ...category,
          pricingTier: activeTierByCategory.get(category.id) || null,
        })
        return acc
      },
      {}
    )
  }

  const loadRegistrations = async (userId: string) => {
    const { data } = await supabase
      .from('registration_details')
      .select('*')
      .order('created_at', { ascending: false })

    const ownRegistrations = (data || []).filter(
      (item) => item.athlete_id === userId
    )
    setRegistrations(ownRegistrations as RegistrationDetail[])
  }

  const createRegistration = async (eventId: string, categoryId: string) => {
    if (!user || !registrationReadiness.ready) {
      setRegistrationError('Complète les pré-requis de readiness avant de t’inscrire.')
      return
    }

    setRegistrationFeedback('')
    setRegistrationError('')
    setSubmittingCategoryId(categoryId)

    const { data, error } = await supabase.rpc('create_athlete_registration', {
      p_event_id: eventId,
      p_category_id: categoryId,
    })

    if (error) {
      const message = error.message || ''
      if (message.includes('REGISTRATION_ALREADY_EXISTS')) {
        setRegistrationError('Tu es déjà inscrit à cette catégorie pour cet événement.')
      } else if (message.includes('NO_ACTIVE_PRICING_TIER')) {
        setRegistrationError('Cette catégorie ne propose pas de tarif actif pour le moment.')
      } else if (message.includes('EVENT_NOT_PUBLISHED') || message.includes('CATEGORY_NOT_ELIGIBLE')) {
        setRegistrationError('Cette catégorie n’est plus disponible pour l’inscription.')
      } else if (message.includes('PROFILE_INCOMPLETE') || message.includes('EMAIL_NOT_VERIFIED')) {
        setRegistrationError('Ton compte n’est pas encore prêt pour l’inscription.')
      } else {
        setRegistrationError('Impossible de finaliser l’inscription pour le moment.')
      }
      setSubmittingCategoryId(null)
      return
    }

    const created = (data || null) as RegistrationRpcResult | null
    if (!created?.id) {
      setRegistrationError('Impossible de finaliser l’inscription pour le moment.')
      setSubmittingCategoryId(null)
      return
    }

    await loadRegistrations(user.id)
    setRegistrationFeedback('Inscription créée avec succès.')
    setSubmittingCategoryId(null)
  }

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)

      if (data.user) {
        if (!isEmailVerified(data.user)) {
          setRequiresVerification(true)
          return
        }

        await loadProfile(data.user.id)
        await loadPublishedEvents()
        await loadRegistrations(data.user.id)
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
        if (!isEmailVerified(data.user)) {
          setRequiresVerification(true)
          return
        }

        await loadProfile(data.user.id)
        await loadPublishedEvents()
        await loadRegistrations(data.user.id)
      }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRequiresVerification(false)
    setProfile(null)
    setEvents([])
    setRegistrations([])
  }

  const upcomingRegistrations = useMemo(() => registrations.length, [registrations])
  const upcomingEventsCount = useMemo(
    () => events.filter((event) => new Date(event.start_date) >= new Date()).length,
    [events]
  )
  const registrationsByEventAndCategory = useMemo(() => {
    return new Set(registrations.map((item) => `${item.event_id}:${item.category_id}`))
  }, [registrations])
  const [categoriesByEvent, setCategoriesByEvent] = useState<
    Record<string, Array<CategoryItem & { pricingTier: PricingTierItem | null }>>
  >({})
  const registrationReadiness = getRegistrationReadiness({
    isEmailVerified: isEmailVerified(user),
    profile: {
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      dateOfBirth: profileForm.dateOfBirth,
      country: profileForm.country,
    },
  })
  const readinessMissingSet = useMemo(
    () => new Set(registrationReadiness.missing),
    [registrationReadiness.missing]
  )
  const availableCategoryCount = useMemo(
    () =>
      events.reduce((total, event) => total + ((categoriesByEvent[event.id] || []).length), 0),
    [categoriesByEvent, events]
  )
  const profileChecklist = [
    {
      label: 'Email vérifié',
      done: isEmailVerified(user),
      hint: readinessMessages.email_not_verified,
    },
    {
      label: 'Prénom',
      done: !readinessMissingSet.has('missing_first_name'),
      hint: readinessMessages.missing_first_name,
    },
    {
      label: 'Nom',
      done: !readinessMissingSet.has('missing_last_name'),
      hint: readinessMessages.missing_last_name,
    },
    {
      label: 'Date de naissance',
      done: !readinessMissingSet.has('missing_date_of_birth'),
      hint: readinessMessages.missing_date_of_birth,
    },
    {
      label: 'Pays',
      done: !readinessMissingSet.has('missing_country'),
      hint: readinessMessages.missing_country,
    },
  ]

  useEffect(() => {
    const loadCategories = async () => {
      const grouped = await loadEventCategories(events.map((event) => event.id))
      setCategoriesByEvent(grouped)
    }

    loadCategories()
  }, [events])

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <SiteHeader />
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md items-center px-6 py-16">
          <div className="w-full rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/30">
            <div className="inline-flex rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-200">
              Connexion athlète
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-white">
              Accéder à ton espace athlète
            </h1>
            <p className="mt-3 text-slate-300">
              Suis tes inscriptions et découvre les compétitions disponibles.
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

  if (!profile || profile.role !== 'athlete') {
    if (requiresVerification) {
      return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
          <SiteHeader />
          <div className="mx-auto max-w-3xl px-6 py-16">
            <div className="rounded-[28px] border border-amber-400/25 bg-amber-500/10 p-8">
              <h1 className="text-3xl font-semibold text-white">
                Vérification email requise
              </h1>
              <p className="mt-3 text-slate-200">
                Vérifie ton email via le lien reçu avant d’accéder au parcours
                athlète et aux futures inscriptions.
              </p>
              <button
                onClick={logout}
                className="mt-6 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white"
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
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
            <h1 className="text-3xl font-semibold text-white">
              Accès refusé
            </h1>
            <p className="mt-3 text-slate-300">
              Ce compte ne dispose pas des permissions athlète.
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
              Tableau de bord athlète
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
              Suis tes compétitions
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              Garde tes inscriptions visibles, consulte les événements publiés
              et reste prêt pour la prochaine compétition.
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
            <UserCircle2 className="h-5 w-5 text-sky-300" />
            <div className="mt-4 text-lg font-semibold text-white">
              {profile.email}
            </div>
            <div className="mt-1 text-sm text-slate-400">
              Compte connecté
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <Ticket className="h-5 w-5 text-fuchsia-300" />
            <div className="mt-4 text-3xl font-semibold text-white">
              {upcomingRegistrations}
            </div>
            <div className="mt-1 text-sm text-slate-400">
              Mes inscriptions
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <Trophy className="h-5 w-5 text-emerald-300" />
            <div className="mt-4 text-3xl font-semibold text-white">
              {events.length}
            </div>
            <div className="mt-1 text-sm text-slate-400">
              Événements publiés
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-start gap-3">
              <MailCheck className="mt-0.5 h-5 w-5 text-sky-300" />
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Compte et vérification
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  Vérifie rapidement l’état de ton compte avant de gérer ton inscription.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  Vérification email
                </div>
                <div
                  className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                    isEmailVerified(user)
                      ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
                      : 'border-amber-400/30 bg-amber-500/10 text-amber-200'
                  }`}
                >
                  {isEmailVerified(user) ? 'Email vérifié' : 'Email à vérifier'}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  Prochaine action
                </div>
                <p className="mt-2 text-sm text-slate-200">
                  {registrationReadiness.ready
                    ? 'Ton compte est prêt. Tu peux choisir une catégorie et t’inscrire.'
                    : 'Complète les éléments signalés dans la section readiness ci-dessous.'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Readiness inscription
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  Validation rapide des prérequis avant inscription.
                </p>
              </div>
            </div>

            <div
              className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
                registrationReadiness.ready
                  ? 'border-emerald-400/25 bg-emerald-500/10 text-emerald-100'
                  : 'border-amber-400/25 bg-amber-500/10 text-amber-100'
              }`}
            >
              <p className="font-semibold">
                {registrationReadiness.ready
                  ? 'Prêt pour inscription.'
                  : 'Profil incomplet : complète les éléments manquants.'}
              </p>
            </div>

            <div className="mt-5 space-y-2">
              {profileChecklist.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2"
                >
                  <div>
                    <div className="text-sm font-medium text-white">{item.label}</div>
                    {!item.done && (
                      <div className="mt-1 text-xs text-amber-200">{item.hint}</div>
                    )}
                  </div>
                  <span
                    className={`mt-0.5 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      item.done
                        ? 'border border-emerald-400/25 bg-emerald-500/10 text-emerald-200'
                        : 'border border-amber-400/25 bg-amber-500/10 text-amber-200'
                    }`}
                  >
                    {item.done ? 'OK' : 'À faire'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Profil athlète
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Mets à jour tes informations personnelles avant de lancer une inscription.
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                registrationReadiness.ready
                  ? 'border border-emerald-400/25 bg-emerald-500/10 text-emerald-200'
                  : 'border border-amber-400/25 bg-amber-500/10 text-amber-200'
              }`}
            >
              {registrationReadiness.ready
                ? 'Profil prêt pour la suite'
                : 'Profil incomplet pour l’inscription'}
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[220px_1fr]">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-slate-900">
                {profile?.profile_photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.profile_photo_url}
                    alt="Photo de profil athlète"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserCircle2 className="h-14 w-14 text-slate-400" />
                )}
              </div>
              <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10">
                <Camera className="h-4 w-4" />
                {profilePhotoUploading ? 'Envoi en cours...' : 'Importer une photo'}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  disabled={profilePhotoUploading}
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) {
                      void uploadProfilePhoto(file)
                    }
                  }}
                />
              </label>
              <p className="mt-2 text-center text-[11px] text-slate-400">
                JPG, PNG ou WEBP · max 5 Mo
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                  placeholder="Prénom"
                  value={profileForm.firstName}
                  onChange={(e) =>
                    setProfileForm((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                />
                <input
                  className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                  placeholder="Nom"
                  value={profileForm.lastName}
                  onChange={(e) =>
                    setProfileForm((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                />
                <input
                  className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                  placeholder="Date de naissance"
                  type="date"
                  value={profileForm.dateOfBirth}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      dateOfBirth: e.target.value,
                    }))
                  }
                />
                <input
                  className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                  placeholder="Pays"
                  value={profileForm.country}
                  onChange={(e) =>
                    setProfileForm((prev) => ({ ...prev, country: e.target.value }))
                  }
                />
                <input
                  className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                  placeholder="Affiliate / Box"
                  value={profileForm.affiliate}
                  onChange={(e) =>
                    setProfileForm((prev) => ({ ...prev, affiliate: e.target.value }))
                  }
                />
                <input
                  className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                  placeholder="Ville"
                  value={profileForm.city}
                  onChange={(e) =>
                    setProfileForm((prev) => ({ ...prev, city: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          {profileFeedback && (
            <div className="mt-4 rounded-xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
              {profileFeedback}
            </div>
          )}

          <button
            onClick={saveProfile}
            className="mt-6 rounded-xl bg-gradient-to-r from-fuchsia-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white"
          >
            Enregistrer mon profil
          </button>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-sky-300" />
                <h2 className="text-2xl font-semibold text-white">
                  Événements et catégories disponibles
                </h2>
              </div>
              <div className="text-right text-xs text-slate-300">
                <div>{upcomingEventsCount} événements à venir</div>
                <div>{availableCategoryCount} catégories actives</div>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Choisis une catégorie avec un tarif actif pour créer ton inscription.
            </p>

            <div className="mt-6 space-y-4">
              {registrationError && (
                <div className="rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                  {registrationError}
                </div>
              )}
              {registrationFeedback && (
                <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                  {registrationFeedback}
                </div>
              )}

              {events.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 text-slate-300">
                  Aucun événement publié pour le moment.
                </div>
              )}

              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-lg font-semibold text-white">
                        {event.name}
                      </div>
                      <div className="mt-1 text-sm text-slate-400">
                        {event.start_date} → {event.end_date}
                      </div>
                    </div>
                    <span className="inline-flex rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-100">
                      Publié
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {(categoriesByEvent[event.id] || []).length === 0 && (
                      <div className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
                        Catégories indisponibles pour le moment.
                      </div>
                    )}
                    {(categoriesByEvent[event.id] || []).map((category) => {
                      const isAlreadyRegistered = registrationsByEventAndCategory.has(
                        `${event.id}:${category.id}`
                      )
                      const registrationBlocked =
                        !registrationReadiness.ready || !category.pricingTier
                      const disabled =
                        registrationBlocked ||
                        isAlreadyRegistered ||
                        submittingCategoryId === category.id

                      return (
                        <div
                          key={category.id}
                          className="rounded-xl border border-white/10 bg-slate-900/70 p-4"
                        >
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                              <div className="text-sm font-semibold text-white">
                                {category.name}
                              </div>
                              <div className="mt-1 text-xs text-slate-300">
                                {category.pricingTier
                                  ? `${category.pricingTier.name} · ${(category.pricingTier.price_cents / 100).toFixed(2)} €`
                                  : 'Aucun tarif actif'}
                              </div>
                              {registrationBlocked && !isAlreadyRegistered && (
                                <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-amber-200">
                                  <AlertTriangle className="h-3.5 w-3.5" />
                                  {!registrationReadiness.ready
                                    ? 'Readiness incomplète'
                                    : 'Tarif actif manquant'}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => createRegistration(event.id, category.id)}
                              disabled={disabled}
                              className="rounded-lg bg-gradient-to-r from-fuchsia-500 to-sky-500 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {isAlreadyRegistered
                                ? 'Déjà inscrit'
                                : submittingCategoryId === category.id
                                  ? 'Inscription...'
                                  : 'M’inscrire'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <Medal className="h-5 w-5 text-fuchsia-300" />
              <h2 className="text-2xl font-semibold text-white">
                Mes inscriptions
              </h2>
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Historique de tes inscriptions validées depuis le dashboard.
            </p>

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
                  <div className="text-lg font-semibold text-white">
                    {registration.event_name}
                  </div>
                  <div className="mt-2 text-sm text-slate-300">
                    {registration.category_name}
                  </div>
                  {registration.pricing_tier_name && (
                    <div className="mt-1 text-xs text-slate-400">
                      {registration.pricing_tier_name} ·{' '}
                      {((registration.pricing_tier_price_cents || 0) / 100).toFixed(2)} €
                    </div>
                  )}
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
            href="/events"
            className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white"
          >
            Parcourir les événements
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
