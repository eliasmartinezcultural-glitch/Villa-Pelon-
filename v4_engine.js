/* Villa Pelón V4 — KERNEL PASIVO
   No intercepta requestAnimationFrame. game.js es el único dueño del loop.
   Este módulo registra estado, migraciones y diagnóstico sin alterar el motor.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const K=V.v4={version:4,booted:true,ready:false,frame:0,fps:0,dt:0,errors:0,startedAt:performance.now(),modules:{}};
function migrate(){
 const move=(from,to)=>{try{const a=localStorage.getItem(from);if(a&&!localStorage.getItem(to))localStorage.setItem(to,a)}catch(_){K.errors++}};
 move('villa_pelon_v3_save','villa_pelon_v4_save');move('villa_pelon_v3_world','villa_pelon_v4_world');move('villa_pelon_v2_save','villa_pelon_v4_save');move('villa_pelon_v2_story','villa_pelon_v4_story');
}
K.register=(name,module)=>{if(name)K.modules[name]=module;return module};
K.emit=(name,payload)=>{const m=K.modules[name];if(m&&typeof m.onEvent==='function')m.onEvent(payload)};
K.status=()=>({version:4,frame:K.frame,fps:Math.round(K.fps),dt:K.dt,errors:K.errors,engine:!!V.engine,world:!!V.world,life:!!V.life,characters:!!V.v4Characters,story:!!V.story});
migrate();
if(V.engine){K.register('engine',V.engine);K.ready=true}
})();