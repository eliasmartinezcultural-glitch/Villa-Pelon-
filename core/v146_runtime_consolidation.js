/* VILLA PELÓN V146/V147/V148 — RUNTIME CONSOLIDADO + MATRIZ ÚNICA
   Una sola cadencia nativa de requestAnimationFrame y una matriz común de integración.
   No modifica geometría V138, edificios, río, puentes ni caminos.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const nativeRAF=window.requestAnimationFrame.bind(window);
const nativeCAF=window.cancelAnimationFrame?window.cancelAnimationFrame.bind(window):null;
const nativeSetInterval=window.setInterval.bind(window);
const nativeClearInterval=window.clearInterval.bind(window);
const logical=[];let rafScheduled=false,rafSeq=0,intervalSeq=0;
window.setInterval=(fn,ms,...args)=>{const item={id:++intervalSeq,fn,ms:Math.max(16,Number(ms)||16),args,last:performance.now(),active:true};logical.push(item);return item.id};
window.clearInterval=id=>{const i=logical.findIndex(x=>x.id===id);if(i>=0)logical[i].active=false};
function runIntervals(now){for(let i=logical.length-1;i>=0;i--){const it=logical[i];if(!it.active){logical.splice(i,1);continue}if(now-it.last>=it.ms){it.last=now;try{if(typeof it.fn==='function')it.fn(...it.args)}catch(e){console.error('[VillaPelon][interval]',e)}}}}
const queue=[];
function schedule(){if(rafScheduled)return;rafScheduled=true;nativeRAF(ts=>{rafScheduled=false;runIntervals(ts);const batch=queue.splice(0);for(const item of batch){if(item.cancelled)continue;try{if(typeof item.cb==='function')item.cb(ts)}catch(e){console.error('[VillaPelon][RAF]',e)}}if(queue.length||logical.some(x=>x.active))schedule()})}
window.requestAnimationFrame=cb=>{const id=++rafSeq;queue.push({id,cb,cancelled:false});schedule();return id};
window.cancelAnimationFrame=id=>{const item=queue.find(x=>x.id===id);if(item)item.cancelled=true;else if(nativeCAF)nativeCAF(id)};
const M=V.matrix=V.matrix||{};M.version='148.0';M.geometryAuthority='V138';M.runtimeAuthority='V146';M.contentAuthority='V141';M.lifeAuthority='V142';M.identityAuthority='V145';M.visualAuthority='V131/V143/V144';M.sealed=true;
M.contracts={geometry:{sealed:true,owner:'V138'},state:{owner:'VillaPelon.gameState',shared:true},actors:{owner:'peopleVehicles.ambient',alias:'npcs',shared:true},render:{base:'world',detail:'worldDetail',singleScene:true}};
function audit(){const S=V.gameState;const A=Array.isArray(V.peopleVehicles?.ambient)?V.peopleVehicles.ambient:[];if(A.length)V.npcs=A;const d={version:'148.0',geometryLocked:true,sharedState:!!S,sharedActors:V.npcs===A,actors:A.length,movingActors:A.filter(a=>a&&a.moving).length,frameAuthority:'V146_SINGLE_NATIVE_RAF',runtimeVersion:'146/147/148',visualCanvas:!!document.getElementById('world'),detailCanvas:!!document.getElementById('worldDetail'),matrixConnected:true,logicalIntervals:logical.filter(x=>x.active).length};M.diagnostics=d;V.runtimeAudit=Object.assign(V.runtimeAudit||{},d,{matrix:'V148'});document.documentElement.dataset.villaRuntime='148';document.documentElement.dataset.villaMatrix='148'}
M.audit=audit;M.repair=audit;setTimeout(audit,0);window.addEventListener('villa-pelon-engine-ready',audit);window.addEventListener('villa-pelon-runtime-repaired',audit);window.addEventListener('villa-pelon-professional-detail-ready',audit);window.addEventListener('villa-pelon-reactive-ready',audit);window.dispatchEvent(new CustomEvent('villa-pelon-runtime-consolidation-ready',{detail:{version:'148.0',geometryLocked:true}}));window.dispatchEvent(new CustomEvent('villa-pelon-matrix-ready',{detail:{version:'148.0',connected:true,geometryLocked:true}}));
})();
