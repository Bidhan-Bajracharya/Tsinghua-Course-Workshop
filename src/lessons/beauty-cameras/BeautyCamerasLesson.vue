<script setup>
import { provide, ref } from 'vue'
import LessonShell from '../../shared/LessonShell.vue'
import { lessonMeta } from './meta'
import { GUIDE } from './guide'
import { course } from './data/course.js'
import { ui } from './i18n/ui.js'
import { createState, STATE_KEY } from './state'
import './bc.css'

import WelcomeScene from './scenes/WelcomeScene.vue'
import StoryScene from './scenes/StoryScene.vue'
import LearnScene from './scenes/LearnScene.vue'
import ActivityScene from './scenes/ActivityScene.vue'
import ThinkScene from './scenes/ThinkScene.vue'
import CheckpointScene from './scenes/CheckpointScene.vue'
import FinishScene from './scenes/FinishScene.vue'

defineProps({ showHome: { type: Boolean, default: false } })
const emit = defineEmits(['complete', 'exit'])

const state = createState()
provide(STATE_KEY, state)
const shell = ref(null)
provide('bc-restart', () => {
  state.reset()
  shell.value?.go(0)
})

// Each original stage becomes one part of the lesson; a level's Learn → Play → Think → Checkpoint become its steps.
const scenes = course.stages.map((stage) => {
  const base = { id: stage.id, label: stage.name, icon: stage.icon, narration: stage.mascot }
  if (stage.type === 'welcome') return { ...base, component: WelcomeScene, narration: `${stage.mascot} ${course.title}. ${course.subtitle}` }
  if (stage.type === 'story') return { ...base, component: StoryScene, narration: `${stage.mascot} ${stage.text} ${stage.predictQuestion}` }
  if (stage.type === 'finish') return { ...base, component: FinishScene, narration: `${stage.mascot} ${stage.takeaways.map((t) => t.text).join(' ')}` }
  return {
    ...base,
    steps: [
      {
        kind: 'learn', component: LearnScene, props: { stageId: stage.id },
        narration: [stage.mascot, ...stage.learn.cards.map((c) => `${c.title}: ${c.text}`), ...stage.learn.reading].join(' '),
      },
      ...stage.activities.map((a, i) => ({
        kind: 'play', component: ActivityScene, props: { stageId: stage.id, index: i },
        narration: `${a.title}. ${a.instruction || (a.cartoon && a.cartoon.instruction) || ''}`,
      })),
      { kind: 'think', component: ThinkScene, props: { stageId: stage.id }, narration: `${ui.whatDoYouThink} ${stage.think.question} ${ui.noWrongAnswer}` },
      {
        kind: 'gate', component: CheckpointScene, props: { stageId: stage.id },
        narration: `${ui.checkpoint}! ${stage.quiz.question} ${stage.quiz.options.map((o, k) => `${'ABCD'[k]}: ${o.text}`).join('. ')}`,
      },
    ],
  }
})
</script>

<template>
  <LessonShell
    ref="shell"
    :meta="lessonMeta"
    :scenes="scenes"
    :guide="GUIDE"
    :show-home="showHome"
    @complete="emit('complete', $event)"
    @exit="emit('exit')"
  >
    <template #header-extra>
      <ul class="shelf" :aria-label="ui.badges">
        <li v-for="b in course.badges" :key="b.id" :class="{ on: state.badges.has(b.id) }" :title="`${b.name}: ${b.earnedFor}`">
          <span :key="String(state.badges.has(b.id))" class="ic" :class="{ pop: state.badges.has(b.id) }" aria-hidden="true">{{ b.icon }}</span>
          <span class="vh">{{ b.name }}: {{ state.badges.has(b.id) ? ui.badgeEarned : ui.badgeNotYet }}</span>
        </li>
      </ul>
    </template>
  </LessonShell>
</template>

<style scoped>
.shelf { display: flex; gap: 4px; margin: 0; padding: 4px 10px; list-style: none; border-radius: 999px; background: #fff4d6; box-shadow: inset 0 0 0 2px #ffd666; }
.shelf li { width: 36px; height: 36px; display: grid; place-items: center; font-size: 22px; filter: grayscale(1); opacity: 0.35; }
.shelf li.on { filter: none; opacity: 1; }
.pop { animation: pop 0.4s ease-out both; }
@keyframes pop { 0% { transform: scale(0.5); } 70% { transform: scale(1.2); } 100% { transform: scale(1); } }
.vh { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
</style>
