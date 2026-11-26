<script setup>
import { ref, reactive, computed } from 'vue'

const parts = [
  {
    id: 'laser', name: 'Laser Eyes', icon: '🔦', at: [262, 150],
    text: 'This little tower spins round and round, shining a laser beam. It measures how far away the walls are, so Robo can draw a map of your home.',
    like: 'Like a lighthouse that can measure!',
  },
  {
    id: 'camera', name: 'Camera', icon: '📷', at: [220, 50],
    text: 'Looks ahead and takes lots of pictures. AI helps Robo understand them: “That’s a sock — go around it!”',
    like: 'Like your eyes and brain working together.',
  },
  {
    id: 'bumper', name: 'Bumper', icon: '🛡️', at: [368, 182],
    text: 'A soft front edge that feels when Robo touches something. Bump! Time to turn.',
    like: 'Like your hands feeling in the dark.',
  },
  {
    id: 'brush', name: 'Spinning Brush', icon: '🧹', at: [112, 82],
    text: 'Spins super fast to sweep dust out of corners and into Robo’s path.',
    like: 'Like a tiny broom that never gets tired.',
  },
  {
    id: 'wheels', name: 'Wheels', icon: '🛞', at: [71, 215],
    text: 'Two strong wheels drive Robo forwards and backwards, and let it spin around on the spot.',
    like: 'Like a little toy car!',
  },
  {
    id: 'cliff', name: 'Stair Sensors', icon: '🪜', at: [290, 95],
    text: 'They look down at the floor. If the floor suddenly disappears — stairs! — Robo stops and backs away.',
    like: 'Like being careful at the edge of a pool.',
  },
  {
    id: 'bin', name: 'Dust Box', icon: '🗑️', at: [220, 300],
    text: 'All the dust, crumbs and fluff end up in here. Someone still needs to empty it!',
    like: 'Like Robo’s tummy.',
  },
  {
    id: 'dock', name: 'Charging Dock', icon: '🔌', at: [455, 205],
    text: 'When its battery gets low, Robo drives back home to charge — all by itself!',
    like: 'Like charging a tablet at night.',
  },
]

const selected = ref(null)
const found = reactive(new Set())
const current = computed(() => parts.find((p) => p.id === selected.value))
const allFound = computed(() => found.size === parts.length)

function pick(id) {
  selected.value = id
  found.add(id)
}
</script>

