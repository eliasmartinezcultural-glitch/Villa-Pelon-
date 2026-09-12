/* VILLA PELÓN — MOTOR TERRITORIAL V113 / WORLD_MASTER_V1
   Geometría única: V.worldGeometry.
   El motor dibuja exclusivamente terreno, rutas, río y puentes desde el master.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});const canvas=document.getElementById('world');if(!canvas)return;
const ctx=canvas.getContext('2d',{alpha:false});ctx.imageSmoothingEnabled=false;const CAMERA=.82;
const S=V.gameState=V.gameState||{};const W=V.world||{w:8200,h:4200};
Object.assign(S,{started:true,x:Number(S.x)||1380,y:Number(S.y)||1200,speed:205,money:Number(S.money)||10000,energy:Number(S.energy)||100,minutes:Number(S.minutes)||480,day:Number(S.day)||1});
let vw=innerWidth,vh=innerHeight,last=performance.now();const I={up:false,down:false,left:false,right:false};
const colors={grass:'#8d9667',urban:'#a89a72',rural:'#9a9b65',road:'#b8a174',road2:'#8d7857',river:'#668d91',river2:'#7ea3a0',bridge:'#8b6848',bridge2:'#5f4938'};
function master(){if(!V.worldMaster?.locked)throw new Error('WORLD_MASTER_V1 no disponible');return V.worldGeometry}
function resize(){vw=innerWidth;vh=innerHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,vw*d);canvas.height=Math.max(1,vh*d);canvas.style.width=vw+'px';canvas.style.height=vh+'px';ctx.setTransform(d,0,0,d,0,0)}addEventListener('resize',resize,{passive:true});resize();
function rectHit(x,y,r,p=0){return x>=r.x-p&&x<=r.x+r.w+p&&y>=r.y-p&&y<=r.y+r.h+p}
function bridgeAt(x,y){return master().bridges.find(b=>rectHit(x,y,b,22))}
function blocked(x,y){const G=master(),r=G.river;if(x<45||y<105||x>W.w-45||y>W.h-45)return true;if(rectHit(x,y,r)&&!bridgeAt(x,y))return true;return G.buildings.some(b=>rectHit(x,y,b,18))}
function key(k,v){k=k.toLowerCase();if(k==='w'||k==='arrowup')I.up=v;if(k==='s'||k==='arrowdown')I.down=v;if(k==='a'||k==='arrowleft')I.left=v;if(k==='d'||k==='arrowright')I.right=v}addEventListener('keydown',e=>{key(e.key,true);if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(e.key.toLowerCase()))e.preventDefault()});addEventListener('keyup',e=>key(e.key,false));document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;b.addEventListener('pointerdown',e=>{e.preventDefault();I[k]=true});['pointerup','pointercancel','pointerleave'].forEach(q=>b.addEventListener(q,()=>I[k]=false))});
function drawTerrain(){const G=master(),r=G.river;ctx.fillStyle=colors.grass;ctx.fillRect(0,0,W.w,W.h);G.zones.forEach(z=>{ctx.fillStyle=z.id==='urban_core'?colors.urban:(z.kind==='productive'||z.kind==='rural'?colors.rural:colors.grass);ctx.fillRect(z.x,z.y,z.w,z.h)});G.roads.forEach(road=>{ctx.fillStyle=colors.road;ctx.fillRect(road.x,road.y,road.w,road.h);if(road.kind==='route'||road.kind==='rural_road'){ctx.fillStyle=colors.road2;ctx.fillRect(road.x,road.y+Math.max(2,road.h/2-2),road.w,4)}});ctx.fillStyle=colors.river;ctx.fillRect(r.x,r.y,r.w,r.h);ctx.fillStyle=colors.river2;for(let x=r.x+12;x<r.x+r.w;x+=34)ctx.fillRect(x,r.y+18,18,3);G.bridges.forEach(b=>{ctx.fillStyle=colors.bridge;ctx.fillRect(b.x,b.y,b.w,b.h);ctx.fillStyle=colors.bridge2;ctx.fillRect(b.x,b.y+12,b.w,8);ctx.fillRect(b.x,b.y+b.h-20,b.w,8);for(let x=b.x+18;x<b.x+b.w;x+=28)ctx.fillRect(x,b.y+24,5,b.h-48)});}
function update(dt){let dx=(I.right?1:0)-(I.left?1:0),dy=(I.down?1:0)-(I.up?1:0);if(!dx&&!dy)return;const l=Math.hypot(dx,dy);dx/=l;dy/=l;const nx=S.x+dx*S.speed*dt,ny=S.y+dy*S.speed*dt;if(!blocked(nx,S.y))S.x=nx;if(!blocked(S.x,ny))S.y=ny;S.minutes+=dt*2.2;S.energy=Math.max(0,S.energy-dt*.8);S.walk=(S.walk||0)+dt*8}
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;try{update(dt);ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,vw,vh);ctx.save();ctx.translate(vw/2,vh/2);ctx.scale(CAMERA,CAMERA);ctx.translate(-S.x,-S.y);drawTerrain();ctx.restore()}catch(e){console.error(e)}requestAnimationFrame(frame)}
V.engine={...(V.engine||{}),version:'113.0',worldMaster:'WORLD_MASTER_V1',singleTerrainRenderer:true,terrainAuthority:'core/world_master_v1.js',ownsTerrain:true,ownsRoads:true,ownsRiver:true,ownsBridges:true};window.dispatchEvent(new CustomEvent('villa-pelon-engine-ready',{detail:{version:'113.0',worldMaster:'WORLD_MASTER_V1'}}));requestAnimationFrame(frame);
})();
