<script setup>
// Live AI mirror: real on-device face AI on the child's own camera image.
// Modes: 👀 see the points AI finds, 💄 AI makeup, 🧪 predict whether AI can still find you.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { loadFaceLandmarker } from '../../composables/faceLandmarker.js'
import { drawLandmarkDots, drawMakeup, drawMirroredVideo } from './faceDrawing.js'
import { useLocale } from '../../i18n/useLocale.js'
import { ui } from '../../i18n/ui.js'

// ~30 pictures a second looks smooth; not redrawing every screen refresh saves energy.
const FRAME_MS = 33

const props = defineProps({
  activity: { type: Object, required: true },
  stream: { type: Object, required: true }, // MediaStream
})

const emit = defineEmits(['complete', 'failed'])
const { t } = useLocale()

const MODES = [
  { id: 'sees', label: ui.modeSees },
  { id: 'makeup', label: ui.modeMakeup },
  { id: 'challenge', label: ui.modeChallenge },
]

const canvas = ref(null)
const mode = ref('sees')
const status = ref('loading') // 'loading' | 'ready' | 'error'
const facesFound = ref(0)

const styles = props.activity.cartoon.styles
const styleId = ref(styles[0].id)
// Live makeup uses each style's softer `live` colours (see course.js).
const makeupStyle = computed(() => styles.find((style) => style.id === styleId.value).live)

const challenges = props.activity.challenges
const challengeIndex = ref(0)
const prediction = ref(null) // null | 'find' | 'lose'
const challenge = computed(() => challenges[challengeIndex.value])
const challengesFinished = computed(() => challengeIndex.value >= challenges.length)

const video = document.createElement('video')
let landmarker = null
let frameId = 0
let lastFrameAt = 0

// Each frame: 1) draw the mirrored camera picture, 2) let the AI look at exactly that picture,
// 3) draw the points or makeup on top. Because the AI sees the same picture the child sees,
// the points always line up with the face, and they never lag behind the picture.
function render(now) {
  frameId = requestAnimationFrame(render)
  if (!canvas.value || video.readyState < 2 || now - lastFrameAt < FRAME_MS) return
  lastFrameAt = now

  const width = video.videoWidth
  const height = video.videoHeight
  if (canvas.value.width !== width || canvas.value.height !== height) {
    canvas.value.width = width
    canvas.value.height = height
  }

  const ctx = canvas.value.getContext('2d')
  drawMirroredVideo(ctx, video, width, height)

  const faces = landmarker ? landmarker.detectForVideo(canvas.value, now).faceLandmarks : []
  facesFound.value = faces.length

  const labels = { eye: t(ui.pointEye), nose: t(ui.pointNose), lips: t(ui.pointLips) }
  faces.forEach((landmarks) => {
    if (mode.value === 'sees' || mode.value === 'challenge') drawLandmarkDots(ctx, landmarks, width, height, labels)
    if (mode.value === 'makeup') drawMakeup(ctx, landmarks, width, height, makeupStyle.value)
  })
}

function nextChallenge() {
  prediction.value = null
  challengeIndex.value += 1
  if (challengesFinished.value) emit('complete')
}

function restartChallenges() {
  challengeIndex.value = 0
  prediction.value = null
}

