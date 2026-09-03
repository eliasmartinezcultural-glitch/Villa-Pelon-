/* VILLA PELÓN V54 — reglas jugables definitivas del territorio. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),life=V.life,geo=V.worldGeometry;if(!life||!geo)return;
const W=3200,H=2000,RIVER=2920,riverSafe=RIVER-58,roads=(V.worldMaster&&V.worldMaster.roads)||life.roads||[],buildings=geo.buildings||[];
const hit=(x,y,b,p=14)=>x>b.x-p&&x<b.x+b.w+p&&y>b.y-p&&y<b.y+b.h+p;
function validActor(o){if(!o)return;if(o.x>riverSafe)o.x=riverSafe;if(o.x<45)o.x=45;if(o.y<120)o.y=120;if(o.y>H-45)o.y=H-45;for(const b of buildings){if(hit(o.x,o.y,b,12)){const options=[{x:b.x+b.w/2,y:b.y-30},{x:b.x-30,y:b.y+b.h/2},{x:b.x+b.w+30,y:b.y+b.h/2},{x:b.x+b.w/2,y:b.y+b.h+30}];let best=options[0],bd=Infinity;for(const p of options){if(p.x>45&&p.x<riverSafe&&p.y>120&&p.y<H-45&&!buildings.some(q=>q!==b&&hit(p.x,p.y,q,12))){const d=(p.x-o.x)**2+(p.y-o.y)**2;if(d<bd){bd=d;best=p}}}o.x=best.x;o.y=best.y;break}}}
const safeHomes=()=>buildings.filter(b=>b.type==='home').every(b=>!roads.some(r=>b.x<r.x+r.w&&b.x+b.w>r.x&&b.y<r.y+r.h&&b.y+b.h>r.y));
if(!life.__v54Rules){life.__v54Rules=true;const old=life.update;life.update=function(dt,minutes){if(old)old(dt,minutes);(life.ambient||[]).forEach(validActor);(life.workers||[]).forEach(validActor);(life.animals||[]).forEach(validActor);const s=V.gameState;if(s){if(s.x>riverSafe)s.x=riverSafe;if(s.x<45)s.x=45;if(s.y<120)s.y=120;if(s.y>H-45)s.y=H-45}};life.rules=Object.assign(life.rules||{},{version:'V54',noHouseOnRoad:true,playerNoRiverCrossing:true,noActorInsideBuilding:true,pcMobile:true});}
V.worldRules={version:'V54',world:{w:W,h:H,riverX:RIVER},roads,homesOutsideRoads:safeHomes(),playerRiverBoundary:riverSafe};
})();
