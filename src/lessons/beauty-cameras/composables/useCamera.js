import { onBeforeUnmount, ref, shallowRef } from 'vue'

// The child's answer to "May we turn on the camera?", shared by every camera activity
// so they are asked only once. null = not asked yet, 'on' = yes, 'off' = no (use cartoons).
export const cameraChoice = ref(null)

export const cameraSupported =
  typeof window !== 'undefined' && window.isSecureContext && !!navigator.mediaDevices?.getUserMedia

// Opens the front camera for one component and always closes it when that component goes away,
// so the camera (and its battery use) is only on while a camera activity is on screen.
// The video is never recorded, saved or uploaded.
export function useCamera() {
  const stream = shallowRef(null)
  const error = ref(null) // null | 'denied' | 'unavailable'
  const starting = ref(false)

  async function start() {
    if (stream.value || starting.value) return
    starting.value = true
    error.value = null
    try {
      stream.value = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
    } catch (err) {
      error.value = err?.name === 'NotAllowedError' ? 'denied' : 'unavailable'
    } finally {
      starting.value = false
    }
  }

  function stop() {
    stream.value?.getTracks().forEach((track) => track.stop())
    stream.value = null
  }

  onBeforeUnmount(stop)

  return { stream, error, starting, start, stop }
}
