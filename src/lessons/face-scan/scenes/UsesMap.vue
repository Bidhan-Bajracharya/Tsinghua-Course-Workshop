<script setup>
import { ref, reactive, computed } from 'vue'
import BeepSay from '../components/BeepSay.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { USES } from '../data/content'

defineEmits(['next'])
const sel = ref(null)
const seen = reactive(new Set())
const cur = computed(() => USES.find((u) => u.k === sel.value))
function open(k) {
  sel.value = k
  seen.add(k)
}
</script>

<template>
  <section class="ai-scene">
    <BeepSay text="Face scans aren’t just ticket checkers! Tap each place on the map." />

    <div class="map">
      <div class="town ai-card">
        <button
          v-for="u in USES"
          :key="u.k"
          class="place"
          :class="{ on: sel === u.k, seen: seen.has(u.k) }"
          @click="open(u.k)"
        >
          <span class="place__e">{{ u.e }}</span>
          <span class="place__l">{{ u.l }}</span>
          <span v-if="seen.has(u.k)" class="place__tick">✓</span>
        </button>
      </div>

      <div class="side">
        <Transition name="pop" mode="out-in">
          <div v-if="cur" :key="cur.k" class="ai-card info">
            <span class="info__e">{{ cur.e }}</span>
            <h3>{{ cur.l }}</h3>
            <p class="good">👍 {{ cur.good }}</p>
            <p class="think">🤔 {{ cur.think }}</p>
          </div>
          <div v-else class="ai-card info empty">
            <span class="info__e">👆</span>
            <h3>Tap a place!</h3>
            <p>Find all {{ USES.length }} ways face recognition helps people and animals.</p>
          </div>
        </Transition>
        <div class="ai-card progress">
          <b>Places explored: {{ seen.size }} / {{ USES.length }}</b>
          <div class="ai-meter"><div class="ai-meter__fill" :style="{ width: (seen.size / USES.length) * 100 + '%' }"></div></div>
          <p v-if="seen.size === USES.length" class="all">🎉 Face scans make life easier, but each one needs care. Easy ≠ always safe!</p>
        </div>
      </div>
    </div>

    <div class="ai-row center"><button class="ai-btn ai-btn--green" @click="$emit('next')">Next: Animal Detective 🐶 ▶</button></div>

    <TeacherTip text="For each place, read the 🤔 question aloud and take one or two answers. Key idea from the textbook: face recognition brings convenience and safety, but it also needs care with privacy." />
  </section>
</template>

<style scoped>
.map { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 16px; align-items: start; }
@media (max-width: 820px) { .map { grid-template-columns: 1fr; } }
.town {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; padding: 16px;
  background: linear-gradient(#cdeec0 0 0) , #cdeec0;
  background-image: linear-gradient(90deg, transparent 48%, #d3dcec 48% 52%, transparent 52%), linear-gradient(transparent 48%, #d3dcec 48% 52%, transparent 52%);
}
@media (max-width: 520px) { .town { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.place {
  position: relative; border: 0; font: inherit; cursor: pointer; background: #fff; border-radius: 18px; padding: 14px 6px 10px;
  display: flex; flex-direction: column; align-items: center; gap: 4px; box-shadow: 0 4px 0 rgba(29, 43, 79, 0.15); transition: transform 0.12s;
}
.place:hover { transform: translateY(-3px); }
.place.on { background: #fff2e6; box-shadow: inset 0 0 0 3px #ff8a3d, 0 4px 0 #d9691f; }
.place__e { font-size: 40px; line-height: 1; }
.place__l { font-weight: 800; font-size: 14px; color: var(--ai-ink); text-align: center; }
.place__tick { position: absolute; top: 4px; right: 6px; width: 20px; height: 20px; border-radius: 50%; background: var(--ai-green); color: #fff; font-size: 12px; font-weight: 800; display: grid; place-items: center; }
.side { display: flex; flex-direction: column; gap: 12px; }
.info { display: flex; flex-direction: column; gap: 8px; min-height: 230px; }
.info__e { font-size: 54px; line-height: 1; }
.info h3 { font-size: 26px; color: #d9691f; }
.good { font-size: 18px; font-weight: 700; }
.think { background: #f3efff; border-radius: 12px; padding: 8px 12px; font-weight: 700; color: var(--ai-purple); }
.empty h3 { color: var(--ai-ink); }
.progress { display: flex; flex-direction: column; gap: 8px; }
.all { font-weight: 800; color: var(--ai-green); }
.center { justify-content: center; }
.pop-enter-active, .pop-leave-active { transition: all 0.18s ease; }
.pop-enter-from { opacity: 0; transform: scale(0.96); }
.pop-leave-to { opacity: 0; }
</style>
