/* Villa Pelón V4 — COMPATIBILIDAD DE LEGACY
   Migra partidas antiguas una sola vez. No mantiene V2/V3 vivos durante la partida.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const K=V.v4||(V.v4={version:4,modules:{}});
function copyOnce(from,to){try{const a=localStorage.getItem(from);if(a&&!localStorage.getItem(to))localStorage.setItem(to,a)}catch(_){}
}
copyOnce('villa_pelon_v3_save','villa_pelon_v4_save');
copyOnce('villa_pelon_v3_world','villa_pelon_v4_world');
copyOnce('villa_pelon_v2_save','villa_pelon_v4_save');
copyOnce('villa_pelon_v2_story','villa_pelon_v4_story');
if(V.state)V.state.version=4;
K.modules=K.modules||{};
K.modules.compat={version:4,mode:'ONE_TIME_MIGRATION',saveKey:'villa_pelon_v4_save',worldKey:'villa_pelon_v4_world'};
V.v4Compat={version:4,migrated:true};
})();
