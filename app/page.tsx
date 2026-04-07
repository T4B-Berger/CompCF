import Link from 'next/link'

type Feature = {
  title: string
  description: string
}

type Step = {
  number: string
  title: string
  description: string
}

type Role = {
  title: string
  description: string
  href: string
  cta: string
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
      'Crée des compétitions CrossFit comparables, structurées et lisibles dès la publication.',
  },
  {
    title: 'Catégories et divisions',
    description:
      'Gère les formats individuels et team, les divisions, les catégories et les règles d’inscription.',
  },
  {
    title: 'Tarification pilotée',
    description:
      'Affiche des tarifs clairs par catégorie avec early bird, regular et capacités par palier.',
  },
  {
    title: 'Prêt pour le live',
    description:
      'Le socle prépare la suite : qualifications, scoring live, leaderboard, planning et heats.',
  },
]

const steps: Step[] = [
  {
    number: '01',
    title: 'Créer la compétition',
    description:
      'L’organisateur définit l’événement, les dates, les catégories et le cadre de publication.',
  },
  {
    number: '02',
    title: 'Publier catégories et tarifs',
    description:
      'Chaque catégorie porte ses règles, ses formats et ses pricing tiers selon dates ou quotas.',
  },
  {
    number: '03',
    title: 'Ouvrir les inscriptions',
    description:
      'Les athlètes consultent les événements, choisissent une catégorie et voient le bon prix actif.',
  },
  {
    number: '04',
    title: 'Préparer l’exploitation',
    description:
      'La plateforme sert ensuite de base vers qualifications, scoring live et leaderboard.',
  },
]

const roles: Role[] = [
  {
    title: 'Organisateur',
    description:
      'Créer des événements, structurer les catégories, publier les tarifs et piloter les inscriptions.',
    href: '/organizer',
    cta: 'Gérer un événement',
  },
  {
    title: 'Athlète',
    description:
      'Parcourir les compétitions, comparer les catégories, s’inscrire et suivre ses engagements.',
    href: '/athlete',
    cta: 'Accéder à mon espace',
  },
  {
    title: 'Public',
    description:
      'Découvrir les événements publiés, comprendre les formats et suivre l’activité de la compétition.',
    href: '/events',
    cta: 'Voir les événements',
  },
]

const previewEvents: PreviewEvent[] = [
  {
    title: 'Paris Throwdown',
    date: '12–13 Septembre 2026',
    location: 'Paris',
    categories: [
      { name: 'Individual RX Men', price: '39€', tag: 'Early Bird' },
      { name: 'Individual RX Women', price: '39€', tag: 'Early Bird' },
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
      { name: 'Team of 4 FFHH', price: '149€', tag: 'Limited spots' },
    ],
  },
]

function UnicornMark() {
  return (
    <div className="relative h-14 w-14 shrink-0">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-sky-500 shadow-lg shadow-fuchsia-500/25" />
      <div className="absolute left-1/2 top-1.5 h-4 w-2 -translate-x-1/2 -rotate-12 rounded-full bg-gradient-to-b from-yellow-300 to-amber-500" />
      <div className="absolute inset-[4px] rounded-[14px] bg-slate-950/90" />
      <div className="absolute left-1/2 top-1/2 h-6 w-8 -translate-x-1/2 -translate-y-1/2 rounded-[999px] bg-gradient-to-r from-pink-400 to-sky-400" />
      <div className="absolute left-[18px] top-[20px] h-1.5 w-1.5 rounded-full bg-slate-950" />
      <div className="absolute right-[14px] top-[21px] h-2 w-3 rotate-[20deg] rounded-full border-2 border-slate-950 border-l-0 border-t-0" />
    </div>
  )
}

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

      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <UnicornMark />
            <div>
              <div className="text-lg font-semibold tracking-tight text-white">
                CompCF
              </div>
              <div className="text-sm text-slate-400">
                CrossFit competition platform
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <Link className="transition hover:text-white" href="/events">
              Events
            </Link>
            <Link className="transition hover:text-white" href="/organizer">
              Organizer
            </Link>
            <Link className="transition hover:text-white" href="/athlete">
              Athlete
            </Link>
            <Link className="transition hover:text-white" href="/admin">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Publication, inscriptions, catégories, pricing tiers
            </div>

            <h1 className="mt-8 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              La plateforme{' '}
              <span className="bg-gradient-to-r from-fuchsia-400 via-pink-300 to-sky-300 bg-clip-text text-transparent">
                CrossFit
              </span>{' '}
              qui structure vraiment les compétitions.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              CompCF aide les organisateurs à publier des événements
              standardisés, gérer les catégories, ouvrir les inscriptions et
              afficher des tarifs clairs par palier. Le tout sur une base prête
              pour les qualifications, le scoring live et les leaderboards.
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
                Events publiés
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                Categories & divisions
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                Early bird & pricing tiers
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                Ready for live scoring
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
                      Featured event
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-white">
                      Unicorn Throwdown
                    </div>
                    <div className="mt-1 text-sm text-slate-400">
                      Paris · 12–13 Septembre 2026
                    </div>
                  </div>
                  <div className="rounded-full border border-fuchsia-400/25 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-200">
                    Published
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
                          Early Bird active · capacity by tier
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
                          Standardized team category
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">79€</div>
                        <div className="text-xs text-pink-300">Regular</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-dashed border-white/15 bg-slate-900/50 p-4 text-sm text-slate-300">
                    Qualification flows, payments, scoring live and leaderboard
                    are prepared by the model and can be layered without
                    refonte.
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
            eyebrow="Why CompCF"
            title="Un socle produit propre pour les compétitions CrossFit."
            description="CompCF ne se limite pas à publier une liste d’événements. La plateforme structure le modèle compétition, les catégories, les inscriptions et la tarification pour préparer une exploitation réelle."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-6"
              >
                <div className="mb-4 h-10 w-10 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-sky-500/20" />
                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow="How it works"
          title="Une séquence simple pour transformer une compétition en produit exploitable."
          description="Le prototype doit déjà raconter un parcours clair, de la création d’événement à la préparation du terrain opérationnel."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="text-sm font-semibold text-sky-300">
                {step.number}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <SectionTitle
            eyebrow="Roles"
            title="Pensé pour l’organisateur, l’athlète et le public."
            description="Chaque acteur retrouve un parcours simple et cohérent, sans perdre la rigueur métier propre aux compétitions CrossFit."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {roles.map((role) => (
              <div
                key={role.title}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-6"
              >
                <div className="inline-flex rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300">
                  {role.title}
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {role.description}
                </p>
                <Link
                  href={role.href}
                  className="mt-6 inline-flex text-sm font-semibold text-sky-300 transition hover:text-sky-200"
                >
                  {role.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow="Preview"
          title="Un aperçu de ce que le produit rend visible."
          description="Le prototype doit déjà montrer la structure événement, les catégories et la logique de tarification sans attendre tout le scoring live."
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
                  Open
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
                        Pricing tier currently available
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
              <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                Ready to explore
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Passe d’une idée de compétition à une expérience produit
                crédible.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">
                Découvre les événements publiés, teste les parcours existants
                et pose les bases d’une plateforme CrossFit prête à monter en
                puissance.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/events"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Explorer les événements
              </Link>
              <Link
                href="/organizer"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Ouvrir l’espace organizer
              </Link>
              <div className="flex items-center justify-center gap-4 pt-2 text-sm text-slate-300">
                <Link href="/athlete" className="hover:text-white">
                  Athlete
                </Link>
                <Link href="/admin" className="hover:text-white">
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}