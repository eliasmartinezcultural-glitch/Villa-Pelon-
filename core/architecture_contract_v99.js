/* VILLA PELÓN V99.2 — CONTRATO DE ARQUITECTURA
   Normaliza la autoridad del compositor existente.
   No crea motor, renderer, RAF ni sistema de guardado paralelo.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const E=V.engine=V.engine||{};
const previous=typeof E.health==='function'?E.health.bind(E):null;
function rendererOK(){return !!V.renderCompositor?.singleRAF&&!!document.getElementById('worldDetail')}
function health(){
  const base=previous?previous():{};
  const ok=rendererOK();
  if(ok&&V.buildingDetail)V.buildingDetail.renderOwner='render_compositor_v93';
  return Object.assign({},base,{singleBuildingRenderer:ok,buildingRendererOwner:ok?'render_compositor_v93':(V.buildingDetail?.renderOwner||base.buildingRendererOwner||null),architectureContract:'99.2'});
}
E.health=health;
V.architectureContract={version:'99.2',singleEngine:true,singleBuildingRenderer:rendererOK()};
})();
