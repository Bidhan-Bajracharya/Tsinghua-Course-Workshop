import { reactive, inject, watch } from 'vue'

/* Optional classroom teams (saved in this browser so a page refresh keeps the scores). */
export const TEAM_COLORS = ['#ef476f', '#2f7cf6', '#22b573', '#ffb703']
export const TEAM_NAMES = ['Red Racers', 'Blue Bolts', 'Green Go', 'Yellow Stars']
const KEY = 'ai-traffic-teams-v1'

function loadTeams() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (v && Array.isArray(v.teams) && v.teams.length === 4) return v
  } catch (e) {
    /* ignore */
  }
  return { on: false, count: 4, teams: TEAM_NAMES.map((name) => ({ name, score: 0 })) }
}

/** Per-visit state shared by every screen of Lesson 2. */
export function createState() {
  const t = loadTeams()
  const S = reactive({
    teamsOn: t.on,
    teamCount: t.count,
    teams: t.teams.map((x, i) => ({ ...x, color: TEAM_COLORS[i] })),
    bump: null, // index of the team that just scored (for the little animation)
    setupOpen: false, // team set-up pop-up
    answers: {}, // checkpoint id → true / false (this player's first answer)
    name: '',
  })
  watch(
    () => [S.teamsOn, S.teamCount, S.teams.map((x) => x.name + ':' + x.score).join('|')],
    () => {
      try {
        localStorage.setItem(KEY, JSON.stringify({ on: S.teamsOn, count: S.teamCount, teams: S.teams.map(({ name, score }) => ({ name, score })) }))
      } catch (e) {
        /* ignore */
      }
    },
  )
  return S
}

export function addPoints(S, i, n) {
  const t = S.teams[i]
  t.score = Math.max(0, t.score + n)
  if (n > 0) {
    S.bump = null
    requestAnimationFrame(() => (S.bump = i))
  }
}
export const activeTeams = (S) => S.teams.slice(0, S.teamCount)

export const STATE_KEY = Symbol('traffic-police-state')
export const useLessonState = () => inject(STATE_KEY)
