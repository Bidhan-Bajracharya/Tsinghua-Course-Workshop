/* 📘 Teacher guide for Lesson 3, from the original lesson's README (design principles + how the lesson plays). */
export const GUIDE = {
  intro: 'Unit 2 · Lesson 3 · about 30 minutes. Children guess first, then try, then say what they think. Badges reward thinking, not speed, and checkpoints have no penalty for retrying.',
  goals: [
    'Find out how beauty cameras grew with AI technology.',
    'Learn how a beauty camera works.',
    'Learn to use beauty filters in a healthy way.',
  ],
  voting: 'Thinking badges instead of points: 🔮 Predictor (guessed, then checked), 🕵️ Detective (spotted changed photos), 💬 Thinker (answered two “What do you think?” questions), 🤝 Fair & Kind (respects others and all kinds of beauty). “What do you think?” questions have no wrong answer: Snappy replies with another point of view and a question to discuss with a partner.',
  order: [
    ['🚀 Start', '', 'Missions, “guess → try → think”, the camera promise'],
    ['📸 Story', '', 'Predict what a filter changes → flip the filter (live camera or cartoon) → compare · 🔮'],
    ['🖼️ Photo Editing', '', 'Flip cards → time machine (darkroom, tap away spots, one-tap filter) → Real or filtered? → think → checkpoint · 🕵️'],
    ['💄 AI Filters', '', 'Flip cards → AI mirror: face points, live makeup, “Can AI still find you?” → face-or-makeup game → think → checkpoint · 🔮'],
    ['🌕 The Moon', '', 'Flip cards → train the AI (⚡ energy), sharpen the moon, compare with a telescope photo → “Do we need AI?” → think → checkpoint'],
    ['💖 Mindset', '', 'Flip cards → Healthy or not? → Is this filter fair? → Ask first → think → checkpoint · 🤝'],
    ['🏆 Finish', '', 'Summary, badges, “My thoughts”, certificate'],
  ],
  lenses: [
    { t: '🧠 Thinking over speed', items: ['Guess → try → think: children predict before AI acts, then compare (story filter, “Can AI find you?”).', 'Open “What do you think?” questions; answers are collected on the finish page.'] },
    { t: '⚖️ Ethical & responsible use', items: ['Camera consent: children are asked (with a “check with your teacher/parent” promise) before the camera turns on, can say no, and can turn it off at any time.', 'Privacy by design: video is processed on the device only. Nothing is recorded, saved or uploaded.', '“Ask first” game: photographing, editing and sharing other people.', '“Is this filter fair?”: a typical filter lightens skin and makes different faces look alike. The everyday beauty filter in the lesson keeps skin tone on purpose.', '“AI can get it wrong”: AI loses faces that are covered or turned; AI invents a crater on the moon.'] },
    { t: '🌱 Sustainable practices', items: ['“Do we need AI?” game and an energy counter when training the AI: use AI only when needed.', 'The camera runs only while a camera activity is on screen, and the face AI is downloaded only when the camera is first used.'] },
    { t: '📷 Live camera', items: ['The live camera only works on localhost or an https:// website. Anywhere else the lesson uses cartoon faces automatically.', 'The AI mirror uses Google MediaPipe Face Landmarker (478 face points, on the device). The model (~3.6 MB) downloads the first time; without internet the activity switches to the cartoon version. For fully offline use, put face_landmarker.task in public/models/.'] },
  ],
  sources: ['Original lesson “Beauty Cameras” (Unit 2 · Lesson 3) and its README.'],
}
