/* VILLA PELÓN V5 — PIXEL WORLD ART
   Arte procedimental de baja resolución visual. Sin sprites externos ni filtros suaves.
   Se dibuja en coordenadas de mundo sobre el render existente y respeta el único motor.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const C=document.getElementById('world'); if(!C)return;
const P=V.pixelWorldV5={version:5,enabled:true,author:'Elías Martínez',mode:'pixel-art'};
const q=()=>{try{return JSON.parse(localStorage.getItem('villa_pelon_v4_settings')||'{}').quality||'high'}catch(_){return'high'}};
const rect=(c,x,y,w,h,fill)=>{c.fillStyle=fill;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
function drawVineyard(c,x,y,cols,rows){for(let r=0;r<rows;r++)for(let k=0;k<cols;k++){const xx=x+k*26+(r%2)*8,yy=y+r*22;rect(c,xx,yy,3,14,'#4b5f3d');rect(c,xx-4,yy+3,11,4,'#5f7545');rect(c,xx-2,yy+8,8,4,'#566b40')}}
function drawIrrigation(c,x,y,len,vertical){c.fillStyle='#6b5941';c.fillRect(x,y,vertical?5:len,vertical?len:5);c.fillStyle='#71929a';c.fillRect(x+(vertical?1:0),y+(vertical?0:1),vertical?3:len,vertical?len:3)}
function drawTree(c,x,y,s=1){rect(c,x-3*s,y+10*s,6*s,15*s,'#604832');rect(c,x-14*s,y,28*s,18*s,'#4f6842');rect(c,x-9*s,y-7*s,18*s,12*s,'#5f7749');rect(c,x-4*s,y-11*s,8*s,7*s,'#6c824d')}
function drawMountainBand(c,w,h){const base=Math.round(h*.32);c.fillStyle='#77745f';c.beginPath();c.moveTo(0,base);for(let x=0;x<=w;x+=48){const y=base-((x*37)%90);c.lineTo(x,y)}c.lineTo(w,0);c.lineTo(0,0);c.closePath();c.fill()}
function worldArt(){const e=V.engine;if(!e||typeof e.render!=='function'||e.__pixelWorldV5)return false;e.__pixelWorldV5=true;const original=e.render;e.render=function(){const r=original.apply(this,arguments);const c=C.getContext('2d');if(!c)return r;const cam=V.camera||{x:0,y:0,zoom:1};const z=Number(cam.zoom||1),w=innerWidth,h=innerHeight;const ox=w/2-cam.x*z,oy=h/2-cam.y*z;c.save();c.translate(ox,oy);c.scale(z,z);c.imageSmoothingEnabled=false;
 if(q()!=='low'){
  // Corredores productivos: chacras, riego y viñedos.
  drawIrrigation(c,2050,260,900,false);drawIrrigation(c,2880,760,680,true);drawIrrigation(c,560,1280,520,false);
  drawVineyard(c,3030,760,10,8);drawVineyard(c,3220,1450,8,6);drawVineyard(c,2170,1450,7,6);
  for(let i=0;i<26;i++){const x=120+(i*173)%3850,y=260+(i*97)%2050;if((y>680&&y<950)||(x>1160&&x<1420))continue;drawTree(c,x,y,1+(i%3)*.12)}
 }
 c.restore();P.ready=true;P.quality=q();return r};return true}
function init(){if(!worldArt()){setTimeout(worldArt,150);setTimeout(worldArt,600);setTimeout(worldArt,1500)}}init();
})();
