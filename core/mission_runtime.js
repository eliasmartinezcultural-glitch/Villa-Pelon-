/* VILLA PELÓN — MISSION RUNTIME 96.0
   Compatibilidad + eventos especiales de campaña.
   No crea motor, renderer ni ticker paralelo.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.gameState||(V.gameState={});
const M=V.missions;
if(!M)return;
M.ensure?.(S);
try{
  const raw=JSON.parse(localStorage.getItem('villa_pelon_missions')||'null');
  if(raw&&typeof raw==='object'){
    if(raw.missionId)S.missionId=raw.missionId;
    if(Number.isFinite(+raw.missionStep))S.missionStep=Math.max(0,+raw.missionStep);
    if(raw.missionFlags&&typeof raw.missionFlags==='object')S.missionFlags=raw.missionFlags;
    if(Array.isArray(raw.missionHistory))S.missionHistory=raw.missionHistory;
  }
}catch(_){}
const R={
 version:'96.0',
 regions:{rural:{x:4900,y:0,w:3300,h:4200},winery:{x:5500,y:300,w:1900,h:1800},plaza:{x:0,y:400,w:1050,h:450},picada21:{x:6750,y:2050,w:1450,h:1100}},
 complete:()=>false,
 points:{dni:{x:1280,y:470},picada21:{x:7600,y:2350},memory:{x:7600,y:2350},archive:{x:2080,y:520}}
};
V.missionRuntime=R;
function distance(p){return Math.hypot((+S.x||0)-p.x,(+S.y||0)-p.y)}
function toast(text){const e=document.getElementById('missionToast');if(!e)return;e.textContent=text;e.classList.add('show');clearTimeout(R.toastTimer);R.toastTimer=setTimeout(()=>e.classList.remove('show'),2200)}
function say(title,lines){S.dialogue=true;const d=document.getElementById('dialogue');if(!d)return;d.classList.remove('hidden');d.dataset.lines=JSON.stringify(lines);d.dataset.i='0';const sp=document.getElementById('speaker'),tx=document.getElementById('dialogueText');if(sp)sp.textContent=title;if(tx)tx.textContent=lines[0]||''}
function advance(key){const result=M.completeStep?.(S,key);if(!result)return false;if(result.reward)toast('MISIÓN COMPLETADA · +$'+result.reward);else toast('OBJETIVO COMPLETADO');window.dispatchEvent(new CustomEvent('villa-pelon-mission',{detail:{mission:M.status(S)}}));return true}
function specialInteract(){
  if(S.dialogue)return false;
  const m=M.current(S),o=M.objective(S);if(!m||!o)return false;
  if(o.type==='collect'&&o.target==='lost_dni'&&distance(R.points.dni)<105){
    S.inventory=Array.isArray(S.inventory)?S.inventory:[];if(!S.inventory.includes('DNI extraviado'))S.inventory.push('DNI extraviado');
    S.flags=S.flags||{};S.flags.lostDni=true;advance('collect:lost_dni');
    say('PUNTO DE ENCUENTRO',['Encontraste un DNI extraviado. No es tuyo: devolverlo es la misión.','El juego enseña una regla sencilla de convivencia: un objeto personal perdido debe volver a su dueño.','Ahora seguí el camino rural hacia Picada 21.']);
    return true;
  }
  if(o.type==='deliver'&&o.target==='dni_picada21'&&distance(R.points.picada21)<125){
    if(!S.inventory?.includes('DNI extraviado')){say('MISIÓN',['Primero tenés que encontrar el DNI extraviado.']);return true}
    S.inventory=S.inventory.filter(x=>x!=='DNI extraviado');S.flags=S.flags||{};S.flags.dniReturned=true;advance('deliver:dni_picada21');
    say('PICADA 21 · UN ENCUENTRO',['—¿Vos encontraste mi DNI? —pregunta una mujer que venía mirando el camino.','Cuando se lo entregás, se le ilumina la cara. Te cuenta que pensó que lo había perdido para siempre.','Entonces saca una vieja fotografía de una familia frente a una chacra y te dice: «Las cosas pequeñas también guardan historias».','Te invita a mirar el paisaje unos segundos. El viento mueve los álamos, baja la tarde y el camino queda en silencio.','La historia de este encuentro es narrativa y fue creada especialmente para el juego: su enseñanza es real, pero el personaje y la escena son ficticios.']);
    return true;
  }
  if(o.type==='inspect'&&o.target==='picada21_memory'&&distance(R.points.memory)<125){
    advance('inspect:picada21_memory');
    say('MEMORIA DE PICADA 21',['La mujer ya se fue. Antes de irse dejó una frase en tu cuaderno: «Preguntá, escuchá y después buscá la fuente».','Aprendiste algo importante: la memoria oral puede abrir una investigación, pero una investigación responsable debe contrastar sus datos.','Villa Pelón no se aprende de golpe. Se aprende caminándolo, escuchando a su gente y preguntando por qué las cosas son como son.']);
    return true;
  }
  if(o.type==='inspect'&&o.target==='archive'&&distance(R.points.archive)<120){
    advance('inspect:archive');
    say('CUADERNO DE INVESTIGACIÓN',['Regla de oro: una anécdota, una fotografía, un recuerdo y un documento pueden contar cosas distintas.','Cuando una misión te enseñe historia, buscá siempre la fuente antes de convertir el dato en una certeza.']);
    return true;
  }
  return false;
}
function auto(){
  const m=M.current(S),o=M.objective(S);if(!m||!o)return;
  if(o.type==='reach'&&o.target==='bridge'){
    const bridges=Array.isArray(V.worldGeometry?.bridges)?V.worldGeometry.bridges:[];
    if(bridges.some(b=>distance({x:+b.x+(+b.w||0)/2,y:+b.y+(+b.h||0)/2})<130))advance('reach:bridge');
  }
}
window.addEventListener('keydown',e=>{if(!['e',' '].includes(String(e.key).toLowerCase())||S.dialogue)return;if(specialInteract())e.stopImmediatePropagation()},{capture:true});
document.getElementById('interact')?.addEventListener('pointerup',e=>{if(S.dialogue)return;if(specialInteract()){e.preventDefault();e.stopImmediatePropagation()}},{capture:true});
setInterval(auto,450);
})();
