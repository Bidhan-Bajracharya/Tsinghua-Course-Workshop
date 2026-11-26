<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Blinky from '../components/Blinky.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { makeIntersection } from '../engine/intersection'
import { NOTES } from '../data/content'
import { useLessonState } from '../state'

defineEmits(['next'])
const S = useLessonState()
const cv = ref(null)
let x = null
onMounted(() => {
  x = makeIntersection(cv.value, 1600, 750, { rate: { E: 0.35, W: 0.35, N: 0.3, S: 0.3 }, cx: 1060, cy: 400, showRunners: false })
  x.warm(10)
  x.start()
})
onBeforeUnmount(() => x && x.stop())
</script>

<template>
  <section class="ai-scene">
    <div class="hero">
      <div class="tp-sim hero__sim"><canvas ref="cv" aria-label="A busy city crossroads seen from above"></canvas></div>
      <div class="hero__card ai-card">
        <Blinky class="hero__bot" />
        <span class="ai-tag">Unit 2 · Lesson 2</span>
        <h2>The AI<br />Traffic Police</h2>
        <p>How does artificial intelligence keep our city roads safe?</p>
        <div class="ai-row">
          <button class="ai-btn ai-btn--primary ai-btn--big" @click="$emit('next')">Start the lesson ▶</button>
          <button class="ai-btn" @click="S.setupOpen = true">🏁 {{ S.teamsOn ? 'Edit teams' : 'Set up teams' }}</button>
        </div>
        <p class="hello">Hi, I’m <b>Blinky</b>! I keep the roads safe. Let’s find out how AI helps me. 🚦</p>
      </div>
    </div>
    <TeacherTip :text="NOTES.title" />
  </section>
</template>

<style scoped>
.hero { position: relative; }
.hero__sim { aspect-ratio: 1600 / 750; }
.hero__card {
  position: absolute; left: 3%; top: 50%; transform: translateY(-50%); width: min(44%, 440px);
  display: flex; flex-direction: column; gap: 10px; align-items: flex-start;
}
.hero__card h2 { font-size: clamp(34px, 4.6vw, 56px); line-height: 0.95; color: var(--ai-primary-dark); }
.hero__card p { font-size: 19px; font-weight: 700; color: var(--ai-ink-soft); }
.hero__bot { position: absolute; right: 18px; top: -38px; width: 58px; }
.hello { background: #fff4d6; border-radius: 14px; padding: 8px 12px; font-size: 16px !important; color: #7a5600 !important; }
@media (max-width: 820px) {
  .hero__card { position: relative; left: auto; top: auto; transform: none; width: auto; margin-top: -30px; }
}
</style>
