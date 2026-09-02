/* Villa Pelón V6.20 — DIRECTOR DE ACTIVIDADES
   Representa visualmente trabajo, estudio, comercio, radio, vida doméstica y producción rural.
   No crea movimiento ni un game loop: la animación deriva del tiempo de render.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),A=V.activityWorld=V.activityWorld||{version:1,ready:false};
function phase(){return performance.now()/700}
function drawPerson(c,x,y,s=.72,step=0){c.save();c.translate(x,y+Math.sin(phase()+step)*1.5);c.fillStyle='rgba(45,34,28,.92)';c.fillRect(-4*s,-11*s,8*s,9*s);c.fillRect(-5*s,-2*s,10*s,11*s);c.fillRect(-6*s,9*s,4*s,7*s);c.fillRect(2*s,9*s,4*s,7*s);c.fillStyle='rgba(226,190,115,.9)';c.fillRect(-3*s,-13*s,6*s,3*s);c.restore()}
function drawExteriorActivity(c){const B=V.buildingSystem;if(!B?.buildings)return;const t=phase();for(const b of B.buildings){const n=B.occupancy?.[b.id]||0;if(!n||!B.isOpen?.(b))continue;const d=b.door||{x:b.x+b.w/2,y:b.y+b.h},type=String(b.type||'').toLowerCase(),pulse=(Math.sin(t+b.x*.01)+1)*.5;c.save();c.globalAlpha=.72;
if(type==='rural'){for(let i=0;i<Math.min(n,4);i++){const x=b.x+b.w*.25+i*Math.min(55,b.w*.12),y=b.y+b.h*.72;c.strokeStyle='rgba(218,178,92,.65)';c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.lineTo(x+5,y-7-pulse*4);c.stroke()}}
else if(type==='bakery'){c.fillStyle='rgba(235,218,177,.22)';c.beginPath();c.arc(d.x,d.y-22-pulse*5,7+pulse*3,0,Math.PI*2);c.fill()}
else if(type==='school'){c.fillStyle='rgba(228,203,133,.72)';c.fillRect(d.x-2,d.y-18-Math.round(pulse*4),4,4)}
else if(type==='radio'){c.strokeStyle='rgba(225,194,118,.5)';c.lineWidth=2;for(let r=7;r<18;r+=6){c.beginPath();c.arc(d.x,d.y-8,r+pulse*2,-2.7,-.45);c.stroke()}}
else if(type==='shop'){c.fillStyle='rgba(225,190,110,.55)';c.fillRect(d.x-9,d.y-15,18,2+Math.round(pulse*2))}
else {c.fillStyle='rgba(225,190,110,.28)';c.beginPath();c.arc(d.x,d.y-10,4+pulse*3,0,Math.PI*2);c.fill()}c.restore()}}
function drawInteriorActivity(c,W,H){const B=V.buildingSystem,b=B?.inside;if(!b)return;const rooms=b.interior?.rooms||[],cols=Math.min(3,rooms.length||1),w=Math.min(820,W-42),h=Math.min(510,H-60),x=(W-w)/2,y=(H-h)/2,rw=(w-70-(cols-1)*12)/cols,t=phase();rooms.forEach((room,i)=>{const col=i%cols,row=Math.floor(i/cols),rx=x+28+col*(rw+12),ry=y+84+row*118,n=B.activities?.[b.id]?.[room]||0;if(!n)return;for(let k=0;k<Math.min(n,3);k++){const px=rx+35+(k%2)*55+Math.sin(t+k+i)*5,py=ry+65+(k>1?8:0);drawPerson(c,px,py,.72,k+i)}c.save();c.fillStyle='rgba(238,205,125,.15)';c.fillRect(rx+rw-55,ry+8,43,13);c.fillStyle='rgba(246,224,170,.9)';c.font='8px monospace';c.textAlign='center';c.fillText(`${n} EN ACCIÓN`,rx+rw-33,ry+17);c.restore()})}
function patch(){if(A.patched)return;if(V.life?.drawWorld&&!A.worldPatched){const old=V.life.drawWorld;V.life.drawWorld=function(c){old.call(this,c);if(!V.buildingSystem?.inside)drawExteriorActivity(c)};A.worldPatched=true}if(V.life?.drawOverlay&&!A.overlayPatched){const old=V.life.drawOverlay;V.life.drawOverlay=function(c,w,h){old.call(this,c,w,h);if(V.buildingSystem?.inside)drawInteriorActivity(c,w||c.canvas.width,h||c.canvas.height)};A.overlayPatched=true}A.patched=!!(A.worldPatched&&A.overlayPatched);A.ready=A.patched}
patch();setTimeout(patch,300);setTimeout(patch,1000);A.check=()=>({ok:A.ready,version:A.version,occupied:Object.values(V.buildingSystem?.occupancy||{}).reduce((a,n)=>a+n,0),activeBuildings:Object.keys(V.buildingSystem?.occupancy||{}).length});
})();
