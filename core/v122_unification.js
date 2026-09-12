/* VILLA PELÓN V122 — UNIFICACIÓN Y CIRUGÍA DEL MUNDO
   Una sola geometría, una sola UI de juego, un solo compositor.
   Este archivo se carga DESPUÉS de las capas históricas y corrige sus restos.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const G=V.worldGeometry||{};
const overlap=(a,b,p=0)=>a.x-p<b.x+b.w+p&&a.x+a.w+p>b.x-p&&a.y-p<b.y+b.h+p&&a.y+a.h+p>b.y-p;

/* 1. Autoridad: V120 es la única distribución. Ninguna expansión anterior vuelve a insertar geometría. */
G.version='V122';
G.buildings=Array.isArray(G.buildings)?G.buildings.filter(b=>b&&Number.isFinite(+b.x)&&Number.isFinite(+b.y)&&Number.isFinite(+b.w)&&Number.isFinite(+b.h)):[];
G.roads=Array.isArray(G.roads)?G.roads.filter(r=>r&&Number.isFinite(+r.x)&&Number.isFinite(+r.y)&&Number.isFinite(+r.w)&&Number.isFinite(+r.h)):[];
G.bridges=Array.isArray(G.bridges)?G.bridges:[];
G.river=G.river||{x:300,y:2350,w:7500,h:90,label:'RÍO',crossing:'bridge_only'};

/* Elimina edificios duplicados de generaciones anteriores por id o posición. */
const seen=new Set(),seenGeom=new Set();
G.buildings=G.buildings.filter(b=>{const id=String(b.id||b.label||'');const k=[Math.round(b.x),Math.round(b.y),Math.round(b.w),Math.round(b.h)].join(':');if(seen.has(id)||seenGeom.has(k))return false;seen.add(id);seenGeom.add(k);return true});

/* 2. Auditoría estricta: edificios jamás pueden ocupar camino/río/otro edificio. */
const errors=[];
for(const b of G.buildings){for(const r of G.roads){if(overlap(b,r,18))errors.push({type:'building-road',a:b.id,b:r.id})}if(overlap(b,G.river,18))errors.push({type:'building-river',a:b.id,b:'river'})}
for(let i=0;i<G.buildings.length;i++)for(let j=i+1;j<G.buildings.length;j++)if(overlap(G.buildings[i],G.buildings[j],18))errors.push({type:'building-building',a:G.buildings[i].id,b:G.buildings[j].id});
for(let i=0;i<G.bridges.length;i++)for(let j=i+1;j<G.bridges.length;j++)if(overlap(G.bridges[i],G.bridges[j],4))errors.push({type:'bridge-bridge',a:G.bridges[i].id,b:G.bridges[j].id});
G.geometryContract=Object.assign(G.geometryContract||{},{version:'V122',audit:errors,strict:true});
V.worldAudit={version:'V122',ok:errors.length===0,errors,count:errors.length};
V.worldMaster={version:'V122',locked:true,authority:'core/v122_unification.js'};

/* 3. Mata rutas/objetos de Picada 21 heredados que no pertenecen a la geometría V120. */
G.routes=Array.isArray(G.routes)?G.routes.filter(r=>r?.id!=='picada21_route'):[];
G.points=Array.isArray(G.points)?G.points.filter(p=>!['picada21_stop','picada21_area','picada21_sign','picada21_checkpoint'].includes(p?.id)):[];
G.fences=Array.isArray(G.fences)?G.fences.filter(f=>f&&f.y>=3400):[];
G.crops=Array.isArray(G.crops)?G.crops.filter(c=>c&&c.y>=3400):[];
G.utilityPoles=Array.isArray(G.utilityPoles)?G.utilityPoles.filter(p=>p&&p.y>=3400):[];

/* 4. Desactiva capas decorativas antiguas que podían dibujar una segunda realidad. */
V.legacyWorldExpansion={disabled:true,reason:'V122 single geometry'};
V.legacyArchitecture={disabled:true,reason:'V122 single compositor'};

/* 5. UI: exactamente un menú/mapa/mochila. Si una versión anterior creó duplicados, los consolida. */
function unifyUI(){
 const game=document.getElementById('game');if(!game)return;
 const top=[...document.querySelectorAll('#vpTopActions')];top.slice(1).forEach(e=>e.remove());
 const panels=[...document.querySelectorAll('#vpPanel')];panels.slice(1).forEach(e=>e.remove());
 const starts=[...document.querySelectorAll('#start,.start-screen,.menu-screen,.main-menu')];
 /* El menú de juego es vpTopActions. Pantallas antiguas de menú sólo pueden existir antes de iniciar. */
 if(V.gameState?.started){starts.forEach(e=>{if(e.id!=='start')e.style.display='none'});const s=document.getElementById('start');if(s)s.classList.add('hidden')}
 const oldButtons=[...game.querySelectorAll('button')].filter(b=>/MENÚ|MENU/i.test(b.textContent||'')&&!b.closest('#vpTopActions'));
 oldButtons.forEach(b=>{b.dataset.v122Legacy='1';b.style.display='none'});
}
function scrubContent(){
 const banned=['San Patricio del Chañar','San Patricio del Chanar','San Patricio'];
 const root=document.body;if(!root)return;
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(w.nextNode())nodes.push(w.currentNode);
 nodes.forEach(n=>{let t=n.nodeValue||'';banned.forEach(x=>t=t.split(x).join('Villa Pelón'));if(t!==n.nodeValue)n.nodeValue=t});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',unifyUI,{once:true});else unifyUI();
setTimeout(()=>{unifyUI();scrubContent()},0);setTimeout(()=>{unifyUI();scrubContent()},500);

/* 6. Rendimiento: no permitimos RAFs visuales adicionales ni canvas ambient activo. */
const ambient=document.getElementById('worldAmbient');if(ambient){ambient.style.display='none';ambient.width=1;ambient.height=1}
const detail=document.getElementById('worldDetail');if(detail){detail.style.pointerEvents='none'}
V.performanceContract={version:'V122',maxVisualCanvases:2,ambientCanvasDisabled:true,singleTerrainRenderer:true,singleBuildingRenderer:true};

/* 7. Navegación: el jugador puede atravesar sólo el río por puentes; Picada 21 queda conectada por el corredor V120. */
V.navigationContract={version:'V122',riverCrossing:'bridge_only',picada21:true,roadsWalkable:true,buildingsSolid:true,worldSize:[8200,4200]};
window.dispatchEvent(new CustomEvent('villa-pelon-v122-unified',{detail:{audit:V.worldAudit,ui:'single',river:'single',picada21:true}}));
})();
