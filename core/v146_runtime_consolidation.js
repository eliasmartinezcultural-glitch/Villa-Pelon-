/* VILLA PELÓN V146 — CONSOLIDACIÓN QUIRÚRGICA DEL RUNTIME
   Una sola cadencia nativa de requestAnimationFrame.
   Los setInterval de las capas de vida se convierten en intervalos lógicos dentro de ese mismo reloj.
   NO modifica geometría V138, edificios, río, puentes ni caminos.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const nativeRAF=window.requestAnimationFrame.bind(window);
const nativeCAF=window.cancelAnimationFrame?window.cancelAnimationFrame.bind(window):null;
const rafQueue=[];const logical=[];let rafScheduled=false,rafSeq=0,intervalSeq=0;
window.setInterval=(fn,ms,...args)=>{const item={id:++intervalSeq,fn,ms:Math.max(16,Number(ms)||16),args,last:performance.now()};logical.push(item);return item.id};
window.clearInterval=id=>{const i=logical.findIndex(x=>x.id===id);if(i>=0)logical.splice(i,1)};
function runIntervals(now){for(const it of logical){if(now-it.last>=it.ms){it.last=now;try{it.fn(...it.args)}catch(e){console.error('[VillaPelon][interval]',e)}}}}
function schedule(){if(rafScheduled)return;rafScheduled=true;nativeRAF(ts=>{rafScheduled=false;runIntervals(ts);const q=rafQueue.splice(0);for(const item of q){try{item.cb(ts)}catch(e){console.error('[VillaPelon][RAF]',e)}}if(rafQueue.length||logical.length)schedule()})}
window.requestAnimationFrame=cb=>{const id=++rafSeq;rafQueue.push({id,cb});schedule();return id};
window.cancelAnimationFrame=id=>{const i=rafQueue.findIndex(x=>x.id===id);if(i>=0)rafQueue.splice(i,1);else if(nativeCAF)nativeCAF(id)};
function audit(){const A=Array.isArray(V.peopleVehicles?.ambient)?V.peopleVehicles.ambient:[];if(A.length)V.npcs=A;V.runtimeAudit=Object.assign(V.runtimeAudit||{},{version:'146.0',frameAuthority:'V146_SINGLE_NATIVE_RAF',singleRAFClock:true,logicalIntervals:logical.length,sharedNpcArray:V.npcs===A,actors:A.length,geometryLocked:true,visualLayer:'worldDetail'});document.documentElement.dataset.villaRuntime='146'}
setTimeout(audit,0);window.addEventListener('villa-pelon-engine-ready',audit);window.addEventListener('villa-pelon-runtime-repaired',audit);window.addEventListener('villa-pelon-professional-detail-ready',audit);window.dispatchEvent(new CustomEvent('villa-pelon-runtime-consolidation-ready',{detail:{version:'146.0',geometryLocked:true}}));
})();
