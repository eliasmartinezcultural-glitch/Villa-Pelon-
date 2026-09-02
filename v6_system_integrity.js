/* Villa Pelón V6.22 — INTEGRIDAD Y AUTOREPARACIÓN
   Auditoría runtime de los sistemas críticos. No crea un loop ni reemplaza
   las autoridades existentes: valida contratos, corrige estados inválidos y
   expone diagnóstico para QA.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const I=V.systemIntegrity=V.systemIntegrity||{version:6.22,checks:[],repairs:0,ready:false};
const checks=[]; const repair=(name,fn)=>{try{if(fn()){I.repairs++;checks.push({name,status:'repaired'})}else checks.push({name,status:'ok'})}catch(e){checks.push({name,status:'error',error:String(e?.message||e)})}};
function finite(v,d){return Number.isFinite(Number(v))?Number(v):d}
function run(){checks.length=0;
 repair('state',()=>{const s=V.state;if(!s)return false;let r=false;s.x=finite(s.x,1280);s.y=finite(s.y,820);s.money=Math.max(0,finite(s.money,10000));s.energy=Math.max(0,Math.min(100,finite(s.energy,100)));s.minutes=Math.max(0,finite(s.minutes,480));s.day=Math.max(1,Math.floor(finite(s.day,1)));if(!Array.isArray(s.inventory)){s.inventory=[];r=true}if(!Array.isArray(s.history)){s.history=[];r=true}if(!s.relationships||typeof s.relationships!=='object'){s.relationships={};r=true}return r});
 repair('world-bounds',()=>{const w=V.world,s=V.state;if(!w||!s)return false;const x=Math.max(60,Math.min(w.w-60,s.x)),y=Math.max(180,Math.min(w.h-60,s.y));const r=x!==s.x||y!==s.y;s.x=x;s.y=y;return r});
 repair('streets',()=>{const S=V.streetSystem;if(!S)return false;let r=false;if(!Array.isArray(S.roads)){S.roads=[];r=true}for(const road of S.roads){if(!road.id){road.id='road_'+Math.random().toString(36).slice(2,8);r=true}if(!road.kind){road.kind='urban';r=true}road.x=finite(road.x,0);road.y=finite(road.y,0);road.w=Math.max(1,finite(road.w,230));road.h=Math.max(1,finite(road.h,230));}if(!S.roadById||Object.keys(S.roadById).length!==S.roads.length){S.roadById=Object.fromEntries(S.roads.map(x=>[x.id,x]));r=true}return r});
 repair('buildings',()=>{const B=V.buildingSystem;if(!B)return false;let r=false;if(!Array.isArray(B.buildings)){B.buildings=[];r=true}for(const b of B.buildings){b.x=finite(b.x,0);b.y=finite(b.y,0);b.w=Math.max(1,finite(b.w,100));b.h=Math.max(1,finite(b.h,80));if(!b.door){b.door={x:b.x+b.w/2,y:b.y+b.h+24};r=true}if(!Array.isArray(b.accessPoints)){b.accessPoints=[{x:b.door.x,y:b.door.y}];r=true}if(!b.interior)b.interior={rooms:[{id:'main',label:'Interior'}]};if(!Array.isArray(b.interior.rooms))b.interior.rooms=[{id:'main',label:'Interior'}];}if(!B.byId)B.byId=Object.fromEntries(B.buildings.map(x=>[x.id,x]));return r});
 repair('population',()=>{let r=false;if(!Array.isArray(V.npcs)){V.npcs=[];r=true}for(const n of V.npcs){n.x=finite(n.x,1280);n.y=finite(n.y,820);if(!n.home||!Number.isFinite(Number(n.home.x))||!Number.isFinite(Number(n.home.y))){n.home={x:n.x,y:n.y};r=true}}return r});
 repair('agriculture',()=>{const A=V.agriculturalCycle;if(!A)return false;let r=false;if(!Array.isArray(A.parcels)){A.parcels=[];r=true}for(const p of A.parcels){p.x=finite(p.x,0);p.y=finite(p.y,0);p.w=Math.max(1,finite(p.w,100));p.h=Math.max(1,finite(p.h,100));p.growth=Math.max(0,Math.min(1,finite(p.growth,0)));p.moisture=Math.max(0,Math.min(1,finite(p.moisture,0)))}return r});
 repair('mobile-controls',()=>{const t=document.getElementById('touch');if(!t)return false;const buttons=t.querySelectorAll('[data-key]');let r=false;for(const b of buttons){if(!b.dataset.key){b.dataset.key=b.getAttribute('aria-label')?.toLowerCase()||'up';r=true}}return r});
 repair('navigation-contract',()=>{const N=V.territorialNavigation;if(!N)return false;let r=false;if(typeof N.nextWaypoint!=='function'&&typeof N.route==='function'){N.nextWaypoint=(actor,target)=>{const path=N.route(actor,target);return Array.isArray(path)?path[0]||null:null};r=true}if(typeof N.clear!=='function')N.clear=()=>{};return r});
 I.checks=checks.map(x=>({...x}));I.ready=checks.every(x=>x.status!=='error');I.lastRun=Date.now();V.systemIntegrity=I;return I;
}
V.runSystemAudit=run;
function boot(){try{run()}catch(e){I.ready=false;I.fatal=String(e?.message||e)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0),{once:true});else setTimeout(boot,0);
setTimeout(boot,1200);
})();