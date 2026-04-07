'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type PricingTier = {
  id: string
  category_id: string
  name: string
  price_cents: number
  starts_at: string | null
  ends_at: string | null
  sort_order: number
  is_active: boolean
  max_registrations: number | null
}

type Category = {
  id: string
  name: string
  max_registrations: number | null
}

type EventRow = {
  id: string
  name: string
  start_date: string
  end_date: string
  event_categories: Category[]
}

type CategoryRegistrationCount = {
  category_id: string
  registrations_count: number
}

type PricingTierRegistrationCount = {
  pricing_tier_id: string
  registrations_count: number
}

function getAvailablePrice(
  pricing: PricingTier[],
  categoryCount: number,
  categoryMax: number | null,
  tierCounts: Record<string, number>
) {
  const now = new Date()

  const categoryIsFull =
    categoryMax !== null && categoryCount >= categoryMax

  if (categoryIsFull) return null

  return pricing
    .filter((p) => p.is_active)
    .filter((p) => {
      if (p.starts_at && new Date(p.starts_at) > now) return false
      if (p.ends_at && new Date(p.ends_at) < now) return false

      const tierCount = tierCounts[p.id] || 0
      if (p.max_registrations !== null && tierCount >= p.max_registrations) {
        return false
      }

      return true
    })
    .sort((a, b) => a.sort_order - b.sort_order)[0]
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventRow[]>([])
  const [pricing, setPricing] = useState<PricingTier[]>([])
  const [categoryCounts, setCategoryCounts] = useState<CategoryRegistrationCount[]>([])
  const [tierCounts, setTierCounts] = useState<PricingTierRegistrationCount[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadData = async () => {
    setLoading(true)

    const { data: userData } = await supabase.auth.getUser()
    setUser(userData.user)

    const { data: eventsData } = await supabase
      .from('events')
      .select(`
        id,
        name,
        start_date,
        end_date,
        event_categories (
          id,
          name,
          max_registrations
        )
      `)
      .eq('status', 'published')
      .order('start_date', { ascending: true })

    const { data: pricingData } = await supabase
      .from('category_pricing_tiers')
      .select(`
        id,
        category_id,
        name,
        price_cents,
        starts_at,
        ends_at,
        sort_order,
        is_active,
        max_registrations
      `)
      .eq('is_active', true)

    const { data: categoryCountsData } = await supabase
      .from('category_registration_counts')
      .select('*')

    const { data: tierCountsData } = await supabase
      .from('pricing_tier_registration_counts')
      .select('*')

    setEvents(eventsData || [])
    setPricing(pricingData || [])
    setCategoryCounts(categoryCountsData || [])
    setTierCounts(tierCountsData || [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const pricingByCategory: Record<string, PricingTier[]> = {}
  const categoryCountByCategory: Record<string, number> = {}
  const tierCountByTier: Record<string, number> = {}

  pricing.forEach((p) => {
    if (!pricingByCategory[p.category_id]) {
      pricingByCategory[p.category_id] = []
    }
    pricingByCategory[p.category_id].push(p)
  })

  categoryCounts.forEach((c) => {
    categoryCountByCategory[c.category_id] = c.registrations_count
  })

  tierCounts.forEach((c) => {
    tierCountByTier[c.pricing_tier_id] = c.registrations_count
  })

  const registerForCategory = async (categoryId: string) => {
    setMessage('')

    if (!user) {
      setMessage('Login required')
      return
    }

    const { error } = await supabase.rpc('register_for_category', {
      p_athlete_id: user.id,
      p_category_id: categoryId,
    })

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('Registration created')
    await loadData()
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Events</h1>

      {message && <div style={{ marginBottom: 20 }}>{message}</div>}
      {loading && <div>Loading...</div>}

      {!loading &&
        events.map((event) => (
          <div key={event.id} style={{ marginBottom: 24 }}>
            <h2>
              {event.name} — {event.start_date} → {event.end_date}
            </h2>

            {event.event_categories.map((cat) => {
              const categoryCount = categoryCountByCategory[cat.id] || 0
              const active = getAvailablePrice(
                pricingByCategory[cat.id] || [],
                categoryCount,
                cat.max_registrations,
                tierCountByTier
              )

              const categoryIsFull =
                cat.max_registrations !== null &&
                categoryCount >= cat.max_registrations

              return (
                <div key={cat.id} style={{ marginLeft: 20, marginBottom: 8 }}>
                  {cat.name} —{' '}
                  {active
                    ? `${active.price_cents / 100}€ (${active.name})`
                    : categoryIsFull
                    ? 'FULL'
                    : 'No active price'}{' '}
                  — {categoryCount}
                  {cat.max_registrations !== null
                    ? ` / ${cat.max_registrations}`
                    : ''}{' '}
                  <button
                    onClick={() => registerForCategory(cat.id)}
                    disabled={!user || !active}
                  >
                    {user ? 'Register' : 'Login required'}
                  </button>
                </div>
              )
            })}
          </div>
        ))}
    </div>
  )
}