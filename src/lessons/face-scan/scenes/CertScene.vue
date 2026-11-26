<script setup>
import { computed } from 'vue'
import BeepSay from '../components/BeepSay.vue'
import Certificate from '../../../shared/Certificate.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { QUIZ, PLEDGES } from '../data/content'
import { useLessonState } from '../state'

defineEmits(['next', 'complete'])
const S = useLessonState()
const pct = computed(() => S.quizScore / QUIZ.length)
const stars = computed(() => (!S.quizDone ? 1 : pct.value >= 0.85 ? 3 : pct.value >= 0.6 ? 2 : 1))
const promises = computed(() => PLEDGES.filter((p) => S.pledges.includes(p.k)).map((p) => `${p.e} ${p.l}`))
</script>

<template>
  <section class="ai-scene">
    <BeepSay text="Congratulations, Face Gate expert! Big clap! 👏" />
    <p v-if="!S.quizDone" class="warn">💡 Tip: finish the quiz first to get your quiz score on the certificate.</p>
    <Certificate
      title="Face Gate Expert!"
      line="for learning how computers recognise faces, and how to use AI safely, fairly and kindly."
      unit-label="Unit 2 · Lesson 1 · Face Scan Magic"
      file-stem="Face-Gate-Certificate"
      :stars="stars"
      :score-text="S.quizDone ? `Quiz: ${S.quizScore} / ${QUIZ.length} · Game stars: ${S.stars}` : `Game stars: ${S.stars}`"
      :extras="promises"
      extras-title="My green promises"
      mascot="beep"
      signer="Beep 🤖"
      signer-role="Face Gate Robot"
      :initial-name="S.name"
      :show-back="false"
      @named="(n) => (S.name = n)"
    />
    <p class="secret">🔑 My face is my secret key. I keep it safe!</p>
    <TeacherTip text="Kids type their first name only, then tap Download. The name is drawn on the device and never sent or stored. If saving doesn’t work, take a screenshot." />
  </section>
</template>

<style scoped>
.warn { background: #fff4d6; border-radius: 14px; padding: 10px 14px; font-weight: 700; text-align: center; }
.secret { text-align: center; font-family: var(--ai-font-head); font-weight: 800; font-size: 22px; color: var(--ai-green); }
</style>
