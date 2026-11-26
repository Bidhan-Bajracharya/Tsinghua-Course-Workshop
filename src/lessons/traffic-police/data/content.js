/* All words of Lesson 2 (from the original "AI Traffic Police" slides, notes and learn cards). */

/* ---------- 📘 Learn cards (one per activity) ---------- */
export const LEARN = {
  hook: {
    t: 'What is Artificial Intelligence (AI)?',
    d: '<b>Artificial Intelligence (AI)</b> is a computer program that <b>learns from lots of examples</b> so it can recognise things and make decisions, a bit like how you learn to recognise letters.',
    li: [
      '<b>AI traffic police</b> = cameras + AI that watch roads and spot rule-breaking automatically.',
      'AI does not get tired, hot or sleepy. It can work day and night.',
      'But AI is a <b>helper</b>. Police officers and people are still in charge.',
    ],
  },
  c1: {
    t: 'Traffic rules and violations',
    d: 'A <b>traffic violation</b> is breaking a road rule, for example driving through a <b>red light</b>.',
    li: [
      '🔴 Red = stop · 🟡 Yellow = get ready to stop · 🟢 Green = go (carefully).',
      'In the past, police had to stand in busy traffic to catch rule-breakers. That was slow and dangerous.',
      '<b>AI cameras</b> can catch rule-breakers safely, so roads stay safer for everyone.',
    ],
  },
  alpr: {
    t: 'How does a camera read a number plate?',
    d: '<b>Number plate recognition</b> is AI that finds a car’s number plate in a photo and reads its letters and numbers.',
    li: [
      'The AI works in steps: <b>find the car → find the plate → read each letter</b>.',
      'Reading letters from a picture is called <b>OCR</b> (Optical Character Recognition).',
      'Photos and video are saved as <b>evidence</b>: proof of what happened, so tickets are fair.',
    ],
  },
  lane: {
    t: 'AI helpers: drones and robots',
    d: 'A <b>drone</b> is a small flying machine with a camera. A <b>patrol robot</b> drives along the road checking for problems.',
    li: [
      'The <b>emergency lane</b> is a special lane that must stay empty for ambulances and fire engines.',
      'Drones can see an accident from the sky in seconds.',
      'Robots can work all day and photograph cars that block the emergency lane.',
    ],
  },
  duel: {
    t: 'The traffic brain',
    d: 'A <b>traffic brain</b> is an AI system that collects <b>data</b> from many cameras and sensors, then decides how long each traffic light stays green.',
    li: [
      '<b>Data</b> = information, like how many cars are waiting.',
      'An old timer light changes every few seconds, even when no cars are there.',
      'A smart light gives more green time to the busy road, so cars wait less.',
    ],
  },
  wrong: {
    t: 'AI can make mistakes',
    d: 'AI only <b>guesses</b> from what it has learned. Its <b>confidence</b> is how sure it is about a guess.',
    li: [
      'Mud, shadows or bad light can trick an AI.',
      'When the AI is not sure, a <b>person checks</b>. This is called a <b>human in the loop</b>.',
      'Always <b>think for yourself</b>: ask “How do we know this is true?”',
    ],
  },
  privacy: {
    t: 'Privacy and fairness',
    d: '<b>Privacy</b> means having the right to keep some things about yourself private. <b>Fairness</b> means treating everyone the same way.',
    li: [
      'Traffic cameras should watch <b>roads</b>, not people’s homes or private places.',
      'Videos are <b>data</b>. Keep only what is needed, and delete the rest.',
      'Responsible AI follows the same fair rules for everyone.',
    ],
  },
  solar: {
    t: 'Sustainability and green energy',
    d: '<b>Sustainability</b> means meeting our needs today without harming the planet for the future.',
    li: [
      'AI cameras and computers need <b>electricity</b>.',
      '<b>Renewable energy</b>, like <b>solar power</b> from the sun, does not run out and makes no smoke.',
      'Saving energy: switch off (sleep) when not needed, delete data we don’t need, repair instead of throwing away.',
    ],
  },
}

