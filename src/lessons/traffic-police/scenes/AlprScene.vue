<script setup>
/** Chapter 2: how does a camera "read" a number plate? 7 steps, from watching the road to the ticket. */
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import LearnCard from '../components/LearnCard.vue'
import ScaleBox from '../components/ScaleBox.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { sceneSVG, roadX, PLATE, plateText } from '../engine/frontcar'
import { sfx } from '../engine/core'
import { LEARN, NOTES, ALPR_STEPS, ALPR_DESC } from '../data/content'

const step = ref(0)
const played = ref(false)
const carY = ref(175)
const frozen = ref(false)
const sec = ref(28)
const flash = ref(false)
const read = reactive({ chars: PLATE.map(() => '?'), ok: PLATE.map(() => false), scan: -1 })
let clock = null
let ocr = null
let raf = 0

const scene = computed(() => sceneSVG(carY.value))
const s = computed(() => 0.12 + ((carY.value - 175) / (470 - 175)) * 0.88)
const car = computed(() => ({ x: 480 - 160 * s.value, y: carY.value - 205 * s.value, w: 320 * s.value, h: 210 * s.value }))
const pl = computed(() => ({ x: 480 - 58 * s.value, y: carY.value - 70 * s.value, w: 116 * s.value, h: 38 * s.value }))
const stopPoly = `${roadX(350, 0)},350 ${roadX(350, 1)},350 ${roadX(360, 1)},360 ${roadX(360, 0)},360`
const film = [230, 330, 452].map((y) => sceneSVG(y))
const nextLabel = computed(() => (step.value === 0 && !played.value ? '▶ Play' : step.value >= 6 ? '✅ Done!' : 'Next step ▶'))

onMounted(() => {
  clock = setInterval(() => { if (!frozen.value) sec.value++ }, 1000)
})
onBeforeUnmount(() => {
  clearInterval(clock)
  clearInterval(ocr)
  cancelAnimationFrame(raf)
})

function reset() {
  clearInterval(ocr)
  cancelAnimationFrame(raf)
  step.value = 0
  played.value = false
  carY.value = 175
  frozen.value = false
  sec.value = 28
  read.chars = PLATE.map(() => '?')
  read.ok = PLATE.map(() => false)
  read.scan = -1
}
function play() {
  played.value = true
  const t0 = performance.now()
  const tick = (t) => {
    const k = Math.min(1, (t - t0) / 3200)
    carY.value = 175 + (452 - 175) * k * k
    if (k < 1) raf = requestAnimationFrame(tick)
    else {
      frozen.value = true
      sfx('snap')
      flash.value = true
      setTimeout(() => (flash.value = false), 600)
      goTo(1)
    }
  }
  raf = requestAnimationFrame(tick)
}
function next() {
  if (step.value === 0 && !played.value) return play()
  if (step.value < 6) goTo(step.value + 1)
}
function goTo(i) {
  if (i > 0 && !frozen.value) {
    cancelAnimationFrame(raf)
    carY.value = 452
    frozen.value = true
    played.value = true
  }
  const from = step.value
  step.value = i
  if (i >= 4 || (i === 3 && from !== 2)) fillPlate()
  if (i === 3 && from === 2) runOCR()
  if (i < 3) {
    clearInterval(ocr)
    read.chars = PLATE.map(() => '?')
    read.ok = PLATE.map(() => false)
    read.scan = -1
  }
  if (i === 1 || i === 2) sfx('beep')
  if (i === 4) sfx('bad')
  if (i === 5) sfx('snap')
  if (i === 6) sfx('win')
}
function fillPlate() {
  clearInterval(ocr)
  read.chars = [...PLATE]
  read.ok = PLATE.map(() => true)
  read.scan = -1
}
function runOCR() {
  const pool = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789'
  let k = 0
  let n = 0
  clearInterval(ocr)
  ocr = setInterval(() => {
    if (k >= PLATE.length) {
      clearInterval(ocr)
      read.scan = -1
      return
    }
    read.scan = k
    read.chars[k] = pool[(Math.random() * pool.length) | 0]
    if (++n > 7) {
      read.chars[k] = PLATE[k]
      read.ok[k] = true
      sfx('beep')
      k++
      n = 0
    }
  }, 55)
}
const clockText = computed(() => '08:15:' + String(sec.value % 60).padStart(2, '0'))
</script>

