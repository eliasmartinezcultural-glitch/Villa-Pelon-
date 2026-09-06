/* Villa Pelón V87 — runtime de jugador endurecido.
   Autoridad única de movimiento/render del jugador; usa navegación territorial canónica,
   entrada táctil con captura de puntero, reparación de estado y sincronización de cámara.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),S=V.gameState;
if(!S)return;
const canvas=document.getElementById('world'),game=document.getElementById('game');
const keys={up:false,down:false,left:false,right:false};
const keyMap={arrowup:'up',w:'up',arrowdown:'down',s:'down',arrowleft:'left',a:'left',arrowright:'right',d:'right'};
const MOVE_CODES={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'};
let last=performance.now(),overlay=null,octx=null;
const SPEED=205,PLAYER_PAD=18;

function menuOpen(){const m=document.getElementById('vpMenu');return !!m&&!m.classList.contains('hidden')}
function dialogueOpen(){const d=document.getElementById('dialogue');return !!d&&!d.classList.contains('hidden')}
function clear(){Object.keys(keys).forEach(k=>keys[k]=false);document.querySelectorAll('[data-key]').forEach(b=>b.classList.remove('pressed'))}
function canonicalBlocked(x,y){
  const nav=V.navigation74;
  if(nav&&typeof nav.blocked==='function')return !!nav.blocked(x,y,PLAYER_PAD);
  const W=V.world||{w:3200,h:2000};
  if(x<55||y<135||x>W.w-55||y>W.h-55)return true;
  return (V.worldGeometry?.buildings||[]).some(b=>x>b.x-PLAYER_PAD&&x<b.x+b.w+PLAYER_PAD&&y>b.y-PLAYER_PAD&&y<b.y+b.h+PLAYER_PAD);
}
function repairPosition(){
  if(!Number.isFinite(S.x)||!Number.isFinite(S.y)){S.x=960;S.y=650;return}
  if(!canonicalBlocked(S.x,S.y))return;
  const candidates=[[960,650],[1660,700],[1200,700],[1750,800],[2200,820]];
  const safe=candidates.find(p=>!canonicalBlocked(p[0],p[1]));
  if(safe){S.x=safe[0];S.y=safe[1]}
}
function keydown(e){
  const k=String(e.key||'').toLowerCase(),dir=keyMap[k];
  if(!dir)return;
  e.preventDefault();e.stopImmediatePropagation();
  keys[dir]=true;S.facing=dir;
}
function keyup(e){
  const k=String(e.key||'').toLowerCase(),dir=keyMap[k];
  if(!dir)return;
  e.preventDefault();e.stopImmediatePropagation();keys[dir]=false;
}
function bindButton(b){
  if(b.dataset.v87Input)return;b.dataset.v87Input='1';
  const dir=b.dataset.key;
  const down=e=>{e.preventDefault();e.stopImmediatePropagation();keys[dir]=true;S.facing=dir;b.classList.add('pressed');try{b.setPointerCapture(e.pointerId)}catch(_){} };
  const up=e=>{e.preventDefault();e.stopImmediatePropagation();keys[dir]=false;b.classList.remove('pressed')};
  b.addEventListener('pointerdown',down,{capture:true,passive:false});
  ['pointerup','pointercancel','pointerleave','lostpointercapture'].forEach(t=>b.addEventListener(t,up,{capture:true,passive:false}));
}
function bind(){
  window.addEventListener('keydown',keydown,{capture:true,passive:false});
  window.addEventListener('keyup',keyup,{capture:true,passive:false});
  window.addEventListener('blur',clear,{capture:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clear()},{capture:true});
  document.querySelectorAll('[data-key]').forEach(bindButton);
  const ib=document.getElementById('interact');
  if(ib&&!ib.dataset.v87Interact){ib.dataset.v87Interact='1';ib.addEventListener('pointerdown',e=>{e.preventDefault();e.stopImmediatePropagation();V.interact?.()},{capture:true,passive:false})}
}
function ensureOverlay(){
  if(!canvas||!game)return;
  if(!overlay){
    overlay=document.createElement('canvas');overlay.id='vpPlayerOverlay';overlay.setAttribute('aria-hidden','true');
    Object.assign(overlay.style,{position:'absolute',left:'0',top:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'12',imageRendering:'pixelated'});
    if(!game.style.position)game.style.position='relative';
    game.appendChild(overlay);octx=overlay.getContext('2d');
  }
  const d=Math.min(devicePixelRatio||1,2),w=canvas.clientWidth||innerWidth,h=canvas.clientHeight||innerHeight;
  if(overlay.width!==Math.floor(w*d)||overlay.height!==Math.floor(h*d)){overlay.width=Math.max(1,Math.floor(w*d));overlay.height=Math.max(1,Math.floor(h*d));octx.setTransform(d,0,0,d,0,0);}
}
function px(x,y,w,h,c){octx.fillStyle=c;octx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function drawPlayer(){
  ensureOverlay();if(!octx)return;
  const w=overlay.clientWidth||innerWidth,h=overlay.clientHeight||innerHeight;octx.clearRect(0,0,w,h);
  if(!S.started||menuOpen()||dialogueOpen())return;
  const x=w/2,y=h/2+4,dir=S.facing||'down',moving=Object.values(keys).some(Boolean),walk=S.walk||0;
  octx.fillStyle='rgba(20,28,22,.30)';octx.beginPath();octx.ellipse(x,y+31,18,5,0,0,Math.PI*2);octx.fill();
  const frame=moving?Math.floor(walk*1.7)%4:0,swing=frame===1?2:frame===3?-2:0;
  px(x-10,y+8+swing,8,18,'#304b67');px(x+2,y+8-swing,8,18,'#304b67');px(x-11,y+25+swing,10,5,'#352c29');px(x+1,y+25-swing,10,5,'#352c29');
  px(x-15,y-8,30,19,'#20251f');px(x-11,y-6,22,16,'#2f5d46');px(x-17,y-5,5,15,'#244735');px(x+12,y-5,5,15,'#244735');px(x-5,y-13,10,6,'#d9a27c');
  px(x-12,y-29,24,20,'#20251f');px(x-9,y-27,18,17,'#d9a27c');px(x-10,y-28,20,5,'#332923');px(x-8,y-25,16,4,'#332923');
  if(dir==='left'){px(x-11,y-23,5,8,'#332923');px(x-7,y-18,3,3,'#171b19')}else if(dir==='right'){px(x+6,y-23,5,8,'#332923');px(x+4,y-18,3,3,'#171b19')}else{px(x-7,y-18,3,3,'#171b19');px(x+4,y-18,3,3,'#171b19')}
}
function move(dt){
  if(!S.started||menuOpen()||dialogueOpen()){clear();return}
  repairPosition();
  let dx=(keys.right?1:0)-(keys.left?1:0),dy=(keys.down?1:0)-(keys.up?1:0),moving=!!(dx||dy);
  if(!moving){S.walk=0;window.dispatchEvent(new CustomEvent('villa-pelon-player-state',{detail:{x:S.x,y:S.y,facing:S.facing,moving:false}}));return}
  const l=Math.hypot(dx,dy);dx/=l;dy/=l;
  if(Math.abs(dx)>Math.abs(dy))S.facing=dx<0?'left':'right';else S.facing=dy<0?'up':'down';
  const speed=Number.isFinite(S.speed)&&S.speed>0?Math.min(S.speed,SPEED):SPEED;
  const nx=S.x+dx*speed*dt,ny=S.y+dy*speed*dt;
  if(!canonicalBlocked(nx,S.y))S.x=nx;
  if(!canonicalBlocked(S.x,ny))S.y=ny;
  S.energy=Math.max(0,S.energy-dt*.62);S.walk+=dt*11;S.minutes+=dt*3.5;
  while(S.minutes>=1440){S.minutes-=1440;S.day=(Number(S.day)||1)+1;S.energy=100;if(V.life?.nextWeather)V.life.nextWeather()}
  window.dispatchEvent(new CustomEvent('villa-pelon-player-state',{detail:{x:S.x,y:S.y,facing:S.facing,moving:true}}));
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
function boot(){bind();ensureOverlay();audit();clear();requestAnimationFrame(loop);V.playerRuntime86={version:'87.0.0',keys,S,clear,move,drawPlayer,audit,canonicalBlocked}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();