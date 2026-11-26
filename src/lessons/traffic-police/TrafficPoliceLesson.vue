<script setup>
import { provide } from 'vue'
import LessonShell from '../../shared/LessonShell.vue'
import { lessonMeta } from './meta'
import { GUIDE } from './data/content'
import { createState, STATE_KEY } from './state'
import { soundOn, toggleSound } from './engine/core'
import TeamBar from './components/TeamBar.vue'
import TeamSetup from './components/TeamSetup.vue'
import './tp.css'

import TitleScene from './scenes/TitleScene.vue'
import HookScene from './scenes/HookScene.vue'
import RedLightScene from './scenes/RedLightScene.vue'
import AlprScene from './scenes/AlprScene.vue'
import QuickCheck from './scenes/QuickCheck.vue'
import RescueScene from './scenes/RescueScene.vue'
import DuelScene from './scenes/DuelScene.vue'
import CheckAiScene from './scenes/CheckAiScene.vue'
import PrivacyScene from './scenes/PrivacyScene.vue'
import SolarScene from './scenes/SolarScene.vue'
import MissionScene from './scenes/MissionScene.vue'
import GraduationScene from './scenes/GraduationScene.vue'

defineProps({ showHome: { type: Boolean, default: false } })
const emit = defineEmits(['complete', 'exit'])

const state = createState()
provide(STATE_KEY, state)

// Narration = the original slides' read-aloud text.
const scenes = [
  {
    id: 'intro', label: 'Start', icon: '🚦',
    steps: [
      { kind: 'learn', component: TitleScene, narration: 'The A.I. Traffic Police. How does artificial intelligence keep our city roads safe?' },
      { kind: 'think', component: HookScene, narration: "Can one police officer watch the road all day and all night? Let's find out. Press play a day." },
    ],
  },
  {
    id: 'c1', label: '1 · Traffic Lights', icon: '🔴', component: RedLightScene,
    narration: 'What happens when drivers run red lights? Move the slider and watch. Then turn on the A.I. cameras.',
  },
  {
    id: 'c2', label: '2 · AI Camera', icon: '📸',
    steps: [
      { kind: 'learn', component: AlprScene, narration: 'How does a camera read a number plate? Let’s go step by step. First, guess what the A.I. does next.' },
      { kind: 'gate', component: QuickCheck, narration: 'Quick check! Why does the system save a video of the rule-breaking? A: to make the traffic lights brighter. B: to hide what really happened. C: as proof, so the punishment is fair. D: to make a movie.' },
    ],
  },
  {
    id: 'c3', label: '3 · Helpers', icon: '🚁', component: RescueScene,
    narration: 'Rescue mission! Help the ambulance get through. Who should we send first?',
  },
  {
    id: 'c4', label: '4 · Traffic Brain', icon: '🧠', component: DuelScene,
    narration: 'Race time! Which crossroads moves cars faster: the old timer, or the A.I. traffic brain? Watch the waiting time and the smoke from waiting engines.',
  },
  {
    id: 'c5', label: '5 · Using AI Wisely', icon: '⚖️',
    steps: [
      { kind: 'think', component: CheckAiScene, narration: 'A.I. can make mistakes, so you are the checker! Look at each picture, read what the A.I. says, and vote. Is the A.I. right, or wrong?' },
      { kind: 'think', component: PrivacyScene, narration: 'Where should traffic cameras go? Talk with your team. Is it okay, or not okay?' },
      { kind: 'play', component: SolarScene, narration: 'Keep the solar A.I. camera alive! Aim the solar panel at the sun, use sleep mode, and delete old videos. Can the camera last all night?' },
    ],
  },
  {
    id: 'final', label: 'Final Mission', icon: '🏆',
    steps: [
      { kind: 'gate', component: MissionScene, props: { i: 0 }, narration: 'Mission 1. An ambulance is stuck: a car is parked in the emergency lane! Who do we send? A: sound locator. B: turn every light red. C: patrol robot. D: a map app.' },
      { kind: 'gate', component: MissionScene, props: { i: 1 }, narration: 'Mission 2. Morning rush hour! One road has a huge queue, the other is nearly empty, but both get the same green time. Who do we send? A: drone. B: patrol robot. C: sound locator. D: traffic brain.' },
      { kind: 'gate', component: MissionScene, props: { i: 2 }, narration: 'Mission 3. The A.I. read a muddy plate. It is only 61 percent sure. The owner of that car has never been to this road. What should we do? A: send the ticket, the A.I. is always right. B: a person checks the photo before anything happens. C: post the photo online. D: ticket every car that looks similar.' },
      { kind: 'play', component: GraduationScene, narration: 'Traffic Police Academy graduation! Type your name, or your class name, to make your certificate.' },
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
      <button class="ai-btn" :class="{ 'is-on': state.teamsOn }" @click="state.setupOpen = true">🏁 Teams</button>
      <button class="ai-btn" :aria-pressed="soundOn" :title="soundOn ? 'Sound effects on' : 'Sound effects off'" @click="toggleSound">
        {{ soundOn ? '🔈 Sound' : '🔇 Sound' }}
      </button>
    </template>
    <template #bar>
      <TeamBar @setup="state.setupOpen = true" />
      <TeamSetup v-if="state.setupOpen" @close="state.setupOpen = false" />
    </template>
  </LessonShell>
</template>
