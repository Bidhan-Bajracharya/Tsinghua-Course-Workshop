<script setup>
import RobotIcon from '../components/RobotIcon.vue'
defineEmits(['next'])

const goals = [
  { icon: '⏳', title: 'How they grew up', text: 'From bumping around to making maps.' },
  { icon: '🧠', title: 'Their AI tricks', text: 'How lasers and cameras help them “see”.' },
  { icon: '🎮', title: 'Play, then quiz!', text: 'Explore, experiment and earn your badge.' },
]
</script>

<template>
  <section class="ai-scene">
    <div class="hero ai-card">
      <div class="floor" aria-hidden="true">
        <div class="clean"></div>
        <svg class="bot" viewBox="-60 -60 120 120">
          <RobotIcon :angle="90" laser camera />
        </svg>
      </div>
      <div class="hero__talk">
        <div class="ai-bubble talk">
          Hi! I'm <b>Robo</b> 👋 — a <b>robot vacuum</b>.
          I clean floors all by myself! Want to find out how robots like me got so <b>smart</b>?
        </div>
      </div>
    </div>

    <div class="ai-scene__head">
      <h2>Today we will discover…</h2>
    </div>

    <div class="goals">
      <div v-for="g in goals" :key="g.title" class="goal ai-card">
        <span class="goal__icon">{{ g.icon }}</span>
        <h3>{{ g.title }}</h3>
        <p>{{ g.text }}</p>
      </div>
    </div>

    <div class="ai-row start">
      <button class="ai-btn ai-btn--accent ai-btn--big" @click="$emit('next')">Let's go! 🚀</button>
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  gap: 18px;
  background: linear-gradient(180deg, #dff0ff 0%, #ffffff 70%);
}
.floor {
  position: relative;
  height: 120px;
  border-radius: 18px;
  background-color: var(--ai-floor);
  background-image: radial-gradient(var(--ai-dust) 2.4px, transparent 3px);
  background-size: 20px 20px;
  overflow: hidden;
  box-shadow: inset 0 0 0 3px #f1e4c8;
}
.clean {
  position: absolute;
  inset: 0 auto 0 0;
  width: 0;
  background: linear-gradient(90deg, #fffdf6, #fffaf0);
  animation: clean 7s linear infinite;
}
.clean::after {
  content: '✨';
  position: absolute;
  right: 60px;
  top: 8px;
  font-size: 20px;
}
.bot {
  position: absolute;
  top: 10px;
  left: 0;
  width: 100px;
  height: 100px;
  animation: drive 7s linear infinite;
}
@keyframes drive {
  0% { left: -10px; }
  85% { left: calc(100% - 95px); }
  100% { left: calc(100% - 95px); }
}
@keyframes clean {
  0% { width: 0; }
  85% { width: 100%; }
  100% { width: 100%; }
}
.talk { font-size: 22px; }

.goals {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
@media (max-width: 760px) {
  .goals { grid-template-columns: 1fr; }
}
.goal { display: flex; flex-direction: column; gap: 6px; }
.goal__icon { font-size: 44px; line-height: 1; }
.goal h3 { font-size: 24px; }
.goal p { color: var(--ai-ink-soft); }
.start { justify-content: center; }
</style>
