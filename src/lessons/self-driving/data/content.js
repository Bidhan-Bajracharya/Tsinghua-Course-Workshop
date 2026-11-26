/* All text & data for the Autonomous Driving lesson (adapted from the colleague's original). */

/* ---------- Learn cards ---------- */
export const LEARN = {
  past: {
    line: 'Before AI, how did cars move? Flip through the cards.',
    cards: [
      { art: [{ year: '1886' }, { symbol: 'car1886' }], title: 'The first car', text: 'Karl Benz builds it. A person drives.' },
      { art: [{ year: '1908' }, '🚗', '🚗', '🚗'], title: 'Cars for everyone', text: 'The Model T is cheap. Roads get busy!' },
      { art: ['💭', { lumi: true }], title: 'A big dream', text: 'People wonder: could a car drive itself?' },
    ],
    tip: 'Keep it quick: about one minute. Ask: "What problems did busy roads cause?"',
  },
  tech: {
    line: 'How do I drive myself? Let’s find out!',
    cards: [
      { art: [{ icon: 'i-cam' }, { icon: 'i-radar' }, { icon: 'i-lidar' }], title: '1 · SENSE', text: 'Sensors are my eyes and ears.' },
      { art: ['🧠'], title: '2 · THINK', text: 'My AI brain decides: stop, slow or go.' },
      { art: [{ icon: 'i-map' }], title: '+ HD MAP', text: 'My super-detailed map knows every lane.' },
      { art: ['↪️', '🛑', '⏩'], title: '3 · ACT', text: 'Then I steer, brake or speed up.' },
    ],
  },
  ai: {
    line: 'Is my AI brain always right? Let’s see.',
    cards: [
      { art: ['🛑', '🚶', '🚲', '🐈'], title: 'AI learns from examples', text: 'It studied millions of road pictures.' },
      { art: ['🦖', '❓'], title: 'New things can confuse it', text: 'A kid in a dinosaur costume? Hmm…' },
      { art: ['🤔', '👀'], title: 'So keep thinking!', text: 'AI can be wrong. People still check it.' },
    ],
    tip: 'Key message for cognitive autonomy: AI is a tool that can make mistakes. We think for ourselves and check its answers.',
  },
  risk: {
    line: 'Even smart cars have risks. There are two kinds:',
    cards: [
      { art: ['🌫️', '📷'], title: 'Tech risk', text: 'Bad weather or AI mistakes can fool the car.' },
      { art: ['⚖️', '🧾'], title: 'Law risk', text: 'No driver? Then who is responsible?' },
    ],
  },
  resp: {
    line: 'How do we use AI cars the right way?',
    cards: [
      { art: ['🧑‍✈️', '👀'], title: 'People stay in charge', text: 'Humans watch, check and can take over.' },
      { art: ['📷', '🙈'], title: 'Protect privacy', text: 'My cameras see people. Keep faces and data safe.' },
      { art: ['👧', '🧑‍🦽', '👵'], title: 'Fair for everyone', text: 'I must notice every kind of person.' },
    ],
    tip: 'These three ideas (human oversight, privacy, fairness) are the heart of responsible AI use. Ask for one real example of each.',
  },
  green: {
    line: 'Can self-driving cars help our planet?',
    cards: [
      { art: ['〰️', '🔋'], title: 'Smooth driving', text: 'No sudden braking means less energy wasted.' },
      { art: ['🚗', '🚗', '🚗', { arrow: true }, '🚐'], title: 'Share the ride', text: 'One shared robotaxi can replace many cars.' },
      { art: ['🔌', '💻'], title: 'AI needs energy too', text: 'Computers and sensors use electricity.' },
    ],
    tip: 'Balance the message: self-driving can save energy when shared, but AI computers, batteries and building cars also use resources. Walking and buses are still very green.',
  },
}

/* ---------- Polls ---------- */
export const FACES = [
  { k: 'yes', e: '😀', l: 'Yes!' },
  { k: 'maybe', e: '🤔', l: 'Not sure' },
  { k: 'no', e: '😨', l: 'No way!' },
]

