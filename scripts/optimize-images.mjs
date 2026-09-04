import sharp from 'sharp'
import { readdir } from 'node:fs/promises'
import path from 'node:path'

const publicDir = path.resolve('public')

const targets = [
  { name: 'image-of-website-mobile.png', maxWidth: 828 },
  { name: 'image-of-website.png', maxWidth: 1920 },
  { name: 'how-it-works-bg.png', maxWidth: 1600 },
  { name: 'premium-quality-card.png', maxWidth: 960 },
  { name: 'products-hero.png', maxWidth: 1600 },
  { name: 'instagram-product-showcase.png', maxWidth: 960, output: 'instagram-product-showcase.webp' },
  { name: 'special-colors-skyshot-bg.png', maxWidth: 640, output: 'special-colors-skyshot-instagram.webp' },
  { name: 'about-celebration-sparkler.jpg', maxWidth: 640, output: 'about-celebration-sparkler-instagram.webp' },
  { name: 'premium-quality-card.webp', maxWidth: 640, output: 'premium-quality-instagram.webp', fit: 'cover' },
  { name: 'wide-variety-card.webp', maxWidth: 640, output: 'wide-variety-instagram.webp', fit: 'cover' },
]

for (const { name, maxWidth, output, fit } of targets) {
  const input = path.join(publicDir, name)
  const outName = output ?? name.replace(/\.(png|jpe?g)$/i, '.webp')
  const outputPath = path.join(publicDir, outName)

  let pipeline = sharp(input).resize({
    width: maxWidth,
    height: fit === 'cover' ? maxWidth : undefined,
    fit: fit ?? 'inside',
    withoutEnlargement: true,
  })

  const info = await pipeline.webp({ quality: 80, effort: 4 }).toFile(outputPath)

  console.log(`${name} -> ${outName} (${Math.round(info.size / 1024)} KB)`)
}
