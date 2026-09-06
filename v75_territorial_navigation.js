/* Villa Pelón V75 — navegación territorial coherente.
   Una sola regla para jugador/NPC: edificios, río y cercos son obstáculos;
   los puentes son pasos válidos. No inventa paredes dentro del territorio.
*/
(()=>{'use strict';const V=window.VillaPelon||(window.VillaPelon={});
const N={version:'V75',river:{x:2880,y:120,w:320,h:1710},bridges:[{x:2825,y:680,w:70,h:72},{x:2825,y:1480,w:70,h:72}],fences:[{x:1800,y:1130,w:560,h:350},{x:2360,y:1340,w:500,h:390}]};
function inside(x,y,r){return x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h}
function nearBridge(x,y){return N.bridges.some(b=>x>=b.x-18&&x<=b.x+b.w+18&&y>=b.y-18&&y<=b.y+b.h+18)}
function fenceHit(x,y,pad){return N.fences.some(f=>{const left=x>=f.x-pad&&x<=f.x+f.w+pad,top=y>=f.y-pad&&y<=f.y+f.h+pad;if(!left||!top)return false;const edge=Math.min(Math.abs(x-f.x),Math.abs(x-(f.x+f.w)),Math.abs(y-f.y),Math.abs(y-(f.y+f.h)));return edge<pad})}
function blocked(x,y,pad=18){const w=V.world||{w:3200,h:2000};if(x<55||y<135||x>w.w-55||y>w.h-55)return true;if(inside(x,y,N.river)&&!nearBridge(x,y))return true;if(fenceHit(x,y,pad))return true;const bs=V.worldGeometry?.buildings||[];return bs.some(b=>x>b.x-pad&&x<b.x+b.w+pad&&y>b.y-pad&&y<b.y+b.h+pad)}
N.blocked=blocked;N.zoneAt=(x,y)=>V.territory?.zoneAt?V.territory.zoneAt(x,y):null;V.navigation74=Object.assign(V.navigation74||{},N);
/* NPCs expose the same navigation contract for future pathfinding. */
V.npcNavigation75={version:'V75',canWalk:(x,y)=>!blocked(x,y,10)};
})();
