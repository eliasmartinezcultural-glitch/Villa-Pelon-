/* VILLA PELÓN V132 — VISUAL INTEGRITY LOCK
   La estética se trata como sistema, no como colección de dibujos.
   No modifica geometría ni crea loops. Consolida reglas y verifica el renderer.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const A=V.visualAuthority;const canvas=document.getElementById('worldDetail');
const palette=A?.contract?.palette||{};
const required=['ink','outline','shadow','dirt','grass','water','wood','metal','roof','wall','glass','leaf','sign','skin','clothing','road'];
const checks={authority:!!A,version:A?.version==='V132',worldSpace:A?.audit?.space==='world-space',canonicalPalette:required.every(k=>!!palette[k]),geometryReadOnly:A?.readOnlyGeometry===true,singleVisualLoop:A?.singleVisualLoop===true,contentConnected:typeof A?.drawContent==='function'&&typeof A?.contentItems==='function',noGradients:A?.contract?.quality?.forbidGradient===true,noBlur:A?.contract?.quality?.forbidBlur===true,noRandomNoise:A?.contract?.quality?.forbidRandomNoise===true};
if(canvas){canvas.style.imageRendering='pixelated';const ctx=canvas.getContext('2d');if(ctx){ctx.imageSmoothingEnabled=false;ctx.textRendering='geometricPrecision';}}
for(const c of document.querySelectorAll('canvas'))c.style.imageRendering='pixelated';
const failed=Object.keys(checks).filter(k=>!checks[k]);
V.visualLock={version:'V132',locked:true,readOnly:true,checks,failed,ok:failed.length===0,principles:{macro:'territory first',mid:'one visual compositor',micro:'one pixel language',depth:'world-space + y-order',palette:'canonical only',geometry:'never changed by render'}};
window.dispatchEvent(new CustomEvent('villa-pelon-visual-lock-ready',{detail:{version:'V132',ok:failed.length===0,failed}}));
})();