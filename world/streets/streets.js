/* Villa Pelón V4 — SISTEMA DE CALLES
   Geometría única para calles, veredas y tránsito.
   IMPORTANTE: el motor V4 ya pinta la calzada base; este módulo no la repinta encima.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.streetSystem=V.streetSystem||{};
S.version=4;
S.roadWidth=230; S.laneWidth=66; S.sidewalkWidth=28; S.curbWidth=7;
S.roads=[
 {id:'avenida_principal',orientation:'horizontal',x:0,y:700,w:4200,h:230,name:'Avenida Principal',speedLimit:40},
 {id:'calle_central',orientation:'vertical',x:1180,y:0,w:220,h:2700,name:'Calle Central',speedLimit:30}
];
S.features={curbs:true,sidewalks:true,crosswalks:true,centerLines:true,laneLines:true,roadWear:true,patches:true,drainage:true,streetSigns:true,lamps:true,utilityPoles:true,trafficLights:true,busStops:true};
S.onRoad=(x,y)=>S.roads.some(r=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h);
S.onSidewalk=(x,y)=>S.roads.some(r=>{const o={x:r.x-S.sidewalkWidth,y:r.y-S.sidewalkWidth,w:r.w+S.sidewalkWidth*2,h:r.h+S.sidewalkWidth*2};return x>=o.x&&x<=o.x+o.w&&y>=o.y&&y<=o.y+o.h&&!S.onRoad(x,y)});
function sidewalk(c,r){c.fillStyle='#cfc3a0';if(r.orientation==='horizontal'){c.fillRect(r.x,r.y-28,r.w,28);c.fillRect(r.x,r.y+r.h,r.w,28)}else{c.fillRect(r.x-28,r.y,28,r.h);c.fillRect(r.x+r.w,r.y,28,r.h)}}
function curb(c,r){c.fillStyle='#8b765b';if(r.orientation==='horizontal'){c.fillRect(r.x,r.y-7,r.w,7);c.fillRect(r.x,r.y+r.h,r.w,7)}else{c.fillRect(r.x-7,r.y,7,r.h);c.fillRect(r.x+r.w,r.y,7,r.h)}}
function crosswalk(c,x,y,w,h){c.fillStyle='#e9dfc0';for(let i=0;i<8;i++)c.fillRect(x+i*(w/8),y,Math.max(6,w/16),h)}
function lamp(c,x,y){c.fillStyle='#4d4439';c.fillRect(x-2,y,4,42);c.beginPath();c.arc(x,y,6,0,Math.PI*2);c.fill();c.fillStyle='#e9d79d';c.beginPath();c.arc(x,y-4,4,0,Math.PI*2);c.fill()}
function sign(c,x,y,text){c.fillStyle='#5a4a39';c.fillRect(x-2,y,4,30);c.fillStyle='#d8cda9';c.fillRect(x-34,y-18,68,20);c.fillStyle='#4b4034';c.font='8px monospace';c.textAlign='center';c.fillText(text,x,y-4);c.textAlign='left'}
S.renderInfrastructure=(c)=>{
 for(const r of S.roads){if(S.features.sidewalks)sidewalk(c,r);if(S.features.curbs)curb(c,r)}
 if(S.features.crosswalks){crosswalk(c,1135,690,130,28);crosswalk(c,1135,912,130,28);crosswalk(c,1170,650,28,80);crosswalk(c,1372,650,28,80)}
 if(S.features.lamps){lamp(c,1080,670);lamp(c,1500,670);lamp(c,1080,950);lamp(c,1500,950);lamp(c,1145,560);lamp(c,1435,560);lamp(c,1145,1050);lamp(c,1435,1050)}
 if(S.features.streetSigns){sign(c,1060,675,'AV. PRINCIPAL');sign(c,1515,675,'CENTRO')}
};
S.render=(c)=>S.renderInfrastructure(c);
V.v4?.register?.('streets',S);
})();
