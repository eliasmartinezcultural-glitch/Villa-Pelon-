/* Villa Pelón V6.8 — AVATAR PRINCIPAL
   Render integrado al ÚNICO motor de juego.
   No crea game loop, RAF ni sistema de movimiento paralelo.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const A=V.playerAvatar=V.playerAvatar||{version:3,ready:false,patched:false};
const canvas=document.getElementById('world');
if(!canvas)return;
const ctx=canvas.getContext('2d');
const state=()=>V.state||{};
const input=()=>V.input||{};
const camera=()=>V.camera||{x:0,y:0,zoom:1};
const P={skin:'#c98d6d',skinLight:'#dfa582',hair:'#2b211e',hairLight:'#4b352b',shirt:'#315d9d',shirtLight:'#5687c4',shirtDark:'#213f69',pants:'#454c53',pantsDark:'#2d3338',shoes:'#252322',sole:'#151515',outline:'#211b19',accent:'#d7b36a',eye:'#171515'};
const px=n=>Math.round(Number(n)||0);
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(px(x),px(y),Math.max(1,px(w)),Math.max(1,px(h)))}
function limb(x1,y1,x2,y2,w,c){ctx.strokeStyle=P.outline;ctx.lineWidth=w+2;ctx.lineCap='square';ctx.beginPath();ctx.moveTo(px(x1),px(y1));ctx.lineTo(px(x2),px(y2));ctx.stroke();ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(px(x1),px(y1));ctx.lineTo(px(x2),px(y2));ctx.stroke()}
function init(){const s=state();s.playerAppearance=s.playerAppearance||{hair:'short',shirt:'azul',expression:'neutral',accessory:'none'};s.motion=s.motion||{};return s}
function facing(m){const i=input();if(i.right)return'right';if(i.left)return'left';if(i.up)return'up';if(i.down)return'down';return m.facing||'down'}
function drawAvatar(sx,sy,scale){const s=init(),m=s.motion||{},dir=facing(m),moving=!!s.moving,t=performance.now()/1000;const walk=moving?Math.sin(t*8):0,bob=moving?Math.abs(walk)*1.2:Math.sin(t*2)*.35,swing=moving?walk:0,S=Math.max(.8,Math.min(1.45,Number(scale)||1)),flip=dir==='left'?-1:1;ctx.save();ctx.translate(px(sx),px(sy-bob*S));ctx.scale(flip*S,S);
/* sombra */ctx.fillStyle='rgba(20,15,12,.42)';ctx.beginPath();ctx.ellipse(0,37,18,6,0,0,Math.PI*2);ctx.fill();
const a=swing*3,b=-swing*3;
/* piernas y zapatos */
limb(-5+a,4,-7+a,18,5,P.pantsDark);limb(-7+a,18,-9+a,30,5,P.pants);limb(5+b,4,7+b,18,5,P.pantsDark);limb(7+b,18,9+b,30,5,P.pants);rect(-13+a,29,10,5,P.shoes);rect(3+b,29,10,5,P.shoes);rect(-13+a,34,11,2,P.sole);rect(2+b,34,11,2,P.sole);
/* cintura y torso */rect(-10,0,20,8,P.pantsDark);rect(-12,-20,24,22,P.shirt);rect(-9,-22,18,4,P.shirtLight);rect(-12,-7,24,5,P.shirtDark);rect(-2,-19,4,18,P.shirtLight);
/* brazos y manos */limb(-10,-15,-15+swing*3,3,5,P.shirt);limb(10,-15,15-swing*3,3,5,P.shirt);rect(-18+swing*3,2,6,6,P.skinLight);rect(12-swing*3,2,6,6,P.skinLight);
/* cuello y cabeza */rect(-4,-25,8,6,P.skin);ctx.fillStyle=P.skin;ctx.strokeStyle=P.outline;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,-34,12,11,0,0,Math.PI*2);ctx.fill();ctx.stroke();rect(-15,-39,3,8,P.skin);rect(12,-39,3,8,P.skin);
/* cabello */ctx.fillStyle=P.hair;ctx.beginPath();ctx.moveTo(-13,-36);ctx.lineTo(-12,-46);ctx.lineTo(-7,-51);ctx.lineTo(6,-51);ctx.lineTo(12,-46);ctx.lineTo(13,-34);ctx.lineTo(8,-38);ctx.lineTo(4,-44);ctx.lineTo(-1,-40);ctx.lineTo(-7,-43);ctx.closePath();ctx.fill();rect(-7,-49,12,3,P.hairLight);rect(-13,-41,4,6,P.hair);
/* rostro legible */
if(dir==='left'||dir==='right'){const ex=dir==='left'?-7:4;rect(ex,-36,3,3,P.eye)}else{rect(-6,-36,4,3,'#f8efe0');rect(3,-36,4,3,'#f8efe0');rect(-5,-36,2,2,P.eye);rect(4,-36,2,2,P.eye);rect(-1,-31,3,2,'#a76553')}
/* detalles de ropa */rect(-5,-20,10,3,P.shirtDark);rect(6,-7,4,6,P.accent);rect(-8,-1,7,2,P.shirtLight);if((s.playerAppearance||{}).accessory==='cap'){rect(-11,-47,22,4,P.hair);rect(-14,-44,27,3,P.hair)}
ctx.restore()}
function screenPosition(){const s=state(),c=camera(),z=Math.max(.01,Number(c.zoom)||.82),d=Math.min(devicePixelRatio||1,2),vw=canvas.clientWidth||innerWidth,vh=canvas.clientHeight||innerHeight;return{x:vw/2+(Number(s.x)||0-(Number(c.x)||0))*z,y:vh/2+(Number(s.y)||0-(Number(c.y)||0))*z,scale:Math.max(.8,Math.min(1.45,z*1.12)),d}}
function drawPost(){try{const p=screenPosition(),d=p.d;ctx.save();ctx.setTransform(d,0,0,d,0,0);ctx.imageSmoothingEnabled=false;drawAvatar(p.x,p.y,p.scale);ctx.restore()}catch(err){A.lastError=String(err&&err.message||err)}}
function patchRender(){const e=V.engine;if(A.patched||!e||typeof e.render!=='function')return !!A.patched;const original=e.render;e.render=function(){const result=original.apply(e,arguments);drawPost();return result};A.patched=true;A.ready=true;A.hook='V.engine.render';return true}
function retryPatch(tries){if(patchRender()||tries<=0)return;setTimeout(()=>retryPatch(tries-1),100)}
A.style='16bit-rural-protagonist';A.features=['full-body-avatar','four-direction-reading','walk-cycle','idle-breathing','shadow','clothing-detail','accessory-ready','single-engine-render','mobile-ready'];A.palette=P;
patchRender();retryPatch(20);V.v4?.register?.('playerAvatar',A);
})();
