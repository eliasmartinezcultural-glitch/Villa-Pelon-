/* Villa Pelón V4 — MOBILE FIRST
   Controles táctiles sin segundo motor ni RAF.
   El motor principal sigue siendo game.js.
   BUILD 413: interacción directa + paneles V4 + multitouch seguro.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const input=V.input;
const touch=document.getElementById('touch');
if(!input||!touch)return;

const prevent=e=>{e.preventDefault();e.stopPropagation()};

// El auditor V4 ya conecta el botón E con V.engine.interact().
// No simulamos teclado aquí: eso provocaba doble interacción en móviles.
const action=document.getElementById('interact');
if(action){
  action.setAttribute('aria-label','Interactuar / hablar / usar');
  action.addEventListener('pointerdown',prevent,{passive:false});
}

// Joystick virtual analógico: movimiento continuo y diagonales naturales.
touch.querySelector('.mobile-stick')?.remove();
const pad=document.createElement('div');
pad.className='mobile-stick';
pad.setAttribute('aria-label','Joystick virtual');
pad.innerHTML='<div class="mobile-stick-ring"><div class="mobile-stick-knob"></div></div>';
touch.insertBefore(pad,touch.firstChild);
const ring=pad.querySelector('.mobile-stick-ring');
const knob=pad.querySelector('.mobile-stick-knob');
let pointerId=null;
function center(){return {x:ring.clientWidth/2,y:ring.clientHeight/2,r:ring.clientWidth*.34}}
function reset(){input.up=input.down=input.left=input.right=false;knob.style.transform='translate(0,0)'}
function move(e){
  if(pointerId!==e.pointerId)return;
  prevent(e);
  const rect=ring.getBoundingClientRect(),c=center();
  let x=e.clientX-rect.left-c.x,y=e.clientY-rect.top-c.y;
  const d=Math.hypot(x,y),r=c.r;if(d>r&&d>0){x=x/d*r;y=y/d*r}
  knob.style.transform=`translate(${x}px,${y}px)`;
  const dead=.16,px=x/r,py=y/r;
  input.left=px < -dead; input.right=px > dead;
  input.up=py < -dead; input.down=py > dead;
}
function release(e){
  if(pointerId!==e.pointerId)return;
  prevent(e);pointerId=null;reset();
  try{ring.releasePointerCapture(e.pointerId)}catch(_){}
}
ring.addEventListener('pointerdown',e=>{prevent(e);pointerId=e.pointerId;try{ring.setPointerCapture(pointerId)}catch(_){}move(e)},{passive:false});
ring.addEventListener('pointermove',move,{passive:false});
ring.addEventListener('pointerup',release,{passive:false});
ring.addEventListener('pointercancel',release,{passive:false});
ring.addEventListener('lostpointercapture',reset);

// Acciones: se conectan directamente a los botones de V4 cuando existen.
// Esto evita depender de atajos de teclado que no todos los navegadores emulan igual.
const actions=[['mobile-map','map','MAPA'],['mobile-missions','missions','MISIONES'],['mobile-bag','bag','MOCHILA'],['mobile-memory','memory','MEMORIA']];
const tools=document.createElement('div');tools.className='mobile-actions';tools.setAttribute('aria-label','Acciones del juego');
function trigger(name){
  const target=document.querySelector(`#v4pTools [data-v4="${name}"]`);
  if(target){target.click();return true}
  // Si el sistema de jugabilidad todavía está montando sus controles, reintentamos una sola vez.
  setTimeout(()=>document.querySelector(`#v4pTools [data-v4="${name}"]`)?.click(),80);
  return false;
}
actions.forEach(([id,name,label])=>{
  const b=document.createElement('button');b.id=id;b.type='button';b.textContent=label;b.setAttribute('aria-label',label);
  b.addEventListener('pointerdown',e=>{prevent(e);trigger(name)},{passive:false});
  tools.appendChild(b);
});
touch.appendChild(tools);

for(const el of [pad,ring,action,tools])if(el)el.style.touchAction='none';

// Mobile UX: mostrar un aviso breve solo en la primera entrada al juego.
let tipShown=false;
function showTip(){
  if(tipShown||localStorage.getItem('villa_pelon_mobile_tip')==='1')return;
  tipShown=true;localStorage.setItem('villa_pelon_mobile_tip','1');
  const d=document.createElement('div');d.className='mobile-tip';d.innerHTML='<b>CONTROLES</b><br>Joystick para caminar · E para hablar · botones para mapa, misiones, mochila y memoria';
  document.body.appendChild(d);setTimeout(()=>d.classList.add('mobile-tip-hide'),4200);setTimeout(()=>d.remove(),4700);
}
document.getElementById('startBtn')?.addEventListener('click',()=>setTimeout(showTip,300),{once:true});

V.mobile={version:2,joystick:true,actions:true,directInteraction:true};
})();
