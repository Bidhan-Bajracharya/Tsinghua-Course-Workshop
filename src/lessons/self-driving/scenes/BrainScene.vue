<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import LumiSay from '../components/LumiSay.vue'
import Icon from '../components/Icon.vue'
import LumiCar from '../../../shared/mascots/LumiCar.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { BRAIN, ACTS } from '../data/content'

defineEmits(['next'])
const T = 9000

const gi = ref(0)
const score = ref(0)
const answer = ref(undefined) // undefined = waiting, null = timed out, 'stop'|'slow'|'go'
const loopStep = ref(0) // 0 sense, 1 think, 2 act
const timeLeft = ref(1)
const g = computed(() => BRAIN[gi.value])
const finished = computed(() => gi.value >= BRAIN.length)
const answered = computed(() => answer.value !== undefined)
const ok = computed(() => answer.value === g.value?.a)

let raf = 0
let thinkTimer = 0
function startRound() {
  cancelAnimationFrame(raf)
  clearTimeout(thinkTimer)
  answer.value = undefined
  loopStep.value = 0
  timeLeft.value = 1
  if (finished.value) return
  thinkTimer = setTimeout(() => { if (!answered.value) loopStep.value = 1 }, 800)
  const t0 = performance.now()
  const tick = (now) => {
    timeLeft.value = Math.max(0, 1 - (now - t0) / T)
    if (timeLeft.value <= 0) return pick(null)
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
}
function pick(k) {
  if (answered.value) return
  cancelAnimationFrame(raf)
  answer.value = k
  loopStep.value = 2
  if (k === g.value.a) score.value++
}
function nextScene() {
  gi.value++
  startRound()
}
function replay() {
  gi.value = 0
  score.value = 0
  startRound()
}
onMounted(startRound)
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  clearTimeout(thinkTimer)
})

const carClass = computed(() => (answered.value ? `act-${answer.value || 'stop'}` : ''))
</script>

<template>
  <section class="ai-scene">
    <LumiSay text="Be my AI brain! Read the sensors, then choose." />

    <div class="loop" aria-hidden="true">
      <span :class="{ on: loopStep === 0 }">👀 SENSE</span><span class="ar">→</span>
      <span :class="{ on: loopStep === 1 }">🧠 THINK</span><span class="ar">→</span>
      <span :class="{ on: loopStep === 2 }">🚗 ACT</span>
    </div>

    <template v-if="!finished">
      <div class="ai-card stage">
        <svg viewBox="0 0 600 260" class="scene" :class="carClass" role="img" aria-label="Driving scene">
          <rect width="600" height="260" fill="#dff0ff" />
          <rect y="180" width="600" height="80" fill="#3a4a6b" />
          <line x1="0" y1="245" x2="600" y2="245" stroke="#ffd166" stroke-width="5" stroke-dasharray="26 20" />

          <g v-if="g.kind === 'red' || g.kind === 'green'" transform="translate(470 70)">
            <rect x="-3" y="20" width="6" height="90" fill="#7d8aa6" />
            <rect x="-15" y="-36" width="30" height="62" rx="8" fill="#1d2b4f" />
            <circle cy="-22" r="7" :fill="g.kind === 'red' ? '#ff4d6d' : '#555'" />
            <circle cy="-4" r="7" fill="#555" />
            <circle cy="14" r="7" :fill="g.kind === 'green' ? '#22c46e' : '#555'" />
          </g>
          <template v-if="g.kind === 'red'">
            <g fill="#fff"><rect x="380" y="186" width="10" height="44" /><rect x="398" y="186" width="10" height="44" /><rect x="416" y="186" width="10" height="44" /></g>
            <use href="#sd-person" x="398" y="146" width="20" height="44" />
          </template>
          <template v-if="g.kind === 'ball'">
            <circle cx="380" cy="206" r="14" fill="#ef476f" /><path d="M366 206h28M380 192v28" stroke="#fff" stroke-width="3" />
            <g fill="#8fd3b4"><circle cx="490" cy="150" r="34" /><circle cx="540" cy="140" r="38" /></g>
          </template>
          <template v-if="g.kind === 'school'">
            <g transform="translate(440 70)"><rect x="-3" y="20" width="6" height="90" fill="#7d8aa6" /><polygon points="0,-30 30,0 0,30 -30,0" fill="#ffd166" stroke="#1d2b4f" stroke-width="3" /><use href="#sd-person" x="-14" y="-16" width="12" height="26" /><use href="#sd-person" x="2" y="-12" width="10" height="22" /></g>
            <use href="#sd-person" x="500" y="138" width="18" height="40" /><use href="#sd-person" x="530" y="142" width="16" height="36" /><use href="#sd-person" x="560" y="136" width="18" height="42" />
          </template>
          <template v-if="g.kind === 'poster'">
            <g transform="translate(400 40)"><rect x="40" y="96" width="8" height="60" fill="#7d8aa6" /><rect x="-10" y="0" width="120" height="100" rx="8" fill="#fff4d6" stroke="#1d2b4f" stroke-width="4" /><use href="#sd-person" x="34" y="14" width="34" height="74" /><text x="50" y="-8" text-anchor="middle" font-weight="800" font-size="20" fill="#ef476f">?</text></g>
          </template>

          <g class="car-g">
            <LumiCar :x="20" :y="148" :width="140" />
            <rect class="brake" x="22" y="184" width="12" height="10" rx="3" fill="#ff2b2b" />
          </g>
          <template v-if="g.kind === 'fog'">
            <use href="#sd-car1960" x="400" y="160" width="120" height="70" />
            <rect width="600" height="260" fill="#eef1f4" opacity=".8" />
          </template>
        </svg>

        <div class="timer"><i :style="{ width: timeLeft * 100 + '%', background: timeLeft < 0.3 ? 'var(--ai-red)' : 'var(--ai-accent)' }"></i></div>

        <div class="reads">
          <span v-for="([ic, t], k) in g.r" :key="k" class="read"><span class="read__ic"><Icon :name="ic" /></span>{{ t }}</span>
        </div>
      </div>

      <div class="acts">
        <button
          v-for="k in ['stop', 'slow', 'go']"
          :key="k"
          class="act"
          :class="k"
          :disabled="answered && answer !== k"
          @click="pick(k)"
        >{{ ACTS[k] }}</button>
      </div>

      <div v-if="answered" class="fb" :class="ok ? 'ok' : 'no'">
        <template v-if="answer === null">⏰ Too slow! I braked to be safe. </template>
        <template v-else-if="ok">✓ </template>
        <template v-else>✗ Best: {{ ACTS[g.a] }}. </template>
        {{ g.w }}
      </div>
      <div v-if="answered" class="ai-row center">
        <button class="ai-btn ai-btn--primary" @click="nextScene">{{ gi < BRAIN.length - 1 ? 'Next scene ▶' : 'See result ▶' }}</button>
      </div>
      <p class="count">Scene {{ gi + 1 }} / {{ BRAIN.length }} · Safe choices: {{ score }}</p>
    </template>

    <div v-else class="ai-card result">
      <div class="result__e">{{ score === BRAIN.length ? '🏆' : score >= 4 ? '🎉' : '🚗' }}</div>
      <h2>Trip done: {{ score }} / {{ BRAIN.length }} safe choices!</h2>
      <p>A real AI brain makes choices like these many times every second.</p>
      <div class="ai-row center">
        <button class="ai-btn" @click="replay">🔁 Play again</button>
        <button class="ai-btn ai-btn--green" @click="$emit('next')">Next ▶</button>
      </div>
    </div>

    <TeacherTip text="Scene 4 is a poster that looks like a person. Ask: “What should a car do when it is not sure?” Good answers: slow down, check, ask a human." />
  </section>
