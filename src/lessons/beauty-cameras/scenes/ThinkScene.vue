<script setup>
// "What do you think?": open question with no wrong answer; answers go on the finish page.
import ThinkCard from '../components/thinking/ThinkCard.vue'
import { course } from '../data/course.js'
import { useLessonState } from '../state'

const props = defineProps({ stageId: { type: String, required: true } })
const S = useLessonState()
const stage = course.stages.find((s) => s.id === props.stageId)
</script>

<template>
  <section class="ai-scene bc">
    <span class="ai-tag">{{ stage.icon }} {{ stage.name }} · Think</span>
    <ThinkCard :think="stage.think" @answer="S.recordThought" />
  </section>
</template>
