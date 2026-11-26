/* Small animated pictures for the final missions (420 × 240). Ported from the original lesson.js. */
import A from './art'
import { muddyCarSVG } from './frontcar'

let mudImg = null
const getMud = () => {
  if (!mudImg) {
    mudImg = new Image()
    mudImg.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(muddyCarSVG())
  }
  return mudImg
}

export const SCENES = {
  lane(c, W, H, t) {
    A.grass(c, W, H, 5)
    c.fillStyle = '#4b5063'; c.fillRect(0, 60, W, 100); c.fillStyle = '#5d6276'; c.fillRect(0, 160, W, 44)
    c.save(); c.beginPath(); c.rect(0, 160, W, 44); c.clip(); c.strokeStyle = 'rgba(255,210,63,.75)'; c.lineWidth = 5
    for (let x = -40; x < W + 40; x += 30) { c.beginPath(); c.moveTo(x, 204); c.lineTo(x + 36, 160); c.stroke() }
    c.restore()
    for (let i = 0; i < 5; i++) { A.car(c, 40 + i * 75, 85, 0, A.CAR_COLORS[i]); A.car(c, 30 + i * 75, 130, 0, A.CAR_COLORS[i + 5]) }
    A.car(c, 260, 182, 0, '#8338ec', 'suv'); A.tag(c, 260, 166, '?', '#fb8500')
    A.car(c, 60 + ((t * 30) % 40), 182, 0, '#fff', 'ambulance', { flash: true })
  },
  rush(c, W, H, t) {
    A.grass(c, W, H, 7); A.roadH(c, 0, W, 130, 1, 34); A.roadV(c, 0, H, W / 2, 1, 34)
    const cyc = t % 6, green = cyc >= 4.5, tg = green ? cyc - 4.5 : 0
    for (let i = 0; i < 7; i++) { const x = W / 2 - 60 - i * 54 + (green ? Math.max(0, tg * 160 - i * 25) : 0); A.car(c, x, 146, 0, A.CAR_COLORS[i], 'car', { brake: !green }) }
    if (!green) for (let i = 0; i < 2; i++) { const y = ((t * 90 + i * 140) % (H + 60)) - 30; A.car(c, W / 2 - 17, y, Math.PI / 2, A.CAR_COLORS[i + 7]) }
    A.light(c, W / 2 - 60, 190, green ? 'green' : 'red', 0, 0.8)
    A.tag(c, 90, 112, green ? 'Only 1.5 s of green…' : 'Long queue waiting!', '#ff5a5f', '#fff', 13)
    A.tag(c, W / 2 + 70, 40, 'Empty road gets 4.5 s', '#8a90a8', '#fff', 13)
  },
  muddy(c, W, H) {
    c.fillStyle = '#1d2b64'; c.fillRect(0, 0, W, H)
    c.save(); c.translate(W / 2, H - 8); c.scale(0.95, 0.95)
    const img = getMud()
    if (img.complete) c.drawImage(img, -170, -215, 340, 240)
    c.restore()
    c.strokeStyle = '#ff5a5f'; c.lineWidth = 3; c.setLineDash([6, 4]); c.strokeRect(W / 2 - 60, H - 80, 120, 40); c.setLineDash([])
    A.tag(c, W / 2, H - 86, '🤖 KL·52B0 ? (61%)', '#ff5a5f', '#fff', 14)
  },
}
