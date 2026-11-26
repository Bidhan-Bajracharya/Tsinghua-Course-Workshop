<script setup>
/** Beep, the lesson's robot guide (from the original "Robo" art). Renders a full <svg>. */
defineProps({ thinking: { type: Boolean, default: false } })
</script>

<template>
  <svg class="beep" :class="{ thinking }" viewBox="0 0 200 190" aria-hidden="true">
    <line x1="100" y1="30" x2="100" y2="8" stroke="#1d2b4f" stroke-width="6" stroke-linecap="round" />
    <circle class="beep__bulb" cx="100" cy="8" r="10" fill="#ff6b9a" />
    <rect x="30" y="30" width="140" height="110" rx="34" fill="#36b0f5" />
    <rect x="48" y="50" width="104" height="62" rx="22" fill="#1d2b4f" />
    <circle class="beep__eye" cx="78" cy="81" r="12" fill="#7fe0ff" />
    <circle class="beep__eye" cx="122" cy="81" r="12" fill="#7fe0ff" />
    <path d="M84 124 Q100 134 116 124" fill="none" stroke="#ffd166" stroke-width="7" stroke-linecap="round" />
    <rect x="60" y="146" width="80" height="38" rx="16" fill="#1f8fd6" />
  </svg>
</template>

<style scoped>
.beep { display: block; }
.beep__bulb { animation: blink 2s ease-in-out infinite; }
@keyframes blink { 50% { opacity: 0.4; } }
.beep__eye { transform-box: fill-box; transform-origin: center; animation: look 4s ease-in-out infinite; }
@keyframes look { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
.thinking { animation: think 0.6s ease-in-out; }
@keyframes think { 25% { transform: rotate(-6deg); } 75% { transform: rotate(6deg); } }
</style>
