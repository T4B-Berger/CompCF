'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, LogIn } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { isEmailVerified } from '../../lib/authVerification'
import { SiteHeader } from '../../components/marketing/site-header'
import { SiteFooter } from '../../components/marketing/site-footer'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [resetLoading, setResetLoading] = useState(false)

  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  const explainLoginError = (message: string) => {
    const normalized = message.toLowerCase()

    if (
      normalized.includes('invalid login credentials') ||
      normalized.includes('invalid credentials')
    ) {
      return 'Email ou mot de passe incorrect. Vérifie tes informations puis réessaie.'
    }
    if (normalized.includes('too many requests')) {
      return 'Trop de tentatives. Patiente quelques instants puis réessaie.'
    }
    if (normalized.includes('email not confirmed') || normalized.includes('email not verified')) {
      return 'Ton email n’est pas encore vérifié. Ouvre le lien reçu par email avant de te connecter.'
    }
    return message
  }

  const handleLogin = async () => {
    if (!emailLooksValid) {
      setErrorMessage('Renseigne une adresse email valide.')
      return
    }
    if (!password.trim()) {
      setErrorMessage('Renseigne ton mot de passe pour te connecter.')
      return
    }

    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')
    setResetMessage('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMessage(explainLoginError(error.message))
      setLoading(false)
      return
    }

    if (!isEmailVerified(data.user)) {
      setErrorMessage(
        'Ton email n’est pas encore vérifié. Ouvre le lien reçu par email avant de te connecter.'
      )
      setLoading(false)
      return
    }

    setSuccessMessage('Connexion réussie.')
    setLoading(false)
    window.location.href = '/athlete'
  }

  const handlePasswordReset = async () => {
    if (!emailLooksValid) {
      setErrorMessage('Renseigne un email valide pour recevoir le lien de réinitialisation.')
      return
    }

    setResetLoading(true)
    setErrorMessage('')
    setResetMessage('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })

    if (error) {
      setErrorMessage('Impossible d’envoyer le lien de réinitialisation pour le moment.')
      setResetLoading(false)
      return
    }

    setResetMessage('Un lien de réinitialisation a été envoyé si ce compte existe.')
    setResetLoading(false)
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
              Connexion
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Reprends là où ta compétition commence.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              Connecte-toi pour accéder à ton espace athlète, organisateur ou
              admin selon ton rôle actuel dans CompCF.
            </p>

            <div className="mt-8 space-y-4 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Athlète : retrouve tes inscriptions et les compétitions
                publiées.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Organisateur : gère tes événements, tes catégories et tes
                participants.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Admin : garde une vision globale du système.
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/30">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-sky-500/20">
                <LogIn className="h-5 w-5 text-sky-200" />
              </div>
              <div>
                <div className="text-xl font-semibold text-white">
                  Se connecter
                </div>
                <div className="text-sm text-slate-400">
                  Email / mot de passe en MVP
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
                placeholder="Mot de passe"
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
              {resetMessage && (
                <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
                  {resetMessage}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-3 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-sky-300 hover:text-sky-200"
              >
                Créer un compte
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={resetLoading}
                className="text-left text-sky-300 hover:text-sky-200 disabled:opacity-60"
              >
                {resetLoading ? 'Envoi...' : 'Mot de passe oublié ?'}
              </button>
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
