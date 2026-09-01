/* Villa Pelón V4 — BOOT AUDIT 411
   Guardia final: verifica el contrato del motor y conecta controles táctiles.
   No crea motor, no crea RAF y no altera física/render.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const A=V.bootAudit={version:411,ok:true,errors:[],checks:{}};
const fail=(name,detail)=>{A.ok=false;A.errors.push(name+(detail?': '+detail:''));A.checks[name]=false};
const canvas=document.getElementById('world');
A.checks.canvas=!!canvas;
if(!canvas)fail('canvas','no existe #world');
A.checks.engine=!!V.engine;
if(!V.engine)fail('engine','V.engine no fue creado');
A.checks.context=!!(V.engine&&V.engine.ctx);
if(!A.checks.context)fail('context','contexto 2D no disponible');
A.checks.version=!!(V.state&&Number(V.state.version)===4);
if(V.state&&Number(V.state.version)!==4)fail('version','estado distinto de V4');
const interact=document.getElementById('interact');
if(interact&&!interact.dataset.v4Bound){
  interact.dataset.v4Bound='1';
  interact.addEventListener('pointerdown',e=>{e.preventDefault();V.engine?.interact?.()},{passive:false});
  interact.addEventListener('click',e=>{e.preventDefault()});
}
A.checks.touchInteract=!!interact;
if(!interact)fail('touchInteract','botón E no encontrado');
if(canvas){canvas.style.imageRendering='pixelated';canvas.style.imageRendering='crisp-edges'}
window.addEventListener('error',e=>{if(e&&e.message&&/Villa Pelón|V4/.test(String(e.message)))A.errors.push(String(e.message));},{once:false});
V.v4=V.v4||{};V.v4.bootAudit=A;
})();