/* VILLA PELÓN V160 — CAPA DE AJUSTES
   No crea un nuevo motor, renderer, geometría ni autoridad de juego.
   Lee las autoridades consolidadas y aplica únicamente ajustes seguros de presentación,
   UX, accesibilidad, diagnóstico y tolerancia de runtime.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const root=document.documentElement;
const body=document.body;
const state={version:'160.0',authority:'ADJUSTMENT_OVERLAY',applied:[],warnings:[],blocked:[]};
const mark=(k,v=true)=>{state.applied.push(k);root.dataset['vp160'+k]=String(v)};

/* 1. NO INTERVENIR si el runtime todavía no está listo. */
if(!V){state.blocked.push('NO_RUNTIME');return;}

/* 2. Contrato visual: ajustes por CSS variables, sin tocar el compositor. */
root.style.setProperty('--vp-ui-safe-top','env(safe-area-inset-top, 0px)');
root.style.setProperty('--vp-ui-safe-bottom','env(safe-area-inset-bottom, 0px)');
root.style.setProperty('--vp-touch-size','44px');
root.style.setProperty('--vp-panel-max','min(92vw, 760px)');
mark('VISUAL_TOKENS');

/* 3. Controles: evitar doble interacción y hacerlos explícitamente táctiles. */
['presentationStart','dialogueNext','interact','save'].forEach(id=>{const el=document.getElementById(id);if(el){el.setAttribute('type','button');el.setAttribute('touch-action','manipulation');el.style.touchAction='manipulation'}});
document.querySelectorAll('.touch button').forEach(el=>{el.style.touchAction='none';el.setAttribute('aria-label',el.getAttribute('aria-label')||'Control de movimiento')});
mark('INPUT_GUARD');

/* 4. Canvas: impedir escalados accidentales que generen sensación de renderer duplicado. */
['world','worldDetail'].forEach(id=>{const c=document.getElementById(id);if(c){c.style.imageRendering='pixelated';c.style.touchAction='none'}});
mark('PIXEL_CANVAS');

/* 5. HUD: datos críticos siempre visibles sin alterar el game state. */
const hud=document.querySelector('.hud');if(hud){hud.setAttribute('role','status');hud.setAttribute('aria-live','polite')}
const quest=document.querySelector('.quest');if(quest){quest.setAttribute('aria-live','polite')}
mark('HUD_ACCESSIBILITY');

/* 6. Diagnóstico de autoridad: detecta accidentalmente más de un loop RAF propio. */
const rafGuard={version:'160.0',singleRAF:V.engine?.singleVisualFrame===true||V.renderCompositor?.singleRAF===true,terrainOwner:V.renderCompositor?.ownsTerrain===false,playerOwner:V.renderCompositor?.ownsPlayer===true};
if(!rafGuard.singleRAF)state.warnings.push('SINGLE_RAF_NOT_CONFIRMED');
if(rafGuard.terrainOwner!==true)state.warnings.push('TERRAIN_OWNER_NOT_CONFIRMED');
if(rafGuard.playerOwner!==true)state.warnings.push('PLAYER_OWNER_NOT_CONFIRMED');
V.adjustmentLayer={...state,rafGuard};

/* 7. Modo seguro de foco: no permitir que teclas de juego rompan formularios/dialogos. */
document.addEventListener('keydown',e=>{
 const t=e.target;
 if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable))return;
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','Enter'].includes(e.key)){
   const d=document.getElementById('dialogue');
   if(d&&!d.classList.contains('hidden')&&e.key==='Enter'){document.getElementById('dialogueNext')?.click();e.preventDefault();}
 }
},{passive:false});
mark('KEYBOARD_SAFE_FOCUS');

/* 8. Recalibración responsive no invasiva. */
const fit=()=>{root.style.setProperty('--vp-vh',`${window.innerHeight}px`);root.style.setProperty('--vp-vw',`${window.innerWidth}px`)};
fit();window.addEventListener('resize',fit,{passive:true});window.addEventListener('orientationchange',fit,{passive:true});
mark('RESPONSIVE_CALIBRATION');

/* 9. Evitar que la capa agregue autoridad si el sistema está bloqueado. */
const sealed=V.systemFloor?.sealed===true||V.v159?.status==='SEALED';
state.systemSealed=sealed;
if(!sealed)state.warnings.push('SYSTEM_FLOOR_NOT_SEALED');
state.status=state.blocked.length?'BLOCKED':state.warnings.length?'ADJUSTED_WITH_WARNINGS':'ADJUSTED';
V.adjustmentLayer=Object.assign(V.adjustmentLayer,state);
V.runtimeAudit=Object.assign(V.runtimeAudit||{},{adjustmentLayer160:true,adjustmentStatus:state.status,adjustmentWarnings:state.warnings.length});
window.dispatchEvent(new CustomEvent('villa-pelon-adjustment-layer-ready',{detail:V.adjustmentLayer}));
})();
