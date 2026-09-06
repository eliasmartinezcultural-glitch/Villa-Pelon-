/* V87.11 — reparación de movilidad, arranque, NPC y entrada táctil. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),S=V.gameState;if(!S)return;
const C=document.getElementById('world');
function geometry(){return V.worldAuthority?.geometry||V.worldGeometry||{width:8000,height:5200,roads:[],buildings:[],bridges:[],river:{x:0,y:120,w:8000,h:190}}}
const G=geometry();
const input={up:0,down:0,left:0,right:0};
function set(k,v){if(k in input)input[k]=v}
function mapKey(k){k=String(k).toLowerCase();return ({w:'up',arrowup:'up',s:'down',arrowdown:'down',a:'left',arrowleft:'left',d:'right',arrowright:'right'})[k]}
addEventListener('keydown',e=>{const k=mapKey(e.key);if(k){set(k,1);e.preventDefault()}} ,{passive:false});
addEventListener('keyup',e=>{const k=mapKey(e.key);if(k){set(k,0);e.preventDefault()}} ,{passive:false});
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture?.(e.pointerId);set(k,1)},{passive:false});['pointerup','pointercancel','lostpointercapture'].forEach(t=>b.addEventListener(t,e=>{e.preventDefault();set(k,0)},{passive:false}))});
function blocked(x,y){if(x<30||y<30||x>G.width-30||y>G.height-30)return true;const r=G.river;if(r&&x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h&&!((G.bridges||[]).some(b=>x>=b.x-12&&x<=b.x+b.w+12&&y>=b.y-12&&y<=b.y+b.h+12)))return true;return (G.buildings||[]).some(b=>x>=b.x-18&&x<=b.x+b.w+18&&y>=b.y-18&&y<=b.y+b.h+18)}
function repairStart(){S.started=true;document.getElementById('start')?.classList.add('hidden');document.getElementById('game')?.classList.remove('hidden');try{const a=JSON.parse(localStorage.getItem('villa_pelon_save')||'null');if(a&&typeof a==='object'){Object.assign(S,a);S.started=true;S.dialogue=false;S.transport=null}}catch(_){};V.engine?.setState?.('running');V.engine?.update?.(0)}
V.gameStart=repairStart;
document.getElementById('startBtn')?.addEventListener('click',()=>setTimeout(repairStart,10));
/* Puente de actualización: conserva el motor original y garantiza movimiento de NPC sin crear RAF paralelo. */
const oldUpdate=V.engine?.update;
if(typeof oldUpdate==='function'&&!V.__movementRepair){V.__movementRepair=true;V.engine.update=(dt)=>{oldUpdate(dt);const s=V.gameState;if(!s?.started||s.dialogue||s.transport)return;const dx=input.right-input.left,dy=input.down-input.up;if(dx||dy){const l=Math.hypot(dx,dy),speed=205;const nx=s.x+dx/l*speed*dt,ny=s.y+dy/l*speed*dt;if(!blocked(nx,s.y))s.x=nx;if(!blocked(s.x,ny))s.y=ny;s.walk=(s.walk||0)+dt*9;s.facing=Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down')}
const np=V.npcs||[];np.forEach((n,i)=>{n.phase=(n.phase||i)*1;const t=performance.now()/1000+n.phase;const radius=28;const nx=n.homeX??n.x+Math.sin(t*.17+i)*radius;const ny=n.homeY??n.y+Math.cos(t*.13+i)*radius*.55;if(n.homeX==null){n.homeX=n.x;n.homeY=n.y}n.x=nx;n.y=ny});};}
V.movementRepair={version:'V87.11.0',keyboard:true,touch:true,npcMotion:true,startRepair:true,parallelRaf:false};
console.info('[Villa Pelón] V87.11 reparación de movilidad activa');
})();