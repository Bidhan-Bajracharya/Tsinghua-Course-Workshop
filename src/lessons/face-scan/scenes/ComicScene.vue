<script setup>
import { ref } from 'vue'
import BeepSay from '../components/BeepSay.vue'
import PredictVote from '../components/PredictVote.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'

defineEmits(['next'])
const step = ref(0) // 0: panels 1-2, 1: after vote 1, 2: after vote 2
</script>

<template>
  <section class="ai-scene">
    <BeepSay text="Story time! Meet Mali and her train ticket." />

    <div class="comic">
      <figure class="panel">
        <span class="cap">1 · Long ago…</span>
        <svg viewBox="0 0 240 170" aria-hidden="true">
          <rect width="240" height="170" fill="#dff0ff" />
          <rect y="128" width="240" height="42" fill="#c9ad83" />
          <rect x="120" y="40" width="110" height="70" rx="14" fill="#ef476f" />
          <rect x="132" y="52" width="26" height="22" rx="4" fill="#dff0ff" /><rect x="166" y="52" width="26" height="22" rx="4" fill="#dff0ff" /><rect x="200" y="52" width="22" height="22" rx="4" fill="#dff0ff" />
          <circle cx="145" cy="114" r="9" fill="#1d2b4f" /><circle cx="205" cy="114" r="9" fill="#1d2b4f" />
          <g transform="translate(46 50)">
            <path d="M-4 18 q-14 10 -10 34" stroke="#2b1c14" stroke-width="8" fill="none" stroke-linecap="round" />
            <circle cx="10" cy="18" r="18" fill="#e8b48a" /><path d="M-8 16 q18 -26 36 0 q-4 -12 -18 -14 q-14 2 -18 14z" fill="#2b1c14" />
            <circle cx="4" cy="20" r="2.4" fill="#1d2b4f" /><circle cx="16" cy="20" r="2.4" fill="#1d2b4f" /><path d="M5 27 q5 4 10 0" stroke="#c0443f" stroke-width="2" fill="none" />
            <path d="M-6 36 h32 l8 44 h-48z" fill="#ffb703" />
            <rect x="26" y="40" width="26" height="16" rx="3" fill="#d9b98a" stroke="#9c7b5b" stroke-width="2" transform="rotate(-10 26 40)" />
          </g>
        </svg>
        <figcaption>Mali buys a paper ticket for the train.</figcaption>
      </figure>

      <figure class="panel">
        <span class="cap">2 · Whoosh!</span>
        <svg viewBox="0 0 240 170" aria-hidden="true">
          <rect width="240" height="170" fill="#dff0ff" />
          <rect y="128" width="240" height="42" fill="#c9ad83" />
          <g stroke="#a5b4cf" stroke-width="4" fill="none" stroke-linecap="round" class="wind">
            <path d="M20 40 q30 -10 60 0 t60 0" /><path d="M40 70 q30 -10 60 0 t60 0" /><path d="M10 100 q30 -10 60 0" />
          </g>
          <g class="fly"><rect x="160" y="30" width="34" height="20" rx="3" fill="#d9b98a" stroke="#9c7b5b" stroke-width="2" /></g>
          <g transform="translate(46 50)">
            <circle cx="10" cy="18" r="18" fill="#e8b48a" /><path d="M-8 16 q18 -26 36 0 q-4 -12 -18 -14 q-14 2 -18 14z" fill="#2b1c14" />
            <circle cx="4" cy="20" r="3" fill="#1d2b4f" /><circle cx="16" cy="20" r="3" fill="#1d2b4f" /><ellipse cx="10" cy="29" rx="4" ry="5" fill="#c0443f" />
            <path d="M-6 36 h32 l8 44 h-48z" fill="#ffb703" />
            <path d="M26 40 l18 -18" stroke="#e8b48a" stroke-width="7" stroke-linecap="round" />
          </g>
        </svg>
        <figcaption>The wind blows her ticket away!</figcaption>
      </figure>

      <figure class="panel" :class="{ locked: step < 1 }">
        <span class="cap">3 · Today…</span>
        <svg viewBox="0 0 240 170" aria-hidden="true">
          <rect width="240" height="170" fill="#eef6ff" />
          <rect y="128" width="240" height="42" fill="#d3dcec" />
          <rect x="130" y="40" width="22" height="92" rx="6" fill="#3a4a6b" /><rect x="200" y="40" width="22" height="92" rx="6" fill="#3a4a6b" />
          <rect x="152" y="82" width="22" height="10" rx="4" fill="#22b573" class="flap" /><rect x="178" y="82" width="22" height="10" rx="4" fill="#22b573" class="flap flap--r" />
          <rect x="126" y="18" width="30" height="24" rx="6" fill="#1d2b4f" /><circle cx="141" cy="30" r="6" fill="#8b5cf6" />
          <g transform="translate(60 50)">
            <path d="M-4 18 q-14 10 -10 34" stroke="#2b1c14" stroke-width="8" fill="none" stroke-linecap="round" />
            <circle cx="10" cy="18" r="18" fill="#e8b48a" /><path d="M-8 16 q18 -26 36 0 q-4 -12 -18 -14 q-14 2 -18 14z" fill="#2b1c14" />
            <circle cx="4" cy="20" r="2.4" fill="#1d2b4f" /><circle cx="16" cy="20" r="2.4" fill="#1d2b4f" /><path d="M5 27 q5 4 10 0" stroke="#c0443f" stroke-width="2" fill="none" />
            <g fill="#ff5c8a" stroke="#fff" stroke-width="1"><circle cx="4" cy="20" r="2.6" /><circle cx="16" cy="20" r="2.6" /><circle cx="10" cy="26" r="2.6" /></g>
            <path d="M-6 36 h32 l8 44 h-48z" fill="#ffb703" />
          </g>
          <path d="M126 30 L82 60" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="4 3" />
        </svg>
        <figcaption>{{ step < 1 ? 'Vote first to see!' : 'Her FACE is her ticket!' }}</figcaption>
      </figure>
    </div>

    <PredictVote
      question="Can Mali still get on the train?"
      :options="[{ k: 'yes', e: '👍', l: 'Yes', ok: false }, { k: 'no', e: '👎', l: 'No', ok: true }]"
      reveal="No! Old paper tickets had no name on them, so nobody could know the ticket was hers."
      vote-hint="1 finger = yes, 2 fingers = no"
      @done="step = Math.max(step, 1)"
    />

    <PredictVote
      v-if="step >= 1"
      question="Today, can Mali get on WITHOUT a paper ticket?"
      :options="[{ k: 'yes', e: '👍', l: 'Yes', ok: true }, { k: 'no', e: '👎', l: 'No', ok: false }]"
      reveal="Yes! At high-speed train stations (and some airports), her face is her ticket. But how does the gate know it’s Mali? Let’s find out!"
      vote-hint="1 finger = yes, 2 fingers = no"
      @done="step = 2"
    />

    <div v-if="step >= 2" class="ai-row center">
      <button class="ai-btn ai-btn--green" @click="$emit('next')">Next: tickets through time ▶</button>
    </div>

    <TeacherTip text="Panel 1: “Long ago, Mali bought a paper ticket for the train.” Panel 2: “Whoosh! The wind blew it away!” Everyone votes before you tap each question." />
  </section>
