<script setup>
// "What changes?" checklist. Before `revealed`, children tick what they think changes.
// After `revealed`, each item shows whether it really changed and whether they spotted it.
// Used to predict before a reveal (story) and to notice changes after one (fair filter).
import { computed } from 'vue'
import { useLocale } from '../../i18n/useLocale.js'
import { ui } from '../../i18n/ui.js'

const props = defineProps({
  // [{ id, text, changed: boolean }]
  options: { type: Array, required: true },
  revealed: { type: Boolean, default: false },
})

const picked = defineModel({ type: Array, default: () => [] })
const { t } = useLocale()

const realChanges = computed(() => props.options.filter((option) => option.changed))
const spotted = computed(() => realChanges.value.filter((option) => picked.value.includes(option.id)).length)

function toggle(id) {
  if (props.revealed) return
  picked.value = picked.value.includes(id) ? picked.value.filter((item) => item !== id) : [...picked.value, id]
}

function resultIcon(option) {
  const guessed = picked.value.includes(option.id)
  if (option.changed) return guessed ? '✅' : '👀'
  return guessed ? '❌' : '➖'
}
</script>

<template>
  <div class="checklist">
    <div class="items">
      <button
        v-for="option in options"
        :key="option.id"
        type="button"
        class="item"
        :class="{
          picked: picked.includes(option.id),
          changed: revealed && option.changed,
          unchanged: revealed && !option.changed,
        }"
        :aria-pressed="picked.includes(option.id)"
        :disabled="revealed"
        @click="toggle(option.id)"
      >
        <span v-if="revealed" class="icon" aria-hidden="true">{{ resultIcon(option) }}</span>
        <span v-else class="box" aria-hidden="true">{{ picked.includes(option.id) ? '☑️' : '⬜' }}</span>
        {{ t(option.text) }}
      </button>
    </div>

    <p v-if="revealed" class="summary pop-in" role="status">
      {{ t(ui.spottedChanges, { n: spotted, total: realChanges.length }) }}
      <span class="legend">✅ {{ t(ui.legendSpotted) }} · 👀 {{ t(ui.legendMissed) }} · ❌ {{ t(ui.legendWrong) }}</span>
    </p>
  </div>
</template>

<style scoped>
.items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 6px 16px;
  border: var(--outline);
  border-radius: 999px;
  background: #fff;
  font-weight: 800;
}

.item.picked {
  background: var(--yellow-soft);
}

.item:disabled {
  cursor: default;
}

.item.changed {
  background: var(--green-soft);
}

.item.unchanged {
  background: #f1f1f5;
}

.summary {
  margin: 12px 0 0;
  font-size: 1.15rem;
  font-weight: 800;
}

.legend {
  display: block;
  margin-top: 2px;
  font-size: 0.9rem;
  color: var(--muted);
}
</style>
