<script setup>
import { ref, reactive, computed } from 'vue'
import { questions } from '../data/quiz'
import Certificate from '../../../shared/Certificate.vue'

const emit = defineEmits(['complete'])

const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const qi = ref(0)
const phase = ref('question') // 'question' | 'feedback' | 'results'
const score = ref(0)
const lastCorrect = ref(false)
const showCert = ref(false)
const q = computed(() => questions[qi.value])

/* per-question state */
const st = reactive({
  picked: null, // mcq
  leftSel: null, // match
  links: {}, // match: leftIdx -> rightIdx
  rightOrder: [], // match: shuffled indexes of right column
  pool: [], // order: shuffled indexes still to place
  placed: [], // order: indexes placed so far
})

function setup() {
  st.picked = null
  st.leftSel = null
  st.links = {}
  if (q.value.type === 'match') st.rightOrder = shuffle(q.value.pairs.map((_, i) => i))
  if (q.value.type === 'order') {
    let p = shuffle(q.value.items.map((_, i) => i))
    if (p.every((v, i) => v === i)) p = p.reverse()
    st.pool = p
    st.placed = []
  }
}
setup()

/* ----- match helpers ----- */
const pairColors = ['#2f7cf6', '#8b5cf6', '#ff8a3d', '#22b573']
function linkedRight(r) {
  const entry = Object.entries(st.links).find(([, v]) => v === r)
  return entry ? Number(entry[0]) : null
}
function tapLeft(l) {
  if (phase.value !== 'question') return
  if (st.links[l] !== undefined) {
    delete st.links[l]
  }
  st.leftSel = l
}
function tapRight(r) {
  if (phase.value !== 'question' || st.leftSel === null) return
  const prev = linkedRight(r)
  if (prev !== null) delete st.links[prev]
  st.links[st.leftSel] = r
  st.leftSel = null
}
const colorOfLeft = (l) => (st.links[l] !== undefined ? pairColors[l] : null)
const colorOfRight = (r) => {
  const l = linkedRight(r)
  return l !== null ? pairColors[l] : null
}

/* ----- order helpers ----- */
function place(i) {
  if (phase.value !== 'question') return
  st.pool = st.pool.filter((x) => x !== i)
  st.placed.push(i)
}
function unplace(i) {
  if (phase.value !== 'question') return
  st.placed = st.placed.filter((x) => x !== i)
  st.pool.push(i)
}

/* ----- submit / navigation ----- */
const ready = computed(() => {
  const t = q.value.type
  if (t === 'mcq') return st.picked !== null
  if (t === 'match') return Object.keys(st.links).length === q.value.pairs.length
  if (t === 'order') return st.placed.length === q.value.items.length
  return false
})

function isCorrect() {
  const t = q.value.type
  if (t === 'mcq') return st.picked === q.value.answer
  if (t === 'match') return q.value.pairs.every((_, i) => st.links[i] === i)
  if (t === 'order') return st.placed.every((v, i) => v === i)
  return false
}

function submit() {
  if (!ready.value) return
  lastCorrect.value = isCorrect()
  if (lastCorrect.value) score.value++
  phase.value = 'feedback'
}

function nextQ() {
  if (qi.value < questions.length - 1) {
    qi.value++
    phase.value = 'question'
    setup()
  } else {
    phase.value = 'results'
    emit('complete', { score: score.value, total: questions.length })
  }
}

function restart() {
  showCert.value = false
  qi.value = 0
  score.value = 0
  phase.value = 'question'
  setup()
}

const stars = computed(() => {
  const pct = score.value / questions.length
  return pct >= 0.85 ? 3 : pct >= 0.6 ? 2 : 1
})
const rankTitle = computed(() =>
  stars.value === 3 ? 'Robot Vacuum Expert!' : stars.value === 2 ? 'Robot Vacuum Explorer!' : 'Robot Vacuum Rookie!',
)
const resultText = computed(
  () =>
    ({
      3: 'Wow! You’re a true Robot Vacuum Expert!',
      2: 'Great job! You know a lot about smart robots!',
      1: 'Good try! Explore the lesson again and have another go!',
    })[stars.value],
)
const confetti = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: ((i * 13) % 20) / 10,
  color: ['#2f7cf6', '#ffb703', '#22b573', '#ef476f', '#8b5cf6'][i % 5],
}))
</script>

