import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { useHeroSlideTheme } from '@/contexts/HeroSlideContext'
import { TitleHighlight } from './TitleHighlight'
import { AnimateIn } from './AnimateIn'
import { HeroSearchBar } from './HeroSearchBar'
import { HeroStats } from './HeroStats'
import { WaveDivider } from './WaveDivider'
import type { Category } from '@/types/database'

interface HeroProps {
  categories?: Category[]
}

const HERO_VIDEO = '/hero.mp4'

export function Hero({ categories = [] }: HeroProps) {
  const { settings } = useSettings()
  const { setTheme } = useHeroSlideTheme()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    setTheme('dark')
  }, [setTheme])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      video.pause()
      video.removeAttribute('autoplay')
      return
    }

    const playVideo = () => {
      if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        video.play().catch(() => {})
      }
    }

    const onCanPlay = () => {
      setVideoReady(true)
      playVideo()
    }

    video.addEventListener('canplay', onCanPlay)
    video.load()

    const onVisibility = () => {
      if (document.hidden) video.pause()
      else playVideo()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) playVideo()
        else video.pause()
      },
      { threshold: 0.15 },
    )

    observer.observe(video)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      video.removeEventListener('canplay', onCanPlay)
    }
  }, [])

  return (
    <section className="relative">
      <div className="relative max-sm:min-h-[92vh]">
        <div className="absolute inset-0 overflow-hidden bg-navy-950 max-sm:min-h-[92vh]">
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 max-sm:object-[center_30%] ${videoReady ? 'opacity-100' : 'opacity-0'}`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>

          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-950/55 via-navy-950/20 to-navy-950/75 max-sm:from-navy-950/45 max-sm:via-navy-950/15 max-sm:to-navy-950/65"
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(245,158,11,0.12),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_85%_30%,rgba(234,88,12,0.08),transparent_50%)]" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-3 pb-6 pt-[4.25rem] max-sm:min-h-[92vh] sm:px-6 sm:pb-10 sm:pt-24 lg:px-8 lg:pt-28">
          <div className="max-w-2xl max-sm:space-y-6">
            <AnimateIn animation="fade-down" delay={100}>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/50 bg-gold-500/15 px-3 py-1 backdrop-blur-md sm:mb-6 sm:gap-2 sm:px-4 sm:py-2">
                <Sparkles className="h-3 w-3 text-gold-300 sm:h-4 sm:w-4" />
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-gold-300 sm:text-[11px] sm:tracking-[0.2em]">
                  Premium Fireworks
                </span>
              </div>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={250}>
              <h1 className="font-display text-[2rem] font-bold leading-[1.15] text-white sm:text-[3.25rem] sm:leading-[1.12] lg:text-[3.75rem]">
                Light Up Your <TitleHighlight variant="dark">Celebration</TitleHighlight>
              </h1>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={400}>
              <p className="max-w-md text-[13px] leading-relaxed text-white/80 sm:mt-6 sm:text-base sm:leading-relaxed sm:text-lg">
                {settings.tagline ||
                  'Premium crackers and fireworks for Diwali, weddings, and every special moment. Browse, add to cart, and send your enquiry on WhatsApp.'}
              </p>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={520}>
              <div className="flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap sm:gap-3">
                {['100% Quality Products', 'WhatsApp Enquiry'].map((text) => (
                  <span
                    key={text}
                    className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-[10px] font-medium text-white/90 backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-xs"
                  >
                    <CheckCircle className="h-3 w-3 shrink-0 text-gold-400 sm:h-3.5 sm:w-3.5" />
                    {text}
                  </span>
                ))}
              </div>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={640}>
              <div className="flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4">
                <Link
                  to="/products"
                  className="btn-hover-lift inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-festive-500 to-gold-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-festive-500/30 sm:w-auto sm:gap-2 sm:px-8 sm:py-3.5 sm:text-sm"
                >
                  Explore Products
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>
                <Link
                  to="/cart"
                  className="btn-hover-lift inline-flex w-full items-center justify-center gap-1.5 rounded-full border-2 border-white/35 bg-white/5 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-white/10 sm:w-auto sm:gap-2 sm:px-8 sm:py-3.5 sm:text-sm"
                >
                  Get Quote
                </Link>
              </div>
            </AnimateIn>
          </div>

          <AnimateIn animation="fade-up" delay={750} className="mt-5 max-sm:mt-auto max-sm:pt-10 sm:mt-14 lg:mt-16">
            <HeroStats variant="dark" />
          </AnimateIn>
        </div>

        <WaveDivider />
      </div>

      <div className="relative z-20 bg-cream-50 px-3 pb-3 pt-0 sm:px-6 sm:pb-5 lg:px-8">
        <HeroSearchBar categories={categories} />
      </div>
    </section>
  )
}
