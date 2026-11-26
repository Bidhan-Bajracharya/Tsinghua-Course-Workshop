<script setup>
/**
 * Shared lesson frame used by every lesson on the platform.
 *
 * scenes: [{ id, label, icon, component?, props?, narration?, steps? }]
 *   A scene either renders `component` directly, or has `steps`
 *   ([{ kind, component, props?, narration? }]) that are walked through one by one.
 *   kind: 'learn' | 'play' | 'think' | 'gate' (shows a coloured chip).
 *
 * Scene/step components may emit:
 *   next      → go forward
 *   complete  → lesson finished (payload is passed up)
 */
import { ref, computed, reactive } from 'vue'
import './theme.css'
import { useSpeech } from './useSpeech'
import TeacherGuide from './TeacherGuide.vue'

const props = defineProps({
  meta: { type: Object, required: true }, // { id, unit, lesson, title, subtitle }
  scenes: { type: Array, required: true },
  showHome: { type: Boolean, default: false },
  guide: { type: Object, default: null }, // optional teacher guide (see TeacherGuide.vue)
})
const guideOpen = ref(false)
const emit = defineEmits(['complete', 'exit'])

const KINDS = {
  learn: { label: 'Learn', icon: '📖' },
  play: { label: 'Play', icon: '🎮' },
  think: { label: 'Think', icon: '💭' },
  gate: { label: 'Checkpoint', icon: '🚧' },
}

const si = ref(0) // scene index
const ti = ref(0) // step index inside the scene
const visited = reactive(new Set(['0:0']))
const root = ref(null)

const scene = computed(() => props.scenes[si.value])
const steps = computed(() => scene.value.steps || null)
const step = computed(() => (steps.value ? steps.value[ti.value] : null))
const view = computed(() => step.value || scene.value)
const viewKey = computed(() => `${scene.value.id}:${ti.value}`)
const narration = computed(() => view.value.narration || scene.value.narration || '')
const isLast = computed(() => si.value === props.scenes.length - 1 && (!steps.value || ti.value === steps.value.length - 1))
const isFirst = computed(() => si.value === 0 && ti.value === 0)

const { supported: canSpeak, speaking, speak, stop } = useSpeech()

function go(s, t = 0) {
  if (s < 0 || s >= props.scenes.length) return
  stop()
  si.value = s
  ti.value = t
  visited.add(`${s}:${t}`)
  root.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function next() {
  if (steps.value && ti.value < steps.value.length - 1) go(si.value, ti.value + 1)
  else go(si.value + 1, 0)
}
function back() {
  if (steps.value && ti.value > 0) go(si.value, ti.value - 1)
  else if (si.value > 0) {
    const prev = props.scenes[si.value - 1]
    go(si.value - 1, prev.steps ? prev.steps.length - 1 : 0)
  }
}
const sceneDone = (i) => {
  const s = props.scenes[i]
  const n = s.steps ? s.steps.length : 1
  for (let t = 0; t < n; t++) if (!visited.has(`${i}:${t}`)) return false
  return true
}

function toggleSpeak() {
  if (speaking.value) stop()
  else speak(narration.value)
}

function onComplete(result) {
  emit('complete', { lessonId: props.meta.id, ...result })
}

defineExpose({ go, next })
</script>

<template>
  <div ref="root" class="ai-lesson">
    <div class="ai-shell">
      <header class="ai-shell__header">
        <div class="ai-shell__titles">
          <button v-if="showHome" class="ai-btn ai-btn--small home" @click="stop(); emit('exit')">← All lessons</button>
          <span class="ai-tag">Unit {{ meta.unit }} · Lesson {{ meta.lesson }}</span>
          <h1>{{ meta.title }}</h1>
          <p>{{ meta.subtitle }}</p>
        </div>
        <div class="ai-shell__tools">
          <slot name="header-extra" />
          <button v-if="guide" class="ai-btn" @click="guideOpen = true">📘 Teacher guide</button>
          <button
            v-if="canSpeak"
            class="ai-btn"
            :class="{ 'is-on': speaking }"
            :aria-pressed="speaking"
            @click="toggleSpeak"
          >
            {{ speaking ? '⏹ Stop' : '🔊 Read to me' }}
          </button>
        </div>
      </header>

      <slot name="bar" />

      <nav class="ai-steps" aria-label="Lesson steps">
        <button
          v-for="(s, i) in scenes"
          :key="s.id"
          class="ai-step"
          :class="{ 'is-active': i === si, 'is-done': i !== si && sceneDone(i) }"
          :aria-current="i === si ? 'step' : undefined"
          @click="go(i)"
        >
          <span class="ai-step__icon">{{ s.icon }}</span>
          <span class="ai-step__label">{{ s.label }}</span>
        </button>
      </nav>

      <div v-if="steps" class="ai-substeps" aria-label="Activities in this part">
        <button
          v-for="(st, t) in steps"
          :key="t"
          class="ai-substep"
          :class="[`k-${st.kind}`, { 'is-active': t === ti, 'is-done': t !== ti && visited.has(`${si}:${t}`) }]"
          :title="KINDS[st.kind]?.label"
          @click="go(si, t)"
        >
          <span>{{ KINDS[st.kind]?.icon }}</span>
          <span class="ai-substep__label">{{ KINDS[st.kind]?.label }}</span>
        </button>
      </div>

      <main class="ai-stage">
        <Transition name="ai-slide" mode="out-in">
          <component
            :is="view.component"
            :key="viewKey"
            v-bind="view.props || {}"
            :kind="step ? step.kind : undefined"
            @next="next"
            @complete="onComplete"
          />
        </Transition>
      </main>

      <TeacherGuide v-if="guide && guideOpen" :guide="guide" @close="guideOpen = false" />

      <footer v-if="!isLast" class="ai-shell__footer">
        <button class="ai-btn" :disabled="isFirst" @click="back">← Back</button>
        <span class="ai-shell__count">
          {{ si + 1 }} / {{ scenes.length }}<template v-if="steps"> · {{ ti + 1 }}/{{ steps.length }}</template>
        </span>
        <button class="ai-btn ai-btn--primary" @click="next">Next →</button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.ai-shell {
  max-width: 1120px;
  margin: 0 auto;
  padding: 20px 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ai-shell__header { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; }
.ai-shell__titles { display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
.ai-shell__titles .home { margin-bottom: 6px; }
.ai-shell__header h1 { font-size: clamp(34px, 5vw, 52px); color: var(--ai-primary-dark); }
.ai-shell__header p { color: var(--ai-ink-soft); font-weight: 700; font-size: 19px; }
.ai-shell__tools { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }

.ai-steps { display: flex; gap: 8px; overflow-x: auto; padding: 4px 2px 10px; scrollbar-width: thin; }
.ai-step {
  flex: 0 0 auto; display: flex; align-items: center; gap: 6px; border: 0; font: inherit; font-weight: 800; font-size: 15px;
  color: var(--ai-ink-soft); background: #fff; padding: 8px 14px; border-radius: 999px; cursor: pointer;
  box-shadow: inset 0 0 0 2px var(--ai-line); transition: background 0.15s, color 0.15s, transform 0.12s;
}
.ai-step:hover { transform: translateY(-1px); }
.ai-step__icon { font-size: 18px; }
.ai-step.is-done { color: var(--ai-green); box-shadow: inset 0 0 0 2px #bfeed8; }
.ai-step.is-active { background: var(--ai-primary); color: #fff; box-shadow: 0 4px 0 var(--ai-primary-dark); }
.ai-step:focus-visible { outline: 3px solid var(--ai-accent); outline-offset: 2px; }

.ai-substeps {
  display: flex; gap: 6px; flex-wrap: wrap; align-items: center;
  background: #fff; border-radius: 999px; padding: 6px; align-self: flex-start;
  box-shadow: inset 0 0 0 2px var(--ai-line);
}
.ai-substep {
  border: 0; font: inherit; font-weight: 800; font-size: 14px; cursor: pointer;
  display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 999px;
  background: transparent; color: var(--ai-ink-soft); transition: background 0.15s, color 0.15s;
}
.ai-substep.is-done { color: var(--ai-green); }
.ai-substep.is-active { color: #fff; }
.ai-substep.is-active.k-learn { background: var(--ai-primary); }
.ai-substep.is-active.k-play { background: var(--ai-red); }
.ai-substep.is-active.k-think { background: var(--ai-purple); }
.ai-substep.is-active.k-gate { background: var(--ai-ink); }
.ai-substep:focus-visible { outline: 3px solid var(--ai-accent); outline-offset: 2px; }

.ai-stage { min-height: 460px; }

.ai-shell__footer {
  display: flex; justify-content: space-between; align-items: center; gap: 12px;
  padding-top: 8px; border-top: 2px dashed var(--ai-line);
}
.ai-shell__count { font-weight: 800; color: var(--ai-ink-soft); text-align: center; }

@media (max-width: 600px) {
  .ai-step__label { display: none; }
  .ai-step.is-active .ai-step__label { display: inline; }
  .ai-substep__label { display: none; }
  .ai-substep.is-active .ai-substep__label { display: inline; }
}
</style>
