/* VILLA PELÓN V133 — MIGRACIÓN VISUAL PIXEL ART
   Normaliza actores, tránsito, fauna y canvas a la gramática V132.
   No crea geometría ni loops.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),P=V.visualAuthority?.contract?.palette||{};
const U=V.visualMigration={version:'V133',authority:'V132',rules:{integer:true,antialias:false,gradients:false,randomNoise:false,maxMaterialTones:3}};
const people=V.peopleVehicles;
if(people){(people.ambient||[]).forEach((n,i)=>{n.skin=i%3?P.skinLight||'#d9a17d':P.skin||'#c58c6b';n.hair=P.ink||'#202326';n.shirt=[P.clothing||'#65764a',P.wood||'#76553f',P.leaf||'#547448'][i%3]});(people.vehicleData||[]).forEach(v=>{v.color=v.type==='tractor'?(P.leaf||'#547448'):v.type==='pickup'?(P.wood||'#76553f'):(P.metal||'#657176')});(people.animals||[]).forEach(a=>a.pixelPalette=a.type==='cow'?[P.wall||'#c6a477',P.ink||'#202326']:a.type==='horse'?[P.wood||'#76553f',P.woodDark||'#503a2e']:[P.wallLight||'#d7bd91',P.skin||'#c58c6b'])}
for(const c of document.querySelectorAll('#world,#worldDetail,#worldAmbient')){c.style.imageRendering='pixelated';const x=c.getContext?.('2d');if(x)x.imageSmoothingEnabled=false}
U.audit={ok:true,canvas:'pixelated',actors:'canonical-palette',vehicles:'canonical-palette',animals:'canonical-palette'};
window.dispatchEvent(new CustomEvent('villa-pelon-visual-migration-ready',{detail:U.audit}));
})();
