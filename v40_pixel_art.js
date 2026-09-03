/* Villa Pelón V40 — presentación pixel RPG y corrección visual. No crea otro loop. */
(() => {
'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),canvas=document.getElementById('world'); if(!canvas)return;
const ctx=canvas.getContext('2d'),state=()=>V.gameState||window.__villaPelonState,ZOOM=.78;
const C={skin:'#d9a27c',skin2:'#b97858',hair:'#332923',shirt:'#2f5d46',shirt2:'#244735',pants:'#304b67',pants2:'#22364d',boot:'#352c29',eye:'#171b19',outline:'#20251f'};
const px=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
function character(x,y,o={}){const step=Math.round(Math.sin(o.walk||0)*3),Y=Math.round(y+(o.bob||0)),skin=o.skin||C.skin,shirt=o.shirt||C.shirt,pants=o.pants||C.pants;
px(x-17,Y+27,34,5,'rgba(25,35,25,.30)');px(x-11,Y+32,22,3,'rgba(25,35,25,.16)');
px(x-10,Y+8+step,8,19,pants);px(x+2,Y+8-step,8,19,o.pants2||C.pants2);px(x-11,Y+26+step,10,5,C.boot);px(x+1,Y+26-step,10,5,C.boot);
px(x-14,Y-8,28,19,C.outline);px(x-11,Y-6,22,17,shirt);px(x-16,Y-5,5,15,o.shirt2||C.shirt2);px(x+11,Y-5,5,15,o.shirt2||C.shirt2);
px(x-5,Y-12,10,6,skin);px(x-12,Y-28,24,19,C.outline);px(x-9,Y-26,18,16,skin);px(x-7,Y-24,14,5,o.hair||C.hair);px(x-10,Y-27,20,4,o.hair||C.hair);px(x-11,Y-23,3,7,o.hair||C.hair);
px(x-12,Y-19,3,6,C.skin2);px(x+9,Y-19,3,6,C.skin2);px(x-6,Y-17,3,3,C.eye);px(x+3,Y-17,3,3,C.eye);px(x+1,Y-12,3,2,C.skin2);px(x-3,Y-9,7,2,'#7e4b42');px(x-2,Y-4,4,10,o.shirt2||C.shirt2);
if(o.name){ctx.font='bold 11px monospace';ctx.textAlign='center';ctx.fillStyle='rgba(20,27,21,.88)';ctx.fillRect(x-34,Y-45,68,16);ctx.fillStyle='#f5edcf';ctx.fillText(o.name,x,Y-33);}}
function worldToScreen(x,y){const st=state();if(!st)return{x,y};const vw=innerWidth,vh=innerHeight,w=V.world||{w:3200,h:2000};const camX=Math.max(0,Math.min(w.w-vw/ZOOM,st.x-vw/(2*ZOOM))),camY=Math.max(55,Math.min(w.h-vh/ZOOM,st.y-vh/(2*ZOOM)));return{x:(x-camX)*ZOOM,y:(y-camY)*ZOOM};}
function overlay(){const st=state();if(!st||!st.started)return;const p=worldToScreen(st.x,st.y);character(p.x,p.y,{walk:st.walk,shirt:C.shirt,pants:C.pants});(V.npcs||[]).forEach((n,i)=>{const q=worldToScreen(n.x,n.y);if(q.x<-80||q.x>innerWidth+80||q.y<-80||q.y>innerHeight+80)return;character(q.x,q.y,{name:n.name,walk:n.moving?performance.now()/110+n.x:0,shirt:n.color,pants:i%2?C.pants:'#4b5360',skin:i%3===0?'#d39a76':C.skin});});}
function install(){if(!V.life||!V.life.drawOverlay||V.life.__v40PixelOverlay)return false;const base=V.life.drawOverlay;V.life.drawOverlay=function(c,w,h){base.call(this,c,w,h);overlay();};V.life.__v40PixelOverlay=true;return true;}
if(!install()){const t=setInterval(()=>{if(install())clearInterval(t);},250);setTimeout(()=>clearInterval(t),10000);}
V.pixelArt={version:'V40',character,worldToScreen};
})();
