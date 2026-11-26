<script setup>
/** Checkpoint: rate your confidence, then steer Lumi into the right answer lane 3 times. */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import LumiSay from '../components/LumiSay.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { GATES, CONF } from '../data/content'
import { useLessonState } from '../state'

const props = defineProps({
  gate: { type: String, required: true }, // 'g1'…'g4'
  n: { type: Number, required: true },
})
const emit = defineEmits(['next'])
const S = useLessonState()
const Q = GATES[props.gate]
const LANE_X = [16.67, 50, 83.33]

const phase = ref(S.stars[props.gate] ? 'again' : 'conf') // conf | drive | done | again
const conf = ref(null)
const qi = ref(0)
const miss = ref(0)
const hl = ref(1)
const busy = ref(false)
const carTop = ref(330)
const carLane = ref(1)
const result = ref(null) // { i, ok }
const gateOpen = ref(false)
const shake = ref(false)
const earned = ref(0)

const q = computed(() => Q[qi.value])

function pickConf(k) {
  conf.value = k
  S.conf[props.gate] = k
  phase.value = 'drive'
  resetQ()
}
function resetQ() {
  hl.value = 1
  carLane.value = 1
  carTop.value = 330
  result.value = null
  gateOpen.value = false
}

function choose(i) {
  if (busy.value || phase.value !== 'drive') return
  busy.value = true
  hl.value = i
  carLane.value = i
  const ok = i === q.value.a
  setTimeout(() => {
    carTop.value = ok ? 150 : 165
    setTimeout(() => {
      result.value = { i, ok }
      if (ok) {
        gateOpen.value = true
        setTimeout(() => {
          carTop.value = -140
          setTimeout(() => {
            qi.value++
            busy.value = false
            if (qi.value >= Q.length) finish()
            else resetQ()
          }, 750)
        }, 450)
      } else {
        miss.value++
        shake.value = true
        setTimeout(() => {
          shake.value = false
          carTop.value = 330
          setTimeout(() => {
            busy.value = false
            result.value = { ...result.value, cleared: true }
          }, 700)
        }, 700)
      }
    }, 720)
  }, 380)
}

function finish() {
  const st = Math.max(1, 3 - miss.value)
  earned.value = st
  S.stars[props.gate] = Math.max(S.stars[props.gate] || 0, st)
  phase.value = 'done'
}
function again() {
  qi.value = 0
  miss.value = 0
  phase.value = 'conf'
}

const reflection = computed(() => {
  const c = CONF.find((x) => x.k === conf.value)
  if (!c) return ''
  return earned.value >= c.k
    ? `You felt ${c.e} and earned ${earned.value} ★. You know yourself well!`
    : `You felt ${c.e} and earned ${earned.value} ★. What tricked you? Look back at the hints.`
})