</template>

<style scoped>
.comic { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
@media (max-width: 700px) { .comic { grid-template-columns: 1fr; } }
.panel { margin: 0; position: relative; background: #fff; border-radius: 18px; overflow: hidden; box-shadow: var(--ai-shadow); transition: filter 0.4s; }
.panel svg { width: 100%; height: auto; display: block; }
.panel.locked svg { filter: blur(6px) grayscale(0.6); }
.panel figcaption { padding: 8px 12px 12px; font-weight: 800; font-size: 16px; text-align: center; }
.cap { position: absolute; top: 8px; left: 8px; z-index: 1; background: #fff; border-radius: 10px; padding: 2px 10px; font-family: var(--ai-font-head); font-weight: 800; font-size: 14px; box-shadow: inset 0 0 0 2px var(--ai-line); }
.wind path { animation: wind 1.2s linear infinite; stroke-dasharray: 20 10; }
@keyframes wind { to { stroke-dashoffset: -30; } }
.fly { animation: fly 2s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes fly { 0% { transform: translate(-60px, 40px) rotate(0); } 100% { transform: translate(20px, -10px) rotate(200deg); } }
.flap { transform-box: fill-box; transform-origin: left center; animation: open 2.4s ease-in-out infinite; }
.flap--r { transform-origin: right center; animation-name: open-r; }
@keyframes open { 40%, 80% { transform: rotate(-80deg); } }
@keyframes open-r { 40%, 80% { transform: rotate(80deg); } }
.center { justify-content: center; }
</style>