onMounted(async () => {
  video.muted = true
  video.playsInline = true
  video.srcObject = props.stream
  video.play().catch(() => {})
  frameId = requestAnimationFrame(render)

  try {
    landmarker = await loadFaceLandmarker()
    status.value = 'ready'
  } catch {
    status.value = 'error'
    emit('failed')
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
  video.srcObject = null
})
</script>

<template>
  <div class="live-mirror">
    <div class="modes" role="tablist">
      <button
        v-for="item in MODES"
        :key="item.id"
        type="button"
        role="tab"
        class="mode"
        :class="{ active: item.id === mode }"
        :aria-selected="item.id === mode"
        @click="mode = item.id"
      >
        {{ t(item.label) }}
      </button>
    </div>

    <div class="mirror-layout">
      <div class="screen">
        <canvas ref="canvas" class="mirror-canvas" :aria-label="t(activity.title)" />
        <span class="face-status" :class="{ found: facesFound > 0 }" role="status" aria-live="polite">
          <template v-if="status === 'loading'">⏳ {{ t(ui.aiWaking) }}</template>
          <template v-else-if="facesFound > 0">✅ {{ t(ui.aiFound, { n: facesFound }) }}</template>
          <template v-else>❌ {{ t(ui.aiLost) }}</template>
        </span>
      </div>

      <div class="panel">
        <!-- 👀 What AI sees -->
        <template v-if="mode === 'sees'">
          <p class="panel-text">{{ t(activity.seesText) }}</p>
        </template>

        <!-- 💄 Makeup -->
        <template v-else-if="mode === 'makeup'">
          <p class="panel-text">{{ t(activity.makeupText) }}</p>
          <div class="style-chips">
            <button
              v-for="style in styles"
              :key="style.id"
              type="button"
              class="btn style-chip"
              :class="{ 'btn-pink': style.id === styleId }"
              :aria-pressed="style.id === styleId"
              @click="styleId = style.id"
            >
              {{ style.emoji }} {{ t(style.label) }}
            </button>
          </div>
        </template>

        <!-- 🧪 Predict, then try -->
        <template v-else>
          <div v-if="!challengesFinished" :key="challenge.id" class="challenge pop-in">
            <p class="challenge-count">{{ t(ui.sortProgress, { n: challengeIndex + 1, total: challenges.length }) }}</p>
            <p class="challenge-task"><span aria-hidden="true">{{ challenge.emoji }}</span> {{ t(challenge.text) }}</p>

            <template v-if="!prediction">
              <p class="panel-text">🔮 {{ t(ui.predictFind) }}</p>
              <div class="style-chips">
                <button type="button" class="btn btn-green" @click="prediction = 'find'">👍 {{ t(ui.willFind) }}</button>
                <button type="button" class="btn btn-pink" @click="prediction = 'lose'">👎 {{ t(ui.willLose) }}</button>
              </div>
            </template>
            <template v-else>
              <p class="panel-text">
                {{ t(ui.yourGuess) }} <strong>{{ prediction === 'find' ? t(ui.willFind) : t(ui.willLose) }}</strong>
              </p>
              <p class="panel-text">🧪 {{ t(ui.nowTryIt) }}</p>
              <button type="button" class="btn btn-yellow" @click="nextChallenge">{{ t(ui.triedIt) }}</button>
            </template>
          </div>

          <div v-else class="challenge-done pop-in">
            <p>🤖 {{ t(activity.challengeDone) }}</p>
            <button type="button" class="btn" @click="restartChallenges">🔄 {{ t(ui.playAgain) }}</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modes {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 14px;
}

.mode {
  min-height: 48px;
  border: var(--outline);
  border-radius: 999px;
  background: #fff;
  font-weight: 800;
}

.mode.active {
  background: var(--purple);
  color: #fff;
}

.mirror-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.screen {
  position: relative;
  border: var(--outline);
  border-radius: var(--radius);
  overflow: hidden;
  background: #222;
  box-shadow: var(--pop-small);
}

.mirror-canvas {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.face-status {
  position: absolute;
  left: 10px;
  bottom: 10px;
  padding: 4px 12px;
  border: 2px solid var(--line);
  border-radius: 999px;
  background: var(--yellow-soft);
  font-weight: 800;
}

.face-status.found {
  background: var(--green-soft);
}

.panel-text {
  margin: 0 0 12px;
  font-size: 1.1rem;
  font-weight: 700;
}

.style-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.challenge-count {
  margin: 0;
  color: var(--muted);
  font-weight: 700;
}

.challenge-task {
  margin: 4px 0 12px;
  font-size: 1.3rem;
  font-weight: 800;
}

.challenge-done {
  padding: 14px;
  border: var(--outline);
  border-radius: var(--radius);
  background: var(--green-soft);
  font-weight: 700;
}

@media (max-width: 700px) {
  .mirror-layout {
    grid-template-columns: 1fr;
  }

  .mode {
    font-size: 0.9rem;
  }
}
</style>
