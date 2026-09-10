/* VILLA PELÓN — STABILITY GATE V95
   Última capa de runtime: normaliza estado, recupera guardados y evita
   que una partida válida quede visualmente bloqueada por una capa de arranque.
   No crea game loops ni reemplaza sistemas de gameplay.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const ST=V.stability=V.stability||{};
ST.version='95.0';
const WORLD={w:8200,h:4200};
function finite(n,f){return Number.isFinite(Number(n))?Number(n):f}
function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
function normalizeState(){
  const S=V.gameState;if(!S)return null;
  S.x=clamp(finite(S.x,1180),45,WORLD.w-45);
  S.y=clamp(finite(S.y,650),105,WORLD.h-45);
  S.money=Math.max(0,finite(S.money,10000));
  S.energy=clamp(finite(S.energy,100),0,100);
  S.minutes=((finite(S.minutes,480)%1440)+1440)%1440;
  S.day=Math.max(1,Math.floor(finite(S.day,1)));
  S.speed=finite(S.speed,205);
  if(!Array.isArray(S.inventory))S.inventory=[];
  if(!Array.isArray(S.missionHistory))S.missionHistory=[];
  if(!S.flags||typeof S.flags!=='object')S.flags={};
  if(!S.missionFlags||typeof S.missionFlags!=='object')S.missionFlags={};
  if(!S.stats||typeof S.stats!=='object')S.stats={steps:0,interactions:0,harvests:0};
  S.stats.steps=Math.max(0,Math.floor(finite(S.stats.steps,0)));
  S.stats.interactions=Math.max(0,Math.floor(finite(S.stats.interactions,0)));
  S.stats.harvests=Math.max(0,Math.floor(finite(S.stats.harvests,0)));
  S.dialogue=false;
  return S;
}
function repairSave(){
  try{
    const raw=localStorage.getItem('villa_pelon_save');if(!raw)return false;
    const save=JSON.parse(raw);if(!save||typeof save!=='object')throw new Error('invalid save');
    const old=V.gameState||{};
    const merged=Object.assign({},old,save,{dialogue:false});
    V.gameState=merged;
    normalizeState();
    localStorage.setItem('villa_pelon_save',JSON.stringify(Object.assign({},V.gameState,{dialogue:false})));
    return true;
  }catch(err){console.warn('[Villa Pelón] save recovery skipped',err);return false}
}
function reconcile(){
  if(!V.gameState)return false;
  normalizeState();
  if(V.missions?.ensure)V.missions.ensure(V.gameState);
  if(V.vergel?.sync)V.vergel.sync();
  const game=document.getElementById('game'),intro=document.getElementById('start'),boot=document.getElementById('bootScreen');
  if(V.gameState.started){
    game?.classList.remove('hidden');intro?.classList.add('hidden');boot?.classList.add('hidden');
  }
  return true;
}
ST.normalize=normalizeState;
ST.reconcile=reconcile;
ST.recoverSave=repairSave;
function ready(){setTimeout(()=>{repairSave();reconcile()},0)}
window.addEventListener('villa-pelon-engine-ready',ready,{once:false});
window.addEventListener('villa-pelon-world-ready',ready,{once:false});
window.addEventListener('villa-pelon-integrity',ready,{once:false});
window.addEventListener('villa-pelon-health',ready,{once:false});
window.addEventListener('pageshow',()=>setTimeout(reconcile,50));
window.addEventListener('error',e=>{ST.lastError={message:e.message||'runtime error',source:e.filename||'',line:e.lineno||0,time:Date.now()};console.error('[Villa Pelón stability]',ST.lastError)});
setTimeout(()=>{repairSave();reconcile()},2200);
})();
