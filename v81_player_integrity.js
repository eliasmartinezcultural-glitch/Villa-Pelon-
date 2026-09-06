/* Villa Pelón V81 — integridad del personaje principal.
   No reemplaza el motor ni borra sistemas previos.
   Repara estados de guardado corruptos que pueden dejar al jugador en NaN/null/fuera del mundo.
*/
(()=>{
  'use strict';
  const V=window.VillaPelon||(window.VillaPelon={});
  const SPAWN={x:960,y:650};
  const WORLD={w:3200,h:2000};
  const validDir=d=>['up','down','left','right'].includes(d)?d:'down';
  function finite(v,f){return Number.isFinite(Number(v))?Number(v):f}
  function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
  function repair(){
    const s=V.gameState;
    if(!s)return false;
    let changed=false;
    const oldX=s.x,oldY=s.y;
    s.x=finite(s.x,SPAWN.x); s.y=finite(s.y,SPAWN.y);
    if(s.x<55||s.x>WORLD.w-55||s.y<135||s.y>WORLD.h-55){s.x=SPAWN.x;s.y=SPAWN.y}
    s.x=clamp(s.x,55,WORLD.w-55); s.y=clamp(s.y,135,WORLD.h-55);
    s.speed=finite(s.speed,205);s.money=finite(s.money,10000);s.energy=clamp(finite(s.energy,100),0,100);
    s.minutes=clamp(finite(s.minutes,480),0,1439.999);s.day=Math.max(1,Math.floor(finite(s.day,1)));
    s.quest=Math.max(0,Math.floor(finite(s.quest,0)));s.walk=finite(s.walk,0);s.facing=validDir(s.facing);
    if(!Array.isArray(s.inventory))s.inventory=[];
    changed=oldX!==s.x||oldY!==s.y;
    if(changed){
      try{
        const saved={...s,dialogue:false,saved:false};
        localStorage.setItem('villa_pelon_save',JSON.stringify(saved));
      }catch(_){ }
      console.warn('[Villa Pelón V81] Estado del jugador reparado:',s.x,s.y);
    }
    return true;
  }
  V.playerIntegrity={version:'V81.1',repair};
  function boot(){
    if(!repair())return;
    setInterval(repair,250);
    window.dispatchEvent(new CustomEvent('villa-pelon-player-integrity-ready'));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
