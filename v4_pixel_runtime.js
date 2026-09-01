/* Villa Pelón V4 — PIXEL RUNTIME
   Convierte el canvas completo a un framebuffer retro de baja resolución.
   No crea un segundo motor ni un segundo RAF: el motor V4 sigue siendo dueño
   del ciclo. Solo reduce la resolución efectiva del canvas y conserva la
   interacción, física, cámara y lógica existentes.
*/
(()=>{'use strict';
const canvas=document.getElementById('world');
if(!canvas)return;
const PIXEL=3;
const nativeWidth=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,'width');
const nativeHeight=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,'height');
const nativeGetContext=HTMLCanvasElement.prototype.getContext;
if(!nativeWidth||!nativeHeight)return;
let requestedW=innerWidth,requestedH=innerHeight;
let internalW=0,internalH=0;
function quantize(v){return Math.max(160,Math.round(Number(v)/PIXEL));}
Object.defineProperty(canvas,'width',{configurable:true,get(){return nativeWidth.get.call(canvas)},set(v){requestedW=Number(v)||requestedW;internalW=quantize(v);nativeWidth.set.call(canvas,internalW)}});
Object.defineProperty(canvas,'height',{configurable:true,get(){return nativeHeight.get.call(canvas)},set(v){requestedH=Number(v)||requestedH;internalH=quantize(v);nativeHeight.set.call(canvas,internalH)}});
let wrapped=null;
HTMLCanvasElement.prototype.getContext=function(type,opts){
  const c=nativeGetContext.call(this,type,opts);
  if(this!==canvas||type!=='2d'||!c||wrapped)return c;
  wrapped=new Proxy(c,{get(target,key){
    if(key==='setTransform')return(a,b,d,e,f,g)=>target.setTransform(a/PIXEL,b/PIXEL,d/PIXEL,e/PIXEL,f/PIXEL,g/PIXEL);
    if(key==='resetTransform')return()=>{target.resetTransform();target.scale(1/PIXEL,1/PIXEL)};
    return Reflect.get(target,key,target);
  },set(target,key,value){return Reflect.set(target,key,value,target)}});
  return wrapped;
};
canvas.dataset.pixelRuntime='3x';
canvas.style.imageRendering='pixelated';
canvas.style.imageRendering='crisp-edges';
const originalResizeObserver=window.ResizeObserver;
if(originalResizeObserver){
  // No observer is installed: the existing V4 resize handler remains authoritative.
}
window.VillaPelon=window.VillaPelon||{};
window.VillaPelon.pixelRuntime={version:4,pixelSize:PIXEL,mode:'low-resolution-framebuffer',singleMotor:true};
})();