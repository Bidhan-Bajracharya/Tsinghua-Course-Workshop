<script setup>
/**
 * Checkpoint question (A–D).
 * Solo: tap an answer → it is checked and explained.
 * Class teams on: tap each team's card letter, then Reveal → teams that were right get points.
 */
import { ref, reactive, computed } from 'vue'
import { useLessonState, addPoints, activeTeams } from '../state'
import { useSpeech } from '../../../shared/useSpeech'
import { sfx, burst } from '../engine/core'

const props = defineProps({ q: { type: Object, required: true }, compact: { type: Boolean, default: false } })
const emit = defineEmits(['answered'])
const S = useLessonState()
const { speak } = useSpeech()

const revealed = ref(false)
const mine = ref(null) // the option tapped on screen
const picks = reactive({}) // team index → letter
let scored = false
const optEls = ref({})
const LET_COLORS = { A: '#ef476f', B: '#2f7cf6', C: '#22b573', D: '#ff8a3d' }
const teams = computed(() => activeTeams(S))

function pickTeam(t, k) {
  if (revealed.value) return
  picks[t] = picks[t] === k ? undefined : k
}
function tap(k) {
  if (revealed.value) return
  mine.value = k
  if (S.answers[props.q.id] === undefined) S.answers[props.q.id] = k === props.q.a
  reveal()
}
function reveal() {
  if (revealed.value) return
  revealed.value = true
  const el = optEls.value[props.q.a]
  if (el) burst(el, 60)
  const ok = mine.value === null || mine.value === props.q.a
  sfx(ok ? 'win' : 'bad')
  setTimeout(() => speak(props.q.why), 700)
  if (S.teamsOn && !scored) {
    scored = true
    Object.entries(picks).forEach(([t, k]) => {
      if (k === props.q.a) setTimeout(() => addPoints(S, +t, props.q.pts), 500 + +t * 180)
    })
  }
  emit('answered')
}
function again() {
  revealed.value = false
  mine.value = null
  scored = false
  Object.keys(picks).forEach((k) => delete picks[k])
}
const dotsFor = (k) => Object.entries(picks).filter(([t, v]) => v === k && +t < S.teamCount).map(([t]) => S.teams[t].color)
</script>

<template>
  <div class="qwrap" :class="{ compact }">
    <h2 class="qtext">{{ q.q }}</h2>
    <p v-if="!revealed" class="hint">✋ {{ S.teamsOn ? 'Teams: hold up your A / B / C / D card!' : 'Think first, then tap your answer!' }}</p>
    <div class="opts">
      <button
        v-for="o in q.o"
        :key="o.k"
        :ref="(el) => (optEls[o.k] = el)"
        class="opt"
        :class="{ right: revealed && o.k === q.a, wrong: revealed && mine === o.k && o.k !== q.a, dim: revealed && o.k !== q.a && mine !== o.k }"
        :disabled="revealed"
        @click="tap(o.k)"
      >
        <span class="let" :style="{ background: LET_COLORS[o.k] }">{{ o.k }}</span>
        <span class="txt">{{ o.l }}</span>
        <span class="picks"><i v-for="(c, n) in dotsFor(o.k)" :key="n" :style="{ background: c }"></i></span>
      </button>
    </div>

    <div v-if="S.teamsOn" class="teamrow">
      <span class="lab">Team answers:</span>
      <div v-for="(t, i) in teams" :key="i" class="qt" :style="{ background: t.color }">
        <span class="qt__n">{{ t.name }}</span>
        <button
          v-for="o in q.o"
          :key="o.k"
          :class="{ on: picks[i] === o.k }"
          :aria-pressed="picks[i] === o.k"
          :aria-label="`${t.name} picks ${o.k}`"
          :disabled="revealed"
          @click="pickTeam(i, o.k)"
        >{{ o.k }}</button>
      </div>
      <span class="grow"></span>
      <button class="ai-btn ai-btn--green ai-btn--small" :disabled="revealed" @click="reveal">👁 Reveal</button>
      <button class="ai-btn ai-btn--small" aria-label="Ask again" @click="again">↺</button>
    </div>

    <Transition name="pop">
      <div v-if="revealed" class="after">
        <p class="explain" :class="{ oops: mine && mine !== q.a }">
          <b v-if="mine && mine !== q.a">🤔 Not quite! </b>✅ {{ q.why }}
        </p>
        <p class="why">🗣️ Your turn to explain: <b>why</b> is this the best answer, and why are the others wrong? Could anyone disagree?</p>
        <button v-if="!S.teamsOn" class="ai-btn ai-btn--small again" @click="again">↺ Ask again</button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.qwrap { display: flex; flex-direction: column; gap: 12px; }
.qtext { font-size: clamp(24px, 3.2vw, 34px); color: var(--ai-ink); }
.compact .qtext { font-size: clamp(22px, 2.8vw, 28px); }
.hint { color: var(--ai-ink-soft); font-weight: 700; }
.opts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.compact .opts { grid-template-columns: 1fr; }
@media (max-width: 640px) { .opts { grid-template-columns: 1fr; } }
.opt {
  border: 0; font: inherit; text-align: left; cursor: pointer; background: #fff; color: var(--ai-ink); border-radius: 18px;
  display: flex; align-items: center; gap: 12px; padding: 10px 14px 10px 10px; min-height: 68px;
  box-shadow: inset 0 0 0 3px var(--ai-line), 0 4px 0 var(--ai-line); transition: transform 0.12s, opacity 0.2s;
}
.opt:hover:not(:disabled) { transform: translateY(-2px); }
.opt:disabled { cursor: default; }
.let { flex: none; width: 48px; height: 48px; border-radius: 14px; color: #fff; display: grid; place-items: center; font-family: var(--ai-font-head); font-weight: 800; font-size: 28px; box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.15); }
.txt { font-weight: 800; font-size: 19px; line-height: 1.2; }
.picks { margin-left: auto; display: flex; gap: 4px; }
.picks i { width: 18px; height: 18px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3); }
.opt.right { background: #e3f8ee; box-shadow: inset 0 0 0 4px var(--ai-green), 0 4px 0 #17895a; }
.opt.wrong { background: #ffe6ec; box-shadow: inset 0 0 0 4px var(--ai-red), 0 4px 0 #b8264a; }
.opt.dim { opacity: 0.5; }

.teamrow { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; background: #f6f9ff; border-radius: 16px; padding: 8px; box-shadow: inset 0 0 0 2px var(--ai-line); }
.lab { font-weight: 800; color: var(--ai-ink-soft); }
.qt { display: flex; align-items: center; gap: 4px; border-radius: 12px; padding: 4px 6px 4px 10px; color: #fff; }
.qt__n { font-weight: 800; font-size: 14px; margin-right: 4px; max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qt button { border: 0; width: 30px; height: 30px; border-radius: 8px; font: inherit; font-weight: 900; cursor: pointer; background: rgba(255, 255, 255, 0.3); color: #fff; }
.qt button.on { background: #fff; color: var(--ai-ink); }
.qt button:disabled { cursor: default; }
.grow { flex: 1; }

.after { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.explain { font-size: 20px; font-weight: 700; background: #e3f8ee; color: #137a4f; border-radius: 16px; padding: 10px 16px; }
.explain.oops { background: #fff4d6; color: #7a5600; }
.why { background: #fff8e1; border-left: 8px solid var(--ai-accent); border-radius: 14px; padding: 10px 16px; font-size: 18px; }
.pop-enter-active { transition: all 0.3s ease; }
.pop-enter-from { opacity: 0; transform: translateY(8px); }
</style>
