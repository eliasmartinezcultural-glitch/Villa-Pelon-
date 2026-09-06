/* Villa Pelón V84.0 — auditoría profunda de integración.
   Objetivo: eliminar conflictos entre autoridades existentes sin reemplazar el motor.
   Corrige input móvil, foco, pausa, NPC visibles/interactuables y persistencia canónica.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),S=V.gameState;
const MOVE={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'};
const KEYSET=new Set(Object.values(MOVE).map(x=>x.toLowerCase()).concat(['w','a','s','d']));
const SAVE_KEY='villa-pelon-save-v74';
let safe=null;
const $=id=>document.getElementById(id);
function dispatch(type,key){try{window.dispatchEvent(new KeyboardEvent(type,{key,code:key,bubbles:true,cancelable:true}))}catch(_) {}}
function releaseInput(){Object.values(MOVE).forEach(k=>dispatch('keyup',k));['w','a','s','d'].forEach(k=>dispatch('keyup',k));document.querySelectorAll('[data-key]').forEach(b=>b.classList.remove('pressed'));const i=V.spatialInteriors78?.input;if(i)Object.keys(i).forEach(k=>i[k]=false)}
function menuOpen(){const m=$('vpMenu');return !!m&&!m.classList.contains('hidden')}
function dialogueVisible(){const d=$('dialogue');return !!d&&!d.classList.contains('hidden')}
function guardKeys(){
 window.addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  if(['escape','m','p'].includes(k)){e.preventDefault();e.stopImmediatePropagation();return}
  if(KEYSET.has(k)&&menuOpen()){e.preventDefault();e.stopImmediatePropagation()}
 },{capture:true});
 window.addEventListener('blur',releaseInput,{capture:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseInput()},{capture:true});
}
function unifyTouch(){
 document.querySelectorAll('[data-key]').forEach(b=>{
  if(b.dataset.v84Input)return;b.dataset.v84Input='1';
  const down=e=>{e.preventDefault();e.stopImmediatePropagation();const k=MOVE[b.dataset.key];if(!k)return;b.classList.add('pressed');try{b.setPointerCapture(e.pointerId)}catch(_){}dispatch('keydown',k)};
  const up=e=>{e.preventDefault();e.stopImmediatePropagation();b.classList.remove('pressed');const k=MOVE[b.dataset.key];if(k)dispatch('keyup',k)};
  b.addEventListener('pointerdown',down,{capture:true,passive:false});
  ['pointerup','pointercancel','pointerleave','lostpointercapture'].forEach(t=>b.addEventListener(t,up,{capture:true,passive:false}));
 });
}
function syncVisibleNpcs(){
 if(!Array.isArray(V.npcs)||!Array.isArray(V.life?.ambient))return;
 const by=new Map(V.life.ambient.map(n=>[n.name,n]));
 V.npcs.forEach(n=>{const live=by.get(n.name);if(!live)return;n.x=live.x;n.y=live.y;n.moving=!!live.moving;n.direction=live.direction||n.direction||'down';n.walk=live.walk||0;n.activity=live.activity||n.activity||'';n.activityPlace77=live.activityPlace77||n.activityPlace77||null;n.scheduleState77=live.scheduleState77||n.scheduleState77||null});
}
function collisionSafety(){
 const g=V.gameState,n=V.navigation74?.blocked;if(!g||typeof n!=='function')return;
 if(Number.isFinite(g.x)&&Number.isFinite(g.y)&&!n(g.x,g.y,18)){safe=[g.x,g.y]}
 else if(safe){g.x=safe[0];g.y=safe[1]}
}
function missionSnapshot(){const r=V.missionRuntime||V.missions;return r?.snapshot?.()||null}
function missionRestore(s){const r=V.missionRuntime||V.missions;if(r&&s&&typeof r.init==='function'){try{r.init(s)}catch(e){console.warn('[V84] mission restore',e)}}}
function wrapPersistence(){
 const p=V.persistence72;if(!p||p.__v84Wrapped)return;p.__v84Wrapped=true;
 const originalSave=p.save,originalLoad=p.load;
 p.save=function(){const ok=originalSave.call(this);if(ok){try{const raw=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');raw.missions=missionSnapshot();raw.schema=2;localStorage.setItem(SAVE_KEY,JSON.stringify(raw))}catch(e){console.warn('[V84] canonical save extension',e)}}return ok};
 p.load=function(){const ok=originalLoad.call(this);if(ok){try{const raw=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');missionRestore(raw?.missions)}catch(e){console.warn('[V84] canonical load extension',e)}}return ok};
}
function protectLegacyStart(){
 const b=$('startBtn');if(!b||b.dataset.v84Start)return;b.dataset.v84Start='1';
 b.addEventListener('click',()=>{setTimeout(()=>{if(V.persistence72?.load)V.persistence72.load()},0)},{capture:false});
}
function protectMenu(){
 const ui=V.ui;if(!ui||ui.__v84Wrapped)return;ui.__v84Wrapped=true;
 const open=ui.openMenu,close=ui.closeMenu;
 ui.openMenu=function(){if(S){S._dialogueBeforeMenu=dialogueVisible();S._menuPaused=true}return open.apply(this,arguments)};
 ui.closeMenu=function(){const was=!!S&&!!S._dialogueBeforeMenu;const r=close.apply(this,arguments);if(S){S._menuPaused=false;S._dialogueBeforeMenu=false;if(was){S.dialogue=true;$('dialogue')?.classList.remove('hidden')}}return r};
}
function audit(){
 wrapPersistence();protectLegacyStart();protectMenu();syncVisibleNpcs();collisionSafety();
 if(S&&!Array.isArray(S.inventory))S.inventory=[];
 if(S){S.energy=Math.max(0,Math.min(100,Number(S.energy)||100));S.money=Number.isFinite(Number(S.money))?Number(S.money):10000}
}
function boot(){guardKeys();unifyTouch();audit();V.deepAudit84={version:'84.0.0',releaseInput,collisionSafety,syncVisibleNpcs,audit};setInterval(audit,1000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
