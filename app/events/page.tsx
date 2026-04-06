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
}

type Category = {
  id: string
  name: string
}

type EventRow = {
  id: string
  name: string
  start_date: string
  end_date: string
  event_categories: Category[]
}

function getActivePrice(pricing: PricingTier[]) {
  const now = new Date()

  return pricing
    .filter((p) => p.is_active)
    .filter((p) => {
      if (p.starts_at && new Date(p.starts_at) > now) return false
      if (p.ends_at && new Date(p.ends_at) < now) return false
      return true
    })
    .sort((a, b) => a.sort_order - b.sort_order)[0]
}

export default async function EventsPage() {
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select(`
      id,
      name,
      start_date,
      end_date,
      event_categories (
        id,
        name
      )
    `)
    .eq('status', 'published')
    .order('start_date', { ascending: true })

  const { data: pricing, error: pricingError } = await supabase
    .from('category_pricing_tiers')
    .select(`
      id,
      category_id,
      name,
      price_cents,
      starts_at,
      ends_at,
      sort_order,
      is_active
    `)
    .eq('is_active', true)

  if (eventsError || pricingError) {
    return <div style={{ padding: 40 }}>Error loading data</div>
  }

  const pricingByCategory: Record<string, PricingTier[]> = {}

  pricing?.forEach((p) => {
    if (!pricingByCategory[p.category_id]) {
      pricingByCategory[p.category_id] = []
    }
    pricingByCategory[p.category_id].push(p)
  })

  return (
    <div style={{ padding: 40 }}>
      <h1>Events</h1>

      {events?.map((event: EventRow) => (
        <div key={event.id} style={{ marginBottom: 24 }}>
          <h2>
            {event.name} — {event.start_date} → {event.end_date}
          </h2>

          {event.event_categories.map((cat) => {
            const active = getActivePrice(pricingByCategory[cat.id] || [])

            return (
              <div key={cat.id} style={{ marginLeft: 20 }}>
                {cat.name} — {active ? `${active.price_cents / 100}€ (${active.name})` : 'No active price'}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}