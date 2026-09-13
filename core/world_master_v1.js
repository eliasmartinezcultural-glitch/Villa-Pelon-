/* VILLA PELÓN V159 — WORLD MASTER COMPATIBILITY GUARD
   Este archivo NO redefine geometría.
   La única geometría canónica vive en core/v120_world_rebuild.js.
   Se conserva el nombre por compatibilidad con capas antiguas, pero queda prohibido
   que una carga tardía vuelva a colocar edificios, calles, río o plaza.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),G=V.worldGeometry||{};
const expected={world:[8200,4200],urban:{x:300,y:300,w:2700,h:1900},rural:{x:3000,y:300,w:4900,h:2350},river:{x:250,y:2700,w:7600,h:100},picada21:{x:4300,y:3180,w:3500,h:850}};
const rect=(a,b)=>!!a&&!!b&&Math.round(a.x)===b.x&&Math.round(a.y)===b.y&&Math.round(a.w)===b.w&&Math.round(a.h)===b.h;
const plaza=G.plaza;
const valid=Number(V.world?.w)===8200&&Number(V.world?.h)===4200&&rect(G.geometryContract?.urban,expected.urban)&&rect(G.geometryContract?.rural,expected.rural)&&rect(G.river,expected.river)&&rect(G.geometryContract?.picada21,expected.picada21)&&!!plaza&&plaza.id==='plaza_central'&&plaza.open===true;
V.worldMaster={version:'CANONICAL_MAP_1',locked:true,authority:'core/v120_world_rebuild.js',compatibilityGuard:'core/world_master_v1.js',readOnly:true};
V.runtimeAudit=Object.assign(V.runtimeAudit||{},{worldMasterCompatibilityGuard:true,worldMasterReadOnly:true,canonicalGeometryPreserved:valid});
window.dispatchEvent(new CustomEvent('villa-pelon-world-master-compatibility-ready',{detail:{version:'CANONICAL_MAP_1',readOnly:true,valid}}));
})();
