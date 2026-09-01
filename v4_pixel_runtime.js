/* Villa Pelón V4 — PIXEL RUNTIME SAFE
   Pixel art visual layer only. Never changes canvas width/height APIs,
   never replaces getContext and never changes the game engine transform.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const canvas=document.getElementById('world');
if(!canvas)return;
const apply=()=>{
  canvas.style.imageRendering='pixelated';
  canvas.style.imageRendering='crisp-edges';
  const c=canvas.getContext('2d');
  if(c){c.imageSmoothingEnabled=false;c.lineCap='square';c.lineJoin='miter';}
  canvas.dataset.pixelRuntime='safe-4';
  V.pixelRuntime={version:4,pixelSize:2,mode:'safe-pixel-display',singleMotor:true};
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();