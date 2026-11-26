<script setup>
// "Snappy", the camera mascot from the original lesson. Pure SVG.
</script>

<template>
  <svg class="snappy" viewBox="0 0 120 110" aria-hidden="true">
    <rect x="22" y="18" width="26" height="14" rx="5" fill="#ffd166" stroke="#1d2b4f" stroke-width="3" />
    <rect x="80" y="22" width="18" height="10" rx="3" fill="#fff" stroke="#1d2b4f" stroke-width="3" />
    <rect x="8" y="28" width="104" height="72" rx="20" fill="#ff5c8a" stroke="#1d2b4f" stroke-width="3" />
    <circle cx="60" cy="64" r="28" fill="#fff" stroke="#1d2b4f" stroke-width="3" />
    <circle class="eye" cx="51" cy="60" r="4.5" fill="#1d2b4f" />
    <circle class="eye" cx="69" cy="60" r="4.5" fill="#1d2b4f" />
    <circle cx="52.5" cy="58.5" r="1.5" fill="#fff" />
    <circle cx="70.5" cy="58.5" r="1.5" fill="#fff" />
    <path d="M50 71 Q60 80 70 71" stroke="#1d2b4f" stroke-width="3" fill="none" stroke-linecap="round" />
    <circle cx="42" cy="70" r="4" fill="#ffb3c7" />
    <circle cx="78" cy="70" r="4" fill="#ffb3c7" />
  </svg>
</template>

<style scoped>
.snappy { display: block; width: 100%; height: auto; animation: bob 2.4s ease-in-out infinite; }
.eye { transform-box: fill-box; transform-origin: center; animation: blink 4s ease-in-out infinite; }
@keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes blink { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
@media (prefers-reduced-motion: reduce) { .snappy, .eye { animation: none; } }
</style>
