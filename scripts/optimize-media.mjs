/**
 * Compresses images and video in /public for faster page loads.
 * Run: npm run optimize-media
 */
import sharp from 'sharp'
import { readdir, stat, rename, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '..', 'public')

function kb(bytes) {
  return `${Math.round(bytes / 1024)} KB`
}

async function sizeOf(filePath) {
  return (await stat(filePath)).size
}

async function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', ['-y', ...args], { stdio: ['ignore', 'pipe', 'pipe'] })
    let stderr = ''
    proc.stderr.on('data', (chunk) => {
      stderr += chunk
    })
    proc.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(stderr.slice(-800)))
    })
  })
}

async function writeWebp(inputPath, outputPath, { maxWidth, quality = 78, fit = 'inside' }) {
  const info = await sharp(inputPath)
    .resize({
      width: maxWidth,
      height: fit === 'cover' ? maxWidth : undefined,
      fit,
      withoutEnlargement: true,
    })
    .webp({ quality, effort: 4 })
    .toFile(outputPath)
  return info.size
}

async function compressInPlace(filePath, { maxWidth, quality = 76 }) {
  const ext = path.extname(filePath).toLowerCase()
  const tempPath = `${filePath}.tmp`
  let pipeline = sharp(filePath).resize({
    width: maxWidth,
    fit: 'inside',
    withoutEnlargement: true,
  })

  if (ext === '.png') {
    await pipeline.png({ compressionLevel: 9, effort: 10 }).toFile(tempPath)
  } else if (ext === '.jpg' || ext === '.jpeg') {
    await pipeline.jpeg({ quality, mozjpeg: true }).toFile(tempPath)
  } else {
    return null
  }

  const before = await sizeOf(filePath)
  const after = await sizeOf(tempPath)
  if (after < before) {
    await rename(tempPath, filePath)
    return { before, after }
  }

  await unlink(tempPath)
  return { before, after: before, skipped: true }
}

async function optimizeBackground({ name, maxWidth = 1600, webpQuality = 78, fallbackMax = 1100 }) {
  const input = path.join(publicDir, name)
  if (!existsSync(input)) {
    console.log(`skip ${name} (missing)`)
    return
  }

  const webpName = name.replace(/\.(png|jpe?g)$/i, '.webp')
  const webpPath = path.join(publicDir, webpName)

  const webpSize = await writeWebp(input, webpPath, { maxWidth, quality: webpQuality })
  console.log(`${name} -> ${webpName} (${kb(webpSize)})`)

  const fallback = await compressInPlace(input, { maxWidth: fallbackMax, quality: 72 })
  if (fallback) {
    const note = fallback.skipped ? 'unchanged' : `${kb(fallback.before)} -> ${kb(fallback.after)}`
    console.log(`  fallback ${name}: ${note}`)
  }
}

async function optimizeBrands() {
  const brandsDir = path.join(publicDir, 'brands')
  if (!existsSync(brandsDir)) return

  const files = await readdir(brandsDir)
  for (const file of files) {
    if (!/\.(png|jpe?g)$/i.test(file)) continue

    const input = path.join(brandsDir, file)
    const webpPath = path.join(brandsDir, file.replace(/\.(png|jpe?g)$/i, '.webp'))

    const webpSize = await writeWebp(input, webpPath, { maxWidth: 320, quality: 82 })
    const compressed = await compressInPlace(input, { maxWidth: 400, quality: 80 })
    const note = compressed?.skipped
      ? 'unchanged'
      : `${kb(compressed?.before ?? 0)} -> ${kb(compressed?.after ?? 0)}`
    console.log(`brand ${file} -> ${path.basename(webpPath)} (${kb(webpSize)}), src ${note}`)
  }
}

async function optimizeLogos() {
  const logos = [
    { name: 'IMG_6850.PNG', maxWidth: 800 },
    { name: 'Wordmark - Transparent-03.png', maxWidth: 640 },
    { name: 'og-image.png', maxWidth: 1200 },
    { name: 'Primary_Logo_-_BG-01-removebg-preview (1).png', maxWidth: 512 },
  ]

  for (const { name, maxWidth } of logos) {
    const filePath = path.join(publicDir, name)
    if (!existsSync(filePath)) continue
    const result = await compressInPlace(filePath, { maxWidth, quality: 82 })
    if (result) {
      const note = result.skipped ? 'unchanged' : `${kb(result.before)} -> ${kb(result.after)}`
      console.log(`logo ${name}: ${note}`)
    }
  }
}

