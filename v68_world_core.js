/* Villa Pelón V68 — núcleo territorial.
   Una sola autoridad para zonas, límites, transición y estado del mundo.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const T=V.territory||(V.territory={version:'V68',zones:{pueblo:{x:120,y:180,w:1680,h:650},rural:{x:1800,y:830,w:1080,h:1000},river:{x:2880,y:120,w:320,h:1710}}});
T.version='V68';
T.zones=T.zones||{};
const z=T.zones;
function inside(r,x,y){return x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h}
T.zoneAt=(x,y)=>inside(z.river,x,y)?'river':inside(z.rural,x,y)?'rural':inside(z.pueblo,x,y)?'pueblo':'transition';
T.describe=zone=>({pueblo:'Pueblo',rural:'Rural / chacras',river:'Río',transition:'Camino / transición'})[zone]||'Territorio';
T.isBuilding=(x,y)=>Array.isArray(V.worldGeometry?.buildings)&&V.worldGeometry.buildings.some(b=>x>b.x-22&&x<b.x+b.w+22&&y>b.y-22&&y<b.y+b.h+22);
T.keepOutOfRiver=(s)=>{if(!s||!z.river)return; if(inside(z.river,s.x,s.y)){const left=z.river.x-18;const right=z.river.x+z.river.w+18;const top=z.river.y-18;const bottom=z.river.y+z.river.h+18;const dl=Math.abs(s.x-left),dr=Math.abs(right-s.x),dt=Math.abs(s.y-top),db=Math.abs(bottom-s.y);const m=Math.min(dl,dr,dt,db);if(m===dl)s.x=left;else if(m===dr)s.x=right;else if(m===dt)s.y=top;else s.y=bottom;}}
T.validate=()=>{const buildings=V.worldGeometry?.buildings||[];return {buildings:buildings.length,valid:buildings.every(b=>T.zoneAt(b.x+b.w/2,b.y+b.h/2)!=='river')}};
let lastZone='';let lastPulse=0;
function pulse(){const s=V.gameState;if(!s)return;T.keepOutOfRiver(s);const zone=T.zoneAt(s.x,s.y);if(zone!==lastZone){lastZone=zone;V.audio?.zone?.(zone);V.openDialogue?.('TERRITORIO',[zone==='pueblo'?'Entraste al pueblo. Acá se concentra la vida cotidiana.':zone==='rural'?'Llegaste a la zona rural. Acá el trabajo sigue el ritmo de la tierra.':zone==='river'?'El río marca el límite natural del territorio.':'Estás en una zona de transición.']);}}
function loop(t){if(t-lastPulse>120){lastPulse=t;pulse()}requestAnimationFrame(loop)}
window.addEventListener('villa-pelon-runtime-ready',()=>{}, {once:true});
requestAnimationFrame(loop);
V.territorialCore={version:'V68',zone:()=>lastZone||T.zoneAt(V.gameState?.x||0,V.gameState?.y||0),validate:T.validate};
})();
