<script setup>
import LessonShell from '../../shared/LessonShell.vue'
import { lessonMeta } from './meta'

import IntroScene from './scenes/IntroScene.vue'
import MeetRobotScene from './scenes/MeetRobotScene.vue'
import TimelineScene from './scenes/TimelineScene.vue'
import RaceScene from './scenes/RaceScene.vue'
import LaserScene from './scenes/LaserScene.vue'
import VisionScene from './scenes/VisionScene.vue'
import InventorScene from './scenes/InventorScene.vue'
import RecapScene from './scenes/RecapScene.vue'
import QuizScene from './scenes/QuizScene.vue'

defineProps({ showHome: { type: Boolean, default: false } })
const emit = defineEmits(['complete', 'exit'])

const scenes = [
  {
    id: 'intro', label: 'Start', icon: '👋', component: IntroScene,
    narration: "Hi! I'm Robo, a robot vacuum. I clean floors all by myself! Today you will find out how robot vacuums grew up, and the clever A.I. tricks that help them see and think.",
  },
  {
    id: 'meet', label: 'Meet Robo', icon: '🤖', component: MeetRobotScene,
    narration: 'Meet Robo! Tap the glowing dots to discover each part of a robot vacuum and what it does.',
  },
  {
    id: 'timeline', label: 'Time Machine', icon: '⏳', component: TimelineScene,
    narration: "Let's ride the time machine! Robot vacuums have changed a lot. Tap each year to meet a robot and see how it senses the room.",
  },
  {
    id: 'race', label: 'Cleaning Race', icon: '🏁', component: RaceScene,
    narration: 'Three robots, one messy room. One bumps around randomly, one uses a laser map, and one uses a laser map and a camera. Press start and see who cleans the most!',
  },
  {
    id: 'laser', label: 'Laser Eyes', icon: '🔦', component: LaserScene,
    narration: 'The lights are off! Drag Robo around the dark house. Its laser bounces off the walls and furniture, and Robo uses that to draw a map.',
  },
  {
    id: 'vision', label: 'Camera Eyes', icon: '📷', component: VisionScene,
    narration: 'Drop some things on the floor, like a sock or a cat. Watch how the camera and A.I. spot them so Robo can go around. Then switch the camera off and see what happens!',
  },
  {
    id: 'inventor', label: 'Inventor', icon: '💡', component: InventorScene,
    narration: 'Now you are the inventor! Choose the parts for your own robot vacuum. Can you make it helpful, and cheap enough for families to buy?',
  },
  {
    id: 'recap', label: 'Big Ideas', icon: '⭐', component: RecapScene,
    narration: "Here are today's three big ideas. Robot vacuums grew up from bumping around to using lasers and cameras. Maps help robots clean faster. And great inventions mix imagination with practical thinking.",
  },
  {
    id: 'quiz', label: 'Quiz', icon: '🏆', component: QuizScene,
    narration: 'Quiz time! Answer the questions to become a Robot Vacuum Expert.',
  },
]
</script>

<template>
  <LessonShell
    :meta="lessonMeta"
    :scenes="scenes"
    :show-home="showHome"
    @complete="emit('complete', $event)"
    @exit="emit('exit')"
  />
</template>
