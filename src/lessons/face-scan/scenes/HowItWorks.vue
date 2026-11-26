<script setup>
import { ref } from 'vue'
import BeepSay from '../components/BeepSay.vue'
import FaceArt from '../components/FaceArt.vue'
import PredictVote from '../components/PredictVote.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { FIRST_STEP } from '../data/content'

defineEmits(['next'])
const voted = ref(false)
const step = ref(0) // 0 look, 1 measure, 2 match
const me = { w: 60, h: 74, eg: 24, es: 7, nl: 20, mw: 22, sk: '#c98c5e', hc: '#111111', hair: 2, glasses: false, hat: false }
const code = [me.eg, me.nl, me.mw]
const STEPS = [
  { icon: '👀', t: 'Look', d: 'A camera takes a picture and finds the face in it.' },
  { icon: '📏', t: 'Measure', d: 'The computer puts dots on the eyes, nose and mouth and measures the gaps. These numbers are your face code.' },
  { icon: '✅', t: 'Match', d: 'It compares your face code with your ID card photo. Same? Green light! Not the same? Red light.' },
]
</script>

<template>
  <section class="ai-scene">
    <BeepSay text="How does the gate know it’s you? Let’s find out!" />

    <PredictVote
      question="What does the computer do FIRST?"
      :options="FIRST_STEP"
      reveal="It looks at your face with a camera. Then it measures and matches."
      vote-hint="Vote 1, 2 or 3 fingers, then tap!"
      @done="voted = true"
    />

    <template v-if="voted">
      <div class="steps">
        <button v-for="(s, i) in STEPS" :key="s.t" class="stepbtn" :class="{ on: step === i, seen: step > i }" @click="step = i">
          <span class="stepbtn__n">{{ i + 1 }}</span>{{ s.icon }} {{ s.t }}
        </button>
      </div>

      <div class="ai-card show">
        <div class="viz">
          <div class="cam" :class="`st${step}`">
            <span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
            <FaceArt :p="me" :dots="step >= 1" />
            <span v-if="step === 0" class="flash"></span>
          </div>
          <div v-if="step >= 1" class="code">
            <div class="bar"><span>👀 Eyes</span><i :style="{ width: (me.eg / 32) * 100 + '%', background: '#ff5c8a' }"></i><b>{{ me.eg }}</b></div>
            <div class="bar"><span>👃 Nose</span><i :style="{ width: (me.nl / 28) * 100 + '%', background: '#ffd166' }"></i><b>{{ me.nl }}</b></div>
            <div class="bar"><span>👄 Mouth</span><i :style="{ width: (me.mw / 30) * 100 + '%', background: '#22b573' }"></i><b>{{ me.mw }}</b></div>
            <p class="facecode">Face code: <b>{{ code.join('-') }}</b></p>
          </div>
          <div v-if="step === 2" class="idcard">
            <span class="idcard__h">🪪 ID card</span>
            <p>Face code: <b>{{ code.join('-') }}</b></p>
            <span class="light">🟢 MATCH!</span>
          </div>
        </div>
        <div class="text">
          <h3>{{ STEPS[step].icon }} Step {{ step + 1 }}: {{ STEPS[step].t }}</h3>
          <p>{{ STEPS[step].d }}</p>
          <p v-if="step === 1" class="try">✋ Try it! Touch your two eyes. Now your nose. Now the corners of your smile!</p>
          <button v-if="step < 2" class="ai-btn ai-btn--primary" @click="step++">Next step ▶</button>
          <button v-else class="ai-btn ai-btn--green" @click="$emit('next')">Now YOU be the gate! ▶</button>
        </div>
      </div>
    </template>

    <TeacherTip text="Vote: “What does the computer do first? 1 = look at your face, 2 = listen to your voice, 3 = smell you!” Then click through Look → Measure (do the touch-your-face actions together) → Match." />
  </section>
</template>

<style scoped>
.steps { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
.stepbtn {
  border: 0; font: inherit; font-family: var(--ai-font-head); font-weight: 800; font-size: 18px; cursor: pointer; color: var(--ai-ink-soft);
  background: #fff; border-radius: 999px; padding: 8px 16px 8px 8px; display: flex; align-items: center; gap: 8px; box-shadow: inset 0 0 0 2px var(--ai-line);
}
.stepbtn__n { width: 28px; height: 28px; border-radius: 50%; background: var(--ai-line); color: #fff; display: grid; place-items: center; font-size: 15px; }
.stepbtn.seen { color: var(--ai-green); }
.stepbtn.seen .stepbtn__n { background: var(--ai-green); }
.stepbtn.on { background: #ff8a3d; color: #fff; box-shadow: 0 4px 0 #d9691f; }
.stepbtn.on .stepbtn__n { background: #fff; color: #d9691f; }

.show { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 18px; align-items: center; }
@media (max-width: 760px) { .show { grid-template-columns: 1fr; } }
.viz { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; justify-content: center; }
.cam { position: relative; width: 190px; padding: 14px; }
.corner { position: absolute; width: 26px; height: 26px; border: 5px solid var(--ai-ink); }
.tl { top: 0; left: 0; border-right: 0; border-bottom: 0; border-radius: 8px 0 0 0; }
.tr { top: 0; right: 0; border-left: 0; border-bottom: 0; border-radius: 0 8px 0 0; }
.bl { bottom: 0; left: 0; border-right: 0; border-top: 0; border-radius: 0 0 0 8px; }
.br { bottom: 0; right: 0; border-left: 0; border-top: 0; border-radius: 0 0 8px 0; }
.st2 .corner { border-color: var(--ai-green); }
.flash { position: absolute; inset: 0; background: #fff; border-radius: 12px; animation: flash 1.6s ease-out infinite; }
@keyframes flash { 0% { opacity: 0.9; } 30%, 100% { opacity: 0; } }
.code { display: flex; flex-direction: column; gap: 8px; min-width: 200px; }
.bar { display: grid; grid-template-columns: 74px 1fr 30px; align-items: center; gap: 6px; font-weight: 800; font-size: 14px; }
.bar i { height: 12px; border-radius: 999px; display: block; animation: grow 0.6s ease both; }
@keyframes grow { from { width: 0 !important; } }
.facecode { font-family: var(--ai-font-head); font-size: 18px; background: #fff4d6; border-radius: 10px; padding: 4px 10px; }
.idcard { background: var(--ai-primary); color: #fff; border-radius: 16px; padding: 12px 14px; display: flex; flex-direction: column; gap: 6px; animation: pop 0.4s ease; }
@keyframes pop { from { transform: scale(0.8); opacity: 0; } }
.idcard__h { font-weight: 800; }
.light { background: #fff; color: #17895a; font-weight: 800; border-radius: 999px; padding: 3px 12px; text-align: center; }
.text { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
.text h3 { font-size: 26px; color: #d9691f; }
.text p { font-size: 19px; }
.try { background: #f3efff; border-radius: 14px; padding: 10px 14px; font-weight: 700; }
</style>
