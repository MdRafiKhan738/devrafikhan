/* ---------------------------------------------------------
   Day/night + live weather icon next to the "Local time" clock.
   Uses Open-Meteo (free, no API key) for Dhaka's real sky right now:
   clear, partly cloudy, overcast, fog, drizzle, rain, snow or storm -
   each with its own icon and colour. Falls back to a plain sun/moon
   (by local Dhaka hour) if the request fails or is blocked.

   Icons are raw inline SVG (not lucide.createIcons(), which has no way
   to target a single node - it rescans and recreates every icon on the
   page each time it's called).
   --------------------------------------------------------- */
(() => {
  const LAT = 23.8103, LON = 90.4125; // Dhaka
  const CACHE_KEY = 'wx-dhaka-v1';
  const CACHE_MS = 15 * 60 * 1000;

  const wrap = (body) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const ICONS = { // key: [svg, colour]
    'clear-day': [wrap('<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'), '#f5c451'],
    'clear-night': [wrap('<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>'), '#9db4d8'],
    'partly-day': [wrap('<path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/>'), '#e8c26a'],
    'partly-night': [wrap('<path d="M13 16a3 3 0 0 1 0 6H7a5 5 0 1 1 4.9-6z"/><path d="M18.376 14.512a6 6 0 0 0 3.461-4.127c.148-.625-.659-.97-1.248-.714a4 4 0 0 1-5.259-5.26c.255-.589-.09-1.395-.716-1.248a6 6 0 0 0-4.594 5.36"/>'), '#9fb0c9'],
    cloudy: [wrap('<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>'), '#b7b2a8'],
    fog: [wrap('<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 17H7"/><path d="M17 21H9"/>'), '#b7b2a8'],
    drizzle: [wrap('<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 19v1"/><path d="M8 14v1"/><path d="M16 19v1"/><path d="M16 14v1"/><path d="M12 21v1"/><path d="M12 16v1"/>'), '#8fb8dd'],
    rain: [wrap('<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/>'), '#5b9bd5'],
    snow: [wrap('<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 15h.01"/><path d="M8 19h.01"/><path d="M12 17h.01"/><path d="M12 21h.01"/><path d="M16 15h.01"/><path d="M16 19h.01"/>'), '#cfe3f2'],
    storm: [wrap('<path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/>'), '#f2b544'],
  };

  function codeToKey(code, isDay) {
    if (code === 0) return isDay ? 'clear-day' : 'clear-night';
    if (code <= 2) return isDay ? 'partly-day' : 'partly-night';
    if (code === 3) return 'cloudy';
    if (code === 45 || code === 48) return 'fog';
    if (code >= 51 && code <= 57) return 'drizzle';
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
    if (code >= 95) return 'storm';
    return isDay ? 'clear-day' : 'clear-night';
  }

  function paint(key) {
    const [svg, color] = ICONS[key] || ICONS['clear-day'];
    document.querySelectorAll('[data-wx]').forEach((el) => { el.innerHTML = svg; el.style.color = color; });
  }

  function localIsDay() {
    const hour = +new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Dhaka', hour: '2-digit', hour12: false }).format(new Date());
    return hour >= 6 && hour < 18;
  }

  // Show a sensible icon immediately (no blank gap), then refine with the live sky once it loads.
  paint(localIsDay() ? 'clear-day' : 'clear-night');

  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.t < CACHE_MS) { paint(cached.key); return; }
  } catch { /* sessionStorage unavailable - fine, just re-fetch */ }

  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=weather_code,is_day&timezone=Asia%2FDhaka`)
    .then((r) => r.json())
    .then((d) => {
      const key = codeToKey(d.current.weather_code, d.current.is_day === 1);
      paint(key);
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ key, t: Date.now() })); } catch { /* ignore */ }
    })
    .catch(() => {}); // offline/blocked: the sun/moon fallback already painted above stands
})();
