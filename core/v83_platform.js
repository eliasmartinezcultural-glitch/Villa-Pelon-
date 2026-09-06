/* Villa Pelón V83 — plataforma real: móvil primero, un toque, compartir por WhatsApp y guardado resistente. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const VERSION='V83.0.0';
const SHARE_TEXT='Villa Pelón — una historia en juego. Explorá San Patricio del Chañar, hablá con vecinos y descubrí el territorio.';
const SHARE_URL=()=>location.href.split('#')[0];

function notify(text){
  let n=document.getElementById('vpToast');
  if(!n){n=document.createElement('div');n.id='vpToast';document.body.appendChild(n)}
  n.textContent=text;n.classList.add('show');clearTimeout(n._v83t);n._v83t=setTimeout(()=>n.classList.remove('show'),1900);
}

async function share(){
  const data={title:'Villa Pelón',text:SHARE_TEXT,url:SHARE_URL()};
  try{
    if(navigator.share){await navigator.share(data);return true}
    if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(SHARE_URL());notify('Enlace copiado. Pegalo en WhatsApp.');return true}
  }catch(e){if(e?.name==='AbortError')return false}
  notify('Copiá el enlace desde el navegador y compartilo por WhatsApp.');return false;
}

function addButton(parent,id,label,cls='vp-share-button'){
  if(!parent||document.getElementById(id))return;
  const b=document.createElement('button');b.id=id;b.type='button';b.className=cls;b.textContent=label;b.setAttribute('aria-label',label);b.addEventListener('click',e=>{e.preventDefault();share()});parent.appendChild(b);
}
function shareUI(){
  addButton(document.getElementById('introCard'),'introShare','COMPARTIR JUEGO');
  addButton(document.getElementById('game'),'gameShare','COMPARTIR');
}

/* Autoridad única de interacción táctil/teclado. game.js y controls.js conservan
   movimiento; este capture handler evita doble E/tap y ejecuta una sola interacción. */
function inputAuthority(){
  addEventListener('keydown',e=>{
    const k=String(e.key).toLowerCase();
    if(!['e',' '].includes(k))return;
    const s=V.gameState;if(!s?.started)return;
    e.preventDefault();e.stopImmediatePropagation();
    V.interact?.();
  },true);
  document.addEventListener('pointerdown',e=>{
    if(!e.target?.closest?.('#interact'))return;
    const s=V.gameState;if(!s?.started)return;
    e.preventDefault();e.stopImmediatePropagation();
    V.interact?.();
  },true);
}

function hardenStorage(){
  const s=V.gameState;if(!s)return;
  try{
    const probe='__vp_v83__';localStorage.setItem(probe,'1');localStorage.removeItem(probe);
    V.platform.storage='localStorage';
  }catch(_){V.platform.storage='unavailable'}
  V.platform.deviceLocalSave=true;
  V.platform.crossDeviceSave=false;
}
function boot(){
  V.platform={version:VERSION,share:true,whatsappReady:true,mobileFirst:true,deviceLocalSave:true,crossDeviceSave:false,storage:'unknown'};
  hardenStorage();shareUI();inputAuthority();
  document.documentElement.dataset.villaPelonPlatform=VERSION;
  console.info('[Villa Pelón]',VERSION,'OK — interacción única, compartir por enlace y móvil primero');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
