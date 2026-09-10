/* VILLA PELÓN — INTEGRATION 93.3
   Puente único entre motor, territorio, guardado y VERGEL.
   Esta capa sólo consume E/ESPACIO o interacción táctil cuando el jugador
   está realmente dentro de una zona VERGEL y el recurso puede cosecharse.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const G=V.worldGeometry||(V.worldGeometry={});
const M=V.worldManifest||(V.worldManifest={});
const S=()=>V.gameState||(V.gameState={});
const WORLD={w:8200,h:4200,version:'93.3'};
V.world=Object.assign(V.world||{},WORLD);
M.worldSize={w:WORLD.w,h:WORLD.h};
M.version='93.3';
G.version='93.3';
G.buildings=Array.isArray(G.buildings)?G.buildings:[];
G.bridges=Array.isArray(G.bridges)?G.bridges:[];
G.roads=Array.isArray(G.roads)?G.roads:[];
G.routes=Array.isArray(G.routes)?G.routes:[];
G.points=Array.isArray(G.points)?G.points:[];
function ensurePoint(id,fallback){
  let p=G.points.find(x=>x&&x.id===id);
  if(!p){p={id,...fallback};G.points.push(p)}
  return p;
}
function ensureTerritoryPoints(){
  ensurePoint('picada21_sign',{x:7500,y:2200,label:'PICA. 21 →',type:'road_sign'});
  ensurePoint('picada21_stop',{x:7550,y:2350,label:'PARADA PICADA 21',type:'bus_stop'});
  ensurePoint('picada21_area',{x:7550,y:2250,label:'PICADA 21',type:'mission_area'});
  ensurePoint('picada21_checkpoint',{x:6500,y:2185,label:'Cruce rural',type:'landmark'});
  G.clue=G.clue||{x:2040,y:430};
  G.jobSpot=G.jobSpot||{x:2200,y:700};
  if(!G.routes.some(r=>r?.id==='picada21_route'))G.routes.push({id:'picada21_route',points:[{x:4700,y:2185},{x:5600,y:2185},{x:6500,y:2185},{x:7500,y:2250}]});
}
ensureTerritoryPoints();
M.picada21=Object.assign({},M.picada21||{}, {x:6750,y:2050,w:1450,h:1100,route:'picada21_route',stop:'picada21_stop'});
G.integrity={version:'93.3',worldSize:{w:WORLD.w,h:WORLD.h},picada21:{stop:{x:7550,y:2350},route:'picada21_route'},checkedAt:Date.now()};
V.worldApi=V.worldApi||{};
V.worldApi.version='93.3';
V.worldApi.getPlayer=()=>{const s=S();return{x:+s.x||0,y:+s.y||0,day:+s.day||1,energy:+s.energy||0}};
V.worldApi.save=()=>{const s=S();try{localStorage.setItem('villa_pelon_save',JSON.stringify({...s,dialogue:false,savedAt:Date.now()}));s.saved=true;return true}catch(_){return false}};
V.saveGame=V.worldApi.save;
function toast(text){const e=document.getElementById('missionToast');if(!e)return;e.textContent=text;e.classList.add('show');clearTimeout(V.worldApi._toast);V.worldApi._toast=setTimeout(()=>e.classList.remove('show'),1800)}
function harvestIfAvailable(e){
  const s=S();
  if(s.dialogue||!V.vergel?.inspect||!V.vergel?.harvest)return false;
  const info=V.vergel.inspect();
  if(!info?.ok)return false;
  const r=V.vergel.harvest();
  if(!r.ok){
    if(r.reason==='energia')toast('VERGEL · NECESITÁS MÁS ENERGÍA');
    else if(r.reason==='agotado')toast('VERGEL · RECURSO AGOTADO');
    return false;
  }
  e?.preventDefault();
  e?.stopPropagation();
  toast('VERGEL · '+r.label+' +1');
  window.dispatchEvent(new CustomEvent('villa-pelon-vergel',{detail:r}));
  return true;
}
/* Capture sólo se usa para ganar prioridad cuando VERGEL confirma interacción.
   Si no hay cosecha válida, el motor conserva íntegramente su interacción normal. */
window.addEventListener('keydown',e=>{
  if(e.repeat)return;
  const k=e.key.toLowerCase();
  if(k==='e'||e.key===' '){harvestIfAvailable(e)}
},true);
document.addEventListener('pointerup',e=>{
  if(e.target?.id==='interact')harvestIfAvailable(e);
},true);
window.addEventListener('villa-pelon-engine-ready',()=>{
  ensureTerritoryPoints();
  G.integrity.checkedAt=Date.now();
  if(V.engine?.setState)V.engine.setState('running');
  window.dispatchEvent(new CustomEvent('villa-pelon-world-ready',{detail:G.integrity}));
});
window.addEventListener('beforeunload',()=>{if(S().started)V.saveGame?.()});
})();
