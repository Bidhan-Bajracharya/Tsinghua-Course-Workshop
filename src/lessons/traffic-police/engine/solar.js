/* Solar AI camera: keep it working all day and night. Ported from the original lesson responsible.js. */
import A from './art'
import { makeCanvas, Loop, sfx, burst } from './core'

/**
 * ui: reactive object the scene shows ({ bat, mem, msg, running, watched, missed }).
 * opts: reactive controls ({ ang, sleep, del }).
 */
export function makeSolar(cv, ui, opts) {
  const W = 1000
  const H = 560
  const ctx = makeCanvas(cv, W, H)
  const me = {}
  me.reset = () => {
    me.h = 6
    me.bat = 60
    me.mem = 10
    me.cars = []
    me.on = true
    me.run = false
    me.watched = 0
    me.missed = 0
    me.flash = 0
    msg('Press ▶ Start the day. Can the camera keep working until morning?')
    sync()
  }
  me.startDay = () => {
    me.reset()
    me.run = true
    ui.running = true
    sfx('whoosh')
  }
  function msg(t) {
    ui.msg = t
  }
  function sync() {
    ui.bat = me.bat
    ui.mem = me.mem
    ui.watched = me.watched
    ui.missed = me.missed
    ui.running = me.run
  }
  const sunH = () => (me.h >= 6 && me.h <= 18 ? Math.sin(((me.h - 6) / 12) * Math.PI) : 0)
  const sunAng = () => ((me.h - 12) / 6) * 60
  function step(dt) {
    if (me.run) {
      me.h += dt * 0.55
      const aim = Math.max(0, Math.cos(((opts.ang - sunAng()) * Math.PI) / 180))
      const charge = sunH() * aim * 9
      const use = (opts.sleep ? 0.6 : 2.4) + (me.mem > 80 ? 1.5 : 0)
      me.bat = Math.max(0, Math.min(100, me.bat + (charge - use) * dt))
      if (me.bat <= 0 && me.on) {
        me.on = false
        sfx('bad')
      }
      if (me.bat > 5) me.on = true
      const night = sunH() === 0
      if (Math.random() < dt * (night ? 0.5 : 1.2)) me.cars.push({ x: -60, col: A.CAR_COLORS[(Math.random() * 10) | 0], seen: false })
      if (opts.del) me.mem = Math.max(10, me.mem - dt * 6)
      if (me.h >= 30) {
        me.run = false
        const ok = me.missed === 0
        msg(ok ? '🌞 Morning! Your green AI camera never stopped working. Well done!' : `🌙 The battery ran out: ${me.missed} cars were not watched. Change something and try again!`)
        sfx(ok ? 'win' : 'bad')
        if (ok) burst(cv, 80)
      } else if (me.mem > 80 && !opts.del) msg('💾 Memory full! Storing lots of old videos wastes energy.')
      else if (!me.on) msg('🪫 Battery empty! The camera is off and cannot watch the road.')
      else if (sunH() > 0 && Math.cos(((opts.ang - sunAng()) * Math.PI) / 180) < 0.6) msg('☀️ The panel is not facing the sun. Move the slider!')
      else msg(sunH() > 0 ? '⚡ Charging from the sun…' : '🌙 Night: no sunshine. The camera uses its battery.')
    }
    me.cars.forEach((c) => {
      c.x += 150 * dt
      if (!c.seen && c.x > 480) {
        c.seen = true
        if (me.on) {
          me.watched++
          me.flash = 1
          me.mem = Math.min(100, me.mem + (opts.del ? 2 : 7))
          me.bat = Math.max(0, me.bat - (opts.sleep ? 1.5 : 0.5))
          sfx('snap')
        } else me.missed++
      }
    })
    me.cars = me.cars.filter((c) => c.x < W + 80)
    me.flash = Math.max(0, me.flash - dt * 3)
    sync()
  }
  function draw() {
    const c = ctx
    const sh = sunH()
    const day = Math.max(0, Math.min(1, sh * 3))
    const g = c.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, day ? `rgb(${A.lerp(20, 95, day) | 0},${A.lerp(27, 194, day) | 0},${A.lerp(77, 255, day) | 0})` : '#141b4d')
    g.addColorStop(1, day ? '#dff3ff' : '#2c3a8a')
    c.fillStyle = g; c.fillRect(0, 0, W, H)
    if (!day) for (let i = 0; i < 40; i++) { c.fillStyle = 'rgba(255,255,255,.7)'; c.fillRect((i * 137) % W, (i * 71) % 300, 2, 2) }
    const a = ((me.h - 6) / 12) * Math.PI
    if (sh > 0) {
      const x = W / 2 - Math.cos(a) * 420, y = 380 - Math.sin(a) * 320
      c.fillStyle = '#ffc93c'; c.shadowColor = '#ffd23f'; c.shadowBlur = 40; c.beginPath(); c.arc(x, y, 40, 0, 7); c.fill(); c.shadowBlur = 0
    } else {
      const b = (((me.h - 18) % 24) / 12) * Math.PI
      c.fillStyle = '#eef1ff'; c.beginPath(); c.arc(W / 2 - Math.cos(b) * 420, 380 - Math.sin(b) * 300, 28, 0, 7); c.fill()
    }
    c.fillStyle = '#9fdc8f'; c.fillRect(0, 400, W, 30); c.fillStyle = '#4b5063'; c.fillRect(0, 430, W, 90); c.fillStyle = '#cfd4e0'; c.fillRect(0, 520, W, 40)
    c.strokeStyle = '#ffd23f'; c.lineWidth = 4; c.setLineDash([30, 20]); c.beginPath(); c.moveTo(0, 475); c.lineTo(W, 475); c.stroke(); c.setLineDash([])
    for (let x = 60; x < W; x += 220) {
      if (Math.abs(x - 560) > 80) {
        c.fillStyle = '#6a8fd6'; c.fillRect(x, 300, 90, 100); c.fillStyle = day ? '#bfe3ff' : '#ffd23f'
        for (let k = 0; k < 3; k++) c.fillRect(x + 12 + k * 26, 320, 16, 16)
      }
    }
    c.fillStyle = '#6b7088'; c.fillRect(552, 150, 16, 280)
    c.save(); c.translate(560, 140); c.rotate((opts.ang * Math.PI) / 180); c.fillStyle = '#1d3f8f'; c.fillRect(-70, -10, 140, 20); c.strokeStyle = '#c9cfe0'; c.lineWidth = 4; c.strokeRect(-70, -10, 140, 20); c.strokeStyle = '#9fc4ff'; c.lineWidth = 2
    for (let k = -35; k < 70; k += 35) { c.beginPath(); c.moveTo(k, -10); c.lineTo(k, 10); c.stroke() }
    c.restore()
    if (sh > 0 && me.run) {
      const sx = W / 2 - Math.cos(a) * 420, sy = 380 - Math.sin(a) * 320
      c.strokeStyle = 'rgba(255,201,60,.5)'; c.lineWidth = 3; c.setLineDash([8, 8]); c.beginPath(); c.moveTo(sx, sy); c.lineTo(560, 140); c.stroke(); c.setLineDash([])
    }
    c.fillStyle = me.on ? '#f4f6fb' : '#555a70'; A.rr(c, 470, 215, 90, 44, 12); c.fill(); c.strokeStyle = '#1d2b64'; c.lineWidth = 4; c.stroke()
    c.fillStyle = '#1d2b64'; c.beginPath(); c.arc(488, 237, 13, 0, 7); c.fill(); c.fillStyle = me.on ? '#3a86ff' : '#333'; c.beginPath(); c.arc(488, 237, 6, 0, 7); c.fill()
    c.fillStyle = !me.on ? '#333' : opts.sleep && !me.flash ? '#21c48d' : '#ff3b3b'; c.beginPath(); c.arc(545, 226, 5, 0, 7); c.fill()
    if (me.on && (!opts.sleep || me.flash > 0)) { c.fillStyle = 'rgba(58,134,255,.18)'; c.beginPath(); c.moveTo(480, 250); c.lineTo(380, 430); c.lineTo(620, 430); c.closePath(); c.fill() }
    if (opts.sleep && me.on && !me.flash) { c.fillStyle = '#fff'; c.font = '700 20px "Baloo 2"'; c.textAlign = 'left'; c.fillText('z z', 570, 210) }
    if (me.flash) { c.globalAlpha = me.flash * 0.6; c.fillStyle = '#fff'; c.beginPath(); c.arc(490, 450, 90, 0, 7); c.fill(); c.globalAlpha = 1 }
    if (!me.on) A.tag(c, 515, 205, '🪫 OFF', '#ff5a5f', '#fff', 16)
    me.cars.forEach((k) => A.car(c, k.x, 455, 0, k.col, 'car', { headlights: !day }))
    const hh = Math.floor(me.h) % 24
    c.fillStyle = 'rgba(0,0,0,.45)'; A.rr(c, 16, 16, 170, 50, 14); c.fill(); c.fillStyle = '#fff'; c.font = '700 30px "Baloo 2"'; c.textAlign = 'left'
    c.fillText((hh < 10 ? '0' : '') + hh + ':00 ' + (sh > 0 ? '☀️' : '🌙'), 30, 52)
    c.font = '600 20px "Baloo 2"'
    const label = '📸 ' + me.watched + ' watched · ❌ ' + me.missed + ' missed'
    const lw = c.measureText(label).width + 26
    c.fillStyle = 'rgba(0,0,0,.45)'; A.rr(c, W - 16 - lw, 16, lw, 50, 14); c.fill(); c.fillStyle = '#fff'
    c.fillText(label, W - 3 - lw, 48)
  }
  const loop = Loop((dt) => { step(dt); draw() })
  me.start = () => loop.start()
  me.stop = () => loop.stop()
  me.reset()
  draw()
  return me
}
