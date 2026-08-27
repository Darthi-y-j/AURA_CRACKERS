import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { useAuth } from '@/contexts/AuthContext'
import { validatePhone } from '@/lib/utils'

export function RegisterPage() {
  const { signUpCustomer, user, isAdmin, isCustomer, loading } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
      </div>
    )
  }

  if (user && isAdmin) {
    return <Navigate to="/admin" replace />
  }

  if (user && isCustomer) {
    return <Navigate to="/account" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!fullName.trim()) {
      setError('Please enter your full name')
      return
    }

    if (!validatePhone(phone)) {
      setError('Please enter a valid phone number')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setSubmitting(true)

    const { error: signUpError, needsEmailConfirmation } = await signUpCustomer(
      email,
      password,
      fullName.trim(),
      phone,
    )

    setSubmitting(false)

    if (signUpError) {
      setError(signUpError)
      return
    }

    if (!needsEmailConfirmation) {
      navigate('/account', { replace: true })
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <>
        <SEO title="Register" description="Create your Aura Crackers account." noIndex />
        <div className="mx-auto max-w-md px-4 py-12 text-center sm:py-16">
          <div className="rounded-2xl border border-navy-900/10 bg-white p-8 shadow-sm">
            <h1 className="font-display text-2xl font-bold text-navy-900">Account Created</h1>
            <p className="mt-3 text-sm leading-relaxed text-navy-700/70">
              Your account has been created. If email confirmation is enabled, please check your inbox
              before signing in.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex rounded-lg bg-gold-500 px-6 py-3 text-sm font-bold text-navy-950 hover:bg-gold-400"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO title="Register" description="Create your Aura Crackers account to send enquiries." noIndex />

      <div className="mx-auto max-w-md px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900">
            <UserPlus className="h-7 w-7 text-gold-400" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold text-navy-900">Create Account</h1>
          <p className="mt-2 text-sm text-navy-700/70">Register to send enquiries from your account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-navy-900/10 bg-white p-6 shadow-sm sm:p-8">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-navy-900/10 bg-navy-900/[0.03] px-3.5 py-2.5 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/25"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-lg border border-navy-900/10 bg-navy-900/[0.03] px-3.5 py-2.5 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/25"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-navy-900/10 bg-navy-900/[0.03] px-3.5 py-2.5 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/25"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-navy-900/10 bg-navy-900/[0.03] px-3.5 py-2.5 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/25"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">Confirm Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-navy-900/10 bg-navy-900/[0.03] px-3.5 py-2.5 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/25"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-lg bg-gold-500 py-3 text-sm font-bold text-navy-950 transition hover:bg-gold-400 disabled:opacity-60"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="mt-5 text-center text-sm text-navy-700/70">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-gold-600 hover:text-gold-500">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </>
  )
}
