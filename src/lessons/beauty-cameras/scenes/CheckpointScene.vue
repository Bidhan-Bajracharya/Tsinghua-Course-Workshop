<script setup>
// Level step 3 · Checkpoint: retry with no penalty; the explanation shows once it's right.
import CheckpointQuiz from '../components/checkpoint/CheckpointQuiz.vue'
import { course } from '../data/course.js'
import { useLessonState } from '../state'

const props = defineProps({ stageId: { type: String, required: true } })
const S = useLessonState()
const stage = course.stages.find((s) => s.id === props.stageId)
</script>

<template>
  <section class="ai-scene bc">
    <span class="ai-tag">{{ stage.icon }} {{ stage.name }} · Checkpoint</span>
    <div class="ai-card"><CheckpointQuiz :quiz="stage.quiz" @passed="S.passed.add(stage.id)" /></div>
  </section>
</template>
