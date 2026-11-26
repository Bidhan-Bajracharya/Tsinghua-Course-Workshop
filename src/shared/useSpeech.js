import { ref, onBeforeUnmount } from 'vue'

/** Tiny wrapper around the browser's built-in text-to-speech (read aloud). */
export function useSpeech() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const speaking = ref(false)

  function speak(text) {
    if (!supported || !text) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = 0.92
    u.pitch = 1.1
    u.onend = () => (speaking.value = false)
    u.onerror = () => (speaking.value = false)
    speaking.value = true
    window.speechSynthesis.speak(u)
  }

  function stop() {
    if (supported) window.speechSynthesis.cancel()
    speaking.value = false
  }

  onBeforeUnmount(stop)

  return { supported, speaking, speak, stop }
}
