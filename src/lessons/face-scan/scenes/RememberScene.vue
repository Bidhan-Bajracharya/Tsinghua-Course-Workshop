<script setup>
import BeepSay from '../components/BeepSay.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { REMEMBER } from '../data/content'
defineEmits(['next'])
</script>

<template>
  <section class="ai-scene">
    <BeepSay text="Remember! Let’s read these together." />
    <ol class="list">
      <li v-for="(r, i) in REMEMBER" :key="r.t" class="ai-card item" :style="{ animationDelay: i * 0.12 + 's' }">
        <span class="n">{{ i + 1 }}</span><span class="e">{{ r.e }}</span><p>{{ r.t }}</p>
      </li>
    </ol>
    <div class="ai-row center"><button class="ai-btn ai-btn--accent ai-btn--big" @click="$emit('next')">Quiz time! 🏆</button></div>
    <TeacherTip text="Read the five points aloud together as a class, one child per line." />
  </section>
</template>

<style scoped>
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.item { display: flex; align-items: center; gap: 14px; padding: 14px 18px; animation: rise 0.45s ease both; }
@keyframes rise { from { opacity: 0; transform: translateY(12px); } }
.n { width: 36px; height: 36px; flex: none; border-radius: 50%; background: #ff8a3d; color: #fff; display: grid; place-items: center; font-family: var(--ai-font-head); font-weight: 800; font-size: 18px; }
.e { font-size: 34px; }
.item p { font-family: var(--ai-font-head); font-weight: 700; font-size: clamp(18px, 2.4vw, 23px); }
.center { justify-content: center; }
</style>
