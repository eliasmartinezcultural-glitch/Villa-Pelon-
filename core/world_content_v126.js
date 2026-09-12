/* VILLA PELÓN V126 — CONTENT FLOOR
   Contenido derivado sobre la geografía canónica.
   REGLA ABSOLUTA: este archivo jamás escribe en V.worldGeometry.
   Mapa = suelo bloqueado. Contenido = capa derivada, auditable y descartable.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const G=V.worldGeometry||{};
const WORLD={x:0,y:0,w:8200,h:4200};
const zones=Array.isArray(G.zones)?G.zones:[];
const roads=Array.isArray(G.roads)?G.roads:[];
const river=G.river||null;
const bridges=Array.isArray(G.bridges)?G.bridges:[];
const buildings=Array.isArray(G.buildings)?G.buildings:[];

const rules={
 version:'V126_CONTENT_CONTRACT',
 geometryReadOnly:true,
 hierarchy:['MAPA','ZONA','SUBZONA','ESTRUCTURA','ELEMENTO','COLISION','VIDA','INTERACCION','MISION'],
 sizeOrder:['persona','animal','elemento','vehiculo','casa','institucion'],
 actions:['observe','read','talk','rest','enter','work','trade','research','mission'],
 visualFamilies:['urban','residential','institutional','commercial','rural','productive','historical','natural','infrastructure'],
 placement:'reject-invalid-never-move',
 principle:'content expands; geography does not'
};

// Primera capa: infraestructura cotidiana de bajo riesgo. Las posiciones son referencias
// de contenido, nunca nuevas piezas de geografía.
const candidates=[
{id:'el-plaza-bench-01',zone:'urban_core',subzone:'plaza',type:'bench',family:'urban',x:1120,y:1375,w:42,h:12,orientation:'horizontal',action:'rest',use:'descanso'},
{id:'el-plaza-bench-02',zone:'urban_core',subzone:'plaza',type:'bench',family:'urban',x:1260,y:1410,w:42,h:12,orientation:'horizontal',action:'rest',use:'descanso'},
{id:'el-plaza-lamp-01',zone:'urban_core',subzone:'plaza',type:'lamp',family:'infrastructure',x:1060,y:1310,w:8,h:8,orientation:'north',action:'observe',use:'iluminacion'},
{id:'el-plaza-lamp-02',zone:'urban_core',subzone:'plaza',type:'lamp',family:'infrastructure',x:1350,y:1310,w:8,h:8,orientation:'north',action:'observe',use:'iluminacion'},
{id:'el-town-sign-01',zone:'urban_core',subzone:'access',type:'sign',family:'infrastructure',x:970,y:1110,w:70,h:14,orientation:'east',action:'read',use:'orientacion'},
{id:'el-town-tree-01',zone:'urban_core',subzone:'green',type:'tree',family:'natural',x:1180,y:1280,w:28,h:28,orientation:'vertical',action:'observe',use:'sombra'},
{id:'el-town-tree-02',zone:'urban_core',subzone:'green',type:'tree',family:'natural',x:1310,y:1270,w:28,h:28,orientation:'vertical',action:'observe',use:'sombra'},
{id:'el-rural-fence-01',zone:'transition_rural',subzone:'productive',type:'fence',family:'rural',x:3150,y:950,w:180,h:10,orientation:'horizontal',action:'observe',use:'limite_productivo'},
{id:'el-rural-gate-01',zone:'transition_rural',subzone:'productive',type:'gate',family:'rural',x:3325,y:950,w:18,h:38,orientation:'vertical',action:'observe',use:'acceso_predio'},
{id:'el-rural-trough-01',zone:'transition_rural',subzone:'productive',type:'trough',family:'productive',x:3600,y:1120,w:55,h:18,orientation:'horizontal',action:'observe',use:'agua_animal'},
{id:'el-rural-worktable-01',zone:'transition_rural',subzone:'productive',type:'worktable',family:'productive',x:4050,y:1260,w:48,h:24,orientation:'horizontal',action:'work',use:'trabajo_rural'},
{id:'el-rural-tool-01',zone:'transition_rural',subzone:'productive',type:'toolrack',family:'productive',x:4120,y:1260,w:24,h:36,orientation:'vertical',action:'observe',use:'herramientas'},
{id:'el-rural-sign-01',zone:'transition_rural',subzone:'routes',type:'sign',family:'infrastructure',x:4650,y:1500,w:88,h:14,orientation:'east',action:'read',use:'orientacion'},
{id:'el-rural-post-01',zone:'transition_rural',subzone:'routes',type:'post',family:'rural',x:4800,y:1530,w:8,h:28,orientation:'vertical',action:'observe',use:'referencia'},
{id:'el-rural-busstop-01',zone:'transition_rural',subzone:'routes',type:'bus_stop',family:'infrastructure',x:5200,y:1700,w:58,h:24,orientation:'horizontal',action:'observe',use:'parada'},
{id:'el-river-sign-01',zone:'river_buffer',subzone:'approach',type:'sign',family:'infrastructure',x:5050,y:2590,w:105,h:14,orientation:'east',action:'read',use:'orientacion_rio'},
{id:'el-river-rest-01',zone:'river_buffer',subzone:'approach',type:'bench',family:'natural',x:5350,y:2560,w:42,h:12,orientation:'horizontal',action:'rest',use:'mirador'},
{id:'el-river-marker-01',zone:'river_buffer',subzone:'approach',type:'post',family:'historical',x:5650,y:2580,w:8,h:32,orientation:'vertical',action:'read',use:'referencia_territorial'},
{id:'el-picada-sign-01',zone:'picada21',subzone:'arrival',type:'sign',family:'infrastructure',x:7420,y:2860,w:110,h:14,orientation:'east',action:'read',use:'orientacion_picada21'},
{id:'el-picada-bench-01',zone:'picada21',subzone:'arrival',type:'bench',family:'rural',x:7480,y:3000,w:42,h:12,orientation:'horizontal',action:'rest',use:'descanso'},
{id:'el-picada-post-01',zone:'picada21',subzone:'arrival',type:'post',family:'rural',x:7580,y:2940,w:8,h:32,orientation:'vertical',action:'observe',use:'referencia'},
{id:'el-picada-tree-01',zone:'picada21',subzone:'natural',type:'tree',family:'natural',x:7680,y:3050,w:30,h:30,orientation:'vertical',action:'observe',use:'sombra'},
{id:'el-picada-tree-02',zone:'picada21',subzone:'natural',type:'tree',family:'natural',x:7780,y:3090,w:30,h:30,orientation:'vertical',action:'observe',use:'sombra'}
];

const overlap=(a,b,p=0)=>a&&b&&a.x-p<b.x+b.w+p&&a.x+a.w+p>b.x-p&&a.y-p<b.y+b.h+p&&a.y+a.h+p>b.y-p;
const inside=(a,b)=>a.x>=b.x&&a.y>=b.y&&a.x+a.w<=b.x+b.w&&a.y+a.h<=b.y+b.h;
const pointZone=(o)=>zones.find(z=>inside({x:o.x,y:o.y,w:o.w,h:o.h},z))||null;
const audit={ok:true,accepted:[],rejected:[],geometryUntouched:true,counts:{}};
const accepted=[];
for(const o of candidates){
 const e=[]; const z=pointZone(o);
 if(!z)e.push('outside-canonical-zone');
 else if(o.zone!==z.id)e.push('zone-mismatch');
 if(!inside(o,WORLD))e.push('outside-world');
 if(roads.some(r=>overlap(o,r,5)))e.push('road-conflict');
 if(river&&overlap(o,river,5))e.push('river-conflict');
 if(buildings.some(b=>overlap(o,b,6)))e.push('building-conflict');
 if(o.type!=='tree'&&accepted.some(a=>overlap(o,a,4)))e.push('content-overlap');
 if(o.type==='gate'&&!['rural','productive'].includes(o.family))e.push('gate-family-invalid');
 if(!rules.actions.includes(o.action))e.push('action-invalid');
 if(e.length){audit.rejected.push({id:o.id,errors:e});audit.ok=false;continue}
 accepted.push(Object.freeze({...o,collision:{solid:['bench','lamp','fence','gate','trough','worktable','toolrack','post','bus_stop'].includes(o.type)},access:o.action==='enter'?'enterable':'walk_near',schedule:o.type==='lamp'?'night':'always'}));
}
for(const o of accepted)audit.counts[o.zone]=(audit.counts[o.zone]||0)+1;
audit.accepted=accepted.map(o=>o.id);
audit.totalCandidates=candidates.length;audit.totalAccepted=accepted.length;audit.totalRejected=audit.rejected.length;
V.contentRules=rules;
V.worldContent={version:'V126',structures:accepted,elements:accepted,readOnlyGeometry:true,audit};
V.contentAudit=audit;
window.dispatchEvent(new CustomEvent('villa-pelon-content-ready',{detail:{version:'V126',accepted:accepted.length,rejected:audit.rejected.length,geometryUntouched:true}}));
})();
