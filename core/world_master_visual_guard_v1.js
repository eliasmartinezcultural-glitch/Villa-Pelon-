/* WORLD MASTER VISUAL GUARD V1
   Última barrera antes del render: ningún módulo heredado puede volver a imponer
   geometría visual fuera de WORLD_MASTER_V1.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),G=V.worldGeometry||{},M=V.worldMaster;
if(!M?.locked||M.version!=='WORLD_MASTER_V1')throw new Error('WORLD_MASTER_V1 no bloqueado');
const W=V.world||{w:8200,h:4200},r=G.river;
const inside=(x,y)=>x>=0&&y>=0&&x<=W.w&&y<=W.h;
const riverHit=(o)=>r&&o&&o.x!=null&&o.y!=null&&o.x<=r.x+r.w&&o.x>=r.x&&o.y<=r.y+r.h&&o.y>=r.y;
function clean(list){return Array.isArray(list)?list.filter(o=>o&&inside(Number(o.x),Number(o.y))&&!riverHit(o)):list}
if(V.peopleVehicles){V.peopleVehicles.ambient=clean(V.peopleVehicles.ambient);V.peopleVehicles.vehicleData=clean(V.peopleVehicles.vehicleData);V.peopleVehicles.animals=clean(V.peopleVehicles.animals)}
if(V.historicalWorld)V.historicalWorld.draw=()=>{};
V.visualMasterGuard={version:'WORLD_MASTER_VISUAL_GUARD_V1',locked:true,authority:M.authority,river:{...r},historicalLegacyRendererDisabled:true,ambientSanitized:true};
V.masterAudit=V.masterAudit||{};V.masterAudit.visualGuard=V.visualMasterGuard;
window.dispatchEvent(new CustomEvent('villa-pelon-world-master-visual-guard',{detail:V.visualMasterGuard}));
})();
