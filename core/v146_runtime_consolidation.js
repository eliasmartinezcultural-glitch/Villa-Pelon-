/* VILLA PELÓN V146/V147 — RUNTIME CONSOLIDADO + MATRIZ ÚNICA
   Una sola cadencia nativa de requestAnimationFrame y una matriz común de integración.
   No modifica geometría V138, edificios, río, puentes ni caminos.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const nativeRAF=window.requestAnimationFrame.bind(window);
const nativeCAF=window.cancelAnimationFrame?window.cancelAnimationFrame.bind(window):null;
const logical=[];let rafScheduled=false,rafSeq=0,intervalSeq=0;
window.setInterval=(fn,ms,...args)=>{const item={id:++intervalSeq,fn,ms:Math.max(16,Number(ms)||16),args,last:performance.now()};logical.push(item);return item.id};
window.clearInterval=id=>{const i=logical.findIndex(x=>x.id===id);if(i>=0)logical.splice(i,1)};
function runIntervals(now){for(const it of logical){if(now-it.last>=it.ms){it.last=now;try{it.fn(...it.args)}catch(e){console.error('[VillaPelon][interval]',e)}}}}
function schedule(){if(rafScheduled)return;rafScheduled=true;nativeRAF(ts=>{rafScheduled=false;runIntervals(ts);const q=queue.splice(0);for(const item of q){try{item.cb(ts)}catch(e){console.error('[VillaPelon][RAF]',e)}}if(q.length||logical.length)schedule()})}
const queue=[];
window.requestAnimationFrame=cb=>{const id=++rafSeq;queue.push({id,cb});schedule();return id};
window.cancelAnimationFrame=id=>{const i=queue.findIndex(x=>x.id===id);if(i>=0)queue.splice(i,1);else if(nativeCAF)nativeCAF(id)};
const M=V.matrix=V.matrix||{};M.version='147.0';M.geometryAuthority='V138';M.runtimeAuthority='V146';M.contentAuthority='V141';M.lifeAuthority='V142';M.identityAuthority='V145';M.visualAuthority='V131/V143/V144';M.sealed=true;
M.contracts={geometry:{sealed:true,owner:'V138'},state:{owner:'VillaPelon.gameState',shared:true},actors:{owner:'peopleVehicles.ambient',alias:'npcs',shared:true},render:{base:'world',detail:'worldDetail',singleScene:true}};
function audit(){const S=V.gameState;const A=Array.isArray(V.peopleVehicles?.ambient)?V.peopleVehicles.ambient:[];if(A.length)V.npcs=A;const d={version:'147.0',geometryLocked:true,sharedState:!!S,sharedActors:V.npcs===A,actors:A.length,movingActors:A.filter(a=>a&&a.moving).length,frameAuthority:'V146_SINGLE_NATIVE_RAF',runtimeVersion:'146/147',visualCanvas:!!document.getElementById('world'),detailCanvas:!!document.getElementById('worldDetail'),matrixConnected:true};M.diagnostics=d;V.runtimeAudit=Object.assign(V.runtimeAudit||{},d,{matrix:'V147'});document.documentElement.dataset.villaRuntime='147';document.documentElement.dataset.villaMatrix='147'}
M.audit=audit;M.repair=audit;setTimeout(audit,0);window.addEventListener('villa-pelon-engine-ready',audit);window.addEventListener('villa-pelon-runtime-repaired',audit);window.addEventListener('villa-pelon-professional-detail-ready',audit);window.addEventListener('villa-pelon-reactive-ready',audit);window.dispatchEvent(new CustomEvent('villa-pelon-runtime-consolidation-ready',{detail:{version:'147.0',geometryLocked:true}}));window.dispatchEvent(new CustomEvent('villa-pelon-matrix-ready',{detail:{version:'147.0',connected:true,geometryLocked:true}}));
})();
