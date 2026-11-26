// The platform is English only. Components keep calling t() so they stay close to the original lesson.
// text: a string (or an old { en } object). vars: replaces {name} placeholders.
export function t(text, vars = {}) {
  const value = typeof text === 'string' ? text : (text?.en ?? '')
  return value.replace(/\{(\w+)\}/g, (match, key) => vars[key] ?? match)
}

export function useLocale() {
  return { t }
}