<template>
  <section class="ai-scene">
    <template v-if="phase !== 'results'">
      <div class="top">
        <span class="ai-tag">🏆 Quiz</span>
        <div class="dots" aria-hidden="true">
          <span v-for="(_, i) in questions" :key="i" class="dot" :class="{ now: i === qi, past: i < qi }"></span>
        </div>
        <span class="count">Question {{ qi + 1 }} of {{ questions.length }}</span>
      </div>

      <Transition name="swap" mode="out-in">
        <div :key="qi" class="ai-card qcard">
          <h2 class="question">{{ q.q }}</h2>

          <!-- Multiple choice -->
          <div v-if="q.type === 'mcq'" class="options" :class="{ pics: q.options.some((o) => o.pic) }">
            <button
              v-for="(o, i) in q.options"
              :key="i"
              class="opt"
              :class="{
                picked: st.picked === i,
                right: phase === 'feedback' && i === q.answer,
                wrong: phase === 'feedback' && st.picked === i && i !== q.answer,
              }"
              :disabled="phase !== 'question'"
              @click="st.picked = i"
            >
              <svg v-if="o.pic" viewBox="0 0 160 110" class="pathpic" aria-hidden="true">
                <rect x="4" y="4" width="152" height="102" rx="10" fill="#fdf7ea" stroke="#c9ad83" stroke-width="3" />
                <polyline
                  v-if="o.pic === 'random'"
                  points="20,90 70,20 140,60 30,40 110,95 130,20 50,70 90,50 25,22 140,92"
                  fill="none" stroke="#ef476f" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"
                />
                <polyline
                  v-else
                  points="20,92 140,92 140,76 20,76 20,60 140,60 140,44 20,44 20,28 140,28 140,16 20,16"
                  fill="none" stroke="#22b573" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"
                />
              </svg>
              <span v-else class="opt__icon">{{ o.icon }}</span>
              <span class="opt__text">{{ o.text }}</span>
            </button>
          </div>

          <!-- Matching -->
          <div v-else-if="q.type === 'match'" class="match">
            <p class="hint">Tap a part, then tap its job.</p>
            <div class="match__cols">
              <div class="match__col">
                <button
                  v-for="(p, l) in q.pairs"
                  :key="'l' + l"
                  class="mitem"
                  :class="{ sel: st.leftSel === l }"
                  :style="colorOfLeft(l) ? { boxShadow: `inset 0 0 0 4px ${colorOfLeft(l)}`, background: colorOfLeft(l) + '18' } : {}"
                  :disabled="phase !== 'question'"
                  @click="tapLeft(l)"
                >
                  {{ p.left }}
                  <span v-if="phase === 'feedback'" class="mark">{{ st.links[l] === l ? '✅' : '❌' }}</span>
                </button>
              </div>
              <div class="match__col">
                <button
                  v-for="r in st.rightOrder"
                  :key="'r' + r"
                  class="mitem mitem--right"
                  :class="{ ready: st.leftSel !== null }"
                  :style="colorOfRight(r) ? { boxShadow: `inset 0 0 0 4px ${colorOfRight(r)}`, background: colorOfRight(r) + '18' } : {}"
                  :disabled="phase !== 'question'"
                  @click="tapRight(r)"
                >
                  {{ q.pairs[r].right }}
                </button>
              </div>
            </div>
          </div>

          <!-- Ordering -->
          <div v-else-if="q.type === 'order'" class="order">
            <p class="hint">Tap the robots in order. Tap a placed one to take it back.</p>
            <div class="slots">
              <button
                v-for="n in q.items.length"
                :key="'s' + n"
                class="slot"
                :class="{
                  filled: st.placed[n - 1] !== undefined,
                  right: phase === 'feedback' && st.placed[n - 1] === n - 1,
                  wrong: phase === 'feedback' && st.placed[n - 1] !== n - 1,
                }"
                :disabled="phase !== 'question' || st.placed[n - 1] === undefined"
                @click="unplace(st.placed[n - 1])"
              >
                <span class="slot__n">{{ n }}</span>
                <template v-if="st.placed[n - 1] !== undefined">
                  <b>{{ q.items[st.placed[n - 1]].text }}</b>
                  <small>{{ q.items[st.placed[n - 1]].sub }}</small>
                </template>
                <span v-else class="slot__empty">?</span>
              </button>
            </div>
            <div class="pool">
              <button v-for="i in st.pool" :key="'p' + i" class="chip" :disabled="phase !== 'question'" @click="place(i)">
                <b>{{ q.items[i].text }}</b>
                <small>{{ q.items[i].sub }}</small>
              </button>
            </div>
          </div>

          <!-- Feedback / submit -->
          <div v-if="phase === 'feedback'" class="feedback" :class="lastCorrect ? 'good' : 'bad'">
            <span class="feedback__face">{{ lastCorrect ? '🎉' : '🤔' }}</span>
            <div>
              <b>{{ lastCorrect ? 'Correct! Great job!' : 'Not quite!' }}</b>
              <p>{{ q.explain }}</p>
            </div>
            <button class="ai-btn ai-btn--primary" @click="nextQ">
              {{ qi < questions.length - 1 ? 'Next question →' : 'See my score 🏆' }}
            </button>
          </div>
          <div v-else class="ai-row submit">
            <button class="ai-btn ai-btn--green ai-btn--big" :disabled="!ready" @click="submit">Check answer ✔</button>
          </div>
        </div>
      </Transition>
    </template>

    <!-- Certificate -->
    <Certificate
      v-else-if="showCert"
      :stars="stars"
      :title="rankTitle"
      :score-text="`Quiz score: ${score} / ${questions.length}`"
      line="for exploring how mapping and vision make robot vacuums smarter!"
      unit-label="Unit 2 · Lesson 4 · Robot Vacuums"
      file-stem="Robot-Vacuum-Certificate"
      mascot="robo"
      signer="Robo 🤖"
      signer-role="Chief Cleaning Robot"
      @back="showCert = false"
    />

    <!-- Results -->
    <div v-else class="ai-card results">
      <div v-if="stars === 3" class="confetti" aria-hidden="true">
        <span v-for="(c, i) in confetti" :key="i" :style="{ left: c.left + '%', animationDelay: c.delay + 's', background: c.color }"></span>
      </div>
      <svg viewBox="0 0 160 190" class="badge" aria-hidden="true">
        <path d="M 50 110 L 30 185 L 62 168 L 80 190 L 88 120 Z" fill="#ef476f" />
        <path d="M 110 110 L 130 185 L 98 168 L 80 190 L 72 120 Z" fill="#2f7cf6" />
        <circle cx="80" cy="80" r="66" fill="#ffb703" stroke="#e09a00" stroke-width="6" />
        <circle cx="80" cy="80" r="50" fill="#fff4d6" />
        <g transform="translate(80 80) scale(0.62)">
          <circle r="50" fill="#eef3fb" stroke="#3a4a6b" stroke-width="4" />
          <path d="M -44 -22 A 50 50 0 0 1 44 -22" stroke="#2f7cf6" stroke-width="8" fill="none" stroke-linecap="round" />
          <circle cx="-14" cy="-22" r="6.5" fill="#1d2b4f" />
          <circle cx="14" cy="-22" r="6.5" fill="#1d2b4f" />
          <path d="M -16 -2 Q 0 14 16 -2" stroke="#1d2b4f" stroke-width="4" fill="none" stroke-linecap="round" />
          <circle cy="22" r="10" fill="#2f3b55" />
        </g>
      </svg>
      <div class="stars">
        <span v-for="n in 3" :key="n" class="star" :class="{ on: n <= stars }" :style="{ animationDelay: n * 0.2 + 's' }">★</span>
      </div>
      <h2>{{ rankTitle }}</h2>
      <p class="big">You got <b>{{ score }}</b> out of <b>{{ questions.length }}</b> right.</p>
      <p>{{ resultText }}</p>
      <div class="ai-row result-actions">
        <button class="ai-btn ai-btn--accent ai-btn--big cert-btn" @click="showCert = true">🎓 Get my certificate</button>
        <button class="ai-btn" @click="restart">🔁 Try again</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.top { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.dots { display: flex; gap: 6px; flex: 1; justify-content: center; }
.dot { width: 14px; height: 14px; border-radius: 50%; background: var(--ai-line); transition: all 0.2s; }
.dot.past { background: var(--ai-green); }
.dot.now { background: var(--ai-primary); transform: scale(1.3); }
.count { font-weight: 800; color: var(--ai-ink-soft); }

.qcard { display: flex; flex-direction: column; gap: 18px; }
.question { font-size: clamp(24px, 3.4vw, 32px); }
.hint { color: var(--ai-ink-soft); font-weight: 700; }

.options { display: grid; gap: 12px; }
.options.pics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.opt {
  display: flex;
  align-items: center;
  gap: 14px;
  text-align: left;
  border: 0;
  font: inherit;
  font-size: 20px;
  font-weight: 700;
  color: var(--ai-ink);
  background: #fff;
  padding: 14px 18px;
  border-radius: 18px;
  cursor: pointer;
  box-shadow: inset 0 0 0 3px var(--ai-line), 0 4px 0 var(--ai-line);
  transition: transform 0.12s, box-shadow 0.15s, background 0.15s;
}
.options.pics .opt { flex-direction: column; text-align: center; }
.opt:hover:not(:disabled) { transform: translateY(-2px); }
.opt:disabled { cursor: default; }
.opt:focus-visible { outline: 3px solid var(--ai-accent); outline-offset: 2px; }
.opt.picked { background: #e7f0ff; box-shadow: inset 0 0 0 3px var(--ai-primary), 0 4px 0 var(--ai-primary-dark); }
.opt.right { background: #e3f8ee; box-shadow: inset 0 0 0 3px var(--ai-green), 0 4px 0 #17895a; }
.opt.wrong { background: #ffe6ec; box-shadow: inset 0 0 0 3px var(--ai-red), 0 4px 0 #b8264a; animation: shake 0.4s; }
@keyframes shake { 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
.opt__icon { font-size: 34px; }
.pathpic { width: 100%; max-width: 240px; height: auto; }

.match__cols { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 14px; }
.match__col { display: flex; flex-direction: column; gap: 10px; }
.mitem {
  position: relative;
  border: 0;
  font: inherit;
  font-weight: 700;
  font-size: 17px;
  text-align: left;
  color: var(--ai-ink);
  background: #fff;
  padding: 12px 14px;
  border-radius: 14px;
  min-height: 58px;
  cursor: pointer;
  box-shadow: inset 0 0 0 3px var(--ai-line);
  transition: transform 0.12s, background 0.15s;
}
.mitem:hover:not(:disabled) { transform: translateY(-2px); }
.mitem:disabled { cursor: default; }
.mitem.sel { background: #fff4d6; box-shadow: inset 0 0 0 4px var(--ai-accent) !important; }
.mitem--right.ready { animation: nudge 1s ease-in-out infinite; }
@keyframes nudge { 50% { transform: translateX(3px); } }
.mark { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); }

.slots { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
@media (max-width: 640px) { .slots { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.slot {
  position: relative;
  min-height: 96px;
  border: 3px dashed #b9c8e3;
  background: #f6f9ff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font: inherit;
  color: var(--ai-ink);
  cursor: pointer;
  padding: 18px 6px 8px;
}
.slot:disabled { cursor: default; }
.slot.filled { border-style: solid; border-color: var(--ai-primary); background: #fff; }
.slot.right { border-color: var(--ai-green); background: #e3f8ee; }
.slot.wrong { border-color: var(--ai-red); background: #ffe6ec; }
.slot__n {
  position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
  width: 28px; height: 28px; border-radius: 50%; background: var(--ai-primary); color: #fff;
  display: grid; place-items: center; font-weight: 800; font-size: 15px;
}
.slot__empty { font-size: 28px; color: #b9c8e3; font-weight: 800; }
.slot small, .chip small { color: var(--ai-ink-soft); font-size: 13px; }
.pool { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 12px; min-height: 60px; }
.chip {
  display: flex; flex-direction: column; align-items: center;
  border: 0; font: inherit; color: var(--ai-ink); cursor: pointer;
  background: #fff; padding: 10px 16px; border-radius: 16px;
  box-shadow: inset 0 0 0 3px var(--ai-line), 0 4px 0 var(--ai-line);
  transition: transform 0.12s;
}
.chip:hover { transform: translateY(-2px); }

.submit { justify-content: center; }
.feedback {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 14px 16px;
  border-radius: 18px;
}
@media (max-width: 640px) { .feedback { grid-template-columns: auto 1fr; } .feedback .ai-btn { grid-column: 1 / -1; } }
.feedback.good { background: #e3f8ee; }
.feedback.bad { background: #fff4d6; }
.feedback__face { font-size: 44px; }
.feedback b { font-size: 22px; font-family: var(--ai-font-head); }

.results {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  padding: 30px 20px;
}
.badge { width: 150px; height: auto; animation: badge 0.7s cubic-bezier(.3,1.6,.5,1) both; }
@keyframes badge { from { transform: scale(0.3) rotate(-20deg); opacity: 0; } }
.stars { display: flex; gap: 8px; font-size: 52px; }
.star { color: #dfe6f2; animation: pop 0.5s ease both; }
.star.on { color: var(--ai-accent); text-shadow: 0 3px 0 #d99a00; }
@keyframes pop { from { transform: scale(0); } }
.results h2 { font-size: 36px; color: var(--ai-primary-dark); }
.big { font-size: 24px; }
.result-actions { justify-content: center; position: relative; margin-top: 6px; }
.cert-btn { animation: glow 1.8s ease-in-out infinite; }
@keyframes glow { 50% { transform: scale(1.05); box-shadow: 0 4px 0 #d99a00, 0 0 0 8px rgba(255, 183, 3, 0.25); } }
.confetti { position: absolute; inset: 0; pointer-events: none; }
.confetti span {
  position: absolute; top: -20px; width: 10px; height: 16px; border-radius: 3px;
  animation: fall 3s linear infinite;
}
@keyframes fall { to { transform: translateY(560px) rotate(540deg); } }

.swap-enter-active, .swap-leave-active { transition: all 0.22s ease; }
.swap-enter-from { opacity: 0; transform: translateX(24px); }
.swap-leave-to { opacity: 0; transform: translateX(-24px); }
</style>
