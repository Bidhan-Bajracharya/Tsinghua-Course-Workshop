<script setup>
import { provide, computed } from 'vue'
import LessonShell from '../../shared/LessonShell.vue'
import ArtDefs from './components/ArtDefs.vue'
import LearnCards from './components/LearnCards.vue'
import { lessonMeta } from './meta'
import { LEARN } from './data/content'
import { createState, STATE_KEY, totalStars } from './state'

import StartScene from './scenes/StartScene.vue'
import PredictScene from './scenes/PredictScene.vue'
import RemoteScene from './scenes/RemoteScene.vue'
import TollGate from './scenes/TollGate.vue'
import SensorsScene from './scenes/SensorsScene.vue'
import BrainScene from './scenes/BrainScene.vue'
import GuessScene from './scenes/GuessScene.vue'
import WeatherScene from './scenes/WeatherScene.vue'
import TicketScene from './scenes/TicketScene.vue'
import JudgeScene from './scenes/JudgeScene.vue'
import GreenScene from './scenes/GreenScene.vue'
import RulesScene from './scenes/RulesScene.vue'
import FinishScene from './scenes/FinishScene.vue'

defineProps({ showHome: { type: Boolean, default: false } })
const emit = defineEmits(['complete', 'exit'])

const state = createState()
provide(STATE_KEY, state)
const stars = computed(() => totalStars(state))

const learn = (key) => ({ kind: 'learn', component: LearnCards, props: LEARN[key], narration: LEARN[key].line })
const gate = (g, n, narration) => ({ kind: 'gate', component: TollGate, props: { gate: g, n }, narration })

const scenes = [
  {
    id: 'start', label: 'Start', icon: '🚦', component: StartScene,
    narration: "Hi, I'm Lumi, a self-driving car. Nobody drives me! Would you ride in me? Choose a face, then let's go on a road trip.",
  },
  {
    id: 'past', label: 'Past Town', icon: '🏚️',
    steps: [
      learn('past'),
      { kind: 'think', component: PredictScene, narration: 'Predict first! Who is in control of this car? A person, the road, or A.I.?' },
      { kind: 'play', component: RemoteScene, narration: "It's 1925. You are the radio! Use the arrows to drive the car to the flag, and don't hit the cones." },
      gate('g1', 1, 'Toll gate! First, how sure do you feel? Then steer me into the lane with the right answer.'),
    ],
  },
  {
    id: 'tech', label: 'Tech City', icon: '🏙️',
    steps: [
      learn('tech'),
      { kind: 'play', component: SensorsScene, narration: "Help! I can't see! Switch on all my sensors: camera, radar, lidar and my H.D. map." },
      learn('ai'),
      { kind: 'play', component: BrainScene, narration: 'Be my A.I. brain! Read what my sensors say, then choose stop, slow or go before the timer runs out.' },
      { kind: 'think', component: GuessScene, narration: 'Guess first! Slide to make your guess, then lock it in.' },
      gate('g2', 2, 'Toll gate number two! How sure do you feel? Then steer me into the right lane.'),
    ],
  },
  {
    id: 'risk', label: 'Risk Ridge', icon: '⛰️',
    steps: [
      learn('risk'),
      { kind: 'play', component: WeatherScene, narration: 'Change the weather. Which sensor can still see?' },
      { kind: 'think', component: TicketScene, narration: 'True story! A driverless taxi was stopped by the police, and nobody was inside. Who should get the ticket? You decide.' },
      learn('resp'),
      { kind: 'play', component: JudgeScene, narration: 'Responsible or not? You be the judge!' },
      gate('g3', 3, 'Toll gate number three! How sure do you feel? Then steer me into the right lane.'),
    ],
  },
  {
    id: 'green', label: 'Green Garage', icon: '🌱',
    steps: [
      learn('green'),
      { kind: 'think', component: GreenScene, narration: '12 kids need to get to school. Choose how each group travels, and try to use as little energy as you can.' },
      gate('g4', 4, 'The last toll gate! How sure do you feel? Then steer me into the right lane.'),
    ],
  },
  {
    id: 'finish', label: 'Finish', icon: '🏁',
    steps: [
      { kind: 'think', component: RulesScene, narration: 'Write my rule book! Pick three rules for robot cars, or write your own.' },
      { kind: 'play', component: FinishScene, narration: "We made it! You're Road Ready! Type your name to get your certificate. And now, would you ride in me?" },
    ],
  },
]
</script>

<template>
  <div class="sd-root">
    <ArtDefs />
    <LessonShell
      :meta="lessonMeta"
      :scenes="scenes"
      :show-home="showHome"
      @complete="emit('complete', $event)"
      @exit="emit('exit')"
    >
      <template #header-extra>
        <span class="stars-pill" :aria-label="`${stars} of 12 stars`">⭐ {{ stars }} / 12</span>
      </template>
    </LessonShell>
  </div>
</template>

<style scoped>
.stars-pill {
  font-family: 'Baloo 2', 'Nunito', sans-serif;
  font-weight: 800;
  font-size: 18px;
  background: #fff4d6;
  color: #7a5600;
  padding: 8px 16px;
  border-radius: 999px;
  box-shadow: inset 0 0 0 2px #ffd666;
}
</style>
