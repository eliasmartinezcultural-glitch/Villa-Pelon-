/* VILLA PELÓN V134 — MUNDO VIVO
   Detalles cotidianos derivados sobre la geografía ya bloqueada.
   No crea edificios, rutas, río ni zonas. No modifica G.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const G=V.worldGeometry||{};
const P=V.visualAuthority?.contract?.palette||{};
const S=V.gameState||{};
const LIFE=V.villageLife||{};
const fixed=[
 {id:'plaza-flower-01',x:1100,y:1335,type:'planter',zone:'urban_core'},
 {id:'plaza-flower-02',x:1370,y:1350,type:'planter',zone:'urban_core'},
 {id:'plaza-bike-01',x:1450,y:1460,type:'bike',zone:'urban_core'},
 {id:'rural-crate-01',x:3900,y:1180,type:'crate',zone:'transition_rural'},
 {id:'rural-barrel-01',x:4200,y:1320,type:'barrel',zone:'transition_rural'},
 {id:'rural-hay-01',x:4550,y:1180,type:'hay',zone:'transition_rural'},
 {id:'rural-hay-02',x:4620,y:1210,type:'hay',zone:'transition_rural'},
 {id:'rural-mailbox-01',x:4750,y:1480,type:'mailbox',zone:'transition_rural'},
 {id:'rural-bucket-01',x:3820,y:1510,type:'bucket',zone:'transition_rural'},
 {id:'rural-crate-02',x:5200,y:1450,type:'crate',zone:'transition_rural'},
 {id:'river-lookout-01',x:5500,y:2520,type:'bench',zone:'river_buffer'},
 {id:'picada-woodpile-01',x:7250,y:3020,type:'woodpile',zone:'picada21'},
 {id:'picada-bucket-01',x:7380,y:3060,type:'bucket',zone:'picada21'},
 {id:'picada-crate-01',x:7650,y:2990,type:'crate',zone:'picada21'}
];
const validZone=o=>Array.isArray(G.zones)&&G.zones.some(z=>z.id===o.zone&&o.x>=z.x&&o.y>=z.y&&o.x<=z.x+z.w&&o.y<=z.y+z.h);
const details=fixed.filter(validZone);
function box(ctx,x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))}
function draw(o,ctx){const x=o.x,y=o.y;switch(o.type){case'planter':box(ctx,x,y,24,8,P.woodDark);box(ctx,x+3,y-5,18,6,P.leaf);box(ctx,x+8,y-9,3,5,P.leafLight);break;case'bike':box(ctx,x,y,22,2,P.metalDark);ctx.strokeStyle=P.metal;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+4,y+6,4,0,Math.PI*2);ctx.arc(x+18,y+6,4,0,Math.PI*2);ctx.stroke();box(ctx,x+9,y-5,2,10,P.metalLight);break;case'crate':box(ctx,x,y,18,13,P.woodDark);box(ctx,x+2,y+2,14,8,P.woodLight);box(ctx,x+8,y+2,2,8,P.woodDark);break;case'barrel':ctx.fillStyle=P.woodDark;ctx.fillRect(x,y,14,15);box(ctx,x+2,y+3,10,2,P.metal);box(ctx,x+2,y+10,10,2,P.metal);break;case'hay':box(ctx,x,y,18,12,P.signDark);box(ctx,x+2,y+2,14,8,P.sign);box(ctx,x+5,y+2,2,8,P.wood);break;case'mailbox':box(ctx,x,y,12,8,P.metalDark);box(ctx,x+2,y-2,8,4,P.metalLight);box(ctx,x+5,y+8,2,8,P.woodDark);break;case'bucket':box(ctx,x,y,11,8,P.metalDark);box(ctx,x+2,y+2,7,4,P.metalLight);break;case'woodpile':for(let i=0;i<4;i++)box(ctx,x+i*5,y-i*2,18,4,i%2?P.wood:P.woodLight);break;case'bench':box(ctx,x,y,30,5,P.woodDark);box(ctx,x+2,y-5,26,4,P.woodLight);break}}
function drawLivingDetails(ctx){const h=((+S.minutes||0)/60)%24,weather=V.atmosphere?.weather?.type||'despejado';for(const o of details)draw(o,ctx);if(h>=7&&h<20&&weather!=='lluvia'){for(let i=0;i<3;i++){const x=1280+i*38+Math.sin(performance.now()/900+i)*5,y=1180+Math.sin(performance.now()/700+i)*5;box(ctx,x,y,3,2,P.ink)}}if(h>=18||h<6){for(const o of details.filter(x=>x.type==='mailbox'))box(ctx,o.x-1,o.y-1,14,2,P.sign)}if(weather==='lluvia'){for(const o of details.filter(x=>x.type==='hay'))box(ctx,o.x-2,o.y-2,22,2,P.waterDark)}}
const previous=V.visualAuthority?.drawContent;if(previous&&!V.visualAuthority.__v134Wrapped){V.visualAuthority.drawContent=function(ctx,meta){previous(ctx,meta);drawLivingDetails(ctx)};V.visualAuthority.__v134Wrapped=true;}
V.livingWorld={version:'V134',details,weatherReactive:true,scheduleReactive:true,geometryUntouched:true,audit:{ok:details.length===fixed.length,rejected:fixed.filter(o=>!validZone(o)).map(o=>o.id),principle:'detalles expanden; geografia no cambia'}};
window.dispatchEvent(new CustomEvent('villa-pelon-living-world-ready',{detail:V.livingWorld.audit}));
})();
