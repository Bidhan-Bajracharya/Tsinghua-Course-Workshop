<script setup>
/**
 * Platform entry. Tiny hash router:
 *   #/                → landing page
 *   #/lesson/<slug>   → a lesson
 */
import { ref, computed, defineAsyncComponent, onMounted, onBeforeUnmount, shallowRef, watch } from 'vue'
import HomePage from './platform/HomePage.vue'
import LegacyLesson from './platform/LegacyLesson.vue'
import { lessons, findLesson } from './lessons'
import { saveResult } from './shared/progress'

const route = ref(parseHash())
function parseHash() {
  const m = location.hash.match(/^#\/lesson\/([\w-]+)/)
  return m ? { name: 'lesson', slug: m[1] } : { name: 'home' }
}
const onHash = () => {
  route.value = parseHash()
  window.scrollTo(0, 0)
}
onMounted(() => window.addEventListener('hashchange', onHash))
onBeforeUnmount(() => window.removeEventListener('hashchange', onHash))

const lesson = computed(() => (route.value.name === 'lesson' ? findLesson(route.value.slug) : null))
const LessonComp = shallowRef(null)
watch(
  lesson,
  (l) => {
    LessonComp.value = l && l.load ? defineAsyncComponent(l.load) : null
    document.title = l ? `${l.title} · AI Around Us` : 'AI Around Us'
  },
  { immediate: true },
)

const progressKey = ref(0)
function onComplete(result) {
  if (lesson.value) saveResult(lesson.value.id, result)
  progressKey.value++
}
const openLesson = (slug) => (location.hash = `#/lesson/${slug}`)
const goHome = () => (location.hash = '#/')
</script>

<template>
  <LegacyLesson v-if="lesson && lesson.legacy" :key="lesson.slug" :lesson="lesson" @exit="goHome" />
  <component
    :is="LessonComp"
    v-else-if="lesson && LessonComp"
    :key="lesson.slug"
    show-home
    @complete="onComplete"
    @exit="goHome"
  />
  <HomePage v-else :key="progressKey" :lessons="lessons" @open="openLesson" />
</template>

<style>
html, body { margin: 0; padding: 0; background: #f3f8ff; }
</style>
