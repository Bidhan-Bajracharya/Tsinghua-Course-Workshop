<script setup>
import { ref, reactive, computed, onBeforeUnmount } from 'vue'
import RobotIcon from '../components/RobotIcon.vue'

/* ---------- Room layout (grid of floor tiles) ---------- */
const W = 14
const H = 9
const CELL = 30
const TICK_MS = 110
const STUCK_TICKS = 24

const blocks = [
  { x: 3, y: 0, w: 4, h: 2, emoji: '🛋️' },
  { x: 8, y: 4, w: 2, h: 2, emoji: '🪑' },
  { x: 0, y: 3, w: 1, h: 3, emoji: '📚' },
  { x: 13, y: 8, w: 1, h: 1, emoji: '🪴' },
]
const SOCK = { x: 5, y: 6 }
const START = { x: 0, y: 8 }

const key = (x, y) => `${x},${y}`
const isSock = (x, y) => x === SOCK.x && y === SOCK.y
function blocked(x, y) {
  if (x < 0 || y < 0 || x >= W || y >= H) return true
  return blocks.some((b) => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h)
}

const cells = []
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!blocked(x, y)) cells.push({ x, y })
// The sock tile isn't counted, so no robot is punished for skipping it.
const TOTAL = cells.filter((c) => !isSock(c.x, c.y)).length

/* ---------- Path planning for robots that have a map ---------- */
function bfs(from, to, isBlocked) {
  const prev = new Map([[key(from.x, from.y), null]])
  const q = [from]
  while (q.length) {
    const c = q.shift()
    if (c.x === to.x && c.y === to.y) break
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const n = { x: c.x + dx, y: c.y + dy }
      const k = key(n.x, n.y)
      if (isBlocked(n.x, n.y) || prev.has(k)) continue
      prev.set(k, c)
      q.push(n)
    }
  }
  if (!prev.has(key(to.x, to.y))) return null
  const path = []
  let c = to
  while (c && !(c.x === from.x && c.y === from.y)) {
    path.unshift(c)
    c = prev.get(key(c.x, c.y))
  }
  return path
}

function planRows(avoidSock) {
  const isBlocked = (x, y) => blocked(x, y) || (avoidSock && isSock(x, y))
  const order = []
  // "Lawn-mower" rows, starting from the bottom where the robot begins
  for (let r = 0; r < H; r++) {
    const y = H - 1 - r
    const xs = [...Array(W).keys()]
    if (r % 2) xs.reverse()
    for (const x of xs) if (!isBlocked(x, y)) order.push({ x, y })
  }
  const visited = new Set([key(START.x, START.y)])
  const path = []
  let cur = START
  for (const c of order) {
    if (visited.has(key(c.x, c.y))) continue
    const p = bfs(cur, c, isBlocked)
    if (!p) continue
    for (const s of p) {
      path.push(s)
      visited.add(key(s.x, s.y))
    }
    cur = c
  }
  return path
}

const PLAN_LASER = planRows(false) // laser is up high – it can't see a sock on the floor
const PLAN_VISION = planRows(true) // camera spots the sock and plans around it
const TICKS = PLAN_VISION.length + 6

/* ---------- Robots ---------- */
const modes = [
  { id: 'random', title: 'Bump & Turn', icon: '🎲', desc: 'No map. Drives until it bumps, then turns a random way.', laser: false, camera: false },
  { id: 'laser', title: 'Laser Map', icon: '🔦', desc: 'Draws a map and cleans in neat rows.', laser: true, camera: false },
  { id: 'vision', title: 'Laser + Camera AI', icon: '📷', desc: 'Neat rows, and the camera spots small things like socks.', laser: true, camera: true },
]

function makeBot(mode) {
  return {
    mode: mode.id,
    x: START.x,
    y: START.y,
    angle: 90,
    cleaned: new Set([key(START.x, START.y)]),
    step: 0,
    stuck: 0,
    sockGone: false,
    bubble: '',
    dir: { dx: 1, dy: 0 },
    bumps: 0,
  }
}

const bots = reactive(modes.map(makeBot))
const tick = ref(0)
const running = ref(false)
const finished = ref(false)
let timer = null

const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]

function moveTo(bot, nx, ny) {
  const dx = nx - bot.x
  const dy = ny - bot.y
  if (dx || dy) bot.angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90
  bot.x = nx
  bot.y = ny
  bot.cleaned.add(key(nx, ny))
  if (isSock(nx, ny) && !bot.sockGone) {
    bot.stuck = STUCK_TICKS
    bot.sockGone = true
    bot.bubble = 'Sock stuck! 😵'
  }
}

