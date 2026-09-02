/* Villa Pelón V6.3 — INTEGRACIÓN FINAL
   Capa única de reconciliación entre motor, mapa, vida, interacción y UI.
   No crea RAF ni timers propios.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const X=V.v6Integration=V.v6Integration||{version:3,enabled:true,ready:false};
const W=V.world;
if(!W||!V.engine)return;
W.w=Math.max(Number(W.w)||0,8400);W.h=Math.max(Number(W.h)||0,5600);W.version=6;
V.v6Map=V.v6Map||{version:1,width:W.w,height:W.h,river:{x:7000,y:0,w:1200,h:5600},regions:{city:{x:0,y:0,w:3900,h:3000},suburbs:{x:3500,y:400,w:2200,h:2800},rural:{x:3000,y:2700,w:5400,h:2900}}};
V.v6Map.width=W.w;V.v6Map.height=W.h;
const river=V.v6Map.river;
const bridges=[{y:790,h:150},{y:1330,h:150}];
const inside=(x,y,b,pad=12)=>x>b.x-pad&&x<b.x+b.w+pad&&y>b.y-pad&&y<b.y+b.h+pad;
const bridgeAt=y=>bridges.some(b=>Math.abs(y-(b.y+b.h/2))<b.h/2);
function riverBlocked(x,y){return x>river.x-8&&x<river.x+river.w+8&&!bridgeAt(y)}
function solid(x,y,ignore){return (V.buildings||[]).some(b=>b!==ignore&&b.collision!==false&&inside(x,y,b,14))}
function clampEntity(o){if(!o)return;o.x=Math.max(60,Math.min(W.w-60,o.x));o.y=Math.max(180,Math.min(W.h-60,o.y))}
function resolvePlayer(){const s=V.state;if(!s)return;clampEntity(s);if(riverBlocked(s.x,s.y)){const old=s._v6Safe||{x:1280,y:820};s.x=old.x;s.y=old.y}if(!solid(s.x,s.y)){s._v6Safe={x:s.x,y:s.y}}}
function resolveNPCs(){for(const n of(V.npcs||[])){if(!Number.isFinite(n.x)||!Number.isFinite(n.y))continue;clampEntity(n);if(riverBlocked(n.x,n.y)){n.x=n._v6SafeX??n.x;n.y=n._v6SafeY??n.y}if(solid(n.x,n.y)){n.x=n._v6SafeX??n.x;n.y=n._v6SafeY??n.y}else{n._v6SafeX=n.x;n._v6SafeY=n.y}}}
function steerPeople(){const ps=V.worldLifeV56?.people||[];for(const p of ps){if(!Number.isFinite(p.x)||!Number.isFinite(p.y))continue;clampEntity(p);if(riverBlocked(p.x,p.y)){p.x=p._v6SafeX??p.x;p.y=p._v6SafeY??p.y}if(solid(p.x,p.y)){p.x=p._v6SafeX??p.x;p.y=p._v6SafeY??p.y}else{p._v6SafeX=p.x;p._v6SafeY=p.y}}}
function patchUpdate(){if(X.updatePatched)return;const old=V.engine.update;if(typeof old!=='function')return;V.engine.update=function(dt){const r=old.apply(this,arguments);if(V.state?.started){resolvePlayer();resolveNPCs();steerPeople();V.state._v6World={w:W.w,h:W.h,river:true};}return r};X.updatePatched=true}
function interaction(){if(X.interactionPatched)return;const old=V.engine.interact;if(typeof old!=='function')return;V.engine.interact=function(){if(V.state?.dialogue)return old.apply(this,arguments);const n=typeof V.engine.nearest==='function'?V.engine.nearest():null;if(n&&n.id&&V.npcs?.includes(n)){if(typeof V.engine.openDialogue==='function')return V.engine.openDialogue(n.name,n.lines||[]);return old.apply(this,arguments)}return old.apply(this,arguments)};X.interactionPatched=true}
function saveBridge(){const oldSave=V.story?.save;if(V.story&&!V.story.__v6SavePatched&&typeof oldSave==='function'){V.story.save=function(){const r=oldSave.apply(this,arguments);try{localStorage.setItem('villa_pelon_v6_state',JSON.stringify({version:3,x:V.state.x,y:V.state.y,day:V.state.day,minutes:V.state.minutes,money:V.state.money,energy:V.state.energy,inventory:V.state.inventory,history:V.state.history,relationships:V.state.relationships}))}catch(_){}return r};V.story.__v6SavePatched=true}}
function diagnostics(){X.check=()=>({ok:true,version:X.version,world:[W.w,W.h],player:!!V.state,npcs:Array.isArray(V.npcs)?V.npcs.length:0,buildings:Array.isArray(V.buildings)?V.buildings.length:0,life:!!V.life,lifeDeep:!!V.worldLifeDeep,dialogue:!!V.v6Dialogue,history:Array.isArray(V.historySpots)?V.historySpots.length:0});X.ready=true}
patchUpdate();interaction();saveBridge();diagnostics();
})();
