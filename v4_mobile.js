/* Villa Pelón V4 — MOBILE FIRST
   Controles táctiles sin segundo motor ni RAF.
   El motor principal sigue siendo game.js.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const input=V.input;
const touch=document.getElementById('touch');
if(!input||!touch)return;

const fireKey=(key)=>{
  window.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true}));
  window.setTimeout(()=>window.dispatchEvent(new KeyboardEvent('keyup',{key,bubbles:true})),0);
};

// El botón E existente usa el mismo camino que teclado: no duplica lógica.
const action=document.getElementById('interact');
if(action){
  action.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();fireKey('e')},{passive:false});
}

// Joystick virtual: una sola superficie, movimiento analógico y diagonal natural.
const oldPad=touch.querySelector('.mobile-stick');
if(oldPad)oldPad.remove();
const pad=document.createElement('div');
pad.className='mobile-stick';
pad.innerHTML='<div class="mobile-stick-ring"><div class="mobile-stick-knob"></div></div>';
touch.insertBefore(pad,touch.firstChild);
const ring=pad.querySelector('.mobile-stick-ring');
const knob=pad.querySelector('.mobile-stick-knob');
let pointerId=null;
function center(){return {x:ring.clientWidth/2,y:ring.clientHeight/2,r:ring.clientWidth*.32}}
function move(e){
  if(pointerId!==e.pointerId)return;
  const rect=ring.getBoundingClientRect(),c=center();
  let x=e.clientX-rect.left-c.x,y=e.clientY-rect.top-c.y;
  const d=Math.hypot(x,y),r=c.r;if(d>r){x=x/d*r;y=y/d*r}
  knob.style.transform=`translate(${x}px,${y}px)`;
  const dead=.18;
  input.left=x/r < -dead; input.right=x/r > dead;
  input.up=y/r < -dead; input.down=y/r > dead;
}
function release(e){if(pointerId!==e.pointerId)return;pointerId=null;input.up=input.down=input.left=input.right=false;knob.style.transform='translate(0,0)';try{ring.releasePointerCapture(e.pointerId)}catch(_) {}}
ring.addEventListener('pointerdown',e=>{e.preventDefault();pointerId=e.pointerId;try{ring.setPointerCapture(pointerId)}catch(_){}move(e)},{passive:false});
ring.addEventListener('pointermove',move,{passive:false});
ring.addEventListener('pointerup',release);ring.addEventListener('pointercancel',release);ring.addEventListener('lostpointercapture',()=>{input.up=input.down=input.left=input.right=false;knob.style.transform='translate(0,0)'});

// Acciones de apoyo. No contienen lógica de juego: solo reutilizan las teclas existentes.
const actions=[['mobile-map','M','MAPA'],['mobile-missions','q','MISIONES'],['mobile-bag','i','MOCHILA'],['mobile-memory','h','MEMORIA']];
const tools=document.createElement('div');tools.className='mobile-actions';
actions.forEach(([id,key,label])=>{const b=document.createElement('button');b.id=id;b.type='button';b.textContent=label;b.addEventListener('pointerdown',e=>{e.preventDefault();fireKey(key)},{passive:false});tools.appendChild(b)});
touch.appendChild(tools);

// Evita que gestos del navegador roben el control durante una partida.
for(const el of [pad,ring,action,tools])if(el)el.style.touchAction='none';

V.mobile={version:1,joystick:true,actions:true};
})();
