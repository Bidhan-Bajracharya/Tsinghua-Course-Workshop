<script setup>
// Three eras of photo editing, each with its own hands-on task:
// darkroom = drag a light slider, software = tap away the spots, beauty filter = one magic tap.
import { computed, ref, watch } from 'vue'
import CartoonFace from '../illustrations/CartoonFace.vue'
import { FACE_SPOTS } from '../illustrations/faceSpots.js'
import { useLocale } from '../../i18n/useLocale.js'
import { ui } from '../../i18n/ui.js'

const DARKROOM_TARGET = 70 // slider value (0–100) that counts as "light adjusted"

const props = defineProps({
  activity: { type: Object, required: true },
})

const emit = defineEmits(['complete'])
const { t } = useLocale()

const eraId = ref(props.activity.eras[0].id)
const era = computed(() => props.activity.eras.find((item) => item.id === eraId.value))

const light = ref(0)
const removedSpots = ref([])
const magicApplied = ref(false)

// Whether each era's task has been completed, keyed by era id.
const done = computed(() => ({
  darkroom: light.value >= DARKROOM_TARGET,
  software: removedSpots.value.length === FACE_SPOTS.length,
  filter: magicApplied.value,
}))

watch(
  () => Object.values(done.value).every(Boolean),
  (allDone) => allDone && emit('complete'),
)

const look = computed(() => {
  const base = props.activity.baseLook
  if (eraId.value === 'darkroom') {
    const amount = light.value / 100
    return { ...base, filter: `grayscale(1) brightness(${0.55 + 0.5 * amount}) contrast(${0.8 + 0.5 * amount})` }
  }
  if (eraId.value === 'filter' && magicApplied.value) return props.activity.filteredLook
  return base
})

function removeSpot(index) {
  if (!removedSpots.value.includes(index)) removedSpots.value = [...removedSpots.value, index]
}
</script>

<template>
  <div class="time-machine">
    <h3 class="activity-title">⏳ {{ t(activity.title) }}</h3>

    <div class="eras" role="group" :aria-label="t(activity.title)">
      <button
        v-for="item in activity.eras"
        :key="item.id"
        type="button"
        class="era"
        :class="{ active: item.id === eraId }"
        :aria-pressed="item.id === eraId"
        @click="eraId = item.id"
      >
        <span class="era-icon" aria-hidden="true">{{ item.icon }}</span>
        <span>{{ t(item.label) }}</span>
        <span v-if="done[item.id]" class="era-done" aria-hidden="true">✓</span>
      </button>
    </div>

    <div class="workbench">
      <div class="photo-frame" :class="`era-${eraId}`">
        <CartoonFace
          :look="look"
          :label="t(era.label)"
          :removed-spots="eraId === 'software' ? removedSpots : []"
          :spots-clickable="eraId === 'software'"
          @spot-click="removeSpot"
        />
      </div>

      <div class="task">
        <p class="task-text">👉 {{ t(era.task) }}</p>

        <label v-if="eraId === 'darkroom'" class="light-slider">
          <span>💡 {{ t(ui.lightSlider) }}</span>
          <input v-model.number="light" type="range" min="0" max="100" />
        </label>

        <p v-else-if="eraId === 'software'" class="counter">
          {{ t(ui.removed, { n: removedSpots.length, total: FACE_SPOTS.length }) }}
        </p>

        <button v-else type="button" class="btn btn-purple" :disabled="magicApplied" @click="magicApplied = true">
          {{ t(ui.magicButton) }}
        </button>

        <p v-if="done[eraId]" class="task-result pop-in">🎉 {{ t(era.result) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.eras {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 14px 0 18px;
}

.era {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 6px;
  border: var(--outline);
  border-radius: var(--radius);
  background: #fff;
  box-shadow: var(--pop-small);
  font-weight: 800;
}

.era.active {
  background: var(--yellow);
}

.era-icon {
  font-size: 2rem;
}

.era-done {
  position: absolute;
  top: 6px;
  right: 10px;
  color: var(--green);
  font-size: 1.3rem;
}

.workbench {
  display: grid;
  grid-template-columns: minmax(0, 220px) minmax(0, 1fr);
  gap: 20px;
  align-items: center;
}

.photo-frame {
  padding: 12px;
  border: var(--outline);
  border-radius: var(--radius);
  background: #fff;
  box-shadow: var(--pop-small);
}

.photo-frame.era-darkroom {
  background: #3a2f2f;
}

.task-text {
  margin: 0 0 12px;
  font-size: 1.2rem;
  font-weight: 700;
}

.light-slider {
  display: grid;
  gap: 6px;
  font-weight: 800;
}

.light-slider input,
.counter {
  width: 100%;
}

input[type='range'] {
  accent-color: var(--pink);
  height: 32px;
}

.counter {
  margin: 0;
  font-family: var(--font-fun);
  font-size: 1.3rem;
  font-weight: 800;
}

.task-result {
  margin: 14px 0 0;
  padding: 12px 16px;
  border: var(--outline);
  border-radius: var(--radius);
  background: var(--green-soft);
  font-weight: 700;
}

@media (max-width: 600px) {
  .workbench {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .photo-frame {
    width: 200px;
  }
}
</style>