/* ---------- 💡 Teacher notes (from the original slide notes) ---------- */
export const NOTES = {
  title: 'Before you start, tap 🏁 Teams (top right) to split the class into 2–4 teams. At each checkpoint, teams hold up A/B/C/D cards. Tap each team’s answer on screen, then Reveal, and points are added automatically. No teams? Just let the class vote and tap an answer.',
  hook: 'Ask: “Could a police officer stand at the crossroads for 24 hours without a break?” Take a few answers. Drag the time slider or press Play a day: the officer gets tired and goes home to sleep, while the camera keeps working. Big cities have more cars and people, so watching every road by hand is very hard. That is why we have AI traffic police. Stress that police officers are still very important! AI is their helper.',
  c1: 'Run at 5% first. Ask the class what they notice: most people obey and traffic flows. Drag the slider to 30–50%. Runners get a red ring, crashes start, and the danger level rises. Tap Turn on AI cameras: every runner is photographed (flash + plate). Drivers know cameras are watching, so fewer people break the rules. Ask: “Why is a camera safer than an officer standing in the middle of the road?”',
  alpr: 'Press Play: a car crosses the stop line on red and the camera takes a photo. Tap Next step one at a time. Before each step ask: “What should the AI do next?” At step 4 (read the letters) the class can read the plate aloud together. This is called Automatic Number Plate Recognition. It records red-light running, speeding and illegal parking.',
  check: 'Teams answer with cards → tap answers → Reveal. Then ask a few children to explain why.',
  lane: 'Tap the four buttons in order. Before each one ask: “Who should we send now?” Drone: sees the accident quickly from the sky and sends live video to the control centre. Patrol robot: photographs cars blocking the emergency lane. Ask: why must the emergency lane stay empty? (Ambulances and fire engines need it to save people.)',
  duel: 'Both crossroads get the same traffic: lots of cars east–west, few north–south. Left: 6 seconds each way, whether cars are there or not, so a long queue builds up. Right: the AI sees where the cars are and gives that road a longer green. After about 30 seconds compare the average wait. Press Change the busy road and watch the AI adapt.',
  wrong: 'For each card, ask the class first: “Do you agree with the AI? What makes you think so?” Only then press Agree / Disagree. Point at the “how sure” bar: when the AI is not very sure, a person must check. Big idea: AI is a helpful tool, but it can make mistakes. We keep thinking for ourselves, and people make the final decision.',
  privacy: 'Teams discuss each card before you tap. Ask: “Who could be hurt or upset by this?” Key ideas: privacy (some places are private), fairness (don’t watch people who did nothing wrong), data (keep only what is needed, delete the rest), kindness (data is for safety, not for laughing at people). There can be good disagreement, so let children explain their reasons.',
  solar: 'First play with everything OFF: the battery runs out at night and cars are not watched. Ask: “What could we change?” Let the class choose: aim the panel at the sun, sleep mode, delete old videos. Play again. Big idea: AI uses energy; we can make it greener with renewable energy and by not wasting power or data.',
  mission: 'Teams answer with A/B/C/D cards → tap each team’s answer → Reveal. Missions are worth 20 points.',
  podium: 'Announce the winners and give them a round of applause! Type your class name on the certificate and download it for the classroom wall. “New class” resets the team scores.',
}

/* ---------- Chapter 2: number plate steps ---------- */
export const ALPR_STEPS = [
  'Watch the road',
  'Find the car',
  'Find the number plate',
  'Read the letters',
  'Check the rule',
  'Save the evidence',
  'Send the ticket',
]
export const ALPR_DESC = [
  'The light is <b style="color:#ef476f">RED</b>. The camera watches every car, day and night.',
  'AI scans the picture and draws a box around anything that looks like a car.',
  'Inside the car box, AI looks for a small rectangle with letters: the number plate.',
  'AI cuts the plate into single letters and recognises each one, like reading flash cards.',
  'The car crossed the white stop line while the light was red → <b>ran a red light</b>.',
  'Three photos and a video are saved with the time and place. This is the proof.',
  'A ticket is sent automatically. The driver can watch the video and appeal if it is wrong.',
]

