/* VILLA PELÓN V100.1 — CONTRATO DE ARQUITECTURA
   Una sola autoridad visual: render_compositor_v93.js.
   Este contrato valida la arquitectura real sin crear otro motor, renderer, RAF ni guardado.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const E=V.engine=V.engine||{};
const previous=typeof E.health==='function'?E.health.bind(E):null;
function rendererOK(){
  const compositor=V.renderCompositor;
  const detail=document.getElementById('worldDetail');
  const owner=V.buildingDetail?.renderOwner;
  return !!detail && (compositor?.singleRAF===true || owner==='render_compositor_v93');
}
function health(){
  const base=previous?previous():{};
  const ok=rendererOK();
  if(ok){
    V.buildingDetail=V.buildingDetail||{};
    V.buildingDetail.renderOwner='render_compositor_v93';
  }
  return Object.assign({},base,{
    singleBuildingRenderer:ok,
    buildingRendererOwner:ok?'render_compositor_v93':(V.buildingDetail?.renderOwner||base.buildingRendererOwner||null),
    architectureContract:'100.1'
  });
}
E.health=health;
V.architectureContract={version:'100.1',singleEngine:true,singleBuildingRenderer:rendererOK(),buildingRendererOwner:'render_compositor_v93'};
})();