function stepBot(bot) {
  if (bot.stuck > 0) {
    bot.stuck--
    if (bot.stuck === 0) bot.bubble = ''
    return
  }
  if (bot.mode === 'random') {
    const nx = bot.x + bot.dir.dx
    const ny = bot.y + bot.dir.dy
    if (blocked(nx, ny)) {
      bot.bumps++
      bot.bubble = 'Bump!'
      const options = dirs.filter(([dx, dy]) => !(dx === bot.dir.dx && dy === bot.dir.dy))
      const [dx, dy] = options[Math.floor(Math.random() * options.length)]
      bot.dir = { dx, dy }
    } else {
      if (bot.bubble === 'Bump!') bot.bubble = ''
      moveTo(bot, nx, ny)
    }
    return
  }
  const plan = bot.mode === 'laser' ? PLAN_LASER : PLAN_VISION
  if (bot.step < plan.length) {
    const s = plan[bot.step++]
    moveTo(bot, s.x, s.y)
    if (bot.mode === 'vision') {
      const near = Math.abs(s.x - SOCK.x) + Math.abs(s.y - SOCK.y) === 1
      bot.bubble = near ? '👀 Sock! Go around' : ''
    }
  } else {
    bot.bubble = 'Done! ✨'
  }
}

function score(bot) {
  let n = 0
  for (const k of bot.cleaned) if (k !== key(SOCK.x, SOCK.y)) n++
  return Math.min(100, Math.round((n / TOTAL) * 100))
}
const scores = computed(() => bots.map(score))

function start() {
  if (finished.value) reset()
  running.value = true
  timer = setInterval(() => {
    tick.value++
    bots.forEach(stepBot)
    if (tick.value >= TICKS) {
      stop()
      finished.value = true
    }
  }, TICK_MS)
}
function stop() {
  running.value = false
  clearInterval(timer)
  timer = null
}
function reset() {
  stop()
  finished.value = false
  tick.value = 0
  modes.forEach((m, i) => Object.assign(bots[i], makeBot(m)))
}
onBeforeUnmount(stop)

const timeLeft = computed(() => Math.max(0, Math.ceil(((TICKS - tick.value) * TICK_MS) / 1000)))
const ranking = computed(() =>
  modes.map((m, i) => ({ ...m, score: scores.value[i] })).sort((a, b) => b.score - a.score),
)
const medals = ['🥇', '🥈', '🥉']
</script>

<template>
  <section class="ai-scene">
    <div class="ai-scene__head">
      <span class="ai-tag">🏁 Experiment</span>
      <h2>The Great Cleaning Race</h2>
      <p>Three robots, three identical messy rooms, the same amount of time. Who cleans the most floor?</p>
    </div>

    <div class="ai-card controls">
      <div class="ai-row">
        <button v-if="!running" class="ai-btn ai-btn--green ai-btn--big" @click="start">
          {{ finished ? '🔁 Race again' : tick > 0 ? '▶ Keep going' : '▶ Start race' }}
        </button>
        <button v-else class="ai-btn ai-btn--big" @click="stop">⏸ Pause</button>
        <button class="ai-btn" :disabled="tick === 0" @click="reset">↺ Reset</button>
      </div>
      <div class="clock">⏱️ <b>{{ timeLeft }}</b> s left</div>
    </div>

    <div class="rooms">
      <div v-for="(m, i) in modes" :key="m.id" class="ai-card room">
        <div class="room__head">
          <span class="room__icon">{{ m.icon }}</span>
          <div>
            <h3>{{ m.title }}</h3>
            <p>{{ m.desc }}</p>
          </div>
        </div>

        <svg :viewBox="`0 0 ${W * CELL} ${H * CELL}`" class="room__svg" role="img" :aria-label="`${m.title} room`">
          <defs>
            <pattern :id="`ai-dust-${m.id}`" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="#e8d6b4" />
              <circle cx="3" cy="3" r="1.6" fill="#b08d5c" />
              <circle cx="8" cy="7" r="1.2" fill="#b08d5c" />
            </pattern>
          </defs>
          <rect
            v-for="c in cells"
            :key="`${c.x},${c.y}`"
            :x="c.x * CELL"
            :y="c.y * CELL"
            :width="CELL"
            :height="CELL"
            :fill="bots[i].cleaned.has(`${c.x},${c.y}`) ? '#fffdf6' : `url(#ai-dust-${m.id})`"
            class="tile"
          />
          <g v-for="b in blocks" :key="b.emoji">
            <rect :x="b.x * CELL + 2" :y="b.y * CELL + 2" :width="b.w * CELL - 4" :height="b.h * CELL - 4" rx="8" fill="#a5b4cf" />
            <text
              :x="(b.x + b.w / 2) * CELL"
              :y="(b.y + b.h / 2) * CELL + 9"
              text-anchor="middle"
              :font-size="Math.min(b.w, b.h) * CELL * 0.75"
            >{{ b.emoji }}</text>
          </g>
          <text v-if="!bots[i].sockGone" :x="SOCK.x * CELL + 15" :y="SOCK.y * CELL + 22" text-anchor="middle" font-size="20">🧦</text>
          <rect
            v-if="m.camera && !bots[i].sockGone && bots[i].bubble.startsWith('👀')"
            :x="SOCK.x * CELL + 1" :y="SOCK.y * CELL + 1" :width="CELL - 2" :height="CELL - 2"
            fill="none" stroke="#22b573" stroke-width="2.5" stroke-dasharray="4 3" rx="4"
          />

          <g
            class="bot"
            :style="{ transform: `translate(${bots[i].x * CELL + CELL / 2}px, ${bots[i].y * CELL + CELL / 2}px)`, transitionDuration: TICK_MS + 'ms' }"
          >
            <RobotIcon :size="28" :angle="bots[i].angle" :laser="m.laser" :camera="m.camera" :mood="bots[i].stuck ? 'dizzy' : 'happy'" />
            <g v-if="bots[i].bubble" transform="translate(0 -26)">
              <rect x="-62" y="-16" width="124" height="22" rx="11" fill="#1d2b4f" opacity="0.88" />
              <text y="0" text-anchor="middle" font-size="12" fill="#fff" font-weight="800">{{ bots[i].bubble }}</text>
            </g>
          </g>
        </svg>

        <div class="room__score">
          <div class="ai-meter">
            <div class="ai-meter__fill" :style="{ width: scores[i] + '%' }"></div>
          </div>
          <b>{{ scores[i] }}%</b>
        </div>
        <p v-if="m.id === 'random'" class="room__note">Bumps: {{ bots[i].bumps }}</p>
      </div>
    </div>

    <Transition name="pop">
      <div v-if="finished" class="ai-card results">
        <h3>🏆 Results</h3>
        <ol>
          <li v-for="(r, k) in ranking" :key="r.id">
            <span class="medal">{{ medals[k] }}</span>
            <b>{{ r.icon }} {{ r.title }}</b>
            <span>cleaned {{ r.score }}% of the floor</span>
          </li>
        </ol>
        <div class="ai-fact">
          <span class="ai-fact__icon">💡</span>
          <p>
            <b>A map makes a big difference!</b> The bump-and-turn robot cleans some spots again and again and
            misses others. Robots with a map clean in neat rows. And the camera robot saw the sock, so it
            didn’t get stuck!
          </p>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.clock { font-size: 22px; font-family: var(--ai-font-head); }

.rooms {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
@media (max-width: 900px) {
  .rooms { grid-template-columns: 1fr; }
}
.room { display: flex; flex-direction: column; gap: 10px; padding: 14px; }
.room__head { display: flex; gap: 10px; align-items: flex-start; min-height: 74px; }
.room__icon { font-size: 34px; line-height: 1; }
.room h3 { font-size: 22px; }
.room__head p { font-size: 15px; color: var(--ai-ink-soft); }
.room__svg { width: 100%; height: auto; border-radius: 12px; background: #8d9bb8; }
.tile { stroke: rgba(150, 120, 80, 0.12); stroke-width: 1; transition: fill 0.3s; }
.bot { transition-property: transform; transition-timing-function: linear; }
.room__score { display: grid; grid-template-columns: 1fr auto; gap: 10px; align-items: center; }
.room__score b { font-family: var(--ai-font-head); font-size: 24px; min-width: 60px; text-align: right; }
.room__note { font-size: 14px; color: var(--ai-ink-soft); font-weight: 700; }

.results { display: flex; flex-direction: column; gap: 12px; }
.results h3 { font-size: 28px; }
.results ol { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
.results li {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  font-size: 19px;
  background: #f5f9ff;
  border-radius: 14px;
  padding: 8px 12px;
}
.medal { font-size: 28px; }

.pop-enter-active { transition: all 0.3s ease; }
.pop-enter-from { opacity: 0; transform: translateY(16px); }
</style>