/* ---------- Checkpoints (class vote questions) ---------- */
export const QUICK_CHECK = {
  id: 'check',
  pts: 10,
  q: 'Why does the system save a video of the rule-breaking?',
  o: [
    { k: 'A', l: 'To make the traffic lights brighter' },
    { k: 'B', l: 'To hide what really happened' },
    { k: 'C', l: 'As proof, so the punishment is fair' },
    { k: 'D', l: 'To make a movie' },
  ],
  a: 'C',
  why: 'The video is proof. People can check it and appeal, so tickets are fair.',
}
export const MISSIONS = [
  {
    id: 'm1',
    pts: 20,
    scene: 'lane',
    story: '🚑 An ambulance is stuck: a car is parked in the emergency lane!',
    q: 'Who do we send?',
    o: [
      { k: 'A', l: 'Sound locator' },
      { k: 'B', l: 'Turn every light red' },
      { k: 'C', l: 'Patrol robot' },
      { k: 'D', l: 'A map app' },
    ],
    a: 'C',
    why: 'The patrol robot drives along the roadside and photographs cars blocking the emergency lane.',
  },
  {
    id: 'm2',
    pts: 20,
    scene: 'rush',
    story: '⏰ Morning rush hour! One road has a huge queue, the other is nearly empty, but both get the same green time.',
    q: 'Who do we send?',
    o: [
      { k: 'A', l: 'Drone' },
      { k: 'B', l: 'Patrol robot' },
      { k: 'C', l: 'Sound locator' },
      { k: 'D', l: 'Traffic brain' },
    ],
    a: 'D',
    why: 'The traffic brain gives the busy road a longer green light.',
  },
  {
    id: 'm3',
    pts: 20,
    scene: 'muddy',
    story: '🤖 The AI read a muddy plate as “KL·52B0”. It is only 61% sure. The owner of KL·52B0 has never been to this road.',
    q: 'What should we do?',
    o: [
      { k: 'A', l: 'Send the ticket: the AI is always right' },
      { k: 'B', l: 'A person checks the photo before anything happens' },
      { k: 'C', l: 'Post the photo online' },
      { k: 'D', l: 'Ticket every car that looks similar' },
    ],
    a: 'B',
    why: 'AI can be wrong. We think for ourselves, check the evidence, and people make the final decision.',
  },
]
export const CHECKPOINTS = [QUICK_CHECK, ...MISSIONS]

/* ---------- Using AI wisely: can the AI be wrong? ---------- */
export const CASES = [
  {
    title: 'Muddy number plate',
    ai: 'Plate reads “KL·52B0”',
    conf: 61,
    right: false,
    pic: 'muddy',
    truth: 'Wrong! Mud covers the “8”, so the AI guessed “B”. A person must check before any ticket is sent.',
  },
  {
    title: 'Tree shadow',
    ai: 'Car parked in emergency lane',
    conf: 52,
    right: false,
    pic: 'shadow',
    truth: 'Wrong! It is only the shadow of a tree. The AI saw a dark shape and guessed. Humans can spot this easily.',
  },
]

/* ---------- Using AI wisely: where should cameras go? ---------- */
export const PLACES = [
  { e: '🚦', t: 'At a busy crossroads', ok: true, why: 'Helps keep people crossing the road safe.' },
  { e: '🛣️', t: 'Over the highway emergency lane', ok: true, why: 'Keeps the lane clear for ambulances.' },
  { e: '🏫', t: 'At the crossing outside school', ok: true, why: 'Protects children on their way to school.' },
  { e: '🏠', t: 'Looking into people’s home windows', ok: false, why: 'Homes are private. Traffic cameras watch roads only.' },
  { e: '🚻', t: 'Inside toilets or changing rooms', ok: false, why: 'Never! Some places must always stay private.' },
  { e: '👣', t: 'Following one person all day who did nothing wrong', ok: false, why: 'Not fair. People who follow the rules should be left alone.' },
  { e: '🗄️', t: 'Keeping every video forever', ok: false, why: 'Delete what is not needed. Less data is safer, and it saves energy.' },
  { e: '📱', t: 'Posting a rule-breaker’s photo online to laugh at them', ok: false, why: 'Data is for safety, not for making fun of people. Be kind.' },
]

