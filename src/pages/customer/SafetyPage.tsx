import { SEO } from '@/components/shared/SEO'
import { DosAndDontsSection } from '@/components/customer/DosAndDontsSection'
import { ContactSection } from '@/components/customer/ContactSection'

export function SafetyPage() {
  return (
    <>
      <SEO
        title="Safety Guidelines"
        description="Fireworks dos and don'ts — celebrate safely with Aura Crackers' responsible usage guide."
      />

      <div className="bg-white pt-10 sm:pt-14">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <DosAndDontsSection compact />
        </div>
      </div>

      <ContactSection />
    </>
  )
}
