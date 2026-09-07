/* VILLA PELÓN V73 — auditoría y estabilización jugable.
   Corrige reglas territoriales, río, progreso real de misiones, HUD y landmarks. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),s=V.gameState;if(!s)return;
const W=V.world||{w:8200,h:4200};
const river=V.worldGeometry?.river||{x:7000,w:360,y:80,h:4040};
const bridges=V.worldGeometry?.bridges||[];
const missions=V.historyMissions||[];
const dist=(x,y,a,b)=>Math.hypot(x-a,y-b);
const near=(x,y,r)=>dist(s.x,s.y,x,y)<=r;
const bridgeAt=(x,y)=>bridges.some(b=>x>=b.x-18&&x<=b.x+b.w+18&&y>=b.y-18&&y<=b.y+b.h+18);
function enforceRiver(){
 if(!s.started)return;
 const inRiver=s.x>river.x-10&&s.x<river.x+river.w+10&&s.y>river.y&&s.y<river.y+river.h;
 if(!inRiver||bridgeAt(s.x,s.y))return;
 const left=Math.abs(s.x-(river.x-18)),right=Math.abs(s.x-(river.x+river.w+18));
 s.x=left<right?river.x-19:river.x+river.w+19;
}
setInterval(enforceRiver,50);

/* Landmarks visuales para que las misiones no dependan de coordenadas invisibles. */
const landmarks={
 sign:[1120,560,'ENTRADA A VILLA PELÓN'], mural:[2200,700,'MURAL · FIESTA DEL PELÓN'],
 institutions:[450,900,'INSTITUCIONES DEL PUEBLO'], lookout:[6500,3800,'MIRADOR RURAL']
};
const old=V.life&&V.life.drawWorld;
if(old&&!V.life.__v73){V.life.drawWorld=c=>{old(c);for(const k in landmarks){const [x,y,t]=landmarks[k];c.fillStyle='#5a4636';c.fillRect(x,y,4,30);c.fillStyle='#d6bd80';c.fillRect(x+4,y-4,Math.max(80,t.length*5.2),18);c.fillStyle='#2b3029';c.font='7px monospace';c.fillText(t,x+8,y+8)}c.fillStyle='rgba(255,255,255,.18)';for(const [x,y] of [[5750,1250],[5550,2150],[4750,2850]]){c.strokeStyle='#d8bd78';c.strokeRect(x,y,390,210)}};V.life.__v73=true}

function complete(i){
 if(s.historyQuest!==i||s.historySeen?.includes(i))return false;
 s.historySeen=s.historySeen||[];s.historySeen.push(i);s.historyQuest=Math.min(21,i+1);
 const m=missions[i];if(V.openDialogue)V.openDialogue(m?.[0]||('MISIÓN '+(i+1)),[m?.[1]||'Objetivo completado.',m?.[2]||'',s.historyQuest<21?'Siguiente: '+(missions[s.historyQuest]?.[0]||''):'Completaste las 21 misiones.']);
 if(V.addItem)V.addItem('Historia · '+(m?.[0]||('Misión '+(i+1))));
 return true;
}
function missionReady(i){
 switch(i){
 case 0:return near(1160,390,115)||near(530,565,115)||near(1750,610,115)||near(1200,1190,115);
 case 1:return near(1120,560,130);
 case 2:return near(3800,820,130);
 case 3:return near(4050,820,130);
 case 4:return s.inventory?.includes('Cajón de cosecha');
 case 5:return near(2200,700,130);
 case 6:return near(530,565,120)||near(1160,390,120);
 case 7:return near(1200,1190,120);
 case 8:return s.inventory?.some(x=>x.startsWith('Compra:'));
 case 9:return (V.life?.workers||[]).filter(w=>dist(s.x,s.y,w.x,w.y)<180).length>=1;
 case 10:return near(3950,1500,140);
 case 11:return near(5750,1250,150)||near(5550,2150,150)||near(4750,2850,150);
 case 12:return near(450,900,150)||near(530,565,130);
 case 13:return near(3500,950,150)||near(3650,950,180);
 case 14:return near(6870,810,150)||near(6870,1860,150)||near(6870,3020,150)||near(6870,3740,150);
 case 15:return near(7700,1300,160);
 case 16:return near(1160,390,150)||near(2200,700,150);
 case 17:return near(2040,430,140);
 case 18:return near(2040,430,140)||near(2500,1200,160);
 case 19:return (s.inventory||[]).filter(x=>x.startsWith('Historia ·')).length>=5;
 case 20:return near(6500,3800,180);
 default:return false;
 }
}
setInterval(()=>{if(!s.started||s.dialogue||s.historyQuest>=21)return;const i=s.historyQuest;if(missionReady(i))complete(i)},180);

/* HUD de misión: una instrucción concreta, no un texto genérico. */
setInterval(()=>{if(!s.started)return;const q=document.getElementById('questText');if(!q)return;const i=s.historyQuest;if(i<21){const m=missions[i];q.textContent=`${String(i+1).padStart(2,'0')}/21 · ${m?.[0]||'Explorá Villa Pelón'}`}else q.textContent='21/21 · HISTORIA COMPLETADA';},250);

/* Protección básica de estado para partidas antiguas/corruptas. */
if(!Number.isFinite(s.x)||!Number.isFinite(s.y)){s.x=960;s.y=650}if(!Number.isFinite(s.historyQuest)||s.historyQuest<0||s.historyQuest>21)s.historyQuest=0;if(!Array.isArray(s.historySeen))s.historySeen=[];
V.audit={version:'73.0.0',checks:{world:W.w>=8200&&W.h>=4200,river:true,bridges:bridges.length>=4,missions:missions.length===21,mobileControls:!!V.controls,save:typeof V.saveGame==='function'}};
})();