<script setup>
/** Renders a fixed-size stage (w × h) scaled to fit the available width. */
import { ref, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps({ w: { type: Number, required: true }, h: { type: Number, required: true } })
const outer = ref(null)
const k = ref(1)
let ro = null
onMounted(() => {
  const fit = () => outer.value && (k.value = outer.value.clientWidth / props.w)
  fit()
  ro = new ResizeObserver(fit)
  ro.observe(outer.value)
})
onBeforeUnmount(() => ro && ro.disconnect())
</script>

<template>
  <div ref="outer" class="sb" :style="{ height: h * k + 'px' }">
    <div class="sb__in" :style="{ width: w + 'px', height: h + 'px', transform: `scale(${k})` }"><slot /></div>
  </div>
</template>

<style scoped>
.sb { position: relative; width: 100%; }
.sb__in { position: absolute; left: 0; top: 0; transform-origin: 0 0; }
</style>
