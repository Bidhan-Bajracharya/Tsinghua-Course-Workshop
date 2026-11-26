<script setup>
import { ref, reactive, computed } from 'vue'
import BeepSay from '../components/BeepSay.vue'
import FaceArt from '../components/FaceArt.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { makeRound } from '../data/faces'
import { GATE_SAYS, REASONS } from '../data/content'
import { useLessonState } from '../state'

defineEmits(['next'])
const S = useLessonState()
const ROUNDS = 5

const r = ref(0)
const round = ref(makeRound(0))
const measure = ref(false)
const guessed = ref(false)
const tried = reactive(new Set())
const matched = ref(false)
const reasonState = reactive({}) // index -> 'right' | 'wrong'
const reasoned = ref(false)
const msg = ref('')
const stars = ref(0)
const finished = ref(false)

const say = computed(() => {
  if (finished.value) return 'You did it! You’re a Face Gate expert!'
  if (matched.value) return `Gate open! Welcome, ${round.value.id.name}!`
  return GATE_SAYS[r.value]
})

function pick(i) {
  if (matched.value || tried.has(i)) return
  guessed.value = true
  const o = round.value.opts[i]
  if (o.ok) {
    matched.value = true
    msg.value = ''
  } else {
    tried.add(i)
    msg.value = '❌ Not a match. Tip: tap Measure and compare the numbers!'
  }
}
function reason(k) {
  if (reasoned.value || reasonState[k]) return
  if (REASONS[k].ok) {
    reasonState[k] = 'right'
    reasoned.value = true
    stars.value++
    S.stars++
    msg.value = '⭐ Great job! Faces stay the same, even with new hair or a hat.'
  } else {
    reasonState[k] = 'wrong'
    msg.value = 'Hmm! Hair and hats can change. Try again.'
  }
}
function nextTraveller() {
  if (r.value + 1 >= ROUNDS) {
    finished.value = true
    S.gateDone = true
    return
  }
  r.value++
  round.value = makeRound(r.value)
  measure.value = false
  guessed.value = false
  tried.clear()
  matched.value = false
  reasoned.value = false
  Object.keys(reasonState).forEach((k) => delete reasonState[k])
  msg.value = ''
}
function again() {
  r.value = -1
  finished.value = false
  stars.value = 0
  nextTraveller()
}
const bars = (p) => [
  ['Eyes', p.eg / 32, '#ff5c8a'],
  ['Nose', p.nl / 28, '#ffd166'],
  ['Mouth', p.mw / 30, '#22b573'],
]
</script>

<template>
  <section class="ai-scene">
    <BeepSay :text="say" />

    <template v-if="!finished">
      <div class="top">
        <span class="count">Traveller {{ r + 1 }} / {{ ROUNDS }}</span>
        <span class="stars">{{ '⭐'.repeat(stars) || '—' }}</span>
      </div>

      <div class="board ai-card" :class="{ measure }">
        <div class="id">
          <div class="id__head"><span>🪪 ID card</span><span>TH</span></div>
          <div class="id__photo"><FaceArt :p="round.id" :dots="measure" /></div>
          <div class="id__name">{{ round.id.name }}</div>
          <div v-if="measure" class="bars">
            <span v-for="b in bars(round.id)" :key="b[0]" class="bar"><span>{{ b[0] }}</span><i :style="{ width: b[1] * 100 + '%', background: b[2] }"></i></span>
          </div>
        </div>

        <div class="right">
          <div class="travs">
            <button
              v-for="(o, i) in round.opts"
              :key="i"
              class="trav"
              :class="{ ok: matched && o.ok, no: tried.has(i) }"
              :disabled="matched || tried.has(i)"
              :aria-label="`Traveller ${i + 1}`"
              @click="pick(i)"
            >
              <FaceArt :p="o.p" :dots="measure" />
              <span class="who">{{ i + 1 }}</span>
              <span v-if="measure" class="bars">
                <span v-for="b in bars(o.p)" :key="b[0]" class="bar"><span>{{ b[0] }}</span><i :style="{ width: b[1] * 100 + '%', background: b[2] }"></i></span>
              </span>
            </button>
          </div>

          <div class="gaterow">
            <span class="lamp" :class="{ go: matched, stop: tried.size && !matched }"></span>
            <div class="doors" :class="{ open: matched }"><i></i><i></i></div>
            <button class="ai-btn ai-btn--small measure-btn" :class="{ 'is-on': measure }" :disabled="!guessed" :title="guessed ? '' : 'Make your first guess with your own eyes!'" @click="measure = !measure">
              📏 {{ measure ? 'Hide dots' : 'Measure' }}
            </button>
          </div>
          <p v-if="!guessed" class="hint">👀 Use your OWN eyes first. Measure unlocks after your first guess.</p>
        </div>
      </div>

      <p v-if="msg" class="msg">{{ msg }}</p>

      <div v-if="matched" class="ai-card reflect">
        <h3>What helped you decide?</h3>
        <div class="chips">
          <button v-for="(x, k) in REASONS" :key="k" class="chip" :class="reasonState[k]" :disabled="reasoned || !!reasonState[k]" @click="reason(k)">{{ x.t }}</button>
        </div>
        <button v-if="reasoned" class="ai-btn ai-btn--primary" @click="nextTraveller">{{ r === ROUNDS - 1 ? 'See my stars ⭐' : 'Next traveller ▶' }}</button>
      </div>
    </template>

    <div v-else class="ai-card done">
      <div class="big">{{ '⭐'.repeat(stars) }}</div>
      <h2>All {{ ROUNDS }} travellers checked!</h2>
      <p>You looked, measured and matched, just like a real face gate. Hair, glasses and hats can change, but eyes, nose and mouth stay the same.</p>
      <div class="ai-row center">
        <button class="ai-btn" @click="again">🔁 Play again</button>
        <button class="ai-btn ai-btn--green" @click="$emit('next')">Next ▶</button>
      </div>
    </div>

    <TeacherTip text="Play round 1 together on the projector: the class votes 1, 2 or 3 fingers and you tap the winner. Then pairs play on tablets. After each match ask “What helped you decide?” Give a 15-second warning, then “Eyes back on me!”" />
  </section>
