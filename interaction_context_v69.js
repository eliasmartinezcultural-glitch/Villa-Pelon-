/* Villa Pelón V69 — contexto de interacción.
   INTERACTION interpreta el estado vivo del ciudadano sin crear loops ni duplicar NPC.
   Solo intercepta la interacción cuando el objetivo es un ciudadano compartido.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const state=window.__villaPelonState;
const life=V.life;
if(!state||!V.getNearby||!V.openDialogue)return;

const CONTEXTS={
  Marta:{
    almacen:{title:'MARTA · ALMACÉN',lines:['Llegaste justo a tiempo. Estoy atendiendo el almacén.','Si buscás algo para el día, puedo venderte pan, yerba o azúcar.','Y si querés saber qué pasa en el pueblo, acá siempre circula alguna noticia.']},
    casa:{title:'MARTA · EN CASA',lines:['Hoy ya terminé en el almacén. Ahora estoy descansando un rato.','Mañana temprano vuelvo a abrir. En el pueblo los horarios también cuentan historias.']},
    default:{title:'MARTA',lines:['Ando con varias cosas del día. Después nos vemos con más tiempo.']}
  },
  Raúl:{
    chacra:{title:'RAÚL · CHACRA',lines:['Estoy trabajando en la chacra. Acá el día se organiza alrededor del campo.','Si querés conocer el trabajo rural, fijate en el galpón: siempre puede aparecer una changa.']},
    casa:{title:'RAÚL · EN CASA',lines:['Volví de la chacra y estoy bajando un cambio.','Mañana hay que madrugar otra vez.']},
    default:{title:'RAÚL',lines:['Estoy de paso. Después hablamos tranquilos.']}
  },
  Lucía:{
    escuela:{title:'LUCÍA · ESCUELA',lines:['Estoy en la escuela. Acá hay recuerdos que todavía nadie terminó de ordenar.','Una fotografía, un cuaderno o una conversación pueden convertirse en una pista.']},
    plaza:{title:'LUCÍA · PLAZA',lines:['Salí de la escuela y vine un rato a la plaza.','Cuando cambia el lugar donde vive la gente, también cambia la memoria del pueblo.']},
    default:{title:'LUCÍA',lines:['Estoy con cosas de la escuela. Después te cuento.']}
  },
  Pedro:{
    chacra:{title:'PEDRO · TRABAJO RURAL',lines:['Hoy toca trabajo en la chacra. No hay dos jornadas exactamente iguales.','Si querés aprender cómo se mueve el campo, observá primero y después probá ayudar.']},
    casa:{title:'PEDRO · EN CASA',lines:['Ya terminó la jornada. Ahora toca descansar.','El campo empieza temprano, así que conviene aprovechar la noche.']},
    default:{title:'PEDRO',lines:['Estoy ocupado con el trabajo. Nos cruzamos después.']}
  },
  Nico:{
    radio:{title:'NICO · RADIO OASIS',lines:['Estoy en la radio. Desde acá muchas historias del pueblo terminan encontrándose.','Si escuchás con atención, una charla cotidiana puede llevarte hasta una pista.']},
    plaza:{title:'NICO · PLAZA',lines:['Terminé por hoy en la radio y salí a caminar.','A veces las mejores historias aparecen cuando uno simplemente recorre el pueblo.']},
    casa:{title:'NICO · EN CASA',lines:['La radio ya quedó atrás por hoy. Estoy descansando.','Mañana volvemos a abrir el micrófono.']},
    default:{title:'NICO',lines:['Estoy con la cabeza en varias cosas. Después seguimos.']}
  }
};

function destinationKey(n){
  const d=n.destination;
  if(d==='almacen'||d==='chacra'||d==='escuela'||d==='radio'||d==='plaza'||d==='casa')return d;
  const a=String(n.activity||'');
  if(/almacén|almacen/.test(a))return 'almacen';
  if(/chacra|rural/.test(a))return 'chacra';
  if(/escuela/.test(a))return 'escuela';
  if(/radio/.test(a))return 'radio';
  if(/plaza|barrio/.test(a))return 'plaza';
  if(/hogar|casa/.test(a))return 'casa';
  return 'default';
}

function contextual(n){
  const table=CONTEXTS[n.name];
  if(!table)return null;
  const key=destinationKey(n);
  const base=table[key]||table.default;
  const lines=base.lines.slice();
  const h=Math.floor(state.minutes/60)%24;
  if(life&&life.weather==='lluvia')lines.push('Está lloviendo; hoy el clima también está cambiando la rutina del pueblo.');
  else if(h>=20||h<7)lines.push('Ya es de noche. La actividad baja y el pueblo empieza a recogerse.');
  else if(n.routineClock!=null)lines.push('Son las '+String(h).padStart(2,'0')+':00 y cada vecino está siguiendo su propia rutina.');
  return {title:base.title,lines};
}

function handle(){
  if(!state.started||state.dialogue)return false;
  const n=V.getNearby();
  if(!n||!n.__lifeCitizen)return false;
  const c=contextual(n);
  if(!c)return false;
  if(state.quest===0)state.quest=1;
  V.openDialogue(c.title,c.lines);
  return true;
}

addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  if(k!=='e'&&k!==' ')return;
  if(handle()){e.preventDefault();e.stopImmediatePropagation();}
},true);

const button=document.getElementById('interact');
if(button)button.addEventListener('pointerdown',e=>{
  if(handle()){e.preventDefault();e.stopImmediatePropagation();}
},true);

V.interactionContextV69={version:'69.0.0',authority:'INTERACTION',source:'shared-citizen-state',dataDriven:true,loop:'none'};
})();
