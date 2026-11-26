/* Text & data for Lesson 1 · Face Scan Magic.
 * Combines the textbook (AI Literacy Unit 2 · Lesson 1 "High-speed Rail Ticket Checker"),
 * the colleague's teacher slides and the student games. */

export const GOALS = [
  { icon: '🎫', title: 'Tickets through time', text: 'How train tickets changed, from paper to your face.' },
  { icon: '🙂', title: 'How face scans work', text: 'Look, measure, match, and why AI can make mistakes.' },
  { icon: '🛡️', title: 'Use it wisely', text: 'Face scans are handy, but your face is your secret key!' },
]

export const FRIEND_CLUES = [
  { k: 'eyes', e: '👀', l: 'Their eyes' },
  { k: 'smile', e: '😁', l: 'Their smile' },
  { k: 'voice', e: '🗣️', l: 'Their voice' },
  { k: 'shoes', e: '👟', l: 'Their shoes' },
]

/* ---------- Tickets through time (textbook part 1) ---------- */
export const ERAS = [
  {
    k: 'paper',
    year: 'Long ago',
    name: 'Paper ticket',
    icon: '🎫',
    buy: 'Wait in a long queue at the ticket window.',
    check: 'A ticket checker punches a hole in your ticket.',
    note: 'No name on it. If you lose it, you can’t get on the train!',
    action: 'Punch the ticket!',
  },
  {
    k: 'magnet',
    year: '2010',
    name: 'Blue magnetic ticket',
    icon: '💳',
    buy: 'Buy online (China’s 12306 website), then collect it.',
    check: 'Slide the ticket into the gate. Beep, the gate opens!',
    note: 'Faster! Machines check the tickets now.',
    action: 'Insert the ticket!',
  },
  {
    k: 'face',
    year: '2020',
    name: 'No ticket: your face!',
    icon: '🙂',
    buy: 'Buy online with your ID card. No paper at all.',
    check: 'Put your ID card on the gate and look at the camera. The computer compares your face with your ID photo.',
    note: 'Super fast and no paper. This is face recognition!',
    action: 'Scan my face!',
  },
]

export const RAIL_FACTS = [
  { icon: '🚄', big: '2008', text: 'China’s first high-speed line opens, Beijing to Tianjin.' },
  { icon: '🛤️', big: '40,000+ km', text: 'of high-speed track. That’s about once around the whole Earth!' },
  { icon: '⚡', big: '250–350 km/h', text: 'Trains go so fast that long trips take only a few hours.' },
  { icon: '🌏', big: 'Big help', text: 'Fast trains help tourism, deliveries and cities grow.' },
]
export const RACERS = [
  { k: 'walk', e: '🚶', l: 'Walking', kmh: 5 },
  { k: 'bike', e: '🚲', l: 'Bicycle', kmh: 15 },
  { k: 'car', e: '🚗', l: 'Car', kmh: 100 },
  { k: 'train', e: '🚄', l: 'High-speed train', kmh: 300 },
]
export const RACE_KM = 120 // roughly Beijing → Tianjin

/* ---------- Look, measure, match ---------- */
export const FIRST_STEP = [
  { k: 'look', e: '👀', l: 'Look at your face', ok: true },
  { k: 'listen', e: '👂', l: 'Listen to your voice', ok: false },
  { k: 'smell', e: '👃', l: 'Smell you!', ok: false },
]

/* ---------- Face Gate ---------- */
export const GATE_SAYS = [
  'Who matches the ID card?',
  'Same face, same dots!',
  'New hair! Still the same face?',
  'Glasses on! Look closely.',
  'Last one! Hat on!',
]
export const REASONS = [
  { t: '👀 Eyes', ok: true },
  { t: '👃 Nose', ok: true },
  { t: '👄 Mouth', ok: true },
  { t: '🎩 Hair or hat', ok: false },
]

/* ---------- Teach the robot ---------- */
export const TRAIN1 = [
  { t: 'cat', c: 'orange' }, { t: 'dog', c: 'brown' }, { t: 'cat', c: 'orange' },
  { t: 'dog', c: 'white' }, { t: 'cat', c: 'orange' }, { t: 'dog', c: 'black' },
]
export const TEST1 = [{ t: 'cat', c: 'orange' }, { t: 'dog', c: 'grey' }, { t: 'cat', c: 'black' }]
export const TRAIN2 = [{ t: 'cat', c: 'black' }, { t: 'cat', c: 'white' }, { t: 'cat', c: 'grey' }]
export const TEST2 = [{ t: 'cat', c: 'black' }, { t: 'dog', c: 'orange' }, { t: 'cat', c: 'white' }]
export const WHY = [
  { t: 'Beep only saw orange cats', ok: true },
  { t: 'Beep is sleepy', ok: false },
  { t: 'Black cats aren’t cats', ok: false },
]

