<script setup>
import { provide, computed } from 'vue'
import LessonShell from '../../shared/LessonShell.vue'
import { lessonMeta } from './meta'
import { GUIDE } from './data/content'
import { createState, STATE_KEY } from './state'

import StartScene from './scenes/StartScene.vue'
import ComicScene from './scenes/ComicScene.vue'
import TicketScene from './scenes/TicketScene.vue'
import RailScene from './scenes/RailScene.vue'
import HowItWorks from './scenes/HowItWorks.vue'
import FaceGate from './scenes/FaceGate.vue'
import TeachRobot from './scenes/TeachRobot.vue'
import RightWay from './scenes/RightWay.vue'
import UsesMap from './scenes/UsesMap.vue'
import AnimalDetective from './scenes/AnimalDetective.vue'
import SafeScene from './scenes/SafeScene.vue'
import GreenScene from './scenes/GreenScene.vue'
import RememberScene from './scenes/RememberScene.vue'
import QuizScene from './scenes/QuizScene.vue'
import CertScene from './scenes/CertScene.vue'

defineProps({ showHome: { type: Boolean, default: false } })
const emit = defineEmits(['complete', 'exit'])

const state = createState()
provide(STATE_KEY, state)
const stars = computed(() => state.stars)

const scenes = [
  {
    id: 'start', label: 'Start', icon: '👋', component: StartScene,
    narration: "Hi! I'm Beep. See the pink dots on this face? A computer put them there. Today you'll find out why! First question: how do you know your best friend when you see them?",
  },
  {
    id: 'tickets', label: 'Ticket Time Machine', icon: '🎫',
    steps: [
      { kind: 'think', component: ComicScene, narration: 'Story time! Long ago, Mali bought a paper ticket for the train. Whoosh! The wind blew it away! Can Mali still get on the train?' },
      { kind: 'play', component: TicketScene, narration: 'Let’s ride the ticket time machine! Pick a time, then try the ticket gate. See how checking tickets changed from paper, to magnetic cards, to your face.' },
      { kind: 'learn', component: RailScene, narration: 'History corner! China’s high-speed trains go 250 to 350 kilometres an hour. Start the race and see how fast the train is!' },
    ],
  },
  {
    id: 'how', label: 'How Face Scan Works', icon: '📏',
    steps: [
      { kind: 'learn', component: HowItWorks, narration: 'How does the gate know it’s you? It looks, it measures, and it matches. What does the computer do first?' },
      { kind: 'play', component: FaceGate, narration: 'Now you are the face gate! Find the traveller who matches the ID card. Use your own eyes first. Then you can use the Measure button.' },
    ],
  },
  {
    id: 'learns', label: 'AI Learns', icon: '🧠',
    steps: [
      { kind: 'play', component: TeachRobot, narration: 'Teach Beep what a cat is! Is this a cat? Vote with your thumbs, then tap.' },
      { kind: 'think', component: RightWay, narration: 'Face scans are clever. Here is how to use them the right way: ask first, remember A.I. can be wrong, and think first.' },
    ],
  },
  {
    id: 'everywhere', label: 'Face Scans Everywhere', icon: '🗺️',
    steps: [
      { kind: 'learn', component: UsesMap, narration: 'Face scans aren’t just ticket checkers! Tap each place on the map to see how face recognition helps people and animals.' },
      { kind: 'play', component: AnimalDetective, narration: 'Every dog’s nose print is different, like a fingerprint! Find the dog that matches the nose print.' },
    ],
  },
  {
    id: 'safe', label: 'Safe & Green', icon: '🔑',
    steps: [
      { kind: 'think', component: SafeScene, narration: 'My face is my secret key! Someone at the station says: scan this code and get a free gift. What should you do?' },
      { kind: 'think', component: GreenScene, narration: 'Be a green A.I. helper! A.I. runs in giant data centres that use lots of electricity. Choose your green promises.' },
    ],
  },
  {
    id: 'finish', label: 'Finish', icon: '🏆',
    steps: [
      { kind: 'learn', component: RememberScene, narration: 'Remember! Tickets went from paper to face scans. Computers learn faces by measuring them. A.I. can be wrong, so a person checks. My face is my secret key. And I save energy.' },
      { kind: 'gate', component: QuizScene, narration: 'Quiz time! Think first, then tap. If you get it wrong, read the hint and try again.' },
      { kind: 'play', component: CertScene, narration: 'Congratulations, Face Gate expert! Type your first name to make your certificate.' },
    ],
  },
]
</script>

<template>
  <LessonShell
    :meta="lessonMeta"
    :scenes="scenes"
    :guide="GUIDE"
    :show-home="showHome"
    @complete="emit('complete', $event)"
    @exit="emit('exit')"
  >
    <template #header-extra>
      <span class="stars-pill" :aria-label="`${stars} stars`">⭐ {{ stars }}</span>
    </template>
  </LessonShell>
</template>

<style scoped>
.stars-pill {
  font-family: 'Baloo 2', 'Nunito', sans-serif; font-weight: 800; font-size: 18px;
  background: #fff4d6; color: #7a5600; padding: 8px 16px; border-radius: 999px; box-shadow: inset 0 0 0 2px #ffd666;
}
</style>