</template>

<style scoped>
.loop { display: flex; justify-content: center; gap: 6px; font-family: var(--ai-font-head); font-weight: 800; font-size: 15px; flex-wrap: wrap; }
.loop span { padding: 5px 14px; border-radius: 999px; background: #fff; box-shadow: inset 0 0 0 2px var(--ai-line); color: var(--ai-ink-soft); transition: all 0.2s; }
.loop span.ar { box-shadow: none; background: none; padding: 5px 0; }
.loop span.on { background: var(--ai-purple); color: #fff; box-shadow: none; }

.stage { display: flex; flex-direction: column; gap: 12px; padding: 12px; }
.scene { width: 100%; height: auto; border-radius: 14px; }
.car-g { transition: transform 1.3s cubic-bezier(0.3, 0.1, 0.3, 1); }
.scene.act-go .car-g { transform: translateX(460px); }
.scene.act-slow .car-g { transform: translateX(130px); transition-duration: 2.4s; }
.brake { opacity: 0; transition: opacity 0.2s; }
.scene.act-stop .brake { opacity: 1; }
.timer { height: 14px; border-radius: 999px; background: #e8eef8; overflow: hidden; }
.timer i { display: block; height: 100%; border-radius: 999px; }
.reads { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.read { display: inline-flex; align-items: center; gap: 8px; background: #f5f9ff; border-radius: 999px; padding: 5px 14px 5px 5px; font-weight: 700; font-size: 17px; box-shadow: inset 0 0 0 2px var(--ai-line); }
.read__ic { width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; background: #fff; }
.read__ic :deep(svg) { width: 22px; height: 22px; }

.acts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.act {
  border: 0; border-radius: 20px; padding: 16px 6px; cursor: pointer;
  font-family: var(--ai-font-head); font-weight: 800; font-size: clamp(22px, 3vw, 30px); color: #fff; letter-spacing: 0.04em;
  transition: transform 0.12s, opacity 0.2s;
}
.act:hover:not(:disabled) { transform: translateY(-2px); }
.act:disabled { opacity: 0.3; cursor: default; }
.act.stop { background: var(--ai-red); box-shadow: 0 5px 0 #b8264a; }
.act.slow { background: var(--ai-accent); color: #3b2a00; box-shadow: 0 5px 0 #d99a00; }
.act.go { background: var(--ai-green); box-shadow: 0 5px 0 #17895a; }

.fb { font-weight: 700; font-size: 20px; text-align: center; border-radius: 16px; padding: 12px 16px; }
.fb.ok { background: #e3f8ee; color: #137a4f; }
.fb.no { background: #ffe6ec; color: #b8264a; }
.center { justify-content: center; }
.count { text-align: center; color: var(--ai-ink-soft); font-weight: 700; }
.result { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; }
.result__e { font-size: 60px; }
.result h2 { font-size: clamp(26px, 3.6vw, 34px); }
.result p { color: var(--ai-ink-soft); font-weight: 700; font-size: 19px; }
</style>
