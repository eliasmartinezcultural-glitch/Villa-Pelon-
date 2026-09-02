/* Villa Pelón V6.38 — MOVIMIENTO VISUAL COMPATIBLE
   El núcleo V6.37 es la única autoridad de movimiento del jugador.
   Este módulo SOLO aporta estado visual de marcha y actividad a NPCs/animales.
   No reemplaza V.engine.update, no crea RAF, timers ni otro input.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const M=V.v6Motion=V.v6Motion||{};
M.version=3;M.enabled=true;M.updatePatched=false;
const state=()=>V.state||{};
function enrichPlayer(dt){
 const s=state();
 s.motion=s.motion||{phase:0,speed:0,facing:'down',step:0};
 s.motion.speed=Number(s.speed)||235;
 s.motion.facing=s.facing||'down';
 s.motion.phase+=Number(dt||0)*(s.moving?8:1.4);
 s.motion.step=s.moving?Math.sin(s.motion.phase):0;
 s.walkPhase=s.motion.phase;
}
function enrichLife(dt,minutes){
 const life=V.life;if(!life)return;
 const hour=((Number(minutes)||480)/60)%24;
 for(const n of (life.ambient||[])){
   n.v6=n.v6||{phase:(n.appearanceSeed||0)*.1,activity:'esperando'};
   const a=n.v6;a.phase+=Number(dt||0)*2;a.activity=n.moving?(hour>=18?'volviendo':'caminando'):'esperando';n.action=a.activity;n.step=n.moving?Math.sin(a.phase):0;
 }
 for(const n of (life.workers||[])){
   n.v6=n.v6||{phase:(n.appearanceSeed||0)*.1};n.v6.phase+=Number(dt||0)*2.4;
   n.action=hour<8?'preparando':hour<12?'trabajando':hour<14?'descansando':hour<18?'trabajando':'regresando';n.step=Math.sin(n.v6.phase);
 }
 for(const a of (life.animals||[])){
   a.v6=a.v6||{phase:(a.x+a.y)*.01};a.v6.phase+=Number(dt||0)*(a.type==='gallina'?4:2);a.step=Math.sin(a.v6.phase);
 }
}
function bind(){
 const life=V.life;if(!life||M.lifePatched)return;
 if(typeof life.update==='function'){
   const original=life.update;
   life.update=function(dt,minutes){const r=original.call(this,dt,minutes);enrichPlayer(dt);enrichLife(dt,minutes);return r};
   M.lifePatched=true;
 }
}
bind();
M.ready=!!V.engineReady;
M.features=['player-animation-data','direction','step-phase','npc-velocity-read','ambient-activity','animal-animation','single-movement-authority'];
})();