async function optimizeInstagramTiles() {
  const tiles = [
    { name: 'instagram-product-showcase.png', maxWidth: 960, output: 'instagram-product-showcase.webp' },
    { name: 'special-colors-skyshot-bg.png', maxWidth: 640, output: 'special-colors-skyshot-instagram.webp' },
    { name: 'about-celebration-sparkler.jpg', maxWidth: 640, output: 'about-celebration-sparkler-instagram.webp' },
    { name: 'premium-quality-card.webp', maxWidth: 640, output: 'premium-quality-instagram.webp', fit: 'cover' },
    { name: 'wide-variety-card.webp', maxWidth: 640, output: 'wide-variety-instagram.webp', fit: 'cover' },
  ]

  for (const { name, maxWidth, output, fit } of tiles) {
    const input = path.join(publicDir, name)
    if (!existsSync(input)) continue
    const outputPath = path.join(publicDir, output)
    const webpSize = await writeWebp(input, outputPath, { maxWidth, quality: 78, fit })
    console.log(`tile ${name} -> ${output} (${kb(webpSize)})`)
  }
}

async function optimizeHeroVideo() {
  const input = path.join(publicDir, 'hero.mp4')
  if (!existsSync(input)) {
    console.log('skip hero.mp4 (missing)')
    return
  }

  const compressedMp4 = path.join(publicDir, 'hero.compressed.mp4')
  const posterJpg = path.join(publicDir, 'hero-poster.jpg')
  const posterWebp = path.join(publicDir, 'hero-poster.webp')

  const before = await sizeOf(input)

  await runFfmpeg([
    '-i',
    input,
    '-an',
    '-c:v',
    'libx264',
    '-crf',
    '28',
    '-preset',
    'slow',
    '-vf',
    "scale='min(720,iw)':-2",
    '-movflags',
    '+faststart',
    compressedMp4,
  ])

  const mp4After = await sizeOf(compressedMp4)
  if (mp4After < before) {
    await unlink(input)
    await rename(compressedMp4, input)
    console.log(`hero.mp4: ${kb(before)} -> ${kb(mp4After)}`)
  } else {
    await unlink(compressedMp4)
    console.log(`hero.mp4: kept original (${kb(before)})`)
  }

  await runFfmpeg(['-i', input, '-ss', '00:00:00.5', '-vframes', '1', '-q:v', '3', posterJpg])
  const posterWebpSize = await writeWebp(posterJpg, posterWebp, { maxWidth: 1280, quality: 76 })
  await compressInPlace(posterJpg, { maxWidth: 1280, quality: 78 })
  console.log(`hero-poster.webp: ${kb(posterWebpSize)}`)
}

const backgrounds = [
  { name: 'contact-section-bg.png', maxWidth: 1920 },
  { name: 'how-it-works-bg.png', maxWidth: 1600 },
  { name: 'products-hero.png', maxWidth: 1600 },
  { name: 'about-vision-bg.png', maxWidth: 1400 },
  { name: 'about-safety-bg.png', maxWidth: 1200 },
  { name: 'premium-quality-card.png', maxWidth: 960 },
  { name: 'wide-variety-card.png', maxWidth: 960 },
  { name: 'competitive-pricing-card.png', maxWidth: 960 },
  { name: 'customer-support-card.png', maxWidth: 960 },
  { name: 'trusted-service-card.png', maxWidth: 960 },
  { name: 'fast-delivery-card.png', maxWidth: 960 },
  { name: 'browse-products-step-bg.png', maxWidth: 960 },
  { name: 'add-to-cart-step-bg.png', maxWidth: 960 },
  { name: 'review-cart-step-bg.png', maxWidth: 960 },
  { name: 'whatsapp-enquiry-step-bg.png', maxWidth: 960 },
  { name: 'we-contact-you-step-bg.png', maxWidth: 960 },
  { name: 'special-colors-skyshot-bg.png', maxWidth: 960 },
  { name: 'instagram-product-showcase.png', maxWidth: 960 },
  { name: 'about-celebration-sparkler.jpg', maxWidth: 960 },
]

console.log('Optimizing background images...')
for (const bg of backgrounds) {
  await optimizeBackground(bg)
}

console.log('\nOptimizing brand logos...')
await optimizeBrands()

console.log('\nOptimizing site logos...')
await optimizeLogos()

console.log('\nOptimizing Instagram tiles...')
await optimizeInstagramTiles()

console.log('\nOptimizing hero video + poster...')
await optimizeHeroVideo()

console.log('\nDone.')
