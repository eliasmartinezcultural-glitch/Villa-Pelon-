/* VILLA PELÓN V130 — BLOQUEO DE LEYES
   Las reglas quedan congeladas; los estados, horarios, clima y actividades pueden evolucionar.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const L=V.worldLaws||{};
V.worldLawLock={version:'V130',locked:true,readOnly:true,authorities:{geometry:'worldGeometry',laws:'worldLaws',life:'villageLife',atmosphere:'atmosphere',content:'worldContent'},immutableRules:['geometry','hierarchy','scale','appearance','actions','labor','activities','weatherEffects','structureSchema','validation','integrity'],principle:'base and laws are locked; content and states evolve above them'};
if(V.worldMaster)V.worldMaster.lawLock='V130';
window.dispatchEvent(new CustomEvent('villa-pelon-world-laws-locked',{detail:{version:'V130',locked:true,lawVersion:L.version||'V129'}}));
})();
