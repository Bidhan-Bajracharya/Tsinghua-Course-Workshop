<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import LumiSay from '../components/LumiSay.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'

defineEmits(['next'])

const W = 7
const H = 4
const CONES = [[1, 3], [1, 2], [3, 0], [3, 1], [3, 3], [5, 1], [5, 2]]
const GOAL = [6, 0]
const isCone = (x, y) => CONES.some((c) => c[0] === x && c[1] === y)

const pos = ref([0, 3])
const moves = ref(0)
const bumps = ref(0)
const face = ref(1)
const won = ref(false)
const shake = ref(false)

const cells = []
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) cells.push({ x, y, cone: isCone(x, y), goal: x === GOAL[0] && y === GOAL[1] })

const carStyle = computed(() => ({
  left: `calc(${(pos.value[0] / W) * 100}% )`,
  top: `calc(${(pos.value[1] / H) * 100}% )`,
  width: `${100 / W}%`,
  height: `${100 / H}%`,
}))

function step(dx, dy) {
  if (won.value) return
  if (dx) face.value = dx
  const nx = pos.value[0] + dx
  const ny = pos.value[1] + dy
  if (nx < 0 || ny < 0 || nx >= W || ny >= H || isCone(nx, ny)) {
    bumps.value++
    shake.value = true
    setTimeout(() => (shake.value = false), 350)
    return
  }
  pos.value = [nx, ny]
  moves.value++
  if (nx === GOAL[0] && ny === GOAL[1]) won.value = true
}
function reset() {
  pos.value = [0, 3]
  moves.value = 0
  bumps.value = 0
  face.value = 1
  won.value = false
}

const keys = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }
function onKey(e) {
  const m = keys[e.key]
  if (m) {
    e.preventDefault()
    step(...m)
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <section class="ai-scene">
    <LumiSay text="It’s 1925. YOU are the radio! Drive the car to the flag." />

    <div class="rc">
      <div class="ai-card board-card">
        <div class="board" :class="{ shake }">
          <div v-for="c in cells" :key="`${c.x}-${c.y}`" class="cell">
            <svg v-if="c.cone" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 4 L32 34 H8 Z" fill="#ff8a3d" /><path d="M14 22h12M11 29h18" stroke="#fff" stroke-width="4" /><rect x="5" y="33" width="30" height="5" rx="2" fill="#ff8a3d" /></svg>
            <svg v-else-if="c.goal" viewBox="0 0 40 40" aria-hidden="true" class="flag"><path d="M10 4v34" stroke="#fff" stroke-width="3" /><path d="M11 5h22l-6 7 6 7H11z" fill="#22b573" /></svg>
          </div>
          <div class="car" :style="carStyle">
            <svg viewBox="0 0 130 84" aria-hidden="true" :style="{ transform: `scaleX(${face})` }"><use href="#sd-car1925" width="130" height="84" /></svg>
          </div>
        </div>
      </div>

      <div class="ctrl">
        <div class="pad">
          <button class="ai-btn u" aria-label="Up" @click="step(0, -1)">▲</button>
          <button class="ai-btn l" aria-label="Left" @click="step(-1, 0)">◀</button>
          <span class="mid" aria-hidden="true">📻</span>
          <button class="ai-btn r" aria-label="Right" @click="step(1, 0)">▶</button>
          <button class="ai-btn d" aria-label="Down" @click="step(0, 1)">▼</button>
        </div>
        <p class="moves">Moves: <b>{{ moves }}</b> · Bumps: <b>{{ bumps }}</b></p>
        <p class="hint">Arrow keys work too!</p>
      </div>
    </div>

    <Transition name="pop">
      <div v-if="won" class="ai-card win">
        <div class="win__e">🏁🎉</div>
        <h3>You made it in {{ moves }} moves!</h3>
        <p>But wait… <b>YOU</b> were driving, not the car. In 1925 a person was still in control, just from far away.</p>
        <div class="ai-row center">
          <button class="ai-btn" @click="reset">🔁 Drive again</button>
          <button class="ai-btn ai-btn--green" @click="$emit('next')">Next ▶</button>
        </div>
      </div>
    </Transition>

    <TeacherTip text="After they win, ask: “Was the car driving itself?” No, a person was still in control, just from far away." />
  </section>
</template>

<style scoped>
.rc { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 18px; align-items: center; }
@media (max-width: 720px) { .rc { grid-template-columns: 1fr; } }
.board-card { padding: 10px; }
.board {
  position: relative;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(4, 1fr);
  aspect-ratio: 7 / 4;
  background: #3a4a6b;
  border-radius: 14px;
  padding: 0;
  overflow: hidden;
}
.board.shake { animation: shake 0.35s; }
@keyframes shake { 25% { transform: translateX(-7px); } 75% { transform: translateX(7px); } }
.cell { display: grid; place-items: center; border: 2px solid #4b5c80; }
.cell svg { width: 62%; height: auto; }
.flag { animation: wave 1s ease-in-out infinite; }
@keyframes wave { 50% { transform: rotate(-6deg); } }
.car { position: absolute; display: grid; place-items: center; transition: left 0.22s ease, top 0.22s ease; pointer-events: none; }
.car svg { width: 86%; height: auto; transition: transform 0.2s; filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.8)); }

.ctrl { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.pad { display: grid; grid-template-columns: repeat(3, 70px); grid-template-rows: repeat(3, 70px); gap: 8px; }
.pad .ai-btn { padding: 0; font-size: 26px; border-radius: 18px; }
.u { grid-column: 2; grid-row: 1; }
.l { grid-column: 1; grid-row: 2; }
.mid { grid-column: 2; grid-row: 2; display: grid; place-items: center; font-size: 34px; }
.r { grid-column: 3; grid-row: 2; }
.d { grid-column: 2; grid-row: 3; }
.moves { font-weight: 700; color: var(--ai-ink-soft); }
.hint { font-size: 14px; color: var(--ai-ink-soft); }

.win { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; background: #effbf5; }
.win__e { font-size: 44px; }
.win h3 { font-size: 28px; }
.win p { font-size: 19px; max-width: 560px; }
.center { justify-content: center; }
.pop-enter-active { transition: all 0.3s ease; }
.pop-enter-from { opacity: 0; transform: translateY(14px); }
</style>
