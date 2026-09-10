/* VILLA PELÓN — MISSION RUNTIME 93.1
   El motor V93 es la única autoridad de interacción y progreso.
   Este archivo sólo conserva migración/compatibilidad de partidas antiguas.
   No registra listeners de E/ESPACIO ni un segundo ticker de misiones.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.gameState||(V.gameState={});
const M=V.missions;
if(!M)return;
M.ensure?.(S);
try{
  const raw=JSON.parse(localStorage.getItem('villa_pelon_missions')||'null');
  if(raw&&typeof raw==='object'){
    if(raw.missionId)S.missionId=raw.missionId;
    if(Number.isFinite(+raw.missionStep))S.missionStep=Math.max(0,+raw.missionStep);
    if(raw.missionFlags&&typeof raw.missionFlags==='object')S.missionFlags=raw.missionFlags;
    if(Array.isArray(raw.missionHistory))S.missionHistory=raw.missionHistory;
  }
}catch(_){}
V.missionRuntime={
  version:'93.1',
  tick:()=>{},
  regions:{
    rural:{x:4900,y:0,w:3300,h:4200},
    winery:{x:5500,y:300,w:1900,h:1800},
    plaza:{x:0,y:400,w:1050,h:450},
    picada21:{x:6750,y:2050,w:1450,h:1100}
  },
  complete:()=>false
};
})();
