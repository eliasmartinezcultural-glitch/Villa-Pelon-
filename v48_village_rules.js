/* V48 reglas de pueblo vivo: circulación, colisión y coherencia territorial. */
(()=>{'use strict';const V=window.VillaPelon||(window.VillaPelon={}),life=V.life,geo=V.worldGeometry;if(!life||!geo)return;
const buildings=geo.buildings||[];
const forbidden=(x,y)=>buildings.some(b=>x>b.x-10&&x<b.x+b.w+10&&y>b.y-10&&y<b.y+b.h+10);
const riverX=2920;
function keepOut(o){if(forbidden(o.x,o.y)){const candidates=[[o.x-28,o.y],[o.x+28,o.y],[o.x,o.y-28],[o.x,o.y+28]];const safe=candidates.find(p=>p[0]>60&&p[0]<riverX-35&&p[1]>150&&p[1]<1940&&!forbidden(p[0],p[1]));if(safe){o.x=safe[0];o.y=safe[1]}}if(o.x>riverX-45)o.x=riverX-45}
if(!life.__v48Rules){const oldUpdate=life.update;life.__v48Rules=true;life.update=function(dt,minutes){if(oldUpdate)oldUpdate(dt,minutes);(life.ambient||[]).forEach(keepOut);(life.workers||[]).forEach(keepOut);(life.animals||[]).forEach(keepOut)};life.rules={version:'V48',noHousesOnRoad:true,noActorsInsideBuildings:true,riverBoundary:riverX};}
})();
