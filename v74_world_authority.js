/* Villa Pelón V74 — autoridad única de interacción y navegación. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const A={version:'V74',last:null};
const legacyInteract=V.interact;
function player(){const g=V.gameState||{};return{x:Number(g.x),y:Number(g.y)}}
function zoneAt(x,y){const z=V.territory&&V.territory.zones;if(!z)return null;for(const k of Object.keys(z)){const a=z[k];if(x>=a.x&&x<=a.x+a.w&&y>=a.y&&y<=a.y+a.h)return k}return null}
function blocked(x,y,pad=18){const w=V.world||{w:3200,h:2000};if(x<55||y<135||x>w.w-55||y>w.h-55)return true;const bs=V.worldGeometry?.buildings||[];return bs.some(b=>x>b.x-pad&&x<b.x+b.w+pad&&y>b.y-pad&&y<b.y+b.h+pad)}
function nearestNpc(){const p=player(),ns=Array.isArray(V.npcs)?V.npcs:[];let best=null,bd=Infinity;for(const n of ns){const d=Math.hypot(p.x-n.x,p.y-n.y);if(d<88&&d<bd){bd=d;best=n}}return best}
function interact(){
 const g=V.gameState;if(!g||!g.started)return false;
 if(g.dialogue){if(typeof V.closeDialogue==='function'){V.closeDialogue();return true}return false}
 if(V.buildings71?.getState?.())return !!V.buildings71.exit();
 if(V.buildings71?.nearest){const b=V.buildings71.nearest();if(b)return !!V.buildings71.enter(b)}
 const n=nearestNpc();if(n&&typeof V.openDialogue==='function'){if(g.quest===0)g.quest=1;V.openDialogue(n.name,n.lines||[]);return true}
 /* Clues, jobs and legacy objects remain in the original gameplay authority. */
 if(typeof legacyInteract==='function'){legacyInteract();return true}
 return false
}
function install(){
 if(V.__v74Installed)return;V.__v74Installed=true;
 V.territory=V.territory||{};V.territory.zoneAt=zoneAt;V.navigation74={version:'V74',zoneAt,blocked};
 V.interact=interact;A.interact=interact;V.worldAuthority74=A;window.__villaPelonInteractRouter=interact;
 window.addEventListener('keydown',e=>{if(e.repeat||e.key.toLowerCase()!=='e')return;e.preventDefault();e.stopImmediatePropagation();interact()},{capture:true});
 const button=document.getElementById('interact');if(button)button.addEventListener('pointerdown',e=>{e.preventDefault();e.stopImmediatePropagation();interact()},{capture:true});
 const dispatch=()=>{const p=player();window.dispatchEvent(new CustomEvent('villa-pelon-player-state',{detail:{x:p.x,y:p.y,zone:zoneAt(p.x,p.y)}}))};setInterval(dispatch,250);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
