<script setup>
import { ref, reactive } from 'vue'
import BeepSay from '../components/BeepSay.vue'
import AnimalArt from '../components/AnimalArt.vue'
import NosePrint from '../components/NosePrint.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { DOG_NAMES } from '../data/content'
import { shuffle, pick } from '../data/faces'
import { useLessonState } from '../state'

defineEmits(['next'])
const S = useLessonState()
const ROUNDS = 3
const round = ref(0)
const dog = reactive({ target: 0, name: '', opts: [] })
const tried = reactive(new Set())
const found = ref(false)
const reasoned = ref(null) // null | 'right' | 'wrong'
const done = ref(false)
const msg = ref('')

function newDog() {
  dog.target = Math.floor(Math.random() * 1e9)
  dog.name = pick(DOG_NAMES)
  const furs = shuffle(['brown', 'white', 'black', 'grey', 'orange'])
  dog.opts = shuffle([
    { s: dog.target, ok: true },
    { s: dog.target + 7919, ok: false },
    { s: dog.target + 104729, ok: false },
  ]).map((o, k) => ({ ...o, c: furs[k] }))
  tried.clear()
  found.value = false
  reasoned.value = null
  msg.value = ''
}
newDog()

function choose(k) {
  if (found.value || tried.has(k)) return
  if (dog.opts[k].ok) {
    found.value = true
    msg.value = `🐾 Woof! You found ${dog.name}!`
  } else {
    tried.add(k)
    msg.value = 'Not this dog. Look at the big spots!'
  }
}
function reason(ok) {
  if (reasoned.value === 'right') return
  if (ok) {
    reasoned.value = 'right'
    S.stars++
    msg.value = '⭐ Super! Every nose has its own pattern, like a fingerprint.'
  } else {
    reasoned.value = 'wrong'
    msg.value = 'Look again! The colour of the dog can be the same for many dogs.'
  }
}
function next() {
  round.value++
  if (round.value >= ROUNDS) done.value = true
  else newDog()
}
function again() {
  round.value = 0
  done.value = false
  newDog()
}
</script>

<template>
  <section class="ai-scene">
    <BeepSay :text="done ? 'Detective work done!' : `Find ${dog.name}’s nose print!`" />

    <template v-if="!done">
      <div class="top"><span class="count">Dog {{ round + 1 }} / {{ ROUNDS }}</span></div>
      <div class="case ai-card">
        <div class="target">
          <span class="label">🔍 {{ dog.name }}’s nose print</span>
          <NosePrint :seed="dog.target" />
        </div>
        <div class="dogs">
          <button
            v-for="(o, k) in dog.opts"
            :key="o.s"
            class="dog"
            :class="{ ok: found && o.ok, no: tried.has(k) }"
            :disabled="found || tried.has(k)"
            :aria-label="`Dog ${k + 1}`"
            @click="choose(k)"
          >
            <span class="dog__n">{{ k + 1 }}</span>
            <span class="dog__face"><AnimalArt :a="{ t: 'dog', c: o.c }" /></span>
            <NosePrint :seed="o.s" />
          </button>
        </div>
      </div>
      <p v-if="msg" class="msg">{{ msg }}</p>
      <div v-if="found" class="ai-card reflect">
        <h3>What helped you find {{ dog.name }}?</h3>
        <div class="ai-row center">
          <button class="chip" :class="{ right: reasoned === 'right' }" @click="reason(true)">The bumps</button>
          <button class="chip" :class="{ wrong: reasoned === 'wrong' }" @click="reason(false)">The colour</button>
        </div>
        <button v-if="reasoned === 'right'" class="ai-btn ai-btn--primary" @click="next">{{ round === ROUNDS - 1 ? 'Finish ▶' : 'Next dog ▶' }}</button>
      </div>
    </template>

    <div v-else class="ai-card done">
      <div class="big">🐶🔍🐾</div>
      <h2>Case closed, detective!</h2>
      <p>Computers find lost dogs using the same tiny patterns. Some farms even use cameras to check pigs’ faces to see if they’re healthy!</p>
      <div class="ai-row center">
        <button class="ai-btn" @click="again">🔁 Play again</button>
        <button class="ai-btn ai-btn--green" @click="$emit('next')">Next ▶</button>
      </div>
    </div>

    <TeacherTip text="“Every dog’s nose print is different, like a fingerprint!” On the projector, the class votes 1, 2 or 3 fingers for the matching dog; ask one child which clue they used. Good for early finishers too." />
  </section>
</template>

<style scoped>
.top { display: flex; justify-content: flex-start; }
.count { background: #fff2e6; color: #d9691f; padding: 4px 14px; border-radius: 999px; font-weight: 800; }
.case { display: grid; grid-template-columns: 220px 1fr; gap: 16px; align-items: center; }
@media (max-width: 680px) { .case { grid-template-columns: 1fr; } }
.target { background: #3a4a6b; border-radius: 18px; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
.label { color: #fff; font-weight: 800; }
.dogs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.dog {
  position: relative; border: 0; cursor: pointer; background: #fff; border-radius: 18px; padding: 8px; display: flex; flex-direction: column; align-items: center; gap: 6px;
  box-shadow: inset 0 0 0 3px var(--ai-line), 0 4px 0 var(--ai-line); transition: transform 0.12s;
}
.dog:hover:not(:disabled) { transform: translateY(-3px); }
.dog:disabled { cursor: default; }
.dog.ok { background: #e3f8ee; box-shadow: inset 0 0 0 4px var(--ai-green), 0 4px 0 #17895a; }
.dog.no { opacity: 0.45; }
.dog__n { position: absolute; top: 6px; left: 8px; width: 24px; height: 24px; border-radius: 50%; background: var(--ai-ink); color: #fff; font-weight: 800; font-size: 13px; display: grid; place-items: center; }
.dog__face { width: 55%; }
.msg { text-align: center; font-weight: 800; font-size: 18px; background: #fff; border-radius: 14px; padding: 8px 14px; box-shadow: inset 0 0 0 2px var(--ai-line); }
.reflect { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; background: #f3efff; }
.reflect h3 { font-size: 22px; }
.chip { border: 0; font: inherit; font-weight: 800; font-size: 17px; cursor: pointer; background: #fff; border-radius: 999px; padding: 8px 18px; box-shadow: inset 0 0 0 2px var(--ai-line); }
.chip.right { background: var(--ai-green); color: #fff; box-shadow: none; }
.chip.wrong { background: #ffe6ec; color: #b8264a; box-shadow: none; }
.done { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; }
.big { font-size: 48px; }
.done h2 { font-size: 30px; }
.done p { font-size: 19px; color: var(--ai-ink-soft); font-weight: 700; max-width: 560px; }
.center { justify-content: center; }
</style>
