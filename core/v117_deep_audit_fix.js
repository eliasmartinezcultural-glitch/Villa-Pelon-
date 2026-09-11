/* VILLA PELÓN V117 — AUDITORÍA PROFUNDA + REPARACIÓN ESTRUCTURAL
   Corrige inconsistencias entre geometría, colisiones, navegación y capas visuales.
   Principio: una fuente territorial, un río, un compositor visual y diagnósticos reproducibles.
*/
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={});
 const G=V.worldGeometry||(V.worldGeometry={});
 const W=V.world||{w:8200,h:4200};
 const river={x:0,y:820,w:8200,h:22};
 // Corrección crítica: el motor tenía un fallback en y=3070 mientras puentes y contrato estaban en y=820.
 // Desde V117 la geometría compartida gana siempre.
 G.river=river;
 G.worldRules=G.worldRules||{};
 G.worldRules.version='117.0';
 G.worldRules.water=Object.assign({},G.worldRules.water,{riverCrossing:'bridge_only',bridgeTolerance:22,shoreBuffer:20});
 G.worldRules.buildings=Object.assign({},G.worldRules.buildings,{neverOccupyRoads:true,neverOccupyRiver:true,collisionPadding:18});
 G.geometryContract=Object.assign({},G.geometryContract,{river:{x:0,y:820,width:8200,height:22,crossing:'bridge_only'},noBuildingOnRoads:true,noBuildingInRiver:true});
 V.worldManifest=Object.assign({},V.worldManifest||{},{version:'117.0',river});

 // V116 era un segundo render loop sobre worldDetail. Eso podía competir con el compositor oficial.
 // Se conserva su API para compatibilidad, pero se desactiva su render activo.
 V.architecturePass=Object.assign({},V.architecturePass||{},{version:'117.0',renderOwner:'render_compositor_v93',geometryMutation:false,disabledLegacySecondLoop:true});

 function rect(o){if(!o)return null;const r={x:+o.x,y:+o.y,w:+o.w,h:+o.h};return Object.values(r).every(Number.isFinite)&&r.w>0&&r.h>0?r:null}
 function overlap(a,b,p=0){return a.x<b.x+b.w+p&&a.x+a.w>b.x-p&&a.y<b.y+b.h+p&&a.y+a.h>b.y-p}
 function audit(){
  const buildings=Array.isArray(G.buildings)?G.buildings:[],roads=Array.isArray(G.roads)?G.roads:[],bridges=Array.isArray(G.bridges)?G.bridges:[];
  const errors=[],warnings=[];
  buildings.forEach((b,i)=>{
   const r=rect(b);if(!r){errors.push({type:'invalid_building',i});return}
   if(r.x<0||r.y<0||r.x+r.w>W.w||r.y+r.h>W.h)errors.push({type:'building_out_of_world',i,label:b.label});
   roads.forEach((road,j)=>{const rr=rect(road);if(rr&&overlap(r,rr,0))errors.push({type:'building_on_road',i,label:b.label,road:road.id||j})});
   if(overlap(r,river,0))errors.push({type:'building_in_river',i,label:b.label});
  });
  for(let i=0;i<buildings.length;i++)for(let j=i+1;j<buildings.length;j++){const a=rect(buildings[i]),b=rect(buildings[j]);if(a&&b&&overlap(a,b,0))errors.push({type:'building_overlap',a:i,b:j,aLabel:buildings[i].label,bLabel:buildings[j].label})}
  bridges.forEach((b,i)=>{const r=rect(b);if(!r)return;if(r.y>b.y+1000)warnings.push({type:'bridge_far_from_river',i})});
  return {version:'117.0',ok:errors.length===0,errors,warnings,stats:{buildings:buildings.length,roads:roads.length,bridges:bridges.length,river},rules:['river canonical at y=820','bridges are only river crossings','buildings cannot occupy roads','buildings cannot occupy river','single visual compositor']};
 }
 V.deepAudit=audit();
 V.deepAuditRun=()=>{V.deepAudit=audit();window.dispatchEvent(new CustomEvent('villa-pelon-deep-audit',{detail:V.deepAudit}));return V.deepAudit};

 // Debug overlay: ?audit=deep. It does not alter the game.
 if(/[?&]audit=deep(?:&|$)/i.test(location.search)){
  const c=document.getElementById('worldDetail');
  if(c){const ctx=c.getContext('2d');let raf=0;const draw=()=>{const d=Math.min(devicePixelRatio||1,2),vw=innerWidth,vh=innerHeight,s=V.gameState||{};ctx.save();ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,vw,vh);const Z=.82,screen=(x,y)=>({x:(x-(+s.x||0))*Z+vw/2,y:(y-(+s.y||0))*Z+vh/2});(G.buildings||[]).forEach((b,i)=>{const r=rect(b);if(!r)return;const q=screen(r.x,r.y),bad=V.deepAudit.errors.some(e=>e.i===i||e.a===i||e.b===i);ctx.strokeStyle=bad?'#d35c52':'#75b56b';ctx.lineWidth=2;ctx.strokeRect(q.x,q.y,r.w*Z,r.h*Z);ctx.fillStyle=bad?'#d35c52':'#75b56b';ctx.font='700 8px monospace';ctx.fillText(`${i} ${String(b.label||'').slice(0,18)}`,q.x,q.y-4)});ctx.restore();raf=requestAnimationFrame(draw)};raf=requestAnimationFrame(draw);V.deepAudit.stopDebug=()=>cancelAnimationFrame(raf)}
 }
 window.dispatchEvent(new CustomEvent('villa-pelon-v117-ready',{detail:V.deepAudit}));
})();
