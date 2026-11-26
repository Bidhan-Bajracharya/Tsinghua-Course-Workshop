/**
 * Remembers each lesson's best result in this browser only (per-device convenience).
 * Nothing is sent anywhere. Every access is wrapped because storage can be blocked.
 */
const KEY = 'ai-around-us-progress-v1'

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}') || {}
  } catch {
    return {}
  }
}

/** result: { score, total } */
export function saveResult(lessonId, result) {
  try {
    const all = loadProgress()
    const prev = all[lessonId]
    const pct = result.total ? result.score / result.total : 0
    if (!prev || pct >= prev.pct) {
      all[lessonId] = { score: result.score, total: result.total, pct, at: Date.now() }
      localStorage.setItem(KEY, JSON.stringify(all))
    }
  } catch {
    /* storage unavailable – ignore */
  }
}

/** For lessons without a score (legacy lessons): remember that it was opened. */
export function markVisited(lessonId) {
  try {
    const all = loadProgress()
    if (!all[lessonId]) {
      all[lessonId] = { visited: true, at: Date.now() }
      localStorage.setItem(KEY, JSON.stringify(all))
    }
  } catch {
    /* storage unavailable – ignore */
  }
}

/** 0–3 stars from a percentage */
export const starsFor = (pct) => (pct >= 0.85 ? 3 : pct >= 0.6 ? 2 : pct > 0 ? 1 : 0)
