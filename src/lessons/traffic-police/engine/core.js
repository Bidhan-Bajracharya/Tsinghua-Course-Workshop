/* Small helpers shared by the traffic lesson's canvas sims: crisp canvas, animation loop, sounds, confetti. */
import { ref } from 'vue'

/** Hi-dpi canvas with a fixed logical size (CSS makes it fluid). */
export function makeCanvas(c, w, h) {
  const k = 2
  c.width = w * k
  c.height = h * k
  const ctx = c.getContext('2d')
  ctx.setTransform(k, 0, 0, k, 0, 0)
  c._w = w
  c._h = h
  return ctx
}

/** Pointer event → canvas logical coordinates. */
export function canvasPos(c, e) {
  const r = c.getBoundingClientRect()
  return { x: ((e.clientX - r.left) / r.width) * c._w, y: ((e.clientY - r.top) / r.height) * c._h }
}

/** requestAnimationFrame loop: fn(dt, seconds). */
export function Loop(fn) {
  let id = null
  let last = 0
  let run = false
  const tick = (t) => {
    if (!run) return
    const dt = Math.min(0.05, (t - (last || t)) / 1000)
    last = t
    fn(dt, t / 1000)
    id = requestAnimationFrame(tick)
  }
  return {
    start() {
      if (run) return
      run = true
      last = 0
      id = requestAnimationFrame(tick)
    },
    stop() {
      run = false
      cancelAnimationFrame(id)
    },
    get running() {
      return run
    },
  }
}

/* ---------- sound effects (WebAudio, no files) ---------- */
const KEY = 'ai-traffic-sound'
let initial = true
try {
  initial = localStorage.getItem(KEY) !== '0'
} catch (e) {
  /* storage blocked: keep default */
}
export const soundOn = ref(initial)
export function toggleSound() {
  soundOn.value = !soundOn.value
  try {
    localStorage.setItem(KEY, soundOn.value ? '1' : '0')
  } catch (e) {
    /* ignore */
  }
}

let AC = null
export function sfx(kind) {
  if (!soundOn.value) return
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)()
  } catch (e) {
    return
  }
  const t = AC.currentTime
  const tone = (f, d, type = 'sine', v = 0.15, at = 0, f2) => {
    const o = AC.createOscillator()
    const g = AC.createGain()
    o.type = type
    o.frequency.setValueAtTime(f, t + at)
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + at + d)
    g.gain.setValueAtTime(v, t + at)
    g.gain.exponentialRampToValueAtTime(0.001, t + at + d)
    o.connect(g)
    g.connect(AC.destination)
    o.start(t + at)
    o.stop(t + at + d)
  }
  if (kind === 'win') {
    tone(523, 0.15, 'triangle', 0.18)
    tone(659, 0.15, 'triangle', 0.18, 0.1)
    tone(784, 0.3, 'triangle', 0.18, 0.2)
  } else if (kind === 'ding') {
    tone(880, 0.5, 'sine', 0.2)
    tone(1320, 0.5, 'sine', 0.1, 0.05)
  } else if (kind === 'snap') {
    const b = AC.createBuffer(1, AC.sampleRate * 0.08, AC.sampleRate)
    const d = b.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length)
    const s = AC.createBufferSource()
    const g = AC.createGain()
    g.gain.value = 0.25
    s.buffer = b
    s.connect(g)
    g.connect(AC.destination)
    s.start()
  } else if (kind === 'honk') {
    tone(370, 0.35, 'sawtooth', 0.08)
    tone(440, 0.35, 'sawtooth', 0.06)
  } else if (kind === 'bad') tone(220, 0.3, 'square', 0.08, 0, 150)
  else if (kind === 'beep') tone(1000, 0.08, 'square', 0.06)
  else if (kind === 'whoosh') tone(300, 0.4, 'sawtooth', 0.04, 0, 1200)
  else if (kind === 'siren') {
    for (let i = 0; i < 3; i++) {
      tone(700, 0.25, 'triangle', 0.08, i * 0.5, 1000)
      tone(1000, 0.25, 'triangle', 0.08, i * 0.5 + 0.25, 700)
    }
  }
}

/* ---------- confetti (one fixed full-window canvas, created on demand) ---------- */
let fx = null
let fctx = null
let parts = []
let running = false
const COLS = ['#ef476f', '#2f7cf6', '#22b573', '#ffb703', '#8b5cf6', '#ff6fb5', '#00c2e0']
function ensureFx() {
  if (fx) return
  fx = document.createElement('canvas')
  fx.setAttribute('aria-hidden', 'true')
  fx.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999'
  document.body.appendChild(fx)
  fctx = fx.getContext('2d')
}
/** Burst at viewport coords (or at an element's centre). */
export function burst(x, y, n = 50, cols = COLS) {
  if (x && typeof x === 'object' && x.getBoundingClientRect) {
    const r = x.getBoundingClientRect()
    n = typeof y === 'number' ? y : n
    y = r.top + r.height / 2
    x = r.left + r.width / 2
  }
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  ensureFx()
  fx.width = innerWidth
  fx.height = innerHeight
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2
    const s = 4 + Math.random() * 9
    parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 5, r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.4, w: 8 + Math.random() * 8, h: 5 + Math.random() * 6, c: cols[i % cols.length], life: 1 })
  }
  if (!running) {
    running = true
    requestAnimationFrame(fxLoop)
  }
}
export function rain(n = 160) {
  for (let i = 0; i < n; i++) setTimeout(() => burst(Math.random() * innerWidth, -20, 1), i * 12)
}
function fxLoop() {
  fctx.clearRect(0, 0, fx.width, fx.height)
  parts.forEach((p) => {
    p.vy += 0.28
    p.vx *= 0.99
    p.x += p.vx
    p.y += p.vy
    p.r += p.vr
    p.life -= 0.007
    fctx.save()
    fctx.globalAlpha = Math.max(0, Math.min(1, p.life * 2))
    fctx.translate(p.x, p.y)
    fctx.rotate(p.r)
    fctx.fillStyle = p.c
    fctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
    fctx.restore()
  })
  parts = parts.filter((p) => p.life > 0 && p.y < fx.height + 60)
  if (parts.length) requestAnimationFrame(fxLoop)
  else {
    running = false
    fctx.clearRect(0, 0, fx.width, fx.height)
  }
}
