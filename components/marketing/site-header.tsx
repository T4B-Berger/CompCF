import Link from 'next/link'

function UnicornMark() {
  return (
    <div className="relative h-11 w-11 shrink-0">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-sky-500 shadow-lg shadow-fuchsia-500/25" />
      <div className="absolute left-1/2 top-1 h-3.5 w-2 -translate-x-1/2 -rotate-12 rounded-full bg-gradient-to-b from-yellow-300 to-amber-500" />
      <div className="absolute inset-[3px] rounded-[14px] bg-slate-950/90" />
      <div className="absolute left-1/2 top-1/2 h-5 w-7 -translate-x-1/2 -translate-y-1/2 rounded-[999px] bg-gradient-to-r from-pink-400 to-sky-400" />
      <div className="absolute left-[14px] top-[16px] h-1.5 w-1.5 rounded-full bg-slate-950" />
      <div className="absolute right-[11px] top-[17px] h-2 w-3 rotate-[20deg] rounded-full border-2 border-slate-950 border-l-0 border-t-0" />
    </div>
  )
}

export function SiteHeader() {
  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <UnicornMark />
          <div>
            <div className="text-lg font-semibold tracking-tight text-white">
              CompCF
            </div>
            <div className="text-sm text-slate-400">
              Plateforme de compétitions CrossFit
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link className="transition hover:text-white" href="/events">
            Événements
          </Link>
          <Link className="transition hover:text-white" href="/organizer">
            Organisateur
          </Link>
          <Link className="transition hover:text-white" href="/athlete">
            Athlète
          </Link>
          <Link className="transition hover:text-white" href="/admin">
            Admin
          </Link>
          <Link className="transition hover:text-white" href="/login">
            Connexion
          </Link>
          <Link
            className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-sky-500 px-4 py-2 font-semibold text-white"
            href="/signup"
          >
            Créer un compte
          </Link>
        </nav>
      </div>
    </header>
  )
}