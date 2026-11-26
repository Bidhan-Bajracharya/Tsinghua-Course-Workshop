<script setup>
/** Small helper: <Icon name="i-cam" /> renders the matching symbol from ArtDefs. */
defineProps({ name: { type: String, required: true } })
</script>

<template>
  <svg class="sd-icon" aria-hidden="true"><use :href="`#sd-${name}`" width="100%" height="100%" /></svg>
</template>

<style scoped>
.sd-icon { width: 40px; height: 40px; display: inline-block; }
</style>
