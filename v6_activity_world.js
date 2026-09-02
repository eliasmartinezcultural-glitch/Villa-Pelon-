/* Villa Pelón V6.32 — VIDA VISIBLE + MICROAMBIENTACIÓN CONTEXTUAL
   La actividad visual nace del estado real de los habitantes y de los lugares.
   No crea movimiento, física ni loop adicional: se dibuja dentro de los hooks existentes.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),A=V.activityWorld=V.activityWorld||{};
Object.assign(A,{version:2,ready:false,patched:false,features:['state-driven-activity','contextual-props','work-cues','social-cues','home-cues','rural-cues','building-occupancy-cues','interior-room-activity','deterministic-animation']});
const life=V.life;
const phase=()=>performance.now()/700;
const people=()=>V.population?.movers?.()||[...(life?.ambient||[]),...(life?.workers||[]),...(V.npcs||[])];
function hash(p){let h=0;for(const c of String(p?.id||p?.name||'p'))h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)}
function activePeople(){const seen=new Set(),out=[];for(const p of people()){if(!p||!p.id||seen.has(p.id)||p._v65Hidden||p.lifeInside||!Number.isFinite(p.x)||!Number.isFinite(p.y))continue;seen.add(p.id);out.push(p)}return out}
function cue(c,p){const state=String(p.lifeState||''),place=String(p.lifeTarget||p.lifeAt||''),t=phase()+hash(p)*.013,x=p.x,y=p.y;
 c.save();c.globalAlpha=.72;
 c.fillStyle='rgba(35,27,22,.20)';c.beginPath();c.ellipse(x,y+13,8,3,0,0,Math.PI*2);c.fill();
 if(state==='working'||place==='chacra'){
   c.strokeStyle='rgba(194,151,73,.72)';c.lineWidth=2;c.beginPath();c.moveTo(x+9,y+4);c.lineTo(x+14,y-5+Math.sin(t)*2);c.stroke();
   c.fillStyle='rgba(182,136,61,.75)';c.fillRect(x-13,y+3,7,5);c.fillRect(x-4,y+7,7,4);
 }else if(state==='social'||place==='plaza'){
   c.fillStyle='rgba(226,190,116,.62)';c.beginPath();c.arc(x,y-18,2.5+Math.sin(t)*.7,0,Math.PI*2);c.fill();
   if(p.talking){c.font='bold 10px monospace';c.textAlign='center';c.fillStyle='rgba(247,226,176,.9)';c.fillText('•••',x,y-24)}
 }else if(state==='home'||place==='casa'){
   c.fillStyle='rgba(220,176,91,.38)';c.fillRect(x-5,y-18,10,2);
 }else if(state==='inside'||place==='almacen'||place==='radio'||place==='escuela'){
   c.fillStyle='rgba(220,176,91,.52)';c.fillRect(x-5,y-19,10,2);
 }else if(state==='waiting'){
   c.strokeStyle='rgba(205,171,111,.45)';c.setLineDash([2,3]);c.strokeRect(x-8,y-8,16,16);c.setLineDash([]);
 }
 c.restore()}
function buildingCues(c){const B=V.buildingSystem;if(!B?.buildings)return;for(const b of B.buildings){const n=Number(B.occupancy?.[b.id]||0);if(!n||!B.isOpen?.(b))continue;const d=b.door||{x:b.x+b.w/2,y:b.y+b.h},type=String(b.type||'').toLowerCase(),p=phase()+b.x*.009;c.save();
 if(type==='rural'){for(let i=0;i<Math.min(n,3);i++){const ox=-18+i*18;c.fillStyle='rgba(165,116,52,.75)';c.fillRect(d.x+ox,d.y+5,8,6);c.strokeStyle='rgba(214,174,92,.7)';c.beginPath();c.moveTo(d.x+ox+4,d.y+5);c.lineTo(d.x+ox+4,d.y-4-Math.sin(p+i)*2);c.stroke()}}
 else if(type==='bakery'){c.fillStyle='rgba(239,220,180,.20)';for(let i=0;i<3;i++){const ox=(i-1)*8,oy=-20-Math.abs(Math.sin(p+i))*10;c.beginPath();c.arc(d.x+ox,d.y+oy,4,0,Math.PI*2);c.fill()}}
 else if(type==='shop'){c.fillStyle='rgba(218,181,103,.52)';c.fillRect(d.x-12,d.y-14,24,3);c.fillRect(d.x-7,d.y-8,14,2)}
 else if(type==='school'){c.fillStyle='rgba(220,183,102,.62)';c.fillRect(d.x-2,d.y-21-Math.round(Math.abs(Math.sin(p))*4),4,4)}
 else if(type==='radio'){c.strokeStyle='rgba(224,192,119,.52)';c.lineWidth=1.5;for(let r=7;r<=17;r+=5){c.beginPath();c.arc(d.x,d.y-10,r+Math.sin(p)*1.5,-2.7,-.45);c.stroke()}}
 else {c.fillStyle='rgba(220,183,105,.24)';c.beginPath();c.arc(d.x,d.y-10,4+Math.abs(Math.sin(p))*2,0,Math.PI*2);c.fill()}
 c.restore()}}
function drawExterior(c){buildingCues(c);for(const p of activePeople())cue(c,p)}
function drawInterior(c,W,H){const B=V.buildingSystem,b=B?.inside;if(!b)return;const rooms=b.interior?.rooms||[],cols=Math.min(3,Math.max(1,rooms.length)),w=Math.min(820,W-42),h=Math.min(510,H-60),x=(W-w)/2,y=(H-h)/2,rw=(w-70-(cols-1)*12)/cols,t=phase();rooms.forEach((room,i)=>{const col=i%cols,row=Math.floor(i/cols),rx=x+28+col*(rw+12),ry=y+84+row*118,n=Number(B.activities?.[b.id]?.[room]||0);c.save();c.fillStyle='rgba(54,40,31,.16)';c.fillRect(rx,ry,rw,88);c.strokeStyle='rgba(220,186,119,.28)';c.strokeRect(rx,ry,rw,88);
 if(n){for(let k=0;k<Math.min(n,3);k++){const px=rx+35+(k%2)*55+Math.sin(t+k+i)*3,py=ry+65+(k>1?8:0);c.fillStyle='rgba(46,35,29,.85)';c.fillRect(px-4,py-11,8,9);c.fillRect(px-5,py-2,10,10);c.fillStyle='rgba(223,185,104,.8)';c.fillRect(px-3,py-14,6,3)}c.fillStyle='rgba(239,213,159,.9)';c.font='8px monospace';c.textAlign='left';c.fillText(`${n} EN ACTIVIDAD`,rx+7,ry+15)}else{c.fillStyle='rgba(239,213,159,.38)';c.font='8px monospace';c.fillText('tranquilo',rx+7,ry+15)}c.restore()})}
function patch(){if(A.patched)return;if(life?.drawWorld&&!A.worldPatched){const old=life.drawWorld;life.drawWorld=function(c){old.call(this,c);if(!V.buildingSystem?.inside)drawExterior(c)};A.worldPatched=true}if(life?.drawOverlay&&!A.overlayPatched){const old=life.drawOverlay;life.drawOverlay=function(c,w,h){old.call(this,c,w,h);if(V.buildingSystem?.inside)drawInterior(c,w||c.canvas.width,h||c.canvas.height)};A.overlayPatched=true}A.patched=!!(A.worldPatched&&A.overlayPatched);A.ready=A.patched}
patch();setTimeout(patch,300);setTimeout(patch,1000);A.check=()=>({ok:A.ready,version:A.version,people:activePeople().length,occupied:Object.values(V.buildingSystem?.occupancy||{}).reduce((a,n)=>a+n,0),activeBuildings:Object.keys(V.buildingSystem?.occupancy||{}).length,features:A.features});
})();
