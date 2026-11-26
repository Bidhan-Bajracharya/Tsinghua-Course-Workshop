<script setup>
// Shows a live camera stream like a mirror. `filter` is any CSS filter (used as a simple beauty filter).
import { ref, watchEffect } from 'vue'

const props = defineProps({
  stream: { type: Object, required: true }, // MediaStream
  filter: { type: String, default: 'none' },
  label: { type: String, default: '' },
})

const video = ref(null)

watchEffect(() => {
  if (video.value) video.value.srcObject = props.stream
})
</script>

<template>
  <video ref="video" class="camera-video" :style="{ filter }" :aria-label="label" autoplay muted playsinline />
</template>

<style scoped>
.camera-video {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--radius);
  background: #222;
  transform: scaleX(-1); /* mirror, like looking in a mirror */
  transition: filter 0.3s;
}
</style>
