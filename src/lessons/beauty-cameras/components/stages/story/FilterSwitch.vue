<script setup>
// Big ON/OFF switch for the beauty filter. `hint` shows a pointing hand until first use.
import { useLocale } from '../../../i18n/useLocale.js'
import { ui } from '../../../i18n/ui.js'

defineProps({
  label: { type: String, required: true },
  hint: { type: Boolean, default: false },
})

const on = defineModel({ type: Boolean, default: false })
const { t } = useLocale()
</script>

<template>
  <div class="switch-area">
    <span class="switch-label">{{ label }}</span>
    <button
      type="button"
      role="switch"
      class="switch"
      :class="{ on }"
      :aria-checked="on"
      :aria-label="label"
      @click="on = !on"
    >
      <span class="knob">{{ on ? t(ui.filterOn) : t(ui.filterOff) }}</span>
    </button>
    <span v-if="hint" class="tap-me" aria-hidden="true">👈</span>
  </div>
</template>

<style scoped>
.switch-area {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 10px;
}

.switch-label {
  font-family: var(--font-fun);
  font-size: 1.4rem;
  font-weight: 800;
}

.switch {
  position: relative;
  width: 140px;
  height: 64px;
  border: var(--outline);
  border-radius: 999px;
  background: #d9d9e3;
  box-shadow: var(--pop-small);
  transition: background 0.25s;
}

.switch.on {
  background: var(--green);
}

.knob {
  position: absolute;
  top: 4px;
  left: 4px;
  display: grid;
  place-items: center;
  width: 64px;
  height: 50px;
  border: 2px solid var(--line);
  border-radius: 999px;
  background: #fff;
  font-weight: 800;
  transition: left 0.25s;
}

.switch.on .knob {
  left: 66px;
}

.tap-me {
  position: absolute;
  right: -44px;
  bottom: 10px;
  font-size: 2rem;
  animation: bob 1s ease-in-out infinite;
}
</style>
