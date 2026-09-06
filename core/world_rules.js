/* Villa Pelón CORE WORLD RULES v1.1 — contrato único del mundo. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const R={version:'1.1.0',mobileFirst:true,linkPlay:true,noInstall:true,freeExploration:true,worldKeepsLiving:true,singleStateAuthority:true,singleInteractionAuthority:true,safeTouchTargets:true,onlineOnlyAssetFree:true,whatsappReady:true,historicalSourceRequired:true,fictionMustBeMarked:true,interactionPriority:['npc','door','mission','object','shop','work'],sectors:['centro','barrio','rural','rio','bodega','meseta','servicios'],territorialRules:['roads_are_circulation_only','no_houses_on_routes','river_is_water_barrier','rural_buildings_stay_rural','fossil_sites_are_research_sites']};
function normalize(){const s=V.gameState;if(!s)return;const w=V.worldAuthority?.geometry||V.worldGeometry||{};s.x=Number.isFinite(+s.x)?+s.x:(w.spawn?.x||520);s.y=Number.isFinite(+s.y)?+s.y:(w.spawn?.y||760);s.energy=Math.max(0,Math.min(100,Number.isFinite(+s.energy)?+s.energy:100));s.money=Number.isFinite(+s.money)?+s.money:10000;s.minutes=Math.max(0,Number.isFinite(+s.minutes)?+s.minutes:480);s.day=Math.max(1,Number.isFinite(+s.day)?+s.day:1);s.inventory=Array.isArray(s.inventory)?s.inventory:[];s.facing=['up','down','left','right'].includes(s.facing)?s.facing:'down';}
V.worldRules=Object.assign(V.worldRules||{},R);V.worldRules.normalize=normalize;V.worldRules.geometryAuthority=()=>V.worldAuthority?.geometry||V.worldGeometry||null;
function boot(){normalize();document.documentElement.classList.add('vp-world-rules-ready');window.dispatchEvent(new CustomEvent('villa-pelon-world-rules-ready',{detail:R}));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
