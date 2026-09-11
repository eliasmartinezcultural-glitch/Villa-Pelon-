/* VILLA PELÓN V99.1 — CONTRATO DE ARQUITECTURA
   Último contrato de arranque: no crea motor ni renderer.
   Sólo verifica que la autoridad existente conserve el contrato esperado.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const E=V.engine=V.engine||{};
const previous=typeof E.health==='function'?E.health.bind(E):null;
E.health=()=>{
  const base=previous?previous():{};
  return Object.assign({},base,{
    singleBuildingRenderer:
      V.buildingDetail?.renderOwner==='render_compositor_v93' &&
      V.renderCompositor?.singleRAF===true,
    buildingRendererOwner:V.buildingDetail?.renderOwner||base.buildingRendererOwner||null,
    architectureContract:'99.1'
  });
};
V.architectureContract={version:'99.1',singleEngine:true,singleBuildingRenderer:true};
})();
