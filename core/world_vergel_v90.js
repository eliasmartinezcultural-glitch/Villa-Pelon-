/* VILLA PELÓN — VERGEL V90.3
   Subsistema de territorio/productividad.
   Estado de recursos persistente dentro del gameState para que guardado/recarga no desincronicen el mundo.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const VERGEL=V.vergel=V.vergel||{};
VERGEL.version='90.3';
VERGEL.season=VERGEL.season||'verano';
VERGEL.day=Number.isFinite(+VERGEL.day)?+VERGEL.day:1;
VERGEL.zones=Array.isArray(VERGEL.zones)?VERGEL.zones:[
 {id:'huerta_01',x:5050,y:2300,w:600,h:260,kind:'huerta',yield:'verduras',yieldLabel:'Verduras',amount:4,label:'Huerta del valle'},
 {id:'chacra_01',x:6650,y:2880,w:260,h:380,kind:'chacra',yield:'fruta',yieldLabel:'Fruta',amount:6,label:'Chacra 01'},
 {id:'chacra_02',x:7150,y:2820,w:420,h:300,kind:'chacra',yield:'fruta',yieldLabel:'Fruta',amount:6,label:'Chacra 02'}
];
function state(){const S=V.gameState||(V.gameState={inventory:[],stats:{}});S.vergelResources=S.vergelResources&&typeof S.vergelResources==='object'?S.vergelResources:{};return S}
function key(z,day){return z.id+':'+day}
function seasonFor(day){return ['verano','otoño','invierno','primavera'][Math.max(0,(day-1)%4)]}
function sync(){const S=state(),day=Math.max(1,+S.day||1);VERGEL.day=day;VERGEL.season=seasonFor(day);VERGEL.resources=S.vergelResources;VERGEL.zones.forEach(z=>{const k=key(z,day);if(!VERGEL.resources[k])VERGEL.resources[k]={ready:true,amount:z.amount,initial:z.amount}});return VERGEL}
function nearest(S){let best=null,bd=Infinity;VERGEL.zones.forEach(z=>{const d=Math.hypot((+S.x||0)-(z.x+z.w/2),(+S.y||0)-(z.y+z.h/2));if(d<bd){bd=d;best=z}});return bd<=190?best:null}
function addInventory(S,item){S.inventory=Array.isArray(S.inventory)?S.inventory:[];S.inventory.push(item);S.vergelInventory=S.vergelInventory&&typeof S.vergelInventory==='object'?S.vergelInventory:{};S.vergelInventory[item]=(S.vergelInventory[item]||0)+1}
VERGEL.inspect=function(){const S=state();sync();const z=nearest(S);if(!z)return{ok:false,reason:'lejos'};const r=VERGEL.resources[key(z,VERGEL.day)];return{ok:true,zone:z.id,kind:z.kind,item:z.yield,label:z.yieldLabel,amount:r.amount,season:VERGEL.season,distance:Math.round(Math.hypot((+S.x||0)-(z.x+z.w/2),(+S.y||0)-(z.y+z.h/2)))}}
VERGEL.harvest=function(){const S=state();sync();const z=nearest(S);if(!z)return{ok:false,reason:'lejos'};if((+S.energy||0)<4)return{ok:false,reason:'energia',label:z.label};const r=VERGEL.resources[key(z,VERGEL.day)];if(!r||!r.ready||r.amount<=0)return{ok:false,reason:'agotado',zone:z.id,label:z.label};r.amount--;addInventory(S,z.yield);S.energy=Math.max(0,(+S.energy||0)-4);S.stats=S.stats&&typeof S.stats==='object'?S.stats:{};S.stats.harvests=(+S.stats.harvests||0)+1;S.stats.vergelHarvests=(+S.stats.vergelHarvests||0)+1;S.flags=S.flags&&typeof S.flags==='object'?S.flags:{};S.flags.vergelUsed=true;return{ok:true,item:z.yield,label:z.yieldLabel,zone:z.id,left:r.amount,season:VERGEL.season,energy:S.energy}}
VERGEL.sync=sync;
window.setInterval(()=>{if(V.gameState&&V.gameState.started)sync()},1000);
})();
