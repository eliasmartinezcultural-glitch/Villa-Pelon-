/* VILLA PELÓN V56 — jugabilidad territorial sin segunda capa de render. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),life=V.life,geo=V.worldGeometry;if(!life||!geo)return;
const W=3200,H=2000,RIVER=2920;
const roads=[
{x:0,y:230,w:2880,h:74,name:'Avenida Principal',kind:'avenue'},
{x:0,y:620,w:2880,h:54,name:'Calle del Centro',kind:'street'},
{x:0,y:990,w:2880,h:74,name:'Avenida del Río',kind:'avenue'},
{x:0,y:1450,w:2880,h:54,name:'Camino de las Chacras',kind:'rural'},
{x:455,y:0,w:102,h:2000,name:'Calle Oeste',kind:'street'},
{x:1120,y:0,w:82,h:1450,name:'Calle de la Plaza',kind:'street'},
{x:1825,y:0,w:102,h:2000,name:'Calle de los Chacareros',kind:'street'},
{x:2490,y:0,w:82,h:2000,name:'Calle de las Chacras',kind:'street'},
{x:2675,y:0,w:102,h:2000,name:'Calle del Río',kind:'street'},
{x:2840,y:0,w:66,h:2000,name:'Costanera',kind:'river'}
];
const point=(x,y)=>({x,y});
const anchors=[point(500,267),point(1120,267),point(1875,267),point(2530,267),point(2726,267),point(500,647),point(1120,647),point(1875,647),point(2530,647),point(2726,647),point(500,1027),point(1120,1027),point(1875,1027),point(2530,1027),point(2726,1027),point(500,1477),point(1875,1477),point(2530,1477),point(2726,1477)];
const inside=(o,r,p=0)=>o.x>r.x-p&&o.x<r.x+r.w+p&&o.y>r.y-p&&o.y<r.y+r.h+p;
const hitRoad=b=>roads.some(r=>b.x<r.x+r.w&&b.x+b.w>r.x&&b.y<r.y+r.h&&b.y+b.h>r.y);
const buildings=geo.buildings||[];
const homeSlots=[{x:680,y:390},{x:690,y:800},{x:820,y:1190},{x:1320,y:760},{x:1450,y:1160}];
buildings.filter(b=>b.type==='home').forEach((b,i)=>{if(hitRoad(b))Object.assign(b,homeSlots[i%homeSlots.length]);});
function nearestAnchor(x,y){let best=anchors[0],bd=Infinity;for(const a of anchors){const d=(a.x-x)**2+(a.y-y)**2;if(d<bd){bd=d;best=a}}return best}
function outsideBuilding(o){if(!o)return;if(o.x>RIVER-45)o.x=RIVER-45;if(o.x<60)o.x=60;if(o.y<145)o.y=145;if(o.y>H-45)o.y=H-45;for(const b of buildings){if(inside(o,b,10)){const candidates=[{x:b.x+b.w/2,y:b.y-26},{x:b.x-26,y:b.y+b.h/2},{x:b.x+b.w+26,y:b.y+b.h/2},{x:b.x+b.w/2,y:b.y+b.h+26}];const p=nearestAnchor(candidates[0].x,candidates[0].y);let q=candidates[0],qd=Infinity;for(const c of candidates){const d=(c.x-p.x)**2+(c.y-p.y)**2;if(d<qd){qd=d;q=c}}o.x=q.x;o.y=q.y;return}}}
if(!life.__v53Playability){life.__v53Playability=true;const oldUpdate=life.update;life.update=function(dt,minutes){if(oldUpdate)oldUpdate(dt,minutes);(life.ambient||[]).forEach(outsideBuilding);(life.workers||[]).forEach(outsideBuilding);(life.animals||[]).forEach(outsideBuilding)};life.roads=roads;life.roadAnchors=anchors;life.rules=Object.assign(life.rules||{},{version:'V56',singleLifeMotor:true,streetNavigation:true,noHousesOnRoad:true,noActorsInsideBuildings:true,riverBoundary:RIVER,visualAuthority:'game.js'});}
function mobilePolish(){const isTouch=('ontouchstart' in window)||navigator.maxTouchPoints>0;document.documentElement.classList.toggle('touch-device',isTouch);const game=document.getElementById('game');if(game)game.style.touchAction='none';const interact=document.getElementById('interact');if(interact){interact.setAttribute('aria-label','Interactuar');interact.title='Interactuar';interact.textContent='E'}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mobilePolish);else mobilePolish();
V.worldPlayability={version:'V56',roads,roadAnchors:anchors,riverX:RIVER,homesOutsideRoads:buildings.filter(b=>b.type==='home').every(b=>!hitRoad(b)),pcControls:'WASD/Flechas + E/Espacio',mobileControls:'D-pad + E',visualAuthority:'game.js'};
})();
