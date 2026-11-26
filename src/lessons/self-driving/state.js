import { reactive, inject } from 'vue'

/** Per-visit state shared by all screens of the lesson (provided by SelfDrivingLesson). */
export function createState() {
  return reactive({
    poll1: null,
    poll2: null,
    stars: { g1: 0, g2: 0, g3: 0, g4: 0 },
    conf: {},
    rules: [],
    ownRule: '',
    name: '',
  })
}

export const STATE_KEY = Symbol('self-driving-state')
export const useLessonState = () => inject(STATE_KEY)
export const totalStars = (s) => Object.values(s.stars).reduce((a, b) => a + b, 0)
