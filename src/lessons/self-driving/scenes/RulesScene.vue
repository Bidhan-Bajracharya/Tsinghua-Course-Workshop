<script setup>
import { ref, computed } from 'vue'
import LumiSay from '../components/LumiSay.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { RULES } from '../data/content'
import { useLessonState } from '../state'

defineEmits(['next'])
const S = useLessonState()
const warn = ref(false)
const count = computed(() => S.rules.length + (S.ownRule.trim() ? 1 : 0))

function toggle(k) {
  const i = S.rules.indexOf(k)
  if (i > -1) {
    S.rules.splice(i, 1)
    warn.value = false
    return
  }
  if (count.value >= 3) {
    warn.value = true
    setTimeout(() => (warn.value = false), 1500)
    return
  }
  S.rules.push(k)
}
function onOwn(e) {
  S.ownRule = e.target.value
  if (S.ownRule.trim() && S.rules.length > 2) S.rules.length = 2
}
</script>

<template>
  <section class="ai-scene">
    <LumiSay text="Write MY rule book! Pick 3 rules, or write your own." />

    <div class="book ai-card">
      <div class="rules">
        <button v-for="r in RULES" :key="r.k" class="rule" :class="{ on: S.rules.includes(r.k) }" :aria-pressed="S.rules.includes(r.k)" @click="toggle(r.k)">
          <span class="rule__e">{{ r.e }}</span>{{ r.l }}
          <span class="rule__check">{{ S.rules.includes(r.k) ? '✓' : '+' }}</span>
        </button>
      </div>
      <input
        class="own"
        type="text"
        maxlength="50"
        :value="S.ownRule"
        placeholder="✏️ Your own rule (optional)"
        aria-label="Your own rule"
        @input="onOwn"
      />
    </div>

    <p class="cap" :class="{ ok: count >= 3, warn }">
      <template v-if="warn">Only 3! Tap one to remove it first.</template>
      <template v-else-if="count >= 3">✓ Your rule book is ready!</template>
      <template v-else>{{ count }} / 3 rules</template>
    </p>
    <div v-if="count >= 3" class="ai-row center">
      <button class="ai-btn ai-btn--green ai-btn--big" @click="$emit('next')">To the finish line 🏁</button>
    </div>

    <TeacherTip text="Students decide what matters most to them. Ask volunteers to explain one rule. You can collect the class's favourite rules on the board." />
  </section>
</template>

<style scoped>
.book { display: flex; flex-direction: column; gap: 14px; }
.rules { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
@media (max-width: 600px) { .rules { grid-template-columns: 1fr; } }
.rule {
  position: relative; border: 0; font: inherit; font-weight: 700; font-size: 17px; color: var(--ai-ink); cursor: pointer; text-align: left;
  background: #fff; border-radius: 16px; padding: 12px 40px 12px 14px; display: flex; gap: 10px; align-items: center;
  box-shadow: inset 0 0 0 3px var(--ai-line), 0 3px 0 var(--ai-line); transition: transform 0.12s, background 0.15s;
}
.rule:hover { transform: translateY(-2px); }
.rule.on { background: #fff4d6; box-shadow: inset 0 0 0 3px var(--ai-accent), 0 3px 0 #d99a00; }
.rule__e { font-size: 28px; }
.rule__check {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 24px; height: 24px; border-radius: 50%;
  display: grid; place-items: center; font-weight: 800; font-size: 14px; background: #f0f5fd; color: var(--ai-ink-soft);
}
.rule.on .rule__check { background: var(--ai-accent); color: #3b2a00; }
.own {
  font: inherit; font-size: 18px; border: 3px solid var(--ai-line); border-radius: 999px; padding: 10px 18px;
  width: 100%; outline: none; background: #f8fbff; color: var(--ai-ink);
}
.own:focus { border-color: var(--ai-primary); box-shadow: 0 0 0 5px #d6e6ff; }
.cap { text-align: center; font-family: var(--ai-font-head); font-weight: 800; font-size: 22px; color: var(--ai-ink-soft); }
.cap.ok { color: var(--ai-green); }
.cap.warn { color: var(--ai-red); }
.center { justify-content: center; }
</style>
