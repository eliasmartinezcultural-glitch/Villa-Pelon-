/* Villa Pelón V83 — conecta acciones reales del motor con el progreso educativo. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
function boot(){
  if(!V.gameplay||V.__v83GameplayBridge)return;
  const old=V.openDialogue;
  if(typeof old!=='function')return;
  const siteMap={
    'CANAL DE RIEGO':'canal',
    'MIRADOR DE LA MESETA':'mirador',
    'PLAZA DEL PUEBLO':'plaza',
    'LAS CHACRAS':'chacras',
    'LOS VIÑEDOS':'vinedos',
    'CANAL VIEJO':'canal-viejo',
    'RIBERA DEL RÍO':'ribera',
    'SITIO DE FÓSILES':'fossils'
  };
  V.openDialogue=function(speaker,lines){
    const result=old(speaker,lines);
    if(speaker==='ARCHIVO DE MEMORIA')V.gameplay.discover('clue','Pista histórica');
    if(siteMap[speaker])V.gameplay.visitSite(siteMap[speaker]);
    return result;
  };
  V.__v83GameplayBridge=true;
  console.info('[Villa Pelón] V83 gameplay bridge OK');
}
const wait=()=>{if(V.gameState&&V.gameplay)boot();else setTimeout(wait,80)};wait();
})();
