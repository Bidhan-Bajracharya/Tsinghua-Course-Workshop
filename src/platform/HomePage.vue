<script setup>
import { computed } from 'vue'
import '../shared/theme.css'
import RobotIcon from '../lessons/robot-vacuum/components/RobotIcon.vue'
import LumiCar from '../shared/mascots/LumiCar.vue'
import { loadProgress, starsFor } from '../shared/progress'

const props = defineProps({ lessons: { type: Array, required: true } })
const emit = defineEmits(['open'])

const progress = loadProgress()
const cards = computed(() =>
  props.lessons.map((l) => {
    const p = progress[l.id]
    const done = !!(p && p.total)
    return { ...l, done, visited: !!p, best: p, stars: done ? starsFor(p.pct) : 0 }
  }),
)
const totalStars = computed(() => cards.value.reduce((s, c) => s + c.stars, 0))
const maxStars = computed(() => props.lessons.filter((l) => l.scored).length * 3)
const finished = computed(() => cards.value.filter((c) => c.visited).length)
</script>

<template>
  <div class="ai-lesson home">
    <div class="wrap">
      <!-- Hero -->
      <header class="hero ai-card">
        <div class="hero__text">
          <span class="ai-tag">✨ Unit {{ lessons[0]?.unit ?? 2 }}</span>
          <h1>AI Around Us</h1>
          <p>Discover the smart machines in everyday life. Play, experiment, and earn a certificate for every lesson!</p>
          <div class="stats">
            <span class="stat">📚 <b>{{ lessons.length }}</b> lessons</span>
            <span class="stat">✅ <b>{{ finished }}</b> explored</span>
            <span class="stat">⭐ <b>{{ totalStars }}</b> / {{ maxStars }} stars</span>
          </div>
        </div>

        <div class="hero__scene" aria-hidden="true">
          <svg viewBox="0 0 600 220" class="scene">
            <!-- sky & city -->
            <rect width="600" height="220" rx="20" fill="#dff0ff" />
            <circle cx="520" cy="46" r="24" fill="#ffd166" />
            <g fill="#bcd6f5">
              <rect x="40" y="70" width="44" height="80" rx="6" />
              <rect x="92" y="50" width="36" height="100" rx="6" />
              <rect x="300" y="64" width="50" height="86" rx="6" />
              <rect x="358" y="84" width="34" height="66" rx="6" />
            </g>
            <g fill="#a5c6ee">
              <rect x="180" y="40" width="40" height="110" rx="6" />
              <rect x="430" y="76" width="44" height="74" rx="6" />
            </g>
            <g fill="#8fd3b4">
              <circle cx="250" cy="138" r="20" /><circle cx="272" cy="130" r="24" />
              <circle cx="560" cy="140" r="18" />
            </g>
            <!-- road -->
            <rect y="150" width="600" height="70" fill="#3a4a6b" />
            <line class="lane" x1="0" y1="186" x2="600" y2="186" stroke="#ffd166" stroke-width="5" />
            <!-- Lumi driving -->
            <g class="drive">
              <circle class="ping" cx="70" cy="150" r="60" fill="none" stroke="#00e5ff" stroke-width="3" />
              <circle class="ping ping--2" cx="70" cy="150" r="60" fill="none" stroke="#00e5ff" stroke-width="3" />
              <g class="bob"><LumiCar :x="10" :y="118" :width="120" /></g>
            </g>
          </svg>
          <div class="floor">
            <svg viewBox="-60 -60 120 120" class="robo"><RobotIcon :angle="90" laser camera /></svg>
          </div>
        </div>
      </header>

      <!-- Lessons -->
      <section class="lessons">
        <h2>Choose a lesson</h2>
        <div class="grid">
          <article v-for="l in cards" :key="l.id" class="lcard ai-card" :style="{ '--c': l.color }">
            <div class="lcard__art" :class="`art--${l.art || 'robo'}`" aria-hidden="true">
              <svg v-if="l.art === 'lumi'" viewBox="0 0 300 130">
                <rect width="300" height="130" fill="#dff0ff" />
                <rect y="88" width="300" height="42" fill="#3a4a6b" />
                <line x1="0" y1="110" x2="300" y2="110" stroke="#ffd166" stroke-width="4" stroke-dasharray="18 14" class="lane" />
                <g class="bob"><LumiCar :x="90" :y="46" :width="120" /></g>
              </svg>
              <svg v-else-if="l.art === 'face'" viewBox="0 0 300 130">
                <rect width="300" height="130" fill="#ffe8d6" />
                <g stroke="#1d2b4f" stroke-width="5" fill="none" stroke-linecap="round">
                  <path d="M104 22 h-18 v18 M196 22 h18 v18 M104 108 h-18 v-18 M196 108 h18 v-18" />
                </g>
                <circle cx="150" cy="66" r="36" fill="#f4c7a1" />
                <path d="M114 58 q36 -44 72 0 q-4 -24 -36 -26 q-32 2 -36 26z" fill="#3a2a1e" />
                <g class="scan-dots" fill="#ff6b9a" stroke="#fff" stroke-width="2">
                  <circle cx="137" cy="62" r="5" /><circle cx="163" cy="62" r="5" /><circle cx="150" cy="76" r="5" />
                  <circle cx="140" cy="88" r="4" /><circle cx="160" cy="88" r="4" />
                </g>
                <line class="scan" x1="96" x2="204" y1="30" y2="30" stroke="#22b573" stroke-width="3" />
              </svg>
              <svg v-else-if="l.art === 'traffic'" viewBox="0 0 300 130">
                <rect width="300" height="130" fill="#a6d98f" />
                <rect x="0" y="50" width="300" height="32" fill="#3a4a6b" />
                <rect x="134" y="0" width="32" height="130" fill="#3a4a6b" />
                <line x1="0" y1="66" x2="300" y2="66" stroke="#ffd166" stroke-width="3" stroke-dasharray="12 10" class="lane" />
                <g transform="translate(196 14)">
                  <rect x="0" y="0" width="22" height="50" rx="6" fill="#1d2b4f" />
                  <circle class="tl tl--r" cx="11" cy="11" r="6" fill="#ff4d6d" />
                  <circle class="tl tl--y" cx="11" cy="25" r="6" fill="#ffd166" />
                  <circle class="tl tl--g" cx="11" cy="39" r="6" fill="#22c46e" />
                </g>
                <g class="drive-small"><rect x="0" y="56" width="34" height="18" rx="6" fill="#ef476f" /><rect x="22" y="59" width="9" height="12" rx="3" fill="#dff0ff" /></g>
              </svg>
              <svg v-else-if="l.art === 'camera'" viewBox="0 0 300 130">
                <rect width="300" height="130" fill="#f3efff" />
                <circle cx="70" cy="30" r="10" fill="#ffd166" class="twinkle" />
                <circle cx="240" cy="100" r="7" fill="#ffd166" class="twinkle" />
                <rect x="105" y="28" width="90" height="70" rx="18" fill="#ff6b9a" />
                <rect x="125" y="18" width="30" height="16" rx="6" fill="#ff6b9a" />
                <circle cx="150" cy="63" r="24" fill="#fff" />
                <circle cx="150" cy="63" r="15" fill="#8b5cf6" />
                <circle cx="144" cy="57" r="5" fill="#fff" />
                <circle cx="180" cy="40" r="5" fill="#fff" class="flash" />
              </svg>
              <svg v-else viewBox="0 0 300 130">
                <defs>
                  <pattern id="home-dust" width="16" height="16" patternUnits="userSpaceOnUse">
                    <rect width="16" height="16" fill="#f6e6c8" />
                    <circle cx="5" cy="5" r="2" fill="#c9ad83" />
                  </pattern>
                </defs>
                <rect width="300" height="130" fill="url(#home-dust)" />
                <rect width="150" height="130" fill="#fffdf6" />
                <g class="spin-slow"><RobotIcon :x="150" :y="65" :size="80" :angle="90" laser camera /></g>
              </svg>
              <span class="lcard__num">Lesson {{ l.lesson }}</span>
            </div>
            <div class="lcard__body">
              <h3>{{ l.icon }} {{ l.title }}</h3>
              <p class="lcard__sub">{{ l.subtitle }}</p>
              <p class="lcard__blurb">{{ l.blurb }}</p>
              <div class="chips">
                <span class="chip">⏱ ~{{ l.minutes }} min</span>
                <span class="chip">Unit {{ l.unit }}</span>
              </div>
              <div class="lcard__foot">
                <div class="lcard__progress">
                  <template v-if="l.done">
                    <span class="mini-stars"><span v-for="n in 3" :key="n" :class="{ on: n <= l.stars }">★</span></span>
                    <small>Best: {{ l.best.score }} / {{ l.best.total }}</small>
                  </template>
                  <small v-else-if="l.visited" class="seen">👀 Explored</small>
                  <small v-else class="new">✨ Not started yet</small>
                </div>
                <button class="ai-btn ai-btn--primary go" @click="emit('open', l.slug)">
                  {{ l.visited ? '🔁 Play again' : 'Start ▶' }}
                </button>
              </div>
            </div>
          </article>

          <article class="lcard lcard--soon">
            <div class="soon__icon">🚧</div>
            <h3>More lessons coming soon!</h3>
            <p>New adventures about AI are on their way.</p>
          </article>
        </div>
      </section>

      <footer class="foot">
        <p>Your progress is saved only on this device. 🔒</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.home { min-height: 100vh; }
