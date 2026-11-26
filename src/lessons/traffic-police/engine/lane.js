/* Emergency-lane rescue mission (drone + patrol robot). Ported from the original lesson helpers.js. */
import A from './art'
import { makeCanvas, Loop, sfx } from './core'

const LANES = [222, 262, 302]
const SHOULDER = 346
const CRASH_X = 780
const plateOf = (i) => {
  const L = 'ABCDEFGHJKLMNPRSTUVWXYZ'
  return L[(i * 7) % 23] + L[(i * 5) % 23] + '·' + String(2000 + ((i * 733) % 8000)).slice(-4)
}

export const LANE_BUTTONS = ['1 · Accident!', '2 · Send drone', '3 · Call ambulance', '4 · Send patrol robot']
export const LANE_TIPS = [
  'Traffic is moving nicely. The emergency lane (striped) must stay EMPTY.',
  'Oh no! A crash ahead. Traffic stops. Someone sneaks into the emergency lane…',
  'The drone flies over the jam and sends a live video to the control centre.',
  'The ambulance uses the emergency lane… but a car is BLOCKING it!',
  'The robot photographs the blocking car. It leaves. The ambulance gets through! 🚑',
]

export function makeLane(cv, { onStage, onDone } = {}) {
  const W = 1000
  const H = 560
  const ctx = makeCanvas(cv, W, H)
  const timers = []
  const later = (fn, ms) => timers.push(setTimeout(fn, ms))
  const me = {}

  me.reset = () => {
    timers.forEach(clearTimeout)
    timers.length = 0
    me.stage = 0
    me.t = 0
    me.cars = []
    me.id = 0
    me.crash = null
    me.blocker = null
    me.done = false
    me.drone = { x: 120, y: 100, tx: 120, ty: 100, on: false }
    me.robot = { x: 170, y: 470, tx: 170, ty: 470, ang: 0 }
    me.amb = null
    me.flash = 0
    me.feed = false
    for (let l = 0; l < 3; l++) for (let x = -40; x < 1000; x += 110 + Math.random() * 80) addCar(l, x)
    onStage && onStage(0)
  }
  function addCar(l, x) {
    const kind = ['car', 'car', 'taxi', 'suv', 'van', 'bus'][(Math.random() * 6) | 0]
    me.cars.push({ id: ++me.id, l, x, y: LANES[l], v: 110, vmax: 100 + Math.random() * 30, kind, col: kind === 'bus' ? '#ffb703' : A.CAR_COLORS[(Math.random() * 10) | 0], len: A.carLen(kind) })
  }
  me.act = (i) => {
    if (i !== me.stage) return
    if (i === 0) {
      sfx('bad')
      me.crash = { x: CRASH_X, t: 0 }
      const c1 = { id: ++me.id, l: 1, x: CRASH_X - 6, y: LANES[1] + 6, v: 0, vmax: 0, kind: 'car', col: '#ff5a5f', len: 50, crashed: true, ang: 0.35 }
      const c2 = { id: ++me.id, l: 2, x: CRASH_X + 22, y: LANES[2] - 4, v: 0, vmax: 0, kind: 'suv', col: '#3a86ff', len: 54, crashed: true, ang: -0.25 }
      me.cars = me.cars.filter((c) => !(c.l > 0 && Math.abs(c.x - CRASH_X) < 70))
      me.cars.push(c1, c2)
      later(() => {
        const cands = me.cars.filter((c) => c.l === 2 && !c.crashed && c.x > 300 && c.x < 560)
        const b = cands[0] || me.cars.find((c) => c.l === 2 && !c.crashed)
        if (b) {
          b.l = 3
          b.shoulderTarget = 480
          me.blocker = b
        }
      }, 1800)
    }
    if (i === 1) {
      me.drone.on = true
      me.drone.tx = CRASH_X
      me.drone.ty = 170
      sfx('whoosh')
    }
    if (i === 2) {
      me.amb = { x: -60, y: SHOULDER, v: 150, blocked: false }
      sfx('siren')
    }
    if (i === 3) {
      me.robot.tx = (me.blocker ? me.blocker.x : 500) - 10
      me.robot.ty = 395
      me.robot.go = true
    }
    me.stage++
    onStage && onStage(me.stage)
  }
  function step(dt) {
    me.t += dt
    const lanes = [[], [], [], []]
    me.cars.forEach((c) => lanes[c.l].push(c))
    lanes.forEach((list, l) => {
      list.sort((a, b) => b.x - a.x)
      list.forEach((c, i) => {
        if (c.crashed) return
        let target = c.vmax
        if (me.crash) {
          if (l === 1 || l === 2) {
            const d = CRASH_X - 50 - (c.x + c.len / 2)
            if (d < 140) target = Math.min(target, Math.max(0, d * 0.8))
          } else if (l === 0) target = Math.min(target, c.x > CRASH_X - 200 && c.x < CRASH_X + 80 ? 28 : 60)
        }
        if (i > 0) {
          const a = list[i - 1]
          const gap = a.x - a.len / 2 - (c.x + c.len / 2)
          if (gap < 12) target = 0
          else if (gap < 70) target = Math.min(target, (gap - 12) * 2)
        }
        if (l === 3) {
          if (c.y < SHOULDER) c.y = Math.min(SHOULDER, c.y + 40 * dt)
          target = !c.leaving ? (c.x < c.shoulderTarget ? 40 : 0) : 120
        }
        c.v += Math.max(-300 * dt, Math.min(150 * dt, target - c.v))
        c.x += c.v * dt
        if (c.leaving && c.x > 620) {
          c.y += c.v * dt * 0.85
          c.exitAng = Math.min(0.7, (c.exitAng || 0) + dt * 1.5)
        }
      })
    })
    me.cars = me.cars.filter((c) => c.x < 1100 && c.y < 620)
    for (let l = 0; l < 3; l++) {
      const min = Math.min(...me.cars.filter((c) => c.l === l).map((c) => c.x), 999)
      if (min > 80 && Math.random() < dt * 1.2) addCar(l, -40)
    }
    const d = me.drone
    if (d.on) {
      d.x += (d.tx - d.x) * Math.min(1, dt * 1.3)
      d.y += (d.ty - d.y) * Math.min(1, dt * 1.3)
      if (Math.hypot(d.tx - d.x, d.ty - d.y) < 6 && !me.feed) {
        me.feed = true
        sfx('ding')
      }
    }
    const a = me.amb
    if (a) {
      let target = 170
      const b = me.blocker
      if (b && !b.gone && b.y >= SHOULDER - 4 && b.x > a.x) {
        const gap = b.x - b.len / 2 - (a.x + 31)
        if (gap < 20) {
          target = 0
          a.blocked = true
        } else if (gap < 90) target = Math.min(target, (gap - 20) * 2)
      } else a.blocked = false
      if (a.leave) target = 170
      else if (a.x > CRASH_X - 80) {
        target = Math.max(0, (CRASH_X - 40 - a.x) * 2)
        if (target < 2 && !a.arrived) {
          a.arrived = true
          sfx('win')
          later(() => me.crash && (me.crash.clearing = true), 1800)
        }
      }
      a.v += Math.max(-400 * dt, Math.min(200 * dt, target - a.v))
      a.x += a.v * dt
    }
    if (me.crash && me.crash.clearing) {
      me.crash.t += dt
      if (me.crash.t > 1.2) {
        me.cars = me.cars.filter((c) => !c.crashed)
        me.crash = null
        me.done = true
        if (me.amb) me.amb.leave = true
        onDone && onDone()
      }
    }
    const r = me.robot
    if (r.go) {
      const b = me.blocker
      if (b && !b.gone) r.tx = b.x - 6
      const dx = r.tx - r.x
      const dy = r.ty - r.y
      const dd = Math.hypot(dx, dy)
      if (dd > 4) {
        r.ang = Math.atan2(dy, dx)
        r.x += (dx / dd) * Math.min(dd, 140 * dt)
        r.y += (dy / dd) * Math.min(dd, 140 * dt)
      } else if (!r.snapped) {
        r.snapped = true
        me.flash = 1
        sfx('snap')
        later(() => {
          if (b) {
            b.leaving = true
            b.gone = true
          }
        }, 1200)
      }
    }
    if (me.flash) me.flash = Math.max(0, me.flash - dt * 2)
  }
  function draw(T) {
    const c = ctx
    A.grass(c, W, H, 5)
    A.building(c, 20, 20, 190, 120, '#c7d7f5', { label: 'Control centre' })
    c.fillStyle = '#e6e9f2'; c.beginPath(); c.arc(300, 90, 40, 0, 7); c.fill(); c.strokeStyle = '#ffc93c'; c.lineWidth = 4; c.stroke()
    c.fillStyle = '#1d2b64'; c.font = '700 34px "Baloo 2"'; c.textAlign = 'center'; c.fillText('H', 300, 102)
    for (let x = 380; x < W; x += 90) A.tree(c, x, 140, 18)
    c.fillStyle = '#9aa3b5'; c.fillRect(0, 196, W, 6)
    c.fillStyle = '#4b5063'; c.fillRect(0, 202, W, 124)
    c.fillStyle = '#5d6276'; c.fillRect(0, 326, W, 44)
    c.save(); c.beginPath(); c.rect(0, 326, W, 44); c.clip(); c.strokeStyle = 'rgba(255,210,63,.75)'; c.lineWidth = 5
    for (let x = -60; x < W + 60; x += 34) { c.beginPath(); c.moveTo(x, 370); c.lineTo(x + 40, 326); c.stroke() }
    c.restore()
    c.fillStyle = '#ffd23f'; c.fillRect(0, 324, W, 4)
    c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 3; c.setLineDash([24, 20]); c.beginPath(); c.moveTo(0, 242); c.lineTo(W, 242); c.moveTo(0, 282); c.lineTo(W, 282); c.stroke(); c.setLineDash([])
    c.fillStyle = '#9aa3b5'; c.fillRect(0, 370, W, 6)
    c.fillStyle = '#4b5063'; c.beginPath(); c.moveTo(600, 370); c.lineTo(700, 370); c.lineTo(860, 560); c.lineTo(740, 560); c.closePath(); c.fill()
    c.fillStyle = '#21c48d'; A.rr(c, 612, 388, 74, 28, 6); c.fill(); c.fillStyle = '#fff'; c.font = '600 15px "Baloo 2"'; c.textAlign = 'center'; c.fillText('EXIT →', 649, 408)
    c.fillStyle = '#fff'; c.font = '600 16px "Baloo 2"'; c.textAlign = 'left'; c.fillText('EMERGENCY LANE: keep clear', 20, 354)
    c.fillStyle = '#e6e9f2'; A.rr(c, 130, 440, 90, 60, 12); c.fill(); c.strokeStyle = '#3a86ff'; c.lineWidth = 3; c.stroke()
    for (let x = 280; x < 580; x += 80) A.tree(c, x, 480, 18)
    for (let x = 900; x < W; x += 80) A.tree(c, x, 470, 18)
    me.cars.forEach((k) => A.car(c, k.x, k.y, k.crashed ? k.ang : k.exitAng || 0, k.col, k.kind, { brake: k.v < 20 }))
    if (me.crash) { A.crash(c, CRASH_X + 6, LANES[1] + 20, 0.9, T * 0.5); A.tag(c, CRASH_X + 6, LANES[1] - 14, 'CRASH', '#ff3b3b') }
    if (me.amb) { A.car(c, me.amb.x, me.amb.y, 0, '#ffffff', 'ambulance', { flash: true }); if (me.amb.blocked) A.tag(c, me.amb.x, me.amb.y - 24, 'Blocked!', '#ff3b3b') }
    if (me.blocker && !me.blocker.gone && me.stage >= 2) A.tag(c, me.blocker.x, me.blocker.y + 50, 'Not allowed here!', '#fb8500')
    A.robot(c, me.robot.x, me.robot.y, me.robot.ang, T)
    if (me.robot.snapped && me.blocker) {
      const b = me.blocker
      c.strokeStyle = '#3a86ff'; c.lineWidth = 3; c.beginPath(); c.moveTo(me.robot.x, me.robot.y); c.lineTo(b.x, b.y); c.stroke()
      if (b.x < 720) { c.strokeRect(b.x - 30, b.y - 18, 60, 36); A.tag(c, b.x, b.y - 24, '📸 ' + plateOf(b.id), '#3a86ff') }
    }
    if (me.flash) { c.globalAlpha = me.flash * 0.7; c.fillStyle = '#fff'; c.fillRect(0, 0, W, H); c.globalAlpha = 1 }
    if (me.drone.on) {
      if (me.feed) { c.strokeStyle = 'rgba(131,56,236,.6)'; c.lineWidth = 2; c.setLineDash([5, 5]); c.beginPath(); c.moveTo(me.drone.x, me.drone.y); c.lineTo(115, 80); c.stroke(); c.setLineDash([]) }
      A.drone(c, me.drone.x, me.drone.y, T, 1.1)
    } else A.drone(c, 300, 90, 0, 1)
    if (me.feed) {
      const ix = W - 300, iy = 16, iw = 280, ih = 170
      c.fillStyle = '#1d2b64'; A.rr(c, ix - 6, iy - 6, iw + 12, ih + 44, 14); c.fill()
      c.drawImage(cv, (CRASH_X - 110) * 2, (LANES[1] - 70) * 2, 220 * 2, 135 * 2, ix, iy, iw, ih)
      c.fillStyle = '#ff3b3b'; c.beginPath(); c.arc(ix + 16, iy + 16, 6, 0, 7); c.fill(); c.fillStyle = '#fff'; c.font = '700 15px "Baloo 2"'; c.textAlign = 'left'; c.fillText('DRONE LIVE', ix + 28, iy + 21)
      c.fillStyle = '#fff'; c.font = '500 15px "Baloo 2"'; c.fillText('2 cars · 2 lanes blocked · need ambulance', ix + 4, iy + ih + 22)
    }
    if (me.done) A.tag(c, W / 2, 60, '✓ Rescue done: road open again!', '#21c48d', '#fff', 22)
  }
  const loop = Loop((dt, t) => { step(dt); draw(t) })
  me.start = () => loop.start()
  me.stop = () => { loop.stop(); timers.forEach(clearTimeout) }
  me.reset()
  draw(0)
  return me
}
