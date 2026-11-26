<script setup>
/** Lumi the car with a speech bubble – the "voice" of each screen. */
import LumiCar from '../../../shared/mascots/LumiCar.vue'
defineProps({ text: { type: String, required: true } })
</script>

<template>
  <div class="say">
    <svg viewBox="0 0 120 72" class="say__lumi" aria-hidden="true"><LumiCar /></svg>
    <div class="ai-bubble say__bubble">{{ text }}</div>
  </div>
</template>

<style scoped>
.say { display: flex; gap: 14px; align-items: center; }
.say__lumi { flex: none; width: clamp(78px, 11vw, 112px); height: auto; animation: bob 1.4s ease-in-out infinite; }
@keyframes bob { 50% { transform: translateY(-3px); } }
.say__bubble {
  font-family: var(--ai-font-head);
  font-weight: 700;
  font-size: clamp(20px, 2.6vw, 26px);
  line-height: 1.2;
}
.say__bubble::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 50%;
  margin-top: -10px;
  border: 10px solid transparent;
  border-right-color: #fff;
  border-left: 0;
}
</style>
