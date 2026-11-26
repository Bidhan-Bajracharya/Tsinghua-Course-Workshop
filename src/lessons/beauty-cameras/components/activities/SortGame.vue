<script setup>
// One card at a time: pick the right group.
// Used for "Face or makeup?", "Healthy or not?", "Ask first?" and "Use AI or not?".
import { computed, ref } from 'vue'
import { useLocale } from '../../i18n/useLocale.js'
import { ui } from '../../i18n/ui.js'

const NEXT_CARD_DELAY_MS = 1400

const props = defineProps({
  activity: { type: Object, required: true },
})

const emit = defineEmits(['complete'])
const { t } = useLocale()

const index = ref(0)
const feedback = ref(null) // null | 'right' | 'wrong'
const shaking = ref(false)

const items = props.activity.items
const item = computed(() => items[index.value])
const finished = computed(() => index.value >= items.length)

function choose(choiceId) {
  if (feedback.value === 'right') return

  if (choiceId !== item.value.answer) {
    feedback.value = 'wrong'
    shaking.value = true
    setTimeout(() => (shaking.value = false), 400)
    return
  }

  feedback.value = 'right'
  setTimeout(() => {
    feedback.value = null
    index.value += 1
    if (finished.value) emit('complete')
  }, NEXT_CARD_DELAY_MS)
}

function restart() {
  index.value = 0
  feedback.value = null
}
</script>

<template>
  <div class="sort-game">
    <h3 class="activity-title">🎮 {{ t(activity.title) }}</h3>
    <p class="activity-hint">{{ t(activity.instruction) }}</p>

    <div v-if="!finished" class="game">
      <div class="dots" aria-hidden="true">
        <span v-for="(dot, dotIndex) in items" :key="dot.id" class="dot" :class="{ filled: dotIndex < index }" />
      </div>
      <p class="progress-text">{{ t(ui.sortProgress, { n: index + 1, total: items.length }) }}</p>

      <div :key="item.id" class="card pop-in" :class="{ shake: shaking, right: feedback === 'right' }">
        <span class="card-emoji" aria-hidden="true">{{ item.emoji }}</span>
        <p class="card-text">{{ t(item.text) }}</p>
      </div>

      <div class="choices">
        <button
          v-for="choice in activity.choices"
          :key="choice.id"
          type="button"
          class="btn choice"
          :class="choice.id === activity.choices[0].id ? 'btn-green' : 'btn-pink'"
          :disabled="feedback === 'right'"
          @click="choose(choice.id)"
        >
          <span aria-hidden="true">{{ choice.emoji }}</span> {{ t(choice.label) }}
        </button>
      </div>

      <p class="feedback" role="status" aria-live="polite">
        <template v-if="feedback === 'right'">
          ✅ {{ t(ui.sortRight) }} <span v-if="item.tip">{{ t(item.tip) }}</span>
        </template>
        <template v-else-if="feedback === 'wrong'">🤔 {{ t(ui.sortWrong) }}</template>
      </p>
    </div>

    <div v-else class="finished pop-in">
      <p class="finished-text">🏅 {{ t(activity.doneText) }}</p>
      <button type="button" class="btn" @click="restart">🔄 {{ t(ui.playAgain) }}</button>
    </div>
  </div>
</template>

<style scoped>
.game {
  display: grid;
  justify-items: center;
  gap: 12px;
}

.dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 16px;
  height: 16px;
  border: 2px solid var(--line);
  border-radius: 50%;
  background: #fff;
}

.dot.filled {
  background: var(--yellow);
}

.progress-text {
  margin: 0;
  font-weight: 700;
  color: var(--muted);
}

.card {
  display: grid;
  justify-items: center;
  gap: 6px;
  width: min(420px, 100%);
  min-height: 170px;
  padding: 18px;
  border: var(--outline);
  border-radius: var(--radius-lg);
  background: var(--yellow-soft);
  box-shadow: var(--pop);
  text-align: center;
}

.card.right {
  background: var(--green-soft);
}

.card-emoji {
  font-size: 3.2rem;
  line-height: 1;
}

.card-text {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 800;
}

.choices {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
}

.choice {
  min-width: 150px;
  font-size: 1.25rem;
}

.feedback {
  min-height: 1.6em;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  text-align: center;
}

.finished {
  display: grid;
  justify-items: center;
  gap: 14px;
  padding: 18px;
  border: var(--outline);
  border-radius: var(--radius-lg);
  background: var(--green-soft);
}

.finished-text {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  text-align: center;
}
</style>
