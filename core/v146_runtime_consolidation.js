/* VILLA PELÓN V146 — CONSOLIDACIÓN QUIRÚRGICA DEL RUNTIME
   Objetivo: una sola cadencia de frame para los RAF existentes y un único estado compartido.
   NO modifica geometría V138, edificios, río, puentes ni caminos.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const nativeRAF=window.requestAnimationFrame.bind(window);
const nativeCAF=window.cancelAnimationFrame?window.cancelAnimationFrame.bind(window):null;
const nativeSetInterval=window.setInterval.bind(window);
const nativeClearInterval=window.clearInterval?window.clearInterval.bind(window):null;
const rafQueue=[]; let rafScheduled=false, rafSeq=0;
function schedule(){if(rafScheduled)return;rafScheduled=true;nativeRAF(ts=>{rafScheduled=false;const q=rafQueue.splice(0);for(const item of q){try{item.cb(ts)}catch(e){console.error('[VillaPelon][RAF]',e)}}if(rafQueue.length)schedule()})}
window.requestAnimationFrame=cb=>{const id=++rafSeq;rafQueue.push({id,cb});schedule();return id};
window.cancelAnimationFrame=id=>{const i=rafQueue.findIndex(x=>x.id===id);if(i>=0)rafQueue.splice(i,1);else if(nativeCAF)nativeCAF(id)};
// Existing intervals from V142/V145 remain simulation sources, but are now driven by the same browser frame clock.
const logical=[];let intervalSeq=0;
window.setInterval=(fn,ms,...args)=>{const item={id:++intervalSeq,fn,ms:Math.max(16,Number(ms)||16,args,last:performance.now()};logical.push(item);return item.id};
window.clearInterval=id=>{const i=logical.findIndex(x=>x.id===id);if(i>=0)logical.splice(i,1);else if(nativeClearInterval)nativeClearInterval(id)};
function runIntervals(now){for(const it of logical){if(now-it.last>=it.ms){it.last=now;try{it.fn(...it.args)}catch(e){console.error('[VillaPelon][interval]',e)}}}}
// Keep the scheduler itself on the native RAF so the wrapper cannot recursively wrap its own clock.
function master(ts){runIntervals(ts);nativeRAF(master)}
nativeRAF(master);
function audit(){
 const A=Array.isArray(V.peopleVehicles?.ambient)?V.peopleVehicles.ambient:[];
 if(A.length)V.npcs=A;
 V.runtimeAudit=Object.assign(V.runtimeAudit||{},{version:'146.0',frameAuthority:'V146_NATIVE_MASTER',singleRAFClock:true,sharedNpcArray:V.npcs===A,actors:A.length,geometryLocked:true,visualLayer:'worldDetail'});
 document.documentElement.dataset.villaRuntime='146';
}
setTimeout(audit,0);
window.addEventListener('villa-pelon-engine-ready',audit);
window.addEventListener('villa-pelon-runtime-repaired',audit);
window.addEventListener('villa-pelon-professional-detail-ready',audit);
window.dispatchEvent(new CustomEvent('villa-pelon-runtime-consolidation-ready',{detail:{version:'146.0',geometryLocked:true}}));
})();
