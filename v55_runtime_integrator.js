/* VILLA PELÓN V58 — integrador mínimo. El inicio de partida pertenece a game.js. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const E=V.engine;
if(!E)return;
V.runtime={version:'1.2.0',platforms:['pc','mobile'],worldBounds:{w:3200,h:2000},authority:{game:'game.js',life:'life.js',data:'village_data.js',integrity:'v57_integrity.js'},singlePlayerState:true,singleLifeUpdate:true,singleVisualAuthority:'game.js'};
const validate=()=>{const h=E.health();h.runtime=true;h.ok=!!(h.game&&h.life&&h.geometry&&h.canvas);V.runtime.health=h;E.emit('health',h);return h};
E.on('state',state=>{if(state==='ready'||state==='running')validate()});
E.on('ready',validate);
V.runtime.validate=validate;
V.runtime.ready=true;
validate();
})();