/* Villa Pelón V6.22 — INTEGRIDAD, AUDITORÍA Y AUTOREPARACIÓN
   Autoridad única de QA runtime. No crea loop, física ni renderer.
   Detecta dependencias críticas ausentes, repara contratos seguros y deja
   diagnóstico reutilizable para futuras iteraciones.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const I=V.systemIntegrity=V.systemIntegrity||{version:6.22,checks:[],repairs:0,ready:false,fatal:[]};
const checks=[];
const critical=(name,fn)=>{try{const ok=!!fn();checks.push({name,status:ok?'ok':'fatal'});if(!ok)I.fatal.push(name)}catch(e){checks.push({name,status:'fatal',error:String(e?.message||e)});I.fatal.push(name)}};
const repair=(name,fn)=>{try{const changed=!!fn();checks.push({name,status:changed?'repaired':'ok'});if(changed)I.repairs++}catch(e){checks.push({name,status:'error',error:String(e?.message||e)});I.fatal.push(name)}};
const finite=(v,d)=>Number.isFinite(Number(v))?Number(v):d;
function run(){checks.length=0;I.fatal=[];I.repairs=0;
  critical('boot-state',()=>V.state&&typeof V.state==='object');
  critical('boot-life',()=>V.life&&typeof V.life.update==='function'&&typeof V.life.drawWorld==='function');
  critical('boot-street-authority',()=>V.streetSystem&&Array.isArray(V.streetSystem.roads));
  critical('boot-building-authority',()=>V.buildingSystem&&Array.isArray(V.buildingSystem.buildings));
  critical('boot-navigation-authority',()=>V.territorialNavigation&&typeof V.territorialNavigation.move==='function');
  critical('boot-game-canvas',()=>document.getElementById('world'));
  repair('state-contract',()=>{const s=V.state;if(!s)return false;let r=false;const before={x:s.x,y:s.y,money:s.money,energy:s.energy,minutes:s.minutes,day:s.day};s.x=finite(s.x,1280);s.y=finite(s.y,820);s.money=Math.max(0,finite(s.money,10000));s.energy=Math.max(0,Math.min(100,finite(s.energy,100)));s.minutes=Math.max(0,finite(s.minutes,480));s.day=Math.max(1,Math.floor(finite(s.day,1)));if(!Array.isArray(s.inventory)){s.inventory=[];r=true}if(!Array.isArray(s.history)){s.history=[];r=true}if(!s.relationships||typeof s.relationships!=='object'){s.relationships={};r=true}return r||Object.keys(before).some(k=>before[k]!==s[k])});
  repair('world-bounds',()=>{const w=V.world,s=V.state;if(!w||!s||!Number.isFinite(w.w)||!Number.isFinite(w.h))return false;const x=Math.max(60,Math.min(w.w-60,s.x)),y=Math.max(180,Math.min(w.h-60,s.y));const r=x!==s.x||y!==s.y;s.x=x;s.y=y;return r});
  repair('street-index',()=>{const S=V.streetSystem;if(!S||!Array.isArray(S.roads))return false;let r=false;for(const road of S.roads){if(!road.id){road.id='road_'+Math.random().toString(36).slice(2,8);r=true}if(!road.kind){road.kind='urban';r=true}}const expected=Object.fromEntries(S.roads.map(x=>[x.id,x]));if(!S.roadById||Object.keys(S.roadById).length!==S.roads.length||S.roads.some(x=>S.roadById[x.id]!==x)){S.roadById=expected;r=true}return r});
  repair('building-contract',()=>{const B=V.buildingSystem;if(!B||!Array.isArray(B.buildings))return false;let r=false;for(const b of B.buildings){b.x=finite(b.x,0);b.y=finite(b.y,0);b.w=Math.max(1,finite(b.w,100));b.h=Math.max(1,finite(b.h,80));if(!b.door||!Number.isFinite(Number(b.door.x))||!Number.isFinite(Number(b.door.y))){b.door={x:b.x+b.w/2,y:b.y+b.h+24};r=true}if(!Array.isArray(b.accessPoints)){b.accessPoints=[{x:b.door.x,y:b.door.y}];r=true}if(!b.interior)b.interior={rooms:[{id:'main',label:'Interior'}]};if(!Array.isArray(b.interior.rooms))b.interior.rooms=[{id:'main',label:'Interior'}]}const expected=Object.fromEntries(B.buildings.filter(x=>x.id).map(x=>[x.id,x]));if(!B.byId||Object.keys(B.byId).length!==Object.keys(expected).length||Object.keys(expected).some(k=>B.byId[k]!==expected[k])){B.byId=expected;r=true}return r});
  repair('population-contract',()=>{if(!Array.isArray(V.npcs))return false;let r=false;for(const n of V.npcs){n.x=finite(n.x,1280);n.y=finite(n.y,820);if(!n.home||!Number.isFinite(Number(n.home.x))||!Number.isFinite(Number(n.home.y))){n.home={x:n.x,y:n.y};r=true}}return r});
  repair('agriculture-contract',()=>{const A=V.agriculturalCycle;if(!A||!Array.isArray(A.parcels))return false;let r=false;for(const p of A.parcels){p.x=finite(p.x,0);p.y=finite(p.y,0);p.w=Math.max(1,finite(p.w,100));p.h=Math.max(1,finite(p.h,100));p.growth=Math.max(0,Math.min(1,finite(p.growth,0)));p.moisture=Math.max(0,Math.min(1,finite(p.moisture,0)))}return r});
  critical('controls-dom',()=>{const t=document.getElementById('touch');return !!t&&!!document.getElementById('interact')});
  critical('interaction-dom',()=>!!document.getElementById('dialogue')&&!!document.getElementById('dialogueNext'));
  critical('unique-script-loads',()=>{const scripts=[...document.scripts].map(s=>s.src).filter(Boolean);return new Set(scripts).size===scripts.length});
  repair('navigation-contract',()=>{const N=V.territorialNavigation;if(!N)return false;let r=false;if(typeof N.clear!=='function'){N.clear=()=>{};r=true}return r});
  I.checks=checks.map(x=>({...x}));I.ready=I.fatal.length===0;I.lastRun=Date.now();I.version=6.22;V.systemIntegrity=I;return I;
}
V.runSystemAudit=run;
function boot(){try{run()}catch(e){I.ready=false;I.fatal=['audit-runtime'];I.error=String(e?.message||e)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0),{once:true});else setTimeout(boot,0);setTimeout(boot,1200);
})();