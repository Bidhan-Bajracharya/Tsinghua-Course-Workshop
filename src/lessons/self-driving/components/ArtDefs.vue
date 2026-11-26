<template>
  <!-- Reusable drawings for this lesson. Use with <use href="#sd-…"/>. Rendered once by the lesson root. -->
  <svg width="0" height="0" style="position: absolute" aria-hidden="true" focusable="false">
    <defs>
      <!-- Lumi from above (for the toll-gate road) -->
      <symbol id="sd-lumiTop" viewBox="0 0 60 100">
        <rect x="2" y="16" width="8" height="18" rx="3" fill="#1d2b4f" /><rect x="50" y="16" width="8" height="18" rx="3" fill="#1d2b4f" />
        <rect x="2" y="66" width="8" height="18" rx="3" fill="#1d2b4f" /><rect x="50" y="66" width="8" height="18" rx="3" fill="#1d2b4f" />
        <rect x="6" y="4" width="48" height="92" rx="20" fill="#2f7cf6" />
        <rect x="12" y="24" width="36" height="54" rx="12" fill="#1d2b4f" />
        <circle cx="30" cy="50" r="8" fill="#2f3b55" /><circle cx="30" cy="50" r="5" fill="none" stroke="#00e5ff" stroke-width="2" />
        <rect x="11" y="5" width="12" height="4" rx="2" fill="#fff2b0" /><rect x="37" y="5" width="12" height="4" rx="2" fill="#fff2b0" />
        <circle cx="22" cy="30" r="3.4" fill="#fff" /><circle cx="38" cy="30" r="3.4" fill="#fff" />
        <circle cx="22" cy="29" r="1.6" fill="#1d2b4f" /><circle cx="38" cy="29" r="1.6" fill="#1d2b4f" />
      </symbol>

      <!-- 1886 Benz -->
      <symbol id="sd-car1886" viewBox="0 0 120 80">
        <path d="M30 50 L96 50" stroke="#7a4e2a" stroke-width="5" />
        <rect x="40" y="34" width="34" height="14" rx="3" fill="#9c6b3f" />
        <rect x="44" y="22" width="26" height="14" rx="3" fill="#5b3a1e" />
        <circle cx="57" cy="10" r="6" fill="#1d2b4f" /><path d="M50 16 h14 l2 14 h-18z" fill="#1d2b4f" />
        <path d="M66 22 L84 30" stroke="#1d2b4f" stroke-width="3" stroke-linecap="round" />
        <path d="M84 30 L94 56" stroke="#7a4e2a" stroke-width="3" />
        <g fill="none" stroke="#1d2b4f" stroke-width="4"><circle cx="34" cy="56" r="20" /><circle cx="96" cy="66" r="11" /></g>
        <g stroke="#1d2b4f" stroke-width="2"><path d="M34 36v40M14 56h40M20 42l28 28M48 42L20 70" /><path d="M96 55v22M85 66h22" /></g>
      </symbol>

      <!-- 1925 radio car -->
      <symbol id="sd-car1925" viewBox="0 0 130 84">
        <path d="M44 16 V2" stroke="#1d2b4f" stroke-width="3" /><circle cx="44" cy="3" r="3.5" fill="#ffd166" stroke="#1d2b4f" stroke-width="1.5" />
        <rect x="24" y="14" width="42" height="34" rx="6" fill="#ef476f" />
        <rect x="30" y="19" width="14" height="14" rx="3" fill="#dff0ff" /><rect x="48" y="19" width="13" height="14" rx="3" fill="#dff0ff" />
        <path d="M66 30 H108 Q116 30 116 38 V48 H66 Z" fill="#ef476f" />
        <g stroke="#c3264f" stroke-width="2"><path d="M76 34v10M84 34v10M92 34v10" /></g>
        <rect x="112" y="33" width="10" height="10" rx="5" fill="#fff2b0" />
        <path d="M10 56 Q14 44 32 44 Q48 44 52 56 Z M78 56 Q82 44 100 44 Q116 44 120 56 Z" fill="#1d2b4f" />
        <rect x="8" y="46" width="114" height="8" rx="4" fill="#1d2b4f" />
        <g fill="#f3f8ff" stroke="#1d2b4f" stroke-width="3"><circle cx="31" cy="66" r="13" /><circle cx="99" cy="66" r="13" /></g>
        <g stroke="#1d2b4f" stroke-width="1.6"><path d="M31 53v26M18 66h26M22 57l18 18M40 57l-18 18M99 53v26M86 66h26M90 57l18 18M108 57l-18 18" /></g>
        <circle cx="31" cy="66" r="3" fill="#1d2b4f" /><circle cx="99" cy="66" r="3" fill="#1d2b4f" />
      </symbol>

      <!-- 1960 car -->
      <symbol id="sd-car1960" viewBox="0 0 120 70">
        <path d="M6 44 Q10 28 34 24 Q56 10 82 20 Q108 26 114 44 L114 50 L6 50 Z" fill="#ffd166" />
        <path d="M40 26 Q56 15 66 16 L66 28 Z M70 16 Q84 18 92 28 L70 28 Z" fill="#dff0ff" />
        <rect x="104" y="36" width="8" height="6" rx="2" fill="#fff" />
        <g fill="#1d2b4f"><circle cx="30" cy="52" r="10" /><circle cx="92" cy="52" r="10" /></g>
        <g fill="#d3dcec"><circle cx="30" cy="52" r="4" /><circle cx="92" cy="52" r="4" /></g>
      </symbol>

      <!-- person -->
      <symbol id="sd-person" viewBox="0 0 20 44">
        <circle cx="10" cy="6" r="5.5" fill="#3a4a6b" />
        <path d="M4 14 h12 l2 16 h-4 l-1 14 h-3 l-1-11 l-1 11 h-3 l-1-14 h-4z" fill="#3a4a6b" />
      </symbol>

      <!-- sensor icons -->
      <symbol id="sd-i-cam" viewBox="0 0 40 40"><rect x="4" y="11" width="32" height="22" rx="6" fill="#1d2b4f" /><rect x="13" y="6" width="14" height="7" rx="2" fill="#1d2b4f" /><circle cx="20" cy="22" r="8" fill="#fff" /><circle cx="20" cy="22" r="4.5" fill="#8b5cf6" /></symbol>
      <symbol id="sd-i-radar" viewBox="0 0 40 40"><circle cx="8" cy="32" r="4" fill="#1d2b4f" /><g fill="none" stroke="#22b573" stroke-width="3.5" stroke-linecap="round"><path d="M8 22a10 10 0 0 1 10 10" /><path d="M8 13a19 19 0 0 1 19 19" /><path d="M8 4a28 28 0 0 1 28 28" /></g></symbol>
      <symbol id="sd-i-lidar" viewBox="0 0 40 40"><g fill="#00a6c8"><circle cx="8" cy="10" r="2.5" /><circle cx="16" cy="6" r="2.5" /><circle cx="25" cy="7" r="2.5" /><circle cx="32" cy="12" r="2.5" /><circle cx="6" cy="20" r="2.5" /><circle cx="34" cy="21" r="2.5" /><circle cx="9" cy="30" r="2.5" /><circle cx="31" cy="30" r="2.5" /><circle cx="20" cy="34" r="2.5" /></g><circle cx="20" cy="20" r="6" fill="#1d2b4f" /><circle cx="20" cy="20" r="3.5" fill="none" stroke="#00e5ff" stroke-width="2" /></symbol>
      <symbol id="sd-i-map" viewBox="0 0 40 40"><path d="M4 9l10-4 12 4 10-4v26l-10 4-12-4-10 4z" fill="#e7f0ff" stroke="#1d2b4f" stroke-width="2.5" stroke-linejoin="round" /><path d="M20 28s-6-6-6-10a6 6 0 0 1 12 0c0 4-6 10-6 10z" fill="#ef476f" /><circle cx="20" cy="18" r="2.2" fill="#fff" /></symbol>

      <!-- weather icons -->
      <symbol id="sd-i-sun" viewBox="0 0 44 44"><circle cx="22" cy="22" r="9" fill="#ffd166" /><g stroke="#ffb703" stroke-width="3.5" stroke-linecap="round"><path d="M22 4v5M22 35v5M4 22h5M35 22h5M9 9l3.5 3.5M31.5 31.5L35 35M9 35l3.5-3.5M31.5 12.5L35 9" /></g></symbol>
      <symbol id="sd-i-rain" viewBox="0 0 44 44"><path d="M12 24a8 8 0 0 1 1-16 11 11 0 0 1 20 3 7 7 0 0 1-1 13z" fill="#a5b4cf" /><g stroke="#2f7cf6" stroke-width="3.5" stroke-linecap="round"><path d="M14 30l-3 7M23 30l-3 7M32 30l-3 7" /></g></symbol>
      <symbol id="sd-i-fog" viewBox="0 0 44 44"><g stroke="#a5b4cf" stroke-width="4.5" stroke-linecap="round"><path d="M6 14h32M10 22h28M6 30h26M12 38h20" /></g></symbol>
      <symbol id="sd-i-moon" viewBox="0 0 44 44"><path d="M30 34A14 14 0 1 1 22 8a11 11 0 0 0 8 26z" fill="#6b5bd2" /><circle cx="34" cy="10" r="2" fill="#ffd166" /><circle cx="38" cy="20" r="1.5" fill="#ffd166" /></symbol>
    </defs>
  </svg>
</template>
