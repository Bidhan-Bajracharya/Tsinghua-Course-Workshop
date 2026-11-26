<script setup>
// Cartoon version of AI makeup: pick a reference style → AI "scans" the face → makeup is transferred.
// Used when the camera is off (see AiMirror.vue).
import { computed, onBeforeUnmount, ref } from 'vue'
import CartoonFace from '../illustrations/CartoonFace.vue'
import { useLocale } from '../../i18n/useLocale.js'
import { ui } from '../../i18n/ui.js'

const SCAN_MS = 1800

const props = defineProps({
  activity: { type: Object, required: true },
})

const emit = defineEmits(['complete'])
const { t } = useLocale()

const styleId = ref(props.activity.styles[0].id)
const style = computed(() => props.activity.styles.find((item) => item.id === styleId.value))
const phase = ref('idle') // 'idle' | 'scanning' | 'done'
let timer

function pickStyle(id) {
  styleId.value = id
  phase.value = 'idle'
  clearTimeout(timer)
}

function runAi() {
  phase.value = 'scanning'
  timer = setTimeout(() => {
    phase.value = 'done'
    emit('complete')
  }, SCAN_MS)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="makeup-studio">
    <p class="activity-hint">{{ t(activity.instruction) }}</p>

    <div class="studio">
      <div class="styles" role="group" :aria-label="t(ui.reference)">
        <button
          v-for="item in activity.styles"
          :key="item.id"
          type="button"
          class="style-card"
          :class="{ active: item.id === styleId }"
          :aria-pressed="item.id === styleId"
          @click="pickStyle(item.id)"
        >
          <CartoonFace :look="item.reference" :label="t(item.label)" />
          <span class="style-name">{{ item.emoji }} {{ t(item.label) }}</span>
        </button>
      </div>

      <div class="stage">
        <div class="mirror" :class="{ scanning: phase === 'scanning' }">
          <CartoonFace :look="phase === 'done' ? style.look : activity.baseLook" :label="t(phase === 'done' ? ui.after : ui.before)" />

          <svg v-if="phase === 'scanning'" class="scan-overlay" viewBox="0 0 200 220" aria-hidden="true">
            <g v-for="(point, index) in activity.landmarks" :key="index" class="landmark"
              :style="{ animationDelay: `${index * 0.25}s` }">
              <circle :cx="point.x" :cy="point.y" r="5" />
              <text :x="point.x" :y="point.y - 9" text-anchor="middle">{{ t(point.label) }}</text>
            </g>
          </svg>
          <span v-if="phase === 'scanning'" class="scan-line" aria-hidden="true" />
        </div>

        <div class="controls">
          <button v-if="phase === 'idle'" type="button" class="btn btn-purple" @click="runAi">{{ t(activity.goLabel) }}</button>
          <p v-else-if="phase === 'scanning'" class="status" role="status">🔍 {{ t(activity.scanningText) }}</p>
          <template v-else>
            <p class="status result pop-in" role="status">✨ {{ t(style.result) }}</p>
            <p class="try-another">👆 {{ t(ui.tryAnother) }}</p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.studio {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
  gap: 24px;
  align-items: center;
}

.styles {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.style-card {
  display: grid;
  gap: 4px;
  padding: 8px;
  border: var(--outline);
  border-radius: var(--radius);
  background: #fff;
  box-shadow: var(--pop-small);
}

.style-card.active {
  background: var(--pink-soft);
  outline: 4px solid var(--pink);
}

.style-name {
  font-weight: 800;
}

.stage {
  display: grid;
  grid-template-columns: minmax(0, 190px) minmax(0, 1fr);
  gap: 16px;
  align-items: center;
}

.mirror {
  position: relative;
  padding: 12px;
  border: var(--outline);
  border-radius: 50% 50% var(--radius) var(--radius);
  background: var(--purple-soft);
  box-shadow: var(--pop-small);
  overflow: hidden;
}

.scan-overlay {
  position: absolute;
  inset: 12px;
  width: calc(100% - 24px);
}

.landmark {
  opacity: 0;
  animation: pop-in 0.3s ease-out forwards;
}

.landmark circle {
  fill: #22e6a0;
  stroke: var(--ink);
  stroke-width: 2;
}

.landmark text {
  font-size: 12px;
  font-weight: 800;
  fill: var(--ink);
  paint-order: stroke;
  stroke: #fff;
  stroke-width: 3px;
}

.scan-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 6px;
  background: #22e6a0;
  box-shadow: 0 0 14px #22e6a0;
  animation: scan 0.9s linear infinite alternate;
}

@keyframes scan {
  from {
    top: 6%;
  }
  to {
    top: 92%;
  }
}

.status {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
}

.result {
  padding: 12px 16px;
  border: var(--outline);
  border-radius: var(--radius);
  background: var(--green-soft);
}

.try-another {
  margin: 10px 0 0;
  color: var(--muted);
  font-weight: 700;
}

@media (max-width: 760px) {
  .studio {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .stage {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .mirror {
    width: 200px;
  }
}
</style>
