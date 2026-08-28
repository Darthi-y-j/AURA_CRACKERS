import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '@/contexts/AuthContext'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { CartProvider } from '@/contexts/CartContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import { CustomerLayout } from '@/layouts/CustomerLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { LoadingState } from '@/components/customer/LoadingState'
import { ScrollToTop } from '@/components/shared/ScrollToTop'

const HomePage = lazy(() => import('@/pages/customer/HomePage').then((m) => ({ default: m.HomePage })))
const ProductsPage = lazy(() =>
  import('@/pages/customer/ProductsPage').then((m) => ({ default: m.ProductsPage })),
)
const ProductDetailPage = lazy(() =>
  import('@/pages/customer/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })),
)
const CategoriesPage = lazy(() =>
  import('@/pages/customer/CategoriesPage').then((m) => ({ default: m.CategoriesPage })),
)
const CategorySlugRedirect = lazy(() =>
  import('@/pages/customer/CategorySlugRedirect').then((m) => ({ default: m.CategorySlugRedirect })),
)
const SearchPage = lazy(() => import('@/pages/customer/SearchPage').then((m) => ({ default: m.SearchPage })))
const AboutPage = lazy(() => import('@/pages/customer/AboutPage').then((m) => ({ default: m.AboutPage })))
const ContactPage = lazy(() => import('@/pages/customer/ContactPage').then((m) => ({ default: m.ContactPage })))
const LoginPage = lazy(() => import('@/pages/customer/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/pages/customer/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const AccountPage = lazy(() => import('@/pages/customer/AccountPage').then((m) => ({ default: m.AccountPage })))
const FAQPage = lazy(() => import('@/pages/customer/FAQPage').then((m) => ({ default: m.FAQPage })))
const SafetyPage = lazy(() => import('@/pages/customer/SafetyPage').then((m) => ({ default: m.SafetyPage })))
const PrivacyPolicyPage = lazy(() =>
  import('@/pages/customer/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })),
)
const TermsPage = lazy(() => import('@/pages/customer/TermsPage').then((m) => ({ default: m.TermsPage })))
const GiftBoxPage = lazy(() =>
  import('@/pages/customer/GiftBoxPage').then((m) => ({ default: m.GiftBoxPage })),
)
const CartPage = lazy(() => import('@/pages/customer/CartPage').then((m) => ({ default: m.CartPage })))
const WishlistPage = lazy(() =>
  import('@/pages/customer/WishlistPage').then((m) => ({ default: m.WishlistPage })),
)
const AdminLoginPage = lazy(() =>
  import('@/pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })),
)
const AdminDashboardPage = lazy(() =>
  import('@/pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })),
)
const AdminProductsPage = lazy(() =>
  import('@/pages/admin/AdminProductsPage').then((m) => ({ default: m.AdminProductsPage })),
)
const AdminProductFormPage = lazy(() =>
  import('@/pages/admin/AdminProductFormPage').then((m) => ({ default: m.AdminProductFormPage })),
)
const AdminCategoriesPage = lazy(() =>
  import('@/pages/admin/AdminCategoriesPage').then((m) => ({ default: m.AdminCategoriesPage })),
)
const AdminEnquiriesPage = lazy(() =>
  import('@/pages/admin/AdminEnquiriesPage').then((m) => ({ default: m.AdminEnquiriesPage })),
)
const AdminCustomersPage = lazy(() =>
  import('@/pages/admin/AdminCustomersPage').then((m) => ({ default: m.AdminCustomersPage })),
)
const AdminSettingsPage = lazy(() =>
  import('@/pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage })),
)

function PageLoader() {
  return (
    <div className="py-16">
      <LoadingState message="Loading..." />
    </div>
  )
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                <BrowserRouter>
                  <ScrollToTop />
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Customer Website */}
                      <Route element={<CustomerLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:slug" element={<ProductDetailPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/categories/:slug" element={<CategorySlugRedirect />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/account/*" element={<AccountPage />} />
                        <Route path="/faq" element={<FAQPage />} />
                        <Route path="/safety" element={<SafetyPage />} />
                        <Route path="/privacy" element={<PrivacyPolicyPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/gift-box" element={<GiftBoxPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                      </Route>

                      {/* Admin Panel */}
                      <Route path="/admin/login" element={<AdminLoginPage />} />
                      <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboardPage />} />
                        <Route path="products" element={<AdminProductsPage />} />
                        <Route path="products/new" element={<AdminProductFormPage />} />
                        <Route path="products/:id/edit" element={<AdminProductFormPage />} />
                        <Route path="categories" element={<AdminCategoriesPage />} />
                        <Route path="enquiries" element={<AdminEnquiriesPage />} />
                        <Route path="customers" element={<AdminCustomersPage />} />
                        <Route path="settings" element={<AdminSettingsPage />} />
                      </Route>
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App
