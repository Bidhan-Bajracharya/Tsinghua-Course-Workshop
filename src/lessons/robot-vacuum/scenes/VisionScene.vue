<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import RobotIcon from '../components/RobotIcon.vue'

const VW = 720
const VH = 280
const LANE_Y = 160
const SPEED = 95 // px per second

const types = [
  { id: 'sock', emoji: '🧦', label: 'sock', conf: 97, oops: 'Tangled! 😵' },
  { id: 'toy', emoji: '🧸', label: 'teddy', conf: 94, oops: 'Bonk! 💥' },
  { id: 'cat', emoji: '🐱', label: 'cat', conf: 99, oops: 'MEOW! 🙀' },
  { id: 'cable', emoji: '🔌', label: 'cable', conf: 92, oops: 'Tangled! 😵' },
  { id: 'shoe', emoji: '👟', label: 'shoe', conf: 95, oops: 'Bonk! 💥' },
]
const slots = [230, 370, 510, 650]

const camera = ref(true)
const items = reactive([])
const bot = reactive({ x: 40, y: LANE_Y, angle: 90, pause: 0, bubble: '', dizzy: false })
const dodged = ref(0)
const bumps = ref(0)
let uid = 0

function addItem(t) {
  const free = slots.filter((s) => !items.some((it) => Math.abs(it.x - s) < 40))
  if (!free.length) return
  // prefer a slot ahead of the robot so kids see the reaction quickly
  const ahead = free.filter((s) => s > bot.x + 80)
  const pool = ahead.length ? ahead : free
  const x = pool[Math.floor(Math.random() * pool.length)]
  items.push({ id: ++uid, type: t, x, y: LANE_Y, passed: false, flying: false })
}

function clearItems() {
  items.splice(0, items.length)
}

function avoidTarget() {
  for (const it of items) {
    if (it.flying) continue
    const dx = it.x - bot.x
    if (dx > -50 && dx < 95) return LANE_Y - 92
  }
  return LANE_Y
}

function isDetected(it) {
  if (!camera.value || it.flying) return false
  const dx = it.x - bot.x
  return dx > -40 && dx < 250
}

