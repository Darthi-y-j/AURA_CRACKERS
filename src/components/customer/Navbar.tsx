import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingCart, Heart, User } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { useHeroSlideTheme } from '@/contexts/HeroSlideContext'
import { useAuth } from '@/contexts/AuthContext'
import { BackButton } from '@/components/customer/BackButton'
import { UserProfileMenu } from '@/components/customer/UserProfileMenu'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/categories', label: 'Categories' },
  { to: '/gift-box', label: 'Gift Box' },
  { to: '/about', label: 'About' },
  { to: '/safety', label: 'Safety' },
  { to: '/contact', label: 'Contact' },
  { to: '/faq', label: 'FAQ' },
]

export function Navbar() {
  const { settings } = useSettings()
  const { itemCount } = useCart()
  const { itemCount: wishlistCount } = useWishlist()
  const { isCustomer, user } = useAuth()
  const { theme: heroTheme } = useHeroSlideTheme()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [badgePop, setBadgePop] = useState(false)
  const [wishlistBadgePop, setWishlistBadgePop] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isHeroPage = location.pathname === '/' || location.pathname === '/products' || location.pathname === '/gift-box'
  const isTransparent = isHeroPage && !scrolled
  const isLightHomeHero = location.pathname === '/' && isTransparent && heroTheme === 'light'
  const isDarkNav = isTransparent && !isLightHomeHero
  const showBack = location.pathname !== '/'

  useEffect(() => {
    if (itemCount > 0) {
      setBadgePop(true)
      const t = setTimeout(() => setBadgePop(false), 400)
      return () => clearTimeout(t)
    }
  }, [itemCount])

  useEffect(() => {
    if (wishlistCount > 0) {
      setWishlistBadgePop(true)
      const t = setTimeout(() => setWishlistBadgePop(false), 400)
      return () => clearTimeout(t)
    }
  }, [wishlistCount])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const isActive = (to: string) => {
    const path = to.split('?')[0]
    return location.pathname === path
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 h-14 transition-all duration-500 sm:h-[4.25rem]',
        isDarkNav
          ? 'border-transparent bg-gradient-to-b from-navy-950/90 via-navy-950/70 to-transparent'
          : isLightHomeHero
            ? 'border-transparent bg-white/75 backdrop-blur-md'
            : 'border-b border-navy-800/10 bg-white/95 shadow-sm backdrop-blur-md',
      )}
    >
      <nav className="mx-auto grid h-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-3 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 sm:gap-2.5">
          {showBack && <BackButton variant={isDarkNav ? 'dark' : 'light'} />}
          <Link to="/" className="flex items-center gap-2.5">
          {settings.logo_url ? (
            <img
              src={settings.logo_url}
              alt={settings.business_name}
              className="h-8 w-8 rounded-lg object-cover ring-2 ring-white/25 sm:h-10 sm:w-10 sm:rounded-xl"
            />
          ) : (
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg shadow-lg sm:h-10 sm:w-10 sm:rounded-xl',
                isDarkNav
                  ? 'bg-gradient-to-br from-gold-400 to-gold-500 shadow-gold-500/30'
                  : 'bg-navy-900',
              )}
            >
              <span
                className={cn(
                  'font-display text-base font-bold sm:text-lg',
                  isDarkNav ? 'text-navy-950' : 'text-gold-500',
                )}
              >
                A
              </span>
            </div>
          )}
          <div className="hidden sm:block">
            <span
              className={cn(
                'font-display text-base font-bold leading-tight transition-colors sm:text-lg',
                isDarkNav ? 'text-white' : 'text-navy-900',
              )}
            >
              {settings.business_name}
            </span>
          </div>
        </Link>
        </div>

        <div className="hidden min-w-0 justify-center lg:flex">
          <div
            className={cn(
              'flex max-w-full flex-nowrap items-center gap-0.5 rounded-full p-1',
              isDarkNav
                ? 'border border-white/10 bg-black/15 backdrop-blur-md'
                : 'bg-navy-900/[0.04]',
            )}
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={cn(
                  'shrink-0 whitespace-nowrap rounded-full px-2 py-1.5 text-xs font-medium transition-all duration-200 lg:px-2.5 lg:py-2 xl:px-3.5 xl:text-sm',
                  isDarkNav
                    ? isActive(link.to)
                      ? 'bg-white/20 text-gold-300 shadow-sm'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                    : isActive(link.to)
                      ? 'bg-navy-900/8 text-gold-500'
                      : 'text-navy-700 hover:bg-navy-900/5 hover:text-navy-900',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Link
            to="/wishlist"
            className={cn(
              'relative rounded-full p-2.5 transition-all duration-300 hover:scale-110 active:scale-95',
              isDarkNav ? 'text-white hover:bg-white/10' : 'text-navy-700 hover:bg-navy-800/5',
            )}
            aria-label="Liked products"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span
                className={`absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ${wishlistBadgePop ? 'animate-badge-pop' : ''}`}
              >
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className={cn(
              'relative rounded-full p-2.5 transition-all duration-300 hover:scale-110 active:scale-95',
              isDarkNav ? 'text-white hover:bg-white/10' : 'text-navy-700 hover:bg-navy-800/5',
            )}
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span
                className={`absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-navy-950 ${badgePop ? 'animate-badge-pop' : ''}`}
              >
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          <UserProfileMenu isDarkNav={isDarkNav} className="sm:hidden" />

          {!user && (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Link
                to="/login"
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  isDarkNav
                    ? 'text-white/85 hover:bg-white/10 hover:text-white'
                    : 'text-navy-700 hover:bg-navy-900/5 hover:text-navy-900',
                )}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  isDarkNav
                    ? 'border border-gold-400/35 text-gold-300 hover:bg-gold-400/10'
                    : 'border border-gold-500/30 bg-gold-500/10 text-gold-700 hover:bg-gold-500/20',
                )}
              >
                Register
              </Link>
            </div>
          )}

          {user && <UserProfileMenu isDarkNav={isDarkNav} className="hidden sm:inline-flex" />}

          <Link to="/cart" className="hidden rounded-full btn-festive px-5 py-2.5 text-sm font-bold sm:inline-flex">
            Get Quote
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              'rounded-full p-2.5 lg:hidden',
              isDarkNav ? 'text-white hover:bg-white/10' : 'text-navy-700 hover:bg-navy-800/5',
            )}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="animate-fade-down border-t border-white/10 bg-navy-950/95 px-4 py-4 backdrop-blur-lg lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  isActive(link.to)
                    ? 'bg-white/10 text-gold-400'
                    : 'text-white/80 hover:bg-white/5',
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/5"
            >
              <Heart className="h-4 w-4" />
              Liked {wishlistCount > 0 && `(${wishlistCount})`}
            </Link>
            {user && isCustomer ? (
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gold-400/80">Signed in</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {(user.user_metadata?.full_name as string) || user.email}
                </p>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/5"
                >
                  <User className="h-4 w-4" />
                  Login
                </Link>
                {!user && (
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-gold-300 hover:bg-white/5"
                  >
                    Create Account
                  </Link>
                )}
              </>
            )}
            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl btn-festive px-3 py-2.5 text-sm font-bold"
            >
              <ShoppingCart className="h-4 w-4" />
              Get Quote {itemCount > 0 && `(${itemCount})`}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
