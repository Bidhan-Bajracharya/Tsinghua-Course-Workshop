<script setup>
/** Cartoon cat or dog head. a = { t: 'cat' | 'dog', c: 'orange' | 'black' | 'white' | 'grey' | 'brown' } */
import { computed } from 'vue'
const props = defineProps({ a: { type: Object, required: true } })
const FUR = { orange: '#f28c28', black: '#2d2d33', white: '#f4f1ea', grey: '#9aa3ad', brown: '#9a6334' }
const c = computed(() => {
  const f = FUR[props.a.c]
  return {
    f,
    eye: props.a.c === 'black' ? '#ffd84a' : '#1d2b4f',
    out: props.a.c === 'white' ? '#c9c2b5' : f,
    wh: props.a.c === 'black' ? '#d9d9e0' : '#1d2b4f',
  }
})
</script>

<template>
  <svg viewBox="0 0 160 150" role="img" :aria-label="`${a.c} ${a.t}`" class="animal">
    <template v-if="a.t === 'cat'">
      <path d="M36 74 L44 16 L80 50 Z" :fill="c.f" :stroke="c.out" stroke-width="3" stroke-linejoin="round" />
      <path d="M124 74 L116 16 L80 50 Z" :fill="c.f" :stroke="c.out" stroke-width="3" stroke-linejoin="round" />
      <path d="M46 56 L50 30 L64 46 Z" fill="#ff9fb0" /><path d="M114 56 L110 30 L96 46 Z" fill="#ff9fb0" />
      <circle cx="80" cy="88" r="52" :fill="c.f" :stroke="c.out" stroke-width="3" />
      <ellipse cx="60" cy="82" rx="7" ry="10" :fill="c.eye" /><ellipse cx="100" cy="82" rx="7" ry="10" :fill="c.eye" />
      <path d="M73 98 L87 98 L80 106 Z" fill="#ff7a90" />
      <path d="M80 106 Q72 116 66 110 M80 106 Q88 116 94 110" fill="none" :stroke="c.wh" stroke-width="3" stroke-linecap="round" />
      <path d="M60 102 L22 96 M60 108 L22 112 M100 102 L138 96 M100 108 L138 112" :stroke="c.wh" stroke-width="3" stroke-linecap="round" />
    </template>
    <template v-else>
      <circle cx="80" cy="84" r="52" :fill="c.f" :stroke="c.out" stroke-width="3" />
      <ellipse cx="34" cy="80" rx="17" ry="36" transform="rotate(14 34 80)" :fill="c.f" :stroke="c.out" stroke-width="3" />
      <ellipse cx="34" cy="80" rx="17" ry="36" transform="rotate(14 34 80)" fill="#000" opacity=".22" />
      <ellipse cx="126" cy="80" rx="17" ry="36" transform="rotate(-14 126 80)" :fill="c.f" :stroke="c.out" stroke-width="3" />
      <ellipse cx="126" cy="80" rx="17" ry="36" transform="rotate(-14 126 80)" fill="#000" opacity=".22" />
      <circle cx="62" cy="76" r="7" :fill="c.eye" /><circle cx="98" cy="76" r="7" :fill="c.eye" />
      <ellipse cx="80" cy="100" rx="15" ry="11" fill="#141418" /><circle cx="75" cy="96" r="3" fill="#fff" opacity=".6" />
      <path d="M80 111 Q70 122 62 116 M80 111 Q90 122 98 116" fill="none" stroke="#141418" stroke-width="3" stroke-linecap="round" />
      <ellipse cx="80" cy="126" rx="9" ry="11" fill="#ff7a90" />
    </template>
  </svg>
</template>

<style scoped>
.animal { display: block; width: 100%; height: auto; }
</style>
