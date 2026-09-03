/* VILLA PELÓN V56 — MASTER WORLD. Define topología y reglas; game.js es el único renderizador del mundo. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),life=V.life,geo=V.worldGeometry;if(!life||!geo)return;
const W=3200,H=2000,RIVER=2920;
const roads=[
{x:0,y:226,w:2880,h:82,name:'AVENIDA PRINCIPAL',kind:'avenue'},
{x:0,y:608,w:2880,h:58,name:'CALLE DEL CENTRO',kind:'street'},
{x:0,y:986,w:2880,h:82,name:'AVENIDA DEL RÍO',kind:'avenue'},
{x:0,y:1450,w:2880,h:54,name:'CAMINO DE LAS CHACRAS',kind:'rural'},
{x:455,y:0,w:104,h:2000,name:'CALLE OESTE',kind:'street'},
{x:1118,y:0,w:86,h:1450,name:'CALLE DE LA PLAZA',kind:'street'},
{x:1822,y:0,w:108,h:2000,name:'CALLE DE LA ESTACIÓN',kind:'street'},
{x:2490,y:0,w:82,h:2000,name:'CALLE DE LOS CHACAREROS',kind:'street'},
{x:2670,y:0,w:108,h:2000,name:'CALLE DEL RÍO',kind:'street'},
{x:2838,y:0,w:72,h:2000,name:'COSTANERA',kind:'river'}
];
const overlap=(a,b,p=0)=>a.x<b.x+b.w+p&&a.x+a.w>b.x-p&&a.y<b.y+b.h+p&&a.y+a.h>b.y-p;
const homes=(geo.buildings||[]).filter(b=>b.type==='home');
const slots=[{x:660,y:390},{x:690,y:800},{x:820,y:1190},{x:1320,y:760},{x:1450,y:1160},{x:2050,y:780}];
function freeSlot(slot,b){return !roads.some(r=>overlap({...b,x:slot.x,y:slot.y},r,4))&&!homes.some(h=>h!==b&&overlap({...b,x:slot.x,y:slot.y},h,18))}
homes.forEach((h,i)=>{if(roads.some(r=>overlap(h,r,2))){const s=slots.find(f=>freeSlot(f,h))||slots[i%slots.length];Object.assign(h,{x:s.x,y:s.y,label:'VIVIENDA '+(i+1)})}});
life.roads=roads;
life.rules=Object.assign(life.rules||{},{version:'V56',roadsAreNavigation:true,housesStayOffRoads:true,noActorInsideBuilding:true,worldRenderer:'game.js',singleVisualAuthority:true});
V.worldMaster={version:'V56',roads,riverX:RIVER,homesOutsideRoads:homes.every(h=>!roads.some(r=>overlap(h,r,2))),worldBounds:{w:W,h:H}};
})();
