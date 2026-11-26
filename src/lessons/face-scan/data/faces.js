/* Random cartoon faces for the Face Gate game (ported from the original Face Scan Magic). */
export const SKIN = ['#f6d2b0', '#e8b48a', '#c98c5e', '#9a643c', '#f1c49b']
export const HAIR = ['#2b1c14', '#5a3820', '#111111', '#8a5a2b', '#3b2a20']
export const NAMES = ['Somchai', 'Malee', 'Nok', 'Ploy', 'Arthit', 'Fah', 'Krit', 'Mint', 'Ton', 'Pim', 'Beam', 'Nan']

export const rnd = (a, b) => a + Math.random() * (b - a)
export const pick = (a) => a[Math.floor(Math.random() * a.length)]
export const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** p: { w, h, eg (eye gap), es (eye size), nl (nose length), mw (mouth width), sk, hc, hair, glasses, hat } */
export function makeBase() {
  return {
    w: Math.round(rnd(54, 66)),
    h: Math.round(rnd(68, 78)),
    eg: Math.round(rnd(18, 30)),
    es: Math.round(rnd(5, 8)),
    nl: Math.round(rnd(14, 26)),
    mw: Math.round(rnd(14, 28)),
    sk: pick(SKIN),
    hc: pick(HAIR),
    hair: Math.floor(Math.random() * 3),
    glasses: false,
    hat: false,
  }
}

/** A clearly different face: two measurements pushed to the far end of their range. */
export function differ(base) {
  const d = { ...base }
  const lim = { eg: [18, 30], nl: [14, 26], mw: [14, 28], w: [54, 66] }
  shuffle(['eg', 'nl', 'mw', 'w'])
    .slice(0, 2)
    .forEach((k) => {
      const [a, b] = lim[k]
      d[k] = base[k] - a > b - base[k] ? a + Math.round(rnd(0, 2)) : b - Math.round(rnd(0, 2))
    })
  return d
}

/** One Face Gate round: an ID card, the real match (maybe with new hair / glasses / hat) and two others. */
export function makeRound(r) {
  const base = makeBase()
  const match = { ...base }
  if (r >= 2) {
    match.hair = (base.hair + 1) % 3
    match.hc = pick(HAIR)
  }
  if (r === 3) match.glasses = true
  if (r === 4) match.hat = true
  const d1 = differ(base)
  const d2 = differ(base)
  if (r < 2) {
    d1.sk = pick(SKIN)
    d2.hair = (base.hair + 2) % 3
  }
  return {
    id: { ...base, name: pick(NAMES) },
    opts: shuffle([
      { p: match, ok: true },
      { p: d1, ok: false },
      { p: d2, ok: false },
    ]),
  }
}
