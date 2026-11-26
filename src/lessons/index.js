/**
 * Lesson registry for the platform.
 * Native lessons: meta.js + a root component built on shared/LessonShell.
 * Legacy lessons: colleagues' originals shown unchanged in a frame (see ./legacy.js).
 */
import { lessonMeta as faceScan } from './face-scan/meta'
import { lessonMeta as trafficPolice } from './traffic-police/meta'
import { lessonMeta as beautyCameras } from './beauty-cameras/meta'
import { lessonMeta as robotVacuum } from './robot-vacuum/meta'
import { lessonMeta as selfDriving } from './self-driving/meta'
import { legacyLessons } from './legacy'

export const lessons = [
  ...legacyLessons,
  { ...faceScan, scored: true, load: () => import('./face-scan/FaceScanLesson.vue') },
  { ...trafficPolice, scored: true, load: () => import('./traffic-police/TrafficPoliceLesson.vue') },
  { ...beautyCameras, scored: true, load: () => import('./beauty-cameras/BeautyCamerasLesson.vue') },
  { ...robotVacuum, scored: true, load: () => import('./robot-vacuum/RobotVacuumLesson.vue') },
  { ...selfDriving, scored: true, load: () => import('./self-driving/SelfDrivingLesson.vue') },
].sort((a, b) => a.unit - b.unit || a.lesson - b.lesson)

export const findLesson = (slug) => lessons.find((l) => l.slug === slug)
