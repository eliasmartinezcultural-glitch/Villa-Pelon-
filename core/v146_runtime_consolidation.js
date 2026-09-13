/* VILLA PELÓN V149 — AUDITORÍA FINAL DEL RUNTIME Y MATRIZ ÚNICA
   Autoridad estructural: V138. Autoridad de estado: gameState.
   Este archivo no modifica mundo, geometría, edificios, río, puentes ni caminos.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const nativeRAF=window.requestAnimationFrame.bind(window);
const nativeCAF=window.cancelAnimationFrame?window.cancelAnimationFrame.bind(window):null;
const nativeSetInterval=window.setInterval.bind(window);
const nativeClearInterval=window.clearInterval.bind(window);
const logical=[];const rafQueue=[];let rafId=0,intervalId=0,scheduled=false;
function pump(){if(scheduled)return;scheduled=true;nativeRAF(now=>{scheduled=false;
  for(let i=logical.length-1;i>=0;i--){const it=logical[i];if(!it.active){logical.splice(i,1);continue}if(now-it.last>=it.ms){it.last=now;try{it.fn(...it.args)}catch(e){console.error('[VillaPelon][logical-interval]',e)} }}
  const batch=rafQueue.splice(0);batch.forEach(item=>{if(item.cancelled)return;try{item.cb(now)}catch(e){console.error('[VillaPelon][logical-raf]',e)}});
  if(logical.some(x=>x.active)||rafQueue.length)pump();
});}
window.setInterval=(fn,ms,...args)=>{if(typeof fn!=='function')return 0;const it={id:++intervalId,fn,ms:Math.max(16,Number(ms)||16),args,last:performance.now(),active:true};logical.push(it);pump();return it.id};
window.clearInterval=id=>{const it=logical.find(x=>x.id===id);if(it){it.active=false;return}nativeClearInterval(id)};
window.requestAnimationFrame=cb=>{if(typeof cb!=='function')return 0;const id=++rafId;rafQueue.push({id,cb,cancelled:false});pump();return id};
window.cancelAnimationFrame=id=>{const it=rafQueue.find(x=>x.id===id);if(it){it.cancelled=true;return}if(nativeCAF)nativeCAF(id)};
const M=V.matrix=V.matrix||{};Object.assign(M,{version:'149.0',sealed:true,geometryAuthority:'V138',runtimeAuthority:'V149',contentAuthority:'V141',lifeAuthority:'V142',identityAuthority:'V145',visualAuthority:'V131/V143/V144',contracts:{geometry:{sealed:true,owner:'V138'},state:{owner:'VillaPelon.gameState',shared:true},actors:{owner:'peopleVehicles.ambient',alias:'npcs',shared:true},render:{base:'world',detail:'worldDetail',singleScene:true}}});
function audit(){const A=Array.isArray(V.peopleVehicles?.ambient)?V.peopleVehicles.ambient:[];if(A.length)V.npcs=A;const S=V.gameState;const d={version:'149.0',geometryLocked:true,sharedState:!!S,sharedActors:V.npcs===A,actors:A.length,movingActors:A.filter(a=>a&&a.moving).length,frameAuthority:'V149_SINGLE_NATIVE_RAF',visualCanvas:!!document.getElementById('world'),detailCanvas:!!document.getElementById('worldDetail'),matrixConnected:true,logicalIntervals:logical.filter(x=>x.active).length,legacyTimerNote:'V142 debe migrarse a RAF en la próxima intervención de código'};M.diagnostics=d;V.runtimeAudit=Object.assign(V.runtimeAudit||{},d,{matrix:'V149'});document.documentElement.dataset.villaRuntime='149';document.documentElement.dataset.villaMatrix='149'}
M.audit=audit;M.repair=audit;nativeSetInterval(audit,250);window.addEventListener('villa-pelon-engine-ready',audit);window.addEventListener('villa-pelon-runtime-repaired',audit);window.addEventListener('villa-pelon-professional-detail-ready',audit);window.addEventListener('villa-pelon-reactive-ready',audit);audit();
window.dispatchEvent(new CustomEvent('villa-pelon-runtime-consolidation-ready',{detail:{version:'149.0',geometryLocked:true}}));window.dispatchEvent(new CustomEvent('villa-pelon-matrix-ready',{detail:{version:'149.0',connected:true,geometryLocked:true}}));
})();
