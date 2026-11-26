<script setup>
import Blinky from './Blinky.vue'
defineProps({ text: { type: String, required: true }, light: { type: String, default: 'cycle' } })
</script>

<template>
  <div class="say">
    <Blinky class="say__bot" :light="light" />
    <div class="ai-bubble say__bubble">{{ text }}</div>
  </div>
</template>

<style scoped>
.say { display: flex; gap: 14px; align-items: center; }
.say__bot { flex: none; width: clamp(40px, 5.5vw, 56px); height: auto; }
.say__bubble { font-family: var(--ai-font-head); font-weight: 700; font-size: clamp(20px, 2.6vw, 26px); line-height: 1.2; }
.say__bubble::before {
  content: ''; position: absolute; left: -10px; top: 50%; margin-top: -10px;
  border: 10px solid transparent; border-right-color: #fff; border-left: 0;
}
</style>
