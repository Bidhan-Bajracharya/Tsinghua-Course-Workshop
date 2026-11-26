<script setup>
/** Pop-up lesson guide for teachers (opened from the 📘 button in the lesson header). */
import { onMounted, onBeforeUnmount, ref } from 'vue'

defineProps({ guide: { type: Object, required: true } })
const emit = defineEmits(['close'])
const closeBtn = ref(null)
const onKey = (e) => e.key === 'Escape' && emit('close')
onMounted(() => {
  window.addEventListener('keydown', onKey)
  closeBtn.value?.focus()
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="box ai-card" role="dialog" aria-modal="true" aria-labelledby="tg-title">
      <div class="box__head">
        <h2 id="tg-title">📘 Teacher guide</h2>
        <button ref="closeBtn" class="ai-btn ai-btn--small" aria-label="Close" @click="emit('close')">✕ Close</button>
      </div>

      <p v-if="guide.intro" class="intro">{{ guide.intro }}</p>

      <section v-if="guide.goals">
        <h3>🎯 Learning goals</h3>
        <ul><li v-for="g in guide.goals" :key="g">{{ g }}</li></ul>
      </section>

      <section v-if="guide.voting" class="note">
        <h3>✋ Class voting</h3>
        <p>{{ guide.voting }}</p>
      </section>

      <section v-if="guide.order">
        <h3>⏱ Running order</h3>
        <table>
          <tbody>
            <tr v-for="row in guide.order" :key="row[0]">
              <th>{{ row[0] }}</th><td class="time">{{ row[1] }}</td><td>{{ row[2] }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section v-for="l in guide.lenses || []" :key="l.t" class="lens">
        <h3>{{ l.t }}</h3>
        <ul><li v-for="i in l.items" :key="i">{{ i }}</li></ul>
      </section>

      <section v-if="guide.late" class="note">
        <h3>⏩ Short on time?</h3>
        <p>{{ guide.late }}</p>
      </section>

      <section v-if="guide.sources">
        <h3>📚 Sources</h3>
        <ul class="small"><li v-for="s in guide.sources" :key="s">{{ s }}</li></ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed; inset: 0; z-index: 100; background: rgba(29, 43, 79, 0.55);
  display: flex; align-items: flex-start; justify-content: center; padding: 24px 14px; overflow-y: auto;
}
.box { max-width: 780px; width: 100%; display: flex; flex-direction: column; gap: 14px; padding: 24px 26px 28px; }
.box__head { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.box h2 { font-size: 30px; color: var(--ai-primary-dark); }
.box h3 { font-size: 20px; margin-bottom: 4px; }
.intro { color: var(--ai-ink-soft); font-weight: 700; }
ul { margin: 0; padding-left: 22px; font-size: 17px; }
li { margin-bottom: 4px; }
.small { font-size: 15px; color: var(--ai-ink-soft); }
.note { background: #fff8e1; border-radius: 14px; padding: 12px 16px; }
.lens { border-left: 6px solid var(--ai-primary); background: #f5f9ff; border-radius: 0 14px 14px 0; padding: 12px 16px; }
.lens:nth-of-type(odd) { border-color: var(--ai-purple); }
table { border-collapse: collapse; width: 100%; font-size: 16px; }
th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid var(--ai-line); vertical-align: top; }
th { white-space: nowrap; }
.time { color: var(--ai-primary-dark); font-weight: 800; white-space: nowrap; }
</style>
