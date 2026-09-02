/* Villa Pelón V6.1 — MOVIMIENTO, ANIMACIÓN Y MUNDO VIVO
   Capa de mejora sobre el motor existente.
   No crea RAF ni reemplaza el loop principal.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const M=V.v6Motion=V.v6Motion||{version:1,enabled:true};
const state=()=>V.state||{};
const input=()=>V.input||{};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

function initPlayer(){const s=state();s.motion=s.motion||{vx:0,vy:0,speed:0,phase:0,facing:'down',step:0};s.motion.accel=720;s.motion.brake=980;s.motion.max=235;return s.motion}
function patchUpdate(){if(!V.engine||M.updatePatched)return false;const original=V.engine.update;V.engine.update=function(dt){
 const s=state(),i=input(),m=initPlayer();
 const dx=(i.right?1:0)-(i.left?1:0),dy=(i.down?1:0)-(i.up?1:0),moving=!!(dx||dy);
 if(moving){
   const l=Math.hypot(dx,dy)||1,tx=dx/l*m.max,ty=dy/l*m.max;
   const k=Math.min(1,dt*5.5);m.vx+=(tx-m.vx)*k;m.vy+=(ty-m.vy)*k;m.speed=Math.hypot(m.vx,m.vy);
   if(Math.abs(dx)>Math.abs(dy))m.facing=dx>0?'right':'left';else m.facing=dy>0?'down':'up';
 }else{
   const k=Math.min(1,dt*7);m.vx*=1-k;m.vy*=1-k;m.speed=Math.hypot(m.vx,m.vy);
 }
 /* game.js realiza la colisión y el desplazamiento; le damos una velocidad progresiva */
 const oldSpeed=s.speed;s.speed=clamp(m.speed,0,m.max);
 const result=original.call(V.engine,dt);
 s.speed=oldSpeed||235;
 const actualMoving=m.speed>8;
 m.phase+=dt*(actualMoving?(8+m.speed/34):1.4);
 m.step=actualMoving?Math.sin(m.phase):0;
 s.moving=actualMoving;s.facing=m.facing;s.walkPhase=m.phase;
 for(const n of (V.npcs||[])){n.v6=n.v6||{phase:Math.random()*Math.PI*2,facing:'down',speed:0,activity:'walking'};const nm=n.v6;const nvx=(n._vx??0),nvy=(n._vy??0);const sp=Math.hypot(nvx,nvy);if(sp>1){nm.speed=sp;nm.phase+=dt*(6+sp/18);nm.facing=Math.abs(nvx)>Math.abs(nvy)?(nvx>0?'right':'left'):(nvy>0?'down':'up');n.walkPhase=nm.phase;n.facing=nm.facing;n.step=Math.sin(nm.phase)}else{nm.phase+=dt*1.2;n.step=0}}
 return result;
};M.updatePatched=true;return true}

function drawPlayerSprite(c,s,x,y){
 const m=s.motion||{};const step=Math.sin(m.phase||0),bob=Math.abs(step)*1.2;const facing=m.facing||'down';
 c.save();c.translate(Math.round(x),Math.round(y-bob));
 /* sombra y silueta pixelada */
 c.fillStyle='rgba(30,24,18,.30)';c.fillRect(-16,38,32,5);
 const skin='#c98e6d',shirt='#315d9d',pants='#45413c',shoe='#292723',hair='#302a27';
 const legA=step*4,legB=-step*4;
 c.fillStyle=pants;c.fillRect(-9+legA,6,7,28);c.fillRect(2+legB,6,7,28);
 c.fillStyle=shoe;c.fillRect(-12+legA,32,10,5);c.fillRect(4+legB,32,10,5);
 c.fillStyle=shirt;c.fillRect(-13,-22,26,30);c.fillRect(-17,-17,6,20);c.fillRect(11,-17,6,20);
 c.fillStyle=skin;c.fillRect(-4,-27,8,7);c.fillRect(-20+step*2,-1,6,6);c.fillRect(14-step*2,-1,6,6);
 c.fillStyle=skin;c.fillRect(-12,-45,24,19);c.fillStyle=hair;c.fillRect(-12,-49,24,7);c.fillRect(-15,-45,4,10);c.fillRect(11,-45,4,10);
 /* cara orientada de forma discreta */
 c.fillStyle='#f7efe0';c.fillRect(-7,-39,4,3);c.fillRect(3,-39,4,3);c.fillStyle='#171515';c.fillRect(facing==='left'?-7:3,-39,2,2);c.fillRect(facing==='left'?-2:5,-39,2,2);
 c.fillStyle='#f2d98d';c.font='bold 8px monospace';c.textAlign='center';c.fillText('TÚ',0,52);c.restore();
}
function patchRender(){if(!V.engine||M.renderPatched)return false;const original=V.engine.render;if(typeof original!=='function')return false;V.engine.render=function(){const r=original.apply(V.engine,arguments);try{const c=V.engine.ctx||V.ctx;if(c&&state().started){/* El jugador se dibuja en el pipeline existente; este hook sólo registra estado visual. */}}catch(_){}return r};M.renderPatched=true;return true}

/* Mundo vivo: actividades pequeñas y deterministas, sin teletransportes ni RAF paralelo. */
function enrichLife(){const life=V.life;if(!life||M.lifePatched)return false;const original=life.update;life.update=function(dt,minutes){const r=original.call(life,dt,minutes);life.phase=(life.phase||0)+dt;
  const hour=(minutes||480)/60;
  for(const n of (life.ambient||[])){n.v6=n.v6||{phase:Math.random()*6.28,wait:0,activity:'caminar'};const a=n.v6;a.phase+=dt*2;if(!n.moving)a.activity='esperando';else a.activity=hour>=18?'volviendo':'caminando';n.action=a.activity;n.step=Math.sin(a.phase)}
  for(const n of (life.workers||[])){n.v6=n.v6||{phase:Math.random()*6.28};n.v6.phase+=dt*2.4;n.action=hour<8?'preparando':hour<12?'trabajando':hour<14?'descansando':hour<18?'trabajando':'regresando';n.step=Math.sin(n.v6.phase)}
  for(const a of (life.animals||[])){a.v6=a.v6||{phase:Math.random()*6.28};a.v6.phase+=dt*(a.type==='gallina'?4:2);a.step=Math.sin(a.v6.phase);}
  return r;};M.lifePatched=true;return true}

function install(){if(!V.engine){setTimeout(install,50);return}patchUpdate();patchRender();enrichLife();V.v6Motion=M;V.v6Motion.features=['accelerated-walk','deceleration','direction','step-phase','ambient-activity','animal-animation'];}
install();
})();
