<script setup>
import { ref, reactive, computed } from 'vue'
import BeepSay from '../components/BeepSay.vue'
import FaceArt from '../components/FaceArt.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { ERAS } from '../data/content'

defineEmits(['next'])
const sel = ref(0)
const done = reactive(new Set())
const busy = ref(false)
const stage = ref(0) // animation stage per era: 0 idle, 1 working, 2 done
const era = computed(() => ERAS[sel.value])
const traveller = { w: 58, h: 72, eg: 24, es: 7, nl: 20, mw: 20, sk: '#e8b48a', hc: '#2b1c14', hair: 1, glasses: false, hat: false }

function choose(i) {
  sel.value = i
  stage.value = done.has(i) ? 2 : 0
}
function run() {
  if (busy.value) return
  busy.value = true
  stage.value = 1
  setTimeout(() => {
    stage.value = 2
    done.add(sel.value)
    busy.value = false
  }, 1500)
}
</script>

<template>
  <section class="ai-scene">
    <BeepSay text="Let’s ride the ticket time machine! Pick a time, then try the gate." />

    <div class="eras">
      <button v-for="(e, i) in ERAS" :key="e.k" class="era" :class="{ on: sel === i, done: done.has(i) }" @click="choose(i)">
        <span class="era__icon">{{ e.icon }}</span>
        <span class="era__year">{{ e.year }}</span>
        <span class="era__name">{{ e.name }}</span>
        <span v-if="done.has(i)" class="era__tick">✓</span>
      </button>
    </div>

    <div class="detail">
      <div class="ai-card demo">
        <svg viewBox="0 0 600 300" class="gate" :class="[`gate--${era.k}`, `s${stage}`]" role="img" :aria-label="`${era.name} demo`">
          <rect width="600" height="300" fill="#eef6ff" />
          <rect y="240" width="600" height="60" fill="#d3dcec" />

          <!-- PAPER: a ticket checker punches a hole -->
          <template v-if="era.k === 'paper'">
            <g class="queue">
              <g v-for="n in 4" :key="n" :transform="`translate(${360 + n * 46} 150)`">
                <circle cx="0" cy="0" r="16" fill="#c98c5e" /><rect x="-16" y="18" width="32" height="70" rx="12" :fill="['#2f7cf6','#22b573','#8b5cf6','#ef476f'][n - 1]" />
              </g>
              <text x="470" y="128" text-anchor="middle" font-weight="800" font-size="16" fill="#5a6a8c">long queue…</text>
            </g>
            <g transform="translate(110 70)">
              <rect width="200" height="110" rx="10" fill="#d9b98a" stroke="#9c7b5b" stroke-width="4" />
              <text x="100" y="42" text-anchor="middle" font-weight="800" font-size="20" fill="#5b3a1e">BEIJING → TIANJIN</text>
              <text x="100" y="72" text-anchor="middle" font-weight="700" font-size="15" fill="#7a5a3a">No name on this ticket</text>
              <circle v-if="stage === 2" cx="170" cy="88" r="10" fill="#eef6ff" stroke="#9c7b5b" stroke-width="2" class="hole" />
            </g>
            <g class="punch">
              <path d="M270 10 l30 0 l0 90 l-30 0z" fill="#3a4a6b" />
              <rect x="262" y="96" width="46" height="18" rx="6" fill="#1d2b4f" />
            </g>
          </template>

          <!-- MAGNETIC & FACE: a ticket gate -->
          <template v-else>
            <rect x="250" y="110" width="40" height="130" rx="10" fill="#3a4a6b" />
            <rect x="420" y="110" width="40" height="130" rx="10" fill="#3a4a6b" />
            <rect class="flap" x="290" y="170" width="62" height="14" rx="6" />
            <rect class="flap flap--r" x="358" y="170" width="62" height="14" rx="6" />
            <circle cx="270" cy="128" r="8" :fill="stage === 2 ? '#22c46e' : '#ff4d6d'" />
            <template v-if="era.k === 'magnet'">
              <rect x="256" y="148" width="28" height="6" rx="3" fill="#1d2b4f" />
              <rect class="card" x="80" y="140" width="90" height="56" rx="8" fill="#2f7cf6" />
              <rect class="card stripe" x="80" y="176" width="90" height="10" fill="#1d2b4f" />
            </template>
            <template v-else>
              <rect x="226" y="40" width="88" height="70" rx="12" fill="#1d2b4f" />
              <svg x="240" y="44" width="60" height="64" viewBox="0 0 200 210"><FaceArt :p="traveller" :dots="stage >= 1" /></svg>
              <rect v-if="stage === 1" class="scanline" x="232" y="46" width="76" height="4" fill="#22b573" />
              <rect x="190" y="150" width="56" height="36" rx="6" fill="#fff" stroke="#5a6a8c" stroke-width="2" />
              <rect x="196" y="156" width="16" height="20" rx="2" fill="#e8b48a" /><rect x="216" y="158" width="24" height="4" fill="#a5b4cf" /><rect x="216" y="166" width="18" height="4" fill="#a5b4cf" />
              <text v-if="stage === 2" x="270" y="30" text-anchor="middle" font-weight="800" font-size="18" fill="#17895a">✓ Face = ID photo</text>
            </template>
            <g :class="['walker', { go: stage === 2 }]">
              <circle cx="120" cy="150" r="18" fill="#e8b48a" /><path d="M102 146 q18 -26 36 0 q-4 -12 -18 -14 q-14 2 -18 14z" fill="#2b1c14" />
              <path d="M104 170 h32 l8 66 h-48z" fill="#ffb703" />
            </g>
          </template>

          <text v-if="stage === 2" x="300" y="285" text-anchor="middle" font-weight="800" font-size="20" fill="#17895a">✓ Checked! On you go!</text>
        </svg>
        <button class="ai-btn ai-btn--accent ai-btn--big" :disabled="busy || stage === 2" @click="run">
          {{ stage === 2 ? '✓ Done!' : era.action }}
        </button>
      </div>

      <div class="side">
        <div class="ai-card info">
          <h3>{{ era.icon }} {{ era.name }} <small>{{ era.year }}</small></h3>
          <p><b>🛒 Buying:</b> {{ era.buy }}</p>
          <p><b>✅ Checking:</b> {{ era.check }}</p>
          <p class="note">{{ era.note }}</p>
        </div>
        <div v-if="done.size === ERAS.length" class="ai-card summary">
          <p>🎉 <b>Big change!</b> Paper → magnetic card → no ticket at all. Today a camera and AI do the ticket checker’s job: <b>face recognition</b>.</p>
          <button class="ai-btn ai-btn--green" @click="$emit('next')">Next ▶</button>
        </div>
        <p v-else class="left">Try all {{ ERAS.length }} gates ({{ done.size }} / {{ ERAS.length }})</p>
      </div>
    </div>

    <TeacherTip text="Ask: “What was the problem with paper tickets?” (Queues, and an anonymous ticket can’t be replaced.) “Why is the face gate faster?” Note that 12306 is China’s train booking website, launched in 2010; paperless tickets came in 2020." />
  </section>
