import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <div className="font-medium text-white">CompCF</div>
          <div className="mt-1">
            Publication, inscriptions, catégories et pricing pour les compétitions CrossFit.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <Link href="/events" className="hover:text-white">
            Events
          </Link>
          <Link href="/organizer" className="hover:text-white">
            Organizer
          </Link>
          <Link href="/athlete" className="hover:text-white">
            Athlete
          </Link>
          <Link href="/admin" className="hover:text-white">
            Admin
          </Link>
          <Link href="/login" className="hover:text-white">
            Login
          </Link>
          <Link href="/signup" className="hover:text-white">
            Sign up
          </Link>
        </div>
      </div>
    </footer>
  )
}