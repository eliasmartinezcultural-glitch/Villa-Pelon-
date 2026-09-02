/* Villa Pelón V6.8.4 — AVATAR PRINCIPAL + CONTEXTO DE INTERACCIÓN
   Adaptador del personaje jugador al render único ya existente.
   Reutiliza V4 Characters y el estado/nearest existente: no crea loop, RAF,
   movimiento ni un segundo sistema de interacción.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const A=V.playerAvatar=V.playerAvatar||{version:4,ready:false,patched:false};
const canvas=document.getElementById('world');
if(!canvas)return;
const ctx=canvas.getContext('2d');
function playerModel(){const s=V.state||{},a=s.playerAppearance||{};return{id:'player',player:true,name:'TÚ',x:Number(s.x)||1280,y:Number(s.y)||820,height:1.08,build:.56,age:28,skin:a.skin||'#c98d6d',hair:a.hairColor||'#2b211e',hairStyle:a.hairStyle||'short',shirt:'#315d9d',pants:'#454c53',shoes:'#252322',role:'player',clothing:'shirt',moving:!!s.moving,facing:s.facing||'down',appearanceSeed:999}}
function screenPosition(){const s=V.state||{},c=V.camera||{x:0,y:0,zoom:1},z=Math.max(.01,Number(c.zoom)||.82),d=Math.min(devicePixelRatio||1,2),vw=canvas.clientWidth||innerWidth,vh=canvas.clientHeight||innerHeight;return{x:vw/2+((Number(s.x)||0)-(Number(c.x)||0))*z,y:vh/2+((Number(s.y)||0)-(Number(c.y)||0))*z,scale:z,d}}
function interactionTarget(){const s=V.state||{};if(!s.started||s.dialogue)return null;if(typeof V.worldInteractionAPI?.nearest==='function')return V.worldInteractionAPI.nearest();if(typeof V.engine?.nearest==='function')return V.engine.nearest();return null}
function targetLabel(o){if(!o)return'';return String(o.name||o.label||o.title||({shop:'ALMACÉN',radio:'RADIO',school:'ESCUELA',rural:'ZONA RURAL',home:'CASA'}[o.type]||'INTERACTUAR'))}
function drawInteractionPrompt(){const o=interactionTarget();if(!o)return;const w=canvas.clientWidth||innerWidth,h=canvas.clientHeight||innerHeight,text='E  ·  '+targetLabel(o);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=false;ctx.font='700 12px system-ui';const tw=ctx.measureText(text).width+24,x=w/2-tw/2,y=Math.max(78,h-118),ph=28,r=7;ctx.fillStyle='rgba(25,20,15,.92)';ctx.strokeStyle='rgba(205,170,95,.95)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+tw,y,x+tw,y+ph,r);ctx.arcTo(x+tw,y+ph,x,y+ph,r);ctx.arcTo(x,y+ph,x,y,r);ctx.arcTo(x,y,x+tw,y,r);ctx.fill();ctx.stroke();ctx.fillStyle='#f0d78f';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,w/2,y+ph/2);ctx.restore()}
function drawPlayerOverlay(){try{if(!V.v4Characters||typeof V.v4Characters.draw!=='function'){A.lastError='V4 Characters no disponible';return}const p=screenPosition(),m=playerModel();ctx.save();ctx.setTransform(p.d,0,0,p.d,0,0);ctx.imageSmoothingEnabled=false;ctx.save();ctx.translate(p.x,p.y);const scale=Math.max(.8,Math.min(1.35,p.scale));ctx.scale(scale,scale);m.x=0;m.y=0;V.v4Characters.draw(ctx,m);ctx.restore();ctx.restore();drawInteractionPrompt();A.ready=true;A.lastError=null}catch(err){A.lastError=String(err&&err.message||err)}}
function patchOverlay(){const life=V.life||(V.life={});if(A.patched)return true;const original=typeof life.drawOverlay==='function'?life.drawOverlay:null;life.drawOverlay=function(c,w,h){if(original)original.apply(this,arguments);drawPlayerOverlay()};A.patched=true;A.hook='V.life.drawOverlay';return true}
A.version=5;A.style='16bit-rural-protagonist';A.features=['full-body-avatar','four-direction-reading','walk-cycle','idle-breathing','shadow','clothing-detail','reuse-v4-character-renderer','single-engine-render','mobile-ready','contextual-interaction-prompt'];patchOverlay();V.v4?.register?.('playerAvatar',A);
})();
