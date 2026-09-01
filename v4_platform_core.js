/* Villa Pelón V4 — PLATFORM CORE 418
   Capa final de plataforma: PC + móvil.
   No crea otro motor ni otro RAF. Centraliza entrada, viewport, pausa, calidad y accesibilidad.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const root=document.documentElement, body=document.body;
const canvas=document.getElementById('world');
if(!canvas)return;
const touch=matchMedia('(pointer:coarse)').matches||innerWidth<=900;
const qs=s=>document.querySelector(s);
const settings=()=>{try{return JSON.parse(localStorage.getItem('villa_pelon_v4_settings')||'{}')}catch(_){return {}}};

root.style.setProperty('--vh','100vh');
function viewport(){
  const vv=window.visualViewport;
  const h=vv?vv.height:innerHeight;
  root.style.setProperty('--vh',h+'px');
  root.style.setProperty('--vw',(vv?vv.width:innerWidth)+'px');
}
viewport(); addEventListener('resize',viewport,{passive:true}); visualViewport?.addEventListener('resize',viewport,{passive:true});

// Nunca permite scroll/zoom accidental durante la partida, pero deja formularios y enlaces funcionales.
canvas.addEventListener('contextmenu',e=>e.preventDefault());
canvas.style.touchAction='none';

function resetInput(){const i=V.input;if(!i)return; i.up=i.down=i.left=i.right=false;}
addEventListener('blur',resetInput,{passive:true});
document.addEventListener('visibilitychange',()=>{resetInput();body.classList.toggle('v4-paused',document.hidden)},{passive:true});

// Entrada de teclado robusta para PC. El motor sigue siendo el dueño de V.input.
const keys=new Map([['ArrowUp','up'],['w','up'],['W','up'],['ArrowDown','down'],['s','down'],['S','down'],['ArrowLeft','left'],['a','left'],['A','left'],['ArrowRight','right'],['d','right'],['D','right']]);
addEventListener('keydown',e=>{const k=keys.get(e.key);if(k){e.preventDefault();if(V.input)V.input[k]=true}},{passive:false});
addEventListener('keyup',e=>{const k=keys.get(e.key);if(k){e.preventDefault();if(V.input)V.input[k]=false}},{passive:false});

// Botón de interacción universal: E, Enter, Space y control táctil.
function interact(){try{if(typeof V.engine?.interact==='function')return V.engine.interact();}catch(_){} try{const b=qs('#interact');if(b)b.click()}catch(_){} }
addEventListener('keydown',e=>{if(e.repeat)return;if(['e','E','Enter',' '].includes(e.key)){if([' ','Enter'].includes(e.key))e.preventDefault();interact()}},{passive:false});

// Controles táctiles: siempre visibles en touch y siempre conectados al mismo estado del motor.
function bindTouch(){
  document.querySelectorAll('[data-key]').forEach(btn=>{
    if(btn.dataset.platformBound)return; btn.dataset.platformBound='1';
    const key=btn.dataset.key;
    const down=e=>{e.preventDefault();if(V.input)V.input[key]=true;try{btn.setPointerCapture(e.pointerId)}catch(_){} };
    const up=e=>{e.preventDefault();if(V.input)V.input[key]=false};
    btn.addEventListener('pointerdown',down,{passive:false});
    ['pointerup','pointercancel','pointerleave','lostpointercapture'].forEach(ev=>btn.addEventListener(ev,up,{passive:false}));
  });
}
bindTouch();

// Joystick virtual independiente de librerías externas, usando el mismo V.input.
function installJoystick(){
  if(!touch||document.querySelector('.platform-stick'))return;
  const el=document.createElement('div'); el.className='platform-stick';
  el.innerHTML='<div class="platform-stick-ring"><div class="platform-stick-knob"></div></div>';
  body.appendChild(el);
  const ring=el.firstElementChild,knob=ring.firstElementChild; let pid=null;
  const move=e=>{if(pid!==e.pointerId)return;const r=ring.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let x=e.clientX-cx,y=e.clientY-cy,max=r.width*.31,d=Math.hypot(x,y);if(d>max){x=x/d*max;y=y/d*max}knob.style.transform=`translate(${x}px,${y}px)`;if(V.input){V.input.left=x<-max*.22;V.input.right=x>max*.22;V.input.up=y<-max*.22;V.input.down=y>max*.22} };
  const end=e=>{if(pid!==e.pointerId)return;pid=null;knob.style.transform='translate(0,0)';resetInput()};
  ring.addEventListener('pointerdown',e=>{e.preventDefault();pid=e.pointerId;try{ring.setPointerCapture(pid)}catch(_){}move(e)},{passive:false});
  ring.addEventListener('pointermove',move,{passive:false});
  ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>ring.addEventListener(ev,end,{passive:false}));
}
installJoystick();

// Si el selector de configuración cambia, la capa visual responde sin recargar.
function applyMode(){
  const s=settings();
  body.classList.toggle('platform-touch',touch);
  body.classList.toggle('platform-pc',!touch);
  body.classList.toggle('platform-low',s.quality==='low'||s.quality==='battery');
  body.classList.toggle('platform-high',s.quality!=='low'&&s.quality!=='battery');
  const label=qs('#platformHint');
  if(label)label.textContent=touch?'Joystick / flechas · E para interactuar':'WASD / flechas · E o ESPACIO para interactuar';
}
applyMode(); setInterval(applyMode,800);

// Diagnóstico visible solo por consola; útil para detectar regresiones sin romper la partida.
V.platform={version:418,touch,pc:!touch,sharedInput:true,viewport:true,keyboard:true,joystick:true,controls:true};
console.info('[Villa Pelón] Platform Core 418',V.platform);
})();