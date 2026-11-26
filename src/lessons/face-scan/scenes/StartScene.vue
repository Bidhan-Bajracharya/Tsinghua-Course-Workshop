<script setup>
import BeepSay from '../components/BeepSay.vue'
import FaceArt from '../components/FaceArt.vue'
import PredictVote from '../components/PredictVote.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { GOALS, FRIEND_CLUES } from '../data/content'

defineEmits(['next'])
const heroFace = { w: 60, h: 72, eg: 24, es: 7, nl: 20, mw: 22, sk: '#e8b48a', hc: '#2b1c14', hair: 0, glasses: false, hat: false }
const clues = FRIEND_CLUES.map((c) => ({ ...c, ok: c.k === 'eyes' || c.k === 'smile' }))
</script>

<template>
  <section class="ai-scene">
    <div class="hero ai-card">
      <div class="hero__scan" aria-hidden="true">
        <div class="frame">
          <span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
          <FaceArt :p="heroFace" dots />
          <span class="laser"></span>
        </div>
      </div>
      <div class="hero__text">
        <BeepSay text="Hi! I’m Beep 🤖. See the pink dots on this face? A computer put them there. Today you’ll find out why!" />
        <ul class="goals">
          <li v-for="g in GOALS" :key="g.title"><span>{{ g.icon }}</span><div><b>{{ g.title }}</b><small>{{ g.text }}</small></div></li>
        </ul>
      </div>
    </div>

    <PredictVote
      question="How do you know your best friend when you see them?"
      :options="clues"
      reveal="Their face! Eyes, nose and smile. Computers can learn faces too, by looking at lots of photos. That’s called AI learning."
      vote-hint="Hold up 1, 2, 3 or 4 fingers, then tap!"
    />

    <div class="ai-row center">
      <button class="ai-btn ai-btn--accent ai-btn--big" @click="$emit('next')">Let’s go! 🚀</button>
    </div>

    <TeacherTip text="Teach the voting now: “Today we vote with fingers: 1, 2 or 3, and thumbs up or down. Show me 2 fingers! Thumbs up!” Everyone votes before you tap." />
  </section>
</template>

<style scoped>
.hero {
  display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 24px; align-items: center;
  background: linear-gradient(135deg, #fff2e6, #ffffff 60%, #eef6ff);
}
@media (max-width: 760px) { .hero { grid-template-columns: 1fr; } }
.frame { position: relative; width: min(260px, 70%); margin: 0 auto; padding: 18px; }
.corner { position: absolute; width: 34px; height: 34px; border: 6px solid var(--ai-ink); }
.tl { top: 0; left: 0; border-right: 0; border-bottom: 0; border-radius: 10px 0 0 0; }
.tr { top: 0; right: 0; border-left: 0; border-bottom: 0; border-radius: 0 10px 0 0; }
.bl { bottom: 0; left: 0; border-right: 0; border-top: 0; border-radius: 0 0 0 10px; }
.br { bottom: 0; right: 0; border-left: 0; border-top: 0; border-radius: 0 0 10px 0; }
.laser { position: absolute; left: 12px; right: 12px; height: 4px; border-radius: 2px; background: var(--ai-green); box-shadow: 0 0 12px var(--ai-green); animation: scan 2.2s ease-in-out infinite alternate; top: 14px; }
@keyframes scan { to { top: calc(100% - 18px); } }
.hero__text { display: flex; flex-direction: column; gap: 16px; }
.goals { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.goals li { display: flex; gap: 12px; align-items: center; background: #fff; border-radius: 16px; padding: 10px 14px; box-shadow: inset 0 0 0 2px var(--ai-line); }
.goals li > span { font-size: 30px; }
.goals b { display: block; font-family: var(--ai-font-head); font-size: 19px; }
.goals small { color: var(--ai-ink-soft); font-size: 15px; font-weight: 700; }
.center { justify-content: center; }
</style>
