/* Villa Pelón — Mobile Startup V72
   Punto único de entrada para la experiencia móvil. Recupera partida y sincroniza el HUD. */
(() => {
  'use strict';
  const V = window.VillaPelon || (window.VillaPelon = {});
  const state = V.gameState || window.__villaPelonState;
  const start = document.getElementById('start');
  const game = document.getElementById('game');
  if (!state || !start || !game) return;

  function restore() {
    try {
      const raw = localStorage.getItem('villa_pelon_save');
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== 'object') return;
      const allowed = ['x','y','money','energy','minutes','day','quest','inventory','facing'];
      allowed.forEach(k => { if (saved[k] !== undefined) state[k] = saved[k]; });
      state.dialogue = false;
    } catch (_) {}
  }

  function syncHud() {
    const clock = document.getElementById('clock');
    const day = document.getElementById('day');
    const money = document.getElementById('money');
    const energy = document.getElementById('energy');
    if (clock) { const h = Math.floor(state.minutes / 60) % 24, m = Math.floor(state.minutes % 60); clock.textContent = String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0'); }
    if (day) day.textContent = state.day;
    if (money) money.textContent = Math.round(state.money);
    if (energy) energy.textContent = Math.round(state.energy);
  }

  V.gameStart = function () {
    // Recuperar ANTES de marcar la partida como iniciada: el estado nuevo arranca con started=false.
    restore();
    state.started = true;
    start.classList.add('hidden');
    game.classList.remove('hidden');
    syncHud();
    window.dispatchEvent(new CustomEvent('villapelon:started'));
  };

  // El intro es el dueño de la transición. El handler legacy de game.js queda como respaldo.
  window.addEventListener('villapelon:started', () => {
    try { document.getElementById('interact')?.focus({preventScroll:true}); } catch (_) {}
  }, { once:true });
})();
