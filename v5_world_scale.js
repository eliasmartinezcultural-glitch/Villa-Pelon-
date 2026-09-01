/* Villa Pelón V5.5 — ESCALA FÍSICA + MAPA EXPANDIDO */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),C=document.getElementById('world');if(!C)return;
const S=V.worldScale=Object.assign(V.worldScale||{},{version:2,unit:'world-pixel',adultHeight:60,childHeight:47,cowHeight:67,horseHeight:69,doorHeight:78,carLength:86,truckLength:112,roadWidth:230,sidewalkWidth:34});
const W=8400,H=5600;V.world=V.world||{};V.world.w=W;V.world.h=H;V.world.scaleVersion=2;V.world.regions={city:{x:0,y:0,w:3900,h:3000},suburbs:{x:3500,y:400,w:2200,h:2800},rural:{x:3000,y:2700,w:5400,h:2900},river:{x:7000,y:0,w:1200,h:5600}};
const rect=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
function line(c,x1,y1,x2,y2,col,w=4){c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke()}
function road(c,x,y,w,h){rect(c,x,y,w,h,'#bca777');if(w>h){rect(c,x,y+h*.36,w,h*.28,'#dfd0a5');line(c,x,y+h*.5,x+w,y+h*.5,'#8b7557',4)}else{rect(c,x+w*.36,y,w*.28,h,'#dfd0a5');line(c,x+w*.5,y,x+w*.5,y+h,'#8b7557',4)}}
function field(c,x,y,w,h){rect(c,x,y,w,h,'#9c8b60');for(let yy=y+28;yy<y+h;yy+=34)line(c,x+10,yy,x+w-10,yy,'#66764b',3)}
function tree(c,x,y,s=1){rect(c,x-5*s,y+8*s,10*s,32*s,'#604832');rect(c,x-23*s,y-8*s,46*s,28*s,'#526b46');rect(c,x-15*s,y-22*s,30*s,20*s,'#60794c');rect(c,x-7*s,y-30*s,14*s,10*s,'#6b8250')}
function fence(c,x,y,len){for(let i=0;i<len;i+=28)rect(c,x+i,y,6,28,'#75553b');rect(c,x,y,len,6,'#806143')}
function river(c){const x=7240;c.fillStyle='#5b858d';c.beginPath();c.moveTo(x,0);c.lineTo(x+210,0);for(let y=0;y<=H;y+=180){c.lineTo(x+80+Math.sin(y*.01)*120,y)}c.lineTo(x+430,H);c.lineTo(x+180,H);for(let y=H;y>=0;y-=180)c.lineTo(x+120+Math.sin(y*.01)*120,y);c.closePath();c.fill();for(let y=100;y<H;y+=260)rect(c,x+35+(y%520?40:0),y,95,5,'#a8c4bf')}
function bridge(c,x,y,w){rect(c,x,y,w,34,'#66503b');for(let i=0;i<w;i+=34)rect(c,x+i,y-10,6,54,'#4d3d30')}
function install(){const e=V.engine;if(!e||typeof e.render!=='function'||e.__worldScaleV55)return false;e.__worldScaleV55=true;const original=e.render;e.render=function(){const r=original.apply(this,arguments),c=C.getContext('2d');if(!c)return r;const cam=V.camera||{x:0,y:0,zoom:1},z=Number(cam.zoom||1),vw=innerWidth,vh=innerHeight;c.save();c.translate(vw/2-cam.x*z,vh/2-cam.y*z);c.scale(z,z);c.imageSmoothingEnabled=false;
road(c,3950,700,1250,230);road(c,3950,1250,230,1350);road(c,5000,700,230,2300);road(c,3550,2200,1900,230);road(c,5900,1450,230,1700);road(c,6100,2700,1100,230);road(c,6700,3500,540,230);
[[4200,430,620,250],[4200,1000,620,200],[4200,1500,620,250],[4200,2050,620,230],[5300,430,520,250],[5300,1000,520,250],[5300,1600,520,250],[5300,2150,520,240]].forEach(b=>{rect(c,b[0],b[1],b[2],b[3],'#bfa47a');fence(c,b[0]+18,b[1]+b[3]-12,b[2]-36)});
field(c,3000,3000,1050,650);field(c,4500,3150,1050,720);field(c,5650,3150,900,650);field(c,3500,3900,1150,700);field(c,4800,4100,1150,650);field(c,6100,3950,850,900);field(c,7350,1200,500,850);field(c,7350,2250,500,850);
for(let i=0;i<70;i++){const x=3000+(i*173)%4000,y=2750+(i*311)%2550;if(x>7050)continue;tree(c,x,y,.8+(i%3)*.12)}
rect(c,3150,2850,3900,10,'#6b5941');rect(c,3150,2853,3900,5,'#71929a');rect(c,4400,2850,8,1850,'#6b5941');rect(c,4402,2850,4,1850,'#71929a');rect(c,6500,2850,8,1200,'#6b5941');rect(c,6502,2850,4,1200,'#71929a');
river(c);bridge(c,7160,1850,520);bridge(c,7160,3820,520);c.restore();return r};return true}
function normalize(){(V.npcs||[]).forEach(n=>{n.heightScale=Number(n.age)<18?.78:1;n.worldHeight=Number(n.age)<18?S.childHeight:S.adultHeight;n.scaleClass=Number(n.age)<18?'child':'adult'});(V.life?.ambient||[]).forEach(n=>{n.heightScale=Number(n.age)<18?.78:1;n.worldHeight=Number(n.age)<18?S.childHeight:S.adultHeight;n.scaleClass=Number(n.age)<18?'child':'adult'});(V.life?.animals||[]).forEach(a=>a.worldScale=a.type==='vaca'?1.12:a.type==='caballo'?1.15:.32);(V.life?.traffic||[]).forEach(o=>o.worldScale=o.type==='camion'?1.05:o.type==='tractor'?.95:o.type==='bicicleta'?.38:.82)}
normalize();if(!install()){setTimeout(install,200);setTimeout(install,800)}S.layout='city-suburbs-rural-river';S.dimensions={width:W,height:H,previous:{width:4200,height:2700},areaMultiplier:4};S.physicalReferences={adult:60,child:47,cow:67,horse:69,door:78,car:86,truck:112};
})();
