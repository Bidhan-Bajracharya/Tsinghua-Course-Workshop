<script setup>
// Asks once (with a clear privacy promise) before using the camera, then:
//  - camera on  → renders the default slot with the live `stream`
//  - camera off, refused or unsupported → renders the #fallback slot (cartoon version)
// The camera turns off automatically when this component leaves the screen.
import { watch } from 'vue'
import { cameraChoice, cameraSupported, useCamera } from '../../composables/useCamera.js'
import { useLocale } from '../../i18n/useLocale.js'
import { ui } from '../../i18n/ui.js'

const { t } = useLocale()
const { stream, error, starting, start, stop } = useCamera()

watch(
  cameraChoice,
  (choice) => (choice === 'on' && cameraSupported ? start() : stop()),
  { immediate: true },
)
</script>

<template>
  <div class="camera-gate">
    <!-- 1. Ask first -->
    <div v-if="cameraSupported && cameraChoice === null" class="promise">
      <h4 class="promise-title">📷 {{ t(ui.cameraAsk) }}</h4>
      <ul class="promise-list">
        <li v-for="(item, index) in ui.cameraPromises" :key="index">{{ t(item) }}</li>
      </ul>
      <div class="promise-actions">
        <button type="button" class="btn btn-green" @click="cameraChoice = 'on'">{{ t(ui.cameraYes) }}</button>
        <button type="button" class="btn" @click="cameraChoice = 'off'">{{ t(ui.cameraNo) }}</button>
      </div>
    </div>

    <!-- 2. Live camera -->
    <template v-else-if="cameraChoice === 'on' && cameraSupported && !error">
      <p v-if="starting || !stream" class="note">⏳ {{ t(ui.cameraStarting) }}</p>
      <template v-else>
        <slot :stream="stream" />
        <div class="camera-bar">
          <span class="privacy-badge">🔒 {{ t(ui.cameraPrivate) }}</span>
          <button type="button" class="btn small" @click="cameraChoice = 'off'">{{ t(ui.cameraTurnOff) }}</button>
        </div>
      </template>
    </template>

    <!-- 3. Cartoon version -->
    <template v-else>
      <p v-if="!cameraSupported" class="note">ℹ️ {{ t(ui.cameraUnsupported) }}</p>
      <p v-else-if="error" class="note">ℹ️ {{ t(ui.cameraError) }}</p>
      <slot name="fallback" />
      <div v-if="cameraSupported" class="camera-bar">
        <button type="button" class="btn small" @click="cameraChoice = 'on'">📷 {{ t(ui.cameraTurnOn) }}</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.promise {
  padding: 18px 20px;
  border: var(--outline);
  border-radius: var(--radius-lg);
  background: var(--green-soft);
}

.promise-title {
  font-family: var(--font-fun);
  font-size: 1.4rem;
  margin: 0 0 8px;
}

.promise-list {
  margin: 0 0 14px;
  padding-left: 0;
  list-style: none;
  display: grid;
  gap: 6px;
  font-size: 1.1rem;
  font-weight: 700;
}

.promise-actions,
.camera-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.camera-bar {
  justify-content: space-between;
  margin-top: 12px;
}

.privacy-badge {
  font-weight: 800;
  color: var(--green);
}

.note {
  margin: 0 0 12px;
  font-weight: 700;
  color: var(--muted);
}

.btn.small {
  min-height: 44px;
  font-size: 1rem;
  padding: 4px 16px;
}
</style>
