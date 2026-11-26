<script setup>
// Start: title, today's 3 missions, how we learn (guess → try → think), thinking badges and the camera promise.
import CartoonFace from '../components/illustrations/CartoonFace.vue'
import SnappySay from '../components/SnappySay.vue'
import { course } from '../data/course.js'
import { ui } from '../i18n/ui.js'

defineEmits(['next'])
const stage = course.stages.find((s) => s.type === 'welcome')
</script>

<template>
  <section class="ai-scene bc">
    <SnappySay :text="stage.mascot" />

    <div class="hero ai-card">
      <div class="hero__text">
        <span class="ai-tag">{{ course.unit }}</span>
        <h2>{{ course.title }}</h2>
        <p>{{ course.subtitle }}</p>
        <button class="ai-btn ai-btn--primary ai-btn--big" @click="$emit('next')">🚀 {{ ui.start }}</button>
      </div>
      <div class="hero__pic" aria-hidden="true">
        <div class="phone">
          <CartoonFace :look="{ skin: '#f6d0b0', blush: '#f08a9a', lips: '#e0607a', eyeSize: 1.1 }" />
          <span class="sparkle s1">✨</span><span class="sparkle s2">⭐</span><span class="sparkle s3">✨</span>
        </div>
      </div>
    </div>

    <div>
      <h3 class="sub">🎯 {{ stage.missionsTitle }}</h3>
      <ol class="missions">
        <li v-for="(m, i) in stage.missions" :key="i" class="ai-card mission">
          <span class="num">{{ i + 1 }}</span>
          <span class="icon" aria-hidden="true">{{ m.icon }}</span>
          <span>{{ m.text }}</span>
        </li>
      </ol>
    </div>

    <div class="two">
      <div class="ai-card how">
        <h3 class="sub">🧭 {{ stage.howTitle }}</h3>
        <ol class="how__steps">
          <li v-for="(s, i) in stage.howSteps" :key="i"><span aria-hidden="true">{{ s.icon }}</span>{{ s.text }}</li>
        </ol>
        <p class="badges">
          {{ stage.badgesIntro }}
          <span v-for="b in course.badges" :key="b.id" class="badge">{{ b.icon }} {{ b.name }}</span>
        </p>
      </div>
      <div class="ai-card promise">
        <h3 class="sub">📷 {{ ui.cameraPromiseTitle }}</h3>
        <ul><li v-for="(p, i) in ui.cameraPromises" :key="i">{{ p }}</li></ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 20px; align-items: center; }
.hero__text { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
.hero__text h2 { font-size: clamp(40px, 6vw, 60px); color: #8b5cf6; line-height: 1; }
.hero__text p { font-size: 20px; font-weight: 700; color: var(--ai-ink-soft); }
.hero__pic { display: flex; justify-content: center; }
.phone { position: relative; width: min(210px, 100%); padding: 24px 16px; border: 5px solid var(--ai-ink); border-radius: 34px; background: #f1ecff; box-shadow: var(--ai-shadow); transform: rotate(4deg); }
.sparkle { position: absolute; font-size: 28px; animation: bob 1.8s ease-in-out infinite; }
.s1 { top: -14px; left: -16px; }
.s2 { top: 40%; right: -22px; animation-delay: 0.4s; }
.s3 { bottom: -10px; left: 20%; animation-delay: 0.8s; }
@media (max-width: 700px) { .hero { grid-template-columns: 1fr; } .hero__pic { order: -1; } .phone { width: 160px; } }

.sub { font-size: 24px; margin-bottom: 10px; }
.missions { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr)); gap: 14px; }
.mission { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; font-weight: 700; padding-top: 24px; }
.num { position: absolute; top: -12px; left: 14px; width: 32px; height: 32px; border-radius: 50%; background: var(--ai-accent); color: #3b2a00; font-family: var(--ai-font-head); font-weight: 800; display: grid; place-items: center; }
.icon { font-size: 40px; line-height: 1; }

.two { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 760px) { .two { grid-template-columns: 1fr; } }
.how__steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.how__steps li { display: flex; align-items: center; gap: 10px; background: #eef5ff; border-radius: 14px; padding: 8px 12px; font-weight: 800; }
.how__steps span { font-size: 26px; }
.badges { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-top: 12px; font-weight: 700; }
.badge { background: #fff4d6; border-radius: 999px; padding: 2px 12px; font-weight: 800; }
.promise { background: #e3f8ee; box-shadow: none; }
.promise ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 6px; font-weight: 700; font-size: 18px; }
</style>
