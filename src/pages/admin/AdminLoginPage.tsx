import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Lock, Sparkles } from 'lucide-react'

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
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-festive-500 shadow-xl shadow-festive-500/30">
            <Sparkles className="h-8 w-8 text-navy-950" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold text-cream-50">Aura Admin</h1>
          <p className="mt-2 text-sm text-cream-100/60">Sign in to manage your store</p>
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
