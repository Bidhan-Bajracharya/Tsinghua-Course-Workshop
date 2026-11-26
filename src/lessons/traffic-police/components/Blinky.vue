<script setup>
/** Blinky, the lesson's traffic-light guide (in a police cap). Renders a full <svg>. */
defineProps({ light: { type: String, default: 'cycle' } }) // 'cycle' | 'red' | 'yellow' | 'green'
</script>

<template>
  <svg class="blinky" :class="`l-${light}`" viewBox="0 0 120 200" aria-hidden="true">
    <rect x="52" y="150" width="16" height="40" rx="6" fill="#5a6a8c" />
    <rect x="36" y="186" width="48" height="10" rx="5" fill="#5a6a8c" />
    <rect x="14" y="24" width="92" height="136" rx="30" fill="#1d2b4f" />
    <circle class="lamp lamp--r" cx="60" cy="58" r="15" fill="#ef476f" />
    <circle class="lamp lamp--y" cx="60" cy="100" r="22" fill="#ffb703" />
    <circle class="eye" cx="52" cy="96" r="3.6" fill="#1d2b4f" />
    <circle class="eye" cx="68" cy="96" r="3.6" fill="#1d2b4f" />
    <path d="M51 106 Q60 114 69 106" fill="none" stroke="#1d2b4f" stroke-width="3.5" stroke-linecap="round" />
    <circle class="lamp lamp--g" cx="60" cy="140" r="13" fill="#22b573" />
    <path d="M16 34 Q60 -6 104 34 Z" fill="#2f7cf6" />
    <rect x="8" y="30" width="104" height="10" rx="5" fill="#1d2b4f" />
    <circle cx="60" cy="20" r="6" fill="#ffd166" />
  </svg>
</template>

<style scoped>
.blinky { display: block; }
.eye { transform-box: fill-box; transform-origin: center; animation: look 4s ease-in-out infinite; }
@keyframes look { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
.l-cycle .lamp--r { animation: lampR 3s infinite; }
.l-cycle .lamp--g { animation: lampG 3s infinite; }
@keyframes lampR { 0%, 45% { opacity: 1; } 50%, 100% { opacity: 0.35; } }
@keyframes lampG { 0%, 45% { opacity: 0.35; } 50%, 100% { opacity: 1; } }
.l-red .lamp--g, .l-green .lamp--r { opacity: 0.3; }
@media (prefers-reduced-motion: reduce) { .eye, .lamp { animation: none !important; } }
</style>