function onKey(e) {
  if (phase.value !== 'drive' || busy.value) return
  if (e.key === 'ArrowLeft') { e.preventDefault(); hl.value = Math.max(0, hl.value - 1); carLane.value = hl.value }
  else if (e.key === 'ArrowRight') { e.preventDefault(); hl.value = Math.min(2, hl.value + 1); carLane.value = hl.value }
  else if (e.key === 'Enter' && !document.activeElement?.classList.contains('lanebtn')) { e.preventDefault(); choose(hl.value) }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <section class="ai-scene">
    <!-- already passed -->
    <template v-if="phase === 'again'">
      <LumiSay text="You already passed this toll gate. Drive it again?" />
      <div class="ai-card done">
        <div class="bigstars"><span v-for="k in 3" :key="k" :class="{ on: k <= S.stars[gate] }">★</span></div>
        <div class="ai-row center">
          <button class="ai-btn" @click="again">🔁 Drive again</button>
          <button class="ai-btn ai-btn--green" @click="emit('next')">Keep going ▶</button>
        </div>
      </div>
    </template>

    <!-- confidence check -->
    <template v-else-if="phase === 'conf'">
      <LumiSay text="Before the toll gate: how sure do you feel?" />
      <div class="ai-card conf">
        <h2>Rate yourself honestly. There’s no wrong answer!</h2>
        <div class="faces">
          <button v-for="c in CONF" :key="c.k" class="face" @click="pickConf(c.k)">
            <span class="face__e">{{ c.e }}</span>{{ c.l }}
          </button>
        </div>
      </div>
      <TeacherTip text="This confidence check builds metacognition: students compare how sure they felt with how they actually did." />
    </template>

    <!-- driving the lanes -->
    <template v-else-if="phase === 'drive'">
      <LumiSay text="Toll gate! Steer me into the right lane." />
      <div class="qsign">
        <span class="qsign__n">Question {{ qi + 1 }} / 3</span>
        {{ q.q }}
      </div>

      <div class="road">
        <div class="road__dash" aria-hidden="true"></div>
        <div class="lanes">
          <button
            v-for="(o, i) in q.o"
            :key="o"
            class="lanebtn"
            :class="{ hl: hl === i }"
            :aria-label="o"
            @click="choose(i)"
            @mouseenter="!busy && (hl = i, carLane = i)"
          >
            <span class="ans" :class="{ right: result && result.i === i && result.ok, wrong: result && result.i === i && !result.ok && !result.cleared }">{{ o }}</span>
          </button>
        </div>
        <div class="gate" :class="{ open: gateOpen }"><div class="bar"></div></div>
        <div class="qcar" :class="{ shake }" :style="{ left: LANE_X[carLane] + '%', top: carTop + 'px' }">
          <svg viewBox="0 0 60 100" aria-hidden="true"><use href="#sd-lumiTop" width="60" height="100" /></svg>
        </div>
      </div>
      <p class="qhelp">Tap a lane · or use ◀ ▶ and Enter</p>
      <p v-if="result && result.ok" class="fb ok">✅ Correct! Gate open!</p>
      <p v-else-if="result" class="fb no">💥 Bump! Hint: {{ q.h }}</p>
    </template>

    <!-- finished -->
    <template v-else>
      <LumiSay text="The road is open!" />
      <div class="ai-card done">
        <div class="bigstars"><span v-for="k in 3" :key="k" :class="{ on: k <= earned }">★</span></div>
        <h2>Checkpoint {{ n }} passed!</h2>
        <p class="refl">{{ reflection }}</p>
        <button class="ai-btn ai-btn--green ai-btn--big" @click="emit('next')">Keep driving ▶</button>
      </div>
    </template>
  </section>
</template>

<style scoped>
.conf, .done { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; }
.conf h2, .done h2 { font-size: clamp(24px, 3.6vw, 34px); }
.faces { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; width: min(560px, 100%); }
.face {
  border: 0; font: inherit; font-family: var(--ai-font-head); font-weight: 800; font-size: 18px; color: var(--ai-ink);
  background: #fff; border-radius: 20px; padding: 14px 8px; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  box-shadow: inset 0 0 0 3px var(--ai-line), 0 4px 0 var(--ai-line); transition: transform 0.12s;
}
.face:hover { transform: translateY(-2px); background: #fff4d6; }
.face__e { font-size: 50px; line-height: 1; }

.qsign {
  position: relative; background: var(--ai-accent); border-radius: 18px; padding: 18px 18px 14px;
  text-align: center; font-family: var(--ai-font-head); font-weight: 800; font-size: clamp(21px, 3.2vw, 30px); line-height: 1.15;
  box-shadow: 0 5px 0 #d99a00;
}
.qsign__n {
  position: absolute; top: -13px; left: 16px; background: var(--ai-ink); color: #fff; font-size: 14px;
  border-radius: 999px; padding: 2px 12px; letter-spacing: 0.04em;
}

.road {
  position: relative; height: 440px; width: min(620px, 100%); margin: 0 auto;
  background: #3a4a6b; border-radius: 22px; overflow: hidden; box-shadow: var(--ai-shadow);
}
.road__dash {
  position: absolute; inset: 0;
  background:
    linear-gradient(90deg, transparent calc(33.33% - 3px), rgba(255,255,255,.7) calc(33.33% - 3px), rgba(255,255,255,.7) calc(33.33% + 3px), transparent calc(33.33% + 3px),
      transparent calc(66.66% - 3px), rgba(255,255,255,.7) calc(66.66% - 3px), rgba(255,255,255,.7) calc(66.66% + 3px), transparent calc(66.66% + 3px));
  -webkit-mask: repeating-linear-gradient(#000 0 26px, transparent 26px 52px);
  mask: repeating-linear-gradient(#000 0 26px, transparent 26px 52px);
  animation: dash 0.8s linear infinite;
}
@keyframes dash { to { -webkit-mask-position: 0 52px; mask-position: 0 52px; } }
.lanes { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(3, 1fr); z-index: 2; }
.lanebtn { border: 0; background: transparent; display: flex; flex-direction: column; align-items: center; padding: 12px 8px; cursor: pointer; }
.lanebtn:focus-visible .ans { outline: 3px solid var(--ai-accent); outline-offset: 3px; }
.ans {
  background: var(--ai-green); color: #fff; border: 3px solid #fff; border-radius: 14px;
  padding: 10px 8px 8px; font-family: var(--ai-font-head); font-weight: 800; font-size: clamp(15px, 2.3vw, 20px); line-height: 1.15;
  width: 100%; min-height: 78px; display: grid; place-items: center; text-align: center;
  box-shadow: 0 4px 0 #17895a; transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
}
.lanebtn.hl .ans, .lanebtn:hover .ans { transform: translateY(-3px); box-shadow: 0 7px 0 #17895a; }
.ans.right { background: #16a364; }
.ans.wrong { background: var(--ai-red); box-shadow: 0 4px 0 #b8264a; }
.gate { position: absolute; left: 0; right: 0; top: 132px; height: 22px; z-index: 3; pointer-events: none; }
.gate .bar {
  position: absolute; left: 4%; width: 92%; height: 100%; border-radius: 8px;
  background: repeating-linear-gradient(90deg, var(--ai-red) 0 26px, #fff 26px 52px);
  box-shadow: 0 0 0 3px #1d2b4f; transform-origin: 0 50%; transition: transform 0.5s cubic-bezier(0.5, 1.6, 0.5, 1);
}
.gate.open .bar { transform: rotate(-70deg); }
.gate::before { content: ''; position: absolute; left: 1%; top: -14px; width: 22px; height: 48px; background: var(--ai-accent); border-radius: 6px; box-shadow: 0 0 0 3px #1d2b4f; }
.qcar { position: absolute; width: 64px; z-index: 4; transform: translateX(-50%); transition: left 0.35s ease, top 0.7s cubic-bezier(0.4, 0, 0.6, 1); }
.qcar svg { display: block; width: 100%; height: auto; }
.qcar.shake { animation: shake 0.35s; }
@keyframes shake { 25% { margin-left: -7px; } 75% { margin-left: 7px; } }
.qhelp { text-align: center; color: var(--ai-ink-soft); font-size: 16px; font-weight: 700; }
.fb { font-weight: 800; font-size: 20px; text-align: center; border-radius: 16px; padding: 10px 16px; font-family: var(--ai-font-head); }
.fb.ok { background: #e3f8ee; color: #137a4f; }
.fb.no { background: #ffe6ec; color: #b8264a; }

.bigstars { font-size: 56px; letter-spacing: 6px; line-height: 1; }
.bigstars span { color: #dfe6f2; }
.bigstars span.on { color: var(--ai-accent); text-shadow: 0 3px 0 #d99a00; }
.refl { font-size: 19px; font-weight: 700; color: var(--ai-ink-soft); max-width: 520px; }
.center { justify-content: center; }
</style>
