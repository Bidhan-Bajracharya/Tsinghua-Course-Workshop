<script setup>
// A simple SVG portrait. Every visual change a "beauty filter" makes is a prop on `look`.
// With `spotsClickable`, each blemish becomes a tap target (used by the "remove the spots" game).
import { computed } from 'vue'
import { FACE_SPOTS } from './faceSpots.js'

const DEFAULT_LOOK = {
  skin: '#e9b98f',
  hair: '#4a3020',
  lips: '#c97b6b',
  eyeShadow: null, // color or null
  blush: null, // color or null
  blemishes: false,
  glasses: false,
  faceWidth: 1, // < 1 makes the face slimmer
  eyeSize: 1, // > 1 makes the eyes bigger
  filter: 'none', // CSS filter, e.g. 'grayscale(1)'
}

const EYES = [
  { x: 78, y: 112 },
  { x: 122, y: 112 },
]

const props = defineProps({
  look: { type: Object, default: () => ({}) },
  label: { type: String, default: '' },
  // Indexes (into FACE_SPOTS) of blemishes that have been removed.
  removedSpots: { type: Array, default: () => [] },
  spotsClickable: { type: Boolean, default: false },
})

const emit = defineEmits(['spot-click'])

const face = computed(() => ({ ...DEFAULT_LOOK, ...props.look }))
const faceRx = computed(() => 62 * face.value.faceWidth)
const eyeRadius = computed(() => 7 * face.value.eyeSize)
const visibleSpots = computed(() =>
  FACE_SPOTS.map((spot, index) => ({ ...spot, index })).filter((spot) => !props.removedSpots.includes(spot.index)),
)
</script>

<template>
  <svg class="cartoon-face" viewBox="0 0 200 220" role="img" :aria-label="label" :style="{ filter: face.filter }">
    <!-- hair (back) and neck -->
    <ellipse cx="100" cy="104" :rx="faceRx + 16" ry="94" :fill="face.hair" />
    <rect x="84" y="180" width="32" height="40" :fill="face.skin" />

    <!-- face and fringe -->
    <ellipse cx="100" cy="118" :rx="faceRx" ry="80" :fill="face.skin" />
    <path d="M36 98 Q46 26 100 26 Q154 26 164 98 Q142 58 100 60 Q58 58 36 98Z" :fill="face.hair" />

    <!-- makeup layers -->
    <template v-if="face.eyeShadow">
      <ellipse v-for="eye in EYES" :key="`shadow-${eye.x}`" :cx="eye.x" :cy="eye.y - 7" rx="14" ry="8"
        :fill="face.eyeShadow" opacity="0.7" />
    </template>
    <template v-if="face.blush">
      <ellipse cx="66" cy="142" rx="13" ry="7" :fill="face.blush" opacity="0.5" />
      <ellipse cx="134" cy="142" rx="13" ry="7" :fill="face.blush" opacity="0.5" />
    </template>

    <!-- eyes -->
    <g v-for="eye in EYES" :key="`eye-${eye.x}`">
      <circle :cx="eye.x" :cy="eye.y" :r="eyeRadius" fill="#2b2b2b" />
      <circle :cx="eye.x + 2" :cy="eye.y - 2" :r="eyeRadius / 3" fill="#fff" />
    </g>

    <!-- nose and mouth -->
    <path d="M100 120 Q95 134 101 138" stroke="#a87652" stroke-width="2.5" fill="none" stroke-linecap="round" />
    <path d="M82 160 Q100 178 118 160 Q100 167 82 160Z" :fill="face.lips" />

    <!-- blemishes (drawn late so their tap targets sit on top) -->
    <template v-if="face.blemishes">
      <g v-for="spot in visibleSpots" :key="`spot-${spot.index}`" :class="{ 'spot-target': spotsClickable }"
        @click="spotsClickable && emit('spot-click', spot.index)">
        <circle v-if="spotsClickable" :cx="spot.x" :cy="spot.y" r="13" fill="transparent" />
        <circle class="spot" :cx="spot.x" :cy="spot.y" :r="spot.r" fill="#9c6440" opacity="0.8" />
      </g>
    </template>

    <!-- glasses -->
    <g v-if="face.glasses" stroke="#333" stroke-width="3" fill="rgba(255,255,255,0.15)" pointer-events="none">
      <circle v-for="eye in EYES" :key="`lens-${eye.x}`" :cx="eye.x" :cy="eye.y" r="17" />
      <line x1="95" y1="112" x2="105" y2="112" />
      <line x1="61" y1="110" x2="42" y2="104" />
      <line x1="139" y1="110" x2="158" y2="104" />
    </g>
  </svg>
</template>

<style scoped>
.cartoon-face {
  width: 100%;
  height: auto;
  display: block;
  transition: filter 0.3s;
}

.spot-target {
  cursor: pointer;
}

.spot-target:hover .spot {
  stroke: var(--pink);
  stroke-width: 2;
}
</style>
