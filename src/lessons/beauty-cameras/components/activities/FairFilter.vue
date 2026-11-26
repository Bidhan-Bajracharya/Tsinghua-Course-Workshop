<script setup>
// ⚖️ Is this filter fair? Apply a typical "pretty" filter to different faces,
// notice what it changed, then think about whose idea of beauty it follows.
import { computed, ref } from 'vue'
import CartoonFace from '../illustrations/CartoonFace.vue'
import ChangeChecklist from '../thinking/ChangeChecklist.vue'
import { useLocale } from '../../i18n/useLocale.js'
import { ui } from '../../i18n/ui.js'

const props = defineProps({
  activity: { type: Object, required: true },
})

const emit = defineEmits(['complete'])
const { t } = useLocale()

const applied = ref(false)
const picked = ref([])
const checked = ref(false)

const faces = computed(() =>
  props.activity.faces.map((look) => (applied.value ? { ...look, ...props.activity.filterChanges } : look)),
)

function check() {
  checked.value = true
  emit('complete')
}
</script>

<template>
  <div class="fair-filter">
    <h3 class="activity-title">⚖️ {{ t(activity.title) }}</h3>
    <p class="activity-hint">{{ t(activity.instruction) }}</p>

    <div class="faces">
      <div v-for="(look, index) in faces" :key="index" class="face">
        <CartoonFace :look="look" />
      </div>
    </div>

    <div class="controls">
      <button type="button" class="btn btn-purple" @click="applied = !applied">
        {{ applied ? t(ui.filterOffAgain) : t(activity.applyLabel) }}
      </button>
    </div>

    <div v-if="applied || checked" class="notice pop-in">
      <p class="question">🔍 {{ t(activity.question) }}</p>
      <ChangeChecklist v-model="picked" :options="activity.changes" :revealed="checked" />
      <button v-if="!checked" type="button" class="btn btn-yellow check" :disabled="!picked.length" @click="check">
        {{ t(ui.checkAnswer) }}
      </button>
      <p v-else class="message pop-in">💬 {{ t(activity.message) }}</p>
    </div>
  </div>
</template>

<style scoped>
.faces {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 160px));
  justify-content: center;
  gap: 14px;
}

.face {
  padding: 8px;
  border: var(--outline);
  border-radius: var(--radius);
  background: #fff;
  box-shadow: var(--pop-small);
}

.controls {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

.question {
  margin: 0 0 10px;
  font-size: 1.2rem;
  font-weight: 800;
}

.check {
  margin-top: 14px;
}

.message {
  margin: 14px 0 0;
  padding: 12px 16px;
  border: var(--outline);
  border-radius: var(--radius);
  background: var(--yellow-soft);
  font-size: 1.1rem;
  font-weight: 700;
}
</style>
