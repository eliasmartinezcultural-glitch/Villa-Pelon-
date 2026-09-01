/* Villa Pelón V4 — PLATFORM CORE 418
   PC + MOBILE. The main engine owns gameplay/input; this layer only adds platform-safe behavior.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),root=document.documentElement,body=document.body,canvas=document.getElementById('world');
if(!canvas)return;
const touch=matchMedia('(pointer:coarse)').matches||innerWidth<=900;
const settings=()=>{try{return JSON.parse(localStorage.getItem('villa_pelon_v4_settings')||'{}')}catch(_){return {}}};
function viewport(){const vv=window.visualViewport;root.style.setProperty('--vh',(vv?vv.height:innerHeight)+'px');root.style.setProperty('--vw',(vv?vv.width:innerWidth)+'px')}
viewport();addEventListener('resize',viewport,{passive:true});visualViewport?.addEventListener('resize',viewport,{passive:true});
canvas.addEventListener('contextmenu',e=>e.preventDefault());canvas.style.touchAction='none';
function resetInput(){const i=V.input;if(i)i.up=i.down=i.left=i.right=false}
addEventListener('blur',resetInput,{passive:true});document.addEventListener('visibilitychange',()=>{resetInput();body.classList.toggle('v4-paused',document.hidden)},{passive:true});

// No duplica teclado ni interacción: game.js sigue siendo la única autoridad de entrada de PC.
function bindTouch(){document.querySelectorAll('[data-key]').forEach(btn=>{if(btn.dataset.platformBound)return;btn.dataset.platformBound='1';const key=btn.dataset.key;const down=e=>{e.preventDefault();if(V.input)V.input[key]=true;try{btn.setPointerCapture(e.pointerId)}catch(_){}},up=e=>{if(e) e.preventDefault();if(V.input)V.input[key]=false};btn.addEventListener('pointerdown',down,{passive:false});['pointerup','pointercancel','pointerleave','lostpointercapture'].forEach(ev=>btn.addEventListener(ev,up,{passive:false}))})}
bindTouch();
function installJoystick(){if(!touch||document.querySelector('.platform-stick'))return;const el=document.createElement('div');el.className='platform-stick';el.innerHTML='<div class="platform-stick-ring"><div class="platform-stick-knob"></div></div>';body.appendChild(el);const ring=el.firstElementChild,knob=ring.firstElementChild;let pid=null;const move=e=>{if(pid!==e.pointerId)return;const r=ring.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let x=e.clientX-cx,y=e.clientY-cy,max=r.width*.31,d=Math.hypot(x,y);if(d>max){x=x/d*max;y=y/d*max}knob.style.transform=`translate(${x}px,${y}px)`;if(V.input){V.input.left=x<-max*.22;V.input.right=x>max*.22;V.input.up=y<-max*.22;V.input.down=y>max*.22}};const end=e=>{if(pid!==e.pointerId)return;pid=null;knob.style.transform='translate(0,0)';resetInput()};ring.addEventListener('pointerdown',e=>{e.preventDefault();pid=e.pointerId;try{ring.setPointerCapture(pid)}catch(_){}move(e)},{passive:false});ring.addEventListener('pointermove',move,{passive:false});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>ring.addEventListener(ev,end,{passive:false}))}
installJoystick();
function applyMode(){const s=settings();body.classList.toggle('platform-touch',touch);body.classList.toggle('platform-pc',!touch);body.classList.toggle('platform-low',s.quality==='low'||s.quality==='battery');body.classList.toggle('platform-high',s.quality!=='low'&&s.quality!=='battery');const h=document.getElementById('platformHint');if(h)h.textContent=touch?'Joystick / flechas · E para interactuar':'WASD / flechas · E o ESPACIO para interactuar'}
applyMode();setInterval(applyMode,800);V.platform={version:418,touch,pc:!touch,sharedInput:true,viewport:true,joystick:true,controls:true};console.info('[Villa Pelón] Platform Core 418',V.platform);
})();