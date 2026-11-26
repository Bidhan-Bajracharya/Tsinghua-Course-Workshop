<script setup>
/** Scoreboard strip shown under the lesson header while class teams are on. */
import { useLessonState, addPoints, activeTeams } from '../state'
const S = useLessonState()
const emit = defineEmits(['setup'])
</script>

<template>
  <div v-if="S.teamsOn" class="bar" aria-label="Team scores">
    <div
      v-for="(t, i) in activeTeams(S)"
      :key="i"
      class="team"
      :class="{ bump: S.bump === i }"
      :style="{ '--c': t.color }"
    >
      <svg class="car" viewBox="0 0 44 26" aria-hidden="true"><rect x="2" y="3" width="40" height="20" rx="8" fill="rgba(255,255,255,.4)" stroke="#fff" stroke-width="2.5" /><rect x="23" y="6" width="9" height="14" rx="3" fill="#fff" opacity=".8" /><rect x="9" y="6" width="7" height="14" rx="3" fill="#fff" opacity=".8" /></svg>
      <span class="nm">{{ t.name }}</span>
      <b class="sc" aria-live="polite">{{ t.score }}</b>
      <span class="pm">
        <button :aria-label="`Add 10 points to ${t.name}`" @click="addPoints(S, i, 10)">+</button>
        <button :aria-label="`Take 10 points from ${t.name}`" @click="addPoints(S, i, -10)">−</button>
      </span>
    </div>
    <button class="ai-btn ai-btn--small" @click="emit('setup')">✏️ Edit</button>
  </div>
</template>

<style scoped>
.bar { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.team {
  display: flex; align-items: center; gap: 8px; background: var(--c); color: #fff; border-radius: 16px; padding: 6px 8px 6px 12px;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.15); flex: 1 1 180px; min-width: 0;
}
.team.bump { animation: bump 0.5s ease; }
@keyframes bump { 40% { transform: scale(1.08); } }
.car { width: 36px; flex: none; }
.nm { font-weight: 800; font-size: 16px; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sc { font-family: var(--ai-font-head); font-size: 26px; line-height: 1; min-width: 36px; text-align: right; }
.pm { display: flex; flex-direction: column; gap: 2px; }
.pm button { border: 0; width: 24px; height: 18px; border-radius: 6px; background: rgba(255, 255, 255, 0.3); color: #fff; font-weight: 900; font-size: 14px; line-height: 1; cursor: pointer; }
.pm button:hover { background: rgba(255, 255, 255, 0.5); }
</style>
