/* VILLA PELÓN V124 — GEOMETRY FLOOR LOCK
   Se ejecuta al final. La geografía ya definida pasa a ser sólo lectura.
   Si una capa futura intenta modificarla, la auditoría marca el mundo como inválido.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),G=V.worldGeometry||{};
const snapshot=JSON.stringify({
 worldSize:[8200,4200],river:G.river,zones:G.zones,roads:G.roads,bridges:G.bridges,buildings:G.buildings,plaza:G.plaza,
 rules:G.worldRules
});
function deepFreeze(o){if(!o||typeof o!=='object'||Object.isFrozen(o))return o;Object.freeze(o);Object.getOwnPropertyNames(o).forEach(k=>deepFreeze(o[k]));return o}
deepFreeze(G.river);deepFreeze(G.zones);deepFreeze(G.roads);deepFreeze(G.bridges);deepFreeze(G.buildings);deepFreeze(G.plaza);deepFreeze(G.worldRules);deepFreeze(G.routeNetwork);deepFreeze(G.geometryContract);deepFreeze(G);
V.geometryFloorLock={version:'V124',locked:true,readOnly:true,checksum:snapshot.length,base:'CANONICAL_MAP_1',principle:'content expands; geography does not'};
V.worldMaster={...(V.worldMaster||{}),version:'CANONICAL_MAP_1',locked:true,geometryReadOnly:true,floor:'core/world_lock_v124.js'};
V.worldAudit={...(V.worldAudit||{}),lockedBase:true,geometryReadOnly:true};
window.dispatchEvent(new CustomEvent('villa-pelon-geometry-locked',{detail:{version:'V124',locked:true,checksum:snapshot.length}}));
})();
