<script setup>
// Concept cards that start face-down: tap to flip and read.
import { ref } from 'vue'
import { useLocale } from '../../i18n/useLocale.js'
import { ui } from '../../i18n/ui.js'

const CARD_COLORS = ['var(--pink-soft)', 'var(--purple-soft)', 'var(--yellow-soft)']

defineProps({
  cards: { type: Array, required: true },
})

const { t } = useLocale()
const flipped = ref(new Set())

function flip(index) {
  const next = new Set(flipped.value)
  next.has(index) ? next.delete(index) : next.add(index)
  flipped.value = next
}
</script>

<template>
  <div class="flip-cards">
    <button
      v-for="(card, index) in cards"
      :key="index"
      type="button"
      class="flip-card"
      :class="{ flipped: flipped.has(index) }"
      :aria-pressed="flipped.has(index)"
      :style="{ '--card-color': CARD_COLORS[index % CARD_COLORS.length] }"
      @click="flip(index)"
    >
      <span class="flip-inner">
        <span class="face front">
          <span class="card-icon" aria-hidden="true">{{ card.icon }}</span>
          <span class="card-title">{{ t(card.title) }}</span>
          <span class="tap-hint">👆 {{ t(ui.tapToFlip) }}</span>
        </span>
        <span class="face back">
          <span class="card-icon small" aria-hidden="true">{{ card.icon }}</span>
          <span class="card-text">{{ t(card.text) }}</span>
        </span>
      </span>
    </button>
  </div>
</template>

<style scoped>
.flip-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
  gap: 16px;
}

.flip-card {
  height: 190px;
  padding: 0;
  border: 0;
  background: none;
  perspective: 900px;
}

.flip-inner {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  transition: transform 0.5s;
  transform-style: preserve-3d;
}

.flipped .flip-inner {
  transform: rotateY(180deg);
}

.face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px;
  border: var(--outline);
  border-radius: var(--radius-lg);
  box-shadow: var(--pop-small);
  backface-visibility: hidden;
}

.front {
  background: var(--card-color);
}

.back {
  background: #fff;
  transform: rotateY(180deg);
}

.card-icon {
  font-size: 3rem;
  line-height: 1;
}

.card-icon.small {
  font-size: 1.8rem;
}

.card-title {
  font-family: var(--font-fun);
  font-size: 1.4rem;
  font-weight: 800;
}

.tap-hint {
  font-size: 0.9rem;
  color: var(--muted);
  font-weight: 700;
}

.card-text {
  font-size: 1.1rem;
  font-weight: 700;
}
</style>
