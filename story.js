/* Villa Pelón V2 — director narrativo único.
   Misiones, conversaciones, secundarios, relaciones y progreso.
   La ficción jugable se mantiene separada de los datos históricos documentados. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=()=>V.state||{};
const story={
  main:0,side:{},flags:{},rel:{},active:false,
  missions:[
    {id:'bienvenida',title:'UN DÍA CUALQUIERA',text:'Hablá con Marta en el almacén.',target:'marta',reward:180},
    {id:'mandado',title:'EL MANDADO',text:'Llevále a Raúl el paquete que te dio Marta.',target:'raul',reward:260},
    {id:'plaza',title:'DOS MINUTOS EN LA PLAZA',text:'Pasá por la plaza y charlá con Lucía.',target:'lucia',reward:220},
    {id:'changa',title:'UNA CHANGA',text:'Hacé una tarea en la chacra.',target:'job',reward:650},
    {id:'agua',title:'DONDE PASA EL AGUA',text:'Buscá a Pedro y preguntale por el riego.',target:'pedro',reward:300},
    {id:'memoria',title:'UNA HISTORIA QUE QUEDÓ',text:'Encontrá una memoria documentada del pueblo.',target:'history',reward:350},
    {id:'radio',title:'LA VOZ DEL PUEBLO',text:'Visitá Radio Oasis y hablá con Nico.',target:'nico',reward:450},
    {id:'fiesta',title:'SE VIENE LA FIESTA',text:'Ayudá a Inés con la preparación para los vecinos.',target:'ines',reward:520},
    {id:'camino',title:'EL CAMINO RURAL',text:'Acompañá a Tomás hasta el puesto.',target:'tomas',reward:700},
    {id:'pueblo',title:'YA SOS PARTE',text:'Ahora el pueblo queda abierto: trabajo, vecinos, campo o aventuras.',target:'free',reward:1000}
  ],
  sides:[
    {id:'pan',npc:'marta',title:'PAN RECIÉN HECHO',text:'Comprá pan y lleváselo a doña Elvira.',unlock:1,reward:320},
    {id:'herramienta',npc:'raul',title:'LA HERRAMIENTA PERDIDA',text:'Buscá la llave inglesa cerca del galpón.',unlock:2,reward:480},
    {id:'mate',npc:'lucia',title:'MATE DE POR MEDIO',text:'Conseguí yerba y compartí un rato en la plaza.',unlock:2,reward:280},
    {id:'gallinas',npc:'ines',title:'SE ESCAPARON LAS GALLINAS',text:'Encontrá las tres gallinas que se fueron hacia la plaza.',unlock:3,reward:390},
    {id:'caballo',npc:'pedro',title:'EL CABALLO INQUIETO',text:'Ayudá a Pedro a llevar el caballo al corral.',unlock:4,reward:560},
    {id:'radio_recuerdo',npc:'nico',title:'UN MENSAJE PARA LA RADIO',text:'Contale a Nico una historia sencilla de un vecino.',unlock:5,reward:420}
  ]
};
V.story=story;
V.storyJob={x:2530,y:820};
V.historySpots=V.historySpots||[{x:2220,y:500,id:'origen'},{x:2700,y:1320,id:'riego'},{x:3320,y:1130,id:'vinos'}];
const say=(name,lines,choices)=>{
  let box=document.getElementById('v2dialog');
  if(!box){box=document.createElement('div');box.id='v2dialog';box.className='v2-dialog hidden';box.innerHTML='<div class="v2-dialog-inner"><div class="v2-speaker"></div><div class="v2-text"></div><div class="v2-choices"></div></div>';document.body.appendChild(box)}
  box.classList.remove('hidden');const sp=box.querySelector('.v2-speaker'),tx=box.querySelector('.v2-text'),ch=box.querySelector('.v2-choices');
  sp.textContent=name;tx.textContent=lines[0]||'';ch.innerHTML='';story.active=true;if(S())S().dialogue=true;let i=0;
  const close=()=>{box.classList.add('hidden');story.active=false;if(S())S().dialogue=false;refresh()};
  if(choices&&choices.length){choices.forEach(c=>{const b=document.createElement('button');b.textContent=c.label;b.onclick=()=>{if(c.action)c.action();if(c.lines)say(name,c.lines,c.after);else if(c.close!==false)close()};ch.appendChild(b)})}
  else{const b=document.createElement('button');b.textContent='Seguir';b.onclick=()=>{i++;if(i<lines.length)tx.textContent=lines[i];else close()};ch.appendChild(b)}
};
function rel(id,n=1){story.rel[id]=(story.rel[id]||0)+n}
function flag(k,v=true){story.flags[k]=v}
function storyData(){return{main:story.main,side:story.side,flags:story.flags,rel:story.rel}}
function save(){try{const data=storyData();localStorage.setItem('villa_pelon_v2_story',JSON.stringify(data));const old=JSON.parse(localStorage.getItem('villa_pelon_v2_save')||'{}');old.story=data;localStorage.setItem('villa_pelon_v2_save',JSON.stringify(old))}catch(_){} }
function load(){try{const a=JSON.parse(localStorage.getItem('villa_pelon_v2_story')||'null');const b=JSON.parse(localStorage.getItem('villa_pelon_v2_save')||'null');const x=a||b?.story;if(x){story.main=Math.max(0,Math.min(Number(x.main)||0,story.missions.length-1));story.side=x.side||{};story.flags=x.flags||{};story.rel=x.rel||{}}}catch(_){} }
load();
function refresh(){const q=story.missions[story.main]||story.missions.at(-1);const title=document.getElementById('questTitle'),text=document.getElementById('questText');if(title)title.textContent=story.main===story.missions.length-1?'MUNDO ABIERTO':'MISIÓN · '+q.title;if(text)text.textContent=q.text;if(S())S().mission=story.main;if(typeof window.__v2StoryRefresh==='function')window.__v2StoryRefresh()}
function reward(){const q=story.missions[story.main];if(!q||story.main>=story.missions.length-1||story.flags['main_'+q.id])return;S().money=(S().money||0)+q.reward;flag('main_'+q.id);story.main++;save();say('VILLA PELÓN',[`Listo. Sumaste $${q.reward}.`,'En un pueblo chico una cosa suele llevar a otra.']);refresh()}
function finishSide(q){if(!q||story.side[q.id]==='done')return;story.side[q.id]='done';S().money=(S().money||0)+q.reward;rel(q.npc,1);flag('side_'+q.id);save();say('VILLA PELÓN',[`Ayudaste con ${q.title.toLowerCase()}.`,`Te dieron $${q.reward}.`])}
function side(q){if(!q||story.side[q.id]==='done')return false;const inv=S().inventory||[];
 if(q.id==='pan'){if(!inv.includes('Compra: pan'))say('Marta',['Si vas para el almacén, ¿me traés pan? Después se lo llevo a doña Elvira.','No es urgente. Cuando puedas.'],[{label:'Dale.',action:()=>flag('pan_started'),close:false}]);else finishSide(q);return true}
 if(q.id==='mate'){if(!inv.includes('Yerba'))say('Lucía',['Si pasás por el almacén, traé yerba.','Después nos sentamos un rato en la plaza.'],[{label:'Bueno.',action:()=>flag('mate_started'),close:false}]);else finishSide(q);return true}
 if(q.id==='herramienta'){if(!story.flags.tool_found)say('Raúl',['Perdí una llave inglesa cerca del galpón.','Si la encontrás, dejámela ahí.'],[{label:'La busco.',action:()=>flag('tool_search'),close:false}]);else finishSide(q);return true}
 if(q.id==='gallinas'){if((story.flags.chickens||0)>=3)finishSide(q);else say('Inés',['Se me escaparon tres gallinas. Una quedó cerca de la plaza.','Buscá las otras dos por el camino de las casas.'],[{label:'Voy a buscarlas.',action:()=>flag('chicken_search'),close:false}]);return true}
 if(q.id==='caballo'){if(story.flags.horse_done)finishSide(q);else say('Pedro',['Ese caballo está medio inquieto.','Vamos despacio y lo llevamos para el corral.'],[{label:'Vamos.',action:()=>{flag('horse_done');finishSide(q)}}]);return true}
 if(q.id==='radio_recuerdo'){say('Nico',['Hoy quiero contar una historia que no salga en ningún diario.','Algo sencillo: un vecino, una familia, una costumbre.'],[{label:'Tengo una historia.',action:()=>finishSide(q)},{label:'Después te cuento.',close:false}]);return true}
 return false}
function main(n){const q=story.missions[story.main];if(!q)return false;
 if(q.id==='mandado'&&n.id==='raul'){if(!story.flags.package_delivered){say('Raúl',['¿Venís por lo que mandó Marta?','Ah, perfecto. Dejámelo acá.'],[{label:'Sí, es esto.',action:()=>{flag('package_delivered');reward()}}])}return true}
 if(q.target!==n.id)return false;
 const d={
  bienvenida:['Marta',['Buen día. ¿Recién llegás?','Acá uno sale por una cosa y termina enterándose de media vida del pueblo.'],[['¿Qué hay para hacer?',2],['Voy a dar una vuelta.',1]]],
  plaza:['Lucía',['¿Viste cómo cambia la plaza según la hora?','A la mañana pasan chicos; a la tarde aparecen los grandes y siempre alguien se queda charlando.'],[['Me gusta esa calma.',2],['¿Qué recordás de acá?',1]]],
  agua:['Pedro',['El agua parece una cosa simple hasta que falta.','Cuando el riego empezó a transformar estas tierras, cambió mucho más que el paisaje.'],[['Quiero saber más.',2],['Después vuelvo.',0]]],
  radio:['Nico',['Ponete cómodo. La radio de pueblo es así: alguien llama por una cosa y termina contando otra.','Si alguna vez tenés una historia o una foto vieja, traela.'],[['Me gustaría colaborar.',2],['Solo vine a escuchar.',1]]],
  fiesta:['Inés',['Estamos preparando algo para los vecinos.','No hace falta saber de todo. Elegí una tarea y la hacemos.'],[['Ayudo con las mesas.',2],['Ayudo con la comida.',2]]],
  camino:['Tomás',['Voy hasta el puesto. Si querés, vení conmigo.','No hay apuro. Por el camino se aprende más mirando que corriendo.'],[['Te acompaño.',2],['Voy después.',0]]],
  pueblo:['Tomás',['Ya conocés bastante del pueblo.','Ahora nadie tiene que decirte qué hacer. El mundo queda abierto.'],[['Quiero seguir explorando.',1]]]
 }[q.id];
 if(d){const choices=d[2].map(c=>({label:c[0],action:()=>{if(c[1])rel(n.id,c[1]);if(q.id==='bienvenida')flag('package');if(q.id==='fiesta')flag(c[0].includes('mesas')?'fiesta_help':'fiesta_food');if(q.id==='agua')flag('water_memory');reward()}}));say(d[0],d[1],choices);return true}
 if(q.id==='changa')return job();if(q.id==='memoria')return history();return false}
function job(){const q=story.missions[story.main];if(q?.id!=='changa'){say('GALPÓN RURAL',['Hay cajones, herramientas y trabajo para distintos días.']);return true}if((S().energy||0)<20){say('CHACRA',['Estás cansado. Descansá y volvé.']);return true}S().energy-=20;S().money=(S().money||0)+650;S().inventory=S().inventory||[];if(!S().inventory.includes('Cajón de cosecha'))S().inventory.push('Cajón de cosecha');reward();return true}
function history(){const hs=V.history||[];const h=hs.find(x=>!story.flags['hist_'+x.id])||hs[0];if(!h)return true;say('MEMORIA · '+h.title,[h.text,'DATO DOCUMENTADO. La ficción del juego se mantiene separada de esta fuente.'],[{label:'Guardar esta memoria.',action:()=>{flag('hist_'+h.id);S().history=S().history||[];if(!S().history.includes(h.id))S().history.push(h.id);reward()}}]);return true}
function shop(b){const inv=S().inventory||(S().inventory=[]);say('ALMACÉN EL ENCUENTRO',['Pasá tranquilo.','Pan, yerba, azúcar y algunas cosas para la casa.'],[{label:'Comprar pan ($120)',action:()=>{if(S().money>=120){S().money-=120;if(!inv.includes('Compra: pan'))inv.push('Compra: pan');say('ALMACÉN',['Listo. Pan recién hecho.'])}else say('ALMACÉN',['No te alcanza.'])}},{label:'Comprar yerba ($180)',action:()=>{if(S().money>=180){S().money-=180;if(!inv.includes('Yerba'))inv.push('Yerba');say('ALMACÉN',['Listo. Yerba para el mate.'])}else say('ALMACÉN',['No te alcanza.'])}},{label:'Solo charlar',action:()=>say('Marta',['Quedate un rato si querés. Acá las compras son la excusa.'])}]);return true}
function building(b){const lines={school:['ESCUELA',['A esta hora está tranquila. Hay dibujos, cuadernos y recuerdos de distintas generaciones.']],radio:['RADIO OASIS',['Adentro hay papeles, una taza de mate y una foto vieja del pueblo.']],home:['CASA',['Una casa sencilla. Podés descansar y recuperar energía.']],rural:[b.label||'GALPÓN',['Hay herramientas, cajones y tareas para distintos días.']]};const d=lines[b.type];if(d)say(d[0],d[1]);else say(b.label||'PUEBLO',['Un lugar más del pueblo.']);return true}
function nearest(){const p=S();let best=null,bd=155;const arr=[...(V.npcs||[]),...(V.buildings||[]),...(V.historySpots||[]),V.storyJob].filter(Boolean);
 if(story.flags.tool_search&&!story.flags.tool_found)arr.push({id:'story_tool',x:2460,y:1210});
 if(story.flags.chicken_search){[[1030,690],[1210,620],[1340,760]].forEach((v,i)=>{if((story.flags.chickens||0)<=i)arr.push({id:'story_chicken_'+i,x:v[0],y:v[1]})})}
 arr.forEach(o=>{const x=o.x+(o.w?o.w/2:0),y=o.y+(o.h?o.h/2:0),d=Math.hypot(p.x-x,p.y-y);if(d<bd){bd=d;best=o}});return best}
function interact(){if(!S().started||story.active)return true;const n=nearest();if(!n)return true;
 if(n.id==='story_tool'){flag('tool_found');save();say('HERRAMIENTA',['Encontraste la llave inglesa. Volvé con Raúl.']);return true}
 if(n.id&&n.id.startsWith('story_chicken_')){const found=story.flags.chickens||0;story.flags.chickens=found+1;save();say('GALLINA',['La encontraste. Ya van '+story.flags.chickens+' de 3.']);return true}
 if(V.historySpots.includes(n))return history();
 if(n.id){if(main(n))return true;const q=story.sides.find(x=>x.npc===n.id&&story.main>=x.unlock&&!story.side[x.id]);if(q)return side(q);ambient(n);return true}
 if(n===V.storyJob)return job();if(n.type==='shop')return shop(n);if(n.type==='home'){S().energy=Math.min(100,(S().energy||0)+35);S().minutes=(S().minutes||0)+30;say('CASA',['Descansaste un rato. Afuera, el pueblo siguió con lo suyo.']);return true}return building(n)}
function ambient(n){const h=Math.floor((S().minutes||480)/60)%24;const lines={marta:h<12?['¿Ya arrancaste el día? A esta hora el almacén está tranquilo.']:['Qué día largo. A esta hora uno ya piensa en sentarse a tomar mate.'],raul:['Hoy la tierra está pidiendo agua. Mañana vemos cómo quedó la chacra.'],lucia:['Siempre termina apareciendo alguna historia.'],pedro:['El campo tiene sus tiempos.'],nico:['Una radio de pueblo nunca se queda sin cosas para contar.'],ines:['Acá uno se cruza con todo el mundo.'],tomas:['¿Viste los cerros con esta luz?']};say(n.name,lines[n.id]||['Qué lindo día para caminar.'])}
function intercept(e){const k=(e.key||'').toLowerCase();if(k==='e'||k===' '){e.preventDefault();e.stopImmediatePropagation();if(story.active){const b=document.querySelector('#v2dialog button');if(b)b.click()}else interact()}}
addEventListener('keydown',intercept,true);
const ib=document.getElementById('interact');if(ib)ib.addEventListener('pointerdown',e=>{e.preventDefault();e.stopImmediatePropagation();if(story.active){const b=document.querySelector('#v2dialog button');if(b)b.click()}else interact()},true);
const sb=document.getElementById('save');if(sb)sb.addEventListener('pointerdown',e=>{e.preventDefault();e.stopImmediatePropagation();save();S().saved=true;setTimeout(()=>{S().saved=false;refresh()},1400)},true);
setInterval(refresh,250);refresh();
})();
