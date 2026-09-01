/* Villa Pelón V4 — REGLAS TERRITORIALES + PERSONAJES + PROFUNDIDAD
   REGLA CENTRAL: la calzada es circulación. Nunca se colocan edificios,
   árboles, mobiliario ni decoración dentro de ella. Solo tránsito y peatones.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const R={h:{y1:700,y2:930},v:{x1:1180,x2:1400}};
const pad=18;
const roadHit=(x,y,w=0,h=0)=>((y+h>R.h.y1-pad&&y<R.h.y2+pad)||(x+w>R.v.x1-pad&&x<R.v.x2+pad));
const roadPoint=(x,y)=>((y>R.h.y1&&y<R.h.y2)||(x>R.v.x1&&x<R.v.x2));
function enforce(){
 const bs=V.buildings||[];let home=0;
 const safe=[{x:1740,y:380},{x:1480,y:1320},{x:3150,y:420},{x:1600,y:1040}];let si=0;
 for(const b of bs){if(!b||b.x==null)continue;
  if(b.label==='CASA'){if(home++===1){b.x=1480;b.y=1010}continue}
  if(roadHit(b.x,b.y,b.w||120,b.h||80)){const q=safe[si++%safe.length];b.x=q.x;b.y=q.y}
 }
 V.v4WorldRule={version:4,rule:'CALZADA_LIBRE',roadBounds:R,valid:bs.every(b=>!roadHit(b.x,b.y,b.w||120,b.h||80))};
}
function transform(ctx,e){const d=Math.min(devicePixelRatio||1,2);ctx.save();ctx.setTransform(d,0,0,d,0,0);ctx.translate(innerWidth/2,innerHeight/2);ctx.scale(e.camera.zoom,e.camera.zoom);ctx.translate(-e.camera.x,-e.camera.y);return()=>ctx.restore()}
function roads(ctx,e){const end=transform(ctx,e);
 ctx.fillStyle='#bfa873';ctx.fillRect(0,R.h.y1,e.world.w,R.h.y2-R.h.y1);ctx.fillStyle='#e0d0a0';ctx.fillRect(0,782,e.world.w,66);
 ctx.fillStyle='#bfa873';ctx.fillRect(R.v.x1,0,R.v.x2-R.v.x1,e.world.h);ctx.fillStyle='#e0d0a0';ctx.fillRect(1256,0,68,e.world.h);
 ctx.strokeStyle='#806b50';ctx.lineWidth=4;ctx.setLineDash([28,22]);ctx.beginPath();ctx.moveTo(0,815);ctx.lineTo(e.world.w,815);ctx.moveTo(1290,0);ctx.lineTo(1290,e.world.h);ctx.stroke();ctx.setLineDash([]);
 ctx.strokeStyle='rgba(255,245,210,.65)';ctx.lineWidth=3;for(let x=80;x<e.world.w;x+=170){ctx.beginPath();ctx.moveTo(x,820);ctx.lineTo(x+55,820);ctx.stroke()}
 end()}
function face(ctx,n){
 ctx.fillStyle=n.skin||'#d7a07b';ctx.beginPath();ctx.ellipse(0,-16,13.5,15,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#382820';ctx.lineWidth=1.6;ctx.stroke();
 ctx.fillStyle=n.hair||'#40312a';ctx.beginPath();ctx.arc(0,-22,13.7,Math.PI,Math.PI*2);ctx.lineTo(13,-14);ctx.lineTo(10,-10);ctx.lineTo(-10,-11);ctx.closePath();ctx.fill();
 ctx.strokeStyle='#382820';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-8,-18);ctx.lineTo(-3,-19);ctx.moveTo(3,-19);ctx.lineTo(8,-18);ctx.stroke();
 ctx.fillStyle='#211b18';ctx.beginPath();ctx.arc(-5,-15,1.8,0,Math.PI*2);ctx.arc(5,-15,1.8,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle='#a2644e';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-14);ctx.lineTo(-1,-10);ctx.lineTo(2,-10);ctx.stroke();ctx.strokeStyle='#733f3d';ctx.beginPath();ctx.arc(0,-7,4,0.15,Math.PI-.15);ctx.stroke();
}
function person(ctx,n,player=false){
 const moving=player?(V.engine?.input?.up||V.engine?.input?.down||V.engine?.input?.left||V.engine?.input?.right):!!n.moving;
 const bob=moving?Math.sin(performance.now()/105+(n.x||0))*2.3:0;ctx.save();ctx.translate(n.x,n.y+bob);
 const skin=n.skin||'#d7a07b',hair=n.hair||'#40312a',shirt=player?'#315d9d':(n.color||'#68765e');
 ctx.fillStyle='rgba(35,25,18,.28)';ctx.beginPath();ctx.ellipse(0,30,20,7,0,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle='#302923';ctx.lineWidth=6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-6,14);ctx.lineTo(-8,29);ctx.moveTo(6,14);ctx.lineTo(8,29);ctx.stroke();
 ctx.fillStyle=shirt;ctx.strokeStyle='#29231e';ctx.lineWidth=2.5;ctx.beginPath();ctx.roundRect(-14,-2,28,29,7);ctx.fill();ctx.stroke();
 ctx.fillStyle=skin;ctx.fillRect(-5,-7,10,9);face(ctx,{skin,hair});
 ctx.fillStyle=skin;ctx.beginPath();ctx.arc(-13,-15,3.5,0,Math.PI*2);ctx.arc(13,-15,3.5,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle='#29231e';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-13,4);ctx.lineTo(-18,17);ctx.moveTo(13,4);ctx.lineTo(18,17);ctx.stroke();
 ctx.fillStyle='rgba(255,255,255,.15)';ctx.fillRect(-9,1,6,12);
 if(n.name||player){ctx.font='bold 11px monospace';ctx.textAlign='center';ctx.fillStyle='rgba(30,25,20,.84)';ctx.fillRect(-44,-49,88,17);ctx.fillStyle='#f3dfad';ctx.fillText(player?'TÚ':n.name,0,-37)}ctx.restore();
}
function tree(ctx,t){ctx.save();ctx.translate(t.x,t.y);const s=t.s||1;ctx.fillStyle='rgba(35,26,19,.22)';ctx.beginPath();ctx.ellipse(0,35*s,22*s,7*s,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#5c4735';ctx.fillRect(-5,2,10,34);ctx.fillStyle='#506b49';ctx.beginPath();ctx.arc(0,0,28*s,0,Math.PI*2);ctx.arc(-18,6,18*s,0,Math.PI*2);ctx.arc(19,7,19*s,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(225,238,190,.17)';ctx.beginPath();ctx.arc(-8,-10,10*s,0,Math.PI*2);ctx.fill();ctx.restore()}
function details(ctx,e){const end=transform(ctx,e);
 const trees=[...Array(22)].map((_,i)=>({x:90+i*190,y:300+(i%5)*115,s:1+(i%3)*.1})).filter(t=>!roadPoint(t.x,t.y));trees.forEach(t=>tree(ctx,t));
 const seen=new Set();for(const n of (V.npcs||[])){if(n&&n.x!=null&&!seen.has(n)){seen.add(n);person(ctx,n)}}
 const s=V.state;if(s)person(ctx,{x:s.x,y:s.y},true);
 for(const v of (V.v3Traffic||[])){if(v.x==null)continue;ctx.save();ctx.translate(v.x,v.y);const ang=v.dir==='N'?-Math.PI/2:v.dir==='S'?Math.PI/2:0;ctx.rotate(ang);ctx.fillStyle='rgba(25,20,16,.3)';ctx.beginPath();ctx.ellipse(0,14,29,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=v.color||'#657065';ctx.strokeStyle='#2b2824';ctx.lineWidth=2.5;ctx.beginPath();ctx.roundRect(-26,-11,52,22,5);ctx.fill();ctx.stroke();ctx.fillStyle='#293a40';ctx.fillRect(-15,-9,24,8);ctx.fillStyle='#20211f';ctx.fillRect(-19,8,10,7);ctx.fillRect(9,8,10,7);ctx.fillStyle='rgba(255,255,220,.55)';ctx.fillRect(20,-5,4,4);ctx.restore()}
 end()}
function install(){if(!V.engine||V.engine.__v4Structure)return false;V.engine.__v4Structure=true;enforce();const base=V.engine.render;V.engine.render=()=>{base();roads(V.engine.ctx,V.engine);details(V.engine.ctx,V.engine)};return true}
const wait=()=>install()||requestAnimationFrame(wait);wait();V.v4Structure={version:4,enforce,rule:'ruta libre de construcciones',install};
})();