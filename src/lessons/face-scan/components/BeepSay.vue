<script setup>
import Beep from './Beep.vue'
defineProps({ text: { type: String, required: true }, thinking: { type: Boolean, default: false } })
</script>

<template>
  <div class="say">
    <Beep class="say__bot" :thinking="thinking" />
    <div class="ai-bubble say__bubble">{{ text }}</div>
  </div>
</template>

<style scoped>
.say { display: flex; gap: 14px; align-items: center; }
.say__bot { flex: none; width: clamp(64px, 9vw, 90px); height: auto; }
.say__bubble { font-family: var(--ai-font-head); font-weight: 700; font-size: clamp(20px, 2.6vw, 26px); line-height: 1.2; }
.say__bubble::before {
  content: ''; position: absolute; left: -10px; top: 50%; margin-top: -10px;
  border: 10px solid transparent; border-right-color: #fff; border-left: 0;
}
</style>
