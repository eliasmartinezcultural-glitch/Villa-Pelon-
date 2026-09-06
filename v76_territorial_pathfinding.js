/* Villa Pelón V76 — navegación por rutas.
   El territorio deja de ser sólo "destino": los NPC buscan un camino válido.
   Usa la autoridad V75 y no crea un segundo loop de juego.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const N=V.navigation74||{};
const P={version:'V76.1',cell:60,maxNodes:2200,plans:new Map(),lastPlan:0};
const W=V.world||{w:3200,h:2000};
const blocked=(x,y,pad=10)=>typeof N.blocked==='function'?N.blocked(x,y,pad):false;
const key=(x,y)=>x+','+y;
function cellOf(x,y){return [Math.max(1,Math.min(Math.floor((W.w-1)/P.cell)-1,Math.round(x/P.cell))),Math.max(1,Math.min(Math.floor((W.h-1)/P.cell)-1,Math.round(y/P.cell)))];}
function point(c){return [c[0]*P.cell,c[1]*P.cell]}
function clearSegment(a,b){const d=Math.hypot(b[0]-a[0],b[1]-a[1]),steps=Math.max(2,Math.ceil(d/10));for(let i=1;i<steps;i++){const t=i/steps,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;if(blocked(x,y,10))return false}return true}
function nearestWalkable(x,y){if(!blocked(x,y,10))return [x,y];for(let r=1;r<=7;r++)for(let iy=-r;iy<=r;iy++)for(let ix=-r;ix<=r;ix++){const q=[x+ix*20,y+iy*20];if(q[0]>55&&q[0]<W.w-55&&q[1]>135&&q[1]<W.h-55&&!blocked(q[0],q[1],10))return q}return [x,y]}
function route(start,end){const target=nearestWalkable(end[0],end[1]),s=cellOf(start[0],start[1]),t=cellOf(target[0],target[1]);if(Math.hypot(start[0]-target[0],start[1]-target[1])<18)return [];const q=[s],came=new Map([[key(s[0],s[1]),null]]);let found=null,nodes=0;while(q.length&&nodes++<P.maxNodes){const c=q.shift();if(c[0]===t[0]&&c[1]===t[1]){found=c;break}for(const d of [[1,0],[-1,0],[0,1],[0,-1]]){const n=[c[0]+d[0],c[1]+d[1]],nk=key(n[0],n[1]);if(n[0]<1||n[1]<1||n[0]>=Math.floor(W.w/P.cell)-1||n[1]>=Math.floor(W.h/P.cell)-1||came.has(nk))continue;const a=point(c),b=point(n);if(blocked(b[0],b[1],10)||!clearSegment(a,b))continue;came.set(nk,c);q.push(n)}}if(!found)return [target];const out=[];let c=found;while(c){out.push(point(c));c=came.get(key(c[0],c[1]))}out.reverse();return out.length>1?out.slice(1):[target]}
function planFor(o){if(!o||!Number.isFinite(o.x)||!Number.isFinite(o.y)||!Array.isArray(o.target))return;const target=nearestWalkable(o.target[0],o.target[1]);if(Math.hypot(o.x-target[0],o.y-target[1])<18){o.path76=[];o.routeDestination76=target;o.navigationState='arrived';return}const sig=Math.round(target[0]/20)+':'+Math.round(target[1]/20);const cached=P.plans.get(o.name);if(cached?.sig===sig&&cached.route.length){o.path76=cached.route.slice();o.target=o.path76[0];o.navigationState='routing';return}const r=route([o.x,o.y],target);P.plans.set(o.name,{sig,route:r.slice(),target,at:Date.now()});o.path76=r.slice();o.routeDestination76=target;o.target=o.path76[0]||target;o.navigationState=o.path76.length?'routing':'arrived'}
function advance(o){if(!Array.isArray(o.path76)||!o.path76.length)return;const p=o.path76[0],d=Math.hypot(o.x-p[0],o.y-p[1]);if(d<18){o.path76.shift();if(o.path76.length)o.target=o.path76[0];else{o.target=o.routeDestination76||o.target;o.navigationState='arrived'}}}
function tick(){if(!V.life||!Array.isArray(V.life.ambient))return;const now=Date.now();V.life.ambient.forEach(advance);if(now-P.lastPlan<650)return;P.lastPlan=now;V.life.ambient.forEach(o=>{if(!o.navigationState||o.navigationState==='arrived'||!Array.isArray(o.path76)||!o.path76.length){if(Array.isArray(o.target))planFor(o)}})}
function playerSafety(){const g=V.gameState;if(!g||!Number.isFinite(g.x)||!Number.isFinite(g.y))return;const now=Date.now();if(!blocked(g.x,g.y,18)){P.safe=[g.x,g.y];P.safeAt=now}else if(P.safe){g.x=P.safe[0];g.y=P.safe[1]}}
function install(){if(V.__v76Installed)return;V.__v76Installed=true;V.pathfinding76=P;V.npcNavigation76={version:'V76.1',route,nearestWalkable,clearSegment};setInterval(tick,220);setInterval(playerSafety,45);if(V.engine?.register)V.engine.register('navigation',V.npcNavigation76);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
