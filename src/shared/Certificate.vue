<script setup>
/**
 * Shared, personalised end-of-lesson certificate.
 * Step 1 asks for the student's name, step 2 shows the certificate,
 * which can be downloaded as a PNG (drawn on a canvas).
 */
import { ref, computed, nextTick } from 'vue'
import LumiCar from './mascots/LumiCar.vue'
import { drawLumi } from './mascots/lumi'

const props = defineProps({
  title: { type: String, required: true }, // e.g. "Robot Vacuum Expert!"
  line: { type: String, required: true }, // e.g. "for exploring how …"
  unitLabel: { type: String, required: true }, // e.g. "Unit 2 · Lesson 4 · Robot Vacuums"
  fileStem: { type: String, default: 'Certificate' },
  stars: { type: Number, default: 0 },
  maxStars: { type: Number, default: 3 },
  scoreText: { type: String, default: '' }, // e.g. "Quiz score: 7 / 8"
  extras: { type: Array, default: () => [] }, // short lines listed on the certificate
  extrasTitle: { type: String, default: '' },
  mascot: { type: String, default: 'robo' }, // 'robo' | 'lumi' | 'beep' | 'blinky' | 'snappy'
  signer: { type: String, default: 'Robo 🤖' },
  signerRole: { type: String, default: 'Chief Cleaning Robot' },
  initialName: { type: String, default: '' },
  showBack: { type: Boolean, default: true },
  backLabel: { type: String, default: '← Back to my score' },
})
const emit = defineEmits(['back', 'named'])

const name = ref(props.initialName)
const done = ref(!!props.initialName)
const input = ref(null)
const busy = ref(false)

const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
const cleanName = computed(() => name.value.trim().replace(/\s+/g, ' '))

function make() {
  if (!cleanName.value) {
    input.value?.focus()
    return
  }
  done.value = true
  emit('named', cleanName.value)
}
async function edit() {
  done.value = false
  await nextTick()
  input.value?.focus()
}

