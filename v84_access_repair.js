/* VILLA PELÓN V84 — ACCESO DIRECTO Y ARRANQUE ROBUSTO
   Objetivo: eliminar puntos frágiles de la intro y garantizar que el jugador
   llegue al mundo aunque una capa anterior haya reemplazado el botón.
*/
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={});
 const start=()=>{
   const s=V.gameState, intro=document.getElementById('start'), game=document.getElementById('game');
   if(!s||!intro||!game)return false;
   // Autoridad territorial única: el motor trabaja sobre el mundo ampliado.
   if(V.world){V.world.w=Math.max(8200,Number(V.world.w)||0);V.world.h=Math.max(4200,Number(V.world.h)||0)}
   try{
     if(typeof V.loadGame==='function')V.loadGame();
     else if(typeof window.__villaPelonLoad==='function')window.__villaPelonLoad();
   }catch(_){}
   s.started=true;s.dialogue=false;
   intro.classList.add('hidden');game.classList.remove('hidden');
   if(typeof V.gameState==='object'){
     s.x=Number.isFinite(s.x)?s.x:960;s.y=Number.isFinite(s.y)?s.y:650;
     s.x=Math.max(80,Math.min((V.world?.w||8200)-80,s.x));
     s.y=Math.max(160,Math.min((V.world?.h||4200)-80,s.y));
   }
   try{window.dispatchEvent(new CustomEvent('villa-pelon-started'))}catch(_){}
   V.__v84AccessRepair=true;
   V.audit=V.audit||{};V.audit.v84={directAccess:true,autoStart:true,world:'8200x4200',intro:'bypass'};
   return true;
 };
 function boot(){
   let tries=0;
   const tick=()=>{if(start()||++tries>80)return;setTimeout(tick,100)};
   tick();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
