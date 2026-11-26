<script setup>
/** Using AI wisely: where should traffic cameras go? (privacy & fairness sort) */
import { ref, reactive } from 'vue'
import LearnCard from '../components/LearnCard.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { sfx } from '../engine/core'
import { LEARN, NOTES, PLACES } from '../data/content'

const ans = reactive({})
const checked = ref(false)
const score = ref(0)
function set(i, v) {
  if (checked.value) return
  ans[i] = v
  sfx('beep')
}
function check() {
  score.value = PLACES.filter((p, i) => ans[i] === p.ok).length
  checked.value = true
  sfx('win')
}
function reset() {
  Object.keys(ans).forEach((k) => delete ans[k])
  checked.value = false
}
</script>

<template>
  <section class="ai-scene">
    <LearnCard :card="LEARN.privacy" />
    <div class="head">
      <div class="ai-scene__head">
        <span class="ai-tag tp-k--teal">5 · Using AI wisely: privacy</span>
        <h2>Where should traffic cameras go?</h2>
        <p>Tap ✅ for OK or ❌ for not OK. Talk about each one first!</p>
      </div>
      <div class="ai-row">
        <button class="ai-btn ai-btn--green" :disabled="checked" @click="check">✓ Check</button>
        <button class="ai-btn" aria-label="Start again" @click="reset">↺</button>
      </div>
    </div>
    <div class="grid">
      <div
        v-for="(p, i) in PLACES"
        :key="p.t"
        class="ai-card pv"
        :class="{ good: checked && p.ok, bad: checked && !p.ok }"
      >
        <span class="ic" aria-hidden="true">{{ p.e }}</span>
        <div class="tx">
          <b>{{ p.t }}</b>
          <small v-if="checked">{{ ans[i] === undefined ? '' : ans[i] === p.ok ? '✓ ' : '✗ ' }}{{ p.why }}</small>
        </div>
        <div class="btns">
          <button :class="{ on: ans[i] === true }" :aria-pressed="ans[i] === true" :aria-label="`${p.t}: OK`" @click="set(i, true)">✅</button>
          <button :class="{ on: ans[i] === false }" :aria-pressed="ans[i] === false" :aria-label="`${p.t}: not OK`" @click="set(i, false)">❌</button>
        </div>
      </div>
    </div>
    <p v-if="checked" class="score" aria-live="polite">{{ score }} / {{ PLACES.length }} sorted the same way as the safety rules</p>
    <TeacherTip :text="NOTES.privacy" />
  </section>
</template>

<style scoped>
.head { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; flex-wrap: wrap; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (max-width: 760px) { .grid { grid-template-columns: 1fr; } }
.pv { display: flex; align-items: center; gap: 12px; padding: 12px 14px; transition: all 0.3s; }
.pv.good { box-shadow: inset 0 0 0 4px var(--ai-green), var(--ai-shadow); background: #f0fdf7; }
.pv.bad { box-shadow: inset 0 0 0 4px var(--ai-red), var(--ai-shadow); background: #fff4f6; }
.ic { font-size: 38px; }
.tx { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.tx b { font-size: 19px; line-height: 1.2; }
.tx small { font-size: 16px; color: var(--ai-ink-soft); font-weight: 700; }
.btns { display: flex; gap: 6px; }
.btns button { border: 0; width: 50px; height: 50px; border-radius: 14px; background: #eef1fb; font-size: 24px; opacity: 0.55; cursor: pointer; transition: all 0.2s; }
.btns button.on { opacity: 1; transform: scale(1.08); box-shadow: 0 0 0 4px var(--ai-ink); }
.score { text-align: center; font-family: var(--ai-font-head); font-weight: 800; font-size: 26px; }
</style>
