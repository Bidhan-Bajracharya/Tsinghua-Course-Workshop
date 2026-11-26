<script setup>
// Level step 2 · Play: one mini-game from the original lesson. Finishing it earns its badge (if any).
import { activityComponents } from '../components/activities/index.js'
import { course } from '../data/course.js'
import { useLessonState } from '../state'

const props = defineProps({ stageId: { type: String, required: true }, index: { type: Number, required: true } })
const S = useLessonState()
const stage = course.stages.find((s) => s.id === props.stageId)
const activity = stage.activities[props.index]
</script>

<template>
  <section class="ai-scene bc">
    <span class="ai-tag">{{ stage.icon }} {{ stage.name }} · Play {{ index + 1 }} of {{ stage.activities.length }}</span>
    <div class="ai-card">
      <component :is="activityComponents[activity.type]" :activity="activity" @complete="S.awardBadge(activity.badge)" />
    </div>
  </section>
</template>
