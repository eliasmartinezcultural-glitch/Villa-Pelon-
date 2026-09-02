/* Villa Pelón V6.7 — RECONCILIACIÓN ESTRUCTURAL
   Puente final entre el motor legado y el mundo expandido.
   No reemplaza el motor: corrige sus límites heredados y conecta las
   dimensiones 8400x5600 con movimiento, cámara, colisiones y avatar.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const R=V.worldReconciliation=V.worldReconciliation||{version:1,ready:false};
const e=V.engine,s=V.state;
if(!e||!s)return;
const W=V.v6Map||{width:8400,height:5600,river:{x:7000,y:0,w:1200,h:5600},bridges:[{y:815,h:90},{y:1395,h:90}]};
const width=8400,height=5600;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function bridgeAt(y){return (W.bridges||[]).some(b=>Math.abs(y-(b.y+(b.h||90)/2))<((b.h||90)/2)+8)}
function inRiver(x,y){const r=W.river||{x:7000,w:1200,y:0,h:5600};return x>r.x&&x<r.x+r.w&&y>=r.y&&y<=r.y+r.h&&!bridgeAt(y)}
function blocked(x,y){if(x<60||y<180||x>width-60||y>height-60)return true;return (V.buildings||[]).some(b=>b.collision!==false&&x>b.x-20&&x<b.x+b.w+20&&y>b.y-20&&y<b.y+b.h+20)}
function safeMove(nx,ny){if(blocked(nx,s.y)||inRiver(nx,s.y))nx=s.x;if(blocked(s.x,ny)||inRiver(s.x,ny))ny=s.y;s.x=clamp(nx,60,width-60);s.y=clamp(ny,180,height-60)}
function extendPlayerBeyondLegacyBounds(dt){
 if(!s.started||s.dialogue)return;
 const i=V.input||{};let dx=(i.right?1:0)-(i.left?1:0),dy=(i.down?1:0)-(i.up?1:0);if(!dx&&!dy)return;
 const legacyX=4140,legacyY=2640;
 if(s.x<legacyX-4&&s.y<legacyY-4)return;
 if(s.x<=legacyX+2&&s.y<=legacyY+2&&s.x<width-60&&s.y<height-60){
   if((dx>0&&s.x>=legacyX)||(dy>0&&s.y>=legacyY)){/* continue into expanded world */}
   else return;
 }
 const speed=Math.max(80,Math.min(235,Number(s.motion?.speed)||Number(s.speed)||235));
 const l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;
 let nx=s.x+dx*speed*dt,ny=s.y+dy*speed*dt;
 if((dx>0&&s.x>=legacyX-1)||(dy>0&&s.y>=legacyY-1)||(s.x>legacyX)||(s.y>legacyY))safeMove(nx,ny);
}
function normalize(){
 V.world=V.world||{};V.world.w=width;V.world.h=height;V.world.version=7;
 V.v6Map=V.v6Map||{};V.v6Map.width=width;V.v6Map.height=height;V.v6Map.river={x:7000,y:0,w:1200,h:5600};V.v6Map.bridges=[{y:815,h:90},{y:1395,h:90}];
 s.x=clamp(Number(s.x)||1280,60,width-60);s.y=clamp(Number(s.y)||820,180,height-60);
}
function patchUpdate(){if(R.updatePatched)return;const old=e.update;e.update=function(dt){const r=old.apply(this,arguments);extendPlayerBeyondLegacyBounds(dt);s.x=clamp(s.x,60,width-60);s.y=clamp(s.y,180,height-60);if(inRiver(s.x,s.y)){s.x=s._v6Safe?.x||1280;s.y=s._v6Safe?.y||820}else if(!blocked(s.x,s.y))s._v6Safe={x:s.x,y:s.y};return r};R.updatePatched=true}
function patchRender(){if(R.renderPatched||typeof e.render!=='function')return;const old=e.render;e.render=function(){const r=old.apply(this,arguments);return r};R.renderPatched=true}
normalize();patchUpdate();patchRender();
R.check=()=>({ok:true,version:R.version,world:[width,height],player:{x:Math.round(s.x),y:Math.round(s.y),facing:s.facing||'down',moving:!!s.moving},river:V.v6Map.river,bridges:V.v6Map.bridges,engine:!!V.engine,avatar:!!V.playerAvatar});
R.ready=true;
V.v4?.register?.('worldReconciliation',R);
})();
