<script setup>
/** Pop-up for the teacher: switch class teams on/off, pick 2–4 teams, rename them, reset scores. */
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useLessonState, TEAM_COLORS, TEAM_NAMES } from '../state'

const emit = defineEmits(['close'])
const S = useLessonState()
const count = ref(S.teamCount)
const names = reactive(S.teams.map((t) => t.name))
const box = ref(null)

function save(reset) {
  S.teamsOn = true
  S.teamCount = count.value
  S.teams.forEach((t, i) => {
    t.name = names[i].trim() || TEAM_NAMES[i]
    if (reset) t.score = 0
  })
  emit('close')
}
function off() {
  S.teamsOn = false
  emit('close')
}
const onKey = (e) => e.key === 'Escape' && emit('close')
onMounted(() => {
  window.addEventListener('keydown', onKey)
  box.value?.querySelector("button")?.focus()
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <div ref="box" class="box ai-card" role="dialog" aria-modal="true" aria-labelledby="ts-title">
      <h2 id="ts-title">🏁 Class teams</h2>
      <p class="sub">Play the checkpoints as a class: teams hold up A/B/C/D cards and win points.</p>
      <p class="lbl">How many teams?</p>
      <div class="ai-row">
        <button
          v-for="n in [2, 3, 4]"
          :key="n"
          class="ai-btn"
          :class="{ 'ai-btn--primary': count === n }"
          :aria-pressed="count === n"
          @click="count = n"
        >{{ n }}</button>
      </div>
      <div class="teams">
        <label v-for="(c, i) in TEAM_COLORS" :key="i" class="team" :class="{ dim: i >= count }">
          <span class="dot" :style="{ background: c }"></span>
          <input v-model="names[i]" :disabled="i >= count" :aria-label="`Team ${i + 1} name`" maxlength="24" />
        </label>
      </div>
      <div class="ai-row actions">
        <button v-if="S.teamsOn" class="ai-btn ai-btn--small" @click="off">Turn teams off</button>
        <span class="grow"></span>
        <button class="ai-btn" @click="save(true)">Save &amp; reset scores</button>
        <button class="ai-btn ai-btn--green" @click="save(false)">Save</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay { position: fixed; inset: 0; background: rgba(29, 43, 79, 0.45); display: grid; place-items: center; z-index: 50; padding: 16px; }
.box { width: min(560px, 100%); display: flex; flex-direction: column; gap: 12px; max-height: 90vh; overflow: auto; }
.box h2 { font-size: 30px; color: var(--ai-primary-dark); }
.sub { color: var(--ai-ink-soft); font-weight: 700; }
.lbl { font-weight: 800; }
.teams { display: grid; gap: 8px; }
.team { display: flex; align-items: center; gap: 10px; }
.team.dim { opacity: 0.35; }
.dot { width: 26px; height: 26px; border-radius: 50%; flex: none; box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.15); }
.team input { flex: 1; font: inherit; font-weight: 800; font-size: 18px; border: 0; border-radius: 12px; padding: 8px 12px; box-shadow: inset 0 0 0 2px var(--ai-line); background: #fff; color: var(--ai-ink); }
.team input:focus { outline: 3px solid var(--ai-accent); }
.actions { margin-top: 6px; }
.grow { flex: 1; }
</style>
