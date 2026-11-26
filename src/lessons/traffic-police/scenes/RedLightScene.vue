<script setup>
/** Chapter 1 experiment: what happens when drivers run red lights? Then switch on AI cameras. */
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import LearnCard from '../components/LearnCard.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { makeIntersection } from '../engine/intersection'
import { LEARN, NOTES } from '../data/content'

const cv = ref(null)
const pct = ref(5)
const ui = reactive({ passed: 0, runners: 0, crashes: 0, tickets: 0, camera: false })
let x = null

onMounted(() => {
  x = makeIntersection(cv.value, 1000, 560, {
    rate: { E: 0.45, W: 0.45, N: 0.4, S: 0.4 },
    violate: 0.05,
    onTick: (S) => {
      const s = S.stats
      if (s.passed !== ui.passed) ui.passed = s.passed
      if (s.runners !== ui.runners) ui.runners = s.runners
      if (s.crashes !== ui.crashes) ui.crashes = s.crashes
      if (s.tickets !== ui.tickets) ui.tickets = s.tickets
    },
  })
  x.start()
})
onBeforeUnmount(() => x && x.stop())

function setPct() {
  if (x) x.S.violate = pct.value / 100
}
function toggleCam() {
  x.S.camera = !x.S.camera
  ui.camera = x.S.camera
  if (x.S.camera) x.S.cars.forEach((c) => { if (c.rude && !c.crossed && Math.random() < 0.7) c.rude = false })
}
function restart() {
  x.reset()
  Object.assign(ui, { passed: 0, runners: 0, crashes: 0, tickets: 0 })
}
const risk = computed(() => {
  const eff = ui.camera ? (pct.value / 100) * 0.3 : pct.value / 100
  return Math.round(Math.min(100, 6 + eff * 180))
})
const riskColor = computed(() => (risk.value < 30 ? '#22b573' : risk.value < 60 ? '#ffb703' : '#ef476f'))
const riskMsg = computed(() => (risk.value < 30 ? 'Safe and smooth 😊' : risk.value < 60 ? 'Near misses… scary 😬' : 'Very dangerous! 🚨'))
</script>

<template>
  <section class="ai-scene">
    <LearnCard :card="LEARN.c1" />
    <div class="ai-scene__head">
      <span class="ai-tag tp-k--red">Chapter 1 · Experiment</span>
      <h2>What happens when drivers run red lights?</h2>
    </div>
    <div class="tp-layout">
      <div class="tp-sim"><canvas ref="cv" aria-label="Crossroads with traffic lights. Cars that run the red light get a red ring."></canvas></div>
      <div class="tp-panel">
        <div class="ai-card slider">
          <label for="c1r">Drivers who run red lights</label>
          <b :style="{ color: 'var(--ai-red)' }">{{ pct }}%</b>
          <input id="c1r" v-model.number="pct" class="tp-range" type="range" min="0" max="60" @input="setPct" />
        </div>
        <div class="tp-stats">
          <div class="tp-stat"><small>cars passed</small><b>{{ ui.passed }}</b></div>
          <div class="tp-stat"><small>red-light runners</small><b style="color: var(--ai-red)">{{ ui.runners }}</b></div>
          <div class="tp-stat"><small>crashes</small><b style="color: #ff8a3d">{{ ui.crashes }}</b></div>
          <div v-if="ui.camera" class="tp-stat"><small>AI photos</small><b style="color: var(--ai-primary)">{{ ui.tickets }}</b></div>
        </div>
        <div class="ai-card danger">
          <div class="row"><span>Danger level</span><b>{{ risk }}%</b></div>
          <div class="ai-meter"><div class="ai-meter__fill" :style="{ width: risk + '%', background: riskColor }"></div></div>
          <p class="tp-msg">{{ riskMsg }}</p>
        </div>
        <button class="ai-btn ai-btn--big" :class="ui.camera ? 'ai-btn--green' : 'ai-btn--primary'" :aria-pressed="ui.camera" @click="toggleCam">
          {{ ui.camera ? '✅ AI cameras ON' : '👁 Turn on AI cameras' }}
        </button>
        <button class="ai-btn ai-btn--small" @click="restart">↺ Restart</button>
      </div>
    </div>
    <TeacherTip :text="NOTES.c1" />
  </section>
</template>

<style scoped>
.slider { display: grid; grid-template-columns: 1fr auto; gap: 4px 10px; align-items: center; padding: 14px 16px; }
.slider label { font-weight: 800; }
.slider b { font-family: var(--ai-font-head); font-size: 28px; }
.slider input { grid-column: 1 / -1; }
.danger { display: flex; flex-direction: column; gap: 8px; padding: 14px 16px; }
.danger .row { display: flex; justify-content: space-between; font-weight: 800; }
</style>
