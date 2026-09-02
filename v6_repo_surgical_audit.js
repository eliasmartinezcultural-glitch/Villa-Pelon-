/* Villa Pelón V6.42 — AUDITORÍA QUIRÚRGICA + RECONCILIACIÓN TERRITORIAL
   Una sola autoridad de entrada/render/movimiento. Limpia geometría inválida
   antes de que un edificio pueda tapar una calle, el río u otro edificio.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const A=V.repoAudit=V.repoAudit||{version:42,checks:{},repairs:[],failures:[]};
const note=s=>{if(!A.repairs.includes(s))A.repairs.push(s)};
const check=(name,ok,detail)=>{A.checks[name]={ok:!!ok,detail:detail||''};if(!ok&&!A.failures.includes(name))A.failures.push(name)};
const rect=a=>({x:Number(a?.x)||0,y:Number(a?.y)||0,w:Math.max(0,Number(a?.w)||0),h:Math.max(0,Number(a?.h)||0)});
const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
function sanitizeGeometry(){
 const list=Array.isArray(V.buildings)?V.buildings:[],roads=Array.isArray(V.streetSystem?.roads)?V.streetSystem.roads:[];
 const river={x:7000,y:0,w:1200,h:5600},kept=[],seen=new Set();let removed=0;
 for(const b of list){const r=rect(b),key=[Math.round(r.x),Math.round(r.y),Math.round(r.w),Math.round(r.h),String(b.type||'')].join(':');
  if(seen.has(key)){removed++;continue}seen.add(key);
  if(r.w<90||r.h<70||r.x<40||r.y<120||r.x+r.w>8360||r.y+r.h>5560||overlap(r,river)>r.w*r.h*.12){removed++;continue}
  if(roads.some(q=>{const z=rect(q);return overlap(r,z)>r.w*r.h*.22})){removed++;continue}
  if(kept.some(q=>{const z=rect(q),small=Math.min(r.w*r.h,z.w*z.h);return small>0&&overlap(r,z)/small>.72})){removed++;continue}
  kept.push(b);
 }
 if(removed){V.buildings=kept;note('removed '+removed+' invalid, road-blocking or duplicated building footprints')}
 if(V.buildingSystem?.registry)V.buildingSystem.registry();
 check('geometry',removed===0,'building footprints sanitized; removed='+removed);return{count:kept.length,removed};
}
function platform(){
 const coarse=matchMedia('(pointer:coarse)').matches||innerWidth<=900;document.body.classList.toggle('villa-touch',coarse);document.body.classList.toggle('villa-pc',!coarse);
 document.documentElement.style.setProperty('--villa-vw',(visualViewport?.width||innerWidth)+'px');document.documentElement.style.setProperty('--villa-vh',(visualViewport?.height||innerHeight)+'px');
 const c=document.getElementById('world');if(c)c.style.touchAction='none';
 const legacy=document.getElementById('touch');const stick=document.querySelector('.platform-stick');if(legacy){legacy.setAttribute('aria-hidden',stick?'true':'false');legacy.style.display=coarse&&!stick?'':'none'}
 const interact=document.getElementById('interact');if(interact){interact.style.touchAction='manipulation';interact.style.minWidth=coarse?'72px':'';interact.style.minHeight=coarse?'72px':''}
 note(coarse?'mobile input normalized':'desktop input normalized');
}
function identity(){const bad='San Patricio del Chañar';const visible=[...document.body.querySelectorAll('*')].filter(e=>e.children.length===0);let hits=0;for(const e of visible){if((e.textContent||'').includes(bad)){e.textContent=e.textContent.replaceAll(bad,'Villa Pelón');hits++}}check('identity',hits===0,`visible identity references: ${hits}`);if(hits)note('playable identity scrubbed')}
function repairEngine(){const e=V.engine;if(!e||typeof e.update!=='function'||typeof e.render!=='function'){check('engine',false,'motor V6 no expuesto');return}e.version=Math.max(Number(e.version)||0,54);e.authority='v6_game_core';e.movementAuthority='v6_game_core';e.renderAuthority='v6_game_core';e.inputAuthority='v6_game_core';V.engineReady=true;check('engine',true,'V6 engine update/render');note('engine authority normalized')}
function repairWorld(){const w=V.world;if(w){w.w=8400;w.h=5600;w.version=8}if(V.state){V.state.flags=V.state.flags||{};V.state.relationships=V.state.relationships||{};V.state.inventory=Array.isArray(V.state.inventory)?V.state.inventory:[];V.state.x=Math.max(60,Math.min(8340,Number(V.state.x)||1280));V.state.y=Math.max(180,Math.min(5540,Number(V.state.y)||820))}check('world',!!w&&w.w===8400&&w.h===5600,'world contract 8400x5600');check('input',!!V.input,'shared input state');check('population',!!V.life||!!V.population,'living world layer')}
function repairSave(){const e=V.engine;if(!e)return;const save=e.save;if(typeof save==='function'&&!save.__repairWrapped){e.save=function(){const r=save.apply(this,arguments);try{const s=V.state;localStorage.setItem('villa_pelon_repair_checkpoint',JSON.stringify({x:s.x,y:s.y,day:s.day,minutes:s.minutes,money:s.money,energy:s.energy,mission:s.mission,inventory:s.inventory,history:s.history,relationships:s.relationships,flags:s.flags}))}catch(_){}return r};e.save.__repairWrapped=true;note('redundant save checkpoint enabled')} }
function inputAuthority(){const e=V.engine,B=V.buildingSystem;if(V.v4Playability)V.v4Playability.keys=true;if(B&&typeof B.enter==='function'&&!B.__commercialAuthority){const originalEnter=B.enter;B.enter=function(b){const type=String(b?.type||'').toLowerCase(),label=String(b?.label||b?.name||'').toLowerCase();if((type==='shop'||type==='bakery'||/almac[eé]n|comercio|panader/.test(label))&&V.shopFlow?.open)return V.shopFlow.open(b)!==false;return originalEnter.call(this,b)};B.__commercialAuthority=true;note('commercial entry unified with shop flow')}if(!e)return;if(!V.__finalInputListener){window.addEventListener('keydown',ev=>{if(!V.state?.started)return;const k=String(ev.key||'').toLowerCase();if(k!=='e'&&k!==' '&&k!=='escape')return;if(k==='escape'&&V.buildingSystem?.inside){ev.preventDefault();ev.stopImmediatePropagation();V.buildingSystem.exit?.();return}ev.stopImmediatePropagation()},true);V.__finalInputListener=true;note('final keyboard authority installed after deferred systems')}check('inputAuthority',e.movementAuthority==='v6_game_core'&&e.inputAuthority==='v6_game_core','movement/input owned by V6 core')}
function renderContract(){const e=V.engine;check('renderChain',!!e?.render&&e.renderAuthority==='v6_game_core','single render authority');if(V.territorialVisuals)note('territorial render layer retained');if(V.buildingSystem?.buildings)note('building registry reconciled')}
function boot(){try{A.repairs=[];A.failures=[];repairEngine();repairWorld();sanitizeGeometry();repairSave();platform();inputAuthority();renderContract();check('history',Array.isArray(V.history)&&typeof V.history.inspect==='function','history system');check('rpg',!!V.rpgProgression?.api,'RPG progression API');check('streets',Array.isArray(V.streetSystem?.roads)&&V.streetSystem.roads.length>=8,'street graph');check('mobile',!!V.platform?.joystick||!!document.querySelector('.platform-stick')||!!document.getElementById('touch'),'mobile controls');check('save',!!V.engine?.save&&!!V.engine?.load,'save/load');identity();A.ready=A.failures.length===0;A.timestamp=Date.now();V.engineAudit=A;console.info('[Villa Pelón] V6.42 surgical reconciliation',A)}catch(err){A.ready=false;A.error=String(err?.message||err);console.error('[Villa Pelón] repair audit failed',err)}}
function bootLater(){setTimeout(boot,0);setTimeout(()=>{platform();identity()},350)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootLater,{once:true});else bootLater();addEventListener('resize',platform,{passive:true});visualViewport?.addEventListener('resize',platform,{passive:true});
})();
