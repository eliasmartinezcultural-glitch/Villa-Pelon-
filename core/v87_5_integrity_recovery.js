/* Villa Pelón V87.5 — INTEGRIDAD FINAL
   Corrige el punto débil heredado: game.js conserva una geometría local histórica.
   Desde aquí, la autoridad territorial vuelve a ser siempre core/world.js.
   No amplía mapa ni crea un motor paralelo.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const canonical=V.worldAuthority?.geometry;
if(!canonical)return;
// La geometría canónica gana siempre después de que los módulos históricos hayan cargado.
V.world=canonical;
V.worldGeometry=canonical;
V.worldAuthority.geometry=canonical;
V.worldAuthority.blocked=canonical.collision.blocked;
V.worldAuthority.roadAt=canonical.collision.roadAt;
V.worldAuthority.zoneAt=canonical.collision.zoneAt;

// IDs de servicio normalizados para que misiones y acciones no dependan de nombres alternativos.
const aliases={
 'parada-regional':'terminal-local',
 'plaza-del-pueblo':'plaza',
 'panaderia':'panaderia',
 'almacen':'almacen'
};
V.worldIds=V.worldIds||{};Object.assign(V.worldIds,aliases);

// Recuperación de partida: nunca permite coordenadas fuera del mundo final.
function sanitize(){
 const s=V.gameState;if(!s)return;
 s.x=Math.max(60,Math.min(canonical.width-60,Number.isFinite(s.x)?s.x:canonical.spawn.x));
 s.y=Math.max(60,Math.min(canonical.height-60,Number.isFinite(s.y)?s.y:canonical.spawn.y));
 s.energy=Math.max(0,Math.min(100,Number.isFinite(s.energy)?s.energy:100));
 s.money=Math.max(0,Number.isFinite(s.money)?s.money:10000);
 s.inventory=Array.isArray(s.inventory)?s.inventory:[];
}
sanitize();
window.addEventListener('beforeunload',sanitize,{passive:true});
V.integrity={version:'V87.5.0',canonicalWorld:'core/world.js',worldLocked:true,recovery:true};
window.dispatchEvent(new CustomEvent('villa-pelon-integrity-ready',{detail:{version:'V87.5.0',world:canonical.width+'x'+canonical.height}}));
})();
