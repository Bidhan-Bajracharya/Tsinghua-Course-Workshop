/* Front-view car + street-camera scene as SVG strings (ported from the original lesson camera.js). */
import A from './art'

export const PLATE = ['K', 'L', '5', '2', '8', '0']
export const plateText = () => PLATE.slice(0, 2).join('') + '·' + PLATE.slice(2).join('')

/** Front-view car; origin = bottom centre, ~320 wide. */
export function frontCar(col, plateTxt, opt = {}) {
  const dk = A.shade(col, -0.25)
  const lt = A.shade(col, 0.25)
  return `
  <ellipse cx="0" cy="2" rx="165" ry="16" fill="rgba(0,0,0,.28)"/>
  <rect x="-145" y="-44" width="42" height="46" rx="10" fill="#1b1d2a"/><rect x="103" y="-44" width="42" height="46" rx="10" fill="#1b1d2a"/>
  <path d="M-112,-200 L112,-200 Q128,-200 134,-186 L150,-118 L-150,-118 L-134,-186 Q-128,-200 -112,-200Z" fill="${dk}"/>
  <path d="M-98,-189 L98,-189 L122,-126 L-122,-126Z" fill="url(#wsg)"/>
  ${opt.driver !== false ? `<g opacity=".95"><circle cx="-48" cy="-160" r="17" fill="#f2c29b"/><path d="M-66,-163 Q-48,-188 -30,-163 Q-40,-172 -48,-171 Q-58,-172 -66,-163Z" fill="#3b2a20"/><path d="M-84,-126 Q-84,-146 -48,-146 Q-12,-146 -12,-126Z" fill="#3a86ff"/>
  <path d="M-74,-145 L-20,-126" stroke="#555a70" stroke-width="7" stroke-linecap="round"/></g>` : ''}
  <path d="M-98,-189 L-60,-189 L-110,-126 L-122,-126Z" fill="rgba(255,255,255,.25)"/>
  <rect x="-158" y="-124" width="316" height="96" rx="26" fill="${col}"/>
  <rect x="-158" y="-124" width="316" height="20" rx="10" fill="${lt}" opacity=".6"/>
  <ellipse cx="-114" cy="-90" rx="28" ry="15" fill="#fffbe0" stroke="${dk}" stroke-width="4"/><ellipse cx="114" cy="-90" rx="28" ry="15" fill="#fffbe0" stroke="${dk}" stroke-width="4"/>
  <ellipse cx="-114" cy="-90" rx="12" ry="7" fill="#fff"/><ellipse cx="114" cy="-90" rx="12" ry="7" fill="#fff"/>
  <rect x="-62" y="-108" width="124" height="34" rx="10" fill="#2d3142"/>
  <g stroke="#555a70" stroke-width="3"><line x1="-50" y1="-99" x2="50" y2="-99"/><line x1="-50" y1="-91" x2="50" y2="-91"/><line x1="-50" y1="-83" x2="50" y2="-83"/></g>
  <rect x="-160" y="-38" width="320" height="16" rx="8" fill="${dk}"/>
  <g class="plate"><rect x="-56" y="-68" width="112" height="34" rx="5" fill="${opt.plateBg || '#ffd23f'}" stroke="#1d2b64" stroke-width="3"/>
  <text x="0" y="-43" text-anchor="middle" font-size="22" font-weight="700" fill="#1d2b64" font-family="'Baloo 2',Nunito,Arial,sans-serif">${plateTxt}</text></g>`
}

export const DEFS = `<defs><linearGradient id="wsg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd3ff"/><stop offset="1" stop-color="#5a8fd6"/></linearGradient>
<linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd0ff"/><stop offset="1" stop-color="#dff3ff"/></linearGradient></defs>`

export const MUD = `<g fill="#7a5a3a" opacity=".92"><ellipse cx="18" cy="-52" rx="14" ry="11"/><ellipse cx="30" cy="-44" rx="9" ry="7"/><ellipse cx="8" cy="-42" rx="6" ry="5"/></g>`

