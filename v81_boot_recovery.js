/* VILLA PELÓN V81 — ARRANQUE DE EMERGENCIA
   Objetivo: garantizar que ENTRAR AL MUNDO siempre tenga una ruta de arranque,
   incluso si una capa posterior de la intro falla. No reemplaza el motor.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
function boot(){
 const start=document.getElementById('start'),game=document.getElementById('game'),btn=document.getElementById('startBtn');
 const s=V.gameState;
 if(!start||!game||!btn||!s)return false;
 const enter=()=>{
   try{
     let saved=null;try{saved=JSON.parse(localStorage.getItem('villa_pelon_save')||'null')}catch(_){}
     if(saved&&typeof saved==='object')Object.keys(saved).forEach(k=>{if(!['started','dialogue','saved'].includes(k))s[k]=saved[k]});
   }catch(_){}
   s.started=true;s.dialogue=false;s.saved=false;
   start.classList.add('hidden');game.classList.remove('hidden');
   const q=document.getElementById('questText');if(q&&!q.textContent.includes('INTERACTUÁ'))q.textContent='01/21 · Llegar y observar · INTERACTUÁ';
   if(typeof V.saveGame==='function'){};
   if(V.runtime&&typeof V.runtime.setState==='function')V.runtime.setState('running');
   window.dispatchEvent(new CustomEvent('villa-pelon-started'));
 };
 if(!btn.__v81){btn.addEventListener('click',enter,{capture:true});btn.__v81=true}
 V.bootGame=enter;V.__v81BootRecovery=true;
 V.audit=V.audit||{};V.audit.v81={bootRecovery:true,buttonBound:true,gameState:!!s};
 return true;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
