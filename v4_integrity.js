/* Villa Pelón — INTEGRIDAD COMPATIBLE
   Diagnóstico de arranque. No modifica la versión territorial final ni crea ciclos.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const I=V.v4Integrity=V.v4Integrity||{version:6.6,checks:0,repairs:0,ready:false};
function repair(){I.checks++;I.ready=!!(V.engine&&V.world&&V.state);return I.ready}
I.repair=repair;
I.status=()=>({version:6.6,ready:I.ready,checks:I.checks,repairs:I.repairs,engine:!!V.engine,world:!!V.world,characters:!!V.v4Characters,streetSystem:!!V.streetSystem});
repair();
V.v4?.register?.('integrity',I);
})();
