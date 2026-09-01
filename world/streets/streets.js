/* Villa Pelón V4 — SISTEMA DE CALLES
   Etapa 2: calles como infraestructura real, no como simples rectángulos.
   Mantiene una geometría centralizada para render, tránsito, peatones y futuras interacciones.
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
S.onSidewalk=(x,y)=>S.roads.some(r=>{
 const outer={x:r.x-S.sidewalkWidth,y:r.y-S.sidewalkWidth,w:r.w+S.sidewalkWidth*2,h:r.h+S.sidewalkWidth*2};
 return x>=outer.x&&x<=outer.x+outer.w&&y>=outer.y&&y<=outer.y+outer.h&&!S.onRoad(x,y);
});
function road(c,r){
 c.fillStyle='#b7a37c';c.fillRect(r.x,r.y,r.w,r.h);
 c.fillStyle='#cfc3a0';
 if(r.orientation==='horizontal'){c.fillRect(r.x,r.y-28,r.w,28);c.fillRect(r.x,r.y+r.h,r.w,28)}
 else{c.fillRect(r.x-28,r.y,28,r.h);c.fillRect(r.x+r.w,r.y,28,r.h)}
 c.fillStyle='#8b765b';
 if(r.orientation==='horizontal'){c.fillRect(r.x,r.y-7,r.w,7);c.fillRect(r.x,r.y+r.h,r.w,7)}
 else{c.fillRect(r.x-7,r.y,7,r.h);c.fillRect(r.x+r.w,r.y,7,r.h)}
 c.strokeStyle='#8c795e';c.lineWidth=3;c.setLineDash([34,26]);c.beginPath();
 if(r.orientation==='horizontal')c.moveTo(r.x,r.y+r.h/2),c.lineTo(r.x+r.w,r.y+r.h/2);else c.moveTo(r.x+r.w/2,r.y),c.lineTo(r.x+r.w/2,r.y+r.h);c.stroke();c.setLineDash([]);
 c.fillStyle='rgba(92,73,54,.18)';
 for(let i=0;i<9;i++){const p=(i*517)%Math.max(r.w,r.h);if(r.orientation==='horizontal')c.fillRect(r.x+p,r.y+32+(i%4)*41,28+(i%3)*16,4);else c.fillRect(r.x+32+(i%4)*41,r.y+p,4,28+(i%3)*16)}
}
function crosswalk(c,x,y,w,h){c.fillStyle='#e9dfc0';for(let i=0;i<8;i++)c.fillRect(x+i*(w/8),y,Math.max(6,w/16),h)}
function lamp(c,x,y){c.fillStyle='#4d4439';c.fillRect(x-2,y,4,42);c.beginPath();c.arc(x,y,6,0,Math.PI*2);c.fill();c.fillStyle='#e9d79d';c.beginPath();c.arc(x,y-4,4,0,Math.PI*2);c.fill()}
function sign(c,x,y,text){c.fillStyle='#5a4a39';c.fillRect(x-2,y,4,30);c.fillStyle='#d8cda9';c.fillRect(x-34,y-18,68,20);c.fillStyle='#4b4034';c.font='8px monospace';c.textAlign='center';c.fillText(text,x,y-4)}
S.render=(c)=>{
 for(const r of S.roads)road(c,r);
 crosswalk(c,1135,690,130,28);crosswalk(c,1135,912,130,28);crosswalk(c,1170,650,28,80);crosswalk(c,1372,650,28,80);
 lamp(c,1080,670);lamp(c,1500,670);lamp(c,1080,950);lamp(c,1500,950);lamp(c,1145,560);lamp(c,1435,560);lamp(c,1145,1050);lamp(c,1435,1050);
 sign(c,1060,675,'AV. PRINCIPAL');sign(c,1515,675,'CENTRO');
};
V.v4?.register?.('streets',S);
})();