<template>
  <section class="ai-scene">
    <div class="ai-scene__head">
      <span class="ai-tag">🤖 Explore</span>
      <h2>Meet Robo!</h2>
      <p>Tap the glowing dots to discover each part of a robot vacuum.</p>
    </div>

    <div class="ai-split">
      <div class="ai-card stage">
        <svg viewBox="0 0 520 400" class="diagram" role="img" aria-label="Robot vacuum seen from above">
          <!-- floor -->
          <rect x="0" y="0" width="520" height="400" rx="20" fill="#fdf7ea" />

          <!-- wheels (drawn first so they peek out) -->
          <g class="part" :class="{ hot: selected === 'wheels' }" @click="pick('wheels')">
            <rect x="56" y="178" width="28" height="74" rx="9" fill="#2f3b55" />
            <rect x="356" y="178" width="28" height="74" rx="9" fill="#2f3b55" />
          </g>

          <!-- body -->
          <circle cx="220" cy="210" r="150" fill="#eef3fb" stroke="#3a4a6b" stroke-width="6" />
          <circle cx="220" cy="210" r="122" fill="none" stroke="#d6deec" stroke-width="3" />

          <!-- bumper -->
          <g class="part" :class="{ hot: selected === 'bumper' }" @click="pick('bumper')">
            <path d="M 75.4 170 A 150 150 0 0 1 364.6 170" fill="none" stroke="#2f7cf6" stroke-width="16" stroke-linecap="round" />
          </g>

          <!-- side brushes -->
          <g class="part" :class="{ hot: selected === 'brush' }" @click="pick('brush')">
            <g transform="translate(118 90)">
              <g class="spin">
                <line x1="0" y1="0" x2="0" y2="-40" stroke="#ffb703" stroke-width="5" stroke-linecap="round" />
                <line x1="0" y1="0" x2="34.6" y2="20" stroke="#ffb703" stroke-width="5" stroke-linecap="round" />
                <line x1="0" y1="0" x2="-34.6" y2="20" stroke="#ffb703" stroke-width="5" stroke-linecap="round" />
              </g>
              <circle r="10" fill="#e09a00" />
            </g>
            <g transform="translate(322 90)">
              <g class="spin spin--rev">
                <line x1="0" y1="0" x2="0" y2="-40" stroke="#ffb703" stroke-width="5" stroke-linecap="round" />
                <line x1="0" y1="0" x2="34.6" y2="20" stroke="#ffb703" stroke-width="5" stroke-linecap="round" />
                <line x1="0" y1="0" x2="-34.6" y2="20" stroke="#ffb703" stroke-width="5" stroke-linecap="round" />
              </g>
              <circle r="10" fill="#e09a00" />
            </g>
          </g>

          <!-- cliff sensors -->
          <g class="part" :class="{ hot: selected === 'cliff' }" @click="pick('cliff')">
            <circle cx="160" cy="98" r="9" fill="#ffd166" stroke="#c98d00" stroke-width="3" />
            <circle cx="280" cy="98" r="9" fill="#ffd166" stroke="#c98d00" stroke-width="3" />
          </g>

          <!-- camera -->
          <g class="part" :class="{ hot: selected === 'camera' }" @click="pick('camera')">
            <rect x="198" y="64" width="44" height="22" rx="8" fill="#1d2b4f" />
            <circle cx="220" cy="75" r="7" fill="#a78bfa" />
            <circle cx="222" cy="73" r="2" fill="#fff" />
          </g>

          <!-- laser turret -->
          <g class="part" :class="{ hot: selected === 'laser' }" @click="pick('laser')">
            <g transform="translate(220 180)">
              <g class="spin spin--slow">
                <line x1="0" y1="0" x2="0" y2="-95" stroke="#ef476f" stroke-width="3" stroke-dasharray="6 5" opacity="0.7" />
              </g>
            </g>
            <circle cx="220" cy="180" r="42" fill="#2f3b55" />
            <circle cx="220" cy="180" r="15" fill="#ef476f" />
          </g>

          <!-- dust bin -->
          <g class="part" :class="{ hot: selected === 'bin' }" @click="pick('bin')">
            <rect x="160" y="270" width="120" height="58" rx="16" fill="#cfd8ea" stroke="#9aa9c6" stroke-width="3" />
            <circle cx="190" cy="300" r="4" fill="#b69b72" />
            <circle cx="210" cy="292" r="3" fill="#b69b72" />
            <circle cx="236" cy="306" r="5" fill="#b69b72" />
            <circle cx="256" cy="294" r="3" fill="#b69b72" />
          </g>

          <!-- dock -->
          <g class="part" :class="{ hot: selected === 'dock' }" @click="pick('dock')">
            <rect x="418" y="120" width="78" height="180" rx="18" fill="#3a4a6b" />
            <rect x="430" y="136" width="54" height="40" rx="10" fill="#22b573" />
            <path d="M 461 141 L 448 160 L 458 160 L 452 172 L 468 152 L 458 152 Z" fill="#fff" />
            <rect x="430" y="270" width="54" height="12" rx="6" fill="#ffd166" />
          </g>

          <!-- hotspots -->
          <g
            v-for="(p, i) in parts"
            :key="p.id"
            class="spot"
            :class="{ found: found.has(p.id), active: selected === p.id }"
            :transform="`translate(${p.at[0]} ${p.at[1]})`"
            role="button"
            tabindex="0"
            :aria-label="p.name"
            @click="pick(p.id)"
            @keydown.enter.prevent="pick(p.id)"
            @keydown.space.prevent="pick(p.id)"
          >
            <circle class="spot__pulse" r="18" />
            <circle class="spot__dot" r="15" />
            <text y="6" text-anchor="middle">{{ found.has(p.id) ? '✓' : i + 1 }}</text>
          </g>
        </svg>
      </div>

      <div class="side">
        <Transition name="pop" mode="out-in">
          <div v-if="current" :key="current.id" class="ai-card info">
            <div class="info__icon">{{ current.icon }}</div>
            <h3>{{ current.name }}</h3>
            <p>{{ current.text }}</p>
            <p class="like">💡 {{ current.like }}</p>
          </div>
          <div v-else class="ai-card info info--empty">
            <div class="info__icon">👆</div>
            <h3>Tap a glowing dot!</h3>
            <p>Each number is a part of Robo. Can you find all {{ parts.length }}?</p>
          </div>
        </Transition>

        <div class="ai-card progress">
          <div class="progress__top">
            <b>Parts found</b>
            <span>{{ found.size }} / {{ parts.length }}</span>
          </div>
          <div class="ai-meter">
            <div class="ai-meter__fill" :style="{ width: (found.size / parts.length) * 100 + '%' }"></div>
          </div>
          <p v-if="allFound" class="done">🎉 Amazing! You know every part of Robo!</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stage { padding: 12px; }
