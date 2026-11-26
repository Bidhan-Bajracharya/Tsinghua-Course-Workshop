<script setup>
/** Teach Beep what a cat is → it fails on a black cat → teach more kinds → fixed. Fairness through examples. */
import { ref, computed } from 'vue'
import Beep from '../components/Beep.vue'
import AnimalArt from '../components/AnimalArt.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { TRAIN1, TEST1, TRAIN2, TEST2, WHY } from '../data/content'

defineEmits(['next'])
const phase = ref('teach1') // teach1 | test1 | why | teach2 | test2 | end
const i = ref(0)
const trained = ref([])
const rule = ref(null)
const shown = ref(false)
const say = ref('Hi! Teach me what a cat is!')
const fb = ref('')
const thinking = ref(false)
const whyTried = ref([])

const feat = (a) => ({ fur: a.c, ears: a.t === 'cat' ? 'pointy' : 'floppy', whiskers: a.t === 'cat' })
const ruleWords = (k, v) => (k === 'fur' ? `${v} fur` : k === 'ears' ? `${v} ears` : v ? 'whiskers' : 'no whiskers')
function learn() {
  const cats = trained.value.filter((x) => x.label === 'cat')
  if (!cats.length) return null
  const f0 = feat(cats[0])
  const r = {}
  ;['fur', 'ears', 'whiskers'].forEach((k) => {
    if (cats.every((c) => feat(c)[k] === f0[k])) r[k] = f0[k]
  })
  return r
}
function guess(a) {
  if (!rule.value) return { cat: false, why: 'I don’t know cats yet!' }
  const f = feat(a)
  const keys = Object.keys(rule.value)
  const miss = keys.filter((k) => f[k] !== rule.value[k])
  if (!miss.length) return { cat: true, why: `Cat! It has ${keys.map((k) => ruleWords(k, rule.value[k])).join(', ')}.` }
  return { cat: false, why: `Not a cat! Cats have ${miss.map((k) => ruleWords(k, rule.value[k])).join(' and ')}.` }
}
function think() {
  thinking.value = false
  requestAnimationFrame(() => (thinking.value = true))
}

const list = computed(() => ({ teach1: TRAIN1, teach2: TRAIN2, test1: TEST1, test2: TEST2 })[phase.value] || [])
const current = computed(() => (phase.value === 'why' ? { t: 'cat', c: 'black' } : list.value[i.value]))
const stepIdx = computed(() => ({ teach1: 0, test1: 1, why: 2, teach2: 3, test2: 1, end: 4 })[phase.value])
const result = computed(() => {
  if (!shown.value || !current.value) return null
  const g = guess(current.value)
  return { ...g, right: g.cat === (current.value.t === 'cat') }
})

function label(l) {
  const a = current.value
  trained.value.push({ ...a, label: l })
  const wrong = (l === 'cat') !== (a.t === 'cat')
  fb.value = wrong ? 'Beep learns whatever we teach, even mistakes!' : ''
  i.value++
  if (i.value < list.value.length) return
  rule.value = learn()
  think()
  say.value = rule.value ? `I learned! Cats have ${Object.keys(rule.value).map((k) => ruleWords(k, rule.value[k])).join(', ')}.` : 'I still don’t know cats!'
  phase.value = phase.value === 'teach1' ? 'test1' : 'test2'
  i.value = 0
  shown.value = false
}
function reveal() {
  shown.value = true
  think()
  say.value = result.value.why
}
function nextPic() {
  if (i.value < list.value.length - 1) {
    i.value++
    shown.value = false
    return
  }
  if (phase.value === 'test1') {
    phase.value = 'why'
    say.value = 'Oops! I said this cat is NOT a cat.'
  } else {
    phase.value = 'end'
    say.value = 'Thank you! Now I know cats can be any colour!'
  }
  fb.value = ''
}
function pickWhy(k) {
  if (WHY[k].ok) {
    fb.value = 'Yes! Beep only learned from orange cats. Let’s teach Beep more kinds of cats.'
    whyTried.value = ['done']
  } else {
    whyTried.value = [...whyTried.value, k]
    fb.value = 'Look at what Beep learned in the green box.'
  }
}
function teachMore() {
  phase.value = 'teach2'
  i.value = 0
  shown.value = false
  fb.value = ''
  say.value = 'Show me more cats, please!'
}
function restart() {
  phase.value = 'teach1'
  i.value = 0
  trained.value = []
  rule.value = null
  shown.value = false
  whyTried.value = []
  fb.value = ''
  say.value = 'Hi! Teach me what a cat is!'
}
</script>