/* ---------- Download as PNG (drawn on a canvas) ---------- */
const HEAD = '"Baloo 2", "Nunito", "Trebuchet MS", sans-serif'
const BODY = '"Nunito", "Trebuchet MS", sans-serif'

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawRobo(ctx, x, y, size, angle = 0) {
  const s = size / 100
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((angle * Math.PI) / 180)
  ctx.scale(s, s)
  ctx.lineWidth = 4
  ctx.fillStyle = '#eef3fb'
  ctx.strokeStyle = '#3a4a6b'
  ctx.beginPath(); ctx.arc(0, 0, 50, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
  ctx.strokeStyle = '#2f7cf6'; ctx.lineWidth = 8; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.arc(0, 0, 50, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke()
  ctx.fillStyle = '#1d2b4f'
  ctx.beginPath(); ctx.arc(-14, -20, 6.5, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(14, -20, 6.5, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = '#1d2b4f'; ctx.lineWidth = 4
  ctx.beginPath(); ctx.arc(0, -4, 14, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke()
  ctx.fillStyle = '#2f3b55'
  ctx.beginPath(); ctx.arc(0, 24, 11, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#ef476f'
  ctx.beginPath(); ctx.arc(0, 24, 4, 0, Math.PI * 2); ctx.fill()
  ctx.restore()
}

/** Beep, the Face Scan Magic robot (art box 200 × 190). */
function drawBeep(ctx, x, y, size, angle = 0) {
  const s = size / 190
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((angle * Math.PI) / 180)
  ctx.scale(s, s)
  ctx.translate(-100, -95)
  const rect = (rx, ry, w, h, r, fill) => {
    rr(ctx, rx, ry, w, h, r)
    ctx.fillStyle = fill
    ctx.fill()
  }
  const dot = (cx, cy, r, fill) => {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill()
  }
  ctx.strokeStyle = '#1d2b4f'; ctx.lineWidth = 6; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(100, 30); ctx.lineTo(100, 8); ctx.stroke()
  dot(100, 8, 10, '#ff6b9a')
  rect(30, 30, 140, 110, 34, '#36b0f5')
  rect(48, 50, 104, 62, 22, '#1d2b4f')
  dot(78, 81, 12, '#7fe0ff')
  dot(122, 81, 12, '#7fe0ff')
  ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 7
  ctx.beginPath(); ctx.moveTo(84, 124); ctx.quadraticCurveTo(100, 134, 116, 124); ctx.stroke()
  rect(60, 146, 80, 38, 16, '#1f8fd6')
  ctx.restore()
}

/** Blinky, the AI Traffic Police traffic light (art box 120 × 200). */
function drawBlinky(ctx, x, y, size, angle = 0) {
  const s = size / 200
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((angle * Math.PI) / 180)
  ctx.scale(s, s)
  ctx.translate(-60, -100)
  const rect = (rx, ry, w, h, r, fill) => {
    rr(ctx, rx, ry, w, h, r)
    ctx.fillStyle = fill
    ctx.fill()
  }
  const dot = (cx, cy, r, fill) => {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill()
  }
  rect(52, 150, 16, 40, 6, '#5a6a8c')
  rect(36, 186, 48, 10, 5, '#5a6a8c')
  rect(14, 24, 92, 136, 30, '#1d2b4f')
  dot(60, 58, 15, '#ef476f')
  dot(60, 100, 22, '#ffb703')
  dot(52, 96, 3.6, '#1d2b4f')
  dot(68, 96, 3.6, '#1d2b4f')
  ctx.strokeStyle = '#1d2b4f'; ctx.lineWidth = 3.5; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(51, 106); ctx.quadraticCurveTo(60, 114, 69, 106); ctx.stroke()
  dot(60, 140, 13, '#22b573')
  ctx.beginPath(); ctx.moveTo(16, 34); ctx.quadraticCurveTo(60, -6, 104, 34); ctx.closePath(); ctx.fillStyle = '#2f7cf6'; ctx.fill()
  rect(8, 30, 104, 10, 5, '#1d2b4f')
  dot(60, 20, 6, '#ffd166')
  ctx.restore()
}

/** Snappy, the Beauty Cameras camera mascot (art box 120 × 110). */
function drawSnappy(ctx, x, y, size, angle = 0) {
  const s = size / 110
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((angle * Math.PI) / 180)
  ctx.scale(s, s)
  ctx.translate(-60, -55)
  ctx.lineWidth = 3
  ctx.strokeStyle = '#1d2b4f'
  const box = (rx, ry, w, h, r, fill) => { rr(ctx, rx, ry, w, h, r); ctx.fillStyle = fill; ctx.fill(); ctx.stroke() }
  const dot = (cx, cy, r, fill, stroke) => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); if (stroke) ctx.stroke() }
  box(22, 18, 26, 14, 5, '#ffd166')
  box(80, 22, 18, 10, 3, '#ffffff')
  box(8, 28, 104, 72, 20, '#ff5c8a')
  dot(60, 64, 28, '#ffffff', true)
  dot(51, 60, 4.5, '#1d2b4f')
  dot(69, 60, 4.5, '#1d2b4f')
  dot(42, 70, 4, '#ffb3c7')
  dot(78, 70, 4, '#ffb3c7')
  ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(50, 71); ctx.quadraticCurveTo(60, 80, 70, 71); ctx.stroke()
  ctx.restore()
}

function drawMascot(ctx, x, y, size, angle) {
  if (props.mascot === 'snappy') drawSnappy(ctx, x, y, size, angle)
  else if (props.mascot === 'blinky') drawBlinky(ctx, x, y, size, angle)
  else if (props.mascot === 'lumi') drawLumi(ctx, x, y, size * 1.35, angle)
  else if (props.mascot === 'beep') drawBeep(ctx, x, y, size, angle)
  else drawRobo(ctx, x, y, size, angle)
}

function star(ctx, cx, cy, r, fill) {
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 ? r * 0.45 : r
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad)
  }
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
}

function fitText(ctx, text, maxW, size, weight, family) {
  let s = size
  do {
    ctx.font = `${weight} ${s}px ${family}`
    if (ctx.measureText(text).width <= maxW) break
    s -= 2
  } while (s > 20)
}

function wrap(ctx, text, maxW) {
  const words = text.split(' ')
  const lines = []
  let cur = ''
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w
    if (ctx.measureText(t).width > maxW && cur) {
      lines.push(cur)
      cur = w
    } else cur = t
  }
  if (cur) lines.push(cur)
  return lines
}

async function download() {
  busy.value = true
  try {
    if (document.fonts?.ready) await document.fonts.ready
    const W = 1600
    const measure = document.createElement('canvas').getContext('2d')
    measure.font = `700 36px ${BODY}`
    const lineRows = wrap(measure, props.line, 1060)

    // vertical layout
    const yLine = 620
    const yStars = yLine + (lineRows.length - 1) * 48 + 92
    const yScore = yStars + 76
    let y = yScore
    const yExtrasHead = y + 66
    if (props.extras.length) y = yExtrasHead + 16 + props.extras.length * 44
    const yMedal = y + 100
    const ySig = yMedal + 44
    const cardBottom = ySig + 110
    const H = cardBottom + 60

    const c = document.createElement('canvas')
    c.width = W
    c.height = H
    const ctx = c.getContext('2d')

    const g = ctx.createLinearGradient(0, 0, W, H)
    g.addColorStop(0, '#dff0ff')
    g.addColorStop(1, '#fff4d6')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)

    const colors = ['#2f7cf6', '#ffb703', '#22b573', '#ef476f', '#8b5cf6']
    for (let i = 0; i < 70; i++) {
      ctx.save()
      ctx.translate((i * 233) % W, (i * 397) % H)
      ctx.rotate(i)
      ctx.fillStyle = colors[i % 5]
      ctx.globalAlpha = 0.55
      rr(ctx, -6, -10, 12, 20, 3)
      ctx.fill()
      ctx.restore()
    }

    ctx.fillStyle = '#ffffff'
    rr(ctx, 60, 60, W - 120, H - 120, 48)
    ctx.fill()
    ctx.lineWidth = 14
    ctx.strokeStyle = '#2f7cf6'
    ctx.stroke()
    ctx.setLineDash([18, 14])
    ctx.lineWidth = 4
    ctx.strokeStyle = '#ffb703'
    rr(ctx, 92, 92, W - 184, H - 184, 34)
    ctx.stroke()
    ctx.setLineDash([])

    drawMascot(ctx, 210, 200, 130, -14)
    drawMascot(ctx, W - 210, 200, 130, 14)

    ctx.textAlign = 'center'
    ctx.fillStyle = '#8b5cf6'
    ctx.font = `800 34px ${BODY}`
    ctx.fillText('★  CERTIFICATE OF ACHIEVEMENT  ★', W / 2, 190)

    ctx.fillStyle = '#1f5fcc'
    fitText(ctx, props.title, 900, 92, 800, HEAD)
    ctx.fillText(props.title, W / 2, 290)

    ctx.fillStyle = '#5a6a8c'
    ctx.font = `700 36px ${BODY}`
    ctx.fillText('This certificate is proudly given to', W / 2, 380)

    ctx.fillStyle = '#1d2b4f'
    fitText(ctx, cleanName.value, 1100, 110, 800, HEAD)
    ctx.fillText(cleanName.value, W / 2, 510)
    ctx.strokeStyle = '#ffb703'
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.beginPath(); ctx.moveTo(W / 2 - 420, 545); ctx.lineTo(W / 2 + 420, 545); ctx.stroke()

    ctx.fillStyle = '#1d2b4f'
    ctx.font = `700 36px ${BODY}`
    lineRows.forEach((row, i) => ctx.fillText(row, W / 2, yLine + i * 48))

    const n = props.maxStars
    const gap = n > 6 ? 78 : 110
    const r = n > 6 ? 30 : 44
    for (let i = 0; i < n; i++) star(ctx, W / 2 - ((n - 1) * gap) / 2 + i * gap, yStars, r, i < props.stars ? '#ffb703' : '#dfe6f2')
    if (props.scoreText) {
      ctx.fillStyle = '#5a6a8c'
      ctx.font = `800 32px ${BODY}`
      ctx.fillText(props.scoreText, W / 2, yScore)
    }

    if (props.extras.length) {
      ctx.fillStyle = '#8b5cf6'
      ctx.font = `800 26px ${BODY}`
      ctx.fillText(props.extrasTitle.toUpperCase(), W / 2, yExtrasHead)
      ctx.fillStyle = '#1d2b4f'
      ctx.font = `700 30px ${BODY}`
      props.extras.forEach((t, i) => ctx.fillText(t, W / 2, yExtrasHead + 50 + i * 44))
    }

    // footer
    ctx.font = `800 34px ${HEAD}`
    ctx.fillStyle = '#1d2b4f'
    ctx.fillText(today, 380, ySig)
    ctx.fillText(props.signer, W - 380, ySig)
    ctx.strokeStyle = '#c9d3e6'; ctx.lineWidth = 3
    ctx.beginPath(); ctx.moveTo(230, ySig + 18); ctx.lineTo(530, ySig + 18); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(W - 530, ySig + 18); ctx.lineTo(W - 230, ySig + 18); ctx.stroke()
    ctx.font = `700 24px ${BODY}`
    ctx.fillStyle = '#5a6a8c'
    ctx.fillText('Date', 380, ySig + 52)
    ctx.fillText(props.signerRole, W - 380, ySig + 52)

    // medal
    const m = yMedal
    ctx.fillStyle = '#ef476f'
    ctx.beginPath(); ctx.moveTo(W / 2 - 40, m + 10); ctx.lineTo(W / 2 - 58, m + 90); ctx.lineTo(W / 2 - 26, m + 75); ctx.lineTo(W / 2 - 8, m + 99); ctx.lineTo(W / 2, m + 30); ctx.fill()
    ctx.fillStyle = '#2f7cf6'
    ctx.beginPath(); ctx.moveTo(W / 2 + 40, m + 10); ctx.lineTo(W / 2 + 58, m + 90); ctx.lineTo(W / 2 + 26, m + 75); ctx.lineTo(W / 2 + 8, m + 99); ctx.lineTo(W / 2, m + 30); ctx.fill()
    ctx.fillStyle = '#ffb703'
    ctx.beginPath(); ctx.arc(W / 2, m, 58, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#fff4d6'
    ctx.beginPath(); ctx.arc(W / 2, m, 43, 0, Math.PI * 2); ctx.fill()
    drawMascot(ctx, W / 2, m, 62, 0)

    ctx.font = `800 22px ${BODY}`
    ctx.fillStyle = '#9aa9c6'
    ctx.fillText(props.unitLabel.toUpperCase(), W / 2, H - 24)

    const blob = await new Promise((res) => c.toBlob(res, 'image/png'))
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${props.fileStem}-${cleanName.value.replace(/[^\w-]+/g, '-')}.png`
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="certwrap">
    <!-- Step 1: ask for a name -->
    <div v-if="!done" class="ai-card ask">
      <div class="ask__icon">🎓</div>
      <h2>Let’s make your certificate!</h2>
      <p>What name should go on it?</p>
      <form class="ask__form" @submit.prevent="make">
        <input
          ref="input"
          v-model="name"
          class="ask__input"
          type="text"
          maxlength="30"
          placeholder="Type your name…"
          autocomplete="off"
          aria-label="Your name"
          autofocus
        />
        <button class="ai-btn ai-btn--accent ai-btn--big" type="submit" :disabled="!cleanName">✨ Make it!</button>
      </form>
      <button v-if="showBack" class="ai-btn ai-btn--small" @click="emit('back')">{{ backLabel }}</button>
    </div>

    <!-- Step 2: the certificate -->
    <template v-else>
      <div class="cert" role="img" :aria-label="`Certificate: ${title}, awarded to ${cleanName}`">
        <div class="cert__confetti" aria-hidden="true">
          <span v-for="i in 18" :key="i" :style="{ left: (i * 53) % 100 + '%', top: (i * 37) % 100 + '%', background: ['#2f7cf6','#ffb703','#22b573','#ef476f','#8b5cf6'][i % 5], transform: `rotate(${i * 40}deg)` }"></span>
        </div>
        <div class="cert__card">
          <template v-for="side in ['l', 'r']" :key="side">
            <svg v-if="mascot === 'lumi'" class="cert__bot cert__bot--car" :class="`cert__bot--${side}`" viewBox="0 0 120 72" aria-hidden="true">
              <LumiCar :flip="side === 'r'" />
            </svg>
            <svg v-else-if="mascot === 'beep'" class="cert__bot" :class="`cert__bot--${side}`" viewBox="0 0 200 190" aria-hidden="true">
              <line x1="100" y1="30" x2="100" y2="8" stroke="#1d2b4f" stroke-width="6" stroke-linecap="round" />
              <circle cx="100" cy="8" r="10" fill="#ff6b9a" />
              <rect x="30" y="30" width="140" height="110" rx="34" fill="#36b0f5" />
              <rect x="48" y="50" width="104" height="62" rx="22" fill="#1d2b4f" />
              <circle cx="78" cy="81" r="12" fill="#7fe0ff" /><circle cx="122" cy="81" r="12" fill="#7fe0ff" />
              <path d="M84 124 Q100 134 116 124" fill="none" stroke="#ffd166" stroke-width="7" stroke-linecap="round" />
              <rect x="60" y="146" width="80" height="38" rx="16" fill="#1f8fd6" />
            </svg>
            <svg v-else-if="mascot === 'snappy'" class="cert__bot" :class="`cert__bot--${side}`" viewBox="0 0 120 110" aria-hidden="true">
              <rect x="22" y="18" width="26" height="14" rx="5" fill="#ffd166" stroke="#1d2b4f" stroke-width="3" />
              <rect x="80" y="22" width="18" height="10" rx="3" fill="#fff" stroke="#1d2b4f" stroke-width="3" />
              <rect x="8" y="28" width="104" height="72" rx="20" fill="#ff5c8a" stroke="#1d2b4f" stroke-width="3" />
              <circle cx="60" cy="64" r="28" fill="#fff" stroke="#1d2b4f" stroke-width="3" />
              <circle cx="51" cy="60" r="4.5" fill="#1d2b4f" /><circle cx="69" cy="60" r="4.5" fill="#1d2b4f" />
              <path d="M50 71 Q60 80 70 71" stroke="#1d2b4f" stroke-width="3" fill="none" stroke-linecap="round" />
              <circle cx="42" cy="70" r="4" fill="#ffb3c7" /><circle cx="78" cy="70" r="4" fill="#ffb3c7" />
            </svg>
            <svg v-else-if="mascot === 'blinky'" class="cert__bot cert__bot--tall" :class="`cert__bot--${side}`" viewBox="0 0 120 200" aria-hidden="true">
              <rect x="52" y="150" width="16" height="40" rx="6" fill="#5a6a8c" /><rect x="36" y="186" width="48" height="10" rx="5" fill="#5a6a8c" />
              <rect x="14" y="24" width="92" height="136" rx="30" fill="#1d2b4f" />
              <circle cx="60" cy="58" r="15" fill="#ef476f" /><circle cx="60" cy="100" r="22" fill="#ffb703" />
              <circle cx="52" cy="96" r="3.6" fill="#1d2b4f" /><circle cx="68" cy="96" r="3.6" fill="#1d2b4f" />
              <path d="M51 106 Q60 114 69 106" fill="none" stroke="#1d2b4f" stroke-width="3.5" stroke-linecap="round" />
              <circle cx="60" cy="140" r="13" fill="#22b573" />
              <path d="M16 34 Q60 -6 104 34 Z" fill="#2f7cf6" /><rect x="8" y="30" width="104" height="10" rx="5" fill="#1d2b4f" /><circle cx="60" cy="20" r="6" fill="#ffd166" />
            </svg>
            <svg v-else class="cert__bot" :class="`cert__bot--${side}`" viewBox="-55 -55 110 110" aria-hidden="true">
              <circle r="50" fill="#eef3fb" stroke="#3a4a6b" stroke-width="4" />
              <path d="M -44 -22 A 50 50 0 0 1 44 -22" stroke="#2f7cf6" stroke-width="8" fill="none" stroke-linecap="round" />
              <circle cx="-14" cy="-20" r="6.5" fill="#1d2b4f" /><circle cx="14" cy="-20" r="6.5" fill="#1d2b4f" />
              <path d="M -12 0 Q 0 12 12 0" stroke="#1d2b4f" stroke-width="4" fill="none" stroke-linecap="round" />
              <circle cy="24" r="11" fill="#2f3b55" /><circle cy="24" r="4" fill="#ef476f" />
            </svg>
          </template>

          <p class="cert__kicker">★ Certificate of Achievement ★</p>
          <h2 class="cert__title">{{ title }}</h2>
          <p class="cert__given">This certificate is proudly given to</p>
          <p class="cert__name">{{ cleanName }}</p>
          <p class="cert__for">{{ line }}</p>
          <div class="cert__stars" :class="{ many: maxStars > 6 }">
            <span v-for="n in maxStars" :key="n" :class="{ on: n <= stars }">★</span>
          </div>
          <p v-if="scoreText" class="cert__score">{{ scoreText }}</p>

          <div v-if="extras.length" class="cert__extras">
            <p class="cert__extras-title">{{ extrasTitle }}</p>
            <ul>
              <li v-for="(e, i) in extras" :key="i">{{ e }}</li>
            </ul>
          </div>

          <div class="cert__foot">
            <div class="sig">
              <b>{{ today }}</b>
              <span>Date</span>
            </div>
            <div class="medal" aria-hidden="true">🏅</div>
            <div class="sig">
              <b>{{ signer }}</b>
              <span>{{ signerRole }}</span>
            </div>
          </div>
          <p class="cert__unit">{{ unitLabel }}</p>
        </div>
      </div>

      <div class="ai-row actions">
        <button class="ai-btn ai-btn--green ai-btn--big" :disabled="busy" @click="download">
          {{ busy ? '⏳ Making picture…' : '⬇️ Download certificate' }}
        </button>
        <button class="ai-btn" @click="edit">✏️ Change name</button>
        <button v-if="showBack" class="ai-btn" @click="emit('back')">{{ backLabel }}</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.certwrap { display: flex; flex-direction: column; gap: 18px; }

.ask { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; padding: 34px 20px; }
.ask__icon { font-size: 64px; line-height: 1; animation: wiggle 1.6s ease-in-out infinite; }
@keyframes wiggle { 50% { transform: rotate(-10deg) scale(1.08); } }
.ask h2 { font-size: 34px; color: var(--ai-primary-dark); }
.ask p { font-size: 20px; color: var(--ai-ink-soft); }
.ask__form { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; width: 100%; max-width: 620px; margin: 8px 0; }
.ask__input {
  flex: 1 1 260px;
  font: inherit;
  font-family: var(--ai-font-head);
  font-weight: 700;
  font-size: 26px;
  padding: 12px 20px;
  border-radius: 999px;
  border: 3px solid var(--ai-line);
  color: var(--ai-ink);
  background: #f8fbff;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.ask__input:focus { border-color: var(--ai-primary); box-shadow: 0 0 0 5px #d6e6ff; }

.cert {
  position: relative;
  border-radius: 28px;
  padding: clamp(14px, 3vw, 30px);
  background: linear-gradient(135deg, #dff0ff, #fff4d6);
  overflow: hidden;
  animation: grow 0.6s cubic-bezier(.3,1.5,.5,1) both;
}
@keyframes grow { from { transform: scale(0.85); opacity: 0; } }
.cert__confetti span { position: absolute; width: 10px; height: 16px; border-radius: 3px; opacity: 0.55; }
.cert__card {
  position: relative;
  background: #fff;
  border-radius: 24px;
  border: 8px solid var(--ai-primary);
  outline: 3px dashed var(--ai-accent);
  outline-offset: -22px;
  padding: clamp(30px, 5vw, 56px) clamp(18px, 5vw, 60px) 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.cert__bot { position: absolute; top: 26px; width: clamp(50px, 9vw, 86px); height: auto; }
.cert__bot--car { width: clamp(64px, 11vw, 110px); }
.cert__bot--tall { width: clamp(34px, 5.5vw, 54px); top: 18px; }
.cert__bot--l { left: 30px; transform: rotate(-14deg); }
.cert__bot--r { right: 30px; transform: rotate(14deg); }
.cert__kicker { color: var(--ai-purple); font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; font-size: clamp(13px, 1.8vw, 17px); }
.cert__title { font-size: clamp(30px, 5.4vw, 52px); color: var(--ai-primary-dark); }
.cert__given { color: var(--ai-ink-soft); font-weight: 700; font-size: clamp(15px, 2vw, 19px); margin-top: 6px; }
.cert__name {
  font-family: var(--ai-font-head);
  font-weight: 800;
  font-size: clamp(36px, 7vw, 64px);
  line-height: 1.1;
  padding: 0 24px 4px;
  border-bottom: 5px solid var(--ai-accent);
  max-width: 100%;
  overflow-wrap: anywhere;
}
.cert__for { font-weight: 700; font-size: clamp(16px, 2.2vw, 20px); max-width: 560px; margin-top: 6px; }
.cert__stars { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; font-size: clamp(34px, 5vw, 48px); line-height: 1; margin-top: 6px; }
.cert__stars.many { gap: 4px; font-size: clamp(22px, 3.4vw, 32px); }
.cert__stars span { color: #dfe6f2; }
.cert__stars span.on { color: var(--ai-accent); text-shadow: 0 3px 0 #d99a00; }
.cert__score { color: var(--ai-ink-soft); font-weight: 800; }
.cert__extras { margin-top: 6px; }
.cert__extras-title { color: var(--ai-purple); font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; font-size: 14px; }
.cert__extras ul { list-style: none; padding: 0; margin: 4px 0 0; font-weight: 700; display: grid; gap: 2px; }
.cert__foot { display: grid; grid-template-columns: 1fr auto 1fr; align-items: end; gap: 16px; width: 100%; margin-top: 14px; }
.sig { display: flex; flex-direction: column; align-items: center; }
.sig b { font-family: var(--ai-font-head); font-size: clamp(16px, 2.2vw, 22px); border-bottom: 3px solid #c9d3e6; padding: 0 12px 2px; }
.sig span { font-size: 14px; color: var(--ai-ink-soft); font-weight: 700; margin-top: 2px; }
.medal { font-size: clamp(44px, 7vw, 64px); line-height: 1; }
.cert__unit { margin-top: 10px; font-size: 13px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #9aa9c6; }
.actions { justify-content: center; }
</style>
