/* VILLA PELÓN — VERGEL V90
   Complemento sistémico: naturaleza/productividad/vida rural.
   Regla: VERGEL no reemplaza al motor; consume worldGeometry y gameState.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const G=V.worldGeometry||(V.worldGeometry={});
const S=V.gameState||(V.gameState={});
const VERGEL=V.vergel=V.vergel||{};
VERGEL.version='90.0';
VERGEL.season=VERGEL.season||'verano';
VERGEL.day=Number.isFinite(+VERGEL.day)?+VERGEL.day:(+S.day||1);
VERGEL.resources=VERGEL.resources&&typeof VERGEL.resources==='object'?VERGEL.resources:{};
const zones=VERGEL.zones=VERGEL.zones||[
 {id:'huerta_01',x:5050,y:2300,w:600,h:260,kind:'huerta',yield:'verduras'},
 {id:'chacra_01',x:6650,y:2880,w:260,h:380,kind:'chacra',yield:'fruta'},
 {id:'chacra_02',x:7150,y:2820,w:420,h:300,kind:'chacra',yield:'fruta'}
];
function key(z){return z.id+':'+(+S.day||1)}
function refresh(){zones.forEach(z=>{if(!VERGEL.resources[key(z)])VERGEL.resources[key(z)]={ready:true,amount:z.kind==='huerta'?4:6};});}
function nearest(){let best=null,bd=Infinity;zones.forEach(z=>{const d=Math.hypot((S.x||0)-(z.x+z.w/2),(S.y||0)-(z.y+z.h/2));if(d<bd){bd=d;best=z}});return bd<190?best:null}
VERGEL.harvest=function(){const z=nearest();if(!z)return {ok:false,reason:'lejos'};const r=VERGEL.resources[key(z)]||{ready:true,amount:0};if(!r.ready||r.amount<=0)return {ok:false,reason:'agotado'};r.amount--;S.inventory=S.inventory||[];S.inventory.push(z.yield);S.energy=Math.max(0,(+S.energy||0)-4);return {ok:true,item:z.yield,zone:z.id,left:r.amount}}
VERGEL.inspect=function(){const z=nearest();return z?{ok:true,zone:z.id,kind:z.kind,yield:z.yield}:null}
function daily(){if((+S.day||1)!==VERGEL.day){VERGEL.day=+S.day||1;VERGEL.season=(VERGEL.day%4===0)?'otoño':(+VERGEL.day%4===1?'verano':(+VERGEL.day%4===2?'primavera':'invierno'));refresh()}}
refresh();
setInterval(daily,500);
V.vergel=VERGEL;
})();
