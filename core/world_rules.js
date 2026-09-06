/* Villa Pelón CORE WORLD RULES v1.0 — contrato único del mundo. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const R={version:'1.0.0',mobileFirst:true,linkPlay:true,noInstall:true,freeExploration:true,worldKeepsLiving:true,singleStateAuthority:true,singleInteractionAuthority:true,safeTouchTargets:true,onlineOnlyAssetFree:true,interactionPriority:['npc','door','mission','object','shop','work'],sectors:['pueblo','rural','river']};
function normalize(){const s=V.gameState;if(!s)return;s.x=Number.isFinite(+s.x)?+s.x:960;s.y=Number.isFinite(+s.y)?+s.y:650;s.energy=Math.max(0,Math.min(100,Number.isFinite(+s.energy)?+s.energy:100));s.money=Number.isFinite(+s.money)?+s.money:10000;s.minutes=Math.max(0,Number.isFinite(+s.minutes)?+s.minutes:480);s.day=Math.max(1,Number.isFinite(+s.day)?+s.day:1);s.inventory=Array.isArray(s.inventory)?s.inventory:[];s.facing=['up','down','left','right'].includes(s.facing)?s.facing:'down';}
V.worldRules=Object.assign(V.worldRules||{},R);V.worldRules.normalize=normalize;
function boot(){normalize();document.documentElement.classList.add('vp-world-rules-ready');window.dispatchEvent(new CustomEvent('villa-pelon-world-rules-ready',{detail:R}));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
