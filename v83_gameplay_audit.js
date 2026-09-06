/* Villa Pelón V83 — auditoría funcional de gameplay.
   Capa de integración: foco, pausa, input y sincronización de guardado.
   No reemplaza el motor; evita estados cruzados entre sistemas heredados.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.gameState;
const keys=new Set(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d','e',' ']);
function menuOpen(){const m=document.getElementById('vpMenu');return !!m&&!m.classList.contains('hidden')}
function interiorOpen(){return !!V.spatialInteriors78?.inside||!!V.buildings71?.getState?.()}
function dialogueOpen(){const d=document.getElementById('dialogue');return !!d&&!d.classList.contains('hidden')}
function releaseInput(){const i=V.gameInput83||V.input; if(i) Object.keys(i).forEach(k=>i[k]=false); document.querySelectorAll('[data-key]').forEach(b=>b.classList.remove('pressed'))}
function exposeInput(){
  if(V.gameInput83)return;
  const i={up:false,down:false,left:false,right:false};V.gameInput83=i;
  if(S)V.gameStateInput83=i;
}
function syncPersistence(){
  const p=V.persistence72;
  if(!p)return;
  if(typeof p.save==='function')V.saveCanonical83=()=>p.save();
}
function guardKeyboard(){
  window.addEventListener('keydown',e=>{
    const k=e.key.toLowerCase();
    if(!keys.has(k))return;
    if(menuOpen()) {e.preventDefault();e.stopImmediatePropagation();return;}
    if(interiorOpen()) return;
    if(dialogueOpen() && (k===' '||k==='e')) {e.preventDefault();e.stopImmediatePropagation();return;}
  },{capture:true});
  window.addEventListener('keyup',e=>{
    const k=e.key.toLowerCase();
    if(keys.has(k)&&menuOpen()){e.preventDefault();e.stopImmediatePropagation();}
  },{capture:true});
  window.addEventListener('blur',releaseInput,{capture:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseInput()},{capture:true});
}
function wrapUI(){
  const ui=V.ui;if(!ui||ui.__v83Wrapped)return;
  ui.__v83Wrapped=true;
  const save=ui.saveSlot,load=ui.loadSlot,restart=ui.restart;
  ui.saveSlot=function(slot){const ok=save.call(this,slot);if(ok&&V.persistence72?.save)V.persistence72.save();return ok};
  ui.loadSlot=function(slot){const ok=load.call(this,slot);if(ok&&V.persistence72?.save)V.persistence72.save();releaseInput();return ok};
  ui.restart=function(){releaseInput();return restart.call(this)};
}
function audit(){
  exposeInput();syncPersistence();wrapUI();
  if(S){S.energy=Math.max(0,Math.min(100,Number(S.energy)||100));if(!Array.isArray(S.inventory))S.inventory=[];if(!['up','down','left','right'].includes(S.facing))S.facing='down'}
}
function boot(){audit();guardKeyboard();V.gameplayAudit83={version:'83.0.0',menuOpen,interiorOpen,dialogueOpen,releaseInput,audit};setInterval(audit,1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
