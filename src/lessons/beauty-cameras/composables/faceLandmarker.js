// Loads Google MediaPipe's Face Landmarker, which finds 478 face points in the browser.
// Everything runs on the device: video frames never leave the computer.
// The library is only downloaded the first time a camera activity needs it (lazy import).

// Model file: a copy in public/models/ is used if present (works offline, see README);
// otherwise it is downloaded once from Google's model storage (the browser caches it).
const LOCAL_MODEL_URL = `${import.meta.env.BASE_URL}models/face_landmarker.task`
const REMOTE_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'

let landmarkerPromise = null

// A missing file still "loads" in a dev server (it returns the HTML page), so check the type too.
async function hasLocalModel() {
  try {
    const response = await fetch(LOCAL_MODEL_URL, { method: 'HEAD' })
    return response.ok && !response.headers.get('content-type')?.includes('text/html')
  } catch {
    return false
  }
}

async function createLandmarker() {
  const [{ FaceLandmarker }, { default: wasmLoaderPath }, { default: wasmBinaryPath }, useLocal] = await Promise.all([
    import('@mediapipe/tasks-vision'),
    import('@mediapipe/tasks-vision/vision_wasm_internal.js?url'),
    import('@mediapipe/tasks-vision/vision_wasm_internal.wasm?url'),
    hasLocalModel(),
  ])

  const create = (delegate) =>
    FaceLandmarker.createFromOptions(
      { wasmLoaderPath, wasmBinaryPath },
      {
        baseOptions: { modelAssetPath: useLocal ? LOCAL_MODEL_URL : REMOTE_MODEL_URL, delegate },
        runningMode: 'VIDEO',
        numFaces: 2,
      },
    )

  // The graphics chip (GPU) is faster and uses less energy than the processor (CPU);
  // fall back to the CPU on computers where the GPU can't be used.
  try {
    return await create('GPU')
  } catch {
    return create('CPU')
  }
}

// Shared by all components; created once, retried next time if it failed.
export function loadFaceLandmarker() {
  landmarkerPromise ??= createLandmarker().catch((err) => {
    landmarkerPromise = null
    throw err
  })
  return landmarkerPromise
}
