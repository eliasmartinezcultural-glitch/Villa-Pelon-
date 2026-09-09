/* VILLA PELÓN — BOOT CORE V85
   Autoridad única de arranque. No depende de una intro ni de botones.
   Espera al motor, normaliza el mundo y abre la partida directamente.
*/
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={});
 const B=V.boot=V.boot||{};
 B.version='85.0.0';
 B.started=false;
 const WORLD_W=8200, WORLD_H=4200;
 function normalize(){
   V.world=V.world||{};
   V.world.w=Math.max(WORLD_W,Number(V.world.w)||0);
   V.world.h=Math.max(WORLD_H,Number(V.world.h)||0);
   if(V.gameState){
     const s=V.gameState;
     s.x=Number.isFinite(Number(s.x))?Number(s.x):960;
     s.y=Number.isFinite(Number(s.y))?Number(s.y):650;
     s.x=Math.max(80,Math.min(V.world.w-80,s.x));
     s.y=Math.max(160,Math.min(V.world.h-80,s.y));
     s.dialogue=false;
   }
 }
 function open(){
   const s=V.gameState, intro=document.getElementById('start'), game=document.getElementById('game');
   if(!s||!intro||!game)return false;
   normalize();
   /* Recuperación segura del guardado sin depender de una pantalla previa. */
   try{
     if(typeof V.loadGame==='function')V.loadGame();
     else { const raw=localStorage.getItem('villa_pelon_save'); if(raw){const save=JSON.parse(raw);['x','y','speed','money','energy','minutes','day','quest','inventory','walk','facing'].forEach(k=>{if(k in save)s[k]=save[k]})} }
   }catch(_){}
   normalize();
   s.started=true;s.dialogue=false;
   intro.classList.add('hidden');game.classList.remove('hidden');
   B.started=true;B.mode='direct';
   V.audit=V.audit||{};V.audit.boot=Object.assign({},V.audit.boot,{version:B.version,direct:true,world:[V.world.w,V.world.h],intro:false});
   window.dispatchEvent(new CustomEvent('villa-pelon-started'));
   return true;
 }
 function wait(){
   let attempts=0;
   const timer=setInterval(()=>{
     if(open()){clearInterval(timer);return}
     attempts++;
     if(attempts>=120){clearInterval(timer);B.failed=true;B.reason='gameState no disponible';}
   },100);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
