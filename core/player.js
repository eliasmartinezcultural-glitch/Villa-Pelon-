/* Villa Pelón CORE PLAYER v1 — autoridad única de movimiento, colisión y estado. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.gameState;if(!S)return;
const CORE={version:'1.0.0',speed:205,radius:14};
const directions={up:['up','w','arrowup'],down:['down','s','arrowdown'],left:['left','a','arrowleft'],right:['right','d','arrowright']};
const keys={up:false,down:false,left:false,right:false};
const normKey=k=>String(k||'').toLowerCase();
function blocked(x,y){
 const nav=V.navigation74;
 if(nav&&typeof nav.blocked==='function')return !!nav.blocked(x,y,CORE.radius);
 const W=V.world||{w:3200,h:2000};
 if(x<55||y<135||x>W.w-55||y>W.h-55)return true;
 return (V.worldGeometry?.buildings||[]).some(b=>x>b.x-CORE.radius&&x<b.x+b.w+CORE.radius&&y>b.y-CORE.radius&&y<b.y+b.h+CORE.radius);
}
function valid(x,y){return Number.isFinite(x)&&Number.isFinite(y)&&!blocked(x,y)}
function safeSpawn(){
 const candidates=[[960,700],[960,680],[1050,650],[720,650],[1200,700],[900,760],[1100,760],[650,650],[1250,650]];
 for(const p of candidates)if(valid(p[0],p[1]))return p;
 const W=V.world||{w:3200,h:2000};
 for(let y=180;y<W.h-100;y+=70)for(let x=100;x<W.w-100;x+=70)if(valid(x,y))return[x,y];
 return[120,200];
}
function repair(){if(!valid(Number(S.x),Number(S.y))){const p=safeSpawn();S.x=p[0];S.y=p[1];S.playerRecovered=true}if(!['up','down','left','right'].includes(S.facing))S.facing='down';if(!Number.isFinite(S.energy))S.energy=100;if(!Number.isFinite(S.speed)||S.speed<80)S.speed=CORE.speed}
function set(dir,on){keys[dir]=on;if(on)S.facing=dir}
function clear(){Object.keys(keys).forEach(k=>keys[k]=false);S.moving=false}
function paused(){return !S.started||S.dialogue||S._menuPaused||V.buildings71?.getState?.()}
function input(e,on){const k=normKey(e.key);for(const dir of Object.keys(directions))if(directions[dir].includes(k)){e.preventDefault();e.stopImmediatePropagation();set(dir,on);return true}return false}
function move(dt){
 if(paused()){clear();return false}
 repair();
 let dx=(keys.right?1:0)-(keys.left?1:0),dy=(keys.down?1:0)-(keys.up?1:0);
 if(!dx&&!dy){S.moving=false;return false}
 const len=Math.hypot(dx,dy);dx/=len;dy/=len;
 const speed=(Number(S.energy)>0?Number(S.speed)||CORE.speed:105);
 const dist=speed*Math.min(.05,Math.max(0,dt));
 let nx=S.x+dx*dist,ny=S.y+dy*dist,moved=false;
 if(!blocked(nx,S.y)){S.x=nx;moved=true}
 if(!blocked(S.x,ny)){S.y=ny;moved=true}
 if(moved){if(Math.abs(dx)>Math.abs(dy))S.facing=dx<0?'left':'right';else S.facing=dy<0?'up':'down';S.walk=(Number(S.walk)||0)+dt*11;S.energy=Math.max(0,(Number(S.energy)||0)-dt*.62)}
 S.moving=moved;
 return moved;
}
function bind(){
 if(V.__corePlayerBound)return;V.__corePlayerBound=true;
 addEventListener('keydown',e=>input(e,true),{capture:true,passive:false});
 addEventListener('keyup',e=>input(e,false),{capture:true,passive:false});
 addEventListener('blur',clear,{capture:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)clear()},{capture:true});
 document.querySelectorAll('[data-key]').forEach(b=>{if(b.dataset.corePlayer)return;b.dataset.corePlayer='1';const d=b.dataset.key;const down=e=>{e.preventDefault();e.stopImmediatePropagation();set(d,true)};const up=e=>{e.preventDefault();e.stopImmediatePropagation();set(d,false)};b.addEventListener('pointerdown',down,{capture:true,passive:false});['pointerup','pointercancel','pointerleave','lostpointercapture'].forEach(t=>b.addEventListener(t,up,{capture:true,passive:false}))});
}
repair();bind();
V.player=Object.assign(V.player||{},CORE,{keys,blocked,valid,repair,safeSpawn,move,clear});
setInterval(repair,500);
})();
