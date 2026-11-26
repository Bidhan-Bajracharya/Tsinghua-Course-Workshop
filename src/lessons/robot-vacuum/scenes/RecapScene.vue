<script setup>
defineEmits(['next'])

const ideas = [
  {
    art: ['🦇', '💥', '🔦', '📷'],
    title: 'Robot vacuums grew up',
    text: 'From listening like a bat, to bumping around, to laser eyes and camera eyes.',
    color: '#e7f0ff',
  },
  {
    art: ['🗺️', '➡️', '🧹'],
    title: 'Maps make cleaning faster',
    text: 'A robot with a map plans a neat path. AI helps it recognise things like socks and pets.',
    color: '#e3f8ee',
  },
  {
    art: ['💭', '➕', '🧮'],
    title: 'Dream big, think smart',
    text: 'Great inventions mix imagination with practical thinking, like making it cheap enough to buy.',
    color: '#fff4d6',
  },
]
</script>

<template>
  <section class="ai-scene">
    <div class="ai-scene__head">
      <span class="ai-tag">⭐ Remember</span>
      <h2>Today’s 3 big ideas</h2>
    </div>

    <div class="ideas">
      <div v-for="(idea, i) in ideas" :key="idea.title" class="ai-card idea" :style="{ background: idea.color, animationDelay: i * 0.15 + 's' }">
        <span class="idea__n">{{ i + 1 }}</span>
        <div class="idea__art">
          <span v-for="(a, k) in idea.art" :key="k" :style="{ animationDelay: k * 0.2 + 's' }">{{ a }}</span>
        </div>
        <h3>{{ idea.title }}</h3>
        <p>{{ idea.text }}</p>
      </div>
    </div>

    <div class="ai-row go">
      <button class="ai-btn ai-btn--accent ai-btn--big" @click="$emit('next')">I'm ready for the quiz! 🏆</button>
    </div>
  </section>
</template>

<style scoped>
.ideas { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
@media (max-width: 820px) { .ideas { grid-template-columns: 1fr; } }
.idea {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 30px;
  animation: rise 0.5s ease both;
}
@keyframes rise { from { opacity: 0; transform: translateY(16px); } }
.idea__n {
  position: absolute; top: -14px; left: 18px; width: 40px; height: 40px; border-radius: 50%;
  background: var(--ai-primary); color: #fff; display: grid; place-items: center;
  font-family: var(--ai-font-head); font-weight: 800; font-size: 22px;
}
.idea__art { display: flex; gap: 6px; font-size: 40px; }
.idea__art span { display: inline-block; animation: hop 2.4s ease-in-out infinite; }
@keyframes hop { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-8px); } }
.idea h3 { font-size: 26px; }
.go { justify-content: center; }
</style>
