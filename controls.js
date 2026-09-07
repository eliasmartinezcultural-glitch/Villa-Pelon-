/* VILLA PELÓN V63 — autoridad única de entrada móvil.
   Este módulo traduce pointer/touch a teclado sintético.
   game.js conserva la autoridad de movimiento; sus listeners táctiles heredados
   quedan bloqueados por stopImmediatePropagation para evitar doble entrada.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const keys={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'};
const active=new Map();
function dispatch(type,key){window.dispatchEvent(new KeyboardEvent(type,{key,code:key,bubbles:true,cancelable:true}))}
function release(button){const key=active.get(button);if(!key)return;active.delete(button);button.classList.remove('pressed');dispatch('keyup',key)}
document.querySelectorAll('[data-key]').forEach(button=>{
 button.addEventListener('pointerdown',e=>{e.preventDefault();e.stopImmediatePropagation();const key=keys[button.dataset.key];if(!key||active.has(button))return;active.set(button,key);button.classList.add('pressed');try{button.setPointerCapture(e.pointerId)}catch(_){}dispatch('keydown',key)},{passive:false});
 ['pointerup','pointercancel','lostpointercapture'].forEach(type=>button.addEventListener(type,e=>{e.preventDefault?.();e.stopImmediatePropagation();release(button)},{passive:false}));
 button.addEventListener('contextmenu',e=>e.preventDefault());
});
window.addEventListener('blur',()=>[...active.keys()].forEach(release));
document.addEventListener('visibilitychange',()=>{if(document.hidden)[...active.keys()].forEach(release)});
V.controls={version:'63.0.0',mode:'pointer-keyboard-bridge',singleInputAuthority:true};
})();
