<script setup>
import { ref, computed } from 'vue'
import LumiSay from '../components/LumiSay.vue'
import Certificate from '../../../shared/Certificate.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { FACES, RULES } from '../data/content'
import { useLessonState, totalStars } from '../state'

const emit = defineEmits(['next', 'complete'])
const S = useLessonState()
const stars = computed(() => totalStars(S))
const reported = ref(false)

const ruleLines = computed(() => [
  ...S.rules.map((k) => RULES.find((r) => r.k === k)).filter(Boolean).map((r) => `${r.e} ${r.l}`),
  ...(S.ownRule.trim() ? [`✏️ ${S.ownRule.trim()}`] : []),
])

function onNamed(name) {
  S.name = name
  if (!reported.value) {
    reported.value = true
    emit('complete', { score: stars.value, total: 12 })
  }
}

const first = computed(() => FACES.find((f) => f.k === S.poll1))
const now = computed(() => FACES.find((f) => f.k === S.poll2))
</script>

<template>
  <section class="ai-scene">
    <LumiSay text="We made it! You’re Road Ready! 🏁" />

    <div class="ai-card summary">
      <div class="summary__stars">
        <span v-for="n in 12" :key="n" :class="{ on: n <= stars }">★</span>
      </div>
      <p><b>{{ stars }} / 12</b> stars from the four toll gates</p>
    </div>

    <Certificate
      title="Road Ready!"
      line="Junior Self-Driving Expert, for learning how self-driving cars sense, think and act, and how to use them safely."
      unit-label="Unit 2 · Lesson 5 · Autonomous Driving"
      file-stem="Road-Ready-Certificate"
      :stars="stars"
      :max-stars="12"
      :score-text="`${stars} / 12 checkpoint stars`"
      :extras="ruleLines"
      extras-title="My rules for robot cars"
      mascot="lumi"
      signer="Lumi 🚗"
      signer-role="Chief Driving Car"
      :initial-name="S.name"
      :show-back="false"
      @named="onNamed"
    />

    <div class="ai-card poll">
      <h2>Now, would you ride in me?</h2>
      <div class="faces">
        <button v-for="f in FACES" :key="f.k" class="face" :class="{ on: S.poll2 === f.k }" :aria-pressed="S.poll2 === f.k" @click="S.poll2 = f.k">
          <span class="face__e">{{ f.e }}</span>{{ f.l }}
        </button>
      </div>
      <p v-if="now" class="compare">
        <template v-if="!first">Tell a friend one reason!</template>
        <template v-else-if="first.k === now.k">Same as before {{ first.e }}. Tell a friend one reason!</template>
        <template v-else>You changed: {{ first.e }} → {{ now.e }}. What changed your mind?</template>
      </p>
    </div>

    <TeacherTip text="Compare the first and last poll. Ask: what did you learn that changed (or kept) your mind? Both answers are fine if students can give a reason." />
  </section>
</template>

<style scoped>
.summary { display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; }
.summary__stars { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; font-size: clamp(26px, 4vw, 38px); line-height: 1; }
.summary__stars span { color: #dfe6f2; }
.summary__stars span.on { color: var(--ai-accent); text-shadow: 0 3px 0 #d99a00; }
.summary p { font-size: 19px; color: var(--ai-ink-soft); }

.poll { display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; }
.poll h2 { font-size: clamp(26px, 4vw, 36px); }
.faces { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; width: min(560px, 100%); }
.face {
  border: 0; font: inherit; font-family: var(--ai-font-head); font-weight: 800; font-size: 19px; color: var(--ai-ink);
  background: #fff; border-radius: 20px; padding: 14px 8px; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  box-shadow: inset 0 0 0 3px var(--ai-line), 0 4px 0 var(--ai-line); transition: transform 0.12s;
}
.face:hover { transform: translateY(-2px); }
.face.on { background: #fff4d6; box-shadow: inset 0 0 0 3px var(--ai-accent), 0 4px 0 #d99a00; }
.face__e { font-size: 52px; line-height: 1; }
.compare { font-family: var(--ai-font-head); font-weight: 800; font-size: 21px; color: var(--ai-purple); }
</style>
