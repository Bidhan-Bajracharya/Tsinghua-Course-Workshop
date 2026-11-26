<script setup>
import { reactive, computed } from 'vue'
import LumiSay from '../components/LumiSay.vue'
import Icon from '../components/Icon.vue'
import LumiCar from '../../../shared/mascots/LumiCar.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { SENSORS } from '../data/content'

defineEmits(['next'])
const on = reactive({ cam: false, radar: false, lidar: false, map: false })
const count = computed(() => Object.values(on).filter(Boolean).length)
const lastKey = reactive({ k: null })

function toggle(k) {
  on[k] = !on[k]
  lastKey.k = on[k] ? k : null
}
const caption = computed(() => {
  if (count.value === 4) return 'Now I see everything! My AI brain puts it all together. 🧠'
  const s = SENSORS.find((x) => x.k === lastKey.k)
  return s ? s.c : `${count.value} / 4 sensors on`
})

// seeded "random" lidar dot cloud
function rnd(seed) {
  let s = seed
  return () => ((s = (Math.imul(s ^ (s >>> 15), 1 | s) + 0x6d2b79f5) | 0), ((s >>> 0) % 10000) / 10000)
}
const dots = (() => {
  const r = rnd(7)
  const out = []
  const objs = [[432, 170, 16, 34], [520, 182, 40, 22], [330, 174, 14, 26], [600, 110, 10, 60]]
  objs.forEach(([cx, cy, rx, ry]) => {
    for (let i = 0; i < 46; i++) {
      const a = r() * Math.PI * 2
      const k = Math.sqrt(r())
      out.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k, 2.2])
    }
  })
  for (let x = 170; x < 640; x += 14) out.push([x, 206 + r() * 4, 1.8])
  return out
})()
</script>

