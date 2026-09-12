/* VILLA PELÓN V143 — PUENTE DE MICRODETALLE
   Integra el detalle V142 dentro del compositor visual único sin crear un segundo RAF.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const C=V.visualAuthority;if(!C||typeof C.drawContent!=='function')return;
if(C.__v143Wrapped)return;C.__v143Wrapped=true;
const old=C.drawContent;
C.drawContent=function(ctx,meta){
 old.call(this,ctx,meta);
 const R=V.reactiveLife;
 if(!R||typeof R.drawDetails!=='function')return;
 const d=Math.min(devicePixelRatio||1,2);
 ctx.save();ctx.setTransform(d,0,0,d,0,0);R.drawDetails(ctx);ctx.restore();
};
V.visualDetailBridge={version:'143.0',singleRAF:true,geometryLocked:true};
window.dispatchEvent(new CustomEvent('villa-pelon-visual-detail-ready',{detail:{version:'143.0',ok:true}}));
})();
