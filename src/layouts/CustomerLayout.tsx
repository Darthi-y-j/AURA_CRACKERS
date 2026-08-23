import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '@/components/customer/Navbar'
import { Footer } from '@/components/customer/Footer'
import { ToastContainer } from '@/components/customer/Toast'
import { CollectiveCartBar } from '@/components/customer/CollectiveCartBar'
import { Chatbot } from '@/components/customer/Chatbot'
import { ImportantNoticeModal } from '@/components/customer/ImportantNoticeModal'
import { HeroSlideProvider } from '@/contexts/HeroSlideContext'
import { cn } from '@/lib/utils'

export function CustomerLayout() {
  const location = useLocation()
  const isCataloguePage = location.pathname === '/products'
  const isHeroPage = location.pathname === '/' || isCataloguePage || location.pathname === '/gift-box'

  return (
    <HeroSlideProvider>
      <div className="flex min-h-screen flex-col">
        <ImportantNoticeModal />
        <Navbar />
        <main
          className={cn(
            'flex-1',
            !isHeroPage && 'pt-16',
            isCataloguePage ? 'pb-20 sm:pb-24' : 'pb-4',
          )}
        >
          <Outlet />
        </main>
        {!isCataloguePage && <Footer />}
        <CollectiveCartBar />
        <Chatbot />
        <ToastContainer />
      </div>
    </HeroSlideProvider>
  )
}