.diagram { width: 100%; height: auto; }
.part { cursor: pointer; transition: filter 0.2s; }
.part:hover { filter: brightness(1.08); }
.part.hot { filter: drop-shadow(0 0 10px rgba(255, 183, 3, 0.95)); }

.spin { animation: spin 1.2s linear infinite; }
.spin--rev { animation-direction: reverse; }
.spin--slow { animation-duration: 3s; }
@keyframes spin { to { transform: rotate(360deg); } }

.spot { cursor: pointer; outline: none; }
.spot__dot { fill: #ff6b9a; stroke: #fff; stroke-width: 3; transition: fill 0.2s; }
.spot.found .spot__dot { fill: var(--ai-green); }
.spot.active .spot__dot { fill: var(--ai-accent); }
.spot:focus-visible .spot__dot { stroke: var(--ai-accent); stroke-width: 5; }
.spot text { fill: #fff; font-weight: 800; font-size: 16px; font-family: var(--ai-font-head); pointer-events: none; }
.spot__pulse {
  fill: #ff6b9a;
  opacity: 0.5;
  transform-box: fill-box;
  transform-origin: center;
  animation: pulse 1.6s ease-out infinite;
}
.spot.found .spot__pulse { fill: var(--ai-green); animation: none; opacity: 0; }
@keyframes pulse {
  0% { transform: scale(0.8); opacity: 0.6; }
  100% { transform: scale(1.9); opacity: 0; }
}

.side { display: flex; flex-direction: column; gap: 16px; }
.info { display: flex; flex-direction: column; gap: 8px; min-height: 250px; }
.info__icon { font-size: 56px; line-height: 1; }
.info h3 { font-size: 30px; color: var(--ai-primary-dark); }
.info p { font-size: 19px; }
.like {
  margin-top: auto;
  background: #f0f6ff;
  border-radius: 14px;
  padding: 10px 14px;
  font-weight: 700;
}
.info--empty h3 { color: var(--ai-ink); }

.progress { display: flex; flex-direction: column; gap: 10px; }
.progress__top { display: flex; justify-content: space-between; font-weight: 800; }
.done { font-weight: 800; color: var(--ai-green); }

.pop-enter-active, .pop-leave-active { transition: all 0.2s ease; }
.pop-enter-from { opacity: 0; transform: scale(0.95); }
.pop-leave-to { opacity: 0; }
</style>
