import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Lock } from 'lucide-react'
import { SITE_LOGO_PATH, SITE_WORDMARK_PATH } from '@/lib/siteConfig'

export function AdminLoginPage() {
  const { signIn, user, isAdmin, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
      </div>
    )
  }

  if (user && isAdmin) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const { error: signInError } = await signIn(email, password)

    if (signInError) {
      setError(signInError)
    }

    setSubmitting(false)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-950 px-4">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(245,158,11,0.18),transparent_55%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-64 w-64 rounded-full bg-festive-500/10 blur-3xl" aria-hidden />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex w-fit max-w-full items-center gap-2">
            <img
              src={SITE_LOGO_PATH}
              alt="Aura Crackers"
              className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
            />
            <div className="relative h-10 w-44 shrink-0 -ml-0.5 sm:h-11 sm:w-52">
              <img
                src={SITE_WORDMARK_PATH}
                alt="Aura Crackers"
                className="pointer-events-none absolute left-0 top-1/2 h-[430%] w-auto max-w-none -translate-y-1/2 select-none sm:h-[480%]"
                draggable={false}
              />
            </div>
          </div>
          <p className="mt-4 text-sm text-cream-100/60">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-card p-8">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-navy-800">
            <Lock className="h-4 w-4 text-gold-600" />
            Secure login
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200/80">{error}</div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input w-full"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input w-full"
              />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="admin-btn-primary mt-6 w-full disabled:opacity-60">
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
