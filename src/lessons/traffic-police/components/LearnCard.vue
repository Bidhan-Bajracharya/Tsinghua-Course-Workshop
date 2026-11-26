<script setup>
/** 📘 Learn card: key words for the activity. Open on arrival, "Got it" folds it into a small button. */
import { ref } from 'vue'
defineProps({ card: { type: Object, required: true } })
const open = ref(true)
</script>

<template>
  <div class="learn-wrap">
    <Transition name="fold" mode="out-in">
      <aside v-if="open" key="open" class="learn" aria-label="Learn card">
        <span class="learn__k">📘 Learn</span>
        <h3>{{ card.t }}</h3>
        <p class="learn__d" v-html="card.d"></p>
        <ul><li v-for="(l, i) in card.li" :key="i" v-html="l"></li></ul>
        <button class="ai-btn ai-btn--accent ai-btn--small" @click="open = false">Got it! Hide ✕</button>
      </aside>
      <button v-else key="closed" class="learn-pill" @click="open = true">📘 Learn: {{ card.t }}</button>
    </Transition>
  </div>
</template>

<style scoped>
.learn-wrap { display: flex; justify-content: center; }
.learn {
  position: relative; width: 100%; background: #eef5ff; border-radius: 20px; padding: 16px 20px 14px;
  box-shadow: inset 0 0 0 3px #c7dcff; display: flex; flex-direction: column; gap: 6px; align-items: flex-start;
}
.learn__k { font-weight: 800; font-size: 14px; color: #fff; background: var(--ai-primary); border-radius: 999px; padding: 2px 12px; }
.learn h3 { font-size: clamp(20px, 2.6vw, 26px); color: var(--ai-primary-dark); }
.learn__d { font-size: 18px; }
.learn ul { margin: 0; padding-left: 22px; font-size: 17px; display: flex; flex-direction: column; gap: 3px; }
.learn :deep(b) { color: var(--ai-primary-dark); }
.learn-pill {
  border: 0; font: inherit; font-weight: 800; font-size: 15px; cursor: pointer; color: var(--ai-primary-dark);
  background: #eef5ff; border-radius: 999px; padding: 6px 16px; box-shadow: inset 0 0 0 2px #c7dcff;
}
.learn-pill:hover { background: #e1edff; }
.fold-enter-active, .fold-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fold-enter-from, .fold-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
