<script setup>
/**
 * "Learn" step: Lumi says a line, then 2–4 big picture cards you flip through.
 * card.art is a list of tokens: plain strings (emoji), { icon: 'i-cam' }, { year: '1886' },
 * { symbol: 'car1886' }, { lumi: true } or { arrow: true }.
 */
import { ref } from 'vue'
import LumiSay from './LumiSay.vue'
import Icon from './Icon.vue'
import LumiCar from '../../../shared/mascots/LumiCar.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'

const props = defineProps({
  line: { type: String, required: true },
  cards: { type: Array, required: true },
  tip: { type: String, default: '' },
})
defineEmits(['next'])

const i = ref(0)
const dir = ref(1)
const seen = ref(new Set([0]))
function goTo(k) {
  if (k < 0 || k >= props.cards.length) return
  dir.value = k > i.value ? 1 : -1
  i.value = k
  seen.value.add(k)
}
</script>

<template>
  <section class="ai-scene">
    <LumiSay :text="line" />

    <div class="deck">
      <Transition :name="dir > 0 ? 'card-next' : 'card-prev'" mode="out-in">
        <article :key="i" class="ai-card lcard">
          <div class="lcard__art" aria-hidden="true">
            <template v-for="(a, k) in cards[i].art" :key="k">
              <span v-if="typeof a === 'string'" class="emo">{{ a }}</span>
              <span v-else-if="a.year" class="yr">{{ a.year }}</span>
              <span v-else-if="a.arrow" class="arrow">→</span>
              <Icon v-else-if="a.icon" :name="a.icon" class="art-icon" />
              <svg v-else-if="a.symbol" class="art-svg" viewBox="0 0 120 80"><use :href="`#sd-${a.symbol}`" width="120" height="80" /></svg>
              <svg v-else-if="a.lumi" class="art-svg" viewBox="0 0 120 72"><LumiCar /></svg>
            </template>
          </div>
          <span class="lcard__n">{{ i + 1 }} / {{ cards.length }}</span>
          <h2>{{ cards[i].title }}</h2>
          <p>{{ cards[i].text }}</p>
        </article>
      </Transition>
    </div>

    <div class="lnav">
      <button class="ai-btn round" :disabled="i === 0" aria-label="Previous card" @click="goTo(i - 1)">◀</button>
      <div class="ldots">
        <button
          v-for="(_, k) in cards"
          :key="k"
          class="ldot"
          :class="{ on: k === i, seen: seen.has(k) }"
          :aria-label="`Card ${k + 1}`"
          @click="goTo(k)"
        ></button>
      </div>
      <button v-if="i < cards.length - 1" class="ai-btn ai-btn--primary round" aria-label="Next card" @click="goTo(i + 1)">▶</button>
      <button v-else class="ai-btn ai-btn--green" @click="$emit('next')">Got it! ✓</button>
    </div>

    <TeacherTip v-if="tip" :text="tip" />
  </section>
</template>

<style scoped>
.deck { overflow: hidden; padding: 4px 2px 10px; }
.lcard { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; padding: 22px 20px 26px; position: relative; }
.lcard__art {
  width: 100%;
  height: clamp(140px, 26vh, 220px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(180deg, #eef6ff, #f8fbff);
  border-radius: 20px;
  font-size: clamp(54px, 9vw, 90px);
  line-height: 1;
}
.emo { display: inline-block; animation: hop 2.4s ease-in-out infinite; }
.emo:nth-child(2) { animation-delay: 0.2s; }
.emo:nth-child(3) { animation-delay: 0.4s; }
@keyframes hop { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-8px); } }
.yr { font-family: var(--ai-font-head); font-weight: 800; font-size: 0.55em; color: var(--ai-green); }
.arrow { font-size: 0.5em; color: var(--ai-ink-soft); }
.art-icon { width: clamp(60px, 9vw, 92px); height: clamp(60px, 9vw, 92px); }
.art-svg { height: 85%; width: auto; max-width: 70%; }
.lcard__n {
  position: absolute; top: 12px; right: 14px; font-weight: 800; font-size: 14px;
  color: var(--ai-ink-soft); background: #fff; border-radius: 999px; padding: 2px 10px;
}
.lcard h2 { font-size: clamp(28px, 4vw, 40px); color: var(--ai-primary-dark); }
.lcard p { font-size: clamp(19px, 2.4vw, 23px); font-weight: 700; color: var(--ai-ink-soft); max-width: 36ch; }

.lnav { display: flex; align-items: center; justify-content: center; gap: 16px; }
.round { width: 54px; height: 54px; padding: 0; font-size: 20px; }
.ldots { display: flex; gap: 8px; }
.ldot { width: 14px; height: 14px; border-radius: 50%; border: 0; padding: 0; background: var(--ai-line); cursor: pointer; transition: transform 0.2s, background 0.2s; }
.ldot.seen { background: #9cc0fb; }
.ldot.on { background: var(--ai-primary); transform: scale(1.35); }

.card-next-enter-active, .card-next-leave-active, .card-prev-enter-active, .card-prev-leave-active { transition: all 0.22s ease; }
.card-next-enter-from, .card-prev-leave-to { opacity: 0; transform: translateX(40px); }
.card-next-leave-to, .card-prev-enter-from { opacity: 0; transform: translateX(-40px); }
</style>
