<script setup>
/**
 * Top-down cartoon robot vacuum, drawn as an SVG <g>.
 * Use it inside any <svg>. Centre is (x, y); front points "up" at angle 0,
 * angle 90 = facing right.
 */
defineProps({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  size: { type: Number, default: 100 }, // diameter in SVG units
  angle: { type: Number, default: 0 },
  laser: { type: Boolean, default: false },
  camera: { type: Boolean, default: false },
  mood: { type: String, default: 'happy' }, // 'happy' | 'dizzy'
  color: { type: String, default: '#2f7cf6' },
})
</script>

<template>
  <g :transform="`translate(${x} ${y}) rotate(${angle}) scale(${size / 100})`">
    <circle r="50" fill="#eef3fb" stroke="#3a4a6b" stroke-width="4" />
    <circle r="39" fill="none" stroke="#d3dcec" stroke-width="2" />
    <!-- bumper -->
    <path d="M -44 -22 A 50 50 0 0 1 44 -22" :stroke="color" stroke-width="8" fill="none" stroke-linecap="round" />
    <!-- eyes -->
    <template v-if="mood === 'dizzy'">
      <path d="M -19 -27 l 9 9 M -10 -27 l -9 9 M 10 -27 l 9 9 M 19 -27 l -9 9" stroke="#1d2b4f" stroke-width="3.5" stroke-linecap="round" />
    </template>
    <template v-else>
      <circle cx="-14" cy="-22" r="6.5" fill="#1d2b4f" />
      <circle cx="14" cy="-22" r="6.5" fill="#1d2b4f" />
      <circle cx="-12" cy="-24" r="2.2" fill="#fff" />
      <circle cx="16" cy="-24" r="2.2" fill="#fff" />
    </template>
    <!-- laser turret -->
    <circle cy="8" r="14" :fill="laser ? '#2f3b55' : '#c3cde0'" />
    <circle v-if="laser" cy="8" r="5" fill="#ef476f" />
    <!-- camera -->
    <g v-if="camera">
      <rect x="-9" y="-48" width="18" height="10" rx="4" fill="#1d2b4f" />
      <circle cy="-43" r="3.2" fill="#a78bfa" />
    </g>
    <!-- dust bin -->
    <rect x="-17" y="28" width="34" height="11" rx="5" fill="#cdd6e8" />
  </g>
</template>
