<script setup>
/** Traffic Police Academy graduation: team podium (when playing in teams), badges and the certificate. */
import { computed, onMounted } from 'vue'
import BlinkySay from '../components/BlinkySay.vue'
import Badge from '../components/Badge.vue'
import Certificate from '../../../shared/Certificate.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { rain, sfx } from '../engine/core'
import { BADGES, CHECKPOINTS, NOTES } from '../data/content'
import { useLessonState, activeTeams } from '../state'

const emit = defineEmits(['next', 'complete'])
const S = useLessonState()

const answered = computed(() => CHECKPOINTS.filter((c) => S.answers[c.id] !== undefined).length)
const right = computed(() => CHECKPOINTS.filter((c) => S.answers[c.id] === true).length)
const order = computed(() => activeTeams(S).map((t, i) => ({ ...t, i })).sort((a, b) => b.score - a.score))
// podium positions: 2nd, 1st, 3rd, 4th
const podium = computed(() => [1, 0, 2, 3].filter((p) => p < order.value.length).map((p) => ({ ...order.value[p], place: p })))
const HEIGHTS = [170, 125, 90, 64]
// In class-team mode the team results go on the certificate instead of one player's score.
const stars = computed(() => {
  if (S.teamsOn) return 3
  if (!answered.value) return 2
  const p = right.value / CHECKPOINTS.length
  return p >= 0.75 ? 3 : p >= 0.5 ? 2 : 1
})
const scoreText = computed(() => (answered.value && !S.teamsOn ?`Checkpoints: ${right.value} / ${CHECKPOINTS.length}` : ''))
const extras = computed(() => (S.teamsOn ? order.value.map((t, k) => `${k + 1}. ${t.name}: ${t.score} points`) : []))

onMounted(() => {
  emit('complete', { score: right.value, total: CHECKPOINTS.length })
  setTimeout(() => {
    rain(160)
    sfx('win')
  }, 400)
})
function newClass() {
  if (!window.confirm('Reset all team scores to 0?')) return
  S.teams.forEach((t) => (t.score = 0))
  Object.keys(S.answers).forEach((k) => delete S.answers[k])
}
</script>

<template>
  <section class="ai-scene">
    <span class="ai-tag tp-k--navy">🏆 Final results</span>
    <BlinkySay light="green" text="Traffic Police Academy: graduation! You did it! 🎉" />

    <div v-if="S.teamsOn" class="ai-card pod" aria-label="Team podium">
      <div v-for="(t, k) in podium" :key="t.i" class="pcol" :style="{ animationDelay: k * 0.2 + 's' }">
        <svg class="pcar" viewBox="0 0 44 26" aria-hidden="true"><rect x="2" y="3" width="40" height="20" rx="8" :fill="t.color" stroke="#fff" stroke-width="2.5" /><rect x="23" y="6" width="9" height="14" rx="3" fill="#cfe9ff" /><rect x="9" y="6" width="7" height="14" rx="3" fill="#cfe9ff" /><rect x="38" y="5" width="4" height="4" rx="1" fill="#fff59d" /><rect x="38" y="17" width="4" height="4" rx="1" fill="#fff59d" /></svg>
        <span class="pname">{{ t.name }}</span>
        <b class="pscore">{{ t.score }}</b>
        <div class="pbar" :style="{ height: HEIGHTS[t.place] + 'px', background: t.color }"><span>{{ t.place + 1 }}</span></div>
      </div>
    </div>

    <div class="badges" aria-label="Badges earned in this lesson">
      <div v-for="b in BADGES" :key="b.n" class="badge"><Badge :b="b" :size="78" /><small>{{ b.name }}</small></div>
    </div>

    <p class="hint">✏️ Playing as a class? Type your <b>class name</b>. On your own? Type <b>your first name</b>.</p>
    <Certificate
      title="Traffic Police Academy Graduate!"
      line="for learning how AI keeps our roads safe, and promising to think for ourselves, use AI fairly, protect privacy, care for our planet, and follow the rules whether or not anyone is watching."
      unit-label="Unit 2 · Lesson 2 · The AI Traffic Police"
      file-stem="AI-Traffic-Police-Certificate"
      :stars="stars"
      :score-text="scoreText"
      :extras="extras"
      extras-title="Team results"
      mascot="blinky"
      signer="Blinky 🚦"
      signer-role="Chief Traffic Light"
      :initial-name="S.name"
      :show-back="false"
      @named="(n) => (S.name = n)"
    />
    <div v-if="S.teamsOn" class="ai-row center">
      <button class="ai-btn ai-btn--small" @click="newClass">↺ New class (reset scores)</button>
    </div>
    <TeacherTip :text="NOTES.podium" />
  </section>
</template>

<style scoped>
.pod { display: flex; align-items: flex-end; justify-content: center; gap: 14px; padding-bottom: 0; flex-wrap: wrap; }
.pcol { width: 150px; display: flex; flex-direction: column; align-items: center; gap: 4px; animation: drop 0.8s cubic-bezier(0.3, 1.4, 0.5, 1) both; }
@keyframes drop { from { transform: translateY(-120px); opacity: 0; } }
.pcar { width: 96px; height: 56px; }
.pname { font-family: var(--ai-font-head); font-weight: 800; font-size: 19px; text-align: center; line-height: 1.1; }
.pscore { font-family: var(--ai-font-head); font-size: 34px; line-height: 1; }
.pbar { width: 100%; border-radius: 18px 18px 0 0; display: flex; justify-content: center; padding-top: 8px; box-shadow: inset 0 -12px 0 rgba(0, 0, 0, 0.12); }
.pbar span { font-family: var(--ai-font-head); font-size: 44px; font-weight: 800; color: #fff; text-shadow: 0 3px 0 rgba(0, 0, 0, 0.2); }
.badges { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
.badge { width: 104px; display: flex; flex-direction: column; align-items: center; gap: 2px; text-align: center; }
.badge small { font-weight: 800; font-size: 12px; color: var(--ai-ink-soft); line-height: 1.15; }
.hint { text-align: center; font-weight: 700; color: var(--ai-ink-soft); }
.center { justify-content: center; }
@media (prefers-reduced-motion: reduce) { .pcol { animation: none; } }
</style>