</template>

<style scoped>
.eras { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.era {
  position: relative; border: 0; font: inherit; color: var(--ai-ink); cursor: pointer; background: #fff; border-radius: 18px; padding: 12px 8px;
  display: flex; flex-direction: column; align-items: center; gap: 2px; box-shadow: inset 0 0 0 3px var(--ai-line), 0 4px 0 var(--ai-line); transition: transform 0.12s;
}
.era:hover { transform: translateY(-2px); }
.era.on { background: #fff2e6; box-shadow: inset 0 0 0 3px #ff8a3d, 0 4px 0 #d9691f; }
.era__icon { font-size: 34px; line-height: 1; }
.era__year { font-family: var(--ai-font-head); font-weight: 800; font-size: 20px; color: #d9691f; }
.era__name { font-weight: 800; font-size: 15px; text-align: center; }
.era__tick { position: absolute; top: 6px; right: 8px; width: 24px; height: 24px; border-radius: 50%; background: var(--ai-green); color: #fff; display: grid; place-items: center; font-weight: 800; font-size: 14px; }

.detail { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 16px; align-items: start; }
@media (max-width: 820px) { .detail { grid-template-columns: 1fr; } }
.demo { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 12px; }
.gate { width: 100%; height: auto; border-radius: 14px; }
.punch { transition: transform 0.4s cubic-bezier(0.5, 1.8, 0.5, 1); }
.s1 .punch { transform: translateY(60px); }
.hole { animation: pop 0.3s ease; }
@keyframes pop { from { transform: scale(0); } }
.flap { fill: #ef476f; transform-box: fill-box; transform-origin: left center; transition: transform 0.6s ease, fill 0.3s; }
.flap--r { transform-origin: right center; }
.s2 .flap { fill: #22b573; transform: rotate(-80deg); }
.s2 .flap--r { transform: rotate(80deg); }
.card { transition: transform 1s ease; }
.s1 .card, .s2 .card { transform: translateX(150px) translateY(-6px) scaleX(0.4); opacity: 0.8; }
.scanline { animation: scanl 0.75s ease-in-out infinite alternate; }
@keyframes scanl { to { transform: translateY(58px); } }
.walker { transition: transform 1.2s ease; }
.walker.go { transform: translateX(380px); }

.side { display: flex; flex-direction: column; gap: 12px; }
.info { display: flex; flex-direction: column; gap: 8px; }
.info h3 { font-size: 24px; }
.info small { color: #d9691f; font-size: 16px; }
.info p { font-size: 17px; }
.note { background: #fff4d6; border-radius: 12px; padding: 8px 12px; font-weight: 700; }
.summary { display: flex; flex-direction: column; gap: 10px; background: #effbf5; }
.left { text-align: center; color: var(--ai-ink-soft); font-weight: 700; }
</style>
