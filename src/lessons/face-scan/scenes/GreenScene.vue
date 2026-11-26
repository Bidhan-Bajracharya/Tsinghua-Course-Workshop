<script setup>
import { ref } from 'vue'
import BeepSay from '../components/BeepSay.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { PLEDGES } from '../data/content'
import { useLessonState } from '../state'

defineEmits(['next'])
const S = useLessonState()
const lit = ref(false)
function toggle(k) {
  const i = S.pledges.indexOf(k)
  if (i > -1) S.pledges.splice(i, 1)
  else S.pledges.push(k)
}
</script>

<template>
  <section class="ai-scene">
    <BeepSay text="Be a green AI helper! AI needs a LOT of electricity." />

    <div class="ai-card dc">
      <svg viewBox="0 0 520 200" class="dc__art" aria-hidden="true">
        <rect width="520" height="200" rx="16" fill="#1d2b4f" />
        <g v-for="n in 5" :key="n" :transform="`translate(${30 + (n - 1) * 96} 30)`">
          <rect width="76" height="140" rx="8" fill="#2f3b55" />
          <g v-for="m in 6" :key="m">
            <rect x="8" :y="8 + (m - 1) * 22" width="60" height="14" rx="3" fill="#3a4a6b" />
            <circle :cx="58" :cy="15 + (m - 1) * 22" r="3" :fill="lit ? ['#22c46e', '#ffd166', '#00e5ff'][(n + m) % 3] : '#4b5c80'" :class="{ blink: lit }" :style="{ animationDelay: (n * m) % 7 * 0.15 + 's' }" />
          </g>
        </g>
        <text v-if="lit" x="260" y="192" text-anchor="middle" font-size="14" font-weight="800" fill="#ffd166">⚡ whirr… whirr… lots of electricity!</text>
      </svg>
      <div class="dc__text">
        <h3>🏭 Data centres</h3>
        <p>AI runs in giant buildings full of computers called <b>data centres</b>. In 2024 they used about <b>1.5% of all the world’s electricity</b>. That’s a lot!</p>
        <button class="ai-btn" :class="{ 'is-on': lit }" @click="lit = !lit">{{ lit ? '⏻ Switch off' : '⚡ Switch on the data centre' }}</button>
      </div>
    </div>

    <div class="ai-card pledge">
      <h3>🌱 My green promises <small>(tap the ones you’ll do)</small></h3>
      <div class="pledges">
        <button v-for="p in PLEDGES" :key="p.k" class="pl" :class="{ on: S.pledges.includes(p.k) }" :aria-pressed="S.pledges.includes(p.k)" @click="toggle(p.k)">
          <span class="pl__box">{{ S.pledges.includes(p.k) ? '✓' : '' }}</span>
          <span class="pl__e">{{ p.e }}</span>{{ p.l }}
        </button>
      </div>
      <p v-if="S.pledges.length" class="yay">🌍 {{ S.pledges.length }} green {{ S.pledges.length === 1 ? 'promise' : 'promises' }}! They’ll go on your certificate.</p>
    </div>

    <div class="ai-row center"><button class="ai-btn ai-btn--green" @click="$emit('next')">Next ▶</button></div>

    <TeacherTip text="“AI runs in giant buildings full of computers called data centres. In 2024 they used about 1.5% of all the world’s electricity (IEA, 2025). So: switch off screens, share a tablet, and use AI only when it helps!”" />
  </section>
</template>

<style scoped>
.dc { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 16px; align-items: center; }
@media (max-width: 760px) { .dc { grid-template-columns: 1fr; } }
.dc__art { width: 100%; height: auto; }
.blink { animation: blink 0.8s steps(2) infinite; }
@keyframes blink { 50% { opacity: 0.2; } }
.dc__text { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
.dc__text h3 { font-size: 24px; }
.dc__text p { font-size: 18px; }
.pledge { display: flex; flex-direction: column; gap: 12px; }
.pledge h3 { font-size: 22px; }
.pledge small { color: var(--ai-ink-soft); font-size: 15px; }
.pledges { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
@media (max-width: 560px) { .pledges { grid-template-columns: 1fr; } }
.pl { border: 0; font: inherit; font-weight: 800; font-size: 17px; text-align: left; cursor: pointer; background: #fff; border-radius: 16px; padding: 12px 14px; display: flex; gap: 10px; align-items: center; box-shadow: inset 0 0 0 3px var(--ai-line), 0 3px 0 var(--ai-line); transition: transform 0.12s; }
.pl:hover { transform: translateY(-2px); }
.pl.on { background: #effbf5; box-shadow: inset 0 0 0 3px var(--ai-green), 0 3px 0 #17895a; }
.pl__box { width: 26px; height: 26px; border-radius: 8px; background: #f0f5fd; display: grid; place-items: center; color: #fff; flex: none; }
.pl.on .pl__box { background: var(--ai-green); }
.pl__e { font-size: 24px; }
.yay { font-weight: 800; color: var(--ai-green); }
.center { justify-content: center; }
</style>
