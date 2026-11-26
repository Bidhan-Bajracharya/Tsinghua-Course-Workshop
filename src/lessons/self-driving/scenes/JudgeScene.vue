<script setup>
import { ref, computed } from 'vue'
import LumiSay from '../components/LumiSay.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { JUDGE } from '../data/content'

defineEmits(['next'])
const ji = ref(0)
const score = ref(0)
const choice = ref(null)
const j = computed(() => JUDGE[ji.value])
const done = computed(() => ji.value >= JUDGE.length)

function judge(k) {
  if (choice.value) return
  choice.value = k
  if (k === j.value.a) score.value++
}
function next() {
  choice.value = null
  ji.value++
}
function restart() {
  ji.value = 0
  score.value = 0
  choice.value = null
}
</script>

<template>
  <section class="ai-scene">
    <template v-if="!done">
      <LumiSay text="Responsible or not? You be the judge!" />
      <Transition name="swap" mode="out-in">
        <div :key="ji" class="ai-card card">
          <span class="card__n">{{ ji + 1 }} / {{ JUDGE.length }}</span>
          <span class="card__e">{{ j.e }}</span>
          <h2>{{ j.t }}</h2>
          <div class="thumbs">
            <button class="thumb up" :disabled="choice && choice !== 'up'" @click="judge('up')"><span>👍</span>Responsible</button>
            <button class="thumb down" :disabled="choice && choice !== 'down'" @click="judge('down')"><span>👎</span>Not responsible</button>
          </div>
          <p v-if="choice" class="fb" :class="choice === j.a ? 'ok' : 'mid'">
            <b>{{ choice === j.a ? 'Agreed! ' : 'Lumi thinks differently: ' }}</b>{{ j.w }}
          </p>
          <button v-if="choice" class="ai-btn ai-btn--primary" @click="next">Next ▶</button>
        </div>
      </Transition>
    </template>

    <template v-else>
      <LumiSay text="You are a responsible AI judge!" />
      <div class="ai-card card">
        <span class="card__e">⚖️</span>
        <h2>{{ score }} / {{ JUDGE.length }} matched Lumi’s thinking.</h2>
        <p class="sub">Can you think of ONE more responsible rule? Say it out loud!</p>
        <div class="ai-row center">
          <button class="ai-btn" @click="restart">🔁 Judge again</button>
          <button class="ai-btn ai-btn--green" @click="$emit('next')">Next ▶</button>
        </div>
      </div>
      <TeacherTip text="Disagreement is welcome. If a student disagrees with Lumi, ask them to explain. Good reasoning matters more than matching the answer." />
    </template>
  </section>
</template>

<style scoped>
.card { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; padding: 26px 20px; }
.card__n { position: absolute; top: 12px; right: 14px; font-weight: 800; color: var(--ai-ink-soft); font-size: 14px; }
.card__e { font-size: clamp(60px, 10vw, 90px); line-height: 1; }
.card h2 { font-size: clamp(22px, 3.4vw, 32px); max-width: 28ch; }
.sub { color: var(--ai-ink-soft); font-weight: 700; font-size: 19px; }
.thumbs { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: min(560px, 100%); }
.thumb {
  border: 0; border-radius: 20px; padding: 14px 8px; cursor: pointer; color: #fff;
  font-family: var(--ai-font-head); font-weight: 800; font-size: clamp(18px, 2.6vw, 22px);
  display: flex; flex-direction: column; align-items: center; gap: 2px; transition: transform 0.12s, opacity 0.2s;
}
.thumb span { font-size: 40px; line-height: 1; }
.thumb:hover:not(:disabled) { transform: translateY(-2px); }
.thumb:disabled { opacity: 0.3; cursor: default; }
.thumb.up { background: var(--ai-green); box-shadow: 0 5px 0 #17895a; }
.thumb.down { background: var(--ai-red); box-shadow: 0 5px 0 #b8264a; }
.fb { font-size: 19px; border-radius: 16px; padding: 10px 16px; }
.fb.ok { background: #e3f8ee; color: #137a4f; }
.fb.mid { background: #fff4d6; color: #7a5600; }
.center { justify-content: center; }
.swap-enter-active, .swap-leave-active { transition: all 0.22s ease; }
.swap-enter-from { opacity: 0; transform: translateX(24px); }
.swap-leave-to { opacity: 0; transform: translateX(-24px); }
</style>
