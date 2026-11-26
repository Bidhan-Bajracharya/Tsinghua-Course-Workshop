<script setup>
// 🕵️ Detective game: which picture was changed? Then: how could you tell?
// Each round: tap the changed picture, then tick the clues that gave it away.
import { computed, ref } from 'vue'
import LessonPicture from '../illustrations/LessonPicture.vue'
import { useLocale } from '../../i18n/useLocale.js'
import { ui } from '../../i18n/ui.js'

const props = defineProps({
  activity: { type: Object, required: true },
})

const emit = defineEmits(['complete'])
const { t } = useLocale()

const rounds = props.activity.rounds
const roundIndex = ref(0)
const found = ref(false)
const wrongSide = ref(null)
const pickedClues = ref([])

const round = computed(() => rounds[roundIndex.value])
const finished = computed(() => roundIndex.value >= rounds.length)
const pictures = computed(() => [
  { side: 'left', picture: round.value.left },
  { side: 'right', picture: round.value.right },
])

function pick(side) {
  if (found.value) return
  if (side === round.value.changedSide) {
    found.value = true
    wrongSide.value = null
  } else {
    wrongSide.value = side
  }
}

function toggleClue(index) {
  pickedClues.value = pickedClues.value.includes(index)
    ? pickedClues.value.filter((item) => item !== index)
    : [...pickedClues.value, index]
}

function nextRound() {
  roundIndex.value += 1
  found.value = false
  wrongSide.value = null
  pickedClues.value = []
  if (finished.value) emit('complete')
}

function restart() {
  roundIndex.value = 0
}
</script>

<template>
  <div class="detective">
    <h3 class="activity-title">🕵️ {{ t(activity.title) }}</h3>
    <p class="activity-hint">{{ t(activity.instruction) }}</p>

    <div v-if="!finished" :key="roundIndex" class="round pop-in">
      <p class="round-count">{{ t(ui.sortProgress, { n: roundIndex + 1, total: rounds.length }) }}</p>
      <p class="round-question">{{ t(round.question) }}</p>

      <div class="pictures">
        <button
          v-for="item in pictures"
          :key="item.side"
          type="button"
          class="picture"
          :class="{
            correct: found && item.side === round.changedSide,
            shake: wrongSide === item.side,
          }"
          :aria-label="t(item.side === 'left' ? ui.leftPicture : ui.rightPicture)"
          @click="pick(item.side)"
        >
          <LessonPicture :picture="item.picture" />
          <span v-if="found && item.side === round.changedSide" class="stamp">🔍 {{ t(ui.changed) }}</span>
        </button>
      </div>
      <p v-if="wrongSide" class="feedback" role="status">🤔 {{ t(ui.lookAgain) }}</p>

      <div v-if="found" class="clues pop-in">
        <p class="clue-question">✅ {{ t(ui.howCanYouTell) }}</p>
        <div class="clue-list">
          <button
            v-for="(clue, index) in round.clues"
            :key="index"
            type="button"
            class="clue"
            :class="{ right: pickedClues.includes(index) && clue.correct, wrong: pickedClues.includes(index) && !clue.correct }"
            :aria-pressed="pickedClues.includes(index)"
            @click="toggleClue(index)"
          >
            <span v-if="pickedClues.includes(index)" aria-hidden="true">{{ clue.correct ? '✅' : '❌' }}</span>
            {{ t(clue.text) }}
          </button>
        </div>
        <button type="button" class="btn btn-yellow next" @click="nextRound">{{ t(ui.nextRound) }}</button>
      </div>
    </div>

    <div v-else class="finished pop-in">
      <p>🕵️ {{ t(activity.doneText) }}</p>
      <button type="button" class="btn" @click="restart">🔄 {{ t(ui.playAgain) }}</button>
    </div>
  </div>
</template>

<style scoped>
.round-count {
  margin: 0;
  color: var(--muted);
  font-weight: 700;
}

.round-question {
  margin: 2px 0 12px;
  font-size: 1.25rem;
  font-weight: 800;
}

.pictures {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 200px));
  justify-content: center;
  gap: 18px;
}

.picture {
  position: relative;
  padding: 10px;
  border: var(--outline);
  border-radius: var(--radius);
  background: #fff;
  box-shadow: var(--pop-small);
  transition: transform 0.15s;
}

.picture:hover {
  transform: translateY(-3px);
}

.picture.correct {
  background: var(--green-soft);
  outline: 4px solid var(--green);
}

.stamp {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%) rotate(-6deg);
  padding: 2px 10px;
  border: 2px solid var(--line);
  border-radius: 8px;
  background: var(--yellow);
  font-weight: 800;
  white-space: nowrap;
}

.feedback {
  margin: 10px 0 0;
  text-align: center;
  font-weight: 800;
}

.clues {
  margin-top: 16px;
}

.clue-question {
  margin: 0 0 10px;
  font-size: 1.15rem;
  font-weight: 800;
}

.clue-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.clue {
  min-height: 48px;
  padding: 6px 16px;
  border: var(--outline);
  border-radius: 999px;
  background: #fff;
  font-weight: 700;
}

.clue.right {
  background: var(--green-soft);
}

.clue.wrong {
  background: var(--red-soft);
}

.next {
  margin-top: 14px;
}

.finished {
  display: grid;
  justify-items: center;
  gap: 12px;
  padding: 16px;
  border: var(--outline);
  border-radius: var(--radius-lg);
  background: var(--green-soft);
  font-size: 1.15rem;
  font-weight: 800;
  text-align: center;
}

.finished p {
  margin: 0;
}
</style>