<template>
  <section class="ai-scene">
    <LearnCard :card="LEARN.alpr" />
    <div class="ai-scene__head">
      <span class="ai-tag tp-k--blue">Chapter 2 · The AI camera is born</span>
      <h2>How does a camera “read” a number plate?</h2>
    </div>
    <div class="tp-layout">
      <ScaleBox :w="960" :h="540">
        <div class="mon">
          <svg viewBox="0 0 960 540" class="full" aria-label="Street camera view of a red car driving towards a red light" v-html="scene"></svg>
          <div class="hud hud-l">● REC · CAM 07</div>
          <div class="hud hud-r">{{ clockText }}</div>
          <div v-if="flash" class="flash"></div>
          <div v-if="frozen" class="frozen">❚❚ PHOTO TAKEN</div>

          <svg v-if="step >= 1" viewBox="0 0 960 540" class="full" aria-hidden="true">
            <g class="draw">
              <rect :x="car.x" :y="car.y" :width="car.w" :height="car.h" rx="8" fill="none" stroke="#3a86ff" stroke-width="5" />
              <rect :x="car.x" :y="car.y - 34" width="150" height="32" rx="8" fill="#3a86ff" />
              <text :x="car.x + 12" :y="car.y - 11" fill="#fff" font-size="20" font-weight="700">car 98%</text>
            </g>
            <g v-if="step >= 2" class="draw">
              <rect :x="pl.x" :y="pl.y" :width="pl.w" :height="pl.h" rx="5" fill="none" stroke="#21c48d" stroke-width="5" />
              <line :x1="pl.x + pl.w" :y1="pl.y + pl.h / 2" x2="690" y2="440" stroke="#21c48d" stroke-width="4" stroke-dasharray="8 6" />
            </g>
            <g v-if="step >= 4" class="draw">
              <polygon :points="stopPoly" fill="#ff3b3b" opacity=".9" />
              <text x="70" y="335" font-size="24" font-weight="800" fill="#ff3b3b" stroke="#fff" stroke-width="5" paint-order="stroke">STOP LINE</text>
              <circle cx="850" cy="130" r="40" fill="none" stroke="#ff3b3b" stroke-width="6" />
            </g>
          </svg>

          <div v-if="step >= 2" class="zoom pop">
            <div class="zt">AI ZOOM</div>
            <div class="bigplate">
              <span v-for="(c, k) in PLATE" :key="k" class="ch" :class="{ cut: step >= 3, scan: read.scan === k }">{{ c }}</span>
            </div>
            <div class="read">
              <span v-for="(c, k) in read.chars" :key="k" class="rc" :class="{ ok: read.ok[k] }">{{ c }}</span>
            </div>
          </div>

          <div v-if="step >= 4" class="verdict slide-in">
            <div class="vrow"><span class="vk">Light</span><span class="vv" style="color: #ff3b3b">● RED 08:15:3{{ sec % 10 }}</span></div>
            <div class="vrow"><span class="vk">Car</span><span class="vv">past the stop line</span></div>
            <div class="vres">⚠️ Ran a red light</div>
          </div>

          <div v-if="step === 5" class="film">
            <div v-for="(f, k) in film" :key="k" class="fr rise" :style="{ animationDelay: k * 0.15 + 's' }">
              <svg viewBox="0 0 960 540" v-html="f"></svg><span>{{ ['①', '②', '③'][k] }} 08:15:{{ 30 + k }}</span>
            </div>
            <div class="fr vid rise" style="animation-delay: 0.45s">▶ video 6s</div>
          </div>

          <div v-if="step >= 6" class="ticket drop">
            <div class="th">🧾 TRAFFIC TICKET</div>
            <div class="tr"><b>Plate</b><span>{{ plateText() }}</span></div>
            <div class="tr"><b>What</b><span>Ran a red light</span></div>
            <div class="tr"><b>Where</b><span>Park Rd &amp; 12th St</span></div>
            <div class="tr"><b>Proof</b><span>3 photos + video</span></div>
            <div class="tf">Think it is wrong? You can appeal and watch the video.</div>
          </div>
        </div>
      </ScaleBox>

      <div class="tp-panel">
        <ol class="steps">
          <li v-for="(t, i) in ALPR_STEPS" :key="t">
            <button class="st" :class="{ on: i === step, done: i < step }" :disabled="i > step + 1" @click="goTo(i)">
              <span class="n">{{ i < step ? '✓' : i + 1 }}</span>{{ t }}
            </button>
          </li>
        </ol>
        <div class="ai-card desc" aria-live="polite" v-html="ALPR_DESC[step]"></div>
        <div class="ai-row btns">
          <button class="ai-btn ai-btn--accent grow" :disabled="step >= 6" @click="next">{{ nextLabel }}</button>
          <button class="ai-btn" aria-label="Start again" @click="reset">↺</button>
        </div>
      </div>
    </div>
    <TeacherTip :text="NOTES.alpr" />
  </section>
</template>

