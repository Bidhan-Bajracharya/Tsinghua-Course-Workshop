<script setup>
/**
 * "Predict, then reveal": the class votes (fingers) or a child taps, then the answer is shown.
 * options: [{ k, e, l, ok }]. Emits 'done' after the reveal.
 */
import { ref, computed } from 'vue'
const props = defineProps({
  question: { type: String, required: true },
  options: { type: Array, required: true },
  reveal: { type: String, required: true },
  voteHint: { type: String, default: 'Vote with your fingers, then tap!' },
})
const emit = defineEmits(['done'])
const picked = ref(null)
const ok = computed(() => props.options.find((o) => o.k === picked.value)?.ok)
function choose(o) {
  if (picked.value) return
  picked.value = o.k
  emit('done')
}
defineExpose({ reset: () => (picked.value = null) })
</script>

<template>
  <div class="ai-card vote">
    <h3>{{ question }}</h3>
    <p class="hint">✋ {{ voteHint }}</p>
    <div class="opts" :style="{ '--n': options.length }">
      <button
        v-for="(o, i) in options"
        :key="o.k"
        class="opt"
        :class="{ right: picked && o.ok, wrong: picked === o.k && !o.ok }"
        :disabled="!!picked"
        @click="choose(o)"
      >
        <span class="opt__n">{{ i + 1 }}</span>
        <span class="opt__e">{{ o.e }}</span>{{ o.l }}
      </button>
    </div>
    <Transition name="pop">
      <p v-if="picked" class="reveal" :class="ok ? 'good' : 'mid'">
        <b>{{ ok ? '✅ Good thinking! ' : '🤯 Surprise! ' }}</b>{{ reveal }}
      </p>
    </Transition>
  </div>
</template>

<style scoped>
.vote { display: flex; flex-direction: column; gap: 12px; align-items: center; text-align: center; }
.vote h3 { font-size: clamp(22px, 3vw, 28px); }
.hint { color: var(--ai-ink-soft); font-weight: 700; font-size: 15px; }
.opts { display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); gap: 10px; width: 100%; max-width: 680px; }
@media (max-width: 560px) { .opts { grid-template-columns: 1fr; } }
.opt {
  position: relative; border: 0; font: inherit; font-family: var(--ai-font-head); font-weight: 800; font-size: 18px; color: var(--ai-ink);
  background: #fff; border-radius: 18px; padding: 14px 8px 12px; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  box-shadow: inset 0 0 0 3px var(--ai-line), 0 4px 0 var(--ai-line); transition: transform 0.12s;
}
.opt:hover:not(:disabled) { transform: translateY(-2px); }
.opt:disabled { cursor: default; }
.opt__n { position: absolute; top: 6px; left: 8px; width: 22px; height: 22px; border-radius: 50%; background: var(--ai-ink); color: #fff; font-size: 13px; display: grid; place-items: center; }
.opt__e { font-size: 40px; line-height: 1; }
.opt.right { background: #e3f8ee; box-shadow: inset 0 0 0 3px var(--ai-green), 0 4px 0 #17895a; }
.opt.wrong { background: #ffe6ec; box-shadow: inset 0 0 0 3px var(--ai-red), 0 4px 0 #b8264a; }
.reveal { font-size: 19px; border-radius: 16px; padding: 10px 16px; max-width: 680px; }
.reveal.good { background: #e3f8ee; color: #137a4f; }
.reveal.mid { background: #fff4d6; color: #7a5600; }
.pop-enter-active { transition: all 0.3s ease; }
.pop-enter-from { opacity: 0; transform: translateY(8px); }
</style>
