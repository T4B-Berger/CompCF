'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, UserPlus } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { SiteHeader } from '../../components/marketing/site-header'
import { SiteFooter } from '../../components/marketing/site-footer'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSignup = async () => {
    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setErrorMessage(error.message)
      setLoading(false)
      return
    }

    setSuccessMessage(
      'Compte créé. Tu pourras enrichir le profil plus tard quand le flux signup évoluera.'
    )
    setLoading(false)
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
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-200">
              Sign up
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Crée ton compte et entre dans l’écosystème CompCF.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              Le signup MVP reste volontairement simple : email et mot de passe.
              Le profil pourra être enrichi après avec davantage d’informations
              sans casser ce premier parcours.
            </p>

            <div className="mt-8 space-y-4 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                MVP : création rapide de compte pour tester la plateforme.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Évolution prévue : profil athlète, informations complémentaires,
                préférences et historique.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Le but immédiat : rendre l’entrée dans le produit simple et
                propre.
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/30">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-sky-500/20">
                <UserPlus className="h-5 w-5 text-sky-200" />
              </div>
              <div>
                <div className="text-xl font-semibold text-white">
                  Create account
                </div>
                <div className="text-sm text-slate-400">
                  MVP signup, extensible post-MVP
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
              />
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
              />

              {errorMessage && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                  {successMessage}
                </div>
              )}

              <button
                onClick={handleSignup}
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? 'Création...' : 'Créer mon compte'}
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-3 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/login" className="inline-flex items-center gap-2 text-sky-300 hover:text-sky-200">
                J’ai déjà un compte
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/" className="hover:text-white">
                Retour à l’accueil
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}