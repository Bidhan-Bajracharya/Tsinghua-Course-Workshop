<script setup>
import { ref, reactive, computed } from 'vue'
import RobotIcon from '../components/RobotIcon.vue'

const robots = [
  {
    year: 1996, name: 'Trilobite', maker: 'Electrolux', sense: 'sound',
    senseTitle: 'Bat ears 🦇',
    senseText: 'Sent out sound waves (ultrasound) and listened for the echo — just like a bat!',
    good: ['Could make a simple map'],
    bad: ['Slow at thinking', 'Still bumped into things', 'Big and chunky', 'Very expensive!'],
    price: 1600,
    fact: 'It was named after the trilobite, an ancient sea creature with a similar shape!',
  },
  {
    year: 2002, name: 'Roomba', maker: 'iRobot', sense: 'bump',
    senseTitle: 'Bump & turn 💥',
    senseText: 'Drove until it bumped into something, then turned a random way. It could also spiral and spot stairs.',
    good: ['Cheap!', 'Simple', 'Could spot stairs'],
    bad: ['Moved randomly', 'No sense of direction', 'Cleaned some spots twice and missed others'],
    price: 200,
    fact: 'Because it was cheap, it quickly sold over a million robots!',
  },
  {
    year: 2010, name: 'Neato XV-11', maker: 'Neato Robotics', sense: 'laser',
    senseTitle: 'Laser eyes 🔦',
    senseText: 'A spinning laser measured the distance to walls and furniture, so it could draw a map and plan its route.',
    good: ['Made a map', 'Planned a neat path', 'Much faster cleaning'],
    bad: ["Couldn't tell what things were"],
    price: 400,
    fact: 'Self-driving cars and drones use laser tech like this too!',
  },
  {
    year: 2015, name: 'Roomba 980', maker: 'iRobot', sense: 'camera',
    senseTitle: 'Camera eyes 📷',
    senseText: 'A camera helps it work out where it is and recognise things around it, thanks to AI.',
    good: ['Knows where it is', 'Recognises objects', 'Cleans smartly room by room'],
    bad: ['Needs light to see well'],
    price: 900,
    fact: 'AI that understands pictures made this possible!',
  },
]

const sel = ref(0)
const seen = reactive(new Set([0]))
const r = computed(() => robots[sel.value])
const maxPrice = 1600

function choose(i) {
  sel.value = i
  seen.add(i)
}
</script>

<template>
  <section class="ai-scene">
    <div class="ai-scene__head">
      <span class="ai-tag">⏳ Time machine</span>
      <h2>How robot vacuums grew up</h2>
      <p>Tap each year to meet a robot and see how it “senses” the room.</p>
    </div>

    <div class="track ai-card">
      <div class="track__line" aria-hidden="true"></div>
      <button
        v-for="(b, i) in robots"
        :key="b.year"
        class="stop"
        :class="{ active: sel === i, seen: seen.has(i) }"
        @click="choose(i)"
      >
        <span class="stop__dot">{{ seen.has(i) ? '✓' : '?' }}</span>
        <span class="stop__year">{{ b.year }}</span>
        <span class="stop__name">{{ b.name }}</span>
      </button>
    </div>

    <Transition name="swap" mode="out-in">
      <div :key="r.year" class="detail">
        <div class="ai-card show">
          <div class="show__head">
            <div>
              <span class="year">{{ r.year }}</span>
              <h3>{{ r.name }}</h3>
              <span class="maker">by {{ r.maker }}</span>
            </div>
          </div>

          <svg viewBox="0 0 280 160" class="sense" role="img" :aria-label="r.senseTitle">
            <rect x="0" y="0" width="280" height="160" rx="16" fill="#fdf7ea" />
            <rect x="252" y="10" width="16" height="140" rx="6" fill="#9c7b5b" />

            <!-- ultrasound -->
            <g v-if="r.sense === 'sound'">
              <path v-for="n in 3" :key="n" class="wave" :style="{ animationDelay: (n - 1) * 0.55 + 's' }"
                d="M 110 40 Q 150 80 110 120" fill="none" stroke="#2f7cf6" stroke-width="5" stroke-linecap="round" />
              <RobotIcon :x="70" :y="80" :size="86" :angle="90" />
              <text x="210" y="40" font-size="26">🦇</text>
            </g>

            <!-- bump -->
            <g v-else-if="r.sense === 'bump'">
              <g class="bumper-move">
                <RobotIcon :x="70" :y="80" :size="86" :angle="90" />
              </g>
              <text class="bonk" x="214" y="68" font-size="30">💥</text>
            </g>

            <!-- laser -->
            <g v-else-if="r.sense === 'laser'">
              <rect x="12" y="10" width="240" height="8" rx="4" fill="#9c7b5b" />
              <rect x="12" y="142" width="240" height="8" rx="4" fill="#9c7b5b" />
              <g transform="translate(100 80)">
                <g class="laser-spin">
                  <line x1="0" y1="0" x2="200" y2="0" stroke="#ef476f" stroke-width="3" />
                  <line x1="0" y1="0" x2="-200" y2="0" stroke="#ef476f" stroke-width="3" opacity="0.6" />
                </g>
              </g>
              <circle v-for="(d, k) in [[252,40],[252,110],[180,18],[60,18],[180,142],[60,142],[252,80]]" :key="k"
                :cx="d[0]" :cy="d[1]" r="4" fill="#ef476f" />
              <RobotIcon :x="100" :y="80" :size="80" :angle="90" laser />
            </g>

            <!-- camera -->
            <g v-else>
              <polygon points="104,80 240,20 240,140" fill="#8b5cf6" opacity="0.15" />
              <text x="176" y="96" font-size="34">🧦</text>
              <rect class="blink" x="170" y="64" width="50" height="44" rx="6" fill="none" stroke="#22b573" stroke-width="3" stroke-dasharray="6 4" />
              <rect x="170" y="44" width="78" height="20" rx="6" fill="#22b573" />
              <text x="176" y="59" font-size="13" fill="#fff" font-weight="800">sock 97%</text>
              <RobotIcon :x="70" :y="80" :size="80" :angle="90" camera laser />
            </g>
          </svg>

          <div class="sense__text">
            <b>{{ r.senseTitle }}</b>
            <p>{{ r.senseText }}</p>
          </div>
        </div>

        <div class="side">
          <div class="ai-card lists">
            <div>
              <h4>👍 Good</h4>
              <ul><li v-for="g in r.good" :key="g">{{ g }}</li></ul>
            </div>
            <div>
              <h4>👎 Not so good</h4>
              <ul><li v-for="g in r.bad" :key="g">{{ g }}</li></ul>
            </div>
          </div>

          <div class="ai-card price">
            <div class="price__top">
              <b>💰 Price</b>
              <span class="price__tag">about ${{ r.price.toLocaleString() }}</span>
            </div>
            <div class="ai-meter">
              <div class="ai-meter__fill" :style="{ width: (r.price / maxPrice) * 100 + '%', background: r.price > 1000 ? 'var(--ai-red)' : 'var(--ai-green)' }"></div>
            </div>
          </div>

          <div class="ai-fact">
            <span class="ai-fact__icon">🤓</span>
            <p>{{ r.fact }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <div class="ai-row nav">
      <button class="ai-btn" :disabled="sel === 0" @click="choose(sel - 1)">◀ Earlier</button>
      <button class="ai-btn ai-btn--primary" :disabled="sel === robots.length - 1" @click="choose(sel + 1)">Later ▶</button>
    </div>
  </section>
</template>

<style scoped>
.track {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 18px 10px;
}
.track__line {
  position: absolute;
  left: 12%;
  right: 12%;
  top: 46px;
  height: 6px;
  border-radius: 3px;
  background: repeating-linear-gradient(90deg, var(--ai-primary) 0 14px, #9cc0fb 14px 24px);
}
.stop {
  position: relative;
  border: 0;
  background: none;
  font: inherit;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--ai-ink);
  padding: 0;
}
.stop__dot {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #fff;
  border: 4px solid var(--ai-line);
  font-weight: 800;
  font-size: 22px;
  color: var(--ai-ink-soft);
  transition: all 0.2s;
}
.stop.seen .stop__dot { border-color: var(--ai-green); color: var(--ai-green); }
.stop.active .stop__dot {
  background: var(--ai-primary);
  border-color: var(--ai-primary-dark);
  color: #fff;
  transform: scale(1.15);
}
.stop__year { font-family: var(--ai-font-head); font-weight: 800; font-size: 24px; }
.stop__name { font-size: 15px; color: var(--ai-ink-soft); font-weight: 700; text-align: center; }
.stop:focus-visible .stop__dot { outline: 3px solid var(--ai-accent); outline-offset: 3px; }

.detail {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 18px;
}
@media (max-width: 820px) {
  .detail { grid-template-columns: 1fr; }
}
.show { display: flex; flex-direction: column; gap: 14px; }
.year {
  font-family: var(--ai-font-head);
  font-weight: 800;
  color: var(--ai-accent);
  font-size: 22px;
}
.show h3 { font-size: 36px; color: var(--ai-primary-dark); }
.maker { color: var(--ai-ink-soft); font-weight: 700; }
.sense { width: 100%; height: auto; }
.sense__text b { font-size: 22px; font-family: var(--ai-font-head); }

.wave {
  transform-box: view-box;
  transform-origin: 70px 80px;
  animation: wave 1.65s ease-out infinite;
  opacity: 0;
}
@keyframes wave {
  0% { transform: scale(0.6); opacity: 1; }
  100% { transform: scale(1.9); opacity: 0; }
}
.bumper-move { animation: bump 2.2s ease-in-out infinite; }
@keyframes bump {
  0%, 10% { transform: translateX(0); }
  45% { transform: translateX(134px); }
  55% { transform: translateX(110px) rotate(0deg); }
  100% { transform: translateX(0); }
}
.bonk { opacity: 0; animation: bonk 2.2s infinite; }
@keyframes bonk {
  0%, 40% { opacity: 0; }
  46%, 60% { opacity: 1; }
  70%, 100% { opacity: 0; }
}
.laser-spin { animation: spin 2s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.blink { animation: blink 1.2s steps(2) infinite; }
@keyframes blink { 50% { opacity: 0.3; } }

.side { display: flex; flex-direction: column; gap: 14px; }
.lists { display: grid; gap: 12px; }
.lists h4 { margin: 0 0 4px; font-family: var(--ai-font-head); font-size: 20px; }
.lists ul { margin: 0; padding-left: 22px; }
.lists li { margin: 2px 0; }
.price { display: flex; flex-direction: column; gap: 8px; }
.price__top { display: flex; justify-content: space-between; align-items: center; }
.price__tag { font-family: var(--ai-font-head); font-weight: 800; font-size: 24px; }
.nav { justify-content: center; }

.swap-enter-active, .swap-leave-active { transition: all 0.22s ease; }
.swap-enter-from { opacity: 0; transform: translateY(12px); }
.swap-leave-to { opacity: 0; }
</style>
