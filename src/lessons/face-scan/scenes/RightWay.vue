<script setup>
import { ref } from 'vue'
import BeepSay from '../components/BeepSay.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { RIGHT_WAY } from '../data/content'

defineEmits(['next'])
const shown = ref(1)
const hat = ref(null)
</script>

<template>
  <section class="ai-scene">
    <BeepSay text="Face scans are clever. Here’s how to use them the right way." />

    <div class="cards">
      <TransitionGroup name="pop">
        <div v-for="(c, i) in RIGHT_WAY.slice(0, shown)" :key="c.title" class="ai-card card">
          <span class="n">{{ i + 1 }}</span>
          <span class="icon">{{ c.icon }}</span>
          <h3>{{ c.title }}</h3>
          <p>{{ c.text }}</p>
        </div>
      </TransitionGroup>
    </div>
    <div v-if="shown < RIGHT_WAY.length" class="ai-row center">
      <button class="ai-btn ai-btn--primary" @click="shown++">Show the next one ▶</button>
    </div>

    <div v-else class="ai-card quick">
      <h3>⚡ Quick question: did a hat trick YOU in the Face Gate game?</h3>
      <div class="ai-row center">
        <button class="ai-btn" :class="{ 'is-on': hat === 'yes' }" @click="hat = 'yes'">👍 Yes</button>
        <button class="ai-btn" :class="{ 'is-on': hat === 'no' }" @click="hat = 'no'">👎 No</button>
      </div>
      <p v-if="hat" class="ans">The gate measures eyes, nose and mouth, so a hat shouldn’t trick it. But real scanners CAN be tricked by masks, bad light or photos. That’s why a person checks!</p>
      <button v-if="hat" class="ai-btn ai-btn--green" @click="$emit('next')">Next ▶</button>
    </div>

    <TeacherTip text="Click through: Ask first (“Their face belongs to them”), AI can be wrong (“Like Beep, a person must always check”), Think first (“Your brain is the boss!”). Real research (NIST, 2019) found many face scanners make more mistakes for some groups of people." />
  </section>
</template>

<style scoped>
.cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
@media (max-width: 760px) { .cards { grid-template-columns: 1fr; } }
.card { position: relative; display: flex; flex-direction: column; gap: 6px; padding-top: 28px; }
.n { position: absolute; top: -12px; left: 16px; width: 34px; height: 34px; border-radius: 50%; background: #ff8a3d; color: #fff; display: grid; place-items: center; font-family: var(--ai-font-head); font-weight: 800; }
.icon { font-size: 46px; line-height: 1; }
.card h3 { font-size: 24px; }
.card p { color: var(--ai-ink-soft); font-weight: 700; }
.quick { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; background: #f3efff; }
.quick h3 { font-size: 21px; }
.ans { font-weight: 700; max-width: 600px; }
.center { justify-content: center; }
.pop-enter-active { transition: all 0.35s ease; }
.pop-enter-from { opacity: 0; transform: translateY(16px) scale(0.95); }
</style>
