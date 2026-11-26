<script setup>
/** Lumi the self-driving car as an SVG <g>. (x, y) is the top-left corner. */
import { LUMI_PARTS, LUMI_W } from './lumi'

defineProps({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  width: { type: Number, default: 120 },
  flip: { type: Boolean, default: false }, // face left
})
</script>

<template>
  <g :transform="`translate(${x} ${y}) scale(${width / LUMI_W})`">
    <g :transform="flip ? `translate(${LUMI_W} 0) scale(-1 1)` : undefined">
      <template v-for="(p, i) in LUMI_PARTS" :key="i">
        <rect v-if="p.t === 'rect'" :x="p.x" :y="p.y" :width="p.w" :height="p.h" :rx="p.r" :fill="p.fill" />
        <circle v-else-if="p.t === 'circle'" :cx="p.cx" :cy="p.cy" :r="p.r" :fill="p.fill" />
        <path
          v-else
          :d="p.d"
          :fill="p.fill || 'none'"
          :stroke="p.stroke || 'none'"
          :stroke-width="p.sw || 0"
          stroke-linecap="round"
        />
      </template>
      <slot />
    </g>
  </g>
</template>
