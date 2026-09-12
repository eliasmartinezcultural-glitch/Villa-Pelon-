/* WORLD MASTER AUDIT V1 — validación geométrica antes del motor */
(()=>{'use strict';
const V=window.VillaPelon||{};const G=V.worldGeometry||{};const M=V.worldManifest||{};
const pad=10, issues=[];
const rect=(a,b=0)=>({x:a.x-b,y:a.y-b,w:a.w+2*b,h:a.h+2*b});
const hit=(a,b)=>{const A=rect(a),B=rect(b);return A.x<B.x+B.w&&A.x+A.w>B.x&&A.y<B.y+B.h&&A.y+A.h>B.y};
const inside=(a,W,H)=>a.x>=0&&a.y>=0&&a.x+a.w<=W&&a.y+a.h<=H;
const buildings=G.buildings||[],roads=G.roads||[],river=G.river,bridges=G.bridges||[],zones=G.zones||[];
const W=M.worldSize?.[0]||8200,H=M.worldSize?.[1]||4200;
for(const b of buildings){
 if(!inside(b,W,H))issues.push({type:'building_out_of_world',id:b.id});
 if(river&&hit(b,river))issues.push({type:'building_on_river',id:b.id});
 for(const r of roads)if(hit(b,r))issues.push({type:'building_on_road',id:b.id,road:r.id});
}
for(let i=0;i<buildings.length;i++)for(let j=i+1;j<buildings.length;j++)if(hit(buildings[i],buildings[j]))issues.push({type:'building_overlap',a:buildings[i].id,b:buildings[j].id});
if(river){for(const br of bridges){if(!hit(br,river))issues.push({type:'bridge_misses_river',id:br.id});}}
const picadaRoad=roads.find(r=>r.id==='picada21_road'),picadaZone=M.picada21;
if(!picadaRoad)issues.push({type:'picada21_missing_road'});if(!picadaZone)issues.push({type:'picada21_missing_zone'});
if(picadaRoad&&picadaZone&&!hit(picadaRoad,picadaZone))issues.push({type:'picada21_road_outside_zone'});
const graph=V.routeGraph||{};const nodeIds=new Set((graph.nodes||[]).map(n=>n.id));for(const e of graph.edges||[])if(!nodeIds.has(e[0])||!nodeIds.has(e[1]))issues.push({type:'route_dangling_edge',edge:e});
V.masterAudit={version:'WORLD_MASTER_AUDIT_V1',world:[W,H],buildingCount:buildings.length,roadCount:roads.length,bridgeCount:bridges.length,issueCount:issues.length,ok:issues.length===0,issues};
V.deepAuditRun=()=>V.masterAudit;
window.dispatchEvent(new CustomEvent('villa-pelon-world-master-audit',{detail:V.masterAudit}));
})();