/* ---------- Predict: who is in control? ---------- */
export const WHO = [
  { k: 'person', e: '🧑', l: 'A person' },
  { k: 'road', e: '🛣️', l: 'The road' },
  { k: 'ai', e: '🧠', l: 'AI' },
]
export const ERAS = [
  { y: '1925', a: 'person', c: 'A person in another car steers it by RADIO.' },
  { y: '1960', a: 'road', c: 'A magnetic CABLE in the road guides it.' },
  { y: 'Today', a: 'ai', c: 'Sensors + AI. The car decides by ITSELF!' },
]

/* ---------- Toll-gate checkpoints ---------- */
export const GATES = {
  g1: [
    { q: 'Early self-driving cars were guided by…', o: ['Phone maps', 'Cables in the road', 'Nothing'], a: 1, h: 'Remember 1960!' },
    { q: 'The 1925 car was controlled by…', o: ['Radio', 'AI', 'A horse'], a: 0, h: 'You were the radio!' },
    { q: 'Who built the first car in 1886?', o: ['A robot', 'Lumi', 'Karl Benz'], a: 2, h: 'Robots and Lumi came much later.' },
  ],
  g2: [
    { q: 'Lumi’s brain is the…', o: ['AI algorithm', 'Tyres', 'Paint'], a: 0, h: 'Which part decides Stop or Go?' },
    { q: 'Lumi’s eyes and ears are the…', o: ['Seat belts', 'Horn', 'Sensors'], a: 2, h: 'Camera, radar, lidar…' },
    { q: 'If the AI is NOT sure, it should…', o: ['Speed up', 'Slow down and check', 'Guess'], a: 1, h: 'Remember the poster scene.' },
  ],
  g3: [
    { q: 'Fog hides the camera’s view. That is a…', o: ['Law risk', 'Tech risk', 'No risk'], a: 1, h: 'It’s a problem with the machine.' },
    { q: '“Who pays the fine?” is a…', o: ['Law risk', 'Tech risk', 'Weather'], a: 0, h: 'It’s about rules and blame.' },
    { q: 'Using AI responsibly means…', o: ['Trust it 100%', 'Share people’s videos', 'People stay in charge'], a: 2, h: 'Who should watch and check?' },
  ],
  g4: [
    { q: 'Robotaxis help the planet most when we…', o: ['Share rides', 'Ride alone', 'Drive faster'], a: 0, h: 'Fewer cars on the road…' },
    { q: 'Greenest way for a short trip?', o: ['Family car', 'Walk or bike', 'Robotaxi'], a: 1, h: 'Which one uses no fuel or electricity?' },
    { q: 'AI computers and sensors…', o: ['Use no energy', 'Make fuel', 'Use energy too'], a: 2, h: 'Do computers need to be plugged in?' },
  ],
}
export const CONF = [
  { k: 3, e: '😎', l: 'Very sure' },
  { k: 2, e: '🙂', l: 'A bit sure' },
  { k: 1, e: '😟', l: 'Not sure' },
]

/* ---------- Sensors ---------- */
export const SENSORS = [
  { k: 'cam', i: 'i-cam', n: 'Camera', c: 'Camera: I see colours, lights and signs!' },
  { k: 'radar', i: 'i-radar', n: 'Radar', c: 'Radar: how far and how fast. Even in rain!' },
  { k: 'lidar', i: 'i-lidar', n: 'Lidar', c: 'Lidar: lasers make a 3D dot picture!' },
  { k: 'map', i: 'i-map', n: 'HD map', c: 'HD map: I know exactly where I am!' },
]

/* ---------- Be the AI brain ---------- */
export const BRAIN = [
  { kind: 'red', r: [['i-cam', 'Red light'], ['i-lidar', 'Person at crossing']], a: 'stop', w: 'Red light + person = STOP.' },
  { kind: 'green', r: [['i-cam', 'Green light'], ['i-lidar', 'Road is clear'], ['i-map', 'Go straight']], a: 'go', w: 'Green and clear = GO.' },
  { kind: 'ball', r: [['i-cam', 'Ball on the road'], ['i-radar', '15 m ahead']], a: 'stop', w: 'A child may run after the ball!' },
  { kind: 'poster', r: [['i-cam', 'Person? Only 55% sure'], ['i-lidar', 'Flat shape, not moving']], a: 'slow', w: 'Not sure? Slow down and check. (It was a poster!)' },
  { kind: 'school', r: [['i-cam', 'Children sign'], ['i-map', 'School zone']], a: 'slow', w: 'School zone = SLOW down.' },
  { kind: 'fog', r: [['i-cam', 'Can’t see far'], ['i-radar', 'Car 30 m ahead']], a: 'slow', w: 'Radar sees through fog. Go SLOW.' },
]
export const ACTS = { stop: 'STOP', slow: 'SLOW', go: 'GO' }

