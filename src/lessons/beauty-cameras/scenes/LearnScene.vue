<script setup>
// Level step 1 · Learn: tap-to-flip concept cards + "Snappy explains" reading.
import FlipCards from '../components/learn/FlipCards.vue'
import SnappySay from '../components/SnappySay.vue'
import { course } from '../data/course.js'
import { ui } from '../i18n/ui.js'

const props = defineProps({ stageId: { type: String, required: true } })
defineEmits(['next'])
const stage = course.stages.find((s) => s.id === props.stageId)
</script>

<template>
  <section class="ai-scene bc">
    <div class="ai-scene__head">
      <span class="ai-tag">{{ stage.icon }} {{ stage.name }}</span>
      <h2>{{ stage.title }}</h2>
    </div>
    <SnappySay :text="stage.mascot" />
    <FlipCards :cards="stage.learn.cards" />
    <div v-if="stage.learn.reading.length" class="ai-card reading">
      <span class="chip">🗣️ {{ ui.reading }}</span>
      <p v-for="(p, i) in stage.learn.reading" :key="i">{{ p }}</p>
    </div>
    <div class="foot"><button class="ai-btn ai-btn--accent" @click="$emit('next')">{{ ui.toPlay }}</button></div>
  </section>
</template>

<style scoped>
.reading { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; background: #eef5ff; box-shadow: none; }
.reading p { font-size: 19px; font-weight: 600; }
.foot { display: flex; justify-content: flex-end; }
</style>
