<script setup>
// Finish: summary, thinking badges, the child's own thoughts, and the certificate.
import { computed, onMounted, inject, ref } from 'vue'
import SnappySay from '../components/SnappySay.vue'
import Certificate from '../../../shared/Certificate.vue'
import { course } from '../data/course.js'
import { ui } from '../i18n/ui.js'
import { useLessonState } from '../state'
import ConfettiBurst from '../components/effects/ConfettiBurst.vue'

const emit = defineEmits(['next', 'complete'])
const S = useLessonState()
const restart = inject('bc-restart')
const stage = course.stages.find((s) => s.type === 'finish')
const confetti = ref(0)
const earned = computed(() => course.badges.filter((b) => S.badges.has(b.id)))

onMounted(() => {
  emit('complete', { score: S.badges.size, total: course.badges.length })
  confetti.value += 1
})
</script>

<template>
  <section class="ai-scene bc">
    <ConfettiBurst :trigger="confetti" />
    <SnappySay :text="stage.mascot" />

    <div class="ai-scene__head"><h2>🏆 {{ stage.title }}</h2></div>
    <ul class="takeaways">
      <li v-for="(item, i) in stage.takeaways" :key="i" class="ai-card take pop-in" :style="{ animationDelay: `${i * 0.12}s` }">
        <span class="ic" aria-hidden="true">{{ item.icon }}</span><span>{{ item.text }}</span>
      </li>
    </ul>

    <div class="ai-card">
      <h3 class="sub">🏅 {{ ui.badges }}</h3>
      <div class="badges">
        <div v-for="b in course.badges" :key="b.id" class="badge" :class="{ earned: S.badges.has(b.id) }">
          <span class="bi" aria-hidden="true">{{ S.badges.has(b.id) ? b.icon : '❔' }}</span>
          <strong>{{ b.name }}</strong>
          <small>{{ b.earnedFor }}</small>
          <span class="vh">{{ S.badges.has(b.id) ? ui.badgeEarned : ui.badgeNotYet }}</span>
        </div>
      </div>
    </div>

    <div v-if="S.thoughts.length" class="ai-card thoughts">
      <h3 class="sub">💬 {{ ui.myThoughts }}</h3>
      <ul>
        <li v-for="(th, i) in S.thoughts" :key="i"><span>{{ th.question }}</span><b>→ {{ th.answer }}</b></li>
      </ul>
    </div>

    <Certificate
      :title="`${stage.badge}!`"
      line="for completing every level of “Beauty Cameras”: how photo editing and AI filters work, and how to use them wisely, fairly and kindly."
      unit-label="Unit 2 · Lesson 3 · Beauty Cameras"
      file-stem="Beauty-Cameras-Certificate"
      :stars="S.badges.size"
      :max-stars="course.badges.length"
      :score-text="`Thinking badges: ${S.badges.size} / ${course.badges.length}`"
      :extras="earned.map((b) => `${b.icon} ${b.name}: ${b.earnedFor}`)"
      extras-title="My thinking badges"
      mascot="snappy"
      signer="Snappy 📷"
      signer-role="Camera Guide"
      :initial-name="S.name"
      :show-back="false"
      @named="(n) => (S.name = n)"
    />

    <div class="again"><button class="ai-btn" @click="restart">{{ ui.restart }}</button></div>
  </section>
</template>

<style scoped>
.sub { font-size: 24px; margin-bottom: 10px; }
.takeaways { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr)); gap: 12px; }
.take { display: flex; align-items: center; gap: 12px; font-weight: 700; padding: 14px 16px; }
.ic { font-size: 32px; }
.badges { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr)); gap: 10px; }
.badge { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 2px; padding: 12px; border-radius: 16px; background: #f6f8fc; opacity: 0.55; border: 2px dashed var(--ai-line); }
.badge.earned { opacity: 1; background: #fff4d6; border: 2px solid #ffd666; }
.bi { font-size: 36px; }
.badge small { color: var(--ai-ink-soft); font-weight: 700; }
.vh { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.thoughts { background: #f1ecff; box-shadow: none; }
.thoughts ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
.thoughts li { display: flex; flex-direction: column; font-weight: 700; }
.thoughts b { color: #6a3fd6; }
.again { display: flex; justify-content: center; }
</style>
