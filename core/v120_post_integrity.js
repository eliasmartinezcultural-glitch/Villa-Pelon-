/* VILLA PELÓN V120 POST-INTEGRITY
   Sincroniza sistemas cargados después del world rebuild y protege el contenido visible.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const G=V.worldGeometry||{};

// Todos los objetivos de misión apuntan a la geometría V120, no a coordenadas históricas obsoletas.
const points={
 dni:{x:1230,y:1320},picada21:{x:7420,y:2925},memory:{x:7420,y:2925},archive:{x:1070,y:560},
 name_marker:{x:1280,y:540},school_archive:{x:555,y:525},irrigation_marker:{x:5050,y:820},pelon_marker:{x:6020,y:1730},
 founding_marker:{x:1060,y:545},irrigation_timeline:{x:5200,y:835},school_archive_2:{x:575,y:555},worker_marker:{x:850,y:1270},
 territory_map:{x:1510,y:1320},source_lab:{x:1590,y:1320},research_question:{x:1680,y:1320},archive_final:{x:1070,y:560}
};
if(V.missionRuntime){V.missionRuntime.points=Object.assign(V.missionRuntime.points||{},points);V.missionRuntime.regions={rural:{x:4200,y:260,w:3700,h:3120},winery:{x:5200,y:260,w:2200,h:1600},plaza:{x:1050,y:610,w:560,h:250},picada21:{x:4750,y:2530,w:3150,h:850}}}

// Tránsito ambiental: los vehículos rurales siguen caminos existentes, nunca pradera aleatoria.
const P=V.peopleVehicles;
if(P?.vehicleData){P.vehicleData.forEach(v=>{if(v.route?.axis==='x'&&v.x>4200){v.route.minX=4200;v.route.maxX=7900;v.route.laneY=1825;v.y=1825}})}
if(P?.ambient){
 const safe=[{x:1280,y:735},{x:1510,y:735},{x:700,y:1220},{x:1120,y:1220},{x:1760,y:1220},{x:2500,y:1220},{x:3300,y:1220},{x:4050,y:735},{x:4300,y:1825},{x:4550,y:1825},{x:5900,y:1825},{x:7200,y:1825}];
 P.ambient.forEach((a,i)=>{if(i<safe.length){a.x=safe[i].x;a.y=safe[i].y;a.moving=true}})
}

// Contrato visual: ningún edificio puede tocar calles, río o a otro edificio.
const overlap=(a,b,p=0)=>a.x-p<b.x+b.w+p&&a.x+a.w+p>b.x-p&&a.y-p<b.y+b.h+p&&a.y+a.h+p>b.y-p;
const errors=[];const forbidden=[...(G.roads||[]),G.river].filter(Boolean);const B=G.buildings||[];
B.forEach(b=>forbidden.forEach(f=>{if(overlap(b,f,18))errors.push(`${b.id}↔${f.id||f.label}`)}));
for(let i=0;i<B.length;i++)for(let j=i+1;j<B.length;j++)if(overlap(B[i],B[j],18))errors.push(`${B[i].id}↔${B[j].id}`);
V.worldAudit={version:'V120',ok:errors.length===0,errors,count:errors.length};
V.engine=V.engine||{};const oldHealth=V.engine.health;V.engine.health=()=>{const base=typeof oldHealth==='function'?oldHealth():{};return Object.assign({},base,{worldVersion:'V120',geometryAudit:V.worldAudit,overlapCount:errors.length,picada21:true,riverRule:'bridge_only'})};

// Il nome real de referencia no forma parte del juego: cualquier texto visible queda saneado.
const banned=['San Patricio del Chañar','San Patricio del Chanar','San Patricio'];
function scrub(root){if(!root)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(w.nextNode())nodes.push(w.currentNode);nodes.forEach(n=>{let t=n.nodeValue||'';banned.forEach(x=>{t=t.split(x).join('Villa Pelón')});if(t!==n.nodeValue)n.nodeValue=t})}
function installScrub(){scrub(document.body);const mo=new MutationObserver(m=>m.forEach(x=>{x.addedNodes.forEach(n=>{if(n.nodeType===3){let t=n.nodeValue||'';banned.forEach(x=>t=t.split(x).join('Villa Pelón'));n.nodeValue=t}else if(n.nodeType===1)scrub(n)})}));mo.observe(document.body,{subtree:true,childList:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installScrub,{once:true});else installScrub();
window.dispatchEvent(new CustomEvent('villa-pelon-v120-integrity',{detail:{ok:errors.length===0,overlaps:errors.length,contentGuard:true}}));
})();
