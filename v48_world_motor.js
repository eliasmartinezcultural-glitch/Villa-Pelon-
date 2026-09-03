/* Villa Pelón V48 — motor territorial + intro cinematográfica. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const geo=V.worldGeometry;if(!geo||!geo.buildings)return;
const buildings=geo.buildings;
const by=t=>buildings.find(b=>b.type===t);
/* REGLA 01: las viviendas quedan fuera de las calzadas. */
const homes=buildings.filter(b=>b.type==='home');
if(homes[0])Object.assign(homes[0],{x:690,y:430,w:190,h:140,label:'VIVIENDA NORTE'});
if(homes[1])Object.assign(homes[1],{x:720,y:850,w:205,h:150,label:'VIVIENDA SUR'});
/* La radio se corre fuera del corredor vertical principal. */
const radio=by('radio');if(radio)Object.assign(radio,{x:850,y:1110});
if(V.life){
  V.life.places=V.life.places||{};V.life.places.casa=[785,500];V.life.places.radio=[1040,1180];
  if(V.life.ambient)V.life.ambient.forEach(p=>{if(p.role==='radio')p.work=[1040,1180]});
}
function px(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function line(c,x1,y1,x2,y2,col,w){c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke()}
function river(c){
  /* Río: borde natural del pueblo, sin casas sobre su cauce. */
  px(c,2920,0,280,2000,'#789b91');
  for(let y=0;y<2000;y+=42)line(c,2940,y,3160,y+8,'rgba(225,239,215,.30)',2);
  for(let y=20;y<2000;y+=95){px(c,2888,y,34,3,'#b5c39a');px(c,3165,y+28,30,3,'#b5c39a')}
}
function roads(c){
  const road='#555b50',edge='#aaa58f',side='#bdb69d';
  /* Red urbana: avenida principal + barrios + conexión al río. */
  [[0,250,2880,48],[0,1010,2880,52]].forEach(r=>{px(c,r[0],r[1],r[2],r[3],road);px(c,r[0],r[1],r[2],3,edge);px(c,r[0],r[1]+r[3]-3,r[2],3,edge)});
  [[480,0,52,680],[480,1010,52,900],[1850,0,52,680],[1850,1010,52,900],[2700,0,52,2000]].forEach(r=>{px(c,r[0],r[1],r[2],r[3],road);px(c,r[0],r[1],3,r[3],edge);px(c,r[0]+r[2]-3,r[1],3,r[3],edge)});
  /* Calle costanera antes del río. */
  px(c,2850,0,46,2000,road);px(c,2850,0,3,2000,edge);px(c,2893,0,3,2000,edge);
  [[0,230,2880,14],[0,304,2880,14],[0,990,2880,14],[0,1062,2880,14]].forEach(r=>px(c,r[0],r[1],r[2],r[3],side));
  [480,1120,1850,2700].forEach(x=>{for(let i=0;i<6;i++)px(c,x-34+i*13,294,7,4,'#d8d0b4');for(let i=0;i<6;i++)px(c,x-34+i*13,1054,7,4,'#d8d0b4')});
}
function irrigation(c){
  line(c,1960,1150,2830,1150,'#688b7f',8);line(c,1980,1510,2800,1510,'#688b7f',7);
  for(let x=1980;x<2800;x+=80)px(c,x,1146,26,2,'#a6b99b');
}
function props(c){
  [[150,190],[900,190],[1400,190],[2300,190],[150,1200],[1350,1200],[2250,1200]].forEach(([x,y])=>{px(c,x,y,6,45,'#5b6258');px(c,x-6,y,18,5,'#4d554d');line(c,x+3,y+4,x+70,y-2,'#343c35',2)});
  [[120,340],[980,370],[1500,430],[2100,360],[300,900],[1050,920],[1500,900],[2250,850]].forEach(([x,y])=>{px(c,x-4,y+12,8,22,'#70533b');px(c,x-18,y-2,36,22,'#426b47');px(c,x-11,y-12,22,15,'#628257')});
  [[980,600],[1330,600],[2020,600],[600,1170],[1500,1170]].forEach(([x,y])=>{px(c,x-3,y,6,38,'#4c5047');px(c,x-10,y,20,5,'#d8c987');px(c,x-6,y+5,12,7,'#efe1a2')});
}
function labels(c){c.font='bold 11px monospace';c.textAlign='center';[['AV. PRINCIPAL',1440,245],['CALLE DEL RÍO',2780,995],['CAMINO A LAS CHACRAS',2350,1585]].forEach(a=>{px(c,a[1]-76,a[2]-13,152,20,'rgba(29,38,29,.76)');c.fillStyle='#eee4c5';c.fillText(a[0],a[1],a[2]+1)})}
/* Mantiene el único render loop existente. */
if(V.life&&!V.life.__v48Motor){const old=V.life.drawWorld;V.life.__v48Motor=true;V.life.drawWorld=function(c){if(old)old(c);river(c);roads(c);irrigation(c);props(c);labels(c)}}
/* INTRO V48: captura el arranque existente y lo ejecuta después de la cinemática. */
const start=document.getElementById('start'),game=document.getElementById('game'),btn=document.getElementById('startBtn');
if(start&&game&&btn&&!window.__villaPelonIntro48){window.__villaPelonIntro48=true;const card=start.querySelector('.title-card'),originalStart=btn.onclick;
btn.onclick=()=>{if(start.dataset.cinematic==='1')return;start.dataset.cinematic='1';btn.disabled=true;card.classList.add('cinematic');
const eyebrow=card.querySelector('.eyebrow'),title=card.querySelector('h1'),copy=card.querySelector('p'),small=card.querySelector('small');
eyebrow.textContent='UN PUEBLO. MIL HISTORIAS.';title.textContent='VILLA PELÓN';copy.textContent='Amanece. Las calles despiertan y el pueblo empieza a moverse.';small.textContent='CAMINÁ · CONOCÉ · TRABAJÁ · INVESTIGÁ';
setTimeout(()=>{copy.textContent='Una casa abre sus ventanas. El almacén prepara el día. En las chacras ya hay trabajo.'},1300);
setTimeout(()=>{copy.textContent='Tu historia empieza ahora. El pueblo seguirá vivo aunque no estés mirando.'},2600);
setTimeout(()=>{if(typeof originalStart==='function')originalStart();},3900);
};}
})();
