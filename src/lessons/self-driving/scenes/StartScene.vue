<script setup>
import LumiCar from '../../../shared/mascots/LumiCar.vue'
import { FACES } from '../data/content'
import { useLessonState } from '../state'

defineEmits(['next'])
const S = useLessonState()

const stops = [
  { icon: '🏚️', name: 'Past Town' },
  { icon: '🏙️', name: 'Tech City' },
  { icon: '⛰️', name: 'Risk Ridge' },
  { icon: '🌱', name: 'Green Garage' },
  { icon: '🏁', name: 'Finish' },
]
</script>

<template>
  <section class="ai-scene">
    <div class="hero ai-card">
      <svg viewBox="0 0 900 210" class="road" aria-hidden="true">
        <rect width="900" height="210" fill="#dff0ff" />
        <g fill="#bcd6f5"><rect x="40" y="40" width="50" height="90" rx="6" /><rect x="98" y="20" width="40" height="110" rx="6" /><rect x="620" y="50" width="56" height="80" rx="6" /><rect x="686" y="30" width="44" height="100" rx="6" /></g>
        <g fill="#8fd3b4"><circle cx="260" cy="120" r="24" /><circle cx="292" cy="112" r="30" /><circle cx="800" cy="118" r="26" /></g>
        <rect y="130" width="900" height="80" fill="#3a4a6b" />
        <line class="lane" x1="0" y1="170" x2="900" y2="170" stroke="#ffd166" stroke-width="6" />
        <g class="drive">
          <circle class="ping" cx="80" cy="130" r="80" fill="none" stroke="#00e5ff" stroke-width="3" />
          <circle class="ping ping--2" cx="80" cy="130" r="80" fill="none" stroke="#00e5ff" stroke-width="3" />
          <g class="bob"><LumiCar :x="5" :y="86" :width="150" /></g>
        </g>
      </svg>
      <div class="ai-bubble talk">
        Hi, I’m <b>Lumi</b> 👋 — a <b>self-driving car</b>. Nobody drives me! Come on a road trip and find out how I work.
      </div>
    </div>

    <div class="ai-card poll">
      <h2>Would you ride in me?</h2>
      <div class="faces">
        <button
          v-for="f in FACES"
          :key="f.k"
          class="face"
          :class="{ on: S.poll1 === f.k }"
          :aria-pressed="S.poll1 === f.k"
          @click="S.poll1 = f.k"
        >
          <span class="face__e">{{ f.e }}</span>{{ f.l }}
        </button>
      </div>
      <p v-if="S.poll1" class="remember">👍 Remember your answer — I’ll ask again at the end!</p>
    </div>

    <div class="trip">
      <h3>🗺️ Today’s road trip</h3>
      <ol class="stops">
        <li v-for="(s, i) in stops" :key="s.name" class="stop">
          <span class="stop__sign">{{ s.icon }}</span>
          <span class="stop__name">{{ s.name }}</span>
          <span v-if="i < stops.length - 1" class="stop__road" aria-hidden="true"></span>
        </li>
      </ol>
    </div>

    <div class="ai-row go">
      <button class="ai-btn ai-btn--accent ai-btn--big" @click="$emit('next')">Let’s drive! 🚗</button>
    </div>
  </section>
</template>

<style scoped>
.hero { display: flex; flex-direction: column; gap: 16px; background: linear-gradient(180deg, #dff0ff, #fff 75%); }
.road { width: 100%; height: auto; border-radius: 16px; }
.lane { stroke-dasharray: 30 24; animation: lane 0.9s linear infinite; }
@keyframes lane { to { stroke-dashoffset: -54; } }
.drive { animation: drive 7s linear infinite; }
@keyframes drive { from { transform: translateX(-180px); } to { transform: translateX(960px); } }
.ping { transform-box: fill-box; transform-origin: center; animation: ping 1.8s ease-out infinite; }
.ping--2 { animation-delay: 0.9s; }
@keyframes ping { from { transform: scale(0.2); opacity: 0.9; } to { transform: scale(1); opacity: 0; } }
.bob { animation: bob 1.2s ease-in-out infinite; }
@keyframes bob { 50% { transform: translateY(-3px); } }
.talk { font-size: 22px; }

.poll { display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; }
.poll h2 { font-size: clamp(28px, 4.4vw, 40px); }
.faces { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; width: min(560px, 100%); }
.face {
  border: 0; font: inherit; font-family: var(--ai-font-head); font-weight: 800; font-size: 19px; color: var(--ai-ink);
  background: #fff; border-radius: 20px; padding: 14px 8px; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  box-shadow: inset 0 0 0 3px var(--ai-line), 0 4px 0 var(--ai-line); transition: transform 0.12s, background 0.15s;
}
.face:hover { transform: translateY(-2px); }
.face.on { background: #fff4d6; box-shadow: inset 0 0 0 3px var(--ai-accent), 0 4px 0 #d99a00; }
.face__e { font-size: 52px; line-height: 1; }
.remember { font-weight: 800; color: var(--ai-green); }

.trip { display: flex; flex-direction: column; gap: 10px; }
.trip h3 { font-size: 24px; }
.stops { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
.stop { display: flex; align-items: center; gap: 8px; }
.stop__sign {
  width: 46px; height: 46px; display: grid; place-items: center; font-size: 24px;
  background: #fff; border-radius: 50%; box-shadow: inset 0 0 0 3px var(--ai-green);
}
.stop__name { font-weight: 800; }
.stop__road { width: 34px; height: 6px; border-radius: 3px; margin: 0 4px; background: repeating-linear-gradient(90deg, var(--ai-accent) 0 8px, transparent 8px 14px); }
.go { justify-content: center; }
</style>
