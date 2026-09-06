/* Villa Pelón — Mobile First Run V72
   Onboarding contextual, autosave y accesibilidad táctil. No depende de frameworks ni assets externos. */
(() => {
  'use strict';
  const V = window.VillaPelon || (window.VillaPelon = {});
  const state = V.gameState || window.__villaPelonState;
  if (!state) return;

  const KEY = 'villa_pelon_tutorial_v1';
  const initial = { x: state.x, y: state.y };
  const ui = document.createElement('div');
  ui.id = 'vpMobileGuide';
  ui.innerHTML = '<div class="vp-guide-kicker">PRIMER RECORRIDO</div><div class="vp-guide-text" id="vpGuideText"></div><button type="button" id="vpGuideClose" aria-label="Cerrar ayuda">×</button>';
  document.body.appendChild(ui);

  const style = document.createElement('style');
  style.textContent = `
    #vpMobileGuide{position:fixed;z-index:80;left:50%;bottom:calc(118px + env(safe-area-inset-bottom));transform:translateX(-50%);width:min(430px,calc(100vw - 28px));box-sizing:border-box;padding:12px 42px 12px 14px;border:1px solid rgba(236,221,177,.35);border-radius:12px;background:rgba(25,34,27,.96);box-shadow:0 10px 30px rgba(0,0,0,.28);color:#f6edcf;font:13px/1.4 system-ui,sans-serif;opacity:0;pointer-events:none;transition:opacity .18s ease}
    #vpMobileGuide.is-visible{opacity:1;pointer-events:auto}
    #vpMobileGuide .vp-guide-kicker{font:bold 10px/1 monospace;letter-spacing:1.2px;opacity:.65;margin-bottom:5px}
    #vpMobileGuide .vp-guide-text{padding-right:2px}
    #vpGuideClose{position:absolute;right:8px;top:7px;width:30px;height:30px;border:0;border-radius:8px;background:rgba(255,255,255,.08);color:#fff;font-size:22px;line-height:1}
    @media(max-width:600px){#vpMobileGuide{bottom:calc(108px + env(safe-area-inset-bottom));font-size:12px}}
    @media(prefers-reduced-motion:reduce){#vpMobileGuide{transition:none}}
  `;
  document.head.appendChild(style);

  const text = document.getElementById('vpGuideText');
  const close = document.getElementById('vpGuideClose');
  let closed = false;
  let stage = Number(localStorage.getItem(KEY) || 0);
  let lastSave = 0;

  function show(message) {
    if (closed) return;
    text.textContent = message;
    ui.classList.add('is-visible');
  }
  function hide() { ui.classList.remove('is-visible'); }
  close.addEventListener('click', () => { closed = true; hide(); });

  function distanceFromStart() { return Math.hypot(state.x - initial.x, state.y - initial.y); }
  function persist() {
    try {
      const payload = { ...state, dialogue:false, saved:false };
      localStorage.setItem('villa_pelon_save', JSON.stringify(payload));
      lastSave = Date.now();
    } catch (_) {}
  }

  function tick() {
    if (!state.started) return;
    const moved = distanceFromStart() > 90;
    if (stage === 0 && moved) {
      stage = 1; localStorage.setItem(KEY, '1');
      show('Bien. Ya estás recorriendo Villa Pelón. Acercate a una persona y usá INTERACTUAR.');
    } else if (stage === 1 && state.quest >= 1) {
      stage = 2; localStorage.setItem(KEY, '2');
      show('Ahora tenés una misión. Buscá la pista marcada y descubrí qué historia guarda.');
    } else if (stage === 2 && state.quest >= 2) {
      stage = 3; localStorage.setItem(KEY, '3');
      show('Primer descubrimiento completo. La historia se construye con pistas, lugares y testimonios.');
      setTimeout(hide, 5000);
    }
    if (Date.now() - lastSave > 12000) persist();
  }

  document.addEventListener('visibilitychange', () => { if (document.hidden) persist(); });
  window.addEventListener('pagehide', persist);
  setInterval(tick, 700);
  setTimeout(() => {
    if (stage === 0) show('Empezá despacio: usá las flechas de abajo para caminar y explorá el territorio.');
    else if (stage === 1) show('Explorá y acercate a un vecino. El botón INTERACTUAR sirve para hablar y descubrir acciones.');
    else if (stage === 2) show('Tu misión está activa. Seguí la pista y prestá atención a los lugares.');
  }, 900);
})();