<template>
  <section class="ai-scene">
    <div class="steps">
      <span v-for="(s, k) in ['1 · Teach', '2 · Predict & test', '3 · Why?', '4 · Teach more']" :key="s" :class="{ now: stepIdx === k }">{{ s }}</span>
    </div>

    <div class="lab">
      <div class="ai-card robot">
        <Beep class="robot__bot" :thinking="thinking" @animationend="thinking = false" />
        <div class="ai-bubble robot__say">{{ say }}</div>
        <div class="rules">
          <b>What Beep learned:</b>
          <div class="rules__list">
            <template v-if="rule && Object.keys(rule).length">
              <span v-for="(v, k) in rule" :key="k" class="rule">{{ ruleWords(k, v) }}</span>
            </template>
            <span v-else class="rule none">Nothing yet</span>
          </div>
        </div>
      </div>

      <div class="ai-card stage">
        <template v-if="phase !== 'end'">
          <div class="pic">
            <AnimalArt :a="current" />
            <span v-if="result" class="tag" :class="result.right ? 'ok' : 'no'">{{ result.right ? 'Right!' : 'Wrong!' }}</span>
          </div>

          <template v-if="phase === 'teach1' || phase === 'teach2'">
            <p class="prompt">Is this a cat? 👍 / 👎 Vote! ({{ i + 1 }} / {{ list.length }})</p>
            <div class="ai-row center">
              <button class="ai-btn ai-btn--green ai-btn--big" @click="label('cat')">🐱 Cat</button>
              <button class="ai-btn ai-btn--big" @click="label('not')">🚫 Not a cat</button>
            </div>
          </template>

          <template v-else-if="phase === 'test1' || phase === 'test2'">
            <p class="prompt">{{ shown ? `It’s really a ${current.t}.` : 'Will Beep be right? Thumbs up or down!' }}</p>
            <div class="ai-row center">
              <button v-if="!shown" class="ai-btn ai-btn--primary ai-btn--big" @click="reveal">Show Beep’s answer</button>
              <button v-else class="ai-btn ai-btn--primary" @click="nextPic">{{ i < list.length - 1 ? 'Next picture ▶' : phase === 'test1' ? 'What happened? ▶' : 'Finish ▶' }}</button>
            </div>
          </template>

          <template v-else>
            <p class="prompt">Why did Beep get it wrong? Vote 1, 2 or 3!</p>
            <div class="whys">
              <button
                v-for="(w, k) in WHY"
                :key="k"
                class="why"
                :class="{ wrong: whyTried.includes(k), right: whyTried.includes('done') && w.ok }"
                :disabled="whyTried.includes(k) || whyTried.includes('done')"
                @click="pickWhy(k)"
              >{{ k + 1 }}. {{ w.t }}</button>
            </div>
            <button v-if="whyTried.includes('done')" class="ai-btn ai-btn--green" @click="teachMore">Teach more cats ▶</button>
          </template>
        </template>

        <template v-else>
          <div class="cats">
            <AnimalArt v-for="c in ['orange', 'black', 'white', 'grey']" :key="c" :a="{ t: 'cat', c }" />
          </div>
          <p class="big">More kinds of examples = fairer AI.</p>
          <p class="sub">Face scanners are the same: if they only learn some kinds of faces, they make more mistakes for other people. That isn’t fair, so a person must always check.</p>
          <div class="ai-row center">
            <button class="ai-btn" @click="restart">🔁 Start again</button>
            <button class="ai-btn ai-btn--green" @click="$emit('next')">Next ▶</button>
          </div>
        </template>

        <p v-if="fb" class="fb">{{ fb }}</p>
      </div>
    </div>

    <div v-if="trained.length" class="tray">
      <figure v-for="(a, k) in trained" :key="k"><AnimalArt :a="a" /><figcaption>{{ a.label === 'cat' ? 'Cat' : 'Not cat' }}</figcaption></figure>
    </div>

    <TeacherTip text="You are Beep’s teacher! 1) For each picture the class votes thumbs up (cat) or down; tap the majority. 2) Before each test ask “Will Beep be right?” 3) Beep gets the black cat wrong. 4) Ask why: 1 = only saw orange cats (correct). Teach 3 more colours and test again. Say: “AI learns from the examples we give it.”" />
  </section>
</template>

<style scoped>
.steps { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }
.steps span { padding: 5px 14px; border-radius: 999px; background: #fff; box-shadow: inset 0 0 0 2px var(--ai-line); font-weight: 800; font-size: 14px; color: var(--ai-ink-soft); }
.steps span.now { background: var(--ai-purple); color: #fff; box-shadow: none; }
.lab { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: 16px; }
@media (max-width: 760px) { .lab { grid-template-columns: 1fr; } }
.robot { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; background: linear-gradient(180deg, #e8f6ff, #fff); }
.robot__bot { width: 130px; height: auto; }
.robot__say { font-family: var(--ai-font-head); font-weight: 700; font-size: 20px; }
.rules { width: 100%; background: #effbf5; border-radius: 14px; padding: 10px; display: flex; flex-direction: column; gap: 6px; }
.rules__list { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }
.rule { background: var(--ai-green); color: #fff; font-weight: 800; border-radius: 999px; padding: 3px 12px; font-size: 15px; }
.rule.none { background: #c9d3e6; }
.stage { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
.pic { position: relative; width: min(220px, 70%); }
.tag { position: absolute; top: 4px; right: -6px; padding: 4px 12px; border-radius: 999px; font-weight: 800; color: #fff; animation: pop 0.3s ease; }
.tag.ok { background: var(--ai-green); }
.tag.no { background: var(--ai-red); }
@keyframes pop { from { transform: scale(0); } }
.prompt { font-family: var(--ai-font-head); font-weight: 800; font-size: 21px; }
.center { justify-content: center; }
.whys { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 420px; }
.why { border: 0; font: inherit; font-weight: 800; font-size: 17px; text-align: left; cursor: pointer; background: #fff; border-radius: 14px; padding: 10px 14px; box-shadow: inset 0 0 0 2px var(--ai-line); }
.why.wrong { background: #ffe6ec; color: #b8264a; box-shadow: none; }
.why.right { background: #e3f8ee; color: #137a4f; box-shadow: inset 0 0 0 3px var(--ai-green); }
.cats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; width: 100%; }
.big { font-family: var(--ai-font-head); font-weight: 800; font-size: 24px; color: var(--ai-green); }
.sub { color: var(--ai-ink-soft); font-weight: 700; max-width: 460px; }
.fb { background: #fff4d6; border-radius: 12px; padding: 8px 12px; font-weight: 700; }
.tray { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
.tray figure { margin: 0; width: 70px; text-align: center; font-size: 12px; font-weight: 800; color: var(--ai-ink-soft); }
</style>
