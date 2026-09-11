/* VILLA PELÓN V115 — AUDITORÍA PROFUNDA DE EDIFICIOS
   No mueve edificios automáticamente: primero mide, clasifica y expone conflictos.
   Principio: una construcción debe tener espacio, identidad, acceso y jerarquía visual.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const G=V.worldGeometry||(V.worldGeometry={});
const W=V.world||{w:8200,h:4200};

const n=v=>Number(v);
const rect=o=>{if(!o)return null;const r={x:n(o.x),y:n(o.y),w:n(o.w),h:n(o.h)};return Object.values(r).every(Number.isFinite)&&r.w>0&&r.h>0?r:null};
const hit=(a,b,p=0)=>a&&b&&a.x<b.x+b.w+p&&a.x+a.w>b.x-p&&a.y<b.y+b.h+p&&a.y+a.h>b.y-p;
const center=r=>({x:r.x+r.w/2,y:r.y+r.h/2});
const expanded=r=>({x:r.x-12,y:r.y-18,w:r.w+24,h:r.h+36});

function audit(){
 const buildings=Array.isArray(G.buildings)?G.buildings:[];
 const roads=Array.isArray(G.roads)?G.roads:[];
 const bridges=Array.isArray(G.bridges)?G.bridges:[];
 const river=rect(G.river)||{x:0,y:820,w:W.w,h:22};
 const errors=[],warnings=[];
 const labels=new Map();
 buildings.forEach((b,i)=>{
   const r=rect(b); if(!r){errors.push({kind:'invalid_geometry',index:i,label:b?.label||'SIN NOMBRE'});return;}
   const label=String(b.label||'').trim();
   if(!label)warnings.push({kind:'missing_label',index:i});
   if(labels.has(label))errors.push({kind:'duplicate_label',label,first:labels.get(label),second:i}); else labels.set(label,i);
   if(r.x<0||r.y<0||r.x+r.w>W.w||r.y+r.h>W.h)errors.push({kind:'out_of_world',index:i,label});
   if(r.w<120||r.h<100)warnings.push({kind:'undersized',index:i,label,size:[r.w,r.h]});
   if(r.w>700||r.h>400)warnings.push({kind:'oversized',index:i,label,size:[r.w,r.h]});
   const visual=expanded(r);
   roads.forEach((road,j)=>{const rr=rect(road);if(hit(visual,rr,0))errors.push({kind:'building_visual_road_conflict',index:i,label,road:road.id||j})});
   if(hit(visual,river,0))errors.push({kind:'building_visual_river_conflict',index:i,label});
   const margin=20;
   if(r.x<margin||r.y<margin||r.x+r.w>W.w-margin||r.y+r.h>W.h-margin)warnings.push({kind:'world_edge',index:i,label});
 });
 for(let i=0;i<buildings.length;i++)for(let j=i+1;j<buildings.length;j++){
   const a=rect(buildings[i]),b=rect(buildings[j]); if(!a||!b)continue;
   if(hit(a,b,0))errors.push({kind:'building_building_overlap',a:i,b:j,aLabel:buildings[i].label,bLabel:buildings[j].label});
   else if(hit(expanded(a),b,0)||hit(a,expanded(b),0))warnings.push({kind:'building_visual_clearance_low',a:i,b:j,aLabel:buildings[i].label,bLabel:buildings[j].label});
 }
 const byType={};buildings.forEach(b=>{byType[b.type||'unknown']=(byType[b.type||'unknown']||0)+1});
 return {version:'115.0',ok:errors.length===0,errors,warnings,stats:{buildings:buildings.length,roads:roads.length,bridges:bridges.length,types:byType},principles:['estructura antes que decoración','sin solapamiento físico','margen visual de fachada','acceso legible','identidad por tipo','auditoría reproducible']};
}

function debugMode(){return /(?:[?&])audit=(?:buildings|edificios)(?:&|$)/i.test(location.search)}
function drawAudit(){
 if(!debugMode())return;
 const c=document.getElementById('worldDetail');if(!c)return;const ctx=c.getContext('2d');
 const d=Math.min(devicePixelRatio||1,2),vw=innerWidth,vh=innerHeight;ctx.save();ctx.setTransform(d,0,0,d,0,0);const s=V.gameState||{};const Z=.82;
 const screen=(x,y)=>({x:(x-(+s.x||0))*Z+vw/2,y:(y-(+s.y||0))*Z+vh/2});
 (G.buildings||[]).forEach((b,i)=>{const r=rect(b);if(!r)return;const q=screen(r.x,r.y);const bad=(V.buildingAudit?.errors||[]).some(e=>e.index===i||e.a===i||e.b===i);ctx.strokeStyle=bad?'#d35c52':'#75b56b';ctx.lineWidth=2;ctx.strokeRect(q.x,q.y,r.w*Z,r.h*Z);ctx.fillStyle=bad?'#d35c52':'#75b56b';ctx.font='700 8px monospace';ctx.textAlign='left';ctx.fillText(`${i} ${String(b.label||'').slice(0,20)}`,q.x,q.y-4)});ctx.restore();
}
function run(){V.buildingAudit=audit();drawAudit();window.dispatchEvent(new CustomEvent('villa-pelon-building-audit',{detail:V.buildingAudit}));}
run();
setInterval(run,3000);
V.buildingArchitecture={version:'115.0',audit:()=>{run();return V.buildingAudit},debug:'?audit=buildings',rule:'no automatic movement; conflicts must be resolved intentionally'};
})();