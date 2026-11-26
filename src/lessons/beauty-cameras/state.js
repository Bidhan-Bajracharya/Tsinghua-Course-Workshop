import { reactive, inject } from 'vue'

// How many "What do you think?" answers earn the 💬 Thinker badge (same as the original).
const THOUGHTS_FOR_THINKER = 2

/**
 * Per-visit state for Lesson 3: thinking badges, the child's own answers to
 * "What do you think?", which checkpoints were passed, and the certificate name.
 * Badges reward thinking (predicting, noticing, reflecting, being fair), not speed.
 */
export function createState() {
  const S = reactive({
    badges: new Set(),
    thoughts: [], // [{ question, answer }]
    passed: new Set(), // stage ids whose checkpoint was passed
    name: '',
  })
  S.awardBadge = (id) => id && S.badges.add(id)
  // Keeps one answer per question (a child may change their mind).
  S.recordThought = ({ question, answer }) => {
    const existing = S.thoughts.find((th) => th.question === question)
    if (existing) existing.answer = answer
    else S.thoughts.push({ question, answer })
    if (S.thoughts.length >= THOUGHTS_FOR_THINKER) S.awardBadge('thinker')
  }
  S.reset = () => {
    S.badges.clear()
    S.passed.clear()
    S.thoughts.splice(0)
  }
  return S
}

export const STATE_KEY = Symbol('beauty-cameras-state')
export const useLessonState = () => inject(STATE_KEY)
