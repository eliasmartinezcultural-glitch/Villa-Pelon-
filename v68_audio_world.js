/* Villa Pelón V68 — paisaje sonoro contextual.
   Usa el sistema Web Audio existente y cambia la textura según territorio.
*/
(()=>{'use strict';const V=window.VillaPelon||(window.VillaPelon={});let zone='pueblo',last=0,started=false;
function start(){if(started)return;started=true;V.audio?.start?.();}
function setZone(z){zone=z||'pueblo';start();if(zone==='river')V.audio?.river?.();else if(zone==='rural')V.audio?.wind?.();}
V.audio=V.audio||{};V.audio.zone=setZone;
function tick(t){if(t-last>9000){last=t;const h=((V.gameState?.minutes||480)/60)%24;if(zone==='rural')V.audio?.wind?.();if(zone==='river')V.audio?.river?.();if(h<6||h>21)V.audio?.wind?.()}requestAnimationFrame(tick)}
['pointerdown','keydown','touchstart'].forEach(e=>addEventListener(e,start,{passive:true,once:true}));requestAnimationFrame(tick);
V.audioWorld={version:'V68',zone:()=>zone};
})();
