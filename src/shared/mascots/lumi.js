/**
 * Lumi, the self-driving car mascot (side view, faces right).
 * Drawn from a list of simple shapes so the same art renders in SVG (LumiCar.vue)
 * and on a <canvas> (certificate download). Native size: 120 × 72.
 */
export const LUMI_W = 120
export const LUMI_H = 72

export const LUMI_PARTS = [
  // roof lidar
  { t: 'rect', x: 55, y: 1, w: 18, h: 10, r: 4, fill: '#1d2b4f' },
  { t: 'rect', x: 55, y: 5, w: 18, h: 2.5, r: 0, fill: '#00e5ff' },
  { t: 'rect', x: 59, y: 10, w: 10, h: 4, r: 0, fill: '#1d2b4f' },
  // cabin + glass
  { t: 'path', d: 'M22 35 Q30 13 56 13 L76 13 Q99 14 107 35 Z', fill: '#2f7cf6' },
  { t: 'path', d: 'M32 34 Q39 19 57 18.5 L74 18.5 Q92 19 99 34 Z', fill: '#1d2b4f' },
  { t: 'path', d: 'M40 31 Q46 22 57 21.5', stroke: '#9fd8ff', sw: 2.2 },
  // friendly eyes in the windscreen
  { t: 'circle', cx: 74, cy: 26, r: 4.6, fill: '#ffffff' },
  { t: 'circle', cx: 88, cy: 26, r: 4.6, fill: '#ffffff' },
  { t: 'circle', cx: 75.5, cy: 26.5, r: 2.3, fill: '#1d2b4f' },
  { t: 'circle', cx: 89.5, cy: 26.5, r: 2.3, fill: '#1d2b4f' },
  // body
  { t: 'rect', x: 5, y: 31, w: 110, h: 26, r: 13, fill: '#2f7cf6' },
  { t: 'rect', x: 14, y: 43, w: 90, h: 3.5, r: 1.75, fill: '#00e5ff' },
  { t: 'rect', x: 101, y: 34, w: 12, h: 6, r: 3, fill: '#fff2b0' },
  { t: 'circle', cx: 104, cy: 49, r: 2.6, fill: '#1d2b4f' },
  { t: 'circle', cx: 104, cy: 49, r: 1.1, fill: '#00e5ff' },
  { t: 'rect', x: 5, y: 37, w: 6, h: 6, r: 2, fill: '#ef476f' },
  // wheels
  { t: 'circle', cx: 32, cy: 58, r: 11, fill: '#1d2b4f' },
  { t: 'circle', cx: 32, cy: 58, r: 5, fill: '#d3dcec' },
  { t: 'circle', cx: 32, cy: 58, r: 2, fill: '#00e5ff' },
  { t: 'circle', cx: 88, cy: 58, r: 11, fill: '#1d2b4f' },
  { t: 'circle', cx: 88, cy: 58, r: 5, fill: '#d3dcec' },
  { t: 'circle', cx: 88, cy: 58, r: 2, fill: '#00e5ff' },
]

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

/** Draw Lumi on a canvas, centred on (cx, cy), `width` px wide. */
export function drawLumi(ctx, cx, cy, width, angle = 0) {
  const s = width / LUMI_W
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate((angle * Math.PI) / 180)
  ctx.scale(s, s)
  ctx.translate(-LUMI_W / 2, -LUMI_H / 2)
  for (const p of LUMI_PARTS) {
    if (p.t === 'rect') {
      roundRect(ctx, p.x, p.y, p.w, p.h, p.r)
      ctx.fillStyle = p.fill
      ctx.fill()
    } else if (p.t === 'circle') {
      ctx.beginPath()
      ctx.arc(p.cx, p.cy, p.r, 0, Math.PI * 2)
      ctx.fillStyle = p.fill
      ctx.fill()
    } else {
      const path = new Path2D(p.d)
      if (p.fill) {
        ctx.fillStyle = p.fill
        ctx.fill(path)
      }
      if (p.stroke) {
        ctx.strokeStyle = p.stroke
        ctx.lineWidth = p.sw || 2
        ctx.lineCap = 'round'
        ctx.stroke(path)
      }
    }
  }
  ctx.restore()
}
