<script setup>
// Teach the AI with moon photos first; the more it has studied, the further the
// enhancement slider can go. Shows the idea: AI adds detail it LEARNED from examples.
// Each training photo uses energy (⚡), and a real telescope photo shows that the AI
// also "invented" a crater: AI results can look real and still be wrong.
import { computed, ref, watch } from 'vue'
import MoonPhoto from '../illustrations/MoonPhoto.vue'
import { useLocale } from '../../i18n/useLocale.js'

const props = defineProps({
  activity: { type: Object, required: true },
})

const emit = defineEmits(['complete'])
const { t } = useLocale()

const SHARP_ENOUGH = 66 // slider value after which the real-photo comparison appears

const studied = ref(0)
const detail = ref(0) // 0–100
const comparing = ref(false)

const total = props.activity.photosNeeded
const maxDetail = computed(() => Math.round((studied.value / total) * 100))
const level = computed(() => props.activity.levels.find((item) => detail.value <= item.max))

// If the limit is lower than the slider (never happens going up, but keeps state valid).
watch(maxDetail, (max) => {
  if (detail.value > max) detail.value = max
})

function teach() {
  if (studied.value < total) studied.value += 1
}

function compareWithReal() {
  comparing.value = true
  emit('complete')
}
</script>

<template>
  <div class="moon-trainer">
    <h3 class="activity-title">🌕 {{ t(activity.title) }}</h3>

    <div class="training">
      <button type="button" class="btn btn-yellow" :disabled="studied >= total" @click="teach">
        {{ t(activity.teachLabel) }}
      </button>
      <div class="brain" aria-hidden="true">🧠</div>
      <div class="album">
        <div class="thumbs">
          <span v-for="slot in total" :key="slot" class="thumb" :class="{ filled: slot <= studied }">
            <MoonPhoto v-if="slot <= studied" class="pop-in" :detail="1" />
          </span>
        </div>
        <p class="studied">{{ t(activity.studied, { n: studied, total }) }}</p>
        <p class="energy">{{ t(activity.energyLabel) }} <span aria-hidden="true">{{ '⚡'.repeat(studied) || '—' }}</span></p>
      </div>
    </div>

    <div class="moons">
      <figure class="moon-figure">
        <MoonPhoto :detail="0" :label="t(activity.captions.before)" />
        <figcaption>{{ t(activity.captions.before) }}</figcaption>
      </figure>
      <span class="arrow" aria-hidden="true">➜</span>
      <figure class="moon-figure highlight">
        <MoonPhoto :detail="detail / 100" ai-guess :mark-guess="comparing" :label="t(activity.captions.after)" />
        <figcaption>{{ t(activity.captions.after) }}</figcaption>
      </figure>
      <template v-if="comparing">
        <span class="arrow" aria-hidden="true">≠</span>
        <figure class="moon-figure pop-in">
          <MoonPhoto :detail="1" :label="t(activity.captions.real)" />
          <figcaption>{{ t(activity.captions.real) }}</figcaption>
        </figure>
      </template>
    </div>

    <label class="slider">
      <span>🎚️ {{ t(activity.sliderLabel) }}</span>
      <input
        v-model.number="detail"
        type="range"
        min="0"
        :max="maxDetail"
        :disabled="maxDetail === 0"
        :aria-valuetext="t(level.label)"
      />
    </label>
    <p v-if="maxDetail === 0" class="hint">👆 {{ t(activity.teachFirst) }}</p>
    <p v-else class="level" role="status" aria-live="polite">{{ t(level.label) }}</p>

    <div v-if="detail > SHARP_ENOUGH" class="is-it-real pop-in">
      <p class="question">🤔 {{ t(activity.isItReal) }}</p>
      <button v-if="!comparing" type="button" class="btn btn-purple" @click="compareWithReal">
        {{ t(activity.compareLabel) }}
      </button>
      <p v-else class="message pop-in">🔭 {{ t(activity.compareText) }}</p>
    </div>
  </div>
</template>

<style scoped>
.training {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  margin: 12px 0 18px;
}

.brain {
  font-size: 2.6rem;
  animation: bob 1.6s ease-in-out infinite;
}

.album {
  flex: 1;
  min-width: 220px;
}

.thumbs {
  display: flex;
  gap: 8px;
}

.thumb {
  width: 44px;
  height: 44px;
  border: 2px dashed var(--line-strong);
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
}

.thumb.filled {
  border-style: solid;
}

.studied,
.energy {
  margin: 6px 0 0;
  font-weight: 800;
}

.energy {
  color: var(--orange);
}

.is-it-real {
  margin-top: 18px;
  padding: 14px 16px;
  border: var(--outline);
  border-radius: var(--radius);
  background: var(--purple-soft);
}

.question {
  margin: 0 0 10px;
  font-size: 1.2rem;
  font-weight: 800;
}

.message {
  margin: 0;
  font-weight: 700;
  font-size: 1.1rem;
}

.moons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.moon-figure {
  flex: 1 1 120px;
  max-width: 200px;
  margin: 0;
  padding: 10px;
  border: var(--outline);
  border-radius: var(--radius);
  background: #fff;
  box-shadow: var(--pop-small);
  text-align: center;
  font-weight: 800;
}

.moon-figure.highlight {
  background: var(--yellow-soft);
}

.moon-figure figcaption {
  margin-top: 6px;
}

.arrow {
  font-size: 2rem;
  font-weight: 800;
  color: var(--pink);
}

.slider {
  display: grid;
  gap: 6px;
  margin-top: 18px;
  font-weight: 800;
}

.slider input {
  width: 100%;
  accent-color: var(--pink);
  height: 32px;
}

.hint,
.level {
  margin: 8px 0 0;
  font-size: 1.2rem;
  font-weight: 800;
}

.hint {
  color: var(--muted);
}
</style>
