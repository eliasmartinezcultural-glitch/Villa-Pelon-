/* Villa Pelón V6.8.5 — ATMÓSFERA DE HORA DEL DÍA
   Capa visual sobre el overlay existente: amanecer, atardecer y noche.
   No crea RAF ni modifica movimiento, cámara, interacción o física.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const A=V.v6NightAtmosphere=V.v6NightAtmosphere||{version:1,enabled:true,patched:false};
function phaseMinutes(){const s=V.state||{};if(Number.isFinite(s.minutes))return s.minutes;const h=Number(s.hour);const m=Number(s.minute);if(Number.isFinite(h))return h*60+(Number.isFinite(m)?m:0);return 480}
function wrap(){const life=V.life;if(!life||A.patched||typeof life.drawOverlay!=='function')return false;const original=life.drawOverlay;life.drawOverlay=function(c,vw,vh){original.call(life,c,vw,vh);const mins=((phaseMinutes()%1440)+1440)%1440,h=mins/60;A.phase=h<6?'night':h<8?'dawn':h<19?'day':h<21?'dusk':'night';c.save();c.setTransform(1,0,0,1,0,0);c.imageSmoothingEnabled=false;
if(A.phase==='dawn'||A.phase==='dusk'){const alpha=A.phase==='dawn'?Math.max(0,Math.min(.20,(8-h)*.10)) : Math.max(0,Math.min(.24,(h-19)*.12));if(alpha>0){c.fillStyle=A.phase==='dawn'?`rgba(220,170,105,${alpha})`:`rgba(180,105,75,${alpha})`;c.fillRect(0,0,vw,vh)}}
if(A.phase==='night'){c.fillStyle='rgba(6,10,25,.18)';c.fillRect(0,0,vw,vh);const moonX=Math.max(48,vw-92),moonY=64;c.fillStyle='rgba(244,232,190,.92)';c.beginPath();c.arc(moonX,moonY,18,0,Math.PI*2);c.fill();c.fillStyle='rgba(6,10,25,.18)';c.beginPath();c.arc(moonX+7,moonY-5,17,0,Math.PI*2);c.fill();for(let i=0;i<34;i++){const x=(i*137)%Math.max(1,vw-20)+10,y=(i*71)%Math.max(1,Math.min(260,vh-10))+8,a=.35+(i%4)*.12;c.fillStyle=`rgba(244,232,190,${a})`;c.fillRect(Math.round(x),Math.round(y),2,2)}}
c.restore()};A.patched=true;A.hook='V.life.drawOverlay';return true}
wrap();setTimeout(wrap,300);setTimeout(wrap,900);V.v6NightAtmosphere=A;
})();
