/* VILLA PELÓN V128 — WORLD LIFE LOCK
   Congela las reglas, no el estado dinámico. El reloj, clima y ciclo ambiental
   pueden avanzar; sus leyes no pueden ser redefinidas por contenido posterior.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const A=V.atmosphere||{};
const laws=V.worldLaws||{};
V.worldLifeLock={
 version:'V128',locked:true,readOnlyRules:true,
 immutable:{timeAuthority:'gameState.minutes',calendar:'atmosphere.calendar',weather:'atmosphere.weather',phase:'atmosphere.phase',climate:'deterministic-seasonal'},
 principle:'life evolves; world laws do not',
 geometryStillLocked:!!V.geometryFloorLock?.locked,
 contentStillAboveBase:!!V.geometryFloorLock?.readOnly,
 lawsChecksum:JSON.stringify(laws.rules||[]).length,
 atmosphereVersion:A.version||null
};
if(V.worldMaster)V.worldMaster.lifeLock='V128';
window.dispatchEvent(new CustomEvent('villa-pelon-world-life-locked',{detail:V.worldLifeLock}));
})();