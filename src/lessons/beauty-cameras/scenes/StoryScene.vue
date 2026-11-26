<script setup>
// Story opener (unchanged from the original): predict → flip the filter → compare.
import StoryStage from '../components/stages/StoryStage.vue'
import SnappySay from '../components/SnappySay.vue'
import { course } from '../data/course.js'
import { useLessonState } from '../state'

const S = useLessonState()
const stage = course.stages.find((s) => s.type === 'story')
</script>

<template>
  <section class="ai-scene bc">
    <SnappySay :text="stage.mascot" />
    <div class="ai-card"><StoryStage :stage="stage" @badge="S.awardBadge" /></div>
  </section>
</template>
