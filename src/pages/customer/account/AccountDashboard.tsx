import { Link } from 'react-router-dom'
import {
  User,
  MapPin,
  MessageSquare,
  Heart,
  Bell,
  Shield,
  HelpCircle,
  Phone,
  LogOut,
  Mail,
  ShoppingCart,
  Trash2,
} from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { LoadingState } from '@/components/customer/LoadingState'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import {
  AccountPageHeader,
  MenuLink,
  MenuSection,
  ProfileAvatar,
  StatCard,
} from '@/components/customer/account/AccountUI'
import { useAccountProfile } from '@/contexts/AccountProfileContext'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { formatDisplayPhone } from '@/lib/businessInfo'
import { useState } from 'react'

export function AccountDashboard() {
  const { displayName, email, phone, memberSince, enquiryStats, loading } = useAccountProfile()
  const { signOut } = useAuth()
  const { itemCount } = useCart()
  const { itemCount: wishlistCount } = useWishlist()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (loading) {
    return (
      <div className="py-16">
        <LoadingState message="Loading your profile..." />
      </div>
    )
  }

  return (
    <>
      <SEO title="My Profile" description="Manage your Aura Crackers account and enquiries." noIndex />

      <AccountPageHeader showEdit>
        <div className="mt-6 flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left">
          <ProfileAvatar name={displayName} />
          <div className="mt-4 sm:ml-5 sm:mt-0">
            <h1 className="font-display text-2xl font-bold text-cream-50 sm:text-3xl">{displayName}</h1>
            {email && (
              <p className="mt-1.5 flex items-center justify-center gap-2 text-sm text-cream-100/75 sm:justify-start">
                <Mail className="h-3.5 w-3.5 shrink-0 text-gold-400" />
                {email}
              </p>
            )}
            {phone && (
              <p className="mt-1 flex items-center justify-center gap-2 text-sm text-cream-100/75 sm:justify-start">
                <Phone className="h-3.5 w-3.5 shrink-0 text-gold-400" />
                {formatDisplayPhone(phone)}
              </p>
            )}
            {memberSince && (
              <p className="mt-2 text-xs font-medium text-gold-400/80">Member since {memberSince}</p>
            )}
          </div>
        </div>
      </AccountPageHeader>

      <div className="mx-auto max-w-3xl space-y-5 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard value={enquiryStats.total} label="Enquiries" />
          <StatCard value={enquiryStats.new} label="New" />
          <StatCard value={enquiryStats.completed} label="Completed" />
          <StatCard value={wishlistCount} label="Wishlist" />
        </div>

        {itemCount > 0 && (
          <div className="rounded-2xl border border-gold-500/25 bg-gradient-to-br from-gold-500/10 to-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gold-700">Your Cart</p>
                <p className="mt-1 font-display text-lg font-bold text-navy-900">
                  {itemCount} item{itemCount !== 1 ? 's' : ''} ready to enquire
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-gold-500/60" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/products"
                className="rounded-lg border border-navy-900/10 bg-white px-4 py-2 text-xs font-semibold text-navy-800 transition hover:bg-cream-50"
              >
                Continue Shopping
              </Link>
              <Link
                to="/cart"
                className="rounded-lg bg-navy-900 px-4 py-2 text-xs font-bold text-gold-300 transition hover:bg-navy-800"
              >
                Send WhatsApp Enquiry
              </Link>
            </div>
          </div>
        )}

        <MenuSection title="Account">
          <MenuLink to="/account/personal" icon={<User className="h-5 w-5 text-navy-700" />} label="Personal Information" />
          <MenuLink to="/account/addresses" icon={<MapPin className="h-5 w-5 text-navy-700" />} label="My Addresses" />
          <MenuLink to="/account/enquiries" icon={<MessageSquare className="h-5 w-5 text-navy-700" />} label="My Enquiries" />
          <MenuLink to="/account/wishlist" icon={<Heart className="h-5 w-5 text-red-500" />} label="Wishlist" />
        </MenuSection>

        <MenuSection title="Preferences">
          <MenuLink to="/account/notifications" icon={<Bell className="h-5 w-5 text-navy-700" />} label="Notifications" />
        </MenuSection>

        <MenuSection title="Security">
          <MenuLink to="/account/security" icon={<Shield className="h-5 w-5 text-navy-700" />} label="Password & Security" />
        </MenuSection>

        <MenuSection title="Support">
          <MenuLink to="/account/help" icon={<HelpCircle className="h-5 w-5 text-navy-700" />} label="Help & Support" />
          <MenuLink to="/contact" icon={<Phone className="h-5 w-5 text-navy-700" />} label="Contact Us" />
        </MenuSection>

        <div className="rounded-2xl border border-red-200/60 bg-white p-2 shadow-sm">
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-semibold text-navy-800 transition hover:bg-navy-900/[0.03]"
          >
            <LogOut className="h-5 w-5 text-navy-600" />
            Logout
          </button>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-5 w-5" />
            Delete Account
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={logoutOpen}
        title="Sign out?"
        message="You will need to sign in again to access your profile and enquiries."
        confirmLabel="Logout"
        onConfirm={() => {
          setLogoutOpen(false)
          void signOut()
        }}
        onCancel={() => setLogoutOpen(false)}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete account?"
        message="To permanently delete your account and data, please contact our support team via WhatsApp or email. This action cannot be undone."
        confirmLabel="Contact Support"
        onConfirm={() => {
          setDeleteOpen(false)
          window.location.href = '/contact'
        }}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  )
}
