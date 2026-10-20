import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { useHeroSlideTheme } from '@/contexts/HeroSlideContext'
import { TitleHighlight } from './TitleHighlight'
import { AnimateIn } from './AnimateIn'
import { FeaturedProductsShowcase } from './FeaturedProductsShowcase'
import { WaveDivider } from './WaveDivider'
import type { Product } from '@/types/database'

interface HeroProps {
  heroSelectionProducts?: Product[]
}

const HERO_VIDEO_MP4 = '/hero.mp4'
const HERO_POSTER = '/hero-poster.jpg'
const HERO_POSTER_WEBP = '/hero-poster.webp'

function shouldPlayHeroVideo(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  if (connection?.saveData) return false
  return true
}

export function Hero({ heroSelectionProducts = [] }: HeroProps) {
  const { settings } = useSettings()
  const { setTheme } = useHeroSlideTheme()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoEnabled] = useState(shouldPlayHeroVideo)

  useEffect(() => {
    setTheme('dark')
  }, [setTheme])

  useEffect(() => {
    if (!videoEnabled) return

    const video = videoRef.current
    if (!video) return

    let loaded = false

    const playVideo = () => {
      if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        video.play().catch(() => {})
      }
    }

    const loadVideo = () => {
      if (loaded) return
      loaded = true
      video.preload = 'auto'
      video.load()
      playVideo()
    }

    const onCanPlay = () => {
      playVideo()
    }

    video.addEventListener('canplay', onCanPlay)

    const onVisibility = () => {
      if (document.hidden) video.pause()
      else playVideo()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadVideo()
          playVideo()
        } else {
          video.pause()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(video)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      video.removeEventListener('canplay', onCanPlay)
    }
  }, [videoEnabled])

  return (
    <section className="relative overflow-x-clip max-sm:overflow-x-visible">
      <div className="relative min-h-0 max-sm:min-h-[62vh]">
        <div className="absolute inset-0 min-h-full overflow-hidden bg-black max-sm:min-h-[62vh]">
          {videoEnabled ? (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover object-center max-sm:object-[center_30%]"
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              poster={HERO_POSTER}
              aria-hidden="true"
            >
              <source src={HERO_VIDEO_MP4} type="video/mp4" />
            </video>
          ) : (
            <picture className="absolute inset-0">
              <source srcSet={HERO_POSTER_WEBP} type="image/webp" />
              <img
                src={HERO_POSTER}
                alt=""
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover object-center max-sm:object-[center_30%]"
                aria-hidden="true"
              />
            </picture>
          )}

        </div>

        <div className="relative z-10 mx-auto flex w-full min-w-0 max-w-7xl flex-col px-4 pb-4 pt-[3.75rem] max-sm:min-h-0 sm:px-6 sm:pb-5 sm:pt-20 lg:px-8 lg:pt-[5.25rem]">
          <div className="w-full max-w-2xl max-sm:space-y-3 sm:space-y-1">
            <AnimateIn animation="fade-down" delay={100}>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/50 bg-gold-500/15 px-3.5 py-1.5 backdrop-blur-md sm:mb-3 sm:gap-2 sm:px-4 sm:py-2">
                <Sparkles className="h-3.5 w-3.5 text-gold-300 sm:h-4 sm:w-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-300 sm:text-[11px] sm:tracking-[0.2em]">
                  Premium Fireworks
                </span>
              </div>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={250}>
              <h1 className="font-display text-[2rem] font-bold leading-[1.12] sm:text-[2.75rem] sm:leading-[1.12] lg:text-[3.1rem] lg:whitespace-nowrap">
                <span className="sr-only">{settings.business_name || 'Aura Crackers'} — </span>
                <span className="text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.65)]">Light Up Your </span>
                <TitleHighlight variant="hero">Celebration</TitleHighlight>
              </h1>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={400}>
              <p className="max-w-md font-display text-sm font-bold leading-relaxed text-white/90 [text-shadow:0_2px_10px_rgba(0,0,0,0.55)] sm:mt-3 sm:text-[15px] sm:leading-relaxed lg:text-base">
                {settings.tagline ||
                  'Premium crackers and fireworks for Diwali, weddings, and every special moment. Browse, add to cart, and send your enquiry on WhatsApp.'}
              </p>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={520}>
              <div className="flex flex-col gap-2 sm:mt-4 sm:flex-row sm:flex-wrap sm:gap-2">
                {['100% Quality Products', 'WhatsApp Enquiry'].map((text) => (
                  <span
                    key={text}
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-black/20 px-3.5 py-2 text-xs font-medium text-white/90 backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2"
                  >
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-gold-400 sm:h-3.5 sm:w-3.5" />
                    {text}
                  </span>
                ))}
              </div>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={640}>
              <div className="flex flex-col gap-2.5 sm:mt-5 sm:flex-row sm:flex-wrap sm:gap-3">
                <Link
                  to="/products"
                  className="btn-hover-lift inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-festive-500 to-gold-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-festive-500/30 sm:w-auto sm:gap-2 sm:px-7 sm:py-3"
                >
                  Explore Products
                  <ArrowRight className="h-4 w-4 sm:h-4 sm:w-4" />
                </Link>
                <Link
                  to="/cart"
                  className="btn-hover-lift inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/35 bg-white/5 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-white/10 sm:w-auto sm:gap-2 sm:px-7 sm:py-3"
                >
                  Get Quote
                </Link>
              </div>
            </AnimateIn>
          </div>

          {heroSelectionProducts.length > 0 && (
            <AnimateIn
              animation="fade-up"
              delay={720}
              className="relative -mx-4 mt-4 w-[calc(100%+2rem)] translate-y-3 sm:-mx-6 sm:mt-5 sm:w-[calc(100%+3rem)] sm:translate-y-4 lg:-mx-8 lg:mt-6 lg:w-[calc(100%+4rem)] lg:translate-y-5"
            >
              <FeaturedProductsShowcase products={heroSelectionProducts} variant="hero" />
            </AnimateIn>
          )}
        </div>

        <WaveDivider />
      </div>
    </section>
  )
}
