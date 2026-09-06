/* Villa Pelón V87.2 — CAPA VISUAL TERRITORIAL
   Objetivo: pixel art de alta densidad de detalle + movilidad realista dentro del mundo final.
   No amplía el mapa. No modifica la autoridad territorial ni crea una segunda simulación.
   La capa visual es viewport-aware y se apaga fuera de juego para cuidar móviles.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const W=V.worldAuthority?.geometry||V.worldGeometry||V.world;
if(!W)return;

const PIXEL=1;
const PALETTE={
  grass:'#6f8f58',grassLight:'#88a96b',grassDark:'#536f46',soil:'#8b6847',soilLight:'#a67d52',
  asphalt:'#4a4d49',asphaltLight:'#62655f',roadEdge:'#343834',water:'#4c8790',waterLight:'#73aab0',
  sand:'#b99a69',barda:'#8f7257',bardaLight:'#b18e69',roof:'#714b3b',wall:'#c5ad87',wallLight:'#dcc59b',
  wood:'#76563f',metal:'#6d7470',glass:'#7ea8ae',foliage:'#456b45',foliage2:'#6f914e',
  skin:'#d7a17d',shirt:'#3d654f',pants:'#3d5368',outline:'#222923',white:'#eee8d5',yellow:'#d9b85d',red:'#a95245'
};
const VEHICLES=[
 {id:'bus-01',type:'bus',name:'COLECTIVO RURAL',x:7060,y:1510,w:150,h:48,route:'ruta-7',speed:78,dir:1,color:'#d0ad55'},
 {id:'bus-02',type:'bus',name:'COLECTIVO PICADA 21',x:7280,y:2470,w:150,h:48,route:'picada-21',speed:62,dir:1,color:'#c98d4a',missionTransport:true},
 {id:'truck-01',type:'truck',name:'CAMIÓN DE CARGA',x:4580,y:3160,w:112,h:42,route:'camino-sur',speed:54,dir:1,color:'#6d7470'},
 {id:'pickup-01',type:'pickup',name:'CAMIONETA RURAL',x:5300,y:3300,w:82,h:38,route:'camino-sur',speed:48,dir:-1,color:'#7b5d4b'},
 {id:'tractor-01',type:'tractor',name:'TRACTOR DE CHACRA',x:3350,y:2050,w:88,h:44,route:'camino-vinedos',speed:24,dir:1,color:'#9b7138'},
 {id:'car-01',type:'car',name:'AUTO',x:2100,y:1510,w:72,h:34,route:'ruta-7',speed:66,dir:-1,color:'#596b75'},
 {id:'car-02',type:'car',name:'AUTO',x:5850,y:1120,w:72,h:34,route:'calle-9',speed:46,dir:1,color:'#7c6658'},
 {id:'car-03',type:'car',name:'AUTO',x:6450,y:2200,w:72,h:34,route:'calle-12',speed:43,dir:-1,color:'#536a59'}
];
V.vehicles=V.vehicles||VEHICLES;
V.vehicleSystem={version:'1.0.0',pixelSize:PIXEL,types:['bus','truck','pickup','tractor','car'],registry:V.vehicles};

const PIXEL_ART={pixelSize:PIXEL,antiAlias:false,palette:PALETTE,principles:[
 'pixel mínimo de 1 unidad de render',
 'bordes de 1–2 px, sombras cortas y contraste por planos',
 'texturas por micro-patrones, no degradados fotográficos',
 'vegetación, tierra, agua y construcciones con variación local',
 'personas, animales y vehículos mantienen escala territorial V86'
],materials:{grass:{base:PALETTE.grass,detail:PALETTE.grassLight,shadow:PALETTE.grassDark},
road:{base:PALETTE.asphalt,detail:PALETTE.asphaltLight,edge:PALETTE.roadEdge},
water:{base:PALETTE.water,detail:PALETTE.waterLight},wall:{base:PALETTE.wall,light:PALETTE.wallLight,shadow:PALETTE.soil},
barda:{base:PALETTE.barda,light:PALETTE.bardaLight}}};
V.pixelArt=PIXEL_ART;

// Misión estructural: DNI perdido -> colectivo -> Picada 21 -> entrega.
const MISSION={id:'q05',title:'El DNI perdido',status:'locked',transport:'bus-02',from:'parada-regional',to:'parada-picada-21',target:'picada21-casa-01',item:'DNI perdido',reward:1200,
 description:'Un vecino encontró un DNI perdido. Debés tomar el colectivo rural y llevarlo hasta Picada 21.',steps:[
  {id:'receive',label:'Recibir el DNI perdido',done:false},
  {id:'board',label:'Tomar el colectivo a Picada 21',done:false},
  {id:'travel',label:'Viajar hasta Picada 21',done:false},
  {id:'deliver',label:'Entregar el DNI',done:false}
]};
V.territoryMissions=V.territoryMissions||{};V.territoryMissions.q05=MISSION;
V.transport={version:'1.0.0',activeRide:null,rideTo:'picada-21',vehicleId:'bus-02',boardingStop:'parada-regional',arrivalStop:'parada-picada-21'};

function pointOf(id){return (W.sites||[]).find(x=>x.id===id)||(W.buildings||[]).find(x=>x.id===id)||null}
function distTo(p){const s=V.gameState;if(!s||!p)return Infinity;return Math.hypot(s.x-p.x,s.y-p.y)}
function notify(title,text){if(typeof V.openDialogue==='function')V.openDialogue(title,[text]);}
function setStep(i){MISSION.steps[i].done=true;MISSION.status='active';V.gameState&&(V.gameState.quest=5);}
function boardBus(){
 const s=V.gameState;if(!s||!s.started)return false;
 const stop=pointOf('terminal-local');
 const regional=stop||{x:7160,y:705};
 if(distTo(regional)>135)return false;
 if(!MISSION.steps[0].done){setStep(0);V.addItem&&V.addItem('DNI perdido');notify('MISIÓN · EL DNI PERDIDO','Te encargaron llevar un DNI perdido a una familia de Picada 21. La única forma de completar el encargo es tomar el colectivo rural.');return true}
 if(MISSION.steps[1].done&&!MISSION.steps[2].done){notify('COLECTIVO RURAL','El próximo colectivo de Picada 21 sale desde esta parada. Acercate y subí.');return true}
 setStep(1);V.transport.activeRide='bus-02';
 // Viaje representado como traslado territorial con coste de tiempo, no teletransporte gratuito.
 s.minutes+=34;s.energy=Math.max(0,s.energy-6);s.x=7240;s.y=4810;setStep(2);
 notify('PICADA 21','Llegaste a Picada 21. Ahora buscá la casa indicada y entregá el DNI.');
 return true;
}
function deliver(){
 const s=V.gameState;if(!s||!MISSION.steps[2].done||MISSION.steps[3].done)return false;
 const target=pointOf('picada21-casa-01')||{x:7565,y:4625};
 if(Math.hypot(s.x-target.x,s.y-target.y)>130)return false;
 setStep(3);MISSION.status='completed';s.money+=MISSION.reward;
 if(s.inventory){const i=s.inventory.indexOf('DNI perdido');if(i>=0)s.inventory.splice(i,1)}
 notify('MISIÓN COMPLETADA','Entregaste el DNI perdido en Picada 21. Recompensa: $1.200.');
 return true;
}
V.territoryMissionActions={boardPicada21:boardBus,deliverDni:deliver};

// Capa visual: no sustituye el renderer principal; agrega detalle de terreno y vehículos dentro del viewport.
let fx=null,fctx=null,started=false,last=0;
function ensureCanvas(){
 if(fx)return;
 const base=document.getElementById('world');if(!base)return;
 fx=document.createElement('canvas');fx.id='worldFX';fx.setAttribute('aria-hidden','true');
 fx.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;image-rendering:pixelated;z-index:2;';
 base.parentElement.style.position=base.parentElement.style.position||'relative';base.parentElement.appendChild(fx);
 fctx=fx.getContext('2d',{alpha:true});fctx.imageSmoothingEnabled=false;resize();
 addEventListener('resize',resize,{passive:true});
}
function resize(){if(!fx)return;const d=Math.min(devicePixelRatio||1,2),w=innerWidth,h=innerHeight;fx.width=Math.floor(w*d);fx.height=Math.floor(h*d);fx.style.width=w+'px';fx.style.height=h+'px';fctx.setTransform(d,0,0,d,0,0);fctx.imageSmoothingEnabled=false}
function cam(){const s=V.gameState||{x:960,y:650},zoom=.78,w=innerWidth,h=innerHeight;return{x:Math.max(0,Math.min(W.w-w/zoom,s.x-w/(2*zoom))),y:Math.max(55,Math.min(W.h-h/zoom,s.y-h/(2*zoom)))} }
function S(x,y,c,w=1,h=1){fctx.fillStyle=c;fctx.fillRect(Math.round(x),Math.round(y),w,h)}
function worldToScreen(x,y,c){return{x:(x-c.x)*.78,y:(y-c.y)*.78}}
function drawRoadTexture(c){
 (W.roads||[]).forEach(r=>{const a=worldToScreen(r.x,r.y,c),rw=r.w*.78,rh=r.h*.78;if(a.x>innerWidth||a.x+rw<0||a.y>innerHeight||a.y+rh<0)return;
  if(r.kind==='route'||r.kind==='urban'||r.kind==='rural-road'||r.kind==='local-road'){
   const step=Math.max(18,Math.round(34*.78));
   for(let x=Math.max(0,a.x);x<a.x+rw;x+=step){if(r.w>r.h)S(x,a.y+rh/2,PALETTE.asphaltLight,7,1);else S(a.x+rw/2,x,PALETTE.asphaltLight,1,7)}
  }
 });
}
function drawFieldTexture(c){
 (W.fields||[]).forEach(f=>{const a=worldToScreen(f.x,f.y,c),w=f.w*.78,h=f.h*.78;if(a.x>innerWidth||a.x+w<0||a.y>innerHeight||a.y+h<0)return;const col=f.type==='vineyard'?PALETTE.foliage:PALETTE.foliage2;
  for(let y=Math.max(0,a.y+8);y<a.y+h;y+=13)for(let x=Math.max(0,a.x+8);x<a.x+w;x+=17)S(x,y,col,2,2);
 });
}
function drawVehicle(v,c,t){
 const p=worldToScreen(v.x,v.y,c),x=p.x,y=p.y,w=v.w*.78,h=v.h*.78;if(x+w<0||x>innerWidth||y+h<0||y>innerHeight)return;
 S(x+3,y+h-2,PALETTE.outline,w-6,2);S(x,y+5,v.color,w,h-9);S(x+6,y+2,PALETTE.outline,w-12,4);
 const glass=PALETTE.glass;S(x+18,y+9,glass,Math.max(8,w*.18),Math.max(6,h*.35));S(x+w-26,y+9,glass,Math.max(8,w*.18),Math.max(6,h*.35));
 const wheel=Math.max(7,h*.22);S(x+13,y+h-wheel,PALETTE.outline,wheel,wheel);S(x+w-22,y+h-wheel,PALETTE.outline,wheel,wheel);
 if(v.type==='bus'){S(x+2,y+2,PALETTE.yellow,12,2);S(x+w-20,y+h-4,PALETTE.red,14,2)}
 if(v.type==='tractor'){S(x+w*.62,y-5,PALETTE.outline,4,7);S(x+w*.66,y-6,PALETTE.metal,12,9)}
}
function drawVehicles(t,c){
 V.vehicles.forEach(v=>{const r=(W.roads||[]).find(x=>x.id===v.route);if(r){if(r.w>r.h){v.x+=v.speed*(v.dir||1)*.016;if(v.x>r.x+r.w+180)v.x=r.x-180;if(v.x<r.x-180)v.x=r.x+r.w+180}else{v.y+=v.speed*(v.dir||1)*.016;if(v.y>r.y+r.h+180)v.y=r.y-180;if(v.y<r.y-180)v.y=r.y+r.h+180}}drawVehicle(v,c,t)})
}
function drawStop(c){const p=pointOf('parada-picada-21');if(!p)return;const s=worldToScreen(p.x,p.y,c);if(s.x<-80||s.x>innerWidth+80||s.y<-80||s.y>innerHeight+80)return;
 S(s.x,s.y-40,PALETTE.outline,4,42);S(s.x-17,s.y-50,PALETTE.wallLight,36,18);S(s.x-12,s.y-46,PALETTE.glass,26,10);S(s.x-18,s.y-27,PALETTE.wood,40,3);S(s.x-13,s.y-23,PALETTE.wood,4,18);S(s.x+10,s.y-23,PALETTE.wood,4,18);
}
function drawRemoteMarker(c){const s=V.gameState;if(!s||MISSION.status==='locked')return;const p=pointOf('picada21-casa-01');if(!p)return;const q=worldToScreen(p.x+p.w/2,p.y-18,c);if(q.x<-40||q.x>innerWidth+40||q.y<-40||q.y>innerHeight+40)return;S(q.x-8,q.y-3,PALETTE.yellow,16,6);S(q.x-3,q.y-12,PALETTE.yellow,6,9)}
function render(t){ensureCanvas();if(!fx)return;const s=V.gameState;if(!s||!s.started){fctx.clearRect(0,0,innerWidth,innerHeight);return}const c=cam();fctx.clearRect(0,0,innerWidth,innerHeight);drawRoadTexture(c);drawFieldTexture(c);drawVehicles(V.vehicles,c,t);drawStop(c);drawRemoteMarker(c);last=t;requestAnimationFrame(render)}
ensureCanvas();requestAnimationFrame(render);

// Interacción de transporte: se ejecuta en fase capture para no duplicar la interacción normal.
function transportInput(e){if(!V.gameState?.started)return;const k=e.key?.toLowerCase();if(k!=='e'&&k!==' ')return;const s=V.gameState;const stop=pointOf('terminal-local')||{x:7160,y:705};if(Math.hypot(s.x-stop.x,s.y-stop.y)<135&&MISSION.status!=='completed'){e.preventDefault();e.stopPropagation();boardBus();return}
 const target=pointOf('picada21-casa-01')||{x:7565,y:4625};if(MISSION.steps[2].done&&!MISSION.steps[3].done&&Math.hypot(s.x-target.x,s.y-target.y)<130){e.preventDefault();e.stopPropagation();deliver()}}
addEventListener('keydown',transportInput,true);
addEventListener('pointerdown',e=>{if(e.target?.id!=='interact'||!V.gameState?.started)return;const s=V.gameState,stop=pointOf('terminal-local')||{x:7160,y:705},target=pointOf('picada21-casa-01')||{x:7565,y:4625};if(Math.hypot(s.x-stop.x,s.y-stop.y)<135|| (MISSION.steps[2].done&&!MISSION.steps[3].done&&Math.hypot(s.x-target.x,s.y-target.y)<130)){e.preventDefault();e.stopPropagation();if(MISSION.steps[2].done)deliver();else boardBus()}},true);

// Exponer inspección para pruebas y futura HUD.
V.visualDiagnostics=()=>({version:'V87.2.0',pixelArt:PIXEL_ART,vehicles:V.vehicles.length,mission:MISSION,world:{width:W.w,height:W.h}});
window.dispatchEvent(new CustomEvent('villa-pelon-visual-system-ready',{detail:{version:'V87.2.0',vehicles:V.vehicles.length,mission:'q05'}}));
})();
