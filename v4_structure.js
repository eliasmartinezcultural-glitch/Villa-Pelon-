/* Villa Pelón V4 — REGLAS FÍSICAS + DETALLE VISUAL
   Regla territorial: la ruta es espacio de circulación. No se construye encima.
   Sobre la calzada solo circulan vehículos y personajes.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const R={h:{y1:700,y2:930},v:{x1:1180,x2:1400}};
const inRoad=(x,y,w=0,h=0)=>((y+h>R.h.y1&&y<R.h.y2)||(x+w>R.v.x1&&x<R.v.x2));
function relocate(){
 const bs=V.buildings||[];
 const moves={
  'ALMACÉN EL ENCUENTRO':{x:1740,y:380},
  'RADIO OASIS 92.5':{x:1480,y:1320},
  'CASA':null,
  'BODEGA PATAGÓNICA':{x:3150,y:420}
 };
 let home=0;
 for(const b of bs){
  if(b.label==='CASA'){
   if(home++===1)b.x=1480,b.y=1010;
   continue;
  }
  if(moves[b.label]&&inRoad(b.x,b.y,b.w,b.h)){b.x=moves[b.label].x;b.y=moves[b.label].y}
 }
 V.v4WorldRule={version:4,roadRule:'CALZADA LIBRE',roadBounds:R,valid:bs.every(b=>!inRoad(b.x,b.y,b.w,b.h))};
}
function screenPoint(ctx,e,x,y){const d=Math.min(devicePixelRatio||1,2);ctx.save();ctx.setTransform(d,0,0,d,0,0);ctx.translate(innerWidth/2,innerHeight/2);ctx.scale(e.camera.zoom,e.camera.zoom);ctx.translate(-e.camera.x,-e.camera.y);return()=>ctx.restore()}
function roadsTop(ctx,e){
 const end=screenPoint(ctx,e,0,0);
 // Calzadas principales: se dibujan como espacio físico limpio.
 ctx.fillStyle='#c9b27f';ctx.fillRect(0,R.h.y1,e.world.w,R.h.y2-R.h.y1);
 ctx.fillStyle='#ded1a7';ctx.fillRect(0,782,e.world.w,66);
 ctx.fillStyle='#c9b27f';ctx.fillRect(R.v.x1,0,R.v.x2-R.v.x1,e.world.h);
 ctx.fillStyle='#ded1a7';ctx.fillRect(1256,0,68,e.world.h);
 ctx.strokeStyle='#8c7556';ctx.lineWidth=4;ctx.setLineDash([30,24]);ctx.beginPath();ctx.moveTo(0,815);ctx.lineTo(e.world.w,815);ctx.moveTo(1290,0);ctx.lineTo(1290,e.world.h);ctx.stroke();ctx.setLineDash([]);
 for(let x=100;x<e.world.w;x+=160){ctx.fillStyle='rgba(255,245,208,.6)';ctx.fillRect(x,820,48,4)}
 end();
}
function person(ctx,n,player=false){
 const moving=player?(V.engine?.input?.up||V.engine?.input?.down||V.engine?.input?.left||V.engine?.input?.right):n.moving;
 const bob=moving?Math.sin(performance.now()/105+(n.x||0))*2.2:0,x=n.x,y=n.y+bob;
 ctx.save();ctx.translate(x,y);
 ctx.fillStyle='rgba(30,22,17,.28)';ctx.beginPath();ctx.ellipse(0,29,20,7,0,0,Math.PI*2);ctx.fill();
 // piernas con relieve
 ctx.strokeStyle='#352b24';ctx.lineWidth=6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-6,15);ctx.lineTo(-8,29);ctx.moveTo(6,15);ctx.lineTo(8,29);ctx.stroke();
 // cuerpo + contorno
 ctx.fillStyle=player?'#315d9d':(n.color||'#65765d');ctx.strokeStyle='#29231e';ctx.lineWidth=2.5;ctx.beginPath();ctx.roundRect(-14,-2,28,29,7);ctx.fill();ctx.stroke();
 // cuello
 ctx.fillStyle='#d99f78';ctx.fillRect(-5,-7,10,9);
 // cara
 ctx.fillStyle='#dfa77f';ctx.beginPath();ctx.ellipse(0,-16,13.5,15,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#3a2a22';ctx.lineWidth=1.7;ctx.stroke();
 // orejas
 ctx.fillStyle='#d59872';ctx.beginPath();ctx.arc(-13,-15,3.5,0,Math.PI*2);ctx.arc(13,-15,3.5,0,Math.PI*2);ctx.fill();
 // cabello con silueta
 ctx.fillStyle=player?'#332b28':(n.hair||'#40322b');ctx.beginPath();ctx.arc(0,-22,13.5,Math.PI,Math.PI*2);ctx.lineTo(13,-15);ctx.lineTo(9,-11);ctx.lineTo(-10,-11);ctx.closePath();ctx.fill();
 // cejas, ojos y pupilas
 ctx.strokeStyle='#3b2922';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-8,-18);ctx.lineTo(-3,-19);ctx.moveTo(3,-19);ctx.lineTo(8,-18);ctx.stroke();
 ctx.fillStyle='#201b18';ctx.beginPath();ctx.arc(-5,-15,1.8,0,Math.PI*2);ctx.arc(5,-15,1.8,0,Math.PI*2);ctx.fill();
 // nariz y boca
 ctx.strokeStyle='#9b624c';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-14);ctx.lineTo(-1,-10);ctx.lineTo(2,-10);ctx.stroke();ctx.strokeStyle='#743f3b';ctx.beginPath();ctx.arc(0,-7,4,0.15,Math.PI-.15);ctx.stroke();
 // brazos
 ctx.strokeStyle='#29231e';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-13,4);ctx.lineTo(-18,17);ctx.moveTo(13,4);ctx.lineTo(18,17);ctx.stroke();
 // pequeño brillo de volumen
 ctx.fillStyle='rgba(255,255,255,.14)';ctx.fillRect(-9,1,6,12);
 if(n.name||player){ctx.font='bold 11px monospace';ctx.textAlign='center';ctx.fillStyle='rgba(30,25,20,.82)';ctx.fillRect(-42,-48,84,16);ctx.fillStyle='#f3dfad';ctx.fillText(player?'TÚ':n.name,0,-36)}
 ctx.restore();
}
function details(ctx,e){
 const end=screenPoint(ctx,e,0,0);
 // Árboles con tronco, copa escalonada y profundidad.
 const trees=[...Array(18)].map((_,i)=>({x:120+i*205,y:330+(i%4)*92,s:1+(i%3)*.12}));
 for(const t of trees){ctx.fillStyle='rgba(35,26,19,.2)';ctx.beginPath();ctx.ellipse(t.x,t.y+34*t.s,20*t.s,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#5c4735';ctx.fillRect(t.x-5,t.y+3,10,32);ctx.fillStyle='#526c4b';ctx.beginPath();ctx.arc(t.x,t.y,28*t.s,0,Math.PI*2);ctx.arc(t.x-17*t.s,t.y+5,17*t.s,0,Math.PI*2);ctx.arc(t.x+18*t.s,t.y+5,18*t.s,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(220,235,180,.16)';ctx.beginPath();ctx.arc(t.x-8,t.y-10,10,0,Math.PI*2);ctx.fill()}
 // Jugadores/NPC con cara completa por encima del mundo.
 const seen=new Set();for(const n of (V.npcs||[])){if(seen.has(n))continue;seen.add(n);person(ctx,n)}
 const s=V.state;if(s)person(ctx,{x:s.x,y:s.y,name:null},true);
 // Tráfico: pequeño relieve de carrocería, ruedas y parabrisas, siempre sobre la calzada.
 for(const v of (V.v3Traffic||[])){ctx.save();ctx.translate(v.x,v.y);const ang=v.dir==='N'?-Math.PI/2:v.dir==='S'?Math.PI/2:0;ctx.rotate(ang);ctx.fillStyle='rgba(25,20,16,.3)';ctx.beginPath();ctx.ellipse(0,13,28,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=v.color||'#5f6d62';ctx.strokeStyle='#2c2925';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(-25,-10,50,20,5);ctx.fill();ctx.stroke();ctx.fillStyle='#28353a';ctx.fillRect(-14,-8,22,7);ctx.fillStyle='#1f201e';ctx.fillRect(-18,8,9,7);ctx.fillRect(9,8,9,7);ctx.restore()}
 end();
}
function install(){if(!V.engine||V.engine.__v4Structure)return false;V.engine.__v4Structure=true;relocate();const base=V.engine.render;V.engine.render=()=>{base();roadsTop(V.engine.ctx,V.engine);details(V.engine.ctx,V.engine)};return true}
const wait=()=>install()||requestAnimationFrame(wait);wait();
})();