<script setup>
import { ref, shallowRef, computed, onMounted, onBeforeUnmount } from 'vue'
import RobotIcon from '../components/RobotIcon.vue'

/* ---------- The dark house ---------- */
const VW = 600
const VH = 400
const R = 16 // robot radius
const MAX_RANGE = 260
const RAYS = 36
const SPACING = 10 // distance between map dots along a wall
const MARK_RADIUS = 9 // a laser hit lights up map dots this close to it
const AUTO_FINISH = 97 // at this %, Robo fills in the last few dots itself

// Every piece of furniture is either flush against a wall or leaves a gap
// wider than Robo (2 × R = 32px), so there are no unreachable corners.
const furniture = [
  { x: 80, y: 20, w: 150, h: 50, emoji: '🛋️' }, // flush with top wall
  { x: 130, y: 220, w: 100, h: 70, emoji: '🍽️' }, // free-standing, wide gaps
  { x: 430, y: 280, w: 150, h: 100, emoji: '🛏️' }, // tucked into bottom-right corner
  { x: 450, y: 20, w: 80, h: 60, emoji: '📦' }, // flush with top wall
]
const wallSegs = [
  [20, 20, 580, 20], [580, 20, 580, 380], [580, 380, 20, 380], [20, 380, 20, 20],
  [320, 20, 320, 160], [320, 240, 320, 380],
]
const segs = [...wallSegs]
for (const f of furniture) {
  segs.push(
    [f.x, f.y, f.x + f.w, f.y], [f.x + f.w, f.y, f.x + f.w, f.y + f.h],
    [f.x + f.w, f.y + f.h, f.x, f.y + f.h], [f.x, f.y + f.h, f.x, f.y],
  )
}

function cast(ox, oy, a) {
  const dx = Math.cos(a)
  const dy = Math.sin(a)
  let best = MAX_RANGE
  let hit = false
  for (const [x1, y1, x2, y2] of segs) {
    const sx = x2 - x1
    const sy = y2 - y1
    const den = dx * sy - dy * sx
    if (Math.abs(den) < 1e-9) continue
    const t = ((x1 - ox) * sy - (y1 - oy) * sx) / den
    const u = ((x1 - ox) * dy - (y1 - oy) * dx) / den
    if (t > 0 && u >= 0 && u <= 1 && t < best) {
      best = t
      hit = true
    }
  }
  return { x: ox + dx * best, y: oy + dy * best, hit }
}

function distToSeg(px, py, [x1, y1, x2, y2]) {
  const sx = x2 - x1
  const sy = y2 - y1
  const l2 = sx * sx + sy * sy
  let t = ((px - x1) * sx + (py - y1) * sy) / l2
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(px - (x1 + t * sx), py - (y1 + t * sy))
}

function canStand(x, y) {
  if (x < 20 + R || x > 580 - R || y < 20 + R || y > 380 - R) return false
  for (const f of furniture) {
    if (x > f.x - R && x < f.x + f.w + R && y > f.y - R && y < f.y + f.h + R) return false
  }
  for (const s of wallSegs) if (distToSeg(x, y, s) < R) return false
  return true
}

/* ---------- Map dots ---------- */
// The map is a fixed set of dots spaced along every wall and furniture edge.
const allDots = new Map()
for (const [x1, y1, x2, y2] of segs) {
  const len = Math.hypot(x2 - x1, y2 - y1)
  const n = Math.max(1, Math.round(len / SPACING))
  for (let i = 0; i <= n; i++) {
    const x = Math.round(x1 + ((x2 - x1) * i) / n)
    const y = Math.round(y1 + ((y2 - y1) * i) / n)
    const k = `${x},${y}`
    if (!allDots.has(k)) allDots.set(k, { x, y, k })
  }
}

// Places Robo can actually drive to
const spots = []
for (let y = 20 + R; y <= 380 - R; y += 10) {
  for (let x = 20 + R; x <= 580 - R; x += 10) if (canStand(x, y)) spots.push([x, y])
}

// Keep only dots the laser can really reach from somewhere Robo can stand
// (e.g. the back of the sofa, pressed against the wall, is never counted).
function visibleFrom(px, py, d) {
  const dist = Math.hypot(d.x - px, d.y - py)
  if (dist > MAX_RANGE - 2) return false
  const h = cast(px, py, Math.atan2(d.y - py, d.x - px))
  return Math.hypot(h.x - px, h.y - py) >= dist - 1.5
}
const dots = [...allDots.values()].filter((d) => spots.some(([x, y]) => visibleFrom(x, y, d)))
const TOTAL = dots.length

// Spatial lookup so a laser hit can find nearby dots quickly
const bucket = new Map()
const bkey = (x, y) => `${Math.floor(x / SPACING)},${Math.floor(y / SPACING)}`
for (const d of dots) {
  const k = bkey(d.x, d.y)
  if (!bucket.has(k)) bucket.set(k, [])
  bucket.get(k).push(d)
}
function dotsNear(x, y) {
  const cx = Math.floor(x / SPACING)
  const cy = Math.floor(y / SPACING)
  const out = []
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      for (const d of bucket.get(`${cx + i},${cy + j}`) || []) {
        if (Math.hypot(d.x - x, d.y - y) <= MARK_RADIUS) out.push(d)
      }
    }
  }
  return out
}

/* ---------- State ---------- */
const START = { x: 60, y: 150 }
const pos = ref({ ...START })
const heading = ref(90)
const rays = shallowRef([])
const mapPts = shallowRef([])
const found = new Set()
const foundCount = ref(0)
const lightsOn = ref(false)
const autoMode = ref(false)
const dragging = ref(false)
const svgEl = ref(null)

const progress = computed(() => Math.min(100, Math.floor((foundCount.value / TOTAL) * 100)))
const complete = computed(() => foundCount.value >= TOTAL)

let spin = 0
let raf = 0

function markAll(list) {
  const fresh = list.filter((d) => !found.has(d.k))
  if (!fresh.length) return
  fresh.forEach((d) => found.add(d.k))
  foundCount.value = found.size
  mapPts.value = [...mapPts.value, ...fresh]
}

function scan() {
  spin += 0.05
  const { x, y } = pos.value
  const out = []
  const hits = []
  for (let i = 0; i < RAYS; i++) {
    const h = cast(x, y, spin + (i / RAYS) * Math.PI * 2)
    out.push(h)
    if (h.hit) hits.push(...dotsNear(h.x, h.y))
  }
  rays.value = out
  markAll(hits)
  // Last few tricky dots? Robo tidies up the map by itself.
  if (!complete.value && (foundCount.value / TOTAL) * 100 >= AUTO_FINISH) markAll(dots)
}

/* ---------- Moving the robot ---------- */
function tryMove(nx, ny) {
  const { x, y } = pos.value
  const dist = Math.hypot(nx - x, ny - y)
  if (dist < 0.5) return
  const steps = Math.ceil(dist / 3)
  let cx = x
  let cy = y
  for (let s = 1; s <= steps; s++) {
    const tx = x + ((nx - x) * s) / steps
    const ty = y + ((ny - y) * s) / steps
    if (!canStand(tx, ty)) break
    cx = tx
    cy = ty
  }
  if (cx !== x || cy !== y) {
    heading.value = (Math.atan2(cy - y, cx - x) * 180) / Math.PI + 90
    pos.value = { x: cx, y: cy }
  }
}

function toSvg(e) {
  const svg = svgEl.value
  const pt = svg.createSVGPoint()
  pt.x = e.clientX
  pt.y = e.clientY
  return pt.matrixTransform(svg.getScreenCTM().inverse())
}

function onDown(e) {
  const p = toSvg(e)
  if (Math.hypot(p.x - pos.value.x, p.y - pos.value.y) < R * 2.6) {
    dragging.value = true
    autoMode.value = false
    e.currentTarget.setPointerCapture?.(e.pointerId)
    e.preventDefault()
  }
}
function onMove(e) {
  if (!dragging.value) return
  const p = toSvg(e)
  tryMove(p.x, p.y)
}
function onUp() {
  dragging.value = false
}

/* ---------- Auto explore ---------- */
// Every leg is a straight line that stays clear of walls and furniture.
const route = [
  [60, 150], [45, 45], [50, 110], [280, 110], [285, 45], [280, 110],
  [280, 355], [45, 355], [45, 200], [180, 180], [270, 200],
  [370, 200], [370, 50], [370, 110], [560, 110], [560, 45], [560, 250],
  [370, 250], [370, 360],
]
let wp = 0
function startAuto() {
  autoMode.value = true
  wp = 0
}
function autoStep() {
  if (!autoMode.value) return
  const [tx, ty] = route[wp]
  const { x, y } = pos.value
  const d = Math.hypot(tx - x, ty - y)
  if (d < 3) {
    wp++
    if (wp >= route.length) autoMode.value = false
    return
  }
  const sp = Math.min(2.4, d)
  const nx = x + ((tx - x) / d) * sp
  const ny = y + ((ty - y) / d) * sp
  if (canStand(nx, ny)) {
    heading.value = (Math.atan2(ny - y, nx - x) * 180) / Math.PI + 90
    pos.value = { x: nx, y: ny }
  } else {
    // Safety net (the route is designed to be clear): hop to the waypoint.
    pos.value = { x: tx, y: ty }
  }
}

function resetMap() {
  found.clear()
  foundCount.value = 0
  mapPts.value = []
  pos.value = { ...START }
  autoMode.value = false
  lightsOn.value = false
}

function loop() {
  autoStep()
  scan()
  raf = requestAnimationFrame(loop)
}
onMounted(() => {
  raf = requestAnimationFrame(loop)
})
onBeforeUnmount(() => cancelAnimationFrame(raf))

const showRoom = computed(() => lightsOn.value || complete.value)
</script>

<template>
  <section class="ai-scene">
    <div class="ai-scene__head">
      <span class="ai-tag">🔦 Laser eyes</span>
      <h2>Draw a map in the dark!</h2>
      <p>The lights are off. <b>Drag Robo</b> around the house. Its laser bounces off walls and furniture — and every bounce becomes a dot on the map.</p>
    </div>

    <div class="ai-split">
      <div class="ai-card stage">
        <svg
          ref="svgEl"
          :viewBox="`0 0 ${VW} ${VH}`"
          class="house"
          :class="{ grabbing: dragging }"
          role="img"
          aria-label="Dark house that the robot maps with its laser"
          @pointerdown="onDown"
          @pointermove="onMove"
          @pointerup="onUp"
          @pointercancel="onUp"
        >
          <rect x="0" y="0" :width="VW" :height="VH" rx="18" fill="#0f1733" />

          <!-- the real room, hidden until lights on -->
          <g class="real" :style="{ opacity: showRoom ? 1 : 0.06 }">
            <rect x="20" y="20" width="560" height="360" fill="#fdf7ea" />
            <g v-for="f in furniture" :key="f.emoji">
              <rect :x="f.x" :y="f.y" :width="f.w" :height="f.h" rx="8" fill="#a5b4cf" />
              <text :x="f.x + f.w / 2" :y="f.y + f.h / 2 + 14" text-anchor="middle" font-size="38">{{ f.emoji }}</text>
            </g>
            <line v-for="(s, i) in wallSegs" :key="i" :x1="s[0]" :y1="s[1]" :x2="s[2]" :y2="s[3]" stroke="#5b4636" stroke-width="8" stroke-linecap="round" />
          </g>

          <!-- laser rays -->
          <g class="rays">
            <line
              v-for="(h, i) in rays"
              :key="i"
              :x1="pos.x" :y1="pos.y" :x2="h.x" :y2="h.y"
              stroke="#ff4d7d" stroke-width="1.4" :opacity="h.hit ? 0.55 : 0.2"
            />
          </g>

          <!-- the map Robo has built -->
          <g class="map">
            <rect v-for="p in mapPts" :key="p.k" :x="p.x - 3" :y="p.y - 3" width="6" height="6" rx="2" fill="#00e5ff" />
          </g>

          <g class="robot" :class="{ grab: !dragging }">
            <circle :cx="pos.x" :cy="pos.y" :r="R + 10" fill="#ffb703" opacity="0.25" class="halo" />
            <RobotIcon :x="pos.x" :y="pos.y" :size="R * 2.2" :angle="heading" laser />
          </g>

          <g v-if="progress === 0 && !dragging" class="hint">
            <rect :x="pos.x + 26" :y="pos.y - 18" width="150" height="34" rx="17" fill="#ffb703" />
            <text :x="pos.x + 101" :y="pos.y + 5" text-anchor="middle" font-size="16" font-weight="800" fill="#3b2a00">👈 Drag me!</text>
          </g>
        </svg>

        <div class="ai-row tools">
          <button class="ai-btn ai-btn--primary" :disabled="autoMode" @click="startAuto">🤖 Auto explore</button>
          <button class="ai-btn" :class="{ 'is-on': lightsOn }" @click="lightsOn = !lightsOn">
            {{ lightsOn ? '🌙 Lights off' : '💡 Peek (lights on)' }}
          </button>
          <button class="ai-btn" @click="resetMap">↺ New map</button>
        </div>
      </div>

      <div class="side">
        <div class="ai-card progress">
          <div class="progress__top">
            <b>🗺️ Map drawn</b>
            <span class="pct">{{ progress }}%</span>
          </div>
          <div class="ai-meter">
            <div class="ai-meter__fill" :style="{ width: progress + '%', background: 'var(--ai-cyan)' }"></div>
          </div>
          <p v-if="complete" class="done">🎉 Map complete! Now Robo knows the house and can plan the best cleaning path.</p>
          <p v-else class="sub">Explore every room — don’t forget behind the furniture!</p>
        </div>

        <div class="ai-card what">
          <h3>What is a laser? 🔦</h3>
          <p>A laser is a <b>super-straight beam of light</b>.</p>
          <div class="bounce" aria-hidden="true">
            <span class="bounce__bot">🤖</span>
            <span class="bounce__beam"></span>
            <span class="bounce__wall"></span>
          </div>
          <p>Robo shines it at a wall, and the light <b>bounces back</b>. The quicker it comes back, the <b>closer</b> the wall is!</p>
        </div>

        <div class="ai-fact">
          <span class="ai-fact__icon">🚗</span>
          <p>Self-driving cars and drones use lasers like this to “see” the world too!</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stage { display: flex; flex-direction: column; gap: 12px; padding: 12px; }
.house { width: 100%; height: auto; touch-action: none; user-select: none; border-radius: 14px; }
.house.grabbing { cursor: grabbing; }
.robot.grab { cursor: grab; }
.real { transition: opacity 0.6s ease; }
.halo { animation: halo 1.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes halo { 50% { opacity: 0.05; transform: scale(1.25); } }
.hint { pointer-events: none; animation: bob 1s ease-in-out infinite; }
@keyframes bob { 50% { transform: translateX(6px); } }
.tools { justify-content: center; }

.side { display: flex; flex-direction: column; gap: 14px; }
.progress { display: flex; flex-direction: column; gap: 10px; }
.progress__top { display: flex; justify-content: space-between; align-items: center; }
.pct { font-family: var(--ai-font-head); font-weight: 800; font-size: 28px; color: #0096b4; }
.done { font-weight: 800; color: var(--ai-green); }
.sub { color: var(--ai-ink-soft); font-size: 16px; }

.what { display: flex; flex-direction: column; gap: 10px; }
.what h3 { font-size: 24px; }
.bounce {
  position: relative;
  height: 46px;
  background: #0f1733;
  border-radius: 12px;
  overflow: hidden;
}
.bounce__bot { position: absolute; left: 8px; top: 8px; font-size: 26px; }
.bounce__wall { position: absolute; right: 10px; top: 6px; bottom: 6px; width: 10px; border-radius: 4px; background: #9c7b5b; }
.bounce__beam {
  position: absolute;
  top: 21px;
  left: 44px;
  width: 26px;
  height: 4px;
  border-radius: 2px;
  background: #ff4d7d;
  box-shadow: 0 0 8px #ff4d7d;
  animation: beam 1.8s linear infinite;
}
@keyframes beam {
  0% { left: 44px; }
  50% { left: calc(100% - 46px); }
  100% { left: 44px; }
}
</style>
