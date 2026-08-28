import { Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { StockAlertProvider, useStockAlerts } from '@/contexts/StockAlertContext'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { StockAlertModal } from '@/components/admin/StockAlertModal'
import { ToastContainer } from '@/components/customer/Toast'
import { importAuraCatalog } from '@/services/catalogImport'

function AdminStockAlerts() {
  const { popupAlerts, dismissPopup } = useStockAlerts()
  return <StockAlertModal alerts={popupAlerts} onClose={dismissPopup} />
}

export function AdminLayout() {
  const { user, isAdmin, loading } = useAuth()
  const { showToast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [catalogReady, setCatalogReady] = useState(false)

  useEffect(() => {
    if (!user || !isAdmin) return

    let cancelled = false
    void importAuraCatalog().then((result) => {
      if (cancelled) return
      if (result.error) {
        showToast(result.error, 'error')
      } else if (!result.skipped) {
        showToast(`Loaded ${result.productCount} catalogue products into admin.`, 'success')
      }
      setCatalogReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [user, isAdmin, showToast])

  if (loading || (user && isAdmin && !catalogReady)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-festive-500 border-t-transparent" />
        <p className="text-sm text-slate-500">Loading catalogue…</p>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <StockAlertProvider>
      <div className="admin-shell flex h-screen overflow-hidden">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <Outlet context={{ onMenuClick: () => setSidebarOpen(true) }} />
        </div>
        <ToastContainer />
        <AdminStockAlerts />
      </div>
    </StockAlertProvider>
  )
}
