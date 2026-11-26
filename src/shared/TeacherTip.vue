<script setup>
defineProps({ text: { type: String, required: true } })
</script>

<template>
  <details class="tip">
    <summary>💡 Teacher tip</summary>
    <p>{{ text }}</p>
  </details>
</template>

<style scoped>
.tip { align-self: center; max-width: 680px; }
.tip summary {
  list-style: none;
  cursor: pointer;
  font-weight: 800;
  font-size: 15px;
  color: var(--ai-ink-soft);
  border: 2px dashed var(--ai-line);
  border-radius: 999px;
  padding: 5px 16px;
  text-align: center;
  width: fit-content;
  margin: 0 auto;
  background: #fff;
}
.tip summary::-webkit-details-marker { display: none; }
.tip[open] summary { border-color: #ffd666; color: #7a5600; }
.tip p {
  margin-top: 8px;
  background: #fff8e1;
  border: 2px dashed #ffd666;
  border-radius: 16px;
  padding: 12px 16px;
  font-size: 16px;
}
</style>
