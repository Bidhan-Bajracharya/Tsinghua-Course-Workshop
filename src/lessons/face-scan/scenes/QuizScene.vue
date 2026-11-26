<script setup>
/** Quiz with hints: a wrong answer shows a hint and you try again. Only first tries count. */
import { ref, reactive, computed } from 'vue'
import BeepSay from '../components/BeepSay.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { QUIZ } from '../data/content'
import { useLessonState } from '../state'

const emit = defineEmits(['next', 'complete'])
const S = useLessonState()
const qi = ref(0)
const first = ref(true)
const score = ref(0)
const wrong = reactive(new Set())
const right = ref(null)
const finished = ref(false)
const q = computed(() => QUIZ[qi.value])

function answer(k) {
  if (right.value !== null || wrong.has(k)) return
  if (k === q.value.a) {
    right.value = k
    if (first.value) {
      score.value++
      S.stars++
    }
  } else {
    first.value = false
    wrong.add(k)
  }
}
function next() {
  if (qi.value < QUIZ.length - 1) {
    qi.value++
    first.value = true
    wrong.clear()
    right.value = null
    return
  }
  finished.value = true
  S.quizDone = true
  S.quizScore = score.value
  emit('complete', { score: score.value, total: QUIZ.length })
}
function restart() {
  qi.value = 0
  score.value = 0
  first.value = true
  wrong.clear()
  right.value = null
  finished.value = false
}
</script>

<template>
  <section class="ai-scene">
    <template v-if="!finished">
      <BeepSay text="Think first, then tap! Wrong? Read the hint and try again." />
      <div class="top">
        <div class="dots"><i v-for="(_, k) in QUIZ" :key="k" :class="{ ok: k < qi, now: k === qi }"></i></div>
        <span>Question {{ qi + 1 }} / {{ QUIZ.length }}</span>
      </div>
      <Transition name="swap" mode="out-in">
        <div :key="qi" class="ai-card card">
          <h2>{{ q.q }}</h2>
          <div class="opts">
            <button
              v-for="(o, k) in q.o"
              :key="k"
              class="opt"
              :class="{ right: right === k, wrong: wrong.has(k) }"
              :disabled="right !== null || wrong.has(k)"
              @click="answer(k)"
            >{{ o }}</button>
          </div>
          <p v-if="right !== null" class="fb ok">✅ <b>Correct!</b> {{ q.why }} <span v-if="!first">Great fixing! 💪</span></p>
          <p v-else-if="wrong.size" class="fb hint">💡 <b>Hint:</b> {{ q.hint }}</p>
          <button v-if="right !== null" class="ai-btn ai-btn--primary" @click="next">{{ qi < QUIZ.length - 1 ? 'Next question ▶' : 'See my score 🏆' }}</button>
        </div>
      </Transition>
    </template>

    <div v-else class="ai-card result">
      <div class="stars">
        <span v-for="n in 3" :key="n" :class="{ on: n <= (score / QUIZ.length >= 0.85 ? 3 : score / QUIZ.length >= 0.6 ? 2 : 1) }">★</span>
      </div>
      <h2>{{ score }} / {{ QUIZ.length }} on the first try!</h2>
      <p>Mistakes are how we learn. You fixed every one! 💪</p>
      <div class="ai-row center">
        <button class="ai-btn" @click="restart">🔁 Try again</button>
        <button class="ai-btn ai-btn--accent ai-btn--big" @click="$emit('next')">🎓 Get my certificate</button>
      </div>
    </div>

    <TeacherTip text="Let pairs answer on tablets, or vote as a class. Praise fixing mistakes: only first tries count for the score, but every question ends with the right answer." />
  </section>
</template>

<style scoped>
.top { display: flex; justify-content: space-between; align-items: center; font-weight: 800; color: var(--ai-ink-soft); gap: 10px; flex-wrap: wrap; }
.dots { display: flex; gap: 6px; }
.dots i { width: 14px; height: 14px; border-radius: 50%; background: var(--ai-line); }
.dots i.ok { background: var(--ai-green); }
.dots i.now { background: #ff8a3d; transform: scale(1.3); }
.card { display: flex; flex-direction: column; gap: 14px; align-items: center; text-align: center; }
.card h2 { font-size: clamp(23px, 3.2vw, 30px); }
.opts { display: grid; gap: 10px; width: 100%; max-width: 640px; }
.opt { border: 0; font: inherit; font-weight: 800; font-size: 19px; cursor: pointer; background: #fff; border-radius: 16px; padding: 14px 16px; box-shadow: inset 0 0 0 3px var(--ai-line), 0 4px 0 var(--ai-line); transition: transform 0.12s; }
.opt:hover:not(:disabled) { transform: translateY(-2px); }
.opt:disabled { cursor: default; }
.opt.right { background: #e3f8ee; box-shadow: inset 0 0 0 3px var(--ai-green), 0 4px 0 #17895a; }
.opt.wrong { background: #ffe6ec; box-shadow: inset 0 0 0 3px var(--ai-red), 0 4px 0 #b8264a; opacity: 0.7; animation: shake 0.35s; }
@keyframes shake { 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
.fb { border-radius: 14px; padding: 10px 16px; font-size: 18px; max-width: 640px; }
.fb.ok { background: #e3f8ee; color: #137a4f; }
.fb.hint { background: #fff4d6; color: #7a5600; }
.result { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; }
.stars { font-size: 56px; letter-spacing: 6px; }
.stars span { color: #dfe6f2; }
.stars span.on { color: var(--ai-accent); text-shadow: 0 3px 0 #d99a00; }
.result h2 { font-size: 32px; }
.result p { color: var(--ai-ink-soft); font-weight: 700; font-size: 19px; }
.center { justify-content: center; }
.swap-enter-active, .swap-leave-active { transition: all 0.2s ease; }
.swap-enter-from { opacity: 0; transform: translateX(20px); }
.swap-leave-to { opacity: 0; transform: translateX(-20px); }
</style>
