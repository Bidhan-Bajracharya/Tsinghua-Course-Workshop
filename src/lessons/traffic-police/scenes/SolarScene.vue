<script setup>
/** Using AI wisely: keep the solar AI camera working all day and night. */
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import LearnCard from '../components/LearnCard.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { makeSolar } from '../engine/solar'
import { sfx } from '../engine/core'
import { LEARN, NOTES } from '../data/content'

const cv = ref(null)
const ui = reactive({ bat: 60, mem: 10, msg: '', running: false, watched: 0, missed: 0 })
const opts = reactive({ ang: -50, sleep: false, del: false })
let so = null
onMounted(() => {
  so = makeSolar(cv.value, ui, opts)
  so.start()
})
onBeforeUnmount(() => so && so.stop())
function toggle(k) {
  opts[k] = !opts[k]
  sfx('beep')
}
const batColor = () => (ui.bat > 50 ? '#22b573' : ui.bat > 20 ? '#ffb703' : '#ef476f')
</script>

<template>
  <section class="ai-scene">
    <LearnCard :card="LEARN.solar" />
    <div class="ai-scene__head">
      <span class="ai-tag tp-k--teal">5 · Using AI wisely: green energy</span>
      <h2>Keep the solar AI camera working all day and night!</h2>
    </div>
    <div class="tp-layout">
      <div class="tp-sim"><canvas ref="cv" aria-label="A street camera on a pole with a solar panel, from morning to night"></canvas></div>
      <div class="tp-panel">
        <button class="ai-btn ai-btn--accent ai-btn--big" @click="so.startDay()">▶ {{ ui.running ? 'Start again' : 'Start the day' }}</button>
        <div class="ai-card box">
          <label for="ang">☀️ Aim the solar panel</label>
          <input id="ang" v-model.number="opts.ang" class="tp-range sun" type="range" min="-60" max="60" />
        </div>
        <button class="ai-btn" :class="{ 'ai-btn--green': opts.sleep }" :aria-pressed="opts.sleep" @click="toggle('sleep')">😴 Sleep mode: {{ opts.sleep ? 'ON' : 'OFF' }}</button>
        <button class="ai-btn" :class="{ 'ai-btn--green': opts.del }" :aria-pressed="opts.del" @click="toggle('del')">🗑️ Auto-delete old videos: {{ opts.del ? 'ON' : 'OFF' }}</button>
        <div class="ai-card box">
          <b>🔋 Battery</b>
          <div class="ai-meter big"><div class="ai-meter__fill" :style="{ width: ui.bat + '%', background: batColor() }"></div></div>
          <b>💾 Memory</b>
          <div class="ai-meter"><div class="ai-meter__fill" :style="{ width: ui.mem + '%', background: ui.mem > 80 ? '#ef476f' : 'var(--ai-primary)' }"></div></div>
        </div>
        <div class="ai-card box tp-msg" aria-live="polite">{{ ui.msg }}</div>
      </div>
    </div>
    <TeacherTip :text="NOTES.solar" />
  </section>
</template>

<style scoped>
.box { display: flex; flex-direction: column; gap: 6px; padding: 12px 16px; }
.box label { font-weight: 800; }
.sun { accent-color: #ffb703; }
.big { height: 24px; }
</style>
