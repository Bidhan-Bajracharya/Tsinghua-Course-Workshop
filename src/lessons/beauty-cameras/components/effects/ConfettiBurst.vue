<script setup>
// Falling confetti over the whole screen. Change `trigger` (any new number) to fire a burst.
import { onBeforeUnmount, ref, watch } from 'vue'

const COLORS = ['#ff5c8a', '#ffc93c', '#7b61ff', '#22b573', '#ff8a3d', '#4fc3f7']
const PIECE_COUNT = 60
const DURATION_MS = 2200

const props = defineProps({
  trigger: { type: Number, default: 0 },
})

const pieces = ref([])
let timer

function burst() {
  pieces.value = Array.from({ length: PIECE_COUNT }, (_, id) => ({
    id: `${props.trigger}-${id}`,
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    duration: 1.2 + Math.random() * 0.8,
    color: COLORS[id % COLORS.length],
    rotate: Math.random() * 360,
  }))
  clearTimeout(timer)
  timer = setTimeout(() => (pieces.value = []), DURATION_MS)
}

watch(
  () => props.trigger,
  (value) => value && burst(),
)

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div v-if="pieces.length" class="confetti" aria-hidden="true">
    <span
      v-for="piece in pieces"
      :key="piece.id"
      class="piece"
      :style="{
        left: `${piece.left}%`,
        background: piece.color,
        animationDelay: `${piece.delay}s`,
        animationDuration: `${piece.duration}s`,
        transform: `rotate(${piece.rotate}deg)`,
      }"
    />
  </div>
</template>

<style scoped>
.confetti {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 50;
}

.piece {
  position: absolute;
  top: -20px;
  width: 10px;
  height: 16px;
  border-radius: 3px;
  animation-name: fall;
  animation-timing-function: ease-in;
  animation-fill-mode: forwards;
}

@keyframes fall {
  to {
    top: 105%;
    transform: rotate(720deg) translateX(40px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .confetti {
    display: none;
  }
}
</style>
