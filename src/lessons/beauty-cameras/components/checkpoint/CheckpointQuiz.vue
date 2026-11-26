<script setup>
// Tap an answer to check it right away. Mistakes are part of learning:
// there is no penalty for retrying, and the explanation shows once the right answer is found.
import { ref } from 'vue'
import ConfettiBurst from '../effects/ConfettiBurst.vue'
import { useLocale } from '../../i18n/useLocale.js'
import { ui } from '../../i18n/ui.js'

const OPTION_COLORS = ['var(--pink)', 'var(--purple)', 'var(--orange)', 'var(--green)']
const LETTERS = ['A', 'B', 'C', 'D']

const props = defineProps({
  quiz: { type: Object, required: true },
})

const emit = defineEmits(['passed'])
const { t } = useLocale()

const wrongIds = ref([])
const solved = ref(false)
const shakingId = ref(null)
const confettiTrigger = ref(0)

function choose(optionId) {
  if (solved.value || wrongIds.value.includes(optionId)) return

  if (optionId === props.quiz.answer) {
    solved.value = true
    confettiTrigger.value += 1
    emit('passed')
    return
  }

  wrongIds.value.push(optionId)
  shakingId.value = optionId
  setTimeout(() => (shakingId.value = null), 400)
}

function optionState(optionId) {
  if (solved.value && optionId === props.quiz.answer) return 'is-correct'
  if (wrongIds.value.includes(optionId)) return 'is-wrong'
  return ''
}
</script>

<template>
  <div class="checkpoint">
    <ConfettiBurst :trigger="confettiTrigger" />

    <span class="chip">🏁 {{ t(ui.checkpoint) }}</span>
    <h3 class="question">{{ t(quiz.question) }}</h3>

    <div class="options" role="group" :aria-label="t(quiz.question)">
      <button
        v-for="(option, index) in quiz.options"
        :key="option.id"
        type="button"
        class="option"
        :class="[optionState(option.id), { shake: shakingId === option.id }]"
        :style="{ '--option-color': OPTION_COLORS[index % OPTION_COLORS.length] }"
        :disabled="solved || wrongIds.includes(option.id)"
        @click="choose(option.id)"
      >
        <span class="letter" aria-hidden="true">{{ LETTERS[index] }}</span>
        <span class="option-text">{{ t(option.text) }}</span>
        <span v-if="optionState(option.id) === 'is-correct'" class="mark" aria-hidden="true">✅</span>
        <span v-else-if="optionState(option.id) === 'is-wrong'" class="mark" aria-hidden="true">❌</span>
      </button>
    </div>

    <div class="feedback" role="status" aria-live="polite">
      <div v-if="solved" class="feedback-card correct pop-in">
        <p class="feedback-title">
          🎉 {{ t(ui.correct) }}
        </p>
        <p>{{ t(quiz.explanation) }}</p>
        <p class="feedback-next">{{ t(ui.levelDone) }}</p>
      </div>
      <p v-else-if="wrongIds.length" class="feedback-card wrong">🤔 {{ t(ui.tryAgain) }}</p>
    </div>
  </div>
</template>

<style scoped>
.question {
  font-size: clamp(1.4rem, 3.5vw, 1.8rem);
  margin: 12px 0 18px;
}

.options {
  display: grid;
  gap: 14px;
}

.option {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 64px;
  padding: 10px 16px;
  border: var(--outline);
  border-radius: var(--radius);
  background: #fff;
  box-shadow: var(--pop-small);
  text-align: start;
  font-size: 1.15rem;
  font-weight: 700;
  transition: transform 0.1s, background 0.2s;
}

.option:hover:not(:disabled) {
  transform: translateY(-2px);
  background: color-mix(in srgb, var(--option-color) 12%, #fff);
}

.option:disabled {
  cursor: default;
}

.letter {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: 2px solid var(--line);
  border-radius: 12px;
  background: var(--option-color);
  color: #fff;
  font-family: var(--font-fun);
  font-size: 1.3rem;
}

.option-text {
  flex: 1;
}

.mark {
  font-size: 1.5rem;
}

.option.is-correct {
  background: var(--green-soft);
  border-color: var(--green);
}

.option.is-wrong {
  background: var(--red-soft);
  opacity: 0.7;
}

.feedback {
  margin-top: 18px;
}

.feedback-card {
  margin: 0;
  padding: 14px 18px;
  border: var(--outline);
  border-radius: var(--radius);
  font-size: 1.1rem;
}

.feedback-card p {
  margin: 0 0 6px;
}

.correct {
  background: var(--green-soft);
}

.wrong {
  background: var(--yellow-soft);
  font-weight: 700;
}

.feedback-title {
  font-family: var(--font-fun);
  font-size: 1.35rem;
  font-weight: 800;
}

.feedback-next {
  font-weight: 700;
  color: var(--green);
}
</style>
