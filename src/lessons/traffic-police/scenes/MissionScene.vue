<script setup>
/** Final missions 1–3: a picture, a story and a class checkpoint. */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ClassQuestion from '../components/ClassQuestion.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { makeCanvas, Loop } from '../engine/core'
import { SCENES } from '../engine/missions'
import { MISSIONS, NOTES } from '../data/content'

const props = defineProps({ i: { type: Number, required: true } })
const m = MISSIONS[props.i]
const cv = ref(null)
let loop = null
onMounted(() => {
  const ctx = makeCanvas(cv.value, 420, 240)
  const f = SCENES[m.scene]
  loop = Loop((dt, t) => f(ctx, 420, 240, t))
  loop.start()
})
onBeforeUnmount(() => loop && loop.stop())
</script>

<template>
  <section class="ai-scene">
    <span class="ai-tag tp-k--navy">🏁 Mission {{ i + 1 }} of {{ MISSIONS.length }}</span>
    <div class="mission">
      <div class="left">
        <div class="tp-sim"><canvas ref="cv" :aria-label="m.story"></canvas></div>
        <div class="ai-card story">{{ m.story }}</div>
      </div>
      <div class="ai-card"><ClassQuestion :q="m" compact /></div>
    </div>
    <TeacherTip :text="NOTES.mission" />
  </section>
</template>

<style scoped>
.mission { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: 18px; align-items: start; }
@media (max-width: 820px) { .mission { grid-template-columns: 1fr; } }
.left { display: flex; flex-direction: column; gap: 14px; }
.story { font-family: var(--ai-font-head); font-weight: 700; font-size: clamp(20px, 2.4vw, 24px); line-height: 1.25; }
</style>
