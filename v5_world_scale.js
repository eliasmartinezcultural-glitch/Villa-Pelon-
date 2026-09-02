/* Villa Pelón V6.7 — ESCALA FÍSICA + MAPA EXPANDIDO
   Contrato de datos compartido. El motor principal es el único renderizador.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.worldScale=Object.assign(V.worldScale||{}, {version:3,unit:'world-pixel',adultHeight:60,childHeight:47,cowHeight:67,horseHeight:69,doorHeight:78,carLength:86,truckLength:112,roadWidth:230,sidewalkWidth:34});
const W=8400,H=5600;V.world=V.world||{};V.world.w=W;V.world.h=H;V.world.version=Math.max(Number(V.world.version)||0,7);V.world.scaleVersion=3;
V.world.regions={city:{x:0,y:0,w:3900,h:3000},suburbs:{x:3500,y:400,w:2200,h:2800},rural:{x:3000,y:2700,w:4000,h:2900},river:{x:7000,y:0,w:1200,h:5600}};
V.world.roads=V.world.roads||[
{x:0,y:700,w:5200,h:230},{x:1180,y:0,w:220,h:2700},{x:3950,y:700,w:1250,h:230},{x:3950,y:1250,w:230,h:1350},{x:5000,y:700,w:230,h:2300},{x:3550,y:2200,w:1900,h:230},{x:5900,y:1450,w:230,h:1700},{x:6100,y:2700,w:1100,h:230},{x:6700,y:3500,w:540,h:230}
];
V.world.river=V.world.regions.river;V.world.bridges=[{y:815,h:90},{y:1395,h:90}];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
for(const n of(V.npcs||[])){n.heightScale=Number(n.age)<18?.78:1;n.worldHeight=Number(n.age)<18?S.childHeight:S.adultHeight;n.scaleClass=Number(n.age)<18?'child':'adult'}
for(const n of(V.life?.ambient||[])){n.heightScale=Number(n.age)<18?.78:1;n.worldHeight=Number(n.age)<18?S.childHeight:S.adultHeight;n.scaleClass=Number(n.age)<18?'child':'adult'}
for(const a of(V.life?.animals||[])){a.worldScale=a.type==='vaca'?1.12:a.type==='caballo'?1.15:.32}
for(const o of(V.life?.traffic||[])){o.worldScale=o.type==='camion'?1.05:o.type==='tractor'?.95:o.type==='bicicleta'?.38:.82}
if(V.state){V.state.x=clamp(Number(V.state.x)||1280,60,W-60);V.state.y=clamp(Number(V.state.y)||820,180,H-60)}
S.layout='city-suburbs-rural-river';S.dimensions={width:W,height:H,previous:{width:4200,height:2700},areaMultiplier:4};S.physicalReferences={adult:60,child:47,cow:67,horse:69,door:78,car:86,truck:112};S.renderAuthority='game.js';S.ready=true;
V.v4?.register?.('worldScale',S);
})();
