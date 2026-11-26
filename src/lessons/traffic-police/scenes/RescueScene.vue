<script setup>
/** Chapter 3: rescue mission. Help the ambulance get through (drone + patrol robot). */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import LearnCard from '../components/LearnCard.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { makeLane, LANE_BUTTONS, LANE_TIPS } from '../engine/lane'
import { burst } from '../engine/core'
import { LEARN, NOTES } from '../data/content'

const cv = ref(null)
const stage = ref(0)
const done = ref(false)
let lane = null
const BTN = ['ai-btn--red', 'ai-btn--purple', 'ai-btn--orange', 'ai-btn--green']
onMounted(() => {
  lane = makeLane(cv.value, {
    onStage: (s) => (stage.value = s),
    onDone: () => {
      done.value = true
      burst(cv.value, 80)
    },
  })
  lane.start()
})
onBeforeUnmount(() => lane && lane.stop())
function restart() {
  done.value = false
  lane.reset()
}
</script>

<template>
  <section class="ai-scene">
    <LearnCard :card="LEARN.lane" />
    <div class="ai-scene__head">
      <span class="ai-tag tp-k--purple">Chapter 3 · Drone &amp; robot</span>
      <h2>Rescue mission: help the ambulance get through!</h2>
    </div>
    <div class="tp-layout">
      <div class="tp-sim"><canvas ref="cv" aria-label="A highway with an emergency lane, a control centre, a drone and a patrol robot"></canvas></div>
      <div class="tp-panel">
        <div class="ai-card tip" aria-live="polite">{{ done ? '✓ Rescue done: road open again!' : LANE_TIPS[Math.min(stage, 4)] }}</div>
        <button
          v-for="(b, i) in LANE_BUTTONS"
          :key="b"
          class="ai-btn lane-btn"
          :class="[BTN[i], { now: i === stage }]"
          :disabled="i !== stage"
          @click="lane.act(i)"
        >{{ i < stage ? '✓ ' : '' }}{{ b }}</button>
        <button class="ai-btn ai-btn--small" @click="restart">↺ Restart</button>
      </div>
    </div>
    <TeacherTip :text="NOTES.lane" />
  </section>
</template>

<style scoped>
.tip { font-size: 19px; font-weight: 700; min-height: 110px; padding: 14px 16px; }
.tp-panel .lane-btn { color: #fff; }
.tp-panel .ai-btn--red { background: var(--ai-red); box-shadow: 0 4px 0 #b8264a; }
.tp-panel .ai-btn--purple { background: var(--ai-purple); box-shadow: 0 4px 0 #6a3fd6; }
.tp-panel .ai-btn--orange { background: #ff8a3d; box-shadow: 0 4px 0 #d9691f; }
.tp-panel .lane-btn:disabled { opacity: 0.35; }
.tp-panel .lane-btn.now { animation: nudge 1.4s ease-in-out infinite; }
@keyframes nudge { 50% { transform: scale(1.03); } }
@media (prefers-reduced-motion: reduce) { .lane-btn.now { animation: none; } }
</style>
