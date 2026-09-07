/* Villa Pelón V65 — reparación del movimiento del jugador.
   No crea un segundo game loop.
   Usa el update de LIFE ya existente como punto de integración para mantener
   un único ciclo principal. Si el motor principal ya movió al jugador, no duplica.
   Si no lo movió pese a existir una entrada activa, este módulo realiza el movimiento.
*/
(()=>{
  'use strict';
  const V=window.VillaPelon||(window.VillaPelon={});
  const state=V.gameState;
  const life=V.life;
  if(!state||!life)return;

  const held={up:false,down:false,left:false,right:false};
  const aliases={arrowup:'up',w:'up',arrowdown:'down',s:'down',arrowleft:'left',a:'left',arrowright:'right',d:'right'};

  function setHeld(key,value){
    const k=aliases[String(key||'').toLowerCase()];
    if(k)held[k]=value;
  }
  addEventListener('keydown',e=>setHeld(e.key,true),{passive:true});
  addEventListener('keyup',e=>setHeld(e.key,false),{passive:true});
  addEventListener('blur',()=>Object.keys(held).forEach(k=>held[k]=false),{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)Object.keys(held).forEach(k=>held[k]=false)},{passive:true});

  function blocked(x,y){
    const g=V.worldGeometry||{};
    const world=V.world||{w:3200,h:2000};
    if(x<55||y<135||x>world.w-55||y>world.h-55)return true;
    const buildings=g.buildings||[];
    return buildings.some(b=>x>b.x-18&&x<b.x+b.w+18&&y>b.y-18&&y<b.y+b.h+18);
  }

  const original=life.update;
  life.update=function(dt,minutes){
    const beforeX=state.x,beforeY=state.y;
    const result=original.call(life,dt,minutes);

    if(!state.started||state.dialogue)return result;
    const dx0=(held.right?1:0)-(held.left?1:0);
    const dy0=(held.down?1:0)-(held.up?1:0);
    if(!dx0&&!dy0)return result;

    // Si game.js ya movió al jugador este frame, no hacemos nada.
    if(Math.abs(state.x-beforeX)>0.0001||Math.abs(state.y-beforeY)>0.0001)return result;

    let dx=dx0,dy=dy0;
    const len=Math.hypot(dx,dy)||1;
    dx/=len;dy/=len;
    const speed=state.energy<=0?105:205;
    const nx=state.x+dx*speed*dt;
    const ny=state.y+dy*speed*dt;

    if(Math.abs(dx)>Math.abs(dy))state.facing=dx<0?'left':'right';
    else state.facing=dy<0?'up':'down';

    if(!blocked(nx,state.y))state.x=nx;
    if(!blocked(state.x,ny))state.y=ny;
    state.energy=Math.max(0,state.energy-dt*.62);
    state.walk+=dt*11;
    return result;
  };

  // El inicio debe quedar activo después de load(), incluso si existe un guardado antiguo.
  const start=document.getElementById('startBtn');
  if(start)start.addEventListener('click',()=>{
    state.started=true;
    state.dialogue=false;
  },{capture:true});

  V.playerMovement={version:'65.0.0',mode:'single-loop-fallback',authority:'game.js+movement-bridge',input:held};
})();
