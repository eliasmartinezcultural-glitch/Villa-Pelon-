/* Villa Pelón V4 — compatibilidad.
   La capa anterior de gameplay quedó consolidada en v4_playability.js.
   Este módulo no crea UI, listeners, timers ni un motor paralelo. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
V.v4Gameplay=V.v4Gameplay||{};
V.v4Gameplay.version=4;
V.v4Gameplay.authority='v4_playability';
})();