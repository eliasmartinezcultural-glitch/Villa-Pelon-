/* Villa Pelón V6.6 — INTEGRIDAD DEL MUNDO
   Define el tamaño territorial, río y puentes visibles. La colisión queda en una sola capa.
   No crea RAF ni intervalos propios.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});const I=V.v6Integrity=V.v6Integrity||{version:4,enabled:true};const world=V.world;if(!world)return;
world.w=Math.max(Number(world.w)||0,8400);world.h=Math.max(Number(world.h)||0,5600);world.version=6;V.worldScale=V.worldScale||{};V.worldScale.version=3;V.worldScale.world=[world.w,world.h];V.v6Map={version:3,width:world.w,height:world.h,river:{x:7000,y:0,w:1200,h:5600},regions:{city:{x:0,y:0,w:3900,h:3000},suburbs:{x:3500,y:400,w:2200,h:2800},rural:{x:3000,y:2700,w:4000,h:2900}}};
function rect(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function river(c){const r=V.v6Map.river;rect(c,r.x,r.y,r.w,r.h,'#668995');for(let i=0;i<42;i++){const x=r.x+40+(i*137)%1080,y=80+(i*211)%5400;rect(c,x,y,28,3,'rgba(225,235,220,.28'));if(i%3===0)rect(c,x+16,y+7,12,2,'rgba(225,235,220,.18'))}rect(c,r.x-18,0,18,r.h,'#8c8b69');rect(c,r.x+r.w,0,18,r.h,'#8c8b69')}
function bridge(c,y){const r=V.v6Map.river;rect(c,r.x-18,y-70,r.w+36,140,'#b49a6d');rect(c,r.x-18,y-8,r.w+36,16,'#80664a');for(let x=r.x-10;x<r.x+r.w+20;x+=42){rect(c,x,y-54,5,108,'#71553f')}}
function farEast(c){for(let i=0;i<34;i++){const x=4200+(i*173)%2650,y=2850+(i*97)%2350;if(x>6980)continue;rect(c,x,y,5,28,'#5e4934');rect(c,x-12,y-10,29,20,'#536d46');rect(c,x-7,y-17,18,12,'#637a4c')}}
function patchRender(){if(I.renderPatched||!V.engine||typeof V.engine.render!=='function')return false;const old=V.engine.render;V.engine.render=function(){const r=old.apply(this,arguments);const c=document.getElementById('world')?.getContext('2d');if(!c||!V.state?.started)return r;const cam=V.camera||{x:0,y:0,zoom:1},z=Number(cam.zoom)||1;c.save();c.translate(innerWidth/2-cam.x*z,innerHeight/2-cam.y*z);c.scale(z,z);c.imageSmoothingEnabled=false;farEast(c);river(c);bridge(c,815);bridge(c,1395);c.restore();return r};I.renderPatched=true;return true}
function install(){if(!V.engine)return false;patchRender();I.ready=!!I.renderPatched;I.check=()=>({ok:I.ready,version:I.version,world:[world.w,world.h],buildings:Array.isArray(V.buildings)?V.buildings.length:0,npcs:Array.isArray(V.npcs)?V.npcs.length:0,life:!!V.life,dialogue:!!V.v6Dialogue})}
install();
})();
