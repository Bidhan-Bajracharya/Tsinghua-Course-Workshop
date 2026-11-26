// Maps `activity.type` in src/data/course.js to the mini-game component that renders it.
// Every activity receives `activity` (its data) and emits `complete` when a child finishes it.
import AiMirror from './AiMirror.vue'
import FairFilter from './FairFilter.vue'
import MoonTrainer from './MoonTrainer.vue'
import RealOrFiltered from './RealOrFiltered.vue'
import SortGame from './SortGame.vue'
import TimeMachine from './TimeMachine.vue'

export const activityComponents = {
  timeMachine: TimeMachine,
  realOrFiltered: RealOrFiltered,
  aiMirror: AiMirror,
  sortGame: SortGame,
  moonTrainer: MoonTrainer,
  fairFilter: FairFilter,
}
