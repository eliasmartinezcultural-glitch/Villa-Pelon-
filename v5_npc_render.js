/* Villa Pelón V5 — PERSONAJES CINEMÁTICOS PIXEL
   Reinterpreta el lenguaje de personajes de animación cinematográfica en pixel art:
   cabezas expresivas, ojos con brillo, siluetas claras, accesorios y estados visibles.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const R=V.npcRenderV5={version:1,enabled:true,style:'cinematic-animation-pixel-art'};
function enhance(c,n){if(!c||!n)return;const s=n.height||1;const t=performance.now();const bob=n.moving?Math.sin(t/115+(n.appearanceSeed||0))*1.3:0;c.save();c.translate(n.x,n.y+bob);c.scale(s,s);c.imageSmoothingEnabled=false;const head=n.age<16?11:n.age>60?14:13;
 // brillo de ojos y pequeñas luces para dar expresividad sin abandonar el pixel art
 c.fillStyle='#fff';c.fillRect(-7,-32,2,2);c.fillRect(5,-32,2,2);
 c.fillStyle='rgba(255,170,150,.32)';c.fillRect(-head+2,-25,4,2);c.fillRect(head-6,-25,4,2);
 // accesorio según oficio/actividad
 const a=n.brain?.activity||'';
 if(a==='work'||a==='rural'){c.fillStyle='#d5b878';c.fillRect(10,-3,5,8);c.fillStyle='#6d5438';c.fillRect(11,-6,3,3)}
 if(a==='plaza'){c.fillStyle='#d8b650';c.fillRect(-3,47,6,3)}
 if(a==='home'){c.fillStyle='#66513e';c.fillRect(-16,1,4,8)}
 if(n.brain?.action==='charlar'){c.fillStyle='#fff';c.fillRect(17,-47,3,3);c.fillRect(22,-44,2,2)}
 if(n.brain?.action==='trabajar'){c.fillStyle='#f0d68d';c.fillRect(-19,-5,4,4)}
 if(n.brain?.action==='descansar'){c.fillStyle='#d5c7a9';c.fillRect(15,-45,4,2)}
 c.restore()}
function install(){const C=V.v4Characters;if(!C||C.__v5RenderWrapped)return;const old=C.draw;C.draw=function(c,n){old.call(this,c,n);enhance(c,n)};C.__v5RenderWrapped=true;R.ready=true}
install();setTimeout(install,300);setTimeout(install,1000);V.v4?.register?.('npcRenderV5',R);
})();