import { BadgeDollarSign, CalendarDays, Trophy } from 'lucide-react'

type PricingTier = {
  name: string
  price_cents: number
}

type EventCategory = {
  id: string
  name: string
  activePrice?: PricingTier | null
}

type EventCardProps = {
  name: string
  startDate: string
  endDate: string
  categories: EventCategory[]
}

export function EventCard({
  name,
  startDate,
  endDate,
  categories,
}: EventCardProps) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">{name}</h2>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1.5">
              <CalendarDays className="h-4 w-4 text-sky-300" />
              {startDate} → {endDate}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1.5">
              <Trophy className="h-4 w-4 text-fuchsia-300" />
              {categories.length} catégories
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
          >
            <div className="text-lg font-semibold text-white">{cat.name}</div>

            <div className="mt-4 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-sm text-slate-400">
                <BadgeDollarSign className="h-4 w-4 text-sky-300" />
                Prix actif
              </div>
              <div className="text-right">
                {cat.activePrice ? (
                  <>
                    <div className="font-semibold text-white">
                      {cat.activePrice.price_cents / 100}€
                    </div>
                    <div className="text-xs text-fuchsia-300">
                      {cat.activePrice.name}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-slate-400">
                    Aucun prix actif
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}