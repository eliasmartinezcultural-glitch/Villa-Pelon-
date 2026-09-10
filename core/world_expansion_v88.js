/* VILLA PELÓN — WORLD EXPANSION V89.2
   Extremo rural conectado orgánicamente con el pueblo.
   Fuente territorial única: 8200 x 4200.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const G=V.worldGeometry||(V.worldGeometry={});
const B=(x,y,w,h,label,type,extra={})=>({x,y,w,h,label,type,...extra});
G.buildings=G.buildings||[];
const additions=[
 B(7350,2920,250,170,'CASA RURAL 01','home',{area:'picada21'}),
 B(7750,3000,250,170,'CASA RURAL 02','home',{area:'picada21'}),
 B(6900,3300,230,160,'CASA RURAL 03','home',{area:'picada21'}),
 B(7480,3260,210,150,'GALPÓN RURAL PICADA 21','rural',{area:'picada21'})
];
const keys=new Set(G.buildings.map(b=>b.label));G.buildings.push(...additions.filter(b=>!keys.has(b.label)));
/* Una sola ruta lógica para Picada 21. La calzada física vive en G.roads;
   esta ruta describe navegación/territorio y no crea otra capa visual. */
G.routes=Array.isArray(G.routes)?G.routes:[];
const route={id:'picada21_route',label:'CAMINO RURAL A PICADA 21',points:[
 {x:4580,y:2120},{x:5400,y:2120},{x:6500,y:2120},{x:7550,y:2120},{x:7900,y:2120}
],width:150,type:'rural_road'};
G.routes=G.routes.filter(r=>r?.id!=='picada21_route');G.routes.push(route);
G.roads=Array.isArray(G.roads)?G.roads:[];
if(!G.roads.some(r=>r.id==='picada21_road'))G.roads.push({id:'picada21_road',x:4580,y:2045,w:3320,h:150,type:'rural',label:'Camino rural a Picada 21'});
G.points=Array.isArray(G.points)?G.points:[];
const points=[
 {id:'picada21_stop',x:7550,y:2350,label:'PARADA PICADA 21',type:'bus_stop',futureMission:'picada_21'},
 {id:'picada21_area',x:7550,y:2250,label:'PICADA 21',type:'mission_area'},
 {id:'picada21_sign',x:7500,y:2200,label:'PICA. 21 →',type:'road_sign'},
 {id:'picada21_checkpoint',x:6500,y:2185,label:'Cruce rural',type:'landmark'}
];
points.forEach(p=>{const i=G.points.findIndex(q=>q?.id===p.id);if(i<0)G.points.push(p);else G.points[i]=Object.assign({},G.points[i],p)});
G.fences=G.fences||[
 {x:6800,y:2870,w:900,h:10},{x:7000,y:3460,w:680,h:10},{x:7600,y:2850,w:10,h:470}
];
G.crops=G.crops||[
 {x:5050,y:2300,w:600,h:260,type:'chacra'},
 {x:6650,y:2880,w:260,h:380,type:'chacra'},
 {x:7150,y:2820,w:420,h:300,type:'chacra'}
];
G.utilityPoles=G.utilityPoles||[
 {x:4750,y:2120},{x:5350,y:2120},{x:6030,y:2120},{x:6500,y:2120},{x:7200,y:2120},{x:7700,y:2120}
];
/* Vehicles belong exclusively to people_vehicles_v91.js; this layer only
   declares territory data, preventing two registries from diverging. */
V.worldManifest=V.worldManifest||{};
V.worldManifest.picada21={x:6750,y:2050,w:1450,h:1100,route:'picada21_route',stop:'picada21_stop'};
V.worldManifest.worldSize={w:8200,h:4200};V.worldManifest.version='89.2';
})();
