<script setup>
import { ref, computed } from 'vue'
import LumiSay from '../components/LumiSay.vue'
import LumiCar from '../../../shared/mascots/LumiCar.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { ERAS, WHO } from '../data/content'

defineEmits(['next'])
const ei = ref(0)
const right = ref(0)
const picked = ref(null)
const era = computed(() => ERAS[ei.value])
const done = computed(() => ei.value >= ERAS.length)

function pick(k) {
  if (picked.value) return
  picked.value = k
  if (k === era.value.a) right.value++
}
function nextEra() {
  picked.value = null
  ei.value++
}
function restart() {
  ei.value = 0
  right.value = 0
  picked.value = null
}
</script>

<template>
  <section class="ai-scene">
    <template v-if="!done">
      <LumiSay text="Predict first! Who is in control of this car?" />

      <div class="eras">
        <span v-for="(x, k) in ERAS" :key="x.y" class="era" :class="{ on: k === ei, ok: k < ei }">{{ x.y }}</span>
      </div>

      <Transition name="fade" mode="out-in">
        <div :key="ei" class="ai-card scene-card">
          <svg viewBox="0 0 640 260" class="scene" role="img" :aria-label="`A car in ${era.y}`">
            <rect width="640" height="260" fill="#dff0ff" />
            <rect y="196" width="640" height="64" :fill="ei === 0 ? '#c9ad83' : '#3a4a6b'" />
            <template v-if="ei === 0">
              <use href="#sd-car1925" x="340" y="80" width="190" height="123" />
              <use href="#sd-car1925" x="40" y="104" width="140" height="90" />
              <use href="#sd-person" x="88" y="96" width="16" height="34" />
              <g fill="none" stroke="#ef476f" stroke-width="4" stroke-linecap="round" class="radio">
                <path d="M200 110 q20-20 40 0" /><path d="M190 96 q40-36 80 0" /><path d="M180 82 q60-50 120 0" opacity=".6" />
              </g>
            </template>
            <template v-else-if="ei === 1">
              <rect x="0" y="212" width="640" height="10" fill="#ffd166" class="cable" />
              <use href="#sd-car1960" x="220" y="110" width="190" height="111" />
              <text x="320" y="248" text-anchor="middle" font-weight="800" font-size="16" fill="#ffd166">↑ MAGNETIC CABLE ↑</text>
            </template>
            <template v-else>
              <g transform="translate(230 92)">
                <circle class="ping" cx="85" cy="10" r="110" fill="none" stroke="#00c2e0" stroke-width="3" />
                <circle class="ping ping--2" cx="85" cy="10" r="110" fill="none" stroke="#00c2e0" stroke-width="3" />
                <LumiCar :width="175" />
              </g>
            </template>
          </svg>
        </div>
      </Transition>

      <div class="who">
        <button
          v-for="w in WHO"
          :key="w.k"
          class="whob"
          :class="{ right: picked && w.k === era.a, wrong: picked === w.k && w.k !== era.a }"
          :disabled="!!picked"
          @click="pick(w.k)"
        >
          <span class="whob__e">{{ w.e }}</span>{{ w.l }}
        </button>
      </div>

      <div v-if="picked" class="fb" :class="picked === era.a ? 'ok' : 'mid'">
        <b>{{ picked === era.a ? 'Good prediction! ' : 'Surprise! ' }}</b>{{ era.c }}
      </div>
      <div v-if="picked" class="ai-row center">
        <button class="ai-btn ai-btn--primary" @click="nextEra">{{ ei < ERAS.length - 1 ? 'Next year ▶' : 'See result ▶' }}</button>
      </div>
    </template>

    <template v-else>
      <LumiSay text="Big idea: early cars could NOT think." />
      <div class="ai-card result">
        <div class="targets">{{ '🎯'.repeat(right) || '🤔' }}</div>
        <h2>You predicted {{ right }} of 3!</h2>
        <p>A person or the road was in control. Only today’s cars use AI.</p>
        <div class="ai-row center">
          <button class="ai-btn" @click="restart">🔁 Try again</button>
          <button class="ai-btn ai-btn--green" @click="$emit('next')">Next ▶</button>
        </div>
      </div>
      <TeacherTip text="Predicting first makes students commit to an idea, then check it against evidence. Ask the class who changed their mind and why." />
    </template>
  </section>
</template>

<style scoped>
.eras { display: flex; justify-content: center; gap: 8px; }
.era { font-family: var(--ai-font-head); font-weight: 800; border-radius: 999px; padding: 4px 16px; background: #fff; color: var(--ai-ink-soft); box-shadow: inset 0 0 0 2px var(--ai-line); }
.era.on { background: var(--ai-primary); color: #fff; box-shadow: none; }
.era.ok { background: var(--ai-green); color: #fff; box-shadow: none; }
.scene-card { padding: 10px; }
.scene { width: 100%; height: auto; border-radius: 14px; }
.radio path { animation: radio 1.4s ease-in-out infinite; }
.radio path:nth-child(2) { animation-delay: 0.2s; }
.radio path:nth-child(3) { animation-delay: 0.4s; }
@keyframes radio { 50% { opacity: 0.2; } }
.cable { animation: blink 1.4s ease-in-out infinite; }
@keyframes blink { 50% { opacity: 0.3; } }
.ping { transform-box: fill-box; transform-origin: center; animation: ping 1.8s ease-out infinite; }
.ping--2 { animation-delay: 0.9s; }
@keyframes ping { from { transform: scale(0.2); opacity: 0.9; } to { transform: scale(1); opacity: 0; } }

.who { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.whob {
  border: 0; font: inherit; font-family: var(--ai-font-head); font-weight: 800; font-size: 19px; color: var(--ai-ink);
  background: #fff; border-radius: 18px; padding: 12px 6px; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  box-shadow: inset 0 0 0 3px var(--ai-line), 0 4px 0 var(--ai-line); transition: transform 0.12s;
}
.whob:hover:not(:disabled) { transform: translateY(-2px); }
.whob:disabled { cursor: default; }
.whob__e { font-size: 42px; line-height: 1; }
.whob.right { background: #e3f8ee; box-shadow: inset 0 0 0 3px var(--ai-green), 0 4px 0 #17895a; }
.whob.wrong { background: #ffe6ec; box-shadow: inset 0 0 0 3px var(--ai-red), 0 4px 0 #b8264a; }

.fb { font-weight: 700; font-size: 20px; text-align: center; border-radius: 16px; padding: 12px 16px; }
.fb.ok { background: #e3f8ee; color: #137a4f; }
.fb.mid { background: #fff4d6; color: #7a5600; }
.center { justify-content: center; }

.result { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; }
.targets { font-size: 48px; }
.result h2 { font-size: clamp(26px, 3.6vw, 34px); }
.result p { color: var(--ai-ink-soft); font-size: 20px; font-weight: 700; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
