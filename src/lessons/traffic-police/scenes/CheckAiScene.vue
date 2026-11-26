<script setup>
/** Using AI wisely: AI can make mistakes. You are the checker! */
import { ref, reactive } from 'vue'
import LearnCard from '../components/LearnCard.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { muddyCarSVG } from '../engine/frontcar'
import { sfx } from '../engine/core'
import { LEARN, NOTES, CASES } from '../data/content'

const SHADOW = `<svg viewBox="0 0 340 200" preserveAspectRatio="xMidYMid slice"><rect width="340" height="200" fill="#9fdc8f"/><rect y="30" width="340" height="100" fill="#4b5063"/><rect y="130" width="340" height="44" fill="#5d6276"/>${Array.from({ length: 14 }, (_, i) => `<line x1="${i * 28 - 20}" y1="174" x2="${i * 28 + 14}" y2="130" stroke="rgba(255,210,63,.75)" stroke-width="5"/>`).join('')}<line x1="0" y1="80" x2="340" y2="80" stroke="#fff" stroke-width="3" stroke-dasharray="20 16"/><ellipse cx="170" cy="152" rx="46" ry="18" fill="rgba(0,0,0,.45)"/><circle cx="170" cy="195" r="34" fill="#2f9e4f"/><circle cx="160" cy="186" r="22" fill="#43b05c"/><rect x="118" y="126" width="104" height="50" fill="none" stroke="#ff3b3b" stroke-width="4" stroke-dasharray="8 5"/></svg>`
const PICS = { muddy: muddyCarSVG(), shadow: SHADOW }
const votes = reactive({})
const key = ref(0)
function vote(i, v) {
  if (votes[i] !== undefined) return
  votes[i] = v
  sfx(v === CASES[i].right ? 'win' : 'bad')
}
function reset() {
  Object.keys(votes).forEach((k) => delete votes[k])
  key.value++
}
const confColor = (c) => (c > 90 ? '#22b573' : c > 70 ? '#ffb703' : '#ef476f')
</script>

<template>
  <section class="ai-scene">
    <LearnCard :card="LEARN.wrong" />
    <div class="head">
      <div class="ai-scene__head">
        <span class="ai-tag tp-k--teal">5 · Using AI wisely: check the AI</span>
        <h2>AI can make mistakes. You are the checker!</h2>
        <p><b>1.</b> Look at the picture · <b>2.</b> Read what the AI says · <b>3.</b> Class votes: 👍 the AI is right or 👎 the AI is wrong</p>
      </div>
      <button class="ai-btn ai-btn--small" aria-label="Start again" @click="reset">↺</button>
    </div>
    <div :key="key" class="grid">
      <article
        v-for="(c, i) in CASES"
        :key="c.title"
        class="ai-card wr"
        :class="{ judged: votes[i] !== undefined, ok: votes[i] !== undefined && c.right, no: votes[i] !== undefined && !c.right }"
      >
        <h3>{{ c.title }}</h3>
        <div class="img" v-html="PICS[c.pic]"></div>
        <div class="ai-says">
          <span>🤖 AI says: <b>{{ c.ai }}</b></span>
          <div class="ai-meter"><div class="ai-meter__fill" :style="{ width: c.conf + '%', background: confColor(c.conf) }"></div></div>
          <small>AI is {{ c.conf }}% sure</small>
        </div>
        <div class="ai-row vote">
          <button class="ai-btn ai-btn--green" :class="{ picked: votes[i] === true }" :disabled="votes[i] !== undefined" @click="vote(i, true)">👍 Agree</button>
          <button class="ai-btn no-btn" :class="{ picked: votes[i] === false }" :disabled="votes[i] !== undefined" @click="vote(i, false)">👎 Disagree</button>
        </div>
        <Transition name="pop">
          <p v-if="votes[i] !== undefined" class="truth">
            <b :style="{ color: votes[i] === c.right ? 'var(--ai-green)' : 'var(--ai-red)' }">{{ votes[i] === c.right ? '✅ Good thinking!' : '🤔 Look again!' }}</b>
            {{ c.truth }}
          </p>
        </Transition>
      </article>
    </div>
    <TeacherTip :text="NOTES.wrong" />
  </section>
</template>

<style scoped>
.head { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
@media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
.wr { display: flex; flex-direction: column; gap: 10px; transition: box-shadow 0.3s; }
.wr h3 { font-size: 24px; }
.wr.no { box-shadow: inset 0 0 0 5px var(--ai-red), var(--ai-shadow); }
.wr.ok { box-shadow: inset 0 0 0 5px var(--ai-green), var(--ai-shadow); }
.img { height: 220px; border-radius: 16px; overflow: hidden; background: #dff3ff; display: flex; align-items: center; justify-content: center; }
.img :deep(svg) { width: 100%; height: 100%; }
.ai-says { display: flex; flex-direction: column; gap: 6px; font-size: 18px; }
.ai-says small { color: var(--ai-ink-soft); font-weight: 800; }
.vote .ai-btn { flex: 1; }
.wr .no-btn { background: var(--ai-red); color: #fff; box-shadow: 0 4px 0 #b8264a; }
.wr .ai-btn.picked { outline: 4px solid var(--ai-ink); outline-offset: 2px; opacity: 1; }
.truth { font-size: 18px; line-height: 1.35; }
.pop-enter-active { transition: all 0.3s ease; }
.pop-enter-from { opacity: 0; transform: translateY(8px); }
</style>
