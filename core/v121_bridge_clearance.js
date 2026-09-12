/* VILLA PELÓN V121 — BRIDGE CLEARANCE PATCH
   Puentes ubicados en corredores libres entre construcciones rurales.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),G=V.worldGeometry;if(!G)return;
G.bridges=[
 {id:'bridge_west',x:5230,y:2315,w:140,h:160,label:'PUENTE OESTE'},
 {id:'bridge_east',x:6350,y:2315,w:140,h:160,label:'PUENTE ESTE'}
];
const roads=G.roads||[];
const rw=roads.find(r=>r.id==='bridge_west_access');if(rw)Object.assign(rw,{x:5230,y:2000,w:140,h:415});
const re=roads.find(r=>r.id==='bridge_east_access');if(re)Object.assign(re,{x:6350,y:2000,w:140,h:415});
if(G.routeNetwork?.nodes){const a=G.routeNetwork.nodes.find(n=>n.id==='bridge_west');if(a)Object.assign(a,{x:5300,y:2395});const b=G.routeNetwork.nodes.find(n=>n.id==='bridge_east');if(b)Object.assign(b,{x:6420,y:2395})}
const overlap=(a,b,p=0)=>a.x-p<b.x+b.w+p&&a.x+a.w+p>b.x-p&&a.y-p<b.y+b.h+p&&a.y+a.h+p>b.y-p;
const errors=[];const forbidden=[...(G.roads||[]),G.river].filter(Boolean);const B=G.buildings||[];B.forEach(b=>forbidden.forEach(f=>{if(f.id==='bridge_west_access'||f.id==='bridge_east_access'){}else if(overlap(b,f,18))errors.push(`${b.id}↔${f.id||f.label}`)}));for(let i=0;i<B.length;i++)for(let j=i+1;j<B.length;j++)if(overlap(B[i],B[j],18))errors.push(`${B[i].id}↔${B[j].id}`);
G.geometryContract=Object.assign(G.geometryContract||{},{bridges:G.bridges,audit:errors});V.worldAudit={version:'V121',ok:errors.length===0,errors,count:errors.length};V.worldMaster=Object.assign(V.worldMaster||{},{version:'V121',locked:true,authority:'core/v121_bridge_clearance.js'});
})();
