/* Villa Pelón V4 — MOBILE PRO / ANDROID
   Capa de compatibilidad móvil: viewport dinámico, rendimiento, gestos,
   orientación, pantalla completa, haptics y recuperación de foco.
   No crea un segundo motor ni un segundo RAF.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const root=document.documentElement, body=document.body, game=document.getElementById('game'), canvas=document.getElementById('world');
const mobile=matchMedia('(max-width:800px), (pointer:coarse)').matches;
if(!mobile)return;

root.classList.add('v4-mobile-device');
body.classList.add('v4-mobile-device');

// Mantener la interfaz pegada al viewport visual cuando Chrome Android cambia sus barras.
function viewport(){
  const vv=window.visualViewport;
  const w=vv?.width||innerWidth, h=vv?.height||innerHeight;
  root.style.setProperty('--v4-vw',w+'px');
  root.style.setProperty('--v4-vh',h+'px');
  root.style.setProperty('--v4-safe-top','env(safe-area-inset-top, 0px)');
  root.style.setProperty('--v4-safe-bottom','env(safe-area-inset-bottom, 0px)');
}
viewport();
addEventListener('resize',viewport,{passive:true});
addEventListener('orientationchange',()=>setTimeout(viewport,120),{passive:true});
window.visualViewport?.addEventListener('resize',viewport,{passive:true});

// Evitar zoom accidental y menús contextuales durante la partida, sin bloquear botones normales.
canvas?.addEventListener('contextmenu',e=>e.preventDefault());
let lastTouch=0;
document.addEventListener('touchend',e=>{
  const now=Date.now();
  if(now-lastTouch<280 && e.target.closest('#world,.touch-controls,.v4MenuCard,.v4p-panel'))e.preventDefault();
  lastTouch=now;
},{passive:false});

// Vibración corta: feedback táctil sin audio obligatorio.
function haptic(ms=10){try{navigator.vibrate?.(ms)}catch(_){} }
for(const selector of ['#interact','.mobile-actions button','#save','.v4MenuCard button','.v4p-panel button','#dialogueNext']){
  document.addEventListener('pointerdown',e=>{if(e.target.closest(selector))haptic(8)},{passive:true});
}

// Liberar todas las direcciones al perder foco, cambiar de app u orientación.
function release(){const i=V.input;if(!i)return;i.up=i.down=i.left=i.right=false;}
addEventListener('blur',release,{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)release()},{passive:true});
addEventListener('pointercancel',release,{passive:true});

// Pantalla completa opcional: útil en Android y no se fuerza al usuario.
let wakeLock=null;
async function fullscreen(){
  try{if(!document.fullscreenElement&&document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen({navigationUI:'hide'});}catch(_){}
  try{if('orientation' in screen&&screen.orientation?.lock)await screen.orientation.lock('landscape');}catch(_){}
  try{if('wakeLock' in navigator)wakeLock=await navigator.wakeLock.request('screen');}catch(_){}
  haptic(12);
}
document.getElementById('startBtn')?.addEventListener('click',fullscreen,{once:true});
document.addEventListener('visibilitychange',async()=>{if(!document.hidden&&game&&!game.classList.contains('hidden')){try{if('wakeLock' in navigator&&!wakeLock)wakeLock=await navigator.wakeLock.request('screen')}catch(_){} }},{passive:true});

// Rendimiento: limita el framebuffer en teléfonos de alta densidad. La lógica del juego sigue igual.
function tuneCanvas(){
  if(!canvas)return;
  const low=localStorage.getItem('villa_pelon_v4_settings')?.includes('"quality":"battery"');
  const d=Math.min(devicePixelRatio||1,low?1:1.5);
  const w=Math.max(1,Math.round(innerWidth*d)),h=Math.max(1,Math.round(innerHeight*d));
  if(canvas.width!==w||canvas.height!==h){
    canvas.width=w;canvas.height=h;canvas.style.width='100%';canvas.style.height='100%';
    const c=canvas.getContext('2d');c?.setTransform(d,0,0,d,0,0);if(c)c.imageSmoothingEnabled=false;
  }
}
setTimeout(tuneCanvas,0);setTimeout(tuneCanvas,250);addEventListener('resize',()=>setTimeout(tuneCanvas,0),{passive:true});

// PWA/install: conserva el evento para ofrecer instalación desde el menú V4 si se desea.
let deferredInstall=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;V.mobileInstall={available:true,prompt:async()=>{if(!deferredInstall)return false;deferredInstall.prompt();try{await deferredInstall.userChoice}catch(_){}deferredInstall=null;return true}}},{passive:false});
addEventListener('appinstalled',()=>{deferredInstall=null;V.mobileInstall={available:false,installed:true}});

V.mobilePro={version:1,android:true,viewport:true,fullscreen:true,haptics:true,performance:true};
})();
