<script setup>
/** Can one police officer watch the road all day and all night? (24-hour slider) */
import { ref, computed, onBeforeUnmount } from 'vue'
import LearnCard from '../components/LearnCard.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { LEARN, NOTES } from '../data/content'

const h = ref(10)
let raf = 0
function playDay() {
  cancelAnimationFrame(raf)
  const t0 = performance.now()
  const tick = (t) => {
    h.value = Math.min(24, ((t - t0) / 9000) * 24)
    if (h.value < 24) raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
}
onBeforeUnmount(() => cancelAnimationFrame(raf))
const stopPlay = () => cancelAnimationFrame(raf)

const night = computed(() => h.value < 6 || h.value >= 19)
const dusk = computed(() => (h.value >= 17 && h.value < 19) || (h.value >= 6 && h.value < 7.5))
const sky = computed(() => (night.value ? 'linear-gradient(#141b4d,#2c3a8a)' : dusk.value ? 'linear-gradient(#ff9a6b,#ffd29a)' : 'linear-gradient(#5ec2ff,#cdeeff)'))
const orb = computed(() => {
  const H = h.value
  if (!night.value) {
    const a = ((H - 6) / 12) * Math.PI
    return { left: 50 - Math.cos(a) * 42 + '%', top: 70 - Math.sin(a) * 58 + '%' }
  }
  const b = (((H + 24 - 19) % 24) / 11) * Math.PI
  return { left: 50 - Math.cos(b) * 42 + '%', top: 70 - Math.sin(b) * 58 + '%' }
})
const clock = computed(() => String(Math.floor(h.value) % 24).padStart(2, '0') + ':' + (h.value % 1 >= 0.5 ? '30' : '00'))
const onDuty = computed(() => h.value >= 8 && h.value < 17)
const energy = computed(() => (onDuty.value ? Math.max(10, 100 - (h.value - 8) * 10) : 0))
const offMsg = computed(() => {
  if (onDuty.value) return energy.value > 60 ? 'On duty: watching one crossroads' : 'Getting tired… legs hurt, hot sun'
  return h.value < 8 ? 'Not at work yet' : 'Home: needs to sleep 😴'
})
const counts = computed(() => {
  const cph = (x) => ((x >= 7 && x < 9) || (x >= 17 && x < 19) ? 900 : x >= 22 || x < 6 ? 120 : 500)
  let cam = 0
  let off = 0
  for (let x = 0; x < h.value; x += 0.5) {
    const c = cph(x) * 0.5
    cam += c * 12
    if (x >= 8 && x < 17) off += c
  }
  return { cam: Math.round(cam).toLocaleString('en-GB'), off: Math.round(off).toLocaleString('en-GB') }
})
const eColor = computed(() => (energy.value > 60 ? '#22b573' : energy.value > 30 ? '#ffb703' : '#ef476f'))
</script>

<template>
  <section class="ai-scene">
    <LearnCard :card="LEARN.hook" />
    <div class="ai-scene__head">
      <span class="ai-tag">Think about it</span>
      <h2>Can one police officer watch the road all day and all night?</h2>
    </div>

    <div class="hook">
      <div class="sky ai-card" :style="{ background: sky }">
        <div class="orb tp-anim" :class="night ? 'moon' : 'sun'" :style="orb"></div>
        <div class="city"></div>
        <div class="time">{{ clock }}</div>
        <div class="ctrl">
          <input v-model.number="h" class="tp-range" type="range" min="0" max="24" step="0.5" aria-label="Time of day" @input="stopPlay" />
          <button class="ai-btn ai-btn--accent" @click="playDay">▶ Play a day</button>
        </div>
      </div>

      <div class="who ai-card">
        <svg class="pic tp-anim" :class="{ off: !onDuty }" viewBox="0 0 200 220" aria-hidden="true">
          <ellipse cx="100" cy="212" rx="60" ry="8" fill="rgba(0,0,0,.15)" />
          <rect x="62" y="150" width="30" height="60" rx="12" fill="#1d2b64" /><rect x="108" y="150" width="30" height="60" rx="12" fill="#1d2b64" />
          <path d="M50,160 Q50,96 100,96 Q150,96 150,160Z" fill="#2b4fbf" /><rect x="92" y="100" width="16" height="60" fill="#fff" /><path d="M100,104 L94,118 L100,150 L106,118Z" fill="#1d2b64" />
          <rect x="56" y="118" width="88" height="12" fill="#ffd23f" opacity=".9" /><rect x="56" y="138" width="88" height="8" fill="#ffd23f" opacity=".9" />
          <path d="M146,112 Q176,92 168,60" stroke="#2b4fbf" stroke-width="20" stroke-linecap="round" fill="none" /><circle cx="168" cy="56" r="11" fill="#f2c29b" />
          <path d="M54,112 Q34,140 46,166" stroke="#2b4fbf" stroke-width="20" stroke-linecap="round" fill="none" /><circle cx="47" cy="170" r="10" fill="#f2c29b" />
          <circle cx="100" cy="66" r="30" fill="#f2c29b" /><circle cx="89" cy="66" r="3.5" fill="#22264a" /><circle cx="111" cy="66" r="3.5" fill="#22264a" />
          <path d="M91,80 Q100,86 109,80" stroke="#22264a" stroke-width="3" fill="none" stroke-linecap="round" />
          <path d="M64,50 Q100,18 136,50 L136,56 L64,56Z" fill="#1d2b64" /><rect x="60" y="52" width="80" height="9" rx="4" fill="#111" /><circle cx="100" cy="40" r="7" fill="#ffd23f" />
        </svg>
        <h3>Police officer</h3>
        <p class="st">{{ offMsg }}</p>
        <div class="ai-meter"><div class="ai-meter__fill" :style="{ width: energy + '%', background: eColor }"></div></div>
        <p class="cnt"><b>{{ counts.off }}</b> cars watched</p>
      </div>

      <div class="who ai-card">
        <svg class="pic" viewBox="0 0 200 220" aria-hidden="true">
          <rect x="94" y="80" width="12" height="140" fill="#6b7088" /><rect x="70" y="200" width="60" height="14" rx="5" fill="#6b7088" />
          <rect x="100" y="64" width="70" height="10" fill="#6b7088" />
          <g><rect x="40" y="40" width="110" height="56" rx="14" fill="#f4f6fb" stroke="#1d2b64" stroke-width="5" /><circle cx="58" cy="68" r="18" fill="#1d2b64" /><circle cx="58" cy="68" r="9" fill="#3a86ff" /><circle cx="54" cy="64" r="3" fill="#fff" /><circle class="rec" cx="132" cy="54" r="5" fill="#ff3b3b" /><rect x="34" y="30" width="122" height="14" rx="7" fill="#1d2b64" /></g>
        </svg>
        <h3>AI camera</h3>
        <p class="st">Watching: never tired, sees in the dark</p>
        <div class="ai-meter"><div class="ai-meter__fill" style="width: 100%; background: var(--ai-primary)"></div></div>
        <p class="cnt"><b>{{ counts.cam }}</b> cars watched (12 crossroads)</p>
      </div>
    </div>
    <TeacherTip :text="NOTES.hook" />
  </section>
</template>

<style scoped>
.hook { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1fr); gap: 16px; }
@media (max-width: 900px) { .hook { grid-template-columns: 1fr 1fr; } .sky { grid-column: 1 / -1; } }
@media (max-width: 520px) { .hook { grid-template-columns: 1fr; } }
.sky { position: relative; min-height: 320px; padding: 0; overflow: hidden; transition: background 0.5s; }
.orb { position: absolute; width: 74px; height: 74px; border-radius: 50%; transform: translate(-50%, -50%); transition: left 0.3s, top 0.3s; }
.sun { background: radial-gradient(circle, #fff6b0, #ffc93c 60%, #ffb703); box-shadow: 0 0 60px #ffd23f; }
.moon { background: radial-gradient(circle at 35% 35%, #fff, #e5e9ff 60%, #c2c9ef); box-shadow: 0 0 40px rgba(255, 255, 255, 0.5); }
.city {
  position: absolute; left: 0; right: 0; bottom: 76px; height: 130px; opacity: 0.85;
  background:
    linear-gradient(#2b3f8f, #2b3f8f) 4% 40px / 12% 90px no-repeat, linear-gradient(#3b4fa0, #3b4fa0) 18% 10px / 14% 120px no-repeat,
    linear-gradient(#2b3f8f, #2b3f8f) 36% 50px / 11% 80px no-repeat, linear-gradient(#3b4fa0, #3b4fa0) 52% 0 / 16% 130px no-repeat,
    linear-gradient(#2b3f8f, #2b3f8f) 74% 44px / 12% 86px no-repeat, linear-gradient(#3b4fa0, #3b4fa0) 96% 20px / 13% 110px no-repeat;
}
.time { position: absolute; left: 18px; top: 12px; font-family: var(--ai-font-head); font-size: 46px; font-weight: 800; color: #fff; text-shadow: 0 3px 10px rgba(0, 0, 0, 0.3); }
.ctrl { position: absolute; left: 0; right: 0; bottom: 0; height: 76px; background: #fff; display: flex; align-items: center; gap: 12px; padding: 0 16px; }
.ctrl .ai-btn { white-space: nowrap; flex: none; }
.who { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; }
.who h3 { font-size: 22px; }
.pic { width: 120px; height: 132px; transition: opacity 0.4s, filter 0.4s; }
.pic.off { opacity: 0.35; filter: grayscale(1); }
.who .ai-meter { width: 100%; }
.st { font-weight: 700; color: var(--ai-ink-soft); min-height: 48px; }
.cnt { color: var(--ai-ink-soft); font-weight: 700; }
.cnt b { display: block; font-family: var(--ai-font-head); font-size: 32px; color: var(--ai-ink); }
.rec { animation: rec 1.2s infinite; }
@keyframes rec { 50% { opacity: 0.2; } }
</style>
