import Link from 'next/link'
import type { ComponentType } from 'react'
import {
  CalendarDays,
  ClipboardList,
  Layers3,
  Rocket,
  Users,
  Trophy,
  BadgeDollarSign,
  Activity,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Eye,
  Zap,
} from 'lucide-react'
import { SiteHeader } from '../components/marketing/site-header'
import { SiteFooter } from '../components/marketing/site-footer'

type Feature = {
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
}

type Step = {
  number: string
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
}

type Role = {
  title: string
  description: string
  href: string
  cta: string
  icon: ComponentType<{ className?: string }>
}

type PreviewEvent = {
  title: string
  date: string
  location: string
  categories: { name: string; price: string; tag: string }[]
}

const features: Feature[] = [
  {
    title: 'Événements standardisés',
    description:
      'Publie des compétitions CrossFit comparables, structurées et immédiatement lisibles pour les athlètes comme pour les organisateurs.',
    icon: ClipboardList,
  },
  {
    title: 'Catégories et divisions',
    description:
      'Gère les formats individuels et team, les divisions, les catégories et les règles d’inscription sans bricolage.',
    icon: Layers3,
  },
  {
    title: 'Tarification pilotée',
    description:
      'Affiche des tarifs clairs par catégorie avec early bird, regular et capacités par palier.',
    icon: BadgeDollarSign,
  },
  {
    title: 'Prêt pour le live',
    description:
      'Le socle prépare la suite : qualifications, scoring live, leaderboard, planning et heats.',
    icon: Activity,
  },
]

const steps: Step[] = [
  {
    number: '01',
    title: 'Créer la compétition',
    description:
      'L’organisateur définit l’événement, les dates, les catégories et le cadre de publication.',
    icon: CalendarDays,
  },
  {
    number: '02',
    title: 'Publier catégories et tarifs',
    description:
      'Chaque catégorie porte ses règles, ses formats et ses paliers tarifaires selon dates ou quotas.',
    icon: BadgeDollarSign,
  },
  {
    number: '03',
    title: 'Ouvrir les inscriptions',
    description:
      'Les athlètes consultent les événements, choisissent une catégorie et voient le bon prix actif.',
    icon: Users,
  },
  {
    number: '04',
    title: 'Préparer l’exploitation',
    description:
      'La plateforme sert ensuite de base vers qualifications, scoring live et leaderboard.',
    icon: Rocket,
  },
]

const roles: Role[] = [
  {
    title: 'Organisateur',
    description:
      'Créer des événements, structurer les catégories, publier les tarifs et piloter les inscriptions.',
    href: '/organizer',
    cta: 'Gérer un événement',
    icon: ShieldCheck,
  },
  {
    title: 'Athlète',
    description:
      'Parcourir les compétitions, comparer les catégories, s’inscrire et suivre ses engagements.',
    href: '/athlete',
    cta: 'Accéder à mon espace',
    icon: Trophy,
  },
  {
    title: 'Public',
    description:
      'Découvrir les événements publiés, comprendre les formats et suivre l’activité de la compétition.',
    href: '/events',
    cta: 'Voir les événements',
    icon: Eye,
  },
]

