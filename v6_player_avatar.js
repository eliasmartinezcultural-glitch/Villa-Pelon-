/* Villa Pelón V6.7 — AVATAR PRINCIPAL
   Única capa visual especializada para el personaje que controla el jugador.
   No crea otro loop ni modifica la física: lee V.state/V.input/V.camera.
   Estética: 16-bit pixel art, silueta clara, cuerpo completo, animación suave,
   orientación, respiración, pasos, sombra y lectura inmediata sobre el mundo.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const A=V.playerAvatar=V.playerAvatar||{version:1,ready:false};
const canvas=document.getElementById('world');
if(!canvas)return;
const ctx=canvas.getContext('2d');
const state=()=>V.state||{};
const input=()=>V.input||{};
const camera=()=>V.camera||{x:0,y:0,zoom:1};

const P={
 skin:'#c98d6d',skinLight:'#dfa582',hair:'#2f2521',hairLight:'#47352c',
 shirt:'#315d9d',shirtLight:'#4678b9',shirtDark:'#24436f',
 pants:'#3f464d',pantsLight:'#59636a',pantsDark:'#2d3338',
 shoes:'#252322',sole:'#171717',outline:'#241d1a',accent:'#d7b36a',
 eye:'#171515'
};
const px=(x)=>Math.round(x);
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(px(x),px(y),Math.max(1,px(w)),Math.max(1,px(h)))}
function limb(x1,y1,x2,y2,w,c){ctx.strokeStyle=P.outline;ctx.lineWidth=w+2;ctx.lineCap='square';ctx.beginPath();ctx.moveTo(px(x1),px(y1));ctx.lineTo(px(x2),px(y2));ctx.stroke();ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(px(x1),px(y1));ctx.lineTo(px(x2),px(y2));ctx.stroke()}
function init(){
 const s=state();
 s.playerAppearance=s.playerAppearance||{hair:'short',shirt:'azul',expression:'neutral',accessory:'none'};
 s.motion=s.motion||{};
 return s;
}
function facing(m){
 const i=input();
 if(i.right)return'right';if(i.left)return'left';if(i.up)return'up';if(i.down)return'down';
 return m.facing||'down';
}
function drawShadow(x,y,scale){
 ctx.fillStyle='rgba(23,18,15,.34)';
 ctx.beginPath();ctx.ellipse(px(x),px(y+28*scale),px(13*scale),px(4.5*scale),0,0,Math.PI*2);ctx.fill();
}
function drawAvatar(sx,sy,scale){
 const s=init(),m=s.motion||{},dir=facing(m),moving=!!s.moving&&m.speed>8;
 const t=performance.now()/1000;
 const walk=moving?Math.sin((m.phase||t*8)*1.0):0;
 const bob=moving?Math.abs(walk)*1.2:Math.sin(t*2.1)*.35;
 const swing=moving?walk:0;
 const flip=dir==='left'?-1:1;
 const S=scale;
 ctx.save();ctx.translate(px(sx),px(sy-bob*S));ctx.scale(flip*S,S);
 drawShadow(0,27/S,1);
 /* pies y piernas: el paso es asimétrico para que no parezca deslizarse */
 const legA=swing*3,legB=-swing*3;
 limb(-5+legA,5,-7+legA,19,5,P.pantsDark);limb(-7+legA,19,-9+legA,30,5,P.pants);
 limb(5+legB,5,7+legB,19,5,P.pantsDark);limb(7+legB,19,9+legB,30,5,P.pants);
 rect(-12+legA,29,9,4,P.shoes);rect(4+legB,29,9,4,P.shoes);
 rect(-12+legA,32,10,2,P.sole);rect(3+legB,32,10,2,P.sole);
 /* torso, cintura y camiseta */
 rect(-10,0,20,9,P.pantsDark);rect(-11,-19,22,22,P.shirt);rect(-9,-21,18,4,P.shirtLight);
 rect(-11,-5,22,5,P.shirtDark);rect(-2,-18,4,19,P.shirtLight);
 /* brazos y manos: acompañan el paso */
 limb(-9,-14,-14+swing*3,4,5,P.shirt);limb(9,-14,14-swing*3,4,5,P.shirt);
 ctx.fillStyle=P.skinLight;ctx.fillRect(px(-16+swing*3),px(3),6,5);ctx.fillRect(px(11-swing*3),px(3),6,5);
 /* cuello */ rect(-4,-24,8,6,P.skin);
 /* cabeza */
 ctx.fillStyle=P.skin;ctx.strokeStyle=P.outline;ctx.lineWidth=2;
 ctx.beginPath();ctx.roundRect(-11,-43,22,20,5);ctx.fill();ctx.stroke();
 rect(-14,-38,3,7,P.skin);rect(11,-38,3,7,P.skin);
 /* cabello con silueta reconocible */
 ctx.fillStyle=P.hair;ctx.beginPath();ctx.moveTo(-12,-36);ctx.lineTo(-11,-45);ctx.lineTo(-7,-50);ctx.lineTo(5,-50);ctx.lineTo(11,-45);ctx.lineTo(12,-35);ctx.lineTo(7,-38);ctx.lineTo(3,-43);ctx.lineTo(-2,-39);ctx.lineTo(-7,-42);ctx.lineTo(-12,-36);ctx.closePath();ctx.fill();
 rect(-7,-48,10,3,P.hairLight);rect(-12,-40,4,5,P.hair);
 /* rostro orientado: perfil simple cuando camina lateralmente */
 if(dir==='left'||dir==='right'){
   const eyeX=dir==='left'?-6:3;rect(eyeX,-35,3,3,P.eye);rect(dir==='left'?-9:7,-30,3,2,'#9b5f4e');
 }else{
   rect(-6,-35,4,3,'#f8efe0');rect(3,-35,4,3,'#f8efe0');rect(-5,-35,2,2,P.eye);rect(4,-35,2,2,P.eye);
   rect(-1,-30,3,2,'#a76553');
   if((s.playerAppearance||{}).expression==='happy'){ctx.strokeStyle='#7b3d3c';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-4,-27);ctx.lineTo(0,-25);ctx.lineTo(4,-27);ctx.stroke()}
 }
 /* detalle de ropa: cuello, bolsillo y costura */
 rect(-5,-19,10,3,P.shirtDark);rect(6,-7,4,6,P.accent);rect(-8,-1,7,2,P.shirtLight);
 /* pequeño indicador de control, discreto y estable */
 if(!moving){ctx.globalAlpha=.72;rect(-2,37,4,2,P.accent)}
 ctx.restore();
}
function screenPosition(){
 const s=state(),c=camera(),z=Number(c.zoom)||.82;
 const d=Math.min(devicePixelRatio||1,2);
 const vw=canvas.clientWidth||innerWidth,vh=canvas.clientHeight||innerHeight;
 return {x:vw/2+(s.x-c.x)*z,y:vh/2+(s.y-c.y)*z,scale:Math.max(.72,Math.min(1.15,z*.92)) ,d};
}
function patchRender(){
 if(!V.engine||A.patched)return false;
 const original=V.engine.render;
 if(typeof original!=='function')return false;
 V.engine.render=function(){
   const r=original.apply(V.engine,arguments);
   const p=screenPosition();
   const d=p.d;
   ctx.save();ctx.setTransform(d,0,0,d,0,0);ctx.imageSmoothingEnabled=false;
   drawAvatar(p.x,p.y,p.scale);ctx.restore();
   return r;
 };
 A.patched=true;A.ready=true;return true;
}
function fallback(){
 if(A.patched||!V.engine)return;
 if(typeof V.engine.render==='function')patchRender();
}
fallback();
A.style='16bit-rural-protagonist';
A.features=['full-body-avatar','walk-cycle','acceleration-compatible','direction-facing','idle-breathing','pixel-silhouette','shadow','mobile-ready','no-extra-loop'];
A.palette=P;
V.v4?.register?.('playerAvatar',A);
})();
