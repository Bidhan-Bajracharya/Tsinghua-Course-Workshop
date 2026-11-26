# AI Around Us: Unit 2 lessons

An interactive lesson platform for primary school students, built with Vue 3 + Vite. The lessons are English only.

## Run it

```bash
npm install
npm run dev      # local dev server (printed in the terminal)
npm run build    # production build in dist/
```

## Live site

https://bidhan-bajracharya.github.io/Tsinghua-Course-Workshop/

Every push to `main` rebuilds and publishes the site with GitHub Actions (`.github/workflows/deploy.yml`, GitHub Pages).

## Routes (hash-based, no router dependency)

| URL | Page | Type |
|-----|------|------|
| `#/` | Landing page: all lessons, with progress and stars | |
| `#/lesson/face-scan` | Lesson 1: Face Scan Magic (textbook + teacher slides + games, with Teacher guide) | native |
| `#/lesson/traffic-police` | Lesson 2: The AI Traffic Police (original lesson plan, restyled; optional class teams) | native |
| `#/lesson/beauty-cameras` | Lesson 3: Beauty Cameras (original lesson, restyled, English only; live AI mirror) | native |
| `#/lesson/robot-vacuums` | Lesson 4: Robot Vacuums | native |
| `#/lesson/self-driving` | Lesson 5: Autonomous Driving | native |

## Framed (legacy) lessons

All lessons are native now. For a quick merge of a new colleague lesson before it is rebuilt, `src/platform/LegacyLesson.vue` can still show an original unchanged inside the platform frame: add an entry to `src/lessons/legacy.js` and put its files in `public/legacy/<folder>/`.

## Live camera (Lesson 3)

The AI mirror uses Google MediaPipe Face Landmarker (`@mediapipe/tasks-vision`) on the device. The camera only works on `localhost` or `https://`; elsewhere the lesson uses cartoon faces. The face model (~3.6 MB) downloads the first time; for fully offline use, put `face_landmarker.task` in `public/models/`.

## Project layout

```
src/
  App.vue                 # tiny hash router + saves lesson results
  platform/HomePage.vue   # landing page
  shared/                 # the platform's design system (use these for every lesson)
    theme.css             # colours, fonts, buttons, cards… (all under .ai-lesson)
    LessonShell.vue       # header, step bar, sub-steps, read-aloud, back/next
    Certificate.vue       # name prompt + certificate + PNG download
    TeacherTip.vue        # collapsible "💡 Teacher tip"
    TeacherGuide.vue      # "📘 Teacher guide" pop-up (pass :guide to LessonShell)
    useSpeech.js          # browser text-to-speech
    progress.js           # best result per lesson (this browser only)
    mascots/              # Lumi the car (SVG + canvas)
  lessons/
    index.js              # lesson registry
    face-scan/            # Lesson 1
    traffic-police/       # Lesson 2 (canvas sims in engine/, class teams in state.js)
    beauty-cameras/       # Lesson 3 (original components; bc.css maps their styles onto the theme)
    robot-vacuum/         # Lesson 4
    self-driving/         # Lesson 5
```

## Adding a lesson

1. Create `src/lessons/<name>/meta.js` with `id, slug, unit, lesson, title, subtitle, icon, color, blurb, minutes, art`.
2. Build the lesson's root component on `<LessonShell :meta :scenes>`. A scene is either one `component`, or a list of `steps`, each with a kind: `learn`, `play`, `think` or `gate`.
3. Have the final screen emit `complete` with `{ score, total }`.
4. Add the lesson to `src/lessons/index.js`.

Use the classes from `shared/theme.css` (`ai-card`, `ai-btn`, `ai-btn--primary`, `ai-tag`, `ai-meter`…) so every lesson matches the platform style.

## Lessons

**Lesson 3: Beauty Cameras.** The colleague's Vue lesson, kept as it was (English text only) and shown in the platform design with Snappy the camera as the guide. Each level runs Learn → Play → Think → Checkpoint as steps. It covers the story filter, time machine, Detective, the AI mirror (live camera with consent, or cartoon), face or makeup, moon trainer, "Do we need AI?", Healthy or not?, Is this filter fair?, Ask first, and a finish page with thinking badges, "My thoughts" and a certificate. The certificate stars are the 4 thinking badges.

**Lesson 2: The AI Traffic Police.** The colleague's 14-slide lesson, kept as it was and rebuilt in the platform design with Blinky the traffic light as the guide. It covers the officer vs camera day, the red-light experiment, number-plate reading in 7 steps, a quick check, the rescue mission, the old timer vs AI traffic brain race, "check the AI", where cameras should go, the solar camera, 3 final missions, and a podium plus certificate. The canvas sims are ported from the original (`engine/`). Every activity has a 📘 Learn card and a teacher tip. 🏁 Teams turns on 2–4 class teams with A/B/C/D answers, Reveal and automatic points.

**Lesson 4: Robot Vacuums.** The steps are Meet Robo, Time Machine, Cleaning Race, Laser Eyes, Camera Eyes, Inventor, Big Ideas, Quiz, and a certificate.

**Lesson 5: Autonomous Driving.** A road trip with Lumi, ported from a colleague's single-file lesson and restyled. It has five zones (Past Town, Tech City, Risk Ridge, Green Garage, Finish), and each zone runs Learn → Play → Think → Checkpoint. The checkpoints are toll-gate lane quizzes with a confidence check, worth up to 12 stars. The lesson ends with a rule book and the "Road Ready" certificate.
