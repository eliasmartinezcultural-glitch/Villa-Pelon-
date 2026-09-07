/* VILLA PELÓN V79 — AUDITORÍA Y REPARACIÓN TOTAL */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),s=V.gameState;
if(!s)return;
/* V79 is the authority layer. Legacy mission/UI loops must stop writing state. */
V.__v79Stable=true;
if(!Number.isFinite(s.x)||!Number.isFinite(s.y)) {s.x=960;s.y=650}
if(!Number.isFinite(s.energy))s.energy=100;if(!Number.isFinite(s.money))s.money=10000;if(!Number.isFinite(s.minutes))s.minutes=480;if(!Number.isFinite(s.day)||s.day<1)s.day=1;
s.energy=Math.max(0,Math.min(100,s.energy));
s.inventory=Array.isArray(s.inventory)?s.inventory:[];
s.v74Seen=Array.isArray(s.v74Seen)?s.v74Seen:[];
if(!Number.isFinite(s.v74Quest)||s.v74Quest<0||s.v74Quest>21)s.v74Quest=0;
/* The old historyQuest is retired; it no longer drives gameplay. */
s.historyQuest=21;
/* Dynamic world authority: V72 expands the world after game.js boots. */
const W=V.world||{};W.w=Math.max(8200,Number(W.w)||8200);W.h=Math.max(4200,Number(W.h)||4200);V.world=W;
const G=V.worldGeometry||(V.worldGeometry={});G.buildings=Array.isArray(G.buildings)?G.buildings:[];G.bridges=Array.isArray(G.bridges)?G.bridges:[];
/* Correct the legacy integrity clamp that used the old 3200x2000 world. */
if(V.life&&V.life.__v57Integrity){
  const old=V.life.update;
  if(!V.life.__v79LifeRepair){V.life.update=(dt,minutes)=>{old(dt,minutes);const maxX=W.w-45,maxY=W.h-45;for(const a of [...(V.life.ambient||[]),...(V.life.workers||[]),...(V.life.animals||[])]){a.x=Math.max(45,Math.min(maxX,a.x));a.y=Math.max(120,Math.min(maxY,a.y))}s.x=Math.max(45,Math.min(maxX,s.x));s.y=Math.max(120,Math.min(maxY,s.y))};V.life.__v79LifeRepair=true;}
}
/* One deterministic interaction authority. */
const oldInteract=V.interact;
if(typeof oldInteract==='function'){
 V.interact=function(){
   if(!s.started)return;
   if(s.dialogue){oldInteract();return}
   const t=typeof V.getContextAction==='function'?V.getContextAction():null;
   if(t&&t.kind==='activity'&&typeof V.performActivity==='function'){V.performActivity(t.id);return}
   oldInteract();
 };
}
/* Kill visual prompt duplication from previous V78 instances. */
const prompt=document.getElementById('v78Prompt');if(prompt)prompt.remove();
/* Stable contextual prompt. */
const label=document.createElement('div');label.id='v79Prompt';label.setAttribute('aria-live','polite');label.style.cssText='position:fixed;left:50%;bottom:calc(92px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:80;padding:7px 12px;border:1px solid rgba(216,189,120,.65);background:rgba(20,25,21,.9);color:#f4ead2;font:700 12px/1.2 system-ui,sans-serif;border-radius:7px;pointer-events:none;display:none;max-width:88vw;text-align:center';document.body.appendChild(label);
function promptTick(){if(!s.started||s.dialogue){label.style.display='none';return}const t=typeof V.getContextAction==='function'?V.getContextAction():null;if(!t){label.style.display='none';return}label.textContent=(t.text||'INTERACTUAR')+' · E';label.style.display='block'}
setInterval(promptTick,150);
/* Runtime health and audit. */
V.audit=V.audit||{};V.audit.v79={stableAuthority:true,world:{w:W.w,h:W.h},stateSanitized:true,singleInteraction:true,legacyLoopsRetired:true,riverBridges:G.bridges.length>=4,save:typeof V.saveGame==='function'};
V.runtime&&(V.runtime.audit=V.audit.v79);
})();
