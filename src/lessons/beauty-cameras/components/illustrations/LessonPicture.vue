<script setup>
// Draws a picture described in course data: a cartoon face or a moon photo.
// picture: { kind: 'face', look } or { kind: 'moon', detail, aiGuess }
import CartoonFace from './CartoonFace.vue'
import MoonPhoto from './MoonPhoto.vue'

defineProps({
  picture: { type: Object, required: true },
  label: { type: String, default: '' },
})
</script>

<template>
  <CartoonFace v-if="picture.kind === 'face'" :look="picture.look" :label="label" />
  <MoonPhoto v-else :detail="picture.detail ?? 0" :ai-guess="picture.aiGuess ?? false" :label="label" />
</template>
