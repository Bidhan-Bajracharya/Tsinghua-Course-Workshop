<script setup>
import { ref, reactive, computed } from 'vue'
import LumiSay from '../components/LumiSay.vue'
import Icon from '../components/Icon.vue'
import LumiCar from '../../../shared/mascots/LumiCar.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { WEATHER } from '../data/content'

defineEmits(['next'])
const sel = ref(0)
const tried = reactive(new Set([0]))
const w = computed(() => WEATHER[sel.value])
const names = ['Camera', 'Radar', 'Lidar']
const colorFor = (v) => (v >= 75 ? 'var(--ai-green)' : v >= 45 ? 'var(--ai-accent)' : 'var(--ai-red)')
const faceFor = (v) => (v >= 75 ? '😎' : v >= 45 ? '😐' : '😵')
function choose(i) {
  sel.value = i
  tried.add(i)
}
</script>

<template>
  <section class="ai-scene">
    <LumiSay text="Change the weather. Which sensor can still see?" />

    <div class="ai-card stage">
      <svg viewBox="0 0 600 240" class="scene" role="img" :aria-label="`Road in ${w.l} weather`">
        <rect width="600" height="240" fill="#dff0ff" />
        <rect y="170" width="600" height="70" fill="#3a4a6b" />
        <line x1="0" y1="212" x2="600" y2="212" stroke="#ffd166" stroke-width="5" stroke-dasharray="26 20" />
        <g transform="translate(480 84)">
          <rect x="-3" y="20" width="6" height="74" fill="#7d8aa6" />
          <polygon points="-22,-9 -9,-22 9,-22 22,-9 22,9 9,22 -9,22 -22,9" fill="#ef476f" stroke="#fff" stroke-width="3" />
          <text y="5" font-weight="800" font-size="11" fill="#fff" text-anchor="middle">STOP</text>
        </g>
        <use href="#sd-person" x="400" y="134" width="22" height="48" />
        <LumiCar :x="20" :y="138" :width="140" />
        <g class="ov rain" :style="{ opacity: w.ov[0] }" stroke="#5e7fa8" stroke-width="2.5" stroke-linecap="round">
          <path d="M40 10l-8 22M110 30l-8 22M180 0l-8 22M250 40l-8 22M320 12l-8 22M390 36l-8 22M460 6l-8 22M530 30l-8 22M80 80l-8 22M150 110l-8 22M220 70l-8 22M290 100l-8 22M360 84l-8 22M430 120l-8 22M500 76l-8 22M570 104l-8 22M60 150l-8 22M200 140l-8 22M340 160l-8 22M480 150l-8 22" />
        </g>
        <rect class="ov" width="600" height="240" fill="#eef1f4" :style="{ opacity: w.ov[1] }" />
        <rect class="ov" width="600" height="240" fill="#0d1530" :style="{ opacity: w.ov[2] }" />
        <path class="ov" d="M152 182 L340 158 L340 212 Z" fill="#ffe58a" :style="{ opacity: w.ov[3] }" />
      </svg>
    </div>

    <div class="wx">
      <button v-for="(x, i) in WEATHER" :key="x.k" class="wxb" :class="{ on: sel === i }" :aria-pressed="sel === i" @click="choose(i)">
        <Icon :name="x.i" />{{ x.l }}
      </button>
    </div>

    <div class="meters">
      <div v-for="(n, j) in names" :key="n" class="ai-card meter">
        <span class="meter__face">{{ faceFor(w.v[j]) }}</span>
        <span class="meter__n">{{ n }}</span>
        <div class="ai-meter"><div class="ai-meter__fill" :style="{ width: w.v[j] + '%', background: colorFor(w.v[j]) }"></div></div>
      </div>
    </div>

    <p class="cap">
      {{ w.m }}
      <template v-if="tried.size === WEATHER.length"><br /><b class="big">👉 No sensor is perfect, so I use them all!</b></template>
    </p>

    <TeacherTip text="Key message: no single sensor is perfect, so cars combine several. Bad weather is a technical risk." />
  </section>
</template>

<style scoped>
.stage { padding: 12px; }
.scene { width: 100%; height: auto; border-radius: 14px; }
.ov { transition: opacity 0.5s; }
.rain { animation: fall 0.5s linear infinite; }
@keyframes fall { to { transform: translate(-4px, 12px); } }
.wx { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
.wxb {
  border: 0; font: inherit; font-family: var(--ai-font-head); font-weight: 800; font-size: 17px; color: var(--ai-ink); cursor: pointer;
  background: #fff; border-radius: 18px; padding: 10px 4px; display: flex; flex-direction: column; align-items: center; gap: 4px;
  box-shadow: inset 0 0 0 3px var(--ai-line), 0 4px 0 var(--ai-line); transition: transform 0.12s;
}
.wxb:hover { transform: translateY(-2px); }
.wxb.on { background: #fff4d6; box-shadow: inset 0 0 0 3px var(--ai-accent), 0 4px 0 #d99a00; }
.wxb :deep(svg) { width: 46px; height: 46px; }
.meters { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.meter { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px; }
.meter__face { font-size: 34px; line-height: 1; }
.meter__n { font-family: var(--ai-font-head); font-weight: 800; font-size: 17px; }
.meter .ai-meter { width: 100%; }
.cap { text-align: center; font-family: var(--ai-font-head); font-weight: 700; font-size: clamp(19px, 2.6vw, 24px); }
.big { color: var(--ai-green); }
</style>