export const RIGHT_WAY = [
  { icon: '🙋', title: 'Ask first', text: 'Someone’s face belongs to them. Ask before you take or share their photo.' },
  { icon: '🧑‍⚖️', title: 'AI can be wrong', text: 'Face scanners make more mistakes for some people. A person must always check.' },
  { icon: '🧠', title: 'Think first', text: 'Use your own eyes and brain first. Your brain is the boss!' },
]

/* ---------- Face scans everywhere (textbook part 2) ---------- */
export const USES = [
  { k: 'station', e: '🚉', l: 'Train station', good: 'Lost your ID card? Scan your face to get a temporary pass and still catch your train.', think: 'What if the camera can’t see you well?' },
  { k: 'bank', e: '🏧', l: 'Bank machine', good: 'Some cash machines let you take out money with a face scan.', think: 'Why must a bank be extra careful?' },
  { k: 'shop', e: '☕', l: 'Shop & café', good: 'Pay for a coffee by smiling at a camera. No wallet needed!', think: 'Who keeps your face data safe?' },
  { k: 'school', e: '🏫', l: 'School & exams', good: 'Sign in for an exam with your face, so nobody can pretend to be you.', think: 'What if it makes a mistake on exam day?' },
  { k: 'police', e: '🚓', l: 'Keeping safe', good: 'In 2019, a face system helped police find a wanted person from an old photo.', think: 'Should cameras watch everyone, everywhere?' },
  { k: 'pets', e: '🐶', l: 'Lost pets', good: 'Every dog’s nose print is different, so a nose scan can help bring a lost dog home.', think: 'How is a nose print like a fingerprint?' },
  { k: 'farm', e: '🐷', l: 'Farms', good: 'Cameras check pigs’ faces every day to see if they are healthy.', think: 'Is this better than a farmer checking?' },
  { k: 'wild', e: '🐼', l: 'Wild animals', good: 'Scientists use face recognition to track and protect wild animals like pandas.', think: 'Why can’t scientists just put name tags on them?' },
]
export const DOG_NAMES = ['Lucky', 'Mochi', 'Taro', 'Kanom', 'Lemon', 'Coco', 'Bua', 'Moo']

/* ---------- Stay safe ---------- */
export const QR_CHOICES = [
  { k: 'scan', e: '📱', l: 'Scan it right away', tone: 'bad', res: 'Risky! The code might steal your photo, name or other information.' },
  { k: 'ask', e: '🙋', l: 'Ask a grown-up or station staff first', tone: 'good', res: 'Smart! Check where it comes from before you do anything.' },
  { k: 'leave', e: '🚶', l: 'Say no thanks and walk away', tone: 'good', res: 'Safe! If you’re not sure, it’s OK to say no.' },
]
export const SAFE_CARDS = [
  { q: 'A stranger says: “Send a selfie, win a toy!”', safe: false, why: 'Never send your face to strangers. Say no and tell a grown-up.' },
  { q: 'Mum unlocks her own phone with her face.', safe: true, why: 'Her phone, her face.' },
  { q: 'You ask a friend before sharing their photo. They say yes.', safe: true, why: 'Asking first is kind!' },
  { q: 'A game wants your face photo for free coins.', safe: false, why: 'Ask a grown-up first.' },
]

/* ---------- Green ---------- */
export const PLEDGES = [
  { k: 'off', e: '💡', l: 'I switch off screens.' },
  { k: 'share', e: '🤝', l: 'I share a tablet.' },
  { k: 'think', e: '🧠', l: 'I think first, then use AI.' },
  { k: 'save', e: '💾', l: 'I save, not print.' },
]

/* ---------- Remember ---------- */
export const REMEMBER = [
  { e: '🎫', t: 'Tickets went from paper, to magnetic cards, to face scans.' },
  { e: '📏', t: 'Computers learn faces by measuring them: look, measure, match.' },
  { e: '🧑‍⚖️', t: 'AI can be wrong. I think first, and a person checks.' },
  { e: '🔑', t: 'My face is my secret key. I ask first and keep it safe!' },
  { e: '🌱', t: 'I save energy: switch off and share.' },
]

