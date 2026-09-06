/* V62 REFERENCE FUNCTIONAL GUARD — capa final de seguridad.
   No crea un motor ni un loop. Sólo protege entrada, boot, guardado y UI básica.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const required=['world','startBtn','interact','save'];
const missing=required.filter(id=>!document.getElementById(id));
V.v62Guard={version:'V87.13',reference:'V62-worldplay-core',missing,ready:false};

// Evita teclas pegadas en móvil/PC cuando la pestaña pierde foco.
const release=()=>document.querySelectorAll('[data-key]').forEach(b=>{b.classList.remove('pressed');});
addEventListener('blur',release,{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)release()},{passive:true});

// El diálogo tiene prioridad sobre el movimiento: evita avanzar accidentalmente mientras se lee.
document.addEventListener('keydown',e=>{
 const d=document.getElementById('dialogue');
 if(d&&!d.classList.contains('hidden')&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(e.key)){e.preventDefault();e.stopImmediatePropagation();}
},{capture:true});

// Guardado de emergencia al abandonar la página, respetando la autoridad existente.
addEventListener('pagehide',()=>{try{if(typeof V.saveGame==='function'&&V.gameState?.started)V.saveGame();}catch(_){}},{passive:true});

// Marca de build visible, sin interferir con el HUD.
const badge=()=>{let el=document.getElementById('versionBadge');if(!el){el=document.createElement('div');el.id='versionBadge';document.body.appendChild(el)}el.textContent='V87.13 · V62 REFERENCE';el.style.cssText='position:fixed;right:8px;bottom:7px;z-index:9999;padding:4px 7px;background:rgba(17,23,17,.9);border:1px solid rgba(209,174,75,.45);color:#d9c27a;font:700 9px monospace;letter-spacing:.7px;pointer-events:none';};
const ready=()=>{V.v62Guard.ready=missing.length===0&&!!document.getElementById('world');badge();window.dispatchEvent(new CustomEvent('villa-pelon-v62-guard-ready',{detail:V.v62Guard}));};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
