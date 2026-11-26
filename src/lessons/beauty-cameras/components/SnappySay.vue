<script setup>
import Snappy from './Snappy.vue'
defineProps({ text: { type: String, required: true } })
</script>

<template>
  <div class="say">
    <Snappy class="say__bot" />
    <div class="ai-bubble say__bubble" role="status">
      <strong class="say__name">Snappy</strong>
      <span>{{ text }}</span>
    </div>
  </div>
</template>

<style scoped>
.say { display: flex; gap: 14px; align-items: center; }
.say__bot { flex: none; width: clamp(64px, 9vw, 92px); }
.say__bubble { font-family: var(--ai-font-head); font-weight: 700; font-size: clamp(19px, 2.4vw, 24px); line-height: 1.25; display: flex; flex-direction: column; }
.say__name { font-size: 15px; color: #e0436f; letter-spacing: 0.03em; }
.say__bubble::before {
  content: ''; position: absolute; left: -10px; top: 50%; margin-top: -10px;
  border: 10px solid transparent; border-right-color: #fff; border-left: 0;
}
</style>
