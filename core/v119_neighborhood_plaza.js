/* VILLA PELÓN V119 — RELACIÓN EDIFICIO · CALLE · BARRIO · PLAZA
   Fuente espacial temprana: corre después del manifest y antes del motor.
   No mueve edificios ni agrega fachadas. Define espacio cívico, frentes y reglas.
*/
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={});
 const G=V.worldGeometry||(V.worldGeometry={});
 const river=G.river||(G.river={x:0,y:820,w:8200,h:22});
 const plaza=G.plaza||(G.plaza={id:'plaza_central',x:1320,y:1008,w:1760,h:176,kind:'civic',walkable:true,frontRoad:'main_mid',frontY:990});
 G.river=river;G.plaza=plaza;
 const roads=G.roads||[],buildings=G.buildings||[];
 const intersects=(a,b,p=0)=>a.x-p<b.x+b.w&&a.x+a.w+p>b.x&&a.y-p<b.y+b.h&&a.y+a.h+p>b.y;
 const center=b=>({x:b.x+b.w/2,y:b.y+b.h/2});
 const nearestRoad=b=>{let best=null,bd=Infinity;roads.forEach(r=>{const cx=Math.max(r.x,Math.min(b.x+b.w/2,r.x+r.w)),cy=Math.max(r.y,Math.min(b.y+b.h/2,r.y+r.h));const d=Math.hypot(cx-(b.x+b.w/2),cy-(b.y+b.h/2));if(d<bd){bd=d;best={road:r,distance:d,point:{x:cx,y:cy}}}});return best};
 const frontages=buildings.map((b,i)=>{const n=nearestRoad(b);return{id:i,label:b.label,type:b.type,building:b,road:n?.road?.id||null,distance:n?.distance??Infinity,point:n?.point||center(b)}});
 const audit={version:'119.0',plaza,river,frontages,buildings:buildings.length,roads:roads.length,plazaIntersections:buildings.filter(b=>intersects(b,plaza,18)).map(b=>b.label)};
 V.neighborhoodContract={version:'119.0',centralPlaza:plaza.id,frontageRule:'nearest-road-with-buffer',streetRelation:true,neighborhoodRelation:true};
 V.spatialAuthority={version:'119.0',river,plaza,frontages,intersects,nearestRoad};
 V.neighborhoodAudit=audit;
 window.dispatchEvent(new CustomEvent('villa-pelon-neighborhood-ready',{detail:audit}));
})();
