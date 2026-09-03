/* V51 reglas de pueblo vivo: coherencia territorial para peatones, trabajadores y fauna. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),life=V.life,geo=V.worldGeometry;
if(!life||!geo)return;
const buildings=geo.buildings||[],riverX=2920;
const roads=[
{x:0,y:230,w:2880,h:74},{x:0,y:990,w:2880,h:74},{x:0,y:620,w:2880,h:54},
{x:455,y:0,w:102,h:2000},{x:1120,y:0,w:82,h:1080},{x:1825,y:0,w:102,h:2000},{x:2675,y:0,w:102,h:2000},{x:2840,y:0,w:66,h:2000}
];
const inBox=(o,b,pad=10)=>o.x>b.x-pad&&o.x<b.x+b.w+pad&&o.y>b.y-pad&&o.y<b.y+b.h+pad;
const insideBuilding=o=>buildings.some(b=>inBox(o,b,12));
const insideRoad=o=>roads.some(r=>inBox(o,r,3));
const safePoint=(o)=>{const candidates=[[o.x-30,o.y],[o.x+30,o.y],[o.x,o.y-30],[o.x,o.y+30],[o.x-30,o.y-30],[o.x+30,o.y+30]];return candidates.find(p=>p[0]>70&&p[0]<riverX-45&&p[1]>150&&p[1]<1940&&!buildings.some(b=>p[0]>b.x-16&&p[0]<b.x+b.w+16&&p[1]>b.y-16&&p[1]<b.y+b.h+16))};
function keepOut(o){
 if(!o)return;
 if(o.x>riverX-45)o.x=riverX-45;
 if(o.x<70)o.x=70;if(o.y<150)o.y=150;if(o.y>1940)o.y=1940;
 /* Las personas pueden circular por calles; jamás quedan dentro de una construcción. */
 if(insideBuilding(o)){const p=safePoint(o);if(p){o.x=p[0];o.y=p[1]}}
}
if(!life.__v51Rules){const oldUpdate=life.update;life.__v51Rules=true;life.update=function(dt,minutes){if(oldUpdate)oldUpdate(dt,minutes);(life.ambient||[]).forEach(keepOut);(life.workers||[]).forEach(keepOut);(life.animals||[]).forEach(keepOut)};life.rules={version:'V51',noHousesOnRoad:true,noActorsInsideBuildings:true,roads,riverBoundary:riverX,streetNavigation:true}}
})();
