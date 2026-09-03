/* Villa Pelón V41 — personaje RPG integrado a la presentación del motor.
   No crea un motor ni un RAF adicional. Consume el estado/input existente y reemplaza la capa V40. */
(() => {
  'use strict';
  const V=window.VillaPelon||(window.VillaPelon={});
  const canvas=document.getElementById('world');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const state=()=>V.gameState||window.__villaPelonState;
  const ZOOM=.78;
  const C={skin:'#d9a27c',skin2:'#b97858',hair:'#332923',shirt:'#2f5d46',shirt2:'#244735',pants:'#304b67',pants2:'#22364d',boot:'#352c29',eye:'#171b19',outline:'#20251f'};
  let facing='down';
  let installed=false;

  // Lee las teclas sin mover al jugador: el motor principal sigue siendo la única autoridad de movimiento.
  addEventListener('keydown',e=>{
    const k=e.key.toLowerCase();
    if(k==='arrowup'||k==='w')facing='up';
    else if(k==='arrowdown'||k==='s')facing='down';
    else if(k==='arrowleft'||k==='a')facing='left';
    else if(k==='arrowright'||k==='d')facing='right';
  },{passive:true});
  V.characterFacing=()=>facing;

  function px(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
  function worldToScreen(x,y){
    const st=state();
    if(!st)return{x,y};
    const vw=innerWidth,vh=innerHeight,w=V.world||{w:3200,h:2000};
    const camX=Math.max(0,Math.min(w.w-vw/ZOOM,st.x-vw/(2*ZOOM)));
    const camY=Math.max(55,Math.min(w.h-vh/ZOOM,st.y-vh/(2*ZOOM)));
    return{x:(x-camX)*ZOOM,y:(y-camY)*ZOOM};
  }
  function shadow(x,y){
    ctx.fillStyle='rgba(25,35,25,.28)';
    ctx.beginPath();ctx.ellipse(x,y+31,18,5,0,0,Math.PI*2);ctx.fill();
  }
  function character(x,y,o={}){
    const dir=o.direction||'down';
    const moving=!!o.moving;
    const frame=moving?Math.floor((o.walk||0)*1.7)%4:0;
    const swing=frame===1?2:frame===3?-2:0;
    const bob=moving&&dir==='down'||moving&&dir==='up'?Math.abs(Math.sin((o.walk||0)*1.7))*1.5:0;
    const skin=o.skin||C.skin,shirt=o.shirt||C.shirt,pants=o.pants||C.pants;
    shadow(x,y);

    // Piernas separadas: nunca se fusionan con el torso.
    if(dir==='left'||dir==='right'){
      px(x-9,y+8+swing,8,18,pants);px(x+1,y+8-swing,8,18,pants);
      px(x-10,y+25+swing,10,5,C.boot);px(x+1,y+25-swing,10,5,C.boot);
    }else{
      px(x-10,y+8+swing,8,18,pants);px(x+2,y+8-swing,8,18,pants);
      px(x-11,y+25+swing,10,5,C.boot);px(x+1,y+25-swing,10,5,C.boot);
    }

    // Torso, brazos y cuello con contorno pixelado.
    px(x-15,y-8-bob,30,19,C.outline);
    px(x-11,y-6-bob,22,16,shirt);
    px(x-17,y-5-bob,5,15,o.shirt2||C.shirt2);
    px(x+12,y-5-bob,5,15,o.shirt2||C.shirt2);
    px(x-5,y-13-bob,10,6,skin);

    // Cabeza cuadrada + pelo. La cara cambia según dirección.
    px(x-12,y-29-bob,24,20,C.outline);
    px(x-9,y-27-bob,18,17,skin);
    px(x-10,y-28-bob,20,5,o.hair||C.hair);
    px(x-8,y-25-bob,16,4,o.hair||C.hair);
    if(dir==='left')px(x-11,y-23-bob,5,8,o.hair||C.hair);
    else if(dir==='right')px(x+6,y-23-bob,5,8,o.hair||C.hair);
    else px(x-11,y-23-bob,3,7,o.hair||C.hair);

    if(dir==='up'){
      px(x-9,y-22-bob,18,10,o.hair||C.hair);
      px(x-11,y-20-bob,3,8,o.hair||C.hair);px(x+8,y-20-bob,3,8,o.hair||C.hair);
    }else if(dir==='left'){
      px(x-7,y-18-bob,3,3,C.eye);px(x-10,y-14-bob,3,2,C.skin2);
    }else if(dir==='right'){
      px(x+4,y-18-bob,3,3,C.eye);px(x+7,y-14-bob,3,2,C.skin2);
    }else{
      px(x-6,y-18-bob,3,3,C.eye);px(x+3,y-18-bob,3,3,C.eye);
      px(x+1,y-13-bob,3,2,C.skin2);px(x-3,y-10-bob,7,2,'#7e4b42');
    }

    // Detalle de ropa: hace que cada figura sea legible incluso en móvil.
    px(x-2,y-4-bob,4,10,o.shirt2||C.shirt2);
    if(o.accent)px(x+6,y-1-bob,4,5,o.accent);

    if(o.name){
      ctx.font='bold 11px monospace';ctx.textAlign='center';
      const label=o.name.toUpperCase();
      const width=Math.max(64,ctx.measureText(label).width+14);
      ctx.fillStyle='rgba(20,27,21,.92)';ctx.fillRect(x-width/2,y-48,width,16);
      ctx.fillStyle='#f5edcf';ctx.fillText(label,x,y-36);
    }
  }

  function overlay(){
    const st=state();
    if(!st||!st.started)return;
    const p=worldToScreen(st.x,st.y);
    const moving=st.walk>0;
    character(p.x,p.y,{direction:facing,moving,walk:st.walk,shirt:C.shirt,pants:C.pants,accent:'#d6b44f'});
    (V.npcs||[]).forEach((n,i)=>{
      const q=worldToScreen(n.x,n.y);
      if(q.x<-90||q.x>innerWidth+90||q.y<-90||q.y>innerHeight+90)return;
      const npcMoving=!!n.moving;
      const npcDirection=n.direction||(['down','left','right','down','up'][i%5]);
      character(q.x,q.y,{name:n.name,direction:npcDirection,moving:npcMoving,walk:performance.now()/240+n.x/90,shirt:n.color,pants:i%2?C.pants:'#4b5360',skin:i%3===0?'#d39a76':C.skin,accent:i%2?'#d6b44f':'#e0e0d2'});
    });
  }

  function install(){
    if(installed||!V.life||typeof V.life.drawOverlay!=='function')return !!installed;
    const base=V.life.drawOverlay;
    V.life.drawOverlay=function(c,w,h){base.call(this,c,w,h);overlay();};
    V.life.__v41CharacterSystem=true;
    installed=true;
    V.pixelArt={version:'V41',character,worldToScreen};
    return true;
  }
  if(!install()){
    const timer=setInterval(()=>{if(install())clearInterval(timer);},100);
    setTimeout(()=>clearInterval(timer),10000);
  }
})();
