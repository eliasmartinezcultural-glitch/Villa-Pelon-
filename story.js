/* Villa Pelón V2 — HISTORIA VIVA
   Diálogos cotidianos, progresión, aventuras y misiones secundarias.
   La ficción jugable está separada de los datos históricos documentados. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=()=>V.state;
const story={
  main:0, side:{}, flags:{}, rel:{}, active:null, started:false,
  missions:[
    {id:'bienvenida',title:'UN DÍA CUALQUIERA',text:'Hablá con Marta y conocé cómo se mueve el pueblo.',target:'marta',reward:180},
    {id:'mandado',title:'EL MANDADO',text:'Marta necesita que acerques un paquete a la casa de Raúl.',target:'raul',reward:260},
    {id:'plaza',title:'DOS MINUTOS EN LA PLAZA',text:'Pasá por la plaza y charlá con Lucía.',target:'lucia',reward:220},
    {id:'changa',title:'UNA CHANGA',text:'Raúl necesita una mano con unos cajones en la chacra.',target:'job',reward:650},
    {id:'agua',title:'DONDE PASA EL AGUA',text:'Buscá a Pedro y preguntale por el canal de riego.',target:'pedro',reward:300},
    {id:'memoria',title:'UNA HISTORIA QUE QUEDÓ',text:'Encontrá una memoria del pueblo y escuchala con calma.',target:'history',reward:350},
    {id:'radio',title:'LA VOZ DEL PUEBLO',text:'Visitá la radio y hablá con Nico.',target:'nico',reward:450},
    {id:'fiesta',title:'SE VIENE LA FIESTA',text:'Ayudá a Inés a preparar algo para los vecinos.',target:'ines',reward:520},
    {id:'camino',title:'POR EL CAMINO RURAL',text:'Acompañá a Tomás hasta el puesto y volvé antes de que anochezca.',target:'tomas',reward:700},
    {id:'pueblo',title:'YA SOS PARTE',text:'Completá una última vuelta por el pueblo y decidí qué querés hacer.',target:'free',reward:1000}
  ],
  sides:[
    {id:'pan',npc:'marta',title:'PAN RECIÉN HECHO',text:'Marta te pide llevar dos panes a una vecina mayor.',need:'Compra: pan',reward:320,unlock:0},
    {id:'herramienta',npc:'raul',title:'LA HERRAMIENTA PERDIDA',text:'Raúl perdió una llave inglesa cerca del galpón.',need:'Llave inglesa',reward:480,unlock:2},
    {id:'gallinas',npc:'ines',title:'SE ESCAPARON LAS GALLINAS',text:'Tres gallinas se fueron para el lado de la plaza. Ayudá a encontrarlas.',reward:390,unlock:3},
    {id:'radio_recuerdo',npc:'nico',title:'UN MENSAJE PARA LA RADIO',text:'Nico quiere una historia corta de un vecino para el programa.',reward:420,unlock:5},
    {id:'mate',npc:'lucia',title:'MATE DE POR MEDIO',text:'Conseguí yerba y compartí un rato con Lucía en la plaza.',need:'Yerba',reward:280,unlock:2},
    {id:'caballo',npc:'pedro',title:'EL CABALLO INQUIETO',text:'Un caballo anda demasiado cerca del alambrado. Ayudá a Pedro a llevarlo de vuelta.',reward:560,unlock:4}
  ]
};
V.story=story;
function rel(id,n=1){story.rel[id]=(story.rel[id]||0)+n;return story.rel[id]}
function flag(k,v=true){story.flags[k]=v}
function say(name,lines,choices){
  let box=document.getElementById('v2dialog');
  if(!box){box=document.createElement('div');box.id='v2dialog';box.className='v2-dialog hidden';box.innerHTML='<div class="v2-dialog-inner"><div class="v2-speaker"></div><div class="v2-text"></div><div class="v2-choices"></div></div>';document.body.appendChild(box)}
  box.classList.remove('hidden');box.querySelector('.v2-speaker').textContent=name;box.querySelector('.v2-text').textContent=lines[0]||'';const text=box.querySelector('.v2-text');const ch=box.querySelector('.v2-choices');ch.innerHTML='';
  let i=0;const next=()=>{i++;if(i<lines.length){text.textContent=lines[i]}else close()};
  if(choices&&choices.length){choices.forEach(c=>{const b=document.createElement('button');b.textContent=c.label;b.onclick=()=>{if(c.action)c.action();if(c.lines)say(name,c.lines,c.after||null)};ch.appendChild(b)})}else{const b=document.createElement('button');b.textContent='Seguir charlando';b.onclick=next;ch.appendChild(b)}
  story.active={close};
  function close(){box.classList.add('hidden');story.active=null;if(typeof window.__v2StoryRefresh==='function')window.__v2StoryRefresh()}
}
function completeMain(){const m=story.missions[story.main];if(!m)return;S().money+=m.reward;flag('main_'+m.id);story.main=Math.min(story.main+1,story.missions.length-1);say('VILLA PELÓN',[`Listo. Sumaste $${m.reward}.`,`No todo en un pueblo se resuelve de golpe. A veces una cosa lleva a otra.`]);}
function completeSide(q){story.side[q.id]='done';S().money+=q.reward;flag('side_'+q.id);say('VILLA PELÓN',[`Ayudaste con: ${q.title}.`,`Te dieron $${q.reward}. Más importante: ahora hay una persona que te conoce un poco mejor.`])}
function activeSideFor(id){return story.sides.find(q=>q.npc===id&&story.main>=q.unlock&&!story.side[q.id])}
function npcDialog(n){const id=n.id,m=story.missions[story.main],side=activeSideFor(id);if(side){
  if(side.id==='pan'&&!S().inventory.includes('Compra: pan')){say('Marta',['Si vas para el almacén, ¿me traés dos panes? Después los llevo a doña Elvira.','No es urgente. Cuando puedas.'],[{label:'Dale, voy.',action:()=>{flag('pan_started');}}]);return}
  if(side.id==='herramienta'){say('Raúl',['Estoy buscando una llave inglesa. Creo que la dejé cerca del galpón.','Si la ves, dejámela ahí mismo.'],[{label:'La busco.',action:()=>{flag('tool_search')}}]);return}
  if(side.id==='gallinas'){say('Inés',['No sé cómo hicieron, pero se me escaparon las gallinas.','Una estaba cerca de la plaza. Si encontrás alguna, acercala al corral.'],[{label:'Voy a mirar.',action:()=>{flag('chicken_search')}}]);return}
  if(side.id==='radio_recuerdo'){say('Nico',['Hoy quiero contar algo que no salga en ningún diario.','Una historia sencilla de alguien del pueblo. ¿Conocés alguna?'],[{label:'Sí, tengo una.',action:()=>completeSide(side)},{label:'Ahora no.',action:()=>{}}]);return}
  if(side.id==='mate'&&!S().inventory.includes('Yerba')){say('Lucía',['Si pasás por el almacén, traé yerba.','Después nos sentamos un rato en la plaza. No hace falta hablar de nada importante.'],[{label:'Bueno.',action:()=>flag('mate_started')}]);return}
  if(side.id==='caballo'){say('Pedro',['Ese caballo está medio inquieto hoy.','Vamos despacio y lo llevamos para el corral.'],[{label:'Vamos.',action:()=>{flag('horse_started');completeSide(side)}}]);return}
  if(side.need&&S().inventory.includes(side.need))completeSide(side);
}
  if(m&&m.target===id){
    if(m.id==='bienvenida')say('Marta',['Buen día. ¿Recién llegás?','Acá pasa eso: uno sale a comprar pan y termina enterándose de media vida del pueblo.','Si necesitás algo, preguntá. En los pueblos chicos preguntar no cuesta nada.'],[{label:'¿Y qué hay para hacer?',action:()=>{rel(id,2);completeMain()}},{label:'Voy a dar una vuelta.',action:()=>{rel(id,1);completeMain()}}]);
    else if(m.id==='mandado')say('Marta',['¿Podés acercarle este paquete a Raúl? Vive cerca de la chacra.','No es nada raro, son unas cosas que dejó encargadas.'],[{label:'Sí, se lo llevo.',action:()=>{flag('package');completeMain()}}]);
    else if(m.id==='plaza')say('Lucía',['¿Viste cómo cambia la plaza según la hora?','A la mañana pasan chicos, después aparecen los grandes y a la tardecita se queda gente charlando.','Así es el pueblo. No parece que pase mucho, pero siempre pasa algo.'],[{label:'Me gusta esa calma.',action:()=>{rel(id,2);completeMain()}},{label:'¿Qué recordás de acá?',action:()=>{rel(id,1);completeMain()}}]);
    else if(m.id==='changa')say('Raúl',['Tengo unos cajones para mover. Nada complicado, pero solo me lleva más tiempo.','Si me das una mano, después arreglamos.'],[{label:'Vamos.',action:()=>{S().energy=Math.max(0,S().energy-12);completeMain()}}]);
    else if(m.id==='agua')say('Pedro',['El agua parece una cosa simple hasta que falta.','Acá muchas cosas cambiaron cuando el riego empezó a transformar estas tierras.','Si querés entender el pueblo, mirá por dónde corre el agua.'],[{label:'Quiero saber más.',action:()=>{flag('water_memory');completeMain()}},{label:'Después vuelvo.',action:()=>{}}]);
    else if(m.id==='memoria'){const h=(V.history||[]).find(x=>x.id==='riego'||x.id==='origen');if(h)say('Pedro',[h.text,'Eso está documentado. Lo demás que escuches por acá puede ser memoria de vecinos o ficción del juego.'],[{label:'Seguir la historia.',action:()=>completeMain()}]);}
    else if(m.id==='radio')say('Nico',['Ponete cómodo. La radio de pueblo tiene algo de eso: alguien llama por una cosa y termina contando otra.','Si alguna vez tenés una historia, una foto vieja o un dato, traelo.'],[{label:'Me gustaría colaborar.',action:()=>{rel(id,2);completeMain()}},{label:'Solo vine a escuchar.',action:()=>completeMain()}]);
    else if(m.id==='fiesta')say('Inés',['Estamos preparando algo sencillo para los vecinos.','No hace falta que sepas hacer de todo. Elegí una tarea y la hacemos.'],[{label:'Ayudo con las mesas.',action:()=>{flag('fiesta_help');completeMain()}},{label:'Ayudo con la comida.',action:()=>{flag('fiesta_food');completeMain()}}]);
    else if(m.id==='camino')say('Tomás',['Voy hasta el puesto. Si querés, vení conmigo.','No hay apuro. Por el camino se aprende más mirando que corriendo.'],[{label:'Te acompaño.',action:()=>{rel(id,2);completeMain()}},{label:'Voy después.',action:()=>{}}]);
    else if(m.id==='pueblo')say('Tomás',['Ya conocés bastante del pueblo.','Ahora no necesitás que nadie te diga qué hacer. Podés trabajar, hablar, explorar, ayudar o simplemente salir a caminar.'],[{label:'Quiero seguir explorando.',action:()=>{rel(id,1);completeMain()}}]);
    return true;
  }
  return false;
}
function buildingDialog(b){
  if(b.type==='shop')say('ALMACÉN EL ENCUENTRO',['Pasá tranquilo.','Pan, yerba, azúcar y algunas cosas para la casa.','¿Qué necesitás?'],[{label:'Comprar pan ($120)',action:()=>{if(S().money>=120){S().money-=120;if(!S().inventory.includes('Compra: pan'))S().inventory.push('Compra: pan');say('ALMACÉN',['Listo. Pan recién hecho.'])}else say('ALMACÉN',['Te faltan unos pesos.'])}},{label:'Comprar yerba ($180)',action:()=>{if(S().money>=180){S().money-=180;if(!S().inventory.includes('Yerba'))S().inventory.push('Yerba');say('ALMACÉN',['Listo. Yerba para el mate.'])}else say('ALMACÉN',['Con eso no alcanza.'])}}]);
  else if(b.type==='radio')say('RADIO OASIS',['La puerta está entreabierta. Adentro se escucha una voz hablando del tiempo.','En la mesa hay papeles, una taza de mate y una foto vieja del pueblo.']);
  else if(b.type==='school')say('ESCUELA',['A esta hora el edificio está tranquilo.','Hay dibujos, cuadernos y recuerdos de distintas generaciones.']);
  else if(b.type==='rural')say('GALPÓN RURAL',['Huele a madera, tierra y herramientas.','Hay cajones, una pala y cosas que alguien dejó preparadas para mañana.']);
  else if(b.type==='home')say('CASA',['Una casa sencilla. Se escucha el ruido de una radio de fondo.','No hace falta entrar en todas partes. Algunas historias se conocen desde la vereda.']);
  else say(b.label||'PUEBLO',['Un lugar más del pueblo. Acá siempre puede aparecer algo si volvés en otro momento.']);
}
function nearest(){const st=S();let best=null,bd=130;[...(V.npcs||[]),...(V.buildings||[])].forEach(o=>{const x=o.x+(o.w?o.w/2:0),y=o.y+(o.h?o.h/2:0),d=Math.hypot(st.x-x,st.y-y);if(d<bd){bd=d;best=o}});return best}
function interact(){const st=S();if(!st.started)return;if(story.active){story.active.close();return}const n=nearest();if(!n)return;if(n.id&&npcDialog(n))return;if(n.w){buildingDialog(n);return}}
function refresh(){const st=S();if(!st||!st.started)return;const m=story.missions[story.main];const qt=document.getElementById('questTitle'),qx=document.getElementById('questText');if(qt&&qx){qt.textContent='MISIÓN · '+m.title;qx.textContent=m.text}
  let hint=document.getElementById('storyHint');if(!hint){hint=document.createElement('div');hint.id='storyHint';document.getElementById('game')?.appendChild(hint)}const n=nearest();hint.textContent=n?(n.id?`E · hablar con ${n.name}`:`E · ${n.label||'interactuar'}`):'WASD / flechas · caminar   •   E · conversar';
}
window.__v2StoryRefresh=refresh;
let timer=0;function loop(){timer++;if(timer%8===0)refresh();requestAnimationFrame(loop)}
function boot(){document.addEventListener('keydown',e=>{if((e.key.toLowerCase()==='e'||e.key===' ')&&S()?.started){e.preventDefault();e.stopImmediatePropagation();interact()}},true);document.addEventListener('pointerdown',e=>{if(e.target?.id==='interact'&&S()?.started){e.preventDefault();e.stopImmediatePropagation();interact()}},true);loop()}
boot();
})();