/** The muddy plate picture (used by "check the AI" and Mission 3). */
export const muddyCarSVG = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-170 -215 340 240">${DEFS}${frontCar('#3a86ff', 'KL·5280', { driver: false })}${MUD}</svg>`

/** x on the perspective road at height y; f = 0 (left edge) … 1 (right edge). */
export const roadX = (y, f) => {
  const t = (y - 150) / 390
  return A.lerp(400, 0, t) + (A.lerp(560, 960, t) - A.lerp(400, 0, t)) * f
}

/** Street camera view (960 × 540) with the car at height carY. */
export function sceneSVG(carY, light = 'red') {
  const s = 0.12 + ((carY - 175) / (470 - 175)) * 0.88
  const stopY = 350
  let lanes = ''
  for (let y = 160; y < 540; y += 38) {
    const y2 = y + 22
    lanes += `<polygon points="${roadX(y, 0.5) - 1 - (y - 150) / 130},${y} ${roadX(y, 0.5) + 1 + (y - 150) / 130},${y} ${roadX(y2, 0.5) + 1 + (y2 - 150) / 130},${y2} ${roadX(y2, 0.5) - 1 - (y2 - 150) / 130},${y2}" fill="#fff" opacity=".8"/>`
  }
  let zebra = ''
  for (let i = 0; i < 9; i++) {
    const f0 = 0.06 + i * 0.1
    const f1 = f0 + 0.05
    zebra += `<polygon points="${roadX(368, f0)},368 ${roadX(368, f1)},368 ${roadX(400, f1)},400 ${roadX(400, f0)},400" fill="#fff" opacity=".85"/>`
  }
  const lc = { red: '#ff3b3b', yellow: '#ffc93c', green: '#2fe08a' }
  return `${DEFS}
  <rect width="960" height="540" fill="url(#skyg)"/>
  <g fill="#b7c6e6">${[[0, 70, 60], [70, 40, 80], [130, 90, 50], [200, 60, 70], [600, 80, 60], [680, 50, 90], [790, 100, 70], [870, 60, 90]].map(([x, h, w]) => `<rect x="${x}" y="${150 - h}" width="${w}" height="${h}" rx="4"/>`).join('')}</g>
  <g fill="#cdd8f0">${[[30, 40, 50], [260, 55, 60], [520, 40, 60], [740, 30, 50]].map(([x, h, w]) => `<rect x="${x}" y="${150 - h}" width="${w}" height="${h}" rx="4"/>`).join('')}</g>
  <polygon points="0,150 400,150 0,540" fill="#9fdc8f"/><polygon points="960,150 560,150 960,540" fill="#9fdc8f"/>
  <polygon points="380,150 400,150 0,540 0,500" fill="#cfd4e0"/><polygon points="560,150 580,150 960,500 960,540" fill="#cfd4e0"/>
  <polygon points="400,150 560,150 960,540 0,540" fill="#555a6e"/>
  ${lanes}
  <polygon points="${roadX(stopY, 0)},${stopY} ${roadX(stopY, 1)},${stopY} ${roadX(stopY + 10, 1)},${stopY + 10} ${roadX(stopY + 10, 0)},${stopY + 10}" fill="#fff"/>
  ${zebra}
  <g transform="translate(850,0)"><rect x="-6" y="140" width="12" height="230" fill="#6b7088"/><rect x="-30" y="100" width="60" height="150" rx="14" fill="#1f2233"/>
    ${['red', 'yellow', 'green'].map((c, i) => `<circle cx="0" cy="${130 + i * 45}" r="17" fill="${light === c ? lc[c] : '#3a3e55'}"/>${light === c ? `<circle cx="0" cy="${130 + i * 45}" r="28" fill="${lc[c]}" opacity=".3"/>` : ''}`).join('')}</g>
  <g transform="translate(480,${carY}) scale(${s})">${frontCar('#ff5a5f', plateText())}</g>`
}
