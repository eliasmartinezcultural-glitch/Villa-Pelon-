/* Villa Pelón V87.6 — AUDITORÍA PROFUNDA + HARDENING
   Objetivo: cerrar fallos de integración sin ampliar el mapa.
   - una sola capa visual principal: elimina overlays duplicados de V87.3/V87.4
   - persiste/restaura el estado de la misión q05 dentro del guardado existente
   - evita doble interacción táctil E + click
   - refuerza controles móviles y viewport seguro
   - preflight visible ante fallos críticos, sin dependencias externas
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const $=id=>document.getElementById(id);
const state=()=>V.gameState;

function hardenMobile(){
 const style=document.createElement('style');style.id='v876HardeningStyle';style.textContent=`
 html,body{width:100%;min-height:100%;margin:0;overscroll-behavior:none;background:#dcecf0}
 body{overflow:hidden;touch-action:none;-webkit-tap-highlight-color:transparent}
 #app,#game{width:100%;min-height:100dvh}
 #world{display:block;touch-action:none;user-select:none;-webkit-user-select:none}
 .touch,.touch button,#interact,#save,[data-main-tool],#dialogueNext,#startBtn{touch-action:none;user-select:none;-webkit-user-select:none}
 .touch button{min-width:54px;min-height:54px}
 #interact{min-width:62px;min-height:62px}
 @media(max-width:600px){.hud{padding-top:max(7px,env(safe-area-inset-top));padding-left:max(8px,env(safe-area-inset-left));padding-right:max(8px,env(safe-area-inset-right));gap:5px;font-size:11px}.quest{bottom:max(88px,calc(78px + env(safe-area-inset-bottom)));max-width:calc(100vw - 24px)}.touch{bottom:max(14px,env(safe-area-inset-bottom));}.save{bottom:max(14px,env(safe-area-inset-bottom));}}
 `;document.head.appendChild(style);
}

// El V87.3/V87.4 histórico creó canvases de detalle independientes. La autoridad
// visual queda en game.js + V85, evitando personajes/ambiente dibujados dos veces.
function removeDuplicateLayers(){
 ['v873Details','worldDetail'].forEach(id=>$(id)?.remove());
 $('territoryTime')?.remove();
}

// El botón móvil de interacción tenía pointerdown en game.js y click en V87.4:
// una pulsación podía ejecutar dos acciones. El capture siguiente bloquea el click
// posterior y conserva el pointerdown del motor principal.
function preventDoubleInteract(){
 const b=$('interact');if(!b)return;
 b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation()},true);
}

function missionPersistence(){
 const s=state();const q=V.territoryMissions?.q05;if(!s||!q)return;
 s.v87Missions=s.v87Missions||{};
 const saved=s.v87Missions.q05;
 if(saved){q.step=Number.isFinite(saved.step)?saved.step:0;q.status=saved.status||'available'}
 const sync=()=>{s.v87Missions.q05={step:q.step,status:q.status}};
 ['receiveDni','boardPicada21','deliverDni'].forEach(name=>{
  const fn=V.playerActions?.[name];if(typeof fn!=='function')return;
  V.playerActions[name]=function(){const result=fn.apply(this,arguments);sync();return result};
 });
 sync();
 window.addEventListener('beforeunload',sync,{passive:true});
 V.auditMissionPersistence={sync,version:'V87.6.0'};
}

function preflight(){
 const problems=[];
 if(!$('world'))problems.push('Canvas principal ausente');
 if(!V.gameState)problems.push('Estado del juego ausente');
 const W=V.worldAuthority?.geometry||V.worldGeometry;
 if(!W||W.width!==8000||W.height!==5200)problems.push('Mundo canónico fuera de 8000×5200');
 if(!Array.isArray(W?.roads)||!Array.isArray(W?.buildings))problems.push('Geometría territorial incompleta');
 if(!problems.length)return;
 const box=document.createElement('div');box.id='v876Preflight';box.setAttribute('role','alert');box.innerHTML='<strong>Villa Pelón no pudo completar la carga.</strong><span>'+problems.join(' · ')+'</span><small>Recargá el enlace. No hace falta instalar nada.</small>';
 box.style.cssText='position:fixed;inset:0;z-index:10000;display:grid;place-content:center;gap:10px;padding:24px;background:#f4ead6;color:#33403a;font:16px system-ui;text-align:center';box.querySelector('span').style.cssText='max-width:520px';box.querySelector('small').style.cssText='opacity:.72';document.body.appendChild(box);
}

hardenMobile();
removeDuplicateLayers();
preventDoubleInteract();
missionPersistence();
preflight();
V.audit={version:'V87.6.0',worldLocked:true,singleVisualLayer:true,mobileHardened:true,missionPersistence:true,preflight:true};
window.dispatchEvent(new CustomEvent('villa-pelon-audit-hardened',{detail:V.audit}));
})();
