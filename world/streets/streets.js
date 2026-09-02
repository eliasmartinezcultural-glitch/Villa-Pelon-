/* Villa Pelón V6.27 — RED VIAL + GRAMÁTICA URBANA
   Autoridad única de circulación terrestre y de señalización vial.
   La geometría se declara una sola vez; el overlay deriva cruces,
   luminarias y señalización desde esa geometría, sin coordenadas huérfanas.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.streetSystem=V.streetSystem||{};
S.version=6.27;
S.roadWidth=230;S.laneWidth=66;S.sidewalkWidth=28;S.curbWidth=7;
const roads=[
 {id:'avenida_principal',orientation:'horizontal',x:0,y:700,w:5200,h:230,name:'Avenida Principal',kind:'urban',speedLimit:40},
 {id:'calle_central',orientation:'vertical',x:1180,y:0,w:220,h:2700,name:'Calle Central',kind:'urban',speedLimit:30},
 {id:'avenida_este',orientation:'horizontal',x:3950,y:700,w:1250,h:230,name:'Acceso Este',kind:'urban-edge',speedLimit:40},
 {id:'borde_este',orientation:'vertical',x:3950,y:1250,w:230,h:1350,name:'Calle del Borde',kind:'urban-edge',speedLimit:30},
 {id:'corredor_este',orientation:'vertical',x:5000,y:700,w:230,h:2300,name:'Camino Productivo Este',kind:'productive',speedLimit:35},
 {id:'camino_sur',orientation:'horizontal',x:3550,y:2200,w:1900,h:230,name:'Camino de Chacras',kind:'productive',speedLimit:30},
 {id:'camino_rural_norte',orientation:'vertical',x:5900,y:1450,w:230,h:1700,name:'Camino Rural Norte',kind:'rural',speedLimit:30},
 {id:'corredor_rural',orientation:'horizontal',x:6100,y:2700,w:1100,h:230,name:'Corredor Rural',kind:'rural',speedLimit:30},
 {id:'camino_rural_sur',orientation:'horizontal',x:6700,y:3500,w:540,h:230,name:'Camino Rural Sur',kind:'rural',speedLimit:25},
 {id:'camino_servicio_oeste',orientation:'horizontal',x:5200,y:2850,w:900,h:170,name:'Camino de Servicio',kind:'service',speedLimit:20},
 {id:'acceso_servicio',orientation:'vertical',x:5440,y:2700,w:170,h:1100,name:'Acceso de Servicio',kind:'service',speedLimit:20}
];
S.roads=roads;S.roadById=Object.fromEntries(roads.map(r=>[r.id,r]));
S.urbanRoads=roads.filter(r=>r.kind==='urban'||r.kind==='urban-edge');
S.productiveRoads=roads.filter(r=>r.kind==='productive');S.ruralRoads=roads.filter(r=>r.kind==='rural'||r.kind==='service');
S.features={curbs:true,sidewalks:true,crosswalks:true,centerLines:true,laneLines:true,roadWear:true,patches:true,drainage:true,streetSigns:true,lamps:true,utilityPoles:true,trafficLights:true,busStops:true,roadHierarchy:true,productiveAccess:true,ruralShoulders:true};
function contains(r,x,y,pad=0){return x>=r.x-pad&&x<=r.x+r.w+pad&&y>=r.y-pad&&y<=r.y+r.h+pad}
S.onRoad=(x,y)=>roads.some(r=>contains(r,x,y));S.roadAt=(x,y)=>roads.find(r=>contains(r,x,y))||null;
S.onSidewalk=(x,y)=>roads.some(r=>{const o={x:r.x-S.sidewalkWidth,y:r.y-S.sidewalkWidth,w:r.w+S.sidewalkWidth*2,h:r.h+S.sidewalkWidth*2};return contains(o,x,y)&&!contains(r,x,y)});
S.nearestRoad=(x,y)=>{let best=null,bd=Infinity;for(const r of roads){const cx=Math.max(r.x,Math.min(x,r.x+r.w)),cy=Math.max(r.y,Math.min(y,r.y+r.h)),d=Math.hypot(x-cx,y-cy);if(d<bd){bd=d;best=r}}return best};
S.isRuralRoad=(x,y)=>{const r=S.roadAt(x,y);return !!r&&(r.kind==='rural'||r.kind==='service'||r.kind==='productive')};
S.isUrbanRoad=(x,y)=>{const r=S.roadAt(x,y);return !!r&&(r.kind==='urban'||r.kind==='urban-edge')};
S.intersections=[];for(let i=0;i<roads.length;i++)for(let j=i+1;j<roads.length;j++){const a=roads[i],b=roads[j];if(a.orientation===b.orientation)continue;const h=a.orientation==='horizontal'?a:b,v=a.orientation==='vertical'?a:b;const x=v.x+v.w/2,y=h.y+h.h/2;if(x>=h.x&&x<=h.x+h.w&&y>=v.y&&y<=v.y+v.h)S.intersections.push({x,y,a:a.id,b:b.id})}
S.territorialGrammar={regionalAccess:['avenida_principal','avenida_este','corredor_rural','camino_rural_sur'],urbanSpine:['avenida_principal','calle_central'],urbanEdge:['avenida_este','borde_este'],productive:['corredor_este','camino_sur'],rural:['camino_rural_norte','corredor_rural','camino_rural_sur','camino_servicio_oeste','acceso_servicio']};
function crosswalk(c,x,y,w,h){c.fillStyle='rgba(233,223,192,.9)';for(let i=0;i<8;i++)c.fillRect(Math.round(x+i*w/8),Math.round(y),Math.max(6,Math.round(w/16)),Math.round(h))}
function lamp(c,x,y){c.fillStyle='#4d4439';c.fillRect(Math.round(x-2),Math.round(y),4,42);c.beginPath();c.arc(Math.round(x),Math.round(y),6,0,Math.PI*2);c.fill();c.fillStyle='#e9d79d';c.beginPath();c.arc(Math.round(x),Math.round(y-4),4,0,Math.PI*2);c.fill()}
function sign(c,x,y,text){c.fillStyle='#5a4a39';c.fillRect(Math.round(x-2),Math.round(y),4,30);c.fillStyle='#d8cda9';c.fillRect(Math.round(x-34),Math.round(y-18),68,20);c.fillStyle='#4b4034';c.font='8px monospace';c.textAlign='center';c.fillText(text,x,y-4);c.textAlign='left'}
S.renderOverlay=(c)=>{
 for(const r of S.urbanRoads){const px=r.orientation==='horizontal'?r.x+r.w*.5:r.x-42;const py=r.orientation==='horizontal'?r.y-46:r.y+r.h*.5;lamp(c,px,py)}
 for(const p of S.intersections){const a=S.roadById[p.a],b=S.roadById[p.b];if(!a||!b||!S.isUrbanRoad(p.x,p.y))continue;const h=a.orientation==='horizontal'?a:b,v=a.orientation==='vertical'?a:b;crosswalk(c,p.x-52,p.y-v.h*.5,104,18);crosswalk(c,p.x-52,p.y+v.h*.5-18,104,18);crosswalk(c,p.x-h.w*.5,p.y-52,18,104);crosswalk(c,p.x+h.w*.5-18,p.y-52,18,104);sign(c,p.x-55,p.y-68,a.name)}
};
S.audit=()=>({version:S.version,roadCount:roads.length,urbanCount:S.urbanRoads.length,productiveCount:S.productiveRoads.length,ruralCount:S.ruralRoads.length,intersectionCount:S.intersections.length,singleAuthority:true,derivedOverlay:true});
V.v4?.register?.('streets',S);
})();