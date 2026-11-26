import { reactive, inject } from 'vue'

/** Per-visit state shared by all screens of Lesson 1. */
export function createState() {
  return reactive({
    stars: 0, // earned in games (Face Gate, Animal Detective, Safe or Risky, quiz)
    gateDone: false,
    pledges: [],
    quizScore: 0,
    quizDone: false,
    name: '',
  })
}
export const STATE_KEY = Symbol('face-scan-state')
export const useLessonState = () => inject(STATE_KEY)
