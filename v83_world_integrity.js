/* VILLA PELÓN V83 — INTEGRIDAD DEL MUNDO VIVO
   Repara la herencia del motor V47: vida autónoma limitada al mapa 3200x2000.
   La autoridad territorial pasa a ser el mundo 8200x4200 ya construido.
   También evita que actores autónomos terminen dentro del río o edificios.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),s=V.gameState,life=V.life,G=V.worldGeometry;
if(!s||!life||!G)return;
const W=Math.max(8200,Number(V.world?.w)||8200),H=Math.max(4200,Number(V.world?.h)||4200),river=G.river;
const inside=(o,b,p=10)=>o.x>b.x-p&&o.x<b.x+b.w+p&&o.y>b.y-p&&o.y<b.y+b.h+p;
const inRiver=o=>river&&o.x>river.x-8&&o.x<river.x+river.w+8&&o.y>river.y&&o.y<river.y+river.h;
function relocate(o){
 if(!o)return;
 o.x=Math.max(45,Math.min(W-45,Number(o.x)||45));o.y=Math.max(120,Math.min(H-45,Number(o.y)||120));
 if(inRiver(o))o.x=river.x-35;
 for(const b of G.buildings||[]){if(inside(o,b,8)){const spots=[{x:b.x+b.w/2,y:b.y-32},{x:b.x-32,y:b.y+b.h/2},{x:b.x+b.w+32,y:b.y+b.h/2},{x:b.x+b.w/2,y:b.y+b.h+32}];const p=spots.find(q=>q.x>45&&q.x<W-45&&q.y>120&&q.y<H-45&&!inRiver(q)&&!(G.buildings||[]).some(x=>x!==b&&q.x>x.x-10&&q.x<x.x+x.w+10&&q.y>x.y-10&&q.y<x.y+x.h+10));if(p){o.x=p.x;o.y=p.y}break}}
}
if(!life.__v83WorldIntegrity){const old=life.update;life.update=function(dt,minutes){const r=old?old.call(life,dt,minutes):undefined;(life.traffic||[]).forEach(relocate);(life.ambient||[]).forEach(relocate);(life.workers||[]).forEach(relocate);(life.animals||[]).forEach(relocate);return r};life.__v83WorldIntegrity=true}
/* Población rural ambiental: el territorio ampliado no debe quedar vacío por la herencia del motor antiguo. */
if(!life.__v83RuralSeed){
 const seed=[
  {name:'Sofía',x:4300,y:900,home:[4000,2250],work:[4300,900],color:'#8b6a52',speed:17,role:'rural'},
  {name:'Miguel',x:5200,y:1450,home:[5200,760],work:[5200,1450],color:'#617d68',speed:18,role:'rural'},
  {name:'Ana',x:6000,y:1900,home:[6250,3350],work:[6000,1900],color:'#9a6d83',speed:16,role:'rural'},
  {name:'Julián',x:4800,y:2800,home:[4000,2250],work:[4800,2800],color:'#6d7b91',speed:18,role:'rural'}
 ];
 seed.forEach(p=>{p.target=[p.x,p.y];p.destination='chacra';p.wait=2;p.active=true;p.moving=false;p.direction='down';p.walk=0;p.sheltered=false});
 life.ambient=(life.ambient||[]).concat(seed);life.__v83RuralSeed=true;
}
V.audit=V.audit||{};V.audit.v83={version:'V83',world:{w:W,h:H},dynamicLifeBounds:true,riverProtected:true,buildingProtection:true,ruralLifeSeed:true};
})();
