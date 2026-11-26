<script setup>
// Story opener: 1) predict what a beauty filter will change, 2) flip the filter switch
// on a video call (live camera if allowed, cartoon otherwise), 3) compare with the prediction.
import { computed, ref, watch } from 'vue'
import CameraGate from '../camera/CameraGate.vue'
import CameraVideo from '../camera/CameraVideo.vue'
import CartoonFace from '../illustrations/CartoonFace.vue'
import ChangeChecklist from '../thinking/ChangeChecklist.vue'
import PhoneFrame from './story/PhoneFrame.vue'
import FilterSwitch from './story/FilterSwitch.vue'
import { useLocale } from '../../i18n/useLocale.js'
import { ui } from '../../i18n/ui.js'

const props = defineProps({
  stage: { type: Object, required: true },
})

const emit = defineEmits(['complete', 'badge'])
const { t } = useLocale()

const canDo = computed(() => props.stage.changes.filter((change) => change.changed))
const cannotDo = computed(() => props.stage.changes.filter((change) => !change.changed))

const guesses = ref([])
const predicted = ref(false)
const filterOn = ref(false)
const revealed = ref(false)

// The first time the filter is switched on, reveal which guesses were right.
watch(filterOn, (on) => {
  if (on && !revealed.value) {
    revealed.value = true
    emit('badge', props.stage.badge)
    emit('complete')
  }
})
</script>

<template>
  <div class="story">
    <h2 class="stage-title">📸 {{ t(stage.title) }}</h2>
    <p class="story-text">{{ t(stage.text) }}</p>

    <!-- 1. Predict -->
    <div class="predict">
      <span class="chip">🔮 {{ t(ui.predictFirst) }}</span>
      <p class="predict-question">{{ t(stage.predictQuestion) }}</p>
      <ChangeChecklist v-model="guesses" :options="stage.changes" :revealed="revealed" />
      <button
        v-if="!predicted"
        type="button"
        class="btn btn-yellow lock-in"
        :disabled="!guesses.length"
        @click="predicted = true"
      >
        {{ t(ui.lockGuess) }}
      </button>
    </div>

    <!-- 2. Try: live camera if allowed, otherwise the cartoon face -->
    <div v-if="predicted" class="try pop-in">
      <CameraGate>
        <template #default="{ stream }">
          <div class="scene">
            <PhoneFrame :glowing="filterOn">
              <CameraVideo :stream="stream" :filter="filterOn ? stage.cameraFilter : 'none'" :label="t(stage.switchLabel)" />
            </PhoneFrame>
            <FilterSwitch v-model="filterOn" :label="t(stage.switchLabel)" :hint="!revealed" />
          </div>
        </template>
        <template #fallback>
          <div class="scene">
            <PhoneFrame :glowing="filterOn">
              <CartoonFace :look="filterOn ? stage.filteredLook : stage.plainLook" :label="t(stage.switchLabel)" />
            </PhoneFrame>
            <FilterSwitch v-model="filterOn" :label="t(stage.switchLabel)" :hint="!revealed" />
          </div>
        </template>
      </CameraGate>
    </div>

    <!-- 3. Compare (the checklist above now shows the answers) -->
    <p v-if="revealed" class="reveal pop-in">🤩 {{ t(stage.reveal) }}</p>

    <div v-if="revealed" class="facts pop-in">
      <h3 class="facts-title">🔍 {{ t(stage.filterFacts.title) }}</h3>
      <div class="facts-columns">
        <div class="facts-list can">
          <strong>{{ t(stage.filterFacts.canLabel) }}</strong>
          <ul>
            <li v-for="change in canDo" :key="change.id">{{ t(change.text) }}</li>
          </ul>
        </div>
        <div class="facts-list cannot">
          <strong>{{ t(stage.filterFacts.cannotLabel) }}</strong>
          <ul>
            <li v-for="change in cannotDo" :key="change.id">{{ t(change.text) }}</li>
          </ul>
        </div>
      </div>
      <p class="facts-why">💡 {{ t(stage.filterFacts.why) }}</p>
    </div>
  </div>
</template>

<style scoped>
.stage-title {
  font-size: clamp(1.8rem, 5vw, 2.4rem);
}

.story-text {
  margin: 8px 0 18px;
  font-size: 1.3rem;
  font-weight: 700;
}

.predict {
  padding: 16px 18px;
  border: var(--outline);
  border-radius: var(--radius-lg);
  background: var(--yellow-soft);
}

.predict-question {
  margin: 10px 0 12px;
  font-size: 1.25rem;
  font-weight: 800;
}

.lock-in {
  margin-top: 14px;
}

.try {
  margin-top: 22px;
}

.scene {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

.facts {
  margin-top: 18px;
  padding: 16px 18px;
  border: var(--outline);
  border-radius: var(--radius-lg);
  background: var(--sky);
}

.facts-title {
  font-size: 1.4rem;
  margin-bottom: 10px;
}

.facts-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
  gap: 12px;
}

.facts-list {
  padding: 10px 14px;
  border: 2px solid var(--line);
  border-radius: var(--radius);
  font-size: 1.1rem;
}

.facts-list.can {
  background: var(--green-soft);
}

.facts-list.cannot {
  background: var(--red-soft);
}

.facts-list ul {
  margin: 6px 0 0;
  padding-left: 1.2em;
  font-weight: 700;
}

.facts-why {
  margin: 12px 0 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.reveal {
  margin: 22px 0 0;
  padding: 14px 18px;
  border: var(--outline);
  border-radius: var(--radius);
  background: var(--green-soft);
  font-size: 1.2rem;
  font-weight: 700;
}
</style>
