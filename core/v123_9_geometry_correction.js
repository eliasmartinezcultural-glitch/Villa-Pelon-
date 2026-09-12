/* VILLA PELÓN V123.9 — CORRECCIÓN QUIRÚRGICA PRE-LOCK
   Única corrección geométrica de saneamiento detectada en la auditoría final.
   No cambia leyes, zonas, tamaño del mundo, río, puentes ni topología.
   Corrige una colisión edificio/camino antes del V124 LOCK.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),G=V.worldGeometry||{};
if(!Array.isArray(G.buildings))return;
const b=G.buildings.find(x=>x.id==='quinta_01');
if(!b)return;
/* Quinta 01 invadía el corredor bridge_west_access con el margen de colisión de 18 px.
   Se conserva la misma zona, tamaño y función; sólo se desplaza dentro del campo.
*/
b.x=3300;
G.surgicalCorrection={version:'V123.9',applied:true,target:'quinta_01',reason:'building-road-overlap',lawPreserved:true};
window.dispatchEvent(new CustomEvent('villa-pelon-geometry-surgical-correction',{detail:G.surgicalCorrection}));
})();
