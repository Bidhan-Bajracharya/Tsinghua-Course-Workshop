<script setup>
// Level 2 activity: the live AI mirror when the camera is on,
// or the cartoon makeup studio when the camera is off or the AI could not load.
import { ref } from 'vue'
import CameraGate from '../camera/CameraGate.vue'
import LiveAiMirror from '../camera/LiveAiMirror.vue'
import MakeupStudio from './MakeupStudio.vue'
import { useLocale } from '../../i18n/useLocale.js'
import { ui } from '../../i18n/ui.js'

defineProps({
  activity: { type: Object, required: true },
})

const emit = defineEmits(['complete'])
const { t } = useLocale()
const aiFailed = ref(false)
</script>

<template>
  <div class="ai-mirror">
    <h3 class="activity-title">🪞 {{ t(activity.title) }}</h3>
    <p class="activity-hint">{{ t(activity.instruction) }}</p>

    <CameraGate>
      <template #default="{ stream }">
        <LiveAiMirror
          v-if="!aiFailed"
          :activity="activity"
          :stream="stream"
          @complete="emit('complete')"
          @failed="aiFailed = true"
        />
        <template v-else>
          <p class="note">ℹ️ {{ t(ui.aiLoadError) }}</p>
          <MakeupStudio :activity="activity.cartoon" @complete="emit('complete')" />
        </template>
      </template>

      <template #fallback>
        <MakeupStudio :activity="activity.cartoon" @complete="emit('complete')" />
      </template>
    </CameraGate>
  </div>
</template>

<style scoped>
.note {
  font-weight: 700;
  color: var(--muted);
}
</style>
