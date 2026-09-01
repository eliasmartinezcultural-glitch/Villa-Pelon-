/* Villa Pelón V4 — INTEGRIDAD
   Diagnóstico y reparación mínima de estado. No reemplaza save/load/render
   y no mantiene bucles propios: game.js es el dueño del ciclo de juego.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const I=V.v4Integrity=V.v4Integrity||{version:4,checks:0,repairs:0,ready:false};
function repair(){
 I.checks++;
 if(V.state&&V.state.version!==4){V.state.version=4;I.repairs++}
 if(V.world) V.world.version=4;
 if(V.v4World) V.v4World.version=4;
 if(V.v4Characters) V.v4Characters.version=4;
 if(V.v4WorldRule) V.v4WorldRule.version=4;
 I.ready=!!(V.engine&&V.world&&V.state);
 return I.ready;
}
V.v4Integrity.repair=repair;
V.v4Integrity.status=()=>({version:4,ready:I.ready,checks:I.checks,repairs:I.repairs,engine:!!V.engine,world:!!V.world,characters:!!V.v4Characters,streetSystem:!!V.streetSystem});
repair();
V.v4?.register?.('integrity',V.v4Integrity);
})();
