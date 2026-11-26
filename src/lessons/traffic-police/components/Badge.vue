<script setup>
/** Round chapter badge (ported from the original lesson's badge art). */
import { computed } from 'vue'
const props = defineProps({ b: { type: Object, required: true }, size: { type: Number, default: 84 } })
const BICON = {
  light: `<rect x="-26" y="-56" width="52" height="112" rx="14" fill="#1f2233"/><circle cy="-30" r="13" fill="#ff3b3b"/><circle cy="0" r="13" fill="#ffc93c"/><circle cy="30" r="13" fill="#2fe08a"/>`,
  cam: `<rect x="-52" y="-26" width="90" height="50" rx="12" fill="#fff" stroke="#1d2b64" stroke-width="6"/><circle cx="-30" cy="0" r="14" fill="#1d2b64"/><circle cx="-30" cy="0" r="6" fill="#3a86ff"/><rect x="38" y="-12" width="22" height="22" rx="4" fill="#1d2b64"/><circle cx="20" cy="-12" r="5" fill="#ff3b3b"/>`,
  drone: `<g stroke="#1d2b64" stroke-width="8"><line x1="-36" y1="-36" x2="36" y2="36"/><line x1="36" y1="-36" x2="-36" y2="36"/></g>${[[-36, -36], [36, -36], [-36, 36], [36, 36]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="18" fill="rgba(255,255,255,.8)" stroke="#1d2b64" stroke-width="4"/>`).join('')}<rect x="-16" y="-16" width="32" height="32" rx="8" fill="#ffc93c" stroke="#1d2b64" stroke-width="4"/>`,
  brain: `<path d="M-8,-48 C-40,-52 -60,-26 -50,-4 C-64,10 -52,40 -24,40 C-14,54 6,50 8,40 L8,-44Z" fill="#ff9ec7" stroke="#1d2b64" stroke-width="5"/><path d="M8,-44 C40,-52 60,-26 50,-4 C64,10 52,40 24,40 C14,54 2,50 8,40Z" fill="#ffb3d3" stroke="#1d2b64" stroke-width="5"/><path d="M-30,-20 Q-16,-10 -30,4 M30,-20 Q16,-10 30,4 M-20,22 Q-8,16 -4,26 M20,22 Q8,16 4,26" stroke="#1d2b64" stroke-width="4" fill="none"/>`,
  leaf: `<path d="M-40,40 C-50,-30 10,-60 52,-52 C56,-6 30,46 -40,40Z" fill="#21c48d" stroke="#1d2b64" stroke-width="6"/><path d="M-40,40 C-10,10 14,-14 36,-36" stroke="#1d2b64" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="-38" cy="-30" r="14" fill="#3a86ff" stroke="#1d2b64" stroke-width="4"/>`,
  heart: `<path d="M0,44 C-60,6 -54,-46 -18,-46 C-6,-46 0,-36 0,-30 C0,-36 6,-46 18,-46 C54,-46 60,6 0,44Z" fill="#ff5a5f" stroke="#1d2b64" stroke-width="6"/><path d="M-24,-26 Q-30,-16 -26,-6" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none"/>`,
}
const svg = computed(() => {
  const b = props.b
  return `<defs><linearGradient id="tpbg${b.n}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${b.c1}"/><stop offset="1" stop-color="${b.c2}"/></linearGradient></defs>
  <g>${Array.from({ length: 16 }, (_, i) => `<polygon points="0,-148 10,-118 -10,-118" fill="${b.c2}" opacity=".6" transform="rotate(${i * 22.5})"/>`).join('')}</g>
  <circle r="118" fill="#fff"/><circle r="108" fill="url(#tpbg${b.n})"/><circle r="92" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="4 10"/>
  <circle r="74" fill="#fff"/><g transform="scale(.95)">${BICON[b.icon]}</g>
  <path d="M-120,70 L120,70 L104,100 L120,130 L-120,130 L-104,100Z" fill="#1d2b64"/><text y="108" text-anchor="middle" fill="#fff" font-size="22" font-weight="700" font-family="Baloo 2,Nunito,sans-serif">★ ${b.n} ★</text>`
})
</script>

<template>
  <svg :width="size" :height="size" viewBox="-150 -150 300 300" role="img" :aria-label="b.name" v-html="svg"></svg>
</template>