/* ---------- Quiz ---------- */
export const QUIZ = [
  { q: 'How do high-speed trains check you without a paper ticket?', o: ['A ticket checker punches a hole', 'Face recognition compares you with your ID photo', 'They don’t check anyone'], a: 1, why: 'The gate matches your face with your ID card photo.', hint: 'Think about the 2020 gate!' },
  { q: 'How does a face scan know it’s you?', o: ['It measures eyes, nose and mouth', 'It reads your mind', 'It looks at your shoes'], a: 0, why: 'It makes a face code from the measurements.', hint: 'Remember the pink dots?' },
  { q: 'Beep only saw orange cats. What does Beep say about a black cat?', o: ['“Cat!”', '“Not a cat!”'], a: 1, why: 'AI needs all kinds of examples.', hint: 'What colour were Beep’s cats?' },
  { q: 'Can AI make mistakes?', o: ['No, never', 'Yes, so a person checks'], a: 1, why: 'People check AI.', hint: 'Was Beep always right?' },
  { q: 'Which one is animal face recognition?', o: ['Buying coffee with your face', 'Checking pigs’ faces to see if they are healthy', 'Scanning your face at the station'], a: 1, why: 'Farms use it to keep animals healthy.', hint: 'Which one has an animal in it?' },
  { q: 'Before you take a friend’s photo…', o: ['Ask them first', 'Just take it'], a: 0, why: 'Their face belongs to them.', hint: 'How would you feel?' },
  { q: 'A stranger offers a free gift if you scan a QR code. What do you do?', o: ['Scan it fast', 'Check with a grown-up first, or say no', 'Send them your face photo'], a: 1, why: 'If you’re not sure, don’t scan.', hint: 'Would you give a stranger your house key?' },
  { q: 'How can you save energy?', o: ['Switch off screens', 'Leave them on'], a: 0, why: 'Super green helper!', hint: 'What saves energy at home?' },
]

/* ---------- Teacher guide (📘 button in the header) ---------- */
export const GUIDE = {
  intro: 'Unit 2 · Lesson 1 · about 30 minutes (a 10-minute version is possible, see "Running late"). Works on a projector for the whole class, or on tablets in pairs.',
  goals: [
    'Know how train tickets changed: paper → magnetic → paperless face recognition.',
    'Understand how face recognition works (look, measure, match) and that AI learns from examples.',
    'See the many uses of face recognition, including for animals.',
    'Know the convenience and the risks, and use face data responsibly.',
  ],
  voting: 'On the projector, the class votes before you tap: 1, 2 or 3 fingers to pick an option, thumbs up or down for yes or no. Everyone votes, then you reveal.',
  order: [
    ['Start', '2 min', 'Warm-up: how do you know your best friend?'],
    ['Ticket Time Machine', '6 min', 'Mali’s lost ticket, tickets through time, high-speed rail'],
    ['How Face Scan Works', '6 min', 'Look-measure-match + Be the Face Gate (pairs)'],
    ['AI Learns', '5 min', 'Teach the Robot (class votes) + the right way'],
    ['Face Scans Everywhere', '4 min', 'Uses map + Animal Detective'],
    ['Stay Safe & Green', '4 min', 'QR code gift, Safe or Risky, green pledge'],
    ['Finish', '3 min', 'Remember!, quiz, certificate'],
  ],
  lenses: [
    { t: '🧠 Cognitive autonomy', items: ['Predict before every reveal (comic, look-measure-match, Teach the Robot).', 'In Face Gate the Measure helper unlocks only after the child’s first guess, then they say what helped.', 'Quiz mistakes give a hint and another try. Fixing an answer is praised.'] },
    { t: '⚖️ Ethical & responsible use', items: ['Privacy & consent: your face is your secret key; ask before taking or sharing photos.', 'Fairness: Beep only learned orange cats; face scanners can make more mistakes for some people, so a person must check.', 'No data is collected. The certificate name stays on the device.'] },
    { t: '🌱 Sustainable practices', items: ['AI data centres used about 1.5% of the world’s electricity in 2024: switch off, share devices, use AI only when it helps.', 'Work in pairs; save the certificate digitally instead of printing.'] },
  ],
  late: 'Running late? Skip the high-speed rail and the uses map, and keep Animal Detective for early finishers. For 6–7 year olds: pair them with an older buddy and use Read to me.',
  sources: [
    'AI Literacy textbook, Unit 2 · Lesson 1: High-speed Rail Ticket Checker',
    'UNICEF, Guidance on AI and children (2021, updated 2025)',
    'UNESCO, AI competency framework for students (2024)',
    'UNESCO, Recommendation on the Ethics of Artificial Intelligence (2021)',
    'NIST, Face Recognition Vendor Test Part 3: Demographic Effects (NISTIR 8280, 2019)',
    'Thailand, Personal Data Protection Act B.E. 2562 (2019)',
    'International Energy Agency, Energy and AI (2025)',
  ],
}
