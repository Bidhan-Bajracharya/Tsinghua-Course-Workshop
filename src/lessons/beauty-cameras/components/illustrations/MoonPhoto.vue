<script setup>
// SVG moon whose sharpness follows `detail` (0 = blurry, 1 = sharp).
// `aiGuess` adds one crater that the real moon does NOT have: the AI "invented" it from
// other moon photos it learned. `markGuess` circles that crater so children can spot it.
import { computed, useId } from 'vue'

const CRATERS = [
  { x: 62, y: 60, r: 9 },
  { x: 98, y: 52, r: 5 },
  { x: 108, y: 92, r: 11 },
  { x: 70, y: 104, r: 6 },
  { x: 90, y: 120, r: 4 },
  { x: 122, y: 70, r: 4 },
  { x: 52, y: 84, r: 3.5 },
]
const INVENTED_CRATER = { x: 118, y: 118, r: 7 }
const MARIA = [
  { x: 72, y: 74, rx: 18, ry: 12 },
  { x: 104, y: 112, rx: 14, ry: 9 },
]

const props = defineProps({
  detail: { type: Number, default: 0 },
  label: { type: String, default: '' },
  aiGuess: { type: Boolean, default: false },
  markGuess: { type: Boolean, default: false },
})

// Unique ids so several moons on one page don't share SVG filters.
const id = useId()
const blurId = `moon-blur-${id}`
const glowId = `moon-glow-${id}`

const craters = computed(() => (props.aiGuess ? [...CRATERS, INVENTED_CRATER] : CRATERS))
const blur = computed(() => ((1 - props.detail) * 5).toFixed(2))
const detailOpacity = computed(() => 0.2 + 0.8 * props.detail)
const brightness = computed(() => `brightness(${0.75 + 0.35 * props.detail})`)
</script>

<template>
  <svg class="moon-photo" viewBox="0 0 160 160" role="img" :aria-label="label" :style="{ filter: brightness }">
    <defs>
      <filter :id="blurId" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur :stdDeviation="blur" />
      </filter>
      <radialGradient :id="glowId" cx="40%" cy="40%">
        <stop offset="0%" stop-color="#fffbe8" />
        <stop offset="100%" stop-color="#d8d3bd" />
      </radialGradient>
    </defs>

    <rect width="160" height="160" rx="14" fill="#0d1834" />
    <g :filter="`url(#${blurId})`">
      <circle cx="80" cy="82" r="56" :fill="`url(#${glowId})`" />
      <g :opacity="detailOpacity">
        <ellipse v-for="(sea, index) in MARIA" :key="`sea-${index}`" :cx="sea.x" :cy="sea.y" :rx="sea.rx"
          :ry="sea.ry" fill="#b9b39c" />
        <g v-for="(crater, index) in craters" :key="`crater-${index}`">
          <circle :cx="crater.x" :cy="crater.y" :r="crater.r" fill="#a8a28b" />
          <circle :cx="crater.x - crater.r * 0.25" :cy="crater.y - crater.r * 0.25" :r="crater.r * 0.6"
            fill="#c9c3aa" />
        </g>
      </g>
    </g>

    <circle v-if="aiGuess && markGuess" class="guess-mark" :cx="INVENTED_CRATER.x" :cy="INVENTED_CRATER.y"
      :r="INVENTED_CRATER.r + 7" />
  </svg>
</template>

<style scoped>
.moon-photo {
  width: 100%;
  height: auto;
  display: block;
}

.guess-mark {
  fill: none;
  stroke: #ff4d4f;
  stroke-width: 3;
  stroke-dasharray: 5 4;
}
</style>
