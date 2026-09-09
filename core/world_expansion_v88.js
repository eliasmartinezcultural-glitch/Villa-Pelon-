(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const G=V.worldGeometry||(V.worldGeometry={});
const B=(x,y,w,h,label,type,extra={})=>({x,y,w,h,label,type,...extra});
G.buildings=G.buildings||[];
const additions=[
 B(7350,2920,250,170,'CASA RURAL 01','home',{area:'picada21'}),
 B(7750,3000,250,170,'CASA RURAL 02','home',{area:'picada21'}),
 B(6900,3300,230,160,'CASA RURAL 03','home',{area:'picada21'})
];
const keys=new Set(G.buildings.map(b=>b.label));
G.buildings.push(...additions.filter(b=>!keys.has(b.label)));
G.routes=G.routes||[];
G.routes.push({id:'picada21_route',label:'CAMINO A PICADA 21',points:[{x:6030,y:2250},{x:6030,y:2700},{x:6500,y:2700},{x:6500,y:3300},{x:7200,y:3300},{x:7200,y:3500},{x:7900,y:3500}]});
G.points=G.points||[];
if(!G.points.some(p=>p.id==='picada21_stop'))G.points.push({id:'picada21_stop',x:7900,y:3500,label:'PARADA PICADA 21',type:'bus_stop',futureMission:'picada_21'});
if(!G.points.some(p=>p.id==='picada21_area'))G.points.push({id:'picada21_area',x:7900,y:3500,label:'PICADA 21',type:'mission_area'});
V.worldManifest=V.worldManifest||{};V.worldManifest.picada21={x:6750,y:2800,w:1450,h:1100,route:'picada21_route',stop:'picada21_stop'};
V.worldManifest.version='88.0';
})();
