/* Villa Pelón V4 — MOBILE INPUT 417
   Un único input compartido con game.js. Pointer Events + joystick + flechas.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const input=V.input;
const touch=document.getElementById('touch');
if(!input||!touch)return;
const KEY='villa_pelon_v4_settings';
let controls='joystick';
try{controls=JSON.parse(localStorage.getItem(KEY)||'{}').controls||'joystick'}catch(_){}
function applyMode(){
  controls=(()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}').controls||'joystick'}catch(_){return 'joystick'}})();
  document.body.classList.toggle('v4-arrows',controls==='arrows');
  document.body.classList.toggle('v4-joystick',controls!=='arrows');
  touch.dataset.controlMode=controls;
}
applyMode();

const padOld=touch.querySelector('.mobile-stick');if(padOld)padOld.remove();
const pad=document.createElement('div');pad.className='mobile-stick';pad.setAttribute('role','application');pad.setAttribute('aria-label','Joystick virtual');
pad.innerHTML='<div class="mobile-stick-ring"><div class="mobile-stick-knob"></div></div>';
touch.insertBefore(pad,touch.firstChild);
const ring=pad.querySelector('.mobile-stick-ring'),knob=pad.querySelector('.mobile-stick-knob');
let pointerId=null;
function reset(){input.up=input.down=input.left=input.right=false;knob.style.transform='translate3d(0,0,0)'}
function move(e){if(pointerId!==e.pointerId)return;e.preventDefault();const r=ring.getBoundingClientRect(),cx=r.width/2,cy=r.height/2,max=Math.min(r.width,r.height)*.34;let x=e.clientX-r.left-cx,y=e.clientY-r.top-cy,d=Math.hypot(x,y);if(d>max&&d>0){x=x/d*max;y=y/d*max}knob.style.transform=`translate3d(${x}px,${y}px,0)`;const dead=.12,px=x/max,py=y/max;input.left=px<-dead;input.right=px>dead;input.up=py<-dead;input.down=py>dead}
function release(e){if(pointerId!==e.pointerId)return;e.preventDefault();pointerId=null;reset();try{ring.releasePointerCapture(e.pointerId)}catch(_){} }
ring.addEventListener('pointerdown',e=>{e.preventDefault();pointerId=e.pointerId;try{ring.setPointerCapture(pointerId)}catch(_){}move(e)},{passive:false});
ring.addEventListener('pointermove',move,{passive:false});ring.addEventListener('pointerup',release,{passive:false});ring.addEventListener('pointercancel',release,{passive:false});ring.addEventListener('lostpointercapture',reset);

// Las flechas usan exactamente el mismo V.input que teclado/joystick.
touch.querySelectorAll('button[data-key]').forEach(b=>{
  const k=b.dataset.key;
  b.addEventListener('pointerdown',e=>{e.preventDefault();try{b.setPointerCapture(e.pointerId)}catch(_){};input[k]=true},{passive:false});
  const off=e=>{if(e)e.preventDefault();input[k]=false;try{b.releasePointerCapture(e.pointerId)}catch(_){} };
  b.addEventListener('pointerup',off,{passive:false});b.addEventListener('pointercancel',off,{passive:false});b.addEventListener('lostpointercapture',()=>input[k]=false);
});

// Botón de interacción: el boot audit ya lo conecta al motor. No bloqueamos su click.
const action=document.getElementById('interact');if(action)action.setAttribute('aria-label','Interactuar / hablar / usar');

const actions=[['mobile-map','map','MAPA'],['mobile-missions','missions','MISIONES'],['mobile-bag','bag','MOCHILA'],['mobile-memory','memory','MEMORIA']];
let tools=touch.querySelector('.mobile-actions');if(tools)tools.remove();
tools=document.createElement('div');tools.className='mobile-actions';tools.setAttribute('aria-label','Acciones del juego');
function trigger(name){const target=document.querySelector(`#v4pTools [data-v4="${name}"]`);if(target){target.click();return}setTimeout(()=>document.querySelector(`#v4pTools [data-v4="${name}"]`)?.click(),100)}
actions.forEach(([id,name,label])=>{const b=document.createElement('button');b.id=id;b.type='button';b.textContent=label;b.setAttribute('aria-label',label);b.addEventListener('click',e=>{e.preventDefault();trigger(name)},{passive:false});tools.appendChild(b)});
touch.appendChild(tools);

for(const el of [pad,ring,tools])el.style.touchAction='none';
function showTip(){if(localStorage.getItem('villa_pelon_mobile_tip')==='1')return;localStorage.setItem('villa_pelon_mobile_tip','1');const d=document.createElement('div');d.className='mobile-tip';d.innerHTML='<b>CONTROLES</b><br>Joystick o flechas para caminar · E para hablar';document.body.appendChild(d);setTimeout(()=>d.classList.add('mobile-tip-hide'),3500);setTimeout(()=>d.remove(),4000)}
document.getElementById('startBtn')?.addEventListener('click',()=>setTimeout(showTip,250),{once:true});

// Si el usuario cambia joystick/flechas desde configuración, aplicarlo inmediatamente.
setInterval(()=>{const before=controls;applyMode();if(before!==controls)reset()},600);
window.addEventListener('blur',reset,{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)reset()},{passive:true});
V.mobile={version:3,joystick:true,arrows:true,directInteraction:true};
})();
