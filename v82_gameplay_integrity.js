/* Villa Pelón V82.1 — integridad transversal de jugabilidad.
   Coordina menú, pausa, configuración, teclado y seguridad de entrada.
   No reemplaza el motor ni las autoridades anteriores.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.gameState;
const KEY='villa_pelon_settings';
let cfg={language:'es',music:true,sfx:true,controls:'wasd',reducedMotion:false};
try{cfg={...cfg,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(_){}
const saveCfg=()=>{try{localStorage.setItem(KEY,JSON.stringify(cfg))}catch(_) {}};
const $=id=>document.getElementById(id);
function toast(t){let n=$('vpToast');if(!n){n=document.createElement('div');n.id='vpToast';document.body.appendChild(n)}n.textContent=t;n.classList.add('show');clearTimeout(n._t);n._t=setTimeout(()=>n.classList.remove('show'),1700)}
function menuOpen(){return !!($('vpMenu')&&!$('vpMenu').classList.contains('hidden'))}
function dialogueOpen(){const d=$('dialogue');return !!(d&&!d.classList.contains('hidden'))}
function openMenu(){const m=$('vpMenu');if(!m)return;m.classList.remove('hidden');if(S){S._menuPaused=true;S._dialogueBeforeMenu=dialogueOpen();S.dialogue=true}document.querySelectorAll('.touch button,.save').forEach(b=>b.blur());renderSettings()}
function closeMenu(){const m=$('vpMenu');if(!m)return;m.classList.add('hidden');if(S){const wasDialogue=!!S._dialogueBeforeMenu;S._menuPaused=false;S._dialogueBeforeMenu=false;S.dialogue=wasDialogue}}
function toggleMenu(){menuOpen()?closeMenu():openMenu()}
function ensureMenu(){
 const m=$('vpMenu');if(!m)return;
 let panel=m.querySelector('.vp-panel');if(!panel)return;
 if(!$('vpSettings')){const box=document.createElement('div');box.id='vpSettings';box.style.cssText='border-top:1px solid rgba(225,211,164,.22);padding-top:8px;margin-top:2px;display:grid;gap:7px';box.innerHTML='<div style="font-size:11px;letter-spacing:2px;opacity:.7">CONFIGURACIÓN</div><button type="button" data-v82="sfx"></button><button type="button" data-v82="motion"></button><button type="button" data-v82="controls"></button>';const help=panel.querySelector('.vp-help');panel.insertBefore(box,help)}
 if(!$('vpControls')){const h=document.createElement('div');h.id='vpControls';h.className='vp-help';h.style.display='block';h.innerHTML='<strong>CONTROLES</strong><br>WASD / Flechas: caminar · E / Espacio: interactuar<br>ESC / M: menú · P: pausa<br>Móvil: mantené presionada una dirección';panel.insertBefore(h,panel.querySelector('.vp-help'))}
 if(!m.dataset.v82Bound){m.dataset.v82Bound='1';m.addEventListener('click',e=>{const b=e.target.closest('[data-v82]');if(!b)return;const a=b.dataset.v82;if(a==='sfx'){cfg.sfx=!cfg.sfx;saveCfg();toast('Efectos: '+(cfg.sfx?'ACTIVADOS':'DESACTIVADOS'));renderSettings()}else if(a==='motion'){cfg.reducedMotion=!cfg.reducedMotion;saveCfg();document.documentElement.dataset.reducedMotion=cfg.reducedMotion?'1':'0';toast('Animaciones: '+(cfg.reducedMotion?'REDUCIDAS':'NORMALES'));renderSettings()}else if(a==='controls'){cfg.controls=cfg.controls==='wasd'?'arrows':'wasd';saveCfg();toast('Movimiento preferido: '+(cfg.controls==='wasd'?'WASD':'FLECHAS'));renderSettings()}})}
}
function renderSettings(){const m=$('vpMenu');if(!m)return;ensureMenu();const s=$('vpSettings');if(!s)return;const q=(x,t)=>{const b=s.querySelector('[data-v82='+x+']');if(b)b.textContent=t};q('sfx','EFECTOS: '+(cfg.sfx?'ACTIVADOS':'DESACTIVADOS'));q('motion','ANIMACIONES: '+(cfg.reducedMotion?'REDUCIDAS':'NORMALES'));q('controls','MOVIMIENTO PREFERIDO: '+(cfg.controls==='wasd'?'WASD':'FLECHAS'));const h=$('vpControls');if(h)h.style.display='block'}
function keyboard(){
 addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d',' ','e'].includes(k))e.preventDefault();
  if(k==='escape'||k==='m'){e.preventDefault();if(e.repeat)return;toggleMenu();return}
  if(k==='p'){e.preventDefault();if(e.repeat)return;toggleMenu();return}
  if(menuOpen())return;
 },{capture:true});
 addEventListener('blur',()=>{if(S){S._menuPaused=false;S.dialogue=dialogueOpen()}});
}
function touchSafety(){document.querySelectorAll('[data-key]').forEach(b=>{b.addEventListener('contextmenu',e=>e.preventDefault());b.addEventListener('pointerdown',()=>b.classList.add('pressed'),{passive:true});['pointerup','pointercancel','pointerleave','lostpointercapture'].forEach(x=>b.addEventListener(x,()=>b.classList.remove('pressed'),{passive:true}))})}
function repairStart(){if(!S)return;S.started=!!S.started;S.facing=['up','down','left','right'].includes(S.facing)?S.facing:'down';S.energy=Math.max(0,Math.min(100,Number(S.energy)||100));S.money=Number.isFinite(Number(S.money))?Number(S.money):10000}
function boot(){ensureMenu();keyboard();touchSafety();repairStart();document.documentElement.dataset.reducedMotion=cfg.reducedMotion?'1':'0';setTimeout(renderSettings,0);V.gameplay82={version:'82.1.0',settings:cfg,pause:openMenu,resume:closeMenu};}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
