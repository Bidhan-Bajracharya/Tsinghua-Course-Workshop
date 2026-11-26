<script setup>
import { ref } from 'vue'
import BeepSay from '../components/BeepSay.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { RAIL_FACTS, RACERS, RACE_KM } from '../data/content'

defineEmits(['next'])
const racing = ref(false)
const finished = ref(false)
const fastest = Math.max(...RACERS.map((r) => r.kmh))
const DURATION = 4 // seconds for the train to arrive

const hoursText = (kmh) => {
  const mins = Math.round((RACE_KM / kmh) * 60)
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `${h} h ${m} min` : `${h} hours`
}
function race() {
  finished.value = false
  racing.value = false
  requestAnimationFrame(() => {
    racing.value = true
    setTimeout(() => (finished.value = true), DURATION * 1000 + 100)
  })
}
</script>

<template>
  <section class="ai-scene">
    <BeepSay text="History corner: China’s super-fast trains!" />

    <div class="facts">
      <div v-for="f in RAIL_FACTS" :key="f.big" class="ai-card fact">
        <span class="fact__icon">{{ f.icon }}</span>
        <b>{{ f.big }}</b>
        <p>{{ f.text }}</p>
      </div>
    </div>

    <div class="ai-card racecard">
      <div class="race__head">
        <h3>🏁 Race from Beijing to Tianjin ({{ RACE_KM }} km)</h3>
        <button class="ai-btn ai-btn--accent" @click="race">{{ finished ? '🔁 Race again' : '▶ Start the race' }}</button>
      </div>
      <div v-for="r in RACERS" :key="r.k" class="lane">
        <span class="lane__name">{{ r.l }}</span>
        <div class="track">
          <span
            class="runner"
            :style="{
              left: racing ? `calc(${Math.min(1, (r.kmh / fastest)) * 100}% - 34px)` : '0%',
              transitionDuration: racing ? DURATION + 's' : '0s',
            }"
          >{{ r.e }}</span>
          <span class="flag">🏁</span>
        </div>
        <span class="lane__time" :class="{ show: finished }">{{ hoursText(r.kmh) }}</span>
      </div>
      <p v-if="finished" class="result">🚄 The train gets there while the walker has only just left. That’s why high-speed rail is so useful!</p>
    </div>

    <div class="ai-row center"><button class="ai-btn ai-btn--green" @click="$emit('next')">Next ▶</button></div>

    <TeacherTip text="The race shows how far each one gets while the train finishes. Ask: “How does a fast train help families, tourists and deliveries?” Fun fact: 40,000 km is about the distance around the Earth." />
  </section>
</template>

<style scoped>
.facts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
@media (max-width: 820px) { .facts { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.fact { display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
.fact__icon { font-size: 36px; line-height: 1; }
.fact b { font-family: var(--ai-font-head); font-size: 24px; color: #d9691f; }
.fact p { font-size: 15px; color: var(--ai-ink-soft); font-weight: 700; }
.racecard { display: flex; flex-direction: column; gap: 10px; }
.race__head { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
.race__head h3 { font-size: 22px; }
.lane { display: grid; grid-template-columns: 130px 1fr 90px; gap: 10px; align-items: center; }
@media (max-width: 560px) { .lane { grid-template-columns: 80px 1fr 70px; } .lane__name { font-size: 13px; } }
.lane__name { font-weight: 800; }
.track { position: relative; height: 44px; border-radius: 999px; background: repeating-linear-gradient(90deg, #eef2f8 0 30px, #e4eaf3 30px 60px); }
.runner { position: absolute; top: 2px; font-size: 34px; line-height: 40px; transition-property: left; transition-timing-function: linear; transform: scaleX(-1); }
.flag { position: absolute; right: 6px; top: 6px; font-size: 24px; }
.lane__time { font-family: var(--ai-font-head); font-weight: 800; opacity: 0; transition: opacity 0.3s; }
.lane__time.show { opacity: 1; }
.result { background: #effbf5; border-radius: 14px; padding: 10px 14px; font-weight: 700; }
.center { justify-content: center; }
</style>
