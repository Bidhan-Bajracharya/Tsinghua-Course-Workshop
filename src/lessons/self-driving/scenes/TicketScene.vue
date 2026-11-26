<script setup>
import { ref } from 'vue'
import LumiSay from '../components/LumiSay.vue'
import LumiCar from '../../../shared/mascots/LumiCar.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { VOTE } from '../data/content'

defineEmits(['next'])
const vote = ref(null)
</script>

<template>
  <section class="ai-scene">
    <LumiSay text="True story! Who should get the ticket? You decide." />

    <div class="comic">
      <div class="frame">
        <span class="ct">1 · Night. Lights OFF!</span>
        <svg viewBox="0 0 220 150" aria-hidden="true">
          <rect width="220" height="150" fill="#101a36" /><circle cx="185" cy="28" r="12" fill="#f5e6a8" />
          <rect y="110" width="220" height="40" fill="#2a3552" />
          <g opacity=".7"><LumiCar :x="40" :y="68" :width="120" /></g>
        </svg>
      </div>
      <div class="frame">
        <span class="ct">2 · Police stop it</span>
        <svg viewBox="0 0 220 150" aria-hidden="true">
          <rect width="220" height="150" fill="#101a36" /><rect y="110" width="220" height="40" fill="#2a3552" />
          <g opacity=".7"><LumiCar :x="110" :y="72" :width="100" /></g>
          <g transform="translate(10 76)">
            <rect x="0" y="16" width="90" height="26" rx="10" fill="#f3f8ff" /><rect x="18" y="2" width="52" height="18" rx="6" fill="#f3f8ff" />
            <rect x="26" y="-6" width="16" height="8" rx="2" fill="#ef476f" class="siren" /><rect x="44" y="-6" width="16" height="8" rx="2" fill="#2f7cf6" class="siren siren--2" />
            <circle cx="20" cy="44" r="9" fill="#1d2b4f" /><circle cx="70" cy="44" r="9" fill="#1d2b4f" />
            <text x="24" y="35" font-weight="800" font-size="11" fill="#1d2b4f">POLICE</text>
          </g>
        </svg>
      </div>
      <div class="frame">
        <span class="ct">3 · Nobody inside?!</span>
        <svg viewBox="0 0 220 150" aria-hidden="true">
          <rect width="220" height="150" fill="#101a36" />
          <rect x="20" y="40" width="130" height="80" rx="14" fill="#2f7cf6" /><rect x="34" y="52" width="102" height="54" rx="10" fill="#1d2b4f" />
          <path d="M60 106 v-30 h40 v30" fill="#3a4a6b" />
          <g transform="translate(160 48)"><circle cx="16" cy="10" r="10" fill="#e8c39e" /><rect x="2" y="0" width="28" height="7" rx="2" fill="#1e2a5a" /><rect x="2" y="22" width="28" height="50" rx="8" fill="#1e2a5a" /></g>
          <text x="178" y="36" font-weight="800" font-size="34" fill="#ffd166" class="q">?</text>
        </svg>
      </div>
    </div>

    <div class="vote">
      <button v-for="(v, i) in VOTE" :key="v.l" class="vb" :class="{ on: vote === i }" :aria-pressed="vote === i" @click="vote = i">
        <span class="vb__e">{{ v.e }}</span>{{ v.l }}
      </button>
    </div>

    <Transition name="pop">
      <div v-if="vote !== null" class="ai-card answer">
        <p>No easy answer! That’s a <b>legal risk</b>. 🗣️ Tell a partner <b>why</b> you chose “{{ VOTE[vote].l }}”.</p>
      </div>
    </Transition>

    <TeacherTip text="This really happened in 2022 with a driverless taxi. There is no single right answer. Ask students to give a reason, then listen to someone who chose differently." />
  </section>
</template>

<style scoped>
.comic { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
@media (max-width: 600px) { .comic { grid-template-columns: 1fr; } }
.frame { position: relative; border-radius: 18px; overflow: hidden; background: #101a36; box-shadow: var(--ai-shadow); }
.frame svg { width: 100%; height: auto; }
.ct { position: absolute; left: 8px; top: 8px; background: #fff; border-radius: 10px; padding: 2px 10px; font-family: var(--ai-font-head); font-weight: 800; font-size: 15px; }
.siren { animation: blink 0.6s steps(2) infinite; }
.siren--2 { animation-delay: 0.3s; }
@keyframes blink { 50% { opacity: 0.2; } }
.q { animation: bounce 1s ease-in-out infinite; }
@keyframes bounce { 50% { transform: translateY(-4px); } }

.vote { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
@media (max-width: 600px) { .vote { grid-template-columns: repeat(2, 1fr); } }
.vb {
  border: 0; font: inherit; font-family: var(--ai-font-head); font-weight: 800; font-size: 17px; color: var(--ai-ink); cursor: pointer;
  background: #fff; border-radius: 18px; padding: 12px 6px; display: flex; flex-direction: column; align-items: center; gap: 4px;
  box-shadow: inset 0 0 0 3px var(--ai-line), 0 4px 0 var(--ai-line); transition: transform 0.12s;
}
.vb:hover { transform: translateY(-2px); }
.vb.on { background: #fff4d6; box-shadow: inset 0 0 0 3px var(--ai-accent), 0 4px 0 #d99a00; }
.vb__e { font-size: 38px; line-height: 1; }
.answer { text-align: center; font-size: 20px; background: #f3efff; }
.pop-enter-active { transition: all 0.3s ease; }
.pop-enter-from { opacity: 0; transform: scale(0.95); }
</style>
