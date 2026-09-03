/* Villa Pelón V40 — presentación pixel RPG y corrección visual. No crea otro loop. */
(() => {
  'use strict';
  const V = window.VillaPelon || (window.VillaPelon = {});
  const canvas = document.getElementById('world');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const state = () => V.gameState || window.__villaPelonState;
  const ZOOM = .78;
  const COLORS = {
    skin:'#d9a27c', skin2:'#b97858', hair:'#332923', shirt:'#2f5d46', shirt2:'#244735',
    pants:'#304b67', pants2:'#22364d', boot:'#352c29', eye:'#171b19', outline:'#20251f',
    green:'#6f965c', green2:'#9dbb78', gold:'#d9b45e'
  };
  function px(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
  function character(x,y,opts={}){
    const walk=opts.walk||0, bob=opts.bob||0, skin=opts.skin||COLORS.skin;
    const shirt=opts.shirt||COLORS.shirt, pants=opts.pants||COLORS.pants;
    const hair=opts.hair||COLORS.hair;
    const step=Math.round(Math.sin(walk)*3);
    const Y=Math.round(y+bob);
    // sombra pixelada
    px(x-17,Y+27,34,5,'rgba(25,35,25,.30)'); px(x-11,Y+32,22,3,'rgba(25,35,25,.16)');
    // piernas separadas: la ausencia de piernas queda corregida
    px(x-10,Y+8+step,8,19,pants); px(x+2,Y+8-step,8,19,pants2(pants));
    px(x-11,Y+26+step,10,5,COLORS.boot); px(x+1,Y+26-step,10,5,COLORS.boot);
    // torso con contorno pixel-art
    px(x-14,Y-8,28,19,COLORS.outline); px(x-11,Y-6,22,17,shirt);
    px(x-16,Y-5,5,15,shirt2(opts)); px(x+11,Y-5,5,15,shirt2(opts));
    // cuello
    px(x-5,Y-12,10,6,skin);
    // cabeza cuadrada, no círculo liso
    px(x-12,Y-28,24,19,COLORS.outline); px(x-9,Y-26,18,16,skin); px(x-7,Y-24,14,5,hair);
    px(x-10,Y-27,20,4,hair); px(x-11,Y-23,3,7,hair);
    // orejas
    px(x-12,Y-19,3,6,skin2); px(x+9,Y-19,3,6,skin2);
    // ojos
    px(x-6,Y-17,3,3,COLORS.eye); px(x+3,Y-17,3,3,COLORS.eye);
    // nariz/boca mínima
    px(x+1,Y-12,3,2,COLORS.skin2); px(x-3,Y-9,7,2,'#7e4b42');
    // detalle de ropa
    px(x-2,Y-4,4,10,shirt2(opts));
    if(opts.name){
      ctx.font='bold 11px monospace'; ctx.textAlign='center'; ctx.textBaseline='alphabetic';
      ctx.fillStyle='rgba(20,27,21,.88)'; ctx.fillRect(x-34,Y-45,68,16);
      ctx.fillStyle='#f5edcf'; ctx.fillText(opts.name,x,Y-33);
    }
  }
  function pants2(p){ return p==='#304b67'?'#263e59':p; }
  function shirt2(o){ return o&&o.shirt ? o.shirt : COLORS.shirt2; }
  function worldToScreen(x,y,s){
    const st=state(); if(!st) return {x,y};
    const vw=innerWidth,vh=innerHeight;
    // El motor centra al jugador; este cálculo replica su cámara para los límites del mundo.
    const world=V.world||{w:3200,h:2000};
    const camX=Math.max(0,Math.min(world.w-vw/ZOOM,st.x-vw/(2*ZOOM)));
    const camY=Math.max(55,Math.min(world.h-vh/ZOOM,st.y-vh/(2*ZOOM)));
    return {x=(x-camX)*ZOOM,y=(y-camY)*ZOOM,s:ZOOM};
  }
  function overlay(){
    const st=state(); if(!st || !st.started) return;
    const p=worldToScreen(st.x,st.y);
    character(p.x,p.y,{walk:st.walk,shirt:COLORS.shirt,pants:COLORS.pants});
    // Personajes principales con proporciones y piernas legibles.
    (V.npcs||[]).forEach((n,i)=>{
      const q=worldToScreen(n.x,n.y);
      if(q.x<-80||q.x>innerWidth+80||q.y<-80||q.y>innerHeight+80) return;
      character(q.x,q.y,{name:n.name,walk:n.moving?performance.now()/110+n.x:0,shirt:n.color,pants:i%2?COLORS.pants:'#4b5360',skin:i%3===0?'#d39a76':COLORS.skin});
    });
  }
  if (V.life && V.life.drawOverlay && !V.life.__v40PixelOverlay) {
    const base=V.life.drawOverlay;
    V.life.drawOverlay=function(c,w,h){ base.call(this,c,w,h); overlay(); };
    V.life.__v40PixelOverlay=true;
  } else if (!V.__v40OverlayReady) {
    // El motor carga antes que este módulo; si el overlay de vida no existe, usamos un hook seguro.
    const hook=setInterval(()=>{
      if(V.life && V.life.drawOverlay && !V.life.__v40PixelOverlay){
        clearInterval(hook); const base=V.life.drawOverlay;
        V.life.drawOverlay=function(c,w,h){base.call(this,c,w,h);overlay();};
        V.life.__v40PixelOverlay=true;
      }
    },250);
    setTimeout(()=>clearInterval(hook),10000);
  }
  V.pixelArt={version:'V40',character,worldToScreen};
})();
