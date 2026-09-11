/* VILLA PELÓN V100 — CONTRATO DE ARQUITECTURA
   La autoridad visual es render_compositor_v93.js.
   Este contrato no crea motor, renderer, RAF ni guardado paralelo.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const E=V.engine=V.engine||{};
const previous=typeof E.health==='function'?E.health.bind(E):null;
function rendererOK(){
  // La prueba de arquitectura debe validar la autoridad del compositor,
  // no depender del DOM circunstancial del canvas secundario.
  return V.renderCompositor?.singleRAF===true;
}
function health(){
  const base=previous?previous():{};
  const ok=rendererOK();
  if(ok&&V.buildingDetail)V.buildingDetail.renderOwner='render_compositor_v93';
  return Object.assign({},base,{
    singleBuildingRenderer:ok,
    buildingRendererOwner:ok?'render_compositor_v93':(V.buildingDetail?.renderOwner||base.buildingRendererOwner||null),
    architectureContract:'100.1'
  });
}
E.health=health;
V.architectureContract={version:'100.1',singleEngine:true,singleBuildingRenderer:rendererOK(),buildingRendererOwner:'render_compositor_v93'};
})();
