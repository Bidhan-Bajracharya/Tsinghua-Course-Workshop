<script setup>
/** A dog's nose print: a unique bumpy pattern made from a seed. */
import { computed } from 'vue'
const props = defineProps({ seed: { type: Number, required: true } })
const NOSE = 'M80 18 C128 16 150 46 142 72 C134 98 104 104 80 92 C56 104 26 98 18 72 C10 46 32 16 80 18 Z'
let uid = 0
const clip = `np-${Math.random().toString(36).slice(2)}-${++uid}`
const bumps = computed(() => {
  let x = (props.seed % 2147483646) + 1
  const r = () => (x = (x * 16807) % 2147483647) / 2147483647
  return Array.from({ length: 46 }, () => [(8 + r() * 144).toFixed(1), (14 + r() * 96).toFixed(1), (3 + r() * 6).toFixed(1)])
})
</script>

<template>
  <svg class="nose" viewBox="0 0 160 120" role="img" aria-label="nose print">
    <defs><clipPath :id="clip"><path :d="NOSE" /></clipPath></defs>
    <path :d="NOSE" fill="#3a3a46" />
    <g :clip-path="`url(#${clip})`">
      <circle v-for="(b, i) in bumps" :key="i" :cx="b[0]" :cy="b[1]" :r="b[2]" fill="#6b6b7d" stroke="#25252e" stroke-width="1.5" />
    </g>
    <ellipse cx="56" cy="72" rx="13" ry="9" fill="#15151b" />
    <ellipse cx="104" cy="72" rx="13" ry="9" fill="#15151b" />
  </svg>
</template>

<style scoped>
.nose { display: block; width: 100%; height: auto; }
</style>
