/* VILLA PELÓN — INTEGRATION V90.2
   Puente único entre motor, territorio, guardado y futuras capas online.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const G=V.worldGeometry||(V.worldGeometry={});
const M=V.worldManifest||(V.worldManifest={});
const S=()=>V.gameState||(V.gameState={});
const WORLD={w:8200,h:4200,version:'90.2'};
V.world=Object.assign(V.world||{},WORLD);
M.worldSize={w:WORLD.w,h:WORLD.h};M.version='90.2';G.version='90.2';
G.buildings=Array.isArray(G.buildings)?G.buildings:[];G.bridges=Array.isArray(G.bridges)?G.bridges:[];G.roads=Array.isArray(G.roads)?G.roads:[];G.routes=Array.isArray(G.routes)?G.routes:[];G.points=Array.isArray(G.points)?G.points:[];
function point(id,fallback){let p=G.points.find(x=>x&&x.id===id);if(!p){p={id,...fallback};G.points.push(p)}return p}
const picada=M.picada21||{x:6750,y:2800,w:1450,h:1100,route:'picada21_route',stop:'picada21_stop'};
const stop=point('picada21_stop',{x:7900,y:3500,label:'PARADA PICADA 21',type:'bus_stop'});
point('picada21_area',{x:picada.x+picada.w/2,y:picada.y+picada.h/2,label:'PICADA 21',type:'mission_area'});
point('picada21_sign',{x:6030,y:2700,label:'PICA. 21 →',type:'road_sign'});point('picada21_checkpoint',{x:6500,y:2700,label:'Cruce rural',type:'landmark'});
M.picada21=Object.assign({},picada,{stop:'picada21_stop'});
G.integrity={version:'90.2',worldSize:{w:WORLD.w,h:WORLD.h},picada21:{stop:{x:stop.x,y:stop.y},route:M.picada21.route},checkedAt:Date.now()};
V.worldApi=V.worldApi||{};V.worldApi.version='90.2';
V.worldApi.getPlayer=()=>{const s=S();return{x:+s.x||0,y:+s.y||0,day:+s.day||1,energy:+s.energy||0}};
V.worldApi.save=()=>{const s=S();try{localStorage.setItem('villa_pelon_save',JSON.stringify({...s,dialogue:false,savedAt:Date.now()}));s.saved=true;return true}catch(_){return false}};
function toast(text){const e=document.getElementById('missionToast');if(!e)return;e.textContent=text;e.classList.add('show');clearTimeout(V.worldApi._toast);V.worldApi._toast=setTimeout(()=>e.classList.remove('show'),1800)}
function harvestIfAvailable(e){const s=S();if(s.dialogue||!V.vergel?.inspect||!V.vergel?.harvest)return false;const info=V.vergel.inspect();if(!info?.ok)return false;const r=V.vergel.harvest();if(!r.ok){if(r.reason==='energia')toast('VERGEL · NECESITÁS MÁS ENERGÍA');else if(r.reason==='agotado')toast('VERGEL · RECURSO AGOTADO');return false}if(e){e.preventDefault();e.stopImmediatePropagation()}toast('VERGEL · '+r.label+' +1');window.dispatchEvent(new CustomEvent('villa-pelon-vergel',{detail:r}));return true}
window.addEventListener('keydown',e=>{if(e.repeat)return;if(e.key.toLowerCase()==='e'||e.key===' '){harvestIfAvailable(e)}},true);
document.addEventListener('pointerdown',e=>{if(e.target?.id==='interact')harvestIfAvailable(e)},true);
window.addEventListener('villa-pelon-engine-ready',()=>{G.integrity.checkedAt=Date.now();if(V.engine?.setState)V.engine.setState('running');window.dispatchEvent(new CustomEvent('villa-pelon-world-ready',{detail:G.integrity}))});
window.addEventListener('beforeunload',()=>{if(S().started)V.worldApi.save()});
})();
