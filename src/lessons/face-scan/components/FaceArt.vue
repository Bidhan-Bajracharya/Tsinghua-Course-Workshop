<script setup>
/** Cartoon face drawn from measurements (see data/faces.js). `dots` shows the face-code points. */
import { computed } from 'vue'

const props = defineProps({
  p: { type: Object, required: true },
  dots: { type: Boolean, default: false },
})

const cx = 100
const cy = 118
const ey = 110
const g = computed(() => {
  const p = props.p
  const mY = cy + 40
  return {
    mY,
    ex1: cx - p.eg,
    ex2: cx + p.eg,
    nb: ey + 10 + p.nl,
  }
})
const hairBack = computed(() => {
  const p = props.p
  return `M${cx - p.w - 6} ${cy} Q${cx - p.w - 12} ${cy + 70} ${cx - p.w + 8} ${cy + 78} L${cx + p.w - 8} ${cy + 78} Q${cx + p.w + 12} ${cy + 70} ${cx + p.w + 6} ${cy} Z`
})
const hairTop = computed(() => {
  const p = props.p
  if (p.hair === 0) return `M${cx - p.w} ${cy - 6} Q${cx - p.w} ${cy - p.h - 10} ${cx} ${cy - p.h - 8} Q${cx + p.w} ${cy - p.h - 10} ${cx + p.w} ${cy - 6} Q${cx + 20} ${cy - p.h + 18} ${cx - p.w} ${cy - 6} Z`
  if (p.hair === 1) return `M${cx - p.w - 4} ${cy + 6} Q${cx - p.w} ${cy - p.h - 12} ${cx} ${cy - p.h - 10} Q${cx + p.w} ${cy - p.h - 12} ${cx + p.w + 4} ${cy + 6} Q${cx + p.w - 10} ${cy - p.h + 22} ${cx} ${cy - p.h + 20} Q${cx - p.w + 10} ${cy - p.h + 22} ${cx - p.w - 4} ${cy + 6} Z`
  return `M${cx - p.w} ${cy - 4} Q${cx - p.w} ${cy - p.h - 8} ${cx} ${cy - p.h - 6} Q${cx + p.w} ${cy - p.h - 8} ${cx + p.w} ${cy - 4} Q${cx} ${cy - p.h + 14} ${cx - p.w} ${cy - 4} Z`
})
const net = computed(() => {
  const { ex1, ex2, nb, mY } = g.value
  const mw = props.p.mw
  return `M${ex1} ${ey} L${ex2} ${ey} L${cx} ${nb} Z M${cx - mw} ${mY} L${cx + mw} ${mY} M${cx} ${nb} L${cx - mw} ${mY} M${cx} ${nb} L${cx + mw} ${mY}`
})
const points = computed(() => {
  const { ex1, ex2, nb, mY } = g.value
  const mw = props.p.mw
  return [[ex1, ey], [ex2, ey], [cx, nb], [cx - mw, mY], [cx + mw, mY]]
})
</script>

<template>
  <svg class="face" viewBox="0 0 200 210" role="img" aria-label="cartoon face">
    <path v-if="p.hair === 1" :d="hairBack" :fill="p.hc" />
    <circle :cx="cx - p.w + 2" :cy="cy + 4" r="10" :fill="p.sk" />
    <circle :cx="cx + p.w - 2" :cy="cy + 4" r="10" :fill="p.sk" />
    <ellipse :cx="cx" :cy="cy" :rx="p.w" :ry="p.h" :fill="p.sk" />
    <circle v-if="p.hair === 2" :cx="cx" :cy="cy - p.h - 14" r="18" :fill="p.hc" />
    <path :d="hairTop" :fill="p.hc" />
    <circle :cx="g.ex1" :cy="ey" :r="p.es" fill="#1d2b4f" />
    <circle :cx="g.ex2" :cy="ey" :r="p.es" fill="#1d2b4f" />
    <circle :cx="g.ex1 + p.es * 0.35" :cy="ey - p.es * 0.35" :r="p.es * 0.3" fill="#fff" />
    <circle :cx="g.ex2 + p.es * 0.35" :cy="ey - p.es * 0.35" :r="p.es * 0.3" fill="#fff" />
    <path :d="`M${cx - 1} ${ey + 8} L${cx - 6} ${g.nb} Q${cx} ${g.nb + 5} ${cx + 6} ${g.nb - 1}`" fill="none" stroke="#7a4a2c" stroke-width="3" stroke-linecap="round" opacity=".6" />
    <path :d="`M${cx - p.mw} ${g.mY} Q${cx} ${g.mY + p.mw * 0.7} ${cx + p.mw} ${g.mY}`" fill="none" stroke="#c0443f" stroke-width="4.5" stroke-linecap="round" />
    <circle :cx="cx - p.w * 0.6" :cy="g.mY - 10" r="7" fill="#ff8a8a" opacity=".35" />
    <circle :cx="cx + p.w * 0.6" :cy="g.mY - 10" r="7" fill="#ff8a8a" opacity=".35" />
    <g v-if="p.glasses" fill="none" stroke="#1d2b4f" stroke-width="3">
      <circle :cx="g.ex1" :cy="ey" :r="p.es + 8" /><circle :cx="g.ex2" :cy="ey" :r="p.es + 8" />
      <path :d="`M${g.ex1 + p.es + 8} ${ey} L${g.ex2 - p.es - 8} ${ey}`" />
    </g>
    <g v-if="p.hat">
      <path :d="`M${cx - p.w - 6} ${cy - p.h + 22} Q${cx} ${cy - p.h - 38} ${cx + p.w + 6} ${cy - p.h + 22} Z`" fill="#ef476f" />
      <rect :x="cx - p.w - 14" :y="cy - p.h + 16" :width="2 * p.w + 28" height="10" rx="5" fill="#c3264f" />
    </g>
    <g v-if="dots" class="dots">
      <path :d="net" fill="none" stroke="#ffd166" stroke-width="3" stroke-linecap="round" />
      <circle v-for="(pt, i) in points" :key="i" :cx="pt[0]" :cy="pt[1]" r="5" fill="#ff5c8a" stroke="#fff" stroke-width="2" />
    </g>
  </svg>
</template>

<style scoped>
.face { display: block; width: 100%; height: auto; }
.dots { animation: pop 0.35s ease both; }
@keyframes pop { from { opacity: 0; } }
</style>
