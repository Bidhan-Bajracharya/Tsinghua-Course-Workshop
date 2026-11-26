<script setup>
import { ref, computed } from 'vue'
import LumiSay from '../components/LumiSay.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { GUESS } from '../data/content'

defineEmits(['next'])
const gi = ref(0)
const val = ref(GUESS[0].start)
const locked = ref(false)
const g = computed(() => GUESS[gi.value])
const done = computed(() => gi.value >= GUESS.length)
const pct = (x) => ((x - g.value.min) / (g.value.max - g.value.min)) * 100
const off = computed(() => Math.abs(val.value - g.value.ans))

function next() {
  gi.value++
  locked.value = false
  if (!done.value) val.value = g.value.start
}
</script>

<template>
  <section class="ai-scene">
    <template v-if="!done">
      <LumiSay text="Guess first! Slide, then lock it in." />
      <div class="qsign"><span class="qsign__n">Guess {{ gi + 1 }} / {{ GUESS.length }}</span>{{ g.q }}</div>

      <div class="ai-card panel">
        <div class="num">{{ val }}<small> {{ g.unit }}</small></div>
        <input v-model.number="val" type="range" :min="g.min" :max="g.max" step="1" :disabled="locked" aria-label="Your guess" />
        <template v-if="locked">
          <div class="gbar">
            <span class="m you" :style="{ left: pct(val) + '%' }"><b>You: {{ val }}</b></span>
            <span class="m real" :style="{ left: pct(g.ans) + '%' }"><b>Real: {{ g.ans }}</b></span>
          </div>
          <p class="fb" :class="off <= 10 ? 'ok' : 'mid'">
            {{ off <= 3 ? 'WOW, almost exact! 🎯' : off <= 10 ? 'So close! 👏' : `Surprise! The real answer is ${g.ans} ${g.unit}.` }}
          </p>
        </template>
      </div>

      <div class="ai-row center">
        <button v-if="!locked" class="ai-btn ai-btn--accent ai-btn--big" @click="locked = true">Lock it in 🔒</button>
        <button v-else class="ai-btn ai-btn--primary ai-btn--big" @click="next">Next ▶</button>
      </div>
    </template>

    <template v-else>
      <LumiSay text="Two more record breakers!" />
      <div class="facts">
        <div class="ai-card fact"><span class="yr">2005</span><p>Stanley, a robot car from Stanford, wins the DARPA race. 🏆</p></div>
        <div class="ai-card fact"><span class="yr">2024</span><p>Robotaxis with no steering wheel appear. Some cities already ride them!</p></div>
      </div>
      <div class="ai-row center"><button class="ai-btn ai-btn--green" @click="$emit('next')">Next ▶</button></div>
      <TeacherTip text="Other milestones from the textbook: DARPA's ALV project reached 31 km/h in the 1980s. Driverless trucks are also being tested today." />
    </template>
  </section>
</template>

<style scoped>
.qsign {
  position: relative; background: var(--ai-accent); border-radius: 18px; padding: 18px 18px 14px;
  text-align: center; font-family: var(--ai-font-head); font-weight: 800; font-size: clamp(21px, 3.2vw, 30px); line-height: 1.15;
  box-shadow: 0 5px 0 #d99a00;
}
.qsign__n { position: absolute; top: -13px; left: 16px; background: var(--ai-ink); color: #fff; font-size: 14px; border-radius: 999px; padding: 2px 12px; }
.panel { display: flex; flex-direction: column; gap: 10px; padding: 22px; }
.num { font-family: var(--ai-font-head); font-weight: 800; font-size: clamp(56px, 10vw, 96px); text-align: center; line-height: 1; color: var(--ai-primary-dark); font-variant-numeric: tabular-nums; }
.num small { font-size: 0.35em; color: var(--ai-ink-soft); }
input[type='range'] { width: 100%; accent-color: var(--ai-primary); height: 34px; }
.gbar { position: relative; height: 30px; background: #e8eef8; border-radius: 999px; margin: 30px 0 34px; }
.m { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 18px; height: 40px; border-radius: 6px; }
.m b { position: absolute; left: 50%; transform: translateX(-50%); white-space: nowrap; font-size: 15px; }
.you { background: var(--ai-accent); }
.you b { top: -26px; }
.real { background: var(--ai-green); }
.real b { top: 42px; }
.fb { font-weight: 800; font-size: 20px; text-align: center; border-radius: 16px; padding: 10px 16px; font-family: var(--ai-font-head); }
.fb.ok { background: #e3f8ee; color: #137a4f; }
.fb.mid { background: #fff4d6; color: #7a5600; }
.center { justify-content: center; }
.facts { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 600px) { .facts { grid-template-columns: 1fr; } }
.fact { display: flex; gap: 14px; align-items: center; }
.fact .yr { font-family: var(--ai-font-head); font-weight: 800; font-size: 30px; color: var(--ai-green); }
.fact p { font-weight: 700; font-size: 19px; }
</style>
