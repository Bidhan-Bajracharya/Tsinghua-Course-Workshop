// Canvas drawing helpers for the live AI mirror.
// Landmarks come from MediaPipe Face Landmarker: 478 points with x/y from 0 to 1.
// The AI looks at the already-mirrored canvas picture, so its points can be drawn
// on that same canvas directly (x * width, y * height).

// Landmark index lists (MediaPipe face mesh numbering).
const LIPS_OUTER = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37, 39, 40, 185]
const LIPS_INNER = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191]
// Upper eyelid (outer → inner corner) and the middle of the eyebrow above it.
const EYES = [
  { lid: [33, 246, 161, 160, 159, 158, 157, 173, 133], brow: 105 },
  { lid: [263, 466, 388, 387, 386, 385, 384, 398, 362], brow: 334 },
]
const CHEEKS = [50, 280]
const FACE_EDGES = [234, 454] // left and right side of the face, used to size the blush

// How far the eye shadow reaches from the eyelid towards the eyebrow (0 = lid, 1 = brow).
const SHADOW_HEIGHT = 0.6

// Points named on the "AI sees you" view.
const LABELLED_POINTS = [
  { index: 159, key: 'eye' },
  { index: 386, key: 'eye' },
  { index: 1, key: 'nose' },
  { index: 13, key: 'lips' },
]

function toCanvas(point, width, height) {
  return { x: point.x * width, y: point.y * height }
}

function tracePath(ctx, landmarks, indexes, width, height) {
  indexes.forEach((index, i) => {
    const { x, y } = toCanvas(landmarks[index], width, height)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.closePath()
}

export function drawMirroredVideo(ctx, video, width, height) {
  ctx.save()
  ctx.translate(width, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(video, 0, 0, width, height)
  ctx.restore()
}

export function drawLandmarkDots(ctx, landmarks, width, height, labels) {
  const unit = width / 640 // keeps dots and text the same size on any camera resolution

  ctx.fillStyle = '#22e6a0'
  landmarks.forEach((point, index) => {
    if (index % 2 !== 0) return // every 2nd point is enough to see the "mesh"
    const { x, y } = toCanvas(point, width, height)
    ctx.beginPath()
    ctx.arc(x, y, 1.6 * unit, 0, Math.PI * 2)
    ctx.fill()
  })

  ctx.font = `bold ${16 * unit}px "Baloo 2", sans-serif`
  ctx.textAlign = 'center'
  LABELLED_POINTS.forEach(({ index, key }) => {
    const { x, y } = toCanvas(landmarks[index], width, height)
    ctx.fillStyle = '#ff5c8a'
    ctx.beginPath()
    ctx.arc(x, y, 5 * unit, 0, Math.PI * 2)
    ctx.fill()
    ctx.lineWidth = 4 * unit
    ctx.strokeStyle = '#fff'
    ctx.strokeText(labels[key], x, y - 12 * unit)
    ctx.fillStyle = '#2d2a4a'
    ctx.fillText(labels[key], x, y - 12 * unit)
  })
}

function distance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y)
}

// A soft, almond-shaped area from the eyelid up towards the crease: thin at the corners,
// tallest in the middle.
function traceEyeShadow(ctx, landmarks, eye, width, height) {
  const lid = eye.lid.map((index) => toCanvas(landmarks[index], width, height))
  const middle = lid[Math.floor(lid.length / 2)]
  const brow = toCanvas(landmarks[eye.brow], width, height)
  const up = { x: (brow.x - middle.x) * SHADOW_HEIGHT, y: (brow.y - middle.y) * SHADOW_HEIGHT }

  const crease = lid.map((point, i) => {
    const taper = Math.sin((Math.PI * i) / (lid.length - 1)) // 0 at the corners, 1 in the middle
    return { x: point.x + up.x * taper, y: point.y + up.y * taper }
  })

  const outline = [...lid, ...crease.reverse()] // along the lid, then back along the crease
  ctx.beginPath()
  outline.forEach(({ x, y }, i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)))
  ctx.closePath()
  return distance(lid[0], lid[lid.length - 1]) // eye width, used to size the soft edge
}

// style: { lips, eyeShadow, blush, strength } — colors may be null; strength 0–1 (default 1).
// Blend modes tint the skin instead of painting over it, so skin texture and shading still show.
export function drawMakeup(ctx, landmarks, width, height, style) {
  const strength = style.strength ?? 1
  ctx.save()

  if (style.eyeShadow) {
    ctx.globalCompositeOperation = 'multiply'
    ctx.globalAlpha = 0.7 * strength
    ctx.fillStyle = style.eyeShadow
    EYES.forEach((eye) => {
      ctx.save()
      const eyeWidth = traceEyeShadow(ctx, landmarks, eye, width, height)
      ctx.filter = `blur(${eyeWidth * 0.06}px)`
      ctx.fill()
      ctx.restore()
    })
  }

  if (style.blush) {
    const faceWidth = distance(
      toCanvas(landmarks[FACE_EDGES[0]], width, height),
      toCanvas(landmarks[FACE_EDGES[1]], width, height),
    )
    const radius = faceWidth * 0.12
    ctx.globalCompositeOperation = 'multiply'
    ctx.globalAlpha = 0.55 * strength
    ctx.filter = 'none'
    CHEEKS.forEach((index) => {
      const { x, y } = toCanvas(landmarks[index], width, height)
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, style.blush)
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)') // fade to "no change" when multiplied
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  if (style.lips) {
    ctx.filter = `blur(${width / 500}px)`
    ctx.fillStyle = style.lips
    ctx.beginPath()
    tracePath(ctx, landmarks, LIPS_OUTER, width, height)
    tracePath(ctx, landmarks, LIPS_INNER, width, height)
    // 1) 'color' changes the lip colour but keeps the lips' own light and shade,
    // 2) a light 'multiply' adds a little depth. 'evenodd' leaves an open mouth uncoloured.
    ctx.globalCompositeOperation = 'color'
    ctx.globalAlpha = 0.85 * strength
    ctx.fill('evenodd')
    ctx.globalCompositeOperation = 'multiply'
    ctx.globalAlpha = 0.25 * strength
    ctx.fill('evenodd')
  }

  ctx.restore()
}
