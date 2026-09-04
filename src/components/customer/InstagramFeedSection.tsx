import { memo } from 'react'
import { useSettings } from '@/contexts/SettingsContext'
import { INSTAGRAM_FEED_IMAGES, getInstagramHandle, type InstagramFeedImage } from '@/lib/instagramFeed'

const InstagramTile = memo(function InstagramTile({ image }: { image: InstagramFeedImage }) {
  return (
    <div className="relative aspect-square w-[42vw] shrink-0 overflow-hidden rounded-xl sm:w-auto">
      <picture>
        <source srcSet={image.webp} type="image/webp" />
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="h-full w-full object-cover"
        />
      </picture>
    </div>
  )
})

export function InstagramFeedSection() {
  const { settings } = useSettings()
  const instagramUrl = settings.social_links.instagram
  const handle = getInstagramHandle(instagramUrl)

  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-navy-900 sm:text-4xl">Instagram</h2>
          {instagramUrl ? (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-navy-600 transition hover:text-gold-600 sm:text-base"
            >
              Follow us on Instagram {handle}
            </a>
          ) : (
            <p className="mt-2 text-sm text-navy-600 sm:text-base">Follow us on Instagram {handle}</p>
          )}
        </div>

        <div
          className="mt-8 flex gap-3 overflow-x-auto pb-2 sm:mt-10 sm:grid sm:grid-cols-5 sm:gap-4 sm:overflow-visible sm:pb-0"
          style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 280px' }}
        >
          {INSTAGRAM_FEED_IMAGES.map((image) => {
            const tile = <InstagramTile image={image} />

            if (!instagramUrl) {
              return <div key={image.webp}>{tile}</div>
            }

            return (
              <a
                key={image.webp}
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${image.alt} on Instagram`}
                className="block"
              >
                {tile}
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
