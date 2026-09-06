/* Villa Pelón V89 — runtime de jugador y recuperación de spawn.
   Corrección crítica: el spawn V66 estaba dentro de una vivienda y la colisión impedía salir.
   Este runtime sanea la posición después de cargar partida, usa navegación territorial y
   distingue movimiento real de simple cambio de orientación.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),S=V.gameState;
if(!S)return;
const canvas=document.getElementById('world'),game=document.getElementById('game');
const keys={up:false,down:false,left:false,right:false};
const keyMap={arrowup:'up',w:'up',arrowdown:'down',s:'down',arrowleft:'left',a:'left',arrowright:'right',d:'right'};
let last=performance.now(),overlay=null,octx=null;
const SPEED=205,PLAYER_PAD=14;
const SAFE_SPAWNS=[[1200,700],[1660,700],[1540,620],[1740,700],[960,700]];

function menuOpen(){const m=document.getElementById('vpMenu');const ux=document.getElementById('v88Menu');return (!!m&&!m.classList.contains('hidden'))||!!(ux&&ux.style.display!=='none'&&!ux.hidden)||!!S._menuPaused}
function dialogueOpen(){const d=document.getElementById('dialogue');return !!d&&!d.classList.contains('hidden')}
function clear(){Object.keys(keys).forEach(k=>keys[k]=false);document.querySelectorAll('[data-key]').forEach(b=>b.classList.remove('pressed'))}
function canonicalBlocked(x,y){
  const nav=V.navigation74;
  if(nav&&typeof nav.blocked==='function')return !!nav.blocked(x,y,PLAYER_PAD);
  const W=V.world||{w:3200,h:2000};
  if(x<55||y<135||x>W.w-55||y>W.h-55)return true;
  return (V.worldGeometry?.buildings||[]).some(b=>x>b.x-PLAYER_PAD&&x<b.x+b.w+PLAYER_PAD&&y>b.y-PLAYER_PAD&&y<b.y+b.h+PLAYER_PAD);
}
function findSafeSpawn(){
  for(const p of SAFE_SPAWNS)if(!canonicalBlocked(p[0],p[1]))return p;
  const W=V.world||{w:3200,h:2000};
  for(let y=180;y<W.h-180;y+=80)for(let x=100;x<W.w-100;x+=80)if(!canonicalBlocked(x,y))return [x,y];
  return [1200,700];
}
function repairPosition(){
  if(!Number.isFinite(Number(S.x))||!Number.isFinite(Number(S.y))||canonicalBlocked(Number(S.x),Number(S.y))){
    const p=findSafeSpawn();S.x=p[0];S.y=p[1];S.facing='down';S.walk=0;
    S._spawnRecovered=true;
    window.dispatchEvent(new CustomEvent('villa-pelon-spawn-recovered',{detail:{x:S.x,y:S.y}}));
    return true;
  }
  return false;
}
function keydown(e){
  const k=String(e.key||'').toLowerCase(),dir=keyMap[k];if(!dir)return;
  e.preventDefault();e.stopImmediatePropagation();keys[dir]=true;
}
function keyup(e){
  const k=String(e.key||'').toLowerCase(),dir=keyMap[k];if(!dir)return;
  e.preventDefault();e.stopImmediatePropagation();keys[dir]=false;
}
function bindButton(b){
  if(b.dataset.v89Input)return;b.dataset.v89Input='1';const dir=b.dataset.key;
  const down=e=>{e.preventDefault();e.stopImmediatePropagation();keys[dir]=true;try{b.setPointerCapture(e.pointerId)}catch(_){};b.classList.add('pressed')};
  const up=e=>{e.preventDefault();e.stopImmediatePropagation();keys[dir]=false;b.classList.remove('pressed')};
  b.addEventListener('pointerdown',down,{capture:true,passive:false});
  ['pointerup','pointercancel','pointerleave','lostpointercapture'].forEach(t=>b.addEventListener(t,up,{capture:true,passive:false}));
}
function bind(){
  window.addEventListener('keydown',keydown,{capture:true,passive:false});window.addEventListener('keyup',keyup,{capture:true,passive:false});
  window.addEventListener('blur',clear,{capture:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)clear()},{capture:true});
  document.querySelectorAll('[data-key]').forEach(bindButton);
  const ib=document.getElementById('interact');if(ib&&!ib.dataset.v89Interact){ib.dataset.v89Interact='1';ib.addEventListener('pointerdown',e=>{e.preventDefault();e.stopImmediatePropagation();if(!menuOpen())V.interact?.()},{capture:true,passive:false})}
}
function ensureOverlay(){
  if(!canvas||!game)return;
  if(!overlay){overlay=document.createElement('canvas');overlay.id='vpPlayerOverlay';overlay.setAttribute('aria-hidden','true');Object.assign(overlay.style,{position:'absolute',left:'0',top:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'12',imageRendering:'pixelated'});if(!game.style.position)game.style.position='relative';game.appendChild(overlay);octx=overlay.getContext('2d')}
  const d=Math.min(devicePixelRatio||1,2),w=canvas.clientWidth||innerWidth,h=canvas.clientHeight||innerHeight;
  if(overlay.width!==Math.floor(w*d)||overlay.height!==Math.floor(h*d)){overlay.width=Math.max(1,Math.floor(w*d));overlay.height=Math.max(1,Math.floor(h*d));octx.setTransform(d,0,0,d,0,0)}
}
function px(x,y,w,h,c){octx.fillStyle=c;octx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function drawPlayer(){
  ensureOverlay();if(!octx)return;const w=overlay.clientWidth||innerWidth,h=overlay.clientHeight||innerHeight;octx.clearRect(0,0,w,h);
  if(!S.started||menuOpen()||dialogueOpen())return;
  /* El motor principal ya dibuja al jugador en coordenadas del mundo. Este overlay queda
     deliberadamente invisible para evitar dos jugadores superpuestos. */
}
function move(dt){
  if(!S.started||menuOpen()||dialogueOpen()){clear();S.moving=false;return}
  repairPosition();
  let dx=(keys.right?1:0)-(keys.left?1:0),dy=(keys.down?1:0)-(keys.up?1:0),moving=!!(dx||dy);
  if(!moving){S.walk=0;S.moving=false;window.dispatchEvent(new CustomEvent('villa-pelon-player-state',{detail:{x:S.x,y:S.y,facing:S.facing,moving:false}}));return}
  const l=Math.hypot(dx,dy);dx/=l;dy/=l;
  const speed=Number.isFinite(S.speed)&&S.speed>0?Math.min(S.speed,SPEED):SPEED;
  const step=speed*dt;
  const ox=S.x,oy=S.y;
  const nx=ox+dx*step,ny=oy+dy*step;
  if(!canonicalBlocked(nx,oy))S.x=nx;
  if(!canonicalBlocked(S.x,ny))S.y=ny;
  const moved=Math.hypot(S.x-ox,S.y-oy)>0.001;
  if(moved){if(Math.abs(S.x-ox)>=Math.abs(S.y-oy))S.facing=(S.x<ox?'left':'right');else S.facing=(S.y<oy?'up':'down');S.walk+=dt*11;S.moving=true;S.energy=Math.max(0,Number(S.energy||0)-dt*.62);S.minutes+=dt*3.5}
  else {S.walk=0;S.moving=false;/* No gira el personaje si está contra un obstáculo. */}
  while(S.minutes>=1440){S.minutes-=1440;S.day=(Number(S.day)||1)+1;S.energy=100;if(V.life?.nextWeather)V.life.nextWeather()}
  window.dispatchEvent(new CustomEvent('villa-pelon-player-state',{detail:{x:S.x,y:S.y,facing:S.facing,moving:moved}}));
}
function audit(){
  repairPosition();
  if(!Number.isFinite(Number(S.energy)))S.energy=100;S.energy=Math.max(0,Math.min(100,Number(S.energy)));
  if(!Number.isFinite(Number(S.minutes)))S.minutes=480;S.minutes=Math.max(0,Number(S.minutes)%1440);
  if(!Number.isFinite(Number(S.day))||Number(S.day)<1)S.day=1;
  if(!Array.isArray(S.inventory))S.inventory=[];
  if(!['up','down','left','right'].includes(S.facing))S.facing='down';
  if(!Number.isFinite(Number(S.money)))S.money=10000;
}
function loop(now){const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;move(dt);drawPlayer();requestAnimationFrame(loop)}
function boot(){bind();ensureOverlay();audit();clear();requestAnimationFrame(loop);V.playerRuntime86={version:'89.0.0',keys,S,clear,move,audit,canonicalBlocked,repairPosition,findSafeSpawn}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
