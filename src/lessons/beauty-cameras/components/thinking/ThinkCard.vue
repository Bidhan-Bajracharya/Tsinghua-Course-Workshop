<script setup>
// "What do you think?" — an open question with no wrong answer.
// After choosing, Snappy shares another point of view and a question to discuss with a partner.
import { computed, ref } from 'vue'
import { useLocale } from '../../i18n/useLocale.js'
import { ui } from '../../i18n/ui.js'

const props = defineProps({
  // { question, options: [{ id, emoji, text, reply }], partnerPrompt }
  think: { type: Object, required: true },
})

const emit = defineEmits(['answer'])
const { t } = useLocale()

const chosenId = ref(null)
const chosen = computed(() => props.think.options.find((option) => option.id === chosenId.value))

function choose(option) {
  chosenId.value = option.id
  emit('answer', { question: props.think.question, answer: option.text })
}
</script>

<template>
  <div class="think-card">
    <span class="chip">💬 {{ t(ui.whatDoYouThink) }}</span>
    <h3 class="question">{{ t(think.question) }}</h3>
    <p class="no-wrong">{{ t(ui.noWrongAnswer) }}</p>

    <div class="options">
      <button
        v-for="option in think.options"
        :key="option.id"
        type="button"
        class="option"
        :class="{ chosen: option.id === chosenId }"
        :aria-pressed="option.id === chosenId"
        @click="choose(option)"
      >
        <span class="emoji" aria-hidden="true">{{ option.emoji }}</span>
        {{ t(option.text) }}
      </button>
    </div>

    <div v-if="chosen" :key="chosen.id" class="reply pop-in" role="status">
      <p>📷 {{ t(chosen.reply) }}</p>
      <p class="partner">🗣️ {{ t(think.partnerPrompt) }}</p>
    </div>
  </div>
</template>

<style scoped>
.think-card {
  padding: 18px;
  border: var(--outline);
  border-radius: var(--radius-lg);
  background: var(--purple-soft);
}

.question {
  margin: 10px 0 2px;
  font-size: 1.45rem;
}

.no-wrong {
  margin: 0 0 12px;
  color: var(--muted);
  font-weight: 700;
}

.options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr));
  gap: 10px;
}

.option {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 56px;
  padding: 8px 14px;
  border: var(--outline);
  border-radius: var(--radius);
  background: #fff;
  box-shadow: var(--pop-small);
  text-align: start;
  font-weight: 800;
}

.option.chosen {
  background: var(--yellow);
}

.emoji {
  font-size: 1.6rem;
}

.reply {
  margin-top: 14px;
  padding: 12px 16px;
  border: var(--outline);
  border-radius: var(--radius);
  background: #fff;
  font-weight: 700;
}

.reply p {
  margin: 0;
}

.partner {
  margin-top: 8px !important;
  color: var(--purple);
}
</style>
