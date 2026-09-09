import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const publicDir = path.resolve('public')
const source = path.join(publicDir, 'IMG_6850.PNG')

/** Trim padding, then export crisp tab/PWA icons from the wolf logo. */
async function buildFavicon(size, outputName, trim = true) {
  let pipeline = sharp(source)
  if (trim) {
    pipeline = pipeline.trim({ threshold: 12 })
  }

  await pipeline
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(path.join(publicDir, outputName))

  console.log(`Wrote ${outputName} (${size}x${size})`)
}

/** Wrap a PNG buffer in a single-image .ico (supported by modern browsers). */
function pngBufferToIco(pngBuffer, size) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(1, 4)

  const entry = Buffer.alloc(16)
  entry[0] = size >= 256 ? 0 : size
  entry[1] = size >= 256 ? 0 : size
  entry[2] = 0
  entry[3] = 0
  entry.writeUInt16LE(1, 4)
  entry.writeUInt16LE(32, 6)
  entry.writeUInt32LE(pngBuffer.length, 8)
  entry.writeUInt32LE(22, 12)

  return Buffer.concat([header, entry, pngBuffer])
}

async function buildFaviconIco(size = 32) {
  let pipeline = sharp(source).trim({ threshold: 12 })
  const pngBuffer = await pipeline
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()

  const icoBuffer = pngBufferToIco(pngBuffer, size)
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer)
  console.log(`Wrote favicon.ico (${size}x${size})`)
}

await buildFavicon(32, 'favicon-32x32.png')
await buildFavicon(32, 'favicon.png')
await buildFavicon(192, 'favicon-192x192.png')
await buildFavicon(512, 'apple-touch-icon.png')
await buildFaviconIco(32)

console.log('Favicon generation complete.')