</template>

<style scoped>
.top { display: flex; justify-content: space-between; align-items: center; font-weight: 800; }
.count { background: #fff2e6; color: #d9691f; padding: 4px 14px; border-radius: 999px; }
.stars { font-size: 20px; }
.board { display: grid; grid-template-columns: 200px 1fr; gap: 16px; align-items: start; }
@media (max-width: 680px) { .board { grid-template-columns: 1fr; } }
.id { background: var(--ai-primary); color: #fff; border-radius: 18px; padding: 10px; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 5px 0 var(--ai-primary-dark); }
.id__head { display: flex; justify-content: space-between; font-weight: 800; font-size: 15px; }
.id__photo { background: #eaf3ff; border-radius: 12px; padding: 6px; }
.id__name { font-family: var(--ai-font-head); font-weight: 800; font-size: 22px; }
.right { display: flex; flex-direction: column; gap: 10px; }
.travs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.trav {
  position: relative; border: 0; background: #fff; border-radius: 18px; padding: 6px 6px 10px; cursor: pointer;
  box-shadow: inset 0 0 0 3px var(--ai-line), 0 4px 0 var(--ai-line); display: flex; flex-direction: column; gap: 4px; transition: transform 0.12s;
}
.trav:hover:not(:disabled) { transform: translateY(-3px); }
.trav:disabled { cursor: default; }
.trav.ok { background: #e3f8ee; box-shadow: inset 0 0 0 4px var(--ai-green), 0 4px 0 #17895a; }
.trav.no { opacity: 0.45; animation: shake 0.35s; }
@keyframes shake { 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
.who { position: absolute; top: 6px; left: 8px; width: 26px; height: 26px; border-radius: 50%; background: var(--ai-ink); color: #fff; font-weight: 800; display: grid; place-items: center; font-size: 14px; }
.bars { display: flex; flex-direction: column; gap: 3px; }
.bar { display: grid; grid-template-columns: 44px 1fr; align-items: center; gap: 4px; font-size: 11px; font-weight: 800; color: inherit; }
.bar i { display: block; height: 8px; border-radius: 999px; }
.id .bar { color: #fff; }
.trav .bar { color: var(--ai-ink-soft); }
.gaterow { display: flex; align-items: center; gap: 12px; }
.lamp { width: 26px; height: 26px; border-radius: 50%; background: #c9d3e6; box-shadow: inset 0 0 0 3px #fff, 0 0 0 2px var(--ai-line); }
.lamp.go { background: var(--ai-green); box-shadow: 0 0 14px var(--ai-green); }
.lamp.stop { background: var(--ai-red); }
.doors { flex: 1; height: 26px; display: flex; gap: 4px; background: #eef2f8; border-radius: 10px; padding: 3px; overflow: hidden; }
.doors i { flex: 1; background: var(--ai-red); border-radius: 6px; transition: transform 0.6s ease, background 0.3s; }
.doors.open i:first-child { transform: translateX(-100%); background: var(--ai-green); }
.doors.open i:last-child { transform: translateX(100%); background: var(--ai-green); }
.hint { font-size: 15px; color: var(--ai-purple); font-weight: 700; }
.msg { text-align: center; font-weight: 800; font-size: 18px; background: #fff; border-radius: 14px; padding: 8px 14px; box-shadow: inset 0 0 0 2px var(--ai-line); }
.reflect { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; background: #f3efff; }
.reflect h3 { font-size: 22px; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.chip { border: 0; font: inherit; font-weight: 800; font-size: 17px; cursor: pointer; background: #fff; border-radius: 999px; padding: 8px 16px; box-shadow: inset 0 0 0 2px var(--ai-line); }
.chip.right { background: var(--ai-green); color: #fff; box-shadow: none; }
.chip.wrong { background: #ffe6ec; color: #b8264a; box-shadow: none; }
.done { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; }
.big { font-size: 44px; }
.done h2 { font-size: 30px; }
.done p { font-size: 19px; max-width: 560px; color: var(--ai-ink-soft); font-weight: 700; }
.center { justify-content: center; }
</style>
