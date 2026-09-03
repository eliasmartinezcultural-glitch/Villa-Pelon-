/* VILLA PELÓN V55 — integración funcional: un contrato para que los motores no compitan. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const state=V.gameState;
const life=V.life;
if(!state)return;
V.runtime=V.runtime||{};
V.runtime.version='V55';
V.runtime.platforms=['pc','mobile'];
V.runtime.worldBounds={w:3200,h:2000};
V.runtime.rules={singlePlayerState:true,singleLifeUpdate:true,roadsAreNavigation:true,housesStayOffRoads:true,noActorInsideBuilding:true};
V.runtime.ready=true;
/* Unifica los contratos que otros módulos consultan sin crear otro ciclo de juego. */
if(life){
 life.places=life.places||{};
 life.places.casa=life.places.casa||[785,500];
 life.places.plaza=life.places.plaza||[1160,400];
 life.places.radio=life.places.radio||[1200,1190];
 life.places.chacra=life.places.chacra||[2140,1000];
 life.places.almacen=life.places.almacen||[1750,610];
}
/* El runtime queda observable para diagnóstico sin mostrar paneles al jugador. */
window.dispatchEvent(new CustomEvent('villa-pelon-runtime-ready',{detail:{version:'V55',platforms:['pc','mobile']}}));
})();
