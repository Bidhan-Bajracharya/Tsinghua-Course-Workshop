<script setup>
/** Shows a colleague's original lesson inside the platform frame (header + "All lessons"). */
import { ref, computed } from 'vue'
import '../shared/theme.css'
import { markVisited } from '../shared/progress'

const props = defineProps({ lesson: { type: Object, required: true } })
const emit = defineEmits(['exit'])

// Apply any storage presets (e.g. force English) before the frame loads.
for (const [k, v] of Object.entries(props.lesson.legacy.storage || {})) {
  try {
    localStorage.setItem(k, v)
  } catch {
    /* storage blocked – lesson falls back to its own default */
  }
}
markVisited(props.lesson.id)

const src = computed(() => import.meta.env.BASE_URL + props.lesson.legacy.src)
const frame = ref(null)
const loaded = ref(false)

function fullscreen() {
  frame.value?.requestFullscreen?.()
}
</script>

<template>
  <div class="ai-lesson legacy">
    <header class="bar">
      <button class="ai-btn ai-btn--small" @click="emit('exit')">← All lessons</button>
      <div class="bar__title">
        <span class="ai-tag" :style="{ background: lesson.color + '22', color: lesson.color }">Unit {{ lesson.unit }} · Lesson {{ lesson.lesson }}</span>
        <h1>{{ lesson.icon }} {{ lesson.title }}</h1>
      </div>
      <div class="bar__tools">
        <button class="ai-btn ai-btn--small" title="Full screen" @click="fullscreen">⛶ Full screen</button>
        <a class="ai-btn ai-btn--small" :href="src" target="_blank" rel="noopener">↗ New tab</a>
      </div>
    </header>

    <div class="frame-wrap" :style="{ '--c': lesson.color }">
      <div v-if="!loaded" class="loading" aria-live="polite">
        <span class="loading__icon">{{ lesson.icon }}</span>
        Loading {{ lesson.title }}…
      </div>
      <iframe
        ref="frame"
        :src="src"
        :title="lesson.title"
        :allow="lesson.legacy.allow || 'fullscreen'"
        allowfullscreen
        @load="loaded = true"
      ></iframe>
    </div>
  </div>
</template>

<style scoped>
.legacy { min-height: 100vh; display: flex; flex-direction: column; }
.bar {
  display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
  padding: 10px 16px; background: #fff; box-shadow: 0 2px 0 var(--ai-line); position: relative; z-index: 2;
}
.bar__title { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.bar__title h1 { font-size: clamp(20px, 2.6vw, 28px); color: var(--ai-primary-dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bar__tools { display: flex; gap: 8px; }
.bar__tools a { text-decoration: none; }
@media (max-width: 640px) { .bar__tools { display: none; } .ai-tag { display: none; } }

.frame-wrap { position: relative; flex: 1; display: flex; border-top: 5px solid var(--c); }
iframe { flex: 1; width: 100%; min-height: calc(100vh - 70px); border: 0; display: block; background: #fff; }
.loading {
  position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
  font-family: var(--ai-font-head); font-weight: 800; font-size: 22px; color: var(--ai-ink-soft); background: var(--ai-bg);
}
.loading__icon { font-size: 64px; animation: bob 1s ease-in-out infinite; }
@keyframes bob { 50% { transform: translateY(-8px); } }
</style>