let last = 0
let raf = 0
function frame(now) {
  const dt = Math.min(0.05, (now - (last || now)) / 1000)
  last = now

  if (bot.pause > 0) {
    bot.pause -= dt
    if (bot.pause <= 0) {
      bot.bubble = ''
      bot.dizzy = false
    }
  } else {
    const prevY = bot.y
    bot.x += SPEED * dt
    const target = camera.value ? avoidTarget() : LANE_Y
    bot.y += (target - bot.y) * Math.min(1, dt * 4.5)
    const vy = (bot.y - prevY) / Math.max(dt, 1e-3)
    bot.angle = 90 + (Math.atan2(vy, SPEED) * 180) / Math.PI

    for (const it of items) {
      if (it.flying) continue
      const dx = it.x - bot.x
      if (camera.value) {
        if (!it.passed && dx < -50) {
          it.passed = true
          dodged.value++
          bot.bubble = `Dodged the ${it.type.label}! ✅`
          setTimeout(() => { if (bot.bubble.startsWith('Dodged')) bot.bubble = '' }, 900)
        }
      } else if (!it.passed && Math.abs(dx) < 36 && Math.abs(it.y - bot.y) < 40) {
        it.passed = true
        it.flying = true
        bumps.value++
        bot.pause = 1.3
        bot.dizzy = true
        bot.bubble = it.type.oops
        const id = it.id
        setTimeout(() => {
          const i = items.findIndex((x) => x.id === id)
          if (i >= 0) items.splice(i, 1)
        }, 900)
      }
    }

    if (bot.x > VW + 40) {
      bot.x = -40
      bot.y = LANE_Y
      items.forEach((it) => (it.passed = false))
    }
  }
  raf = requestAnimationFrame(frame)
}
onMounted(() => (raf = requestAnimationFrame(frame)))
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <section class="ai-scene">
    <div class="ai-scene__head">
      <span class="ai-tag">📷 Camera eyes + AI</span>
      <h2>Spot it, then dodge it!</h2>
      <p>Drop things on the floor in front of Robo. Its camera and AI work out <b>what</b> each thing is, so it can go around. Then switch the camera <b>off</b> and see what happens!</p>
    </div>

    <div class="ai-card stage">
      <div class="ai-row palette">
        <span class="palette__label">Drop:</span>
        <button v-for="t in types" :key="t.id" class="ai-btn drop" :disabled="items.length >= slots.length" @click="addItem(t)">
          <span class="drop__emoji">{{ t.emoji }}</span> {{ t.label }}
        </button>
        <button class="ai-btn ai-btn--small" :disabled="!items.length" @click="clearItems">🧹 Clear</button>
      </div>

      <svg :viewBox="`0 0 ${VW} ${VH}`" class="lane" role="img" aria-label="Robot driving across the floor">
        <defs>
          <pattern id="ai-planks" width="120" height="40" patternUnits="userSpaceOnUse">
            <rect width="120" height="40" fill="#f6e6c8" />
            <line x1="0" y1="39" x2="120" y2="39" stroke="#e3cba1" stroke-width="2" />
            <line x1="60" y1="0" x2="60" y2="40" stroke="#e3cba1" stroke-width="2" />
          </pattern>
        </defs>
        <rect x="0" y="0" :width="VW" :height="VH" rx="16" fill="url(#ai-planks)" />

        <!-- camera view cone -->
        <polygon
          v-if="camera"
          :points="`${bot.x + 18},${bot.y} ${bot.x + 260},${bot.y - 95} ${bot.x + 260},${bot.y + 95}`"
          fill="#8b5cf6"
          opacity="0.13"
        />

        <!-- items -->
        <g v-for="it in items" :key="it.id" class="item" :class="{ flying: it.flying }">
          <text :x="it.x" :y="it.y + 14" text-anchor="middle" font-size="40">{{ it.type.emoji }}</text>
          <g v-if="isDetected(it)">
            <rect :x="it.x - 30" :y="it.y - 30" width="60" height="56" rx="8" fill="none" stroke="#22b573" stroke-width="3" stroke-dasharray="7 4" />
            <rect :x="it.x - 30" :y="it.y - 54" :width="it.type.label.length * 9 + 46" height="22" rx="6" fill="#22b573" />
            <text :x="it.x - 24" :y="it.y - 38" font-size="14" font-weight="800" fill="#fff">{{ it.type.label }} {{ it.type.conf }}%</text>
          </g>
        </g>

        <!-- robot -->
        <RobotIcon :x="bot.x" :y="bot.y" :size="54" :angle="bot.angle" :camera="camera" laser :mood="bot.dizzy ? 'dizzy' : 'happy'" />
        <g v-if="bot.bubble" :transform="`translate(${Math.min(Math.max(bot.x, 90), VW - 90)} ${bot.y - 44})`">
          <rect x="-86" y="-18" width="172" height="28" rx="14" fill="#1d2b4f" opacity="0.9" />
          <text y="2" text-anchor="middle" font-size="15" font-weight="800" fill="#fff">{{ bot.bubble }}</text>
        </g>
      </svg>

      <div class="ai-row bottom">
        <button class="ai-btn switch" :class="{ 'is-on': camera }" :aria-pressed="camera" @click="camera = !camera">
          <span class="switch__track" :class="{ on: camera }"><span class="switch__knob"></span></span>
          Camera AI: <b>{{ camera ? 'ON' : 'OFF' }}</b>
        </button>
        <div class="counters">
          <span class="count count--good">✅ Dodged: <b>{{ dodged }}</b></span>
          <span class="count count--bad">💥 Bumps: <b>{{ bumps }}</b></span>
        </div>
      </div>
    </div>

    <div class="cards">
      <div class="ai-card how">
        <span class="how__n">1</span>
        <span class="how__icon">📸</span>
        <p>The camera takes <b>lots of pictures</b> every second.</p>
      </div>
      <div class="ai-card how">
        <span class="how__n">2</span>
        <span class="how__icon">🧠</span>
        <p>AI looks at each picture and asks: <b>“What is this?”</b> It learned by studying thousands of photos of socks, cables and pets.</p>
      </div>
      <div class="ai-card how">
        <span class="how__n">3</span>
        <span class="how__icon">↪️</span>
        <p>Robo <b>plans a new path</b> around it — no tangled socks, no grumpy cats!</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stage { display: flex; flex-direction: column; gap: 12px; padding: 14px; }
.palette { gap: 8px; }
.palette__label { font-weight: 800; color: var(--ai-ink-soft); }
.drop { font-size: 16px; padding: 6px 14px; }
.drop__emoji { font-size: 24px; }
.lane { width: 100%; height: auto; border-radius: 14px; }
.item text { transition: opacity 0.3s; }
.item.flying text { animation: fly 0.9s ease-in forwards; transform-box: fill-box; transform-origin: center; }
@keyframes fly {
  0% { transform: translate(0, 0) rotate(0); opacity: 1; }
  100% { transform: translate(40px, -140px) rotate(200deg); opacity: 0; }
}

.bottom { justify-content: space-between; }
.switch { gap: 10px; }
.switch__track {
  width: 46px; height: 26px; border-radius: 13px; background: #c9d3e6; position: relative; transition: background 0.2s;
}
.switch__track.on { background: var(--ai-green); }
.switch__knob {
  position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 50%; background: #fff;
  transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.25);
}
.switch__track.on .switch__knob { left: 23px; }
.counters { display: flex; gap: 10px; flex-wrap: wrap; }
.count { font-weight: 700; padding: 6px 14px; border-radius: 999px; font-size: 17px; }
.count--good { background: #e3f8ee; color: #137a4f; }
.count--bad { background: #ffe6ec; color: #b8264a; }

.cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
@media (max-width: 820px) { .cards { grid-template-columns: 1fr; } }
.how { position: relative; display: flex; flex-direction: column; gap: 6px; padding-top: 26px; }
.how__n {
  position: absolute; top: -12px; left: 16px; width: 34px; height: 34px; border-radius: 50%;
  background: var(--ai-purple); color: #fff; display: grid; place-items: center;
  font-family: var(--ai-font-head); font-weight: 800; font-size: 18px;
}
.how__icon { font-size: 40px; line-height: 1; }
</style>