const previewEvents: PreviewEvent[] = [
  {
    title: 'Paris Throwdown',
    date: '12–13 Septembre 2026',
    location: 'Paris',
    categories: [
      { name: 'Individual RX Women', price: '39€', tag: 'Early Bird' },
      { name: 'Individual RX Men', price: '39€', tag: 'Early Bird' },
      { name: 'Team of 2 FH', price: '79€', tag: 'Regular' },
    ],
  },
  {
    title: 'Lyon Clash',
    date: '3 Octobre 2026',
    location: 'Lyon',
    categories: [
      { name: 'Scaled Men', price: '29€', tag: 'Early Bird' },
      { name: 'Scaled Women', price: '29€', tag: 'Early Bird' },
      { name: 'Team of 4 FFHH', price: '149€', tag: 'Places limitées' },
    ],
  },
]

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="max-w-2xl">
      <div className="mb-3 inline-flex rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-200">
        {eyebrow}
      </div>
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
        {description}
      </p>
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-x-0 top-0 -z-10 overflow-hidden">
        <div className="mx-auto h-[420px] max-w-7xl">
          <div className="absolute left-[-120px] top-[-80px] h-72 w-72 rounded-full bg-fuchsia-600/25 blur-3xl" />
          <div className="absolute right-[-80px] top-[-40px] h-80 w-80 rounded-full bg-sky-500/25 blur-3xl" />
          <div className="absolute left-1/2 top-20 h-52 w-52 -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />
        </div>
      </div>

      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Publication, inscriptions, catégories, paliers tarifaires
            </div>

            <h1 className="mt-8 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              La plateforme{' '}
              <span className="bg-gradient-to-r from-fuchsia-400 via-pink-300 to-sky-300 bg-clip-text text-transparent">
                CrossFit
              </span>{' '}
              qui donne une vraie structure aux compétitions.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              CompCF aide les organisateurs à publier des événements propres,
              gérer les catégories, ouvrir les inscriptions et afficher des
              tarifs lisibles par palier. Une base sérieuse pour passer ensuite
              aux qualifications, au scoring live et aux leaderboards.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/events"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.02]"
              >
                Voir les événements
              </Link>
              <Link
                href="/organizer"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Créer ou gérer un événement
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                Événements publiés
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                Catégories & divisions
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                Early bird & tarifs
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                Prêt pour le scoring live
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-fuchsia-500/20 via-transparent to-sky-500/20 blur-2xl" />
            <div className="relative rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-sky-950/40 backdrop-blur">
              <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Événement mis en avant
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-white">
                      Unicorn Throwdown
                    </div>
                    <div className="mt-1 text-sm text-slate-400">
                      Paris · 12–13 Septembre 2026
                    </div>
                  </div>
                  <div className="rounded-full border border-fuchsia-400/25 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-200">
                    Publié
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-medium text-white">
                          Individual RX Women
                        </div>
                        <div className="mt-1 text-sm text-slate-400">
                          Early Bird actif · capacité par palier
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">39€</div>
                        <div className="text-xs text-sky-300">Early Bird</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-medium text-white">
                          Team of 2 FH
                        </div>
                        <div className="mt-1 text-sm text-slate-400">
                          Catégorie team standardisée
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">79€</div>
                        <div className="text-xs text-pink-300">Regular</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-dashed border-white/15 bg-slate-900/50 p-4 text-sm text-slate-300">
                    Qualifications, paiements, scoring live et leaderboard sont
                    déjà anticipés par le modèle produit.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <SectionTitle
            eyebrow="Pourquoi CompCF"
            title="Un socle produit propre pour des compétitions mieux publiées, mieux lues, mieux gérées."
            description="CompCF ne se limite pas à afficher une liste d’événements. La plateforme structure le modèle compétition, les catégories, les inscriptions et la tarification pour rendre l’expérience plus claire dès le premier contact."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-sky-500/20">
                    <Icon className="h-6 w-6 text-sky-200" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow="Comment ça marche"
          title="Un flux simple pour transformer une idée de compétition en produit exploitable."
          description="Le prototype raconte déjà un parcours net, de la création d’événement à la préparation du terrain opérationnel."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-sky-300">
                    {step.number}
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/15 to-sky-500/15">
                    <Icon className="h-5 w-5 text-fuchsia-200" />
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <SectionTitle
            eyebrow="Rôles"
            title="Pensé pour l’organisateur, l’athlète et le public."
            description="Chaque acteur retrouve un parcours simple et cohérent, sans perdre la rigueur métier propre aux compétitions CrossFit."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <div
                  key={role.title}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/15 to-sky-500/15">
                      <Icon className="h-5 w-5 text-sky-200" />
                    </div>
                    <div className="inline-flex rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300">
                      {role.title}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {role.description}
                  </p>
                  <Link
                    href={role.href}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
                  >
                    {role.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow="Aperçu"
          title="Un aperçu de ce que le produit rend visible."
          description="Le prototype montre déjà la structure événement, les catégories et la logique de tarification sans attendre le scoring live."
        />

        <div className="mt-12 grid gap-6 xl:grid-cols-2">
          {previewEvents.map((event) => (
            <div
              key={event.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {event.date} · {event.location}
                  </p>
                </div>
                <div className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
                  Ouvert
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {event.categories.map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3"
                  >
                    <div>
                      <div className="font-medium text-white">
                        {category.name}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        Palier tarifaire actuellement disponible
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">
                        {category.price}
                      </div>
                      <div className="text-xs text-fuchsia-300">
                        {category.tag}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8 lg:pb-24">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-r from-fuchsia-600/20 via-violet-500/10 to-sky-500/20 p-8 shadow-2xl shadow-fuchsia-950/20 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                <Sparkles className="h-3.5 w-3.5" />
                Prêt à explorer
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Passe d’une idée de compétition à une expérience produit qui
                donne envie d’aller plus loin.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">
                Découvre les événements publiés, teste les parcours existants et
                pose les bases d’une plateforme CrossFit prête à monter en
                puissance.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                <Zap className="h-4 w-4" />
                Explorer les événements
              </Link>
              <Link
                href="/organizer"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Ouvrir l’espace organisateur
              </Link>
              <div className="flex items-center justify-center gap-4 pt-2 text-sm text-slate-300">
                <Link href="/athlete" className="hover:text-white">
                  Athlète
                </Link>
                <Link href="/admin" className="hover:text-white">
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}