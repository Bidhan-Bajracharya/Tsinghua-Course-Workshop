<script setup>
import { ref, computed } from 'vue'
import BeepSay from '../components/BeepSay.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { QR_CHOICES, SAFE_CARDS } from '../data/content'
import { useLessonState } from '../state'

defineEmits(['next'])
const S = useLessonState()
const qr = ref(null)
const qrChoice = computed(() => QR_CHOICES.find((c) => c.k === qr.value))
const ci = ref(0)
const answer = ref(null) // { ok }
const finished = ref(false)
const card = computed(() => SAFE_CARDS[ci.value])

function judge(safe) {
  if (answer.value?.ok) return
  answer.value = { ok: safe === card.value.safe, safe }
}
function nextCard() {
  answer.value = null
  if (ci.value < SAFE_CARDS.length - 1) ci.value++
  else {
    finished.value = true
    S.stars++
  }
}
</script>

<template>
  <section class="ai-scene">
    <BeepSay text="My face is my secret key! Let’s practise keeping it safe." />

    <div class="ai-card qr">
      <div class="qr__scene" aria-hidden="true">
        <span class="qr__who">🧑‍💼</span>
        <span class="qr__code">▦</span>
        <span class="qr__gift">🎁</span>
      </div>
      <div class="qr__body">
        <h3>At the subway station, someone says: <i>“Scan this QR code and get a free gift!”</i> What should you do?</h3>
        <div class="choices">
          <button v-for="c in QR_CHOICES" :key="c.k" class="choice" :class="[qr === c.k ? c.tone : '', { on: qr === c.k }]" @click="qr = c.k">
            <span class="choice__e">{{ c.e }}</span>{{ c.l }}
          </button>
        </div>
        <p v-if="qrChoice" class="res" :class="qrChoice.tone">{{ qrChoice.res }}</p>
      </div>
    </div>

    <div v-if="qr" class="ai-card sorter">
      <h3>Safe or risky? <small>({{ Math.min(ci + 1, SAFE_CARDS.length) }} / {{ SAFE_CARDS.length }})</small></h3>
      <template v-if="!finished">
        <Transition name="swap" mode="out-in">
          <p :key="ci" class="scard">{{ card.q }}</p>
        </Transition>
        <div class="ai-row center">
          <button class="big-btn safe" :disabled="answer?.ok" @click="judge(true)">👍 Safe</button>
          <button class="big-btn risky" :disabled="answer?.ok" @click="judge(false)">⚠️ Risky</button>
        </div>
        <p v-if="answer" class="res" :class="answer.ok ? 'good' : 'bad'">
          <template v-if="answer.ok"><b>{{ card.safe ? 'Safe!' : 'Risky!' }}</b> {{ card.why }}</template>
          <template v-else><b>Think again:</b> Who will see the face? Did they say yes?</template>
        </p>
        <button v-if="answer?.ok" class="ai-btn ai-btn--primary" @click="nextCard">{{ ci < SAFE_CARDS.length - 1 ? 'Next ▶' : 'Finish ▶' }}</button>
      </template>
      <template v-else>
        <p class="won">🔑 ⭐ You keep faces safe! Say no, walk away and tell a grown-up when something feels risky.</p>
        <button class="ai-btn ai-btn--green" @click="$emit('next')">Next ▶</button>
      </template>
    </div>

    <TeacherTip text="The QR scene comes from the textbook. Ask: “Why could scanning be risky?” (It might collect your photo or personal information.) For the cards, do a thumbs vote: up = safe, down = risky. Then reveal." />
  </section>
</template>

<style scoped>
.qr { display: grid; grid-template-columns: 180px 1fr; gap: 16px; align-items: center; }
@media (max-width: 640px) { .qr { grid-template-columns: 1fr; } }
.qr__scene { position: relative; height: 150px; background: linear-gradient(#eef6ff 70%, #d3dcec 70%); border-radius: 16px; }
.qr__who { position: absolute; left: 16px; bottom: 30px; font-size: 64px; }
.qr__code { position: absolute; right: 30px; top: 22px; font-size: 54px; background: #fff; border-radius: 8px; line-height: 1; padding: 2px 6px; animation: wob 1.4s ease-in-out infinite; }
.qr__gift { position: absolute; right: 18px; bottom: 18px; font-size: 38px; }
@keyframes wob { 50% { transform: rotate(-8deg); } }
.qr__body { display: flex; flex-direction: column; gap: 10px; }
.qr__body h3 { font-size: 21px; }
.choices { display: grid; gap: 8px; }
.choice { border: 0; font: inherit; font-weight: 800; font-size: 17px; text-align: left; cursor: pointer; background: #fff; border-radius: 14px; padding: 10px 14px; display: flex; gap: 10px; align-items: center; box-shadow: inset 0 0 0 2px var(--ai-line); }
.choice__e { font-size: 26px; }
.choice.on.good { background: #e3f8ee; box-shadow: inset 0 0 0 3px var(--ai-green); }
.choice.on.bad { background: #ffe6ec; box-shadow: inset 0 0 0 3px var(--ai-red); }
.res { border-radius: 14px; padding: 10px 14px; font-weight: 700; font-size: 18px; }
.res.good { background: #e3f8ee; color: #137a4f; }
.res.bad { background: #ffe6ec; color: #b8264a; }
.sorter { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
.sorter h3 { font-size: 24px; }
.sorter small { color: var(--ai-ink-soft); font-size: 16px; }
.scard { font-family: var(--ai-font-head); font-weight: 700; font-size: clamp(20px, 2.8vw, 26px); background: #fff8e1; border-radius: 18px; padding: 16px 20px; max-width: 640px; }
.big-btn { border: 0; border-radius: 18px; padding: 14px 28px; cursor: pointer; color: #fff; font-family: var(--ai-font-head); font-weight: 800; font-size: 22px; transition: transform 0.12s; }
.big-btn:hover:not(:disabled) { transform: translateY(-2px); }
.big-btn:disabled { opacity: 0.5; cursor: default; }
.safe { background: var(--ai-green); box-shadow: 0 5px 0 #17895a; }
.risky { background: var(--ai-red); box-shadow: 0 5px 0 #b8264a; }
.won { font-weight: 800; font-size: 19px; color: var(--ai-green); max-width: 560px; }
.center { justify-content: center; }
.swap-enter-active, .swap-leave-active { transition: all 0.2s ease; }
.swap-enter-from { opacity: 0; transform: translateX(20px); }
.swap-leave-to { opacity: 0; transform: translateX(-20px); }
</style>