/* ---------- Chapter badges (shown at graduation) ---------- */
export const BADGES = [
  { n: 1, c1: '#ff5a5f', c2: '#ffb703', icon: 'light', name: 'Traffic Light Expert' },
  { n: 2, c1: '#3a86ff', c2: '#00b4d8', icon: 'cam', name: 'AI Camera Detective' },
  { n: 3, c1: '#8338ec', c2: '#ff6fb5', icon: 'drone', name: 'Helper Team Captain' },
  { n: 4, c1: '#21c48d', c2: '#00b4d8', icon: 'brain', name: 'Traffic Brain Planner' },
  { n: 5, c1: '#fb8500', c2: '#ff5a5f', icon: 'heart', name: 'Safety Hero' },
  { n: 6, c1: '#21c48d', c2: '#8338ec', icon: 'leaf', name: 'Responsible AI Champion' },
]

/* ---------- 📘 Teacher guide ---------- */
export const GUIDE = {
  intro: 'Unit 2 · Lesson 2 · about 10 minutes, 14 activities. Made for the projector, with the class playing in teams. It also works for one child on a tablet: just tap the answers.',
  goals: [
    'Understand why cities use AI cameras: one officer can’t watch every road all day and night.',
    'See how a camera reads a number plate step by step (find the car → find the plate → read the letters), and why evidence keeps tickets fair.',
    'Meet AI helpers (drone, patrol robot) and the traffic brain that changes the lights.',
    'Use AI wisely: AI can be wrong, people decide, protect privacy, be fair, and save energy.',
  ],
  voting: 'Tap 🏁 Teams to set up 2–4 teams (rename them, reset scores). At each checkpoint, teams hold up A/B/C/D cards. Tap each team’s letter on screen, then Reveal: teams that got it right get points automatically (10 for the quick check, 20 for each mission). You can also add or take away points with + and − on the team bar.',
  order: [
    ['Start', '1 min', 'Title + can one officer watch the road all day?'],
    ['1 · Traffic Lights', '1 min', 'Red-light experiment, then switch on AI cameras'],
    ['2 · AI Camera', '2 min', 'How a camera reads a number plate + quick check'],
    ['3 · Helpers', '1 min', 'Rescue mission: drone + patrol robot'],
    ['4 · Traffic Brain', '1 min', 'Old timer vs AI traffic brain (+ CO₂ from waiting cars)'],
    ['5 · Using AI Wisely', '2 min', 'Is the AI right? · Where should cameras go? · Solar AI camera'],
    ['Final Mission', '2 min', '3 missions, podium and certificate'],
  ],
  lenses: [
    { t: '⌨️ Projector controls', items: ['Read to me reads the activity aloud; answers are read out when you Reveal.', 'Each activity has a 📘 Learn card with the key words. Tap “Got it” to hide it and 📘 Learn to show it again.', 'Use 🔈 Sound to switch the sound effects on or off.'] },
    { t: '⚖️ Ethical & responsible use', items: ['AI is a helper. Police officers and people are still in charge.', 'Mud and shadows can trick an AI, so a person checks when it is not sure (human in the loop).', 'Privacy and fairness: cameras watch roads, not homes; keep only the data you need.'] },
    { t: '🌱 Sustainable practices', items: ['Waiting cars make smoke: the traffic brain cuts waiting and CO₂.', 'Solar power, sleep mode and deleting old videos keep the AI camera green.'] },
  ],
  late: 'Short on time? Skip the quick check and the solar camera, and play the three final missions as a whole-class quiz.',
  sources: ['Original lesson “The AI Traffic Police” (Unit 2 · Lesson 2): slides, teacher notes and learn cards.'],
}
