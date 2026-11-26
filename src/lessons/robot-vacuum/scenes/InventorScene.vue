<script setup>
import { reactive, computed } from 'vue'

const BASE = 100
const BUDGET = 700

const features = [
  { id: 'bumper', icon: '🛡️', name: 'Bumper', cost: 20, help: 2, note: 'Feels bumps' },
  { id: 'stairs', icon: '🪜', name: 'Stair sensors', cost: 30, help: 2, note: "Won't fall downstairs" },
  { id: 'laser', icon: '🔦', name: 'Laser map', cost: 150, help: 3, note: 'Plans a neat path' },
  { id: 'camera', icon: '📷', name: 'Camera + AI', cost: 200, help: 3, note: 'Spots socks & pets' },
  { id: 'voice', icon: '🗣️', name: 'Talking voice', cost: 60, help: 1, note: 'Says hello!' },
  { id: 'disco', icon: '🪩', name: 'Disco lights', cost: 90, help: 0, note: 'Party time?' },
  { id: 'rocket', icon: '🚀', name: 'Rocket boosters', cost: 500, help: 0, note: 'Super fast… but why?' },
  { id: 'gold', icon: '✨', name: 'Gold paint', cost: 400, help: 0, note: 'Very shiny' },
]

const picked = reactive(new Set(['bumper']))
function toggle(id) {
  if (picked.has(id)) picked.delete(id)
  else picked.add(id)
}

const chosen = computed(() => features.filter((f) => picked.has(f.id)))
const price = computed(() => BASE + chosen.value.reduce((s, f) => s + f.cost, 0))
const help = computed(() => chosen.value.reduce((s, f) => s + f.help, 0))
const silly = computed(() => chosen.value.filter((f) => f.help === 0))

const verdict = computed(() => {
  if (price.value > BUDGET) {
    return {
      face: '😢', tone: 'bad', title: 'Too expensive!',
      text: silly.value.length
        ? `Families can't afford it. Do you really need the ${silly.value.map((f) => f.name.toLowerCase()).join(' and ')}?`
        : "Families can't afford it. Can you pick fewer parts?",
    }
  }
  if (help.value < 5) {
    return { face: '🤔', tone: 'meh', title: 'Cheap… but not very helpful', text: 'It needs more useful parts to clean well. Which parts help it find its way?' }
  }
  if (silly.value.length) {
    return { face: '🙂', tone: 'ok', title: 'Good, with fun extras', text: 'Families like it! The extras are fun, but they make it cost more without cleaning better.' }
  }
  return { face: '🤩', tone: 'good', title: 'Perfect balance!', text: 'Helpful AND affordable. Families everywhere want one. You think like a real inventor!' }
})
</script>

<template>
  <section class="ai-scene">
    <div class="ai-scene__head">
      <span class="ai-tag">💡 Think like an inventor</span>
      <h2>Big dreams + smart choices</h2>
    </div>

    <div class="story">
      <div class="ai-card panel">
        <span class="panel__n">1990</span>
        <div class="panel__art">🎓🤖🌙</div>
        <p>Some robot scientists from a university called <b>MIT</b> started a company, <b>iRobot</b>. They built amazing robots — even ones for exploring the Moon!</p>
      </div>
      <div class="ai-card panel">
        <span class="panel__n">But…</span>
        <div class="panel__art">💸😟</div>
        <p>Their cool robots didn’t make money. Then they saw <b>Trilobite</b>: clever, but it cost <b>$1,600</b>. Too expensive for most families!</p>
      </div>
      <div class="ai-card panel">
        <span class="panel__n">2002</span>
        <div class="panel__art">🤖🏠🏠🏠</div>
        <p>So they made <b>Roomba</b> simple and cheap — about <b>$200</b>. Millions of families bought one!</p>
      </div>
    </div>

    <div class="ai-scene__head">
      <h2>🛠️ Your turn: design a robot vacuum</h2>
      <p>Tap parts to add or remove them. Make it <b>helpful</b>, but keep the price under <b>${{ BUDGET }}</b> so families can buy it.</p>
    </div>

    <div class="ai-split">
      <div class="parts">
        <button
          v-for="f in features"
          :key="f.id"
          class="part"
          :class="{ on: picked.has(f.id) }"
          :aria-pressed="picked.has(f.id)"
          @click="toggle(f.id)"
        >
          <span class="part__icon">{{ f.icon }}</span>
          <span class="part__name">{{ f.name }}</span>
          <span class="part__note">{{ f.note }}</span>
          <span class="part__cost">${{ f.cost }}</span>
          <span class="part__check">{{ picked.has(f.id) ? '✓' : '+' }}</span>
        </button>
      </div>

      <div class="side">
        <div class="ai-card meters">
          <div class="meter-row">
            <span>💰 Price</span>
            <b :class="{ over: price > BUDGET }">${{ price }}</b>
          </div>
          <div class="ai-meter">
            <div class="ai-meter__fill" :style="{ width: Math.min(100, (price / 1600) * 100) + '%', background: price > BUDGET ? 'var(--ai-red)' : 'var(--ai-accent)' }"></div>
          </div>
          <div class="meter-row">
            <span>🧹 Helpfulness</span>
            <b>{{ '⭐'.repeat(Math.min(5, Math.round(help / 2))) || '—' }}</b>
          </div>
          <div class="ai-meter">
            <div class="ai-meter__fill" :style="{ width: Math.min(100, (help / 10) * 100) + '%' }"></div>
          </div>
        </div>

        <Transition name="pop" mode="out-in">
          <div :key="verdict.title" class="ai-card verdict" :class="verdict.tone">
            <span class="verdict__face">{{ verdict.face }}</span>
            <h3>{{ verdict.title }}</h3>
            <p>{{ verdict.text }}</p>
          </div>
        </Transition>
      </div>
    </div>

    <div class="ai-fact">
      <span class="ai-fact__icon">🧠</span>
      <p><b>The lesson:</b> imagination gives you great ideas, and practical thinking makes them useful for real people. Great inventors need <b>both</b>!</p>
    </div>
  </section>
</template>

<style scoped>
.story { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
@media (max-width: 820px) { .story { grid-template-columns: 1fr; } }
.panel { display: flex; flex-direction: column; gap: 8px; position: relative; padding-top: 28px; }
.panel__n {
  position: absolute; top: -12px; left: 16px;
  background: var(--ai-accent); color: #3b2a00; font-weight: 800; font-family: var(--ai-font-head);
  padding: 2px 14px; border-radius: 999px; font-size: 18px;
}
.panel__art { font-size: 40px; letter-spacing: 4px; }

.parts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
@media (max-width: 520px) { .parts { grid-template-columns: 1fr; } }
.part {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: 'icon name cost' 'icon note cost';
  column-gap: 10px;
  align-items: center;
  text-align: left;
  border: 0;
  font: inherit;
  cursor: pointer;
  background: #fff;
  border-radius: 18px;
  padding: 12px 14px;
  box-shadow: inset 0 0 0 3px var(--ai-line), 0 4px 0 var(--ai-line);
  transition: transform 0.12s, box-shadow 0.15s, background 0.15s;
  color: var(--ai-ink);
}
.part:hover { transform: translateY(-2px); }
.part.on { background: #eef9f3; box-shadow: inset 0 0 0 3px var(--ai-green), 0 4px 0 #17895a; }
.part:focus-visible { outline: 3px solid var(--ai-accent); outline-offset: 2px; }
.part__icon { grid-area: icon; font-size: 34px; }
.part__name { grid-area: name; font-weight: 800; font-size: 17px; }
.part__note { grid-area: note; font-size: 14px; color: var(--ai-ink-soft); }
.part__cost { grid-area: cost; font-family: var(--ai-font-head); font-weight: 800; font-size: 18px; }
.part__check {
  position: absolute; top: -8px; right: -8px; width: 26px; height: 26px; border-radius: 50%;
  display: grid; place-items: center; font-weight: 800; font-size: 15px;
  background: #fff; box-shadow: inset 0 0 0 2px var(--ai-line); color: var(--ai-ink-soft);
}
.part.on .part__check { background: var(--ai-green); color: #fff; box-shadow: none; }

.side { display: flex; flex-direction: column; gap: 14px; }
.meters { display: flex; flex-direction: column; gap: 8px; }
.meter-row { display: flex; justify-content: space-between; align-items: center; font-weight: 800; }
.meter-row b { font-family: var(--ai-font-head); font-size: 22px; }
.meter-row b.over { color: var(--ai-red); }

.verdict { display: flex; flex-direction: column; gap: 6px; text-align: center; align-items: center; border: 3px solid transparent; }
.verdict__face { font-size: 60px; line-height: 1; }
.verdict h3 { font-size: 26px; }
.verdict.good { border-color: var(--ai-green); background: #effbf5; }
.verdict.ok { border-color: #8fd3b4; }
.verdict.meh { border-color: var(--ai-accent); background: #fffaf0; }
.verdict.bad { border-color: var(--ai-red); background: #fff2f5; }

.pop-enter-active, .pop-leave-active { transition: all 0.18s ease; }
.pop-enter-from { opacity: 0; transform: scale(0.96); }
.pop-leave-to { opacity: 0; }
</style>
