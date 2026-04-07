import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'
import {
  CalendarDays,
  MapPin,
  BadgeDollarSign,
  ArrowRight,
  Trophy,
} from 'lucide-react'

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
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-100">
            Error loading events
          </div>
        </div>
      </main>
    )
  }

  const pricingByCategory: Record<string, PricingTier[]> = {}

  pricing?.forEach((p) => {
    if (!pricingByCategory[p.category_id]) {
      pricingByCategory[p.category_id] = []
    }
    pricingByCategory[p.category_id].push(p)
  })

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-x-0 top-0 -z-10 overflow-hidden">
        <div className="mx-auto h-[320px] max-w-7xl">
          <div className="absolute left-[-100px] top-[-60px] h-64 w-64 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <div className="absolute right-[-60px] top-[-30px] h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-200">
            Published events
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Discover current CrossFit competitions
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Explore published events, compare categories and see the active
            pricing tier currently available.
          </p>
        </div>

        <div className="mt-12 grid gap-8">
          {events?.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
              No published events yet.
            </div>
          )}

          {events?.map((event: EventRow) => (
            <div
              key={event.id}
              className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {event.name}
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1.5">
                      <CalendarDays className="h-4 w-4 text-sky-300" />
                      {event.start_date} → {event.end_date}
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1.5">
                      <Trophy className="h-4 w-4 text-fuchsia-300" />
                      {event.event_categories.length} categories
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Link
                    href="/athlete"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Athlete area
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {event.event_categories.map((cat) => {
                  const active = getActivePrice(pricingByCategory[cat.id] || [])

                  return (
                    <div
                      key={cat.id}
                      className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
                    >
                      <div className="text-lg font-semibold text-white">
                        {cat.name}
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 text-sm text-slate-400">
                          <BadgeDollarSign className="h-4 w-4 text-sky-300" />
                          Active price
                        </div>
                        <div className="text-right">
                          {active ? (
                            <>
                              <div className="font-semibold text-white">
                                {active.price_cents / 100}€
                              </div>
                              <div className="text-xs text-fuchsia-300">
                                {active.name}
                              </div>
                            </>
                          ) : (
                            <div className="text-sm text-slate-400">
                              No active price
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Back home
          </Link>
          <Link
            href="/organizer"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
          >
            Organizer space
          </Link>
        </div>
      </section>
    </main>
  )
}