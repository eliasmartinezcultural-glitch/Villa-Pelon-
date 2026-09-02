/* Villa Pelón V6.8 — AVATAR PRINCIPAL
   Adaptador del personaje jugador al render único ya existente.
   Reutiliza V4 Characters: no crea game loop, RAF, update ni segundo renderer.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const A=V.playerAvatar=V.playerAvatar||{version:4,ready:false,patched:false};
const canvas=document.getElementById('world');
if(!canvas)return;
const ctx=canvas.getContext('2d');

function playerModel(){
  const s=V.state||{};
  const appearance=s.playerAppearance||{};
  return {
    id:'player',player:true,name:'TÚ',
    x:Number(s.x)||1280,y:Number(s.y)||820,
    height:1.08,build:.56,age:28,
    skin:appearance.skin||'#c98d6d',
    hair:appearance.hairColor||'#2b211e',
    hairStyle:appearance.hairStyle||'short',
    shirt:'#315d9d',pants:'#454c53',shoes:'#252322',
    role:'player',clothing:'shirt',
    moving:!!s.moving,facing:s.facing||'down',
    appearanceSeed:999
  };
}

function screenPosition(){
  const s=V.state||{},c=V.camera||{x:0,y:0,zoom:1};
  const z=Math.max(.01,Number(c.zoom)||.82);
  const d=Math.min(devicePixelRatio||1,2);
  const vw=canvas.clientWidth||innerWidth,vh=canvas.clientHeight||innerHeight;
  return {
    x:vw/2+((Number(s.x)||0)-(Number(c.x)||0))*z,
    y:vh/2+((Number(s.y)||0)-(Number(c.y)||0))*z,
    scale:z
  };
}

function drawPlayerOverlay(){
  try{
    if(!V.v4Characters||typeof V.v4Characters.draw!=='function'){
      A.lastError='V4 Characters no disponible';
      return;
    }
    const p=screenPosition();
    const model=playerModel();
    const d=Math.min(devicePixelRatio||1,2);
    ctx.save();
    ctx.setTransform(d,0,0,d,0,0);
    ctx.imageSmoothingEnabled=false;
    ctx.save();
    ctx.translate(p.x,p.y);
    ctx.scale(Math.max(.8,Math.min(1.35,p.scale)),Math.max(.8,Math.min(1.35,p.scale)));
    model.x=0;model.y=0;
    V.v4Characters.draw(ctx,model);
    ctx.restore();
    ctx.restore();
    A.ready=true;
    A.lastError=null;
  }catch(err){A.lastError=String(err&&err.message||err)}
}

function patchOverlay(){
  const life=V.life||(V.life={});
  if(A.patched)return true;
  const original=typeof life.drawOverlay==='function'?life.drawOverlay:null;
  life.drawOverlay=function(c,w,h){
    if(original)original.apply(this,arguments);
    drawPlayerOverlay();
  };
  A.patched=true;
  A.hook='V.life.drawOverlay';
  return true;
}

A.style='16bit-rural-protagonist';
A.features=['full-body-avatar','four-direction-reading','walk-cycle','idle-breathing','shadow','clothing-detail','reuse-v4-character-renderer','single-engine-render','mobile-ready'];
patchOverlay();
V.v4?.register?.('playerAvatar',A);
})();
