/* VILLA PELÓN — CANONICAL MAP LOCK / INTEGRITY
   NO CREA OTRA GEOMETRÍA. La única geometría válida ya fue definida por v120_world_rebuild.js.
   Este archivo solamente valida, bloquea restos heredados y consolida la UI.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const G=V.worldGeometry||{};
const overlap=(a,b,p=0)=>a&&b&&a.x-p<b.x+b.w+p&&a.x+a.w+p>b.x-p&&a.y-p<b.y+b.h+p&&a.y+a.h+p>b.y-p;
G.version='CANONICAL_MAP_1';
G.buildings=Array.isArray(G.buildings)?G.buildings.filter(b=>b&&[b.x,b.y,b.w,b.h].every(Number.isFinite)):[];
G.roads=Array.isArray(G.roads)?G.roads.filter(r=>r&&[r.x,r.y,r.w,r.h].every(Number.isFinite)):[];
G.bridges=Array.isArray(G.bridges)?G.bridges.filter(b=>b&&[b.x,b.y,b.w,b.h].every(Number.isFinite)):[];
const river=G.river;const errors=[];
if(!river||river.y!==2700)errors.push({type:'canonical-river-mismatch',expectedY:2700,actualY:river?.y});
const zones=G.zones||[];const zone=id=>zones.find(z=>z.id===id);
if(!zone('urban_core'))errors.push({type:'missing-zone',id:'urban_core'});
if(!zone('picada21'))errors.push({type:'missing-zone',id:'picada21'});
for(const b of G.buildings){for(const r of G.roads)if(overlap(b,r,18))errors.push({type:'building-road',building:b.id,target:r.id});if(overlap(b,river,18))errors.push({type:'building-river',building:b.id,target:'river'})}
for(let i=0;i<G.buildings.length;i++)for(let j=i+1;j<G.buildings.length;j++)if(overlap(G.buildings[i],G.buildings[j],18))errors.push({type:'building-building',a:G.buildings[i].id,b:G.buildings[j].id});
V.worldMaster={version:'CANONICAL_MAP_1',locked:true,authority:'core/v120_world_rebuild.js',integrity:'core/v122_unification.js'};
V.worldAudit={version:'CANONICAL_MAP_1',ok:errors.length===0,errors,count:errors.length};
V.mapLock={locked:true,urban:'compact',rural:'expanded',river:{y:2700,farFromUrban:true,continuous:true,crossing:'bridge_only'},picada21:{y:3180,fartherThanRiver:true,remote:true},rule:'No legacy layer may create, move, or draw buildings, roads, river, bridges, or Picada 21 geometry.'};
if(Array.isArray(G.routes))G.routes=G.routes.filter(r=>r?.id!=='picada21_route');
if(Array.isArray(G.points))G.points=G.points.filter(p=>!['picada21_stop','picada21_area','picada21_sign','picada21_checkpoint'].includes(p?.id));
V.legacyWorldExpansion={disabled:true,reason:'canonical map locked'};V.legacyArchitecture={disabled:true,reason:'canonical compositor only'};
function unifyUI(){const top=[...document.querySelectorAll('#vpTopActions')];top.slice(1).forEach(e=>e.remove());const panels=[...document.querySelectorAll('#vpPanel')];panels.slice(1).forEach(e=>e.remove());const game=document.getElementById('game');if(game)[...game.querySelectorAll('button')].filter(b=>/MENÚ|MENU/i.test(b.textContent||'')&&!b.closest('#vpTopActions')).forEach(b=>{b.dataset.canonicalHidden='1';b.style.display='none'});if(V.gameState?.started){document.querySelectorAll('#start,.start-screen,.menu-screen,.main-menu').forEach(e=>e.style.display='none');const s=document.getElementById('start');if(s)s.classList.add('hidden')}}
function scrubContent(){const banned=['San Patricio del Chañar','San Patricio del Chanar','San Patricio'];const root=document.body;if(!root)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];while(w.nextNode())nodes.push(w.currentNode);nodes.forEach(n=>{let t=n.nodeValue||'';banned.forEach(x=>t=t.split(x).join('Villa Pelón'));if(t!==n.nodeValue)n.nodeValue=t})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',unifyUI,{once:true});else unifyUI();setTimeout(()=>{unifyUI();scrubContent()},0);setTimeout(()=>{unifyUI();scrubContent()},500);
const ambient=document.getElementById('worldAmbient');if(ambient){ambient.style.display='none';ambient.width=1;ambient.height=1}const detail=document.getElementById('worldDetail');if(detail)detail.style.pointerEvents='none';
V.performanceContract={version:'CANONICAL_MAP_1',maxVisualCanvases:2,ambientCanvasDisabled:true,singleTerrainRenderer:true,singleBuildingRenderer:true};V.navigationContract={version:'CANONICAL_MAP_1',riverCrossing:'bridge_only',picada21:true,roadsWalkable:true,buildingsSolid:true,worldSize:[8200,4200]};
window.dispatchEvent(new CustomEvent('villa-pelon-map-locked',{detail:{audit:V.worldAudit,map:V.mapLock}}));
})();
