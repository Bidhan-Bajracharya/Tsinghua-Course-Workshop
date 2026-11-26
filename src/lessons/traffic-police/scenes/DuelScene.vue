<script setup>
/** Chapter 4 race: old fixed timer vs AI traffic brain (+ CO₂ from waiting cars). */
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import LearnCard from '../components/LearnCard.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { makeIntersection } from '../engine/intersection'
import { Loop } from '../engine/core'
import { LEARN, NOTES } from '../data/content'

const RATE = { E: 0.85, W: 0.85, N: 0.1, S: 0.1 }
const canv = {}
const fast = ref(false)
const rush = ref(false)
const stats = reactive({ a: blank(), b: blank() })
let a = null
let b = null
let loop = null
let boost = null
function blank() {
  return { wait: '0.0', now: 0, passed: 0, co: 0 }
}

function read(x) {
  const st = x.S.stats
  const q = x.queues()
  const live = x.S.cars.filter((c) => !c.crossed && c.wait > 0)
  const n = st.waitN + live.length
  const sum = st.waitSum + live.reduce((s, c) => s + c.wait, 0)
  return { wait: (n ? sum / n : 0).toFixed(1), now: q.E + q.W + q.N + q.S, passed: st.passed, co: Math.round(sum * 0.6) }
}
onMounted(() => {
  a = makeIntersection(canv.a, 720, 430, { rate: { ...RATE }, mode: 'fixed', showRunners: false })
  b = makeIntersection(canv.b, 720, 430, { rate: { ...RATE }, mode: 'adaptive', showRunners: false })
  a.start()
  b.start()
  let acc = 0
  loop = Loop((dt) => {
    acc += dt
    if (acc < 0.15) return
    acc = 0
    Object.assign(stats.a, read(a))
    Object.assign(stats.b, read(b))
  })
  loop.start()
  boost = setInterval(() => {
    if (fast.value) {
      a.warm(0.05 * 1.5)
      b.warm(0.05 * 1.5)
    }
  }, 50)
})
onBeforeUnmount(() => {
  a && a.stop()
  b && b.stop()
  loop && loop.stop()
  clearInterval(boost)
})
function reset() {
  a.reset()
  b.reset()
}
function toggleRush() {
  rush.value = !rush.value
  const r = rush.value ? { E: 0.1, W: 0.1, N: 0.85, S: 0.85 } : RATE
  ;[a, b].forEach((x) => (x.S.rate = { ...r }))
}
const qColor = (n) => (n > 8 ? '#ef476f' : n > 4 ? '#ffb703' : '#22b573')
</script>

<template>
  <section class="ai-scene">
    <LearnCard :card="LEARN.duel" />
    <div class="head">
      <div class="ai-scene__head">
        <span class="ai-tag tp-k--green">Chapter 4 · The traffic brain</span>
        <h2>Race: which crossroads moves cars faster?</h2>
      </div>
      <div class="ai-row">
        <button class="ai-btn ai-btn--small" :class="{ 'is-on': rush }" :aria-pressed="rush" @click="toggleRush">🔀 Change the busy road</button>
        <button class="ai-btn ai-btn--small" :class="{ 'is-on': fast }" :aria-pressed="fast" @click="fast = !fast">⏩ Fast</button>
        <button class="ai-btn ai-btn--small" aria-label="Restart the race" @click="reset">↺</button>
      </div>
    </div>
    <div class="duel">
      <div v-for="side in ['a', 'b']" :key="side" class="col">
        <div class="lbl" :class="side">
          {{ side === 'a' ? '⏱️ Old timer: 6 seconds each way, always' : '🧠 AI brain: watches the cars and changes the lights' }}
        </div>
        <div class="tp-sim">
          <canvas :ref="(el) => (canv[side] = el)" :aria-label="side === 'a' ? 'Crossroads with a fixed timer light' : 'Crossroads with an AI traffic brain'"></canvas>
        </div>
        <div class="tp-stats four">
          <div class="tp-stat"><small>avg. wait</small><b>{{ stats[side].wait }}s</b></div>
          <div class="tp-stat"><small>waiting now</small><b>{{ stats[side].now }}</b></div>
          <div class="tp-stat"><small>cars through</small><b>{{ stats[side].passed }}</b></div>
          <div class="tp-stat"><small>💨 CO₂ from waiting</small><b>{{ stats[side].co }} g</b></div>
        </div>
        <div class="ai-meter"><div class="ai-meter__fill" :style="{ width: Math.min(100, stats[side].now * 7) + '%', background: qColor(stats[side].now) }"></div></div>
      </div>
    </div>
    <TeacherTip :text="NOTES.duel" />
  </section>
</template>

<style scoped>
.head { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; flex-wrap: wrap; }
.duel { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
@media (max-width: 760px) { .duel { grid-template-columns: 1fr; } }
.col { display: flex; flex-direction: column; gap: 10px; }
.lbl { color: #fff; border-radius: 14px; padding: 8px 14px; font-weight: 800; font-size: 17px; }
.lbl.a { background: #8a90a8; }
.lbl.b { background: var(--ai-green); }
.four { grid-template-columns: repeat(4, 1fr); }
.four .tp-stat b { font-size: 24px; }
@media (max-width: 1000px) { .four { grid-template-columns: 1fr 1fr; } }
</style>