<style scoped>
.mon { position: absolute; inset: 0; border-radius: 22px; overflow: hidden; background: #000; box-shadow: 0 0 0 8px var(--ai-ink); font-family: var(--ai-font-head); }
.full { position: absolute; inset: 0; width: 100%; height: 100%; }
.hud { position: absolute; top: 14px; background: rgba(0, 0, 0, 0.55); color: #fff; font-weight: 700; font-size: 18px; padding: 6px 14px; border-radius: 10px; letter-spacing: 0.05em; }
.hud-l { left: 14px; color: #ff8f8f; }
.hud-r { right: 14px; font-variant-numeric: tabular-nums; }
.flash { position: absolute; inset: 0; background: #fff; animation: fade 0.6s forwards; }
@keyframes fade { to { opacity: 0; } }
.frozen { position: absolute; top: 60px; left: 14px; background: #ffc93c; color: #1d2b64; font-weight: 800; padding: 4px 12px; border-radius: 8px; font-size: 16px; }
.draw { animation: fadein 0.5s ease; }
@keyframes fadein { from { opacity: 0; } }
.zoom { position: absolute; right: 16px; bottom: 16px; width: 340px; background: rgba(29, 43, 100, 0.94); border-radius: 18px; padding: 12px 14px 14px; color: #fff; }
.zt { font-size: 14px; font-weight: 800; letter-spacing: 0.1em; color: #7ee0b5; margin-bottom: 6px; }
.bigplate { display: flex; justify-content: center; gap: 4px; background: #ffd23f; border: 4px solid #1d2b64; border-radius: 10px; padding: 6px 8px; outline: 3px solid #ffd23f; }
.ch { font-size: 42px; font-weight: 800; color: #1d2b64; width: 44px; text-align: center; border-radius: 6px; transition: all 0.2s; line-height: 1.1; }
.ch.cut { outline: 3px dashed #3a86ff; outline-offset: -1px; }
.ch.scan { background: rgba(58, 134, 255, 0.35); }
.read { display: flex; justify-content: center; gap: 8px; margin-top: 10px; }
.rc { width: 40px; height: 46px; border-radius: 10px; background: rgba(255, 255, 255, 0.12); font-size: 28px; font-weight: 800; display: flex; align-items: center; justify-content: center; font-variant-numeric: tabular-nums; }
.rc.ok { background: #21c48d; }
.verdict { position: absolute; left: 16px; bottom: 16px; width: 330px; background: #fff; border-radius: 18px; padding: 12px 16px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3); color: var(--ai-ink); }
.vrow { display: flex; justify-content: space-between; font-size: 18px; padding: 4px 0; border-bottom: 2px dashed #e1e5f2; }
.vk { color: #6a6f96; }
.vv { font-weight: 700; }
.vres { margin-top: 8px; background: #ffe1e2; color: #d62828; font-weight: 800; font-size: 22px; border-radius: 10px; padding: 6px 10px; text-align: center; }
.film { position: absolute; left: 16px; right: 16px; top: 100px; display: flex; gap: 10px; background: #1d2b64; padding: 10px; border-radius: 14px; }
.fr { flex: 1; position: relative; border-radius: 8px; overflow: hidden; aspect-ratio: 16 / 9; background: #000; }
.fr svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.fr span { position: absolute; left: 6px; bottom: 4px; color: #fff; font-size: 13px; font-weight: 700; background: rgba(0, 0, 0, 0.5); padding: 1px 6px; border-radius: 5px; }
.fr.vid { display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 20px; background: #3a86ff; }
.ticket { position: absolute; right: 40px; top: 40px; width: 430px; background: #fffdf3; border-radius: 16px; padding: 16px 22px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4); border-top: 14px solid #ff5a5f; font-size: 19px; color: var(--ai-ink); font-family: var(--ai-font-body); }
.th { font-family: var(--ai-font-head); font-size: 24px; font-weight: 800; color: #d62828; margin-bottom: 6px; }
.tr { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 2px dashed #eee; }
.tr b { color: #6a6f96; font-weight: 600; }
.tr span { font-weight: 800; }
.tf { margin-top: 8px; font-size: 17px; background: #e9f2ff; padding: 8px 10px; border-radius: 10px; }
.pop { animation: pop 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both; transform-origin: 0 100%; }
@keyframes pop { from { transform: scale(0.3); opacity: 0; } }
.slide-in { animation: slidein 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both; }
@keyframes slidein { from { transform: translateX(-60px); opacity: 0; } }
.rise { animation: rise 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both; }
@keyframes rise { from { transform: translateY(60px); opacity: 0; } }
.drop { animation: drop 0.8s cubic-bezier(0.3, 1.4, 0.5, 1) both; }
@keyframes drop { from { transform: translateY(-300px) rotate(-12deg); opacity: 0; } }

.steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.st {
  width: 100%; border: 0; font: inherit; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 10px;
  font-weight: 800; font-size: 17px; color: #9aa6c0; background: #fff; border-radius: 14px; padding: 6px 10px;
  box-shadow: inset 0 0 0 2px var(--ai-line); transition: all 0.2s;
}
.st:disabled { cursor: default; }
.n { flex: none; width: 30px; height: 30px; border-radius: 9px; background: #e8ecf8; color: #9aa6c0; display: grid; place-items: center; }
.st.done { color: var(--ai-ink); }
.st.done .n { background: var(--ai-green); color: #fff; }
.st.on { color: var(--ai-ink); background: #fff4d6; box-shadow: inset 0 0 0 3px var(--ai-accent), 0 4px 0 #f0d58a; transform: translateX(6px); }
.st.on .n { background: var(--ai-ink); color: #fff; }
.desc { font-size: 18px; padding: 14px 16px; min-height: 96px; }
.btns { flex-wrap: nowrap; }
.tp-panel .btns .ai-btn { width: auto; }
.tp-panel .btns .grow { flex: 1; }
</style>
