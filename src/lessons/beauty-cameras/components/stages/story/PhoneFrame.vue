<script setup>
// A phone on a video call. The screen content goes in the default slot.
defineProps({
  glowing: { type: Boolean, default: false },
})
</script>

<template>
  <div class="phone" :class="{ glowing }">
    <span class="call-badge">● LIVE</span>
    <slot />
  </div>
</template>

<style scoped>
.phone {
  position: relative;
  width: min(300px, 100%);
  padding: 34px 14px 16px;
  border: 5px solid var(--ink);
  border-radius: 34px;
  background: #e8e4ff;
  box-shadow: var(--pop);
  transition: background 0.3s, box-shadow 0.3s;
}

.phone.glowing {
  background: var(--pink-soft);
  box-shadow: var(--pop), 0 0 0 8px #ffd6e3;
}

.call-badge {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--red);
  font-size: 0.8rem;
  font-weight: 800;
}
</style>
