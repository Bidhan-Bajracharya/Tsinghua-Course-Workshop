<script setup>
import { reactive, computed } from 'vue'
import LumiSay from '../components/LumiSay.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { MODES, GROUPS } from '../data/content'

defineEmits(['next'])
const pick = reactive({})
const MAXE = GROUPS.reduce((a, g) => a + g.d * 8, 0)

const energy = computed(() => GROUPS.reduce((e, g) => {
  const m = MODES.find((x) => x.k === pick[g.k])
  return m ? e + m.en * g.d : e
}, 0))
const cars = computed(() => GROUPS.reduce((c, g) => {
  const m = MODES.find((x) => x.k === pick[g.k])
  return m ? c + m.cars : c
}, 0))
const bus = computed(() => Object.values(pick).includes('bus'))
const vehicles = computed(() => {
  const v = []
  GROUPS.forEach((g) => {
    const k = pick[g.k]
    if (k === 'walk') v.push('🚶', '🚶', '🚶', '🚶')
    else if (k === 'bike') v.push('🚲', '🚲', '🚲', '🚲')
    else if (k === 'robo') v.push('🚐')
    else if (k === 'car') v.push('🚗', '🚗', '🚗', '🚗')
  })
  if (bus.value) v.push('🚌')
  return v
})
const complete = computed(() => Object.keys(pick).length === GROUPS.length)
const eColor = computed(() => (energy.value <= 15 ? 'var(--ai-green)' : energy.value <= 40 ? 'var(--ai-accent)' : 'var(--ai-red)'))
const cColor = computed(() => (cars.value <= 2 ? 'var(--ai-green)' : cars.value <= 5 ? 'var(--ai-accent)' : 'var(--ai-red)'))
const verdict = computed(() =>
  energy.value <= 15 ? '🌱 Super green plan!' : energy.value <= 40 ? '🙂 Pretty green!' : '🔥 Lots of energy. Can you share more?',
)
</script>

<template>
  <section class="ai-scene">
    <LumiSay text="12 kids need to get to school. You plan the trip!" />

    <div class="street" aria-live="polite">
      <TransitionGroup name="veh">
        <span v-for="(v, i) in vehicles" :key="`${v}-${i}`" class="veh">{{ v }}</span>
      </TransitionGroup>
      <span v-if="!vehicles.length" class="empty">Choose how each group travels 👇</span>
    </div>

    <div class="groups">
      <div v-for="g in GROUPS" :key="g.k" class="ai-card grp">
        <div class="who"><span class="who__e">{{ g.e }}</span>{{ g.l }}</div>
        <div class="modes">
          <button
            v-for="m in MODES"
            :key="m.k"
            class="mode"
            :class="{ on: pick[g.k] === m.k }"
            :aria-pressed="pick[g.k] === m.k"
            :disabled="g.d > m.max"
            :title="g.d > m.max ? 'Too far!' : m.l"
            @click="pick[g.k] = m.k"
          >
            <span class="mode__e">{{ m.e }}</span>{{ m.l }}
          </button>
        </div>
      </div>
    </div>

    <div class="gmeters">
      <div class="ai-card gm">
        <div class="gm__t"><span>⚡ Energy used</span><b>{{ Math.round(energy) }}</b></div>
        <div class="ai-meter"><div class="ai-meter__fill" :style="{ width: (energy / MAXE) * 100 + '%', background: eColor }"></div></div>
      </div>
      <div class="ai-card gm">
        <div class="gm__t"><span>🚦 Cars on the road</span><b>{{ cars }}{{ bus ? ' + 🚌' : '' }}</b></div>
        <div class="ai-meter"><div class="ai-meter__fill" :style="{ width: (cars / 12) * 100 + '%', background: cColor }"></div></div>
      </div>
    </div>

    <Transition name="pop">
      <div v-if="complete" class="ai-card result">
        <h3>{{ verdict }}</h3>
        <p>Shared rides and walking beat everyone driving alone.</p>
      </div>
    </Transition>

    <TeacherTip text="There is more than one good plan. Ask: Is walking safe for little kids? What if it rains? Why might a far-away family choose a shared robotaxi over a bus?" />
  </section>
</template>

<style scoped>
.street {
  min-height: 96px; border-radius: 20px; padding: 14px 16px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  font-size: 36px; line-height: 1; background-color: #3a4a6b;
  background-image: linear-gradient(transparent calc(50% - 2px), #ffd166 calc(50% - 2px), #ffd166 calc(50% + 2px), transparent calc(50% + 2px));
  box-shadow: var(--ai-shadow);
}
.veh { display: inline-block; }
.empty { font-size: 17px; color: #fff; font-weight: 800; background: #3a4a6b; padding: 2px 10px; border-radius: 8px; }
.veh-enter-active { transition: all 0.35s ease; }
.veh-enter-from { opacity: 0; transform: translateX(-30px); }

.groups { display: flex; flex-direction: column; gap: 10px; }
.grp { display: grid; grid-template-columns: 160px 1fr; gap: 10px; align-items: center; padding: 12px 14px; }
@media (max-width: 640px) { .grp { grid-template-columns: 1fr; } }
.who { font-family: var(--ai-font-head); font-weight: 800; font-size: 17px; display: flex; align-items: center; gap: 8px; }
.who__e { font-size: 30px; }
.modes { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; }
.mode {
  border: 0; font: inherit; font-family: var(--ai-font-head); font-weight: 700; font-size: 13px; color: var(--ai-ink); cursor: pointer;
  background: #f5f9ff; border-radius: 14px; padding: 6px 2px; display: flex; flex-direction: column; align-items: center; gap: 2px;
  box-shadow: inset 0 0 0 2px var(--ai-line); transition: transform 0.12s;
}
.mode:hover:not(:disabled) { transform: translateY(-2px); }
.mode.on { background: #fff4d6; box-shadow: inset 0 0 0 3px var(--ai-accent); }
.mode:disabled { opacity: 0.3; cursor: not-allowed; }
.mode__e { font-size: 26px; line-height: 1; }

.gmeters { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (max-width: 600px) { .gmeters { grid-template-columns: 1fr; } }
.gm { display: flex; flex-direction: column; gap: 8px; padding: 12px 16px; }
.gm__t { display: flex; justify-content: space-between; font-family: var(--ai-font-head); font-weight: 800; font-size: 17px; }
.result { text-align: center; background: #effbf5; }
.result h3 { font-size: 26px; }
.result p { color: var(--ai-ink-soft); font-weight: 700; }
.pop-enter-active { transition: all 0.3s ease; }
.pop-enter-from { opacity: 0; transform: scale(0.95); }
</style>