/* ---------- Guess the number ---------- */
export const GUESS = [
  { q: '1980s: how fast did a German robot car drive?', min: 0, max: 150, unit: 'km/h', ans: 95.9, start: 40 },
  { q: 'Navlab drove 5,000 km. How much of it did it drive by itself?', min: 0, max: 100, unit: '%', ans: 98.2, start: 50 },
]

/* ---------- Weather lab ---------- */
export const WEATHER = [
  { k: 'sun', i: 'i-sun', l: 'Sunny', v: [95, 92, 95], ov: [0, 0, 0, 0], m: 'Sunny: everyone sees well!' },
  { k: 'rain', i: 'i-rain', l: 'Rain', v: [55, 88, 60], ov: [1, 0.25, 0, 0], m: 'Rain blurs the camera. Radar is fine.' },
  { k: 'fog', i: 'i-fog', l: 'Fog', v: [15, 82, 30], ov: [0, 0.88, 0, 0], m: 'Fog! Camera is almost blind. Radar saves the day.' },
  { k: 'night', i: 'i-moon', l: 'Night', v: [35, 92, 92], ov: [0, 0, 0.84, 0.55], m: 'Dark! Camera struggles. Lidar and radar make their own signals.' },
]

/* ---------- Ticket vote ---------- */
export const VOTE = [
  { e: '🙋', l: 'The owner' },
  { e: '🏭', l: 'The company' },
  { e: '👩‍💻', l: 'Programmers' },
  { e: '🤷', l: 'Nobody' },
]

/* ---------- Responsible or not? ---------- */
export const JUDGE = [
  { e: '🎮', t: 'The driver plays games while a “helper” car drives.', a: 'down', w: 'Helper cars still need a human watching!' },
  { e: '🙈', t: 'The company blurs people’s faces in camera videos.', a: 'up', w: 'That protects privacy.' },
  { e: '☀️', t: 'The car is only tested on sunny days.', a: 'down', w: 'It must be tested in rain, fog and at night too.' },
  { e: '🧑‍🦽', t: 'The car is tested with kids, older people and wheelchair users.', a: 'up', w: 'Fair and safe for everyone.' },
  { e: '📲', t: 'Someone posts car videos of strangers online for fun.', a: 'down', w: 'Never share people’s data without asking.' },
  { e: '🙋', t: 'When it is unsure, the car slows down and asks a human for help.', a: 'up', w: 'Knowing when to ask is responsible.' },
]

/* ---------- Green trip planner ---------- */
export const MODES = [
  { k: 'walk', e: '🚶', l: 'Walk', max: 1, en: 0, cars: 0 },
  { k: 'bike', e: '🚲', l: 'Bike', max: 4, en: 0, cars: 0 },
  { k: 'bus', e: '🚌', l: 'Bus', max: 99, en: 1, cars: 0 },
  { k: 'robo', e: '🚐', l: 'Shared robotaxi', max: 99, en: 2, cars: 1 },
  { k: 'car', e: '🚗', l: '4 family cars', max: 99, en: 8, cars: 4 },
]
export const GROUPS = [
  { k: 'a', e: '🏠', d: 0.5, l: '4 kids · 0.5 km' },
  { k: 'b', e: '🏡', d: 3, l: '4 kids · 3 km' },
  { k: 'c', e: '🏘️', d: 8, l: '4 kids · 8 km' },
]

/* ---------- Rule book ---------- */
export const RULES = [
  { k: 'stop', e: '🛑', l: 'Always stop for people' },
  { k: 'human', e: '🧑‍✈️', l: 'Let a human take over' },
  { k: 'privacy', e: '🙈', l: 'Keep people’s data private' },
  { k: 'fair', e: '🤝', l: 'Be fair to everyone' },
  { k: 'unsure', e: '🐢', l: 'When unsure, slow down' },
  { k: 'school', e: '🏫', l: 'Drive slowly near schools' },
  { k: 'share', e: '🌱', l: 'Share rides to save energy' },
  { k: 'test', e: '🌧️', l: 'Test in every kind of weather' },
]
