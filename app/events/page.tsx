import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { SiteHeader } from '../../components/marketing/site-header'
import { SiteFooter } from '../../components/marketing/site-footer'
import { EventCard } from '../../components/events/event-card'

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
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <SiteHeader />
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-100">
            Erreur lors du chargement des événements
          </div>
        </div>
        <SiteFooter />
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

      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-200">
            Événements publiés
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Découvre les compétitions CrossFit en cours
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Explore les événements publiés, compare les catégories et consulte
            le palier tarifaire actuellement actif.
          </p>
        </div>

        <div className="mt-12 grid gap-8">
          {events?.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
              Aucun événement publié pour le moment.
            </div>
          )}

          {events?.map((event: EventRow) => (
            <EventCard
              key={event.id}
              name={event.name}
              startDate={event.start_date}
              endDate={event.end_date}
              categories={event.event_categories.map((cat) => ({
                id: cat.id,
                name: cat.name,
                activePrice: getActivePrice(pricingByCategory[cat.id] || []),
              }))}
            />
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Retour à l’accueil
          </Link>
          <Link
            href="/organizer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
          >
            Espace organisateur
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}