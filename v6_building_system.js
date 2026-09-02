/* Villa Pelón V6.15 — SISTEMA DE LUGARES FUNCIONALES
   Unifica edificios existentes en un registro reutilizable.
   Exterior -> acceso -> función -> horario -> actividad -> interior.
   No crea un segundo loop ni reemplaza la autoridad de game.js.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const B=V.buildingSystem=V.buildingSystem||{version:1,ready:false,patched:false,inside:null};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const meta={
 home:{function:'vivienda',hours:[0,24],label:'Vivienda',color:'rgba(139,104,76,.30)',roof:'gable',activity:'vida doméstica'},
 school:{function:'educación',hours:[7,18],label:'Escuela',color:'rgba(116,128,111,.34)',roof:'flat',activity:'clases y encuentros'},
 shop:{function:'comercio',hours:[8,20],label:'Comercio',color:'rgba(157,112,67,.34)',roof:'flat',activity:'compras y conversación'},
 bakery:{function:'panadería',hours:[6,20],label:'Panadería',color:'rgba(174,126,70,.36)',roof:'gable',activity:'producción y venta'},
 radio:{function:'radio',hours:[9,22],label:'Radio',color:'rgba(103,117,102,.34)',roof:'flat',activity:'emisión y producción'},
 rural:{function:'producción',hours:[6,20],label:'Producción',color:'rgba(116,100,66,.30)',roof:'gable',activity:'trabajo rural'},
 sports:{function:'deporte',hours:[8,22],label:'Deportes',color:'rgba(94,111,96,.32)',roof:'flat',activity:'actividad comunitaria'},
 public:{function:'comunidad',hours:[8,23],label:'Salón vecinal',color:'rgba(126,104,82,.32)',roof:'gable',activity:'reuniones'}
};
function enrich(b,i){const m=meta[b.type]||meta.home;const doorSide=i%2?'bottom':'front';const door=doorSide==='bottom'?{x:b.x+b.w*.5,y:b.y+b.h+18}:{x:b.x+b.w*.5,y:b.y-18};const setback=Math.max(18,Math.min(48,Math.round(Math.min(b.w,b.h)*.12)));return Object.assign(b,{id:b.id||`building_${i}_${b.type}`,function:b.function||m.function,category:b.category||b.type,openingHours:b.openingHours||m.hours.slice(),activity:b.activity||m.activity,occupants:b.occupants||[],setback:b.setback||setback,door:b.door||door,accessPoints:b.accessPoints||[door],interior:b.interior||{w:560,h:360,rooms:[{id:'main',label:m.label}],lighting:'warm'},visual:b.visual||{roof:m.roof,body:m.color,windows:Math.max(2,Math.floor(b.w/105)),yard:b.type==='home'||b.type==='rural'},interactable:b.interactable!==false,collision:b.collision!==false});}
function registry(){const source=Array.isArray(V.buildings)?V.buildings:[];for(let i=0;i<source.length;i++)enrich(source[i],i);B.buildings=source;B.byId=new Map(source.map(b=>[b.id,b]));return source}
function hour(){return Number(V.state?.minutes??480)/60}
function isOpen(b){const h=((hour()%24)+24)%24;const a=b.openingHours||[0,24];return h>=a[0]&&h<a[1]}
function nearest(max=82){const p=V.state;if(!p)return null;let best=null,bd=max;for(const b of B.buildings||[]){if(!b.interactable)continue;const d=Math.hypot(p.x-b.door.x,p.y-b.door.y);if(d<bd){bd=d;best=b}}return best}
function enter(b){if(!b)return;if(!isOpen(b)&&b.type!=='home'){B.notice=`${b.label} está cerrado ahora.`;V.state.dialogue=true;return}B.inside=b;V.state.dialogue=true;V.state._buildingInterior=true;B.notice='';}
function exit(){B.inside=null;V.state._buildingInterior=false;V.state.dialogue=false;B.notice=''}
function toggle(){if(B.inside){exit();return}const b=nearest();if(b)enter(b)}
function capture(e){if(!V.state?.started)return;if(!['e',' '].includes(e.key.toLowerCase()))return;if(V.state.dialogue&&V.state._buildingInterior){e.preventDefault();e.stopImmediatePropagation();exit();return}const b=nearest();if(!b)return;e.preventDefault();e.stopImmediatePropagation();toggle()}
function text(c,b){const open=isOpen(b);c.font='bold 12px monospace';c.fillStyle='rgba(35,27,21,.86)';c.fillText(b.label,b.x+8,b.y+b.h+31);c.font='10px monospace';c.fillStyle='rgba(65,52,42,.75)';c.fillText(open?`${b.function} · abierto`:`${b.function} · cerrado`,b.x+8,b.y+b.h+44)}
function facade(c){for(const b of B.buildings||[]){const v=b.visual||{};const roof=v.roof==='gable';
  c.fillStyle='rgba(39,31,25,.16)';c.fillRect(Math.round(b.x+8),Math.round(b.y+b.h+6),Math.max(1,b.w-16),7);
  c.fillStyle=v.body||'rgba(139,104,76,.30)';c.fillRect(Math.round(b.x+3),Math.round(b.y+3),Math.max(1,b.w-6),Math.max(1,b.h-6));
  c.strokeStyle='rgba(60,45,34,.38)';c.lineWidth=2;c.strokeRect(Math.round(b.x+3),Math.round(b.y+3),Math.max(1,b.w-6),Math.max(1,b.h-6));
  if(roof){c.fillStyle='rgba(75,57,43,.32)';c.beginPath();c.moveTo(b.x-4,b.y+10);c.lineTo(b.x+b.w*.5,b.y-15);c.lineTo(b.x+b.w+4,b.y+10);c.closePath();c.fill()}
  const count=Math.max(2,Math.floor((v.windows||2)));for(let i=0;i<count;i++){const wx=b.x+26+(i*((b.w-52)/Math.max(1,count-1)));const wy=b.y+b.h*.40;c.fillStyle='rgba(65,76,69,.60)';c.fillRect(Math.round(wx-7),Math.round(wy-8),14,14);c.fillStyle='rgba(203,181,126,.34)';c.fillRect(Math.round(wx-5),Math.round(wy-6),4,10);}
  const d=b.door||{x:b.x+b.w*.5,y:b.y+b.h+18};const dx=d.x-8,dy=d.y>b.y+b.h?b.y+b.h-1:b.y+1;c.fillStyle='rgba(67,48,36,.82)';c.fillRect(Math.round(dx),Math.round(dy),16,20);c.fillStyle='rgba(210,177,103,.50)';c.fillRect(Math.round(dx+11),Math.round(dy+10),2,2);
  if(v.yard){c.strokeStyle='rgba(79,66,51,.28)';c.lineWidth=1;c.strokeRect(Math.round(b.x-setback(b)),Math.round(b.y+b.h+25),Math.max(1,b.w+2*setback(b)),18)}
  text(c,b);
 }}
function setback(b){return b.setback||20}
function interior(c){const b=B.inside;if(!b)return;c.fillStyle='rgba(31,24,20,.94)';c.fillRect(0,0,c.canvas.width,c.canvas.height);const w=Math.min(720,c.canvas.width-50),h=Math.min(440,c.canvas.height-90),x=(c.canvas.width-w)/2,y=(c.canvas.height-h)/2;c.fillStyle='rgba(142,110,76,.92)';c.fillRect(x,y,w,h);c.strokeStyle='rgba(221,188,119,.7)';c.lineWidth=4;c.strokeRect(x,y,w,h);c.fillStyle='rgba(83,61,47,.82)';c.fillRect(x+18,y+18,w-36,48);c.fillStyle='#f0dfb0';c.font='bold 18px monospace';c.fillText(b.label,x+34,y+49);c.fillStyle='rgba(246,220,161,.18)';c.fillRect(x+28,y+88,w-56,h-120);c.fillStyle='rgba(247,221,162,.18)';c.fillRect(x+48,y+110,170,90);c.fillRect(x+250,y+110,170,90);c.fillRect(x+452,y+110,Math.min(170,w-500),90);c.fillStyle='rgba(65,50,39,.72)';c.font='12px monospace';c.fillText(b.activity,x+48,y+h-58);c.fillText('E · salir',x+w-120,y+h-28);c.font='10px monospace';c.fillStyle='rgba(255,238,190,.72)';c.fillText(b.occupants?.length?`Habitantes: ${b.occupants.join(', ')}`:'Un espacio preparado para cobrar vida',x+48,y+h-28)}
function patch(){if(B.patched||!V.life?.drawWorld)return;const old=V.life.drawWorld;V.life.drawWorld=function(c){old.call(this,c);facade(c)};B.patched=true;B.ready=true;B.registry=registry();}
registry();patch();setTimeout(()=>{registry();patch()},250);setTimeout(()=>{registry();patch()},900);window.addEventListener('keydown',capture,true);V.buildingSystem=B;
B.nearest=nearest;B.enter=enter;B.exit=exit;B.isOpen=isOpen;B.toggle=toggle;B.check=()=>({ok:B.ready,version:B.version,buildings:B.buildings?.length||0,withDoors:(B.buildings||[]).filter(b=>b.door).length,withInteriors:(B.buildings||[]).filter(b=>b.interior).length,openNow:(B.buildings||[]).filter(isOpen).length});
if(!B.overlayPatched){const oldOverlay=V.life?.drawOverlay;if(oldOverlay){V.life.drawOverlay=function(c){oldOverlay.call(this,c);if(B.inside)interior(c)}}else setTimeout(()=>{if(V.life?.drawOverlay&&!B.overlayPatched){const o=V.life.drawOverlay;V.life.drawOverlay=function(c){o.call(this,c);if(B.inside)interior(c)};B.overlayPatched=true}},700);B.overlayPatched=true}
})();