<template>
  <section class="ai-scene">
    <LumiSay text="Help! I can’t see! Switch on all my sensors." />

    <div class="ai-card stage">
      <svg viewBox="0 0 640 280" class="street" role="img" aria-label="Street scene seen by Lumi's sensors">
        <rect width="640" height="280" fill="#dff0ff" />
        <rect y="200" width="640" height="80" fill="#3a4a6b" />
        <rect width="640" height="280" fill="#0f1733" opacity=".93" />

        <g class="layer" :style="{ opacity: on.map ? 1 : 0 }">
          <path d="M0 214 H640 V262 H0Z" fill="#2f7cf6" opacity=".35" />
          <path d="M180 238 H600" stroke="#fff" stroke-width="6" stroke-dasharray="20 14" />
          <path d="M560 228 l30 10 -30 10z" fill="#fff" />
          <g transform="translate(90 120)"><path d="M0 34s-14-14-14-24a14 14 0 0 1 28 0c0 10-14 24-14 24z" fill="#ef476f" /><circle cy="10" r="5" fill="#fff" /></g>
          <text x="40" y="112" font-weight="800" font-size="14" fill="#fff">YOU ARE HERE</text>
        </g>

        <g class="layer" :style="{ opacity: on.cam ? 1 : 0 }">
          <rect y="200" width="640" height="80" fill="#3a4a6b" />
          <path d="M0 238 H640" stroke="#ffd166" stroke-width="5" stroke-dasharray="24 18" />
          <g transform="translate(600 60)"><rect x="-3" y="40" width="6" height="100" fill="#a5b4cf" /><rect x="-15" y="-6" width="30" height="58" rx="8" fill="#1d2b4f" /><circle cy="8" r="7" fill="#ff4d6d" /><circle cy="24" r="7" fill="#555" /><circle cy="40" r="7" fill="#555" /></g>
          <use href="#sd-person" x="420" y="136" width="24" height="54" class="lit" />
          <use href="#sd-car1960" x="470" y="160" width="100" height="58" />
          <g transform="translate(330 174)"><circle cx="-10" cy="20" r="10" fill="none" stroke="#fff" stroke-width="3" /><circle cx="14" cy="20" r="10" fill="none" stroke="#fff" stroke-width="3" /><path d="M-10 20 L2 2 L14 20 M2 2 L-2 -10" stroke="#fff" stroke-width="3" fill="none" /><circle cx="0" cy="-16" r="5" fill="#fff" /></g>
        </g>

        <g class="layer" :style="{ opacity: on.lidar ? 1 : 0 }" fill="#00e5ff">
          <circle v-for="(d, i) in dots" :key="i" :cx="d[0].toFixed(1)" :cy="d[1].toFixed(1)" :r="d[2]" />
        </g>

        <g class="layer" :style="{ opacity: on.radar ? 1 : 0 }">
          <g fill="none" stroke="#39d98a" stroke-width="2.5" opacity=".85" class="waves">
            <path d="M170 120 a90 90 0 0 1 0 140" /><path d="M200 90 a140 140 0 0 1 0 200" /><path d="M230 60 a200 200 0 0 1 0 260" />
          </g>
          <g font-weight="800" font-size="15" fill="#39d98a">
            <rect x="484" y="150" width="86" height="56" fill="none" stroke="#39d98a" stroke-width="3" rx="6" /><text x="486" y="144">20 m · 30 km/h</text>
            <rect x="410" y="130" width="44" height="64" fill="none" stroke="#39d98a" stroke-width="3" rx="6" /><text x="388" y="124">12 m</text>
            <rect x="312" y="150" width="40" height="50" fill="none" stroke="#39d98a" stroke-width="3" rx="6" /><text x="300" y="220">8 m · 15 km/h</text>
          </g>
        </g>

        <LumiCar :x="20" :y="158" :width="140" />
      </svg>
      <p class="cap" :class="{ all: count === 4 }">{{ caption }}</p>
    </div>

    <div class="sens">
      <button v-for="s in SENSORS" :key="s.k" class="sbtn" :class="{ on: on[s.k] }" :aria-pressed="on[s.k]" @click="toggle(s.k)">
        <Icon :name="s.i" />
        <span class="sbtn__name">{{ s.n }}</span>
        <span class="sw" :class="{ on: on[s.k] }"><span class="sw__knob"></span></span>
      </button>
    </div>

    <TeacherTip text="Ask: which sensor would help most at night? In fog? This previews the weather lab in Risk Ridge." />
  </section>
</template>

<style scoped>
.stage { display: flex; flex-direction: column; gap: 10px; padding: 12px; }
.street { width: 100%; height: auto; border-radius: 14px; }
.layer { transition: opacity 0.5s; }
.waves path { animation: wv 1.6s ease-in-out infinite; }
.waves path:nth-child(2) { animation-delay: 0.2s; }
.waves path:nth-child(3) { animation-delay: 0.4s; }
@keyframes wv { 50% { opacity: 0.25; } }
.cap { text-align: center; font-family: var(--ai-font-head); font-weight: 800; font-size: clamp(19px, 2.6vw, 24px); min-height: 1.3em; }
.cap.all { color: var(--ai-green); }

.sens { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
@media (max-width: 600px) { .sens { grid-template-columns: repeat(2, 1fr); } }
.sbtn {
  border: 0; font: inherit; color: var(--ai-ink); cursor: pointer; background: #fff; border-radius: 18px; padding: 12px 6px;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  box-shadow: inset 0 0 0 3px var(--ai-line), 0 4px 0 var(--ai-line); transition: transform 0.12s, background 0.15s;
}
.sbtn:hover { transform: translateY(-2px); }
.sbtn.on { background: #effbf5; box-shadow: inset 0 0 0 3px var(--ai-green), 0 4px 0 #17895a; }
.sbtn__name { font-family: var(--ai-font-head); font-weight: 800; font-size: 18px; }
.sw { width: 46px; height: 26px; border-radius: 13px; background: #c9d3e6; position: relative; transition: background 0.2s; }
.sw.on { background: var(--ai-green); }
.sw__knob { position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 50%; background: #fff; transition: left 0.2s; }
.sw.on .sw__knob { left: 23px; }
</style>
