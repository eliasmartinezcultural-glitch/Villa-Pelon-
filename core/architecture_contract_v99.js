/* VILLA PELÓN V100.2 — CONTRATO DE ARQUITECTURA
   Autoridades únicas y verificables:
   - un motor principal
   - un compositor visual
   - una simulación de vida
   - un guardado persistente
   No crea motor, renderer, RAF ni almacenamiento paralelo.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const E=V.engine=V.engine||{};
const previous=typeof E.health==='function'?E.health.bind(E):null;
function rendererOK(){
  const compositor=V.renderCompositor;
  const detail=document.getElementById('worldDetail');
  return !!detail && compositor?.singleRAF===true;
}
function lifeOK(){return V.villageLife?.active===true&&V.villageLife?.singleTick===true&&V.villageLife?.saveAuthority==='gameState';}
function health(){
  const base=previous?previous():{};
  const render=rendererOK();
  const life=lifeOK();
  V.buildingDetail=V.buildingDetail||{};
  if(render)V.buildingDetail.renderOwner='render_compositor_v93';
  return Object.assign({},base,{
    singleBuildingRenderer:render,
    buildingRendererOwner:render?'render_compositor_v93':(V.buildingDetail.renderOwner||base.buildingRendererOwner||null),
    singleVillageLife:life,
    lifeSaveAuthority:life?'gameState':null,
    architectureContract:'100.2'
  });
}
E.health=health;
V.architectureContract={version:'100.2',singleEngine:true,singleBuildingRenderer:rendererOK(),buildingRendererOwner:'render_compositor_v93',singleVillageLife:lifeOK(),lifeSaveAuthority:lifeOK()?'gameState':null};
})();