.wrap { max-width: 1120px; margin: 0 auto; padding: 24px 16px 40px; display: flex; flex-direction: column; gap: 28px; }

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  gap: 24px;
  align-items: center;
  background: linear-gradient(135deg, #ffffff 0%, #eef6ff 60%, #fff6dd 100%);
  padding: 28px;
}
@media (max-width: 820px) { .hero { grid-template-columns: 1fr; padding: 20px; } }
.hero__text { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
.hero h1 { font-size: clamp(44px, 7vw, 76px); color: var(--ai-primary-dark); line-height: 1; }
.hero p { font-size: 20px; color: var(--ai-ink-soft); max-width: 460px; }
.stats { display: flex; flex-wrap: wrap; gap: 8px; }
.stat { background: #fff; border-radius: 999px; padding: 6px 14px; font-weight: 700; box-shadow: inset 0 0 0 2px var(--ai-line); }

.hero__scene { position: relative; }
.scene { width: 100%; height: auto; border-radius: 20px; }
.floor {
  position: absolute; right: 18px; bottom: -22px; width: 92px; height: 92px; border-radius: 50%;
  background: #fff; box-shadow: var(--ai-shadow); display: grid; place-items: center;
  animation: float 3s ease-in-out infinite;
}
.robo { width: 74px; height: 74px; }
@keyframes float { 50% { transform: translateY(-8px) rotate(-6deg); } }

.lane { stroke-dasharray: 28 22; animation: lane 0.9s linear infinite; }
@keyframes lane { to { stroke-dashoffset: -50; } }
.drive { animation: drive 8s linear infinite; }
@keyframes drive { from { transform: translateX(-160px); } to { transform: translateX(640px); } }
.ping { transform-box: fill-box; transform-origin: center; animation: ping 1.8s ease-out infinite; }
.ping--2 { animation-delay: 0.9s; }
@keyframes ping { from { transform: scale(0.2); opacity: 0.9; } to { transform: scale(1); opacity: 0; } }
.bob { animation: bob 1.2s ease-in-out infinite; }
@keyframes bob { 50% { transform: translateY(-3px); } }
.spin-slow { transform-box: view-box; transform-origin: 150px 65px; animation: wobble 3s ease-in-out infinite; }
@keyframes wobble { 50% { transform: rotate(12deg); } }

.lessons { display: flex; flex-direction: column; gap: 14px; }
.lessons h2 { font-size: clamp(28px, 4vw, 38px); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px; }

.lcard { padding: 0; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.15s; }
.lcard:hover { transform: translateY(-4px); }
.lcard__art { position: relative; border-bottom: 5px solid var(--c, var(--ai-primary)); }
.lcard__art svg { width: 100%; height: auto; }
.lcard__num {
  position: absolute; top: 12px; left: 12px; background: var(--c, var(--ai-primary)); color: #fff;
  font-family: var(--ai-font-head); font-weight: 800; font-size: 16px; padding: 3px 14px; border-radius: 999px;
}
.lcard__body { padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.lcard h3 { font-size: 26px; }
.lcard__sub { font-weight: 800; color: var(--c, var(--ai-primary-dark)); font-size: 16px; }
.lcard__blurb { color: var(--ai-ink-soft); font-size: 16px; }
.chips { display: flex; gap: 6px; flex-wrap: wrap; }
.chip { font-size: 13px; font-weight: 800; background: #f0f5fd; color: var(--ai-ink-soft); padding: 3px 10px; border-radius: 999px; }
.lcard__foot { margin-top: auto; padding-top: 8px; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.lcard__progress { display: flex; flex-direction: column; gap: 2px; }
.lcard__progress small { color: var(--ai-ink-soft); font-weight: 700; }
.lcard__progress .new { color: var(--ai-purple); }
.lcard__progress .seen { color: var(--ai-green); }
.scan { animation: scan 2s ease-in-out infinite alternate; }
@keyframes scan { to { transform: translateY(72px); } }
.scan-dots circle { animation: pulse-dot 1.6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes pulse-dot { 50% { transform: scale(1.3); } }
.tl { opacity: 0.25; animation: tl 3s steps(1) infinite; }
.tl--r { animation-delay: 0s; }
.tl--y { animation-delay: -2s; }
.tl--g { animation-delay: -1s; }
@keyframes tl { 0% { opacity: 1; } 33% { opacity: 0.25; } }
.drive-small { animation: drive-s 4s linear infinite; }
@keyframes drive-s { from { transform: translateX(-40px); } to { transform: translateX(320px); } }
.twinkle { animation: twinkle 1.4s ease-in-out infinite; }
@keyframes twinkle { 50% { opacity: 0.3; } }
.flash { animation: flash 2s ease-in-out infinite; }
@keyframes flash { 0%, 90%, 100% { opacity: 0.4; } 95% { opacity: 1; } }
.mini-stars { font-size: 22px; letter-spacing: 2px; line-height: 1; }
.mini-stars span { color: #dfe6f2; }
.mini-stars span.on { color: var(--ai-accent); }
.go { white-space: nowrap; }

.lcard--soon {
  border: 3px dashed var(--ai-line); background: transparent; box-shadow: none; align-items: center; justify-content: center;
  text-align: center; padding: 30px 20px; gap: 8px; min-height: 260px; color: var(--ai-ink-soft);
}
.lcard--soon:hover { transform: none; }
.soon__icon { font-size: 52px; }
.lcard--soon h3 { font-size: 22px; color: var(--ai-ink); }

.foot { text-align: center; color: var(--ai-ink-soft); font-weight: 700; font-size: 15px; }
</style>
