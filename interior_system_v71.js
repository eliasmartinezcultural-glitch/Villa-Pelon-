/* Villa Pelón V71 — sistema base de interiores.
   INTERACTION/UI: un único interior data-driven como primer ladrillo reutilizable.
   No crea game loop ni duplica movimiento, mundo o colisiones.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const state=V.gameState;
if(!state)return;

const interiors={
  shop:{
    building:'ALMACÉN',
    title:'ALMACÉN DEL PUEBLO',
    subtitle:'Un comercio cotidiano de Villa Pelón',
    width:22,height:12,
    objects:[
      {x:2,y:2,w:5,h:1,label:'MOSTRADOR'},
      {x:15,y:2,w:4,h:1,label:'ESTANTERÍA'},
      {x:15,y:5,w:4,h:1,label:'ESTANTERÍA'},
      {x:3,y:8,w:4,h:2,label:'CAJAS'},
      {x:10,y:8,w:3,h:2,label:'MESA'}
    ],
    message:'Hay pan, almacén, conversaciones y pequeñas noticias del día.'
  }
};

let current=null;
let panel=null;
function ensurePanel(){
  if(panel)return panel;
  panel=document.createElement('section');
  panel.id='villaInteriorV71';
  panel.className='villa-interior hidden';
  panel.innerHTML='<div class="interior-frame"><div class="interior-head"><div><span class="interior-kicker">VILLA PELÓN · INTERIOR</span><h2></h2><p></p></div><button type="button" id="interiorExit">SALIR · E</button></div><div class="interior-room"><div class="interior-floor"></div><div class="interior-objects"></div><div class="interior-player">●</div></div><div class="interior-footer"><span class="interior-message"></span><span>Explorá el interior y volvé a la calle cuando quieras.</span></div></div>';
  document.body.appendChild(panel);
  panel.querySelector('#interiorExit').addEventListener('click',exit);
  return panel;
}
function drawInterior(def){
  const p=ensurePanel();
  p.querySelector('h2').textContent=def.title;
  p.querySelector('p').textContent=def.subtitle;
  p.querySelector('.interior-message').textContent=def.message;
  const room=p.querySelector('.interior-room');
  room.style.setProperty('--room-w',def.width);
  room.style.setProperty('--room-h',def.height);
  const objects=p.querySelector('.interior-objects');
  objects.innerHTML='';
  def.objects.forEach(o=>{
    const el=document.createElement('div');
    el.className='interior-object';
    el.textContent=o.label;
    el.style.left=(o.x/def.width*100)+'%';
    el.style.top=(o.y/def.height*100)+'%';
    el.style.width=(o.w/def.width*100)+'%';
    el.style.height=(o.h/def.height*100)+'%';
    objects.appendChild(el);
  });
}
function enter(id){
  const def=interiors[id];
  if(!def||current)return false;
  current=id;
  state.dialogue=true;
  drawInterior(def);
  panel.classList.remove('hidden');
  return true;
}
function exit(){
  if(!current)return;
  current=null;
  state.dialogue=false;
  if(panel)panel.classList.add('hidden');
}
function nearShop(){
  if(!V.worldGeometry||!Array.isArray(V.worldGeometry.buildings))return false;
  const b=V.worldGeometry.buildings.find(b=>b.type==='shop'&&b.label==='ALMACÉN');
  if(!b)return false;
  const cx=b.x+b.w/2,cy=b.y+b.h+28;
  return Math.hypot(state.x-cx,state.y-cy)<105;
}
function tryEnter(){if(!current&&state.started&&nearShop())enter('shop');else if(current)exit()}
document.addEventListener('keydown',e=>{if(e.key==='e'||e.key==='E'||e.key===' '){if(current||nearShop()){e.preventDefault();e.stopImmediatePropagation();tryEnter()}}},{capture:true});
const interact=document.getElementById('interact');
if(interact)interact.addEventListener('click',e=>{e.preventDefault();tryEnter()},{capture:true});
V.interiorSystemV71={version:'71.0.0',authority:'INTERACTION/UI',interiors,enter,exit,get current(){return current},loop:'none'};
})();
