/* VILLA PELÓN V65 — conversaciones ambientales.
   Burbujas breves y no invasivas; los diálogos formales siguen perteneciendo a game.js.
*/
(()=>{
'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const lines={
 despejado:['Qué lindo día para andar por las chacras.','Hoy el pueblo está tranquilo.','Después paso por el almacén.'],
 nublado:['Parece que cambia el tiempo.','Mejor terminar antes de que llueva.'],
 viento:['Hoy sopla fuerte en la barda.','Con este viento hay que asegurar todo.'],
 lluvia:['Habrá que esperar un poco.','El agua cambia el ritmo del día.']
};
let timer=0,slot=0;
function drawBubble(c,o,text){
 c.save();c.font='700 9px monospace';const w=Math.min(180,c.measureText(text).width+16),h=20,x=Math.round(o.x-w/2),y=Math.round(o.y-55);
 c.fillStyle='rgba(24,30,25,.88)';c.fillRect(x,y,w,h);c.fillStyle='#e8dfc4';c.fillRect(x+2,y+2,w-4,h-4);c.fillStyle='#28342c';c.fillText(text,x+8,y+13);c.fillStyle='#28342c';c.fillRect(Math.round(o.x-2),y+h,5,4);c.restore();
}
function install(){
 if(!V.life||V.life.__v65dialogue)return;
 const original=V.life.drawWorld;
 V.life.drawWorld=function(c){original(c);timer-=1/60;if(timer<=0){timer=4+Math.random()*7;slot=(slot+1)%lines[V.life.weather||'despejado'].length}const people=(V.life.ambient||[]).filter(p=>p.active&&!p.sheltered);if(people.length){const p=people[(Math.floor((V.life.phase||0)/5))%people.length];drawBubble(c,p,lines[V.life.weather||'despejado'][slot])}}
 V.life.__v65dialogue=true;
}
if(V.life)install();else window.addEventListener('villa-pelon-runtime-ready',install,{once:true});
})();
