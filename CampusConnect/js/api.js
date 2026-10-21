/* Public API: Open-Meteo campus weather (no API key). Includes loading, error, retry and cached fallback. */
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=17.385&longitude=78.4867&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto';
const WX = { 0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Foggy', 48: 'Foggy', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 80: 'Rain showers', 81: 'Rain showers', 82: 'Heavy showers', 95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm' };

async function fetchWeather() {
  const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 7000);
  try {
    const r = await fetch(WEATHER_URL, { signal: ctrl.signal });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json();
    if (!j.current) throw new Error('Unexpected response');
    const d = { temp: Math.round(j.current.temperature_2m), wind: Math.round(j.current.wind_speed_10m), text: WX[j.current.weather_code] || 'Fair', at: Date.now() };
    Store.saveData('weather', d);
    return d;
  } finally { clearTimeout(timer); }
}

function weatherWidget(box) {
  const show = (d, note) => {
    box.innerHTML = `<div class="wx"><div class="temp">${d.temp}°C</div><div><strong>${esc(d.text)}</strong><br><small class="muted">Wind ${d.wind} km/h · Hyderabad campus</small></div></div>${note ? `<p class="muted"><small>${note}</small></p>` : ''}`;
  };
  const cached = Store.getData('weather');
  if (cached && Date.now() - cached.at < 6e5) return show(cached); // avoid repeat requests within 10 min
  box.innerHTML = '<div class="skeleton" aria-busy="true"></div><p class="muted"><small>Loading weather…</small></p>';
  fetchWeather().then(d => show(d)).catch(() => {
    if (cached) show(cached, 'Weather service unavailable. Showing last saved reading.');
    else box.innerHTML = '<p>Weather is unavailable right now. The rest of CampusConnect works normally.</p>';
    const b = document.createElement('button'); b.className = 'btn ghost sm'; b.textContent = 'Retry';
    b.onclick = () => { Store.removeData('weather'); weatherWidget(box); };
    box.appendChild(b);
  });
}
