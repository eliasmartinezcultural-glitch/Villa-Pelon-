/* Villa Pelón V5 — NPC LIFE SYSTEM
   Cada vecino tiene identidad, rutina, memoria, estado de ánimo, relaciones,
   acciones y conocimiento del pueblo. No crea motor ni RAF.
   Estética: personajes expresivos de animación cinematográfica reinterpretados
   en pixel art 16-bit, sin depender de assets externos.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const N=V.npcLifeV5={version:1,enabled:true,profiles:7,memory:true,routines:true,actions:true,relationships:true,pixelCharacterLook:true};
const state=()=>V.state||(V.state={});
const weather=()=>String(V.life?.weather||'Despejado').toLowerCase();
const W={
 marta:{home:{x:820,y:540},work:{x:1910,y:650},color:'#a95745',occupation:'almacenera',likes:['mate','charlar','ordenar el almacén'],rumors:['Hoy vi pasar a un trabajador rumbo a las chacras.','En el almacén siempre aparece alguna historia nueva.'],knowledge:['la vida cotidiana','el comercio del pueblo','los cambios del barrio'],traits:['solidaria','observadora','conversadora'],schedule:[['08','19','work'],['19','21','plaza'],['21','24','home'],['00','08','home']]},
 raul:{home:{x:1560,y:980},work:{x:2540,y:1420},color:'#557ca8',occupation:'trabajador rural',likes:['chacra','herramientas','mate'],rumors:['El riego cambia todo cuando llega la temporada fuerte.','En el campo cada tarea tiene su momento.'],knowledge:['riego','producción','trabajo rural'],traits:['práctico','reservado','trabajador'],schedule:[['07','17','work'],['17','20','rural'],['20','24','home'],['00','07','home']]},
 lucia:{home:{x:820,y:540},work:{x:1250,y:350},color:'#a55e8f',occupation:'docente',likes:['escuela','libros','familias'],rumors:['La escuela conserva recuerdos que no aparecen en los mapas.','Hay chicos que vienen de familias ligadas a las chacras.'],knowledge:['Escuela 273','educación','memoria comunitaria'],traits:['curiosa','paciente','atenta'],schedule:[['08','14','work'],['14','17','home'],['17','20','plaza'],['20','24','home'],['00','08','home']]},
 pedro:{home:{x:1560,y:980},work:{x:2480,y:1510},color:'#bd8249',occupation:'productor',likes:['viñedos','pelón','herramientas'],rumors:['La producción transformó este paisaje.','Hay historias de las primeras chacras que vale la pena recuperar.'],knowledge:['producción','fruticultura','vitivinicultura'],traits:['serio','generoso','experimentado'],schedule:[['06','16','work'],['16','19','rural'],['19','22','plaza'],['22','24','home'],['00','06','home']]},
 nico:{home:{x:1560,y:980},work:{x:1360,y:1540},color:'#5d8d59',occupation:'radio',likes:['radio','historias','música'],rumors:['Una voz puede guardar la memoria de un pueblo.','Siempre hay alguien que recuerda algo que otro olvidó.'],knowledge:['radio','memoria oral','actualidad'],traits:['sociable','curioso','rápido'],schedule:[['10','18','work'],['18','21','plaza'],['21','24','home'],['00','10','home']]},
 ines:{home:{x:820,y:540},work:{x:1120,y:720},color:'#8c6aa0',occupation:'vecina',likes:['compras','mate','plaza'],rumors:['Las novedades corren rápido por acá.','La gente se cruza y termina hablando de todo.'],knowledge:['vida cotidiana','vecindario','comercio'],traits:['amable','habladora','atenta'],schedule:[['08','13','work'],['13','16','home'],['16','20','plaza'],['20','24','home'],['00','08','home']]},
 tomas:{home:{x:820,y:540},work:{x:980,y:900},color:'#6d8d57',occupation:'estudiante',likes:['bicicleta','plaza','explorar'],rumors:['Siempre hay algo nuevo si caminás un poco más.','A veces los grandes cuentan historias distintas sobre el mismo lugar.'],knowledge:['plaza','escuela','calles'],traits:['inquieto','curioso','entusiasta'],schedule:[['08','13','work'],['13','17','home'],['17','21','plaza'],['21','24','home'],['00','08','home']]}
};
function hour(){return (Number(state().minutes||480)/60)%24}
function hnum(s){const [h,m]=String(s).split(':').map(Number);return h+(m||0)/60}
function between(h,a,b){const A=hnum(a),B=hnum(b);return A<=B?h>=A&&h<B:h>=A||h<B}
function profile(n){return W[n.id]||W[String(n.name||'').toLowerCase()]||null}
function mood(n){const s=state(),p=profile(n),w=weather();let m='neutral';if((s.energy||100)<30)m='tired';if(w.includes('lluv'))m='thoughtful';if(w.includes('viento'))m='restless';if(n.brain?.lastTalkDay===s.day)m='happy';if(p?.traits?.includes('serio')&&m==='neutral')m='serious';return m}
function relationship(n){const s=state();s.relationships=s.relationships||{};const r=s.relationships[n.id];return typeof r==='number'?r:(r?.points||0)}
function memory(n){const s=state();s.npcMemory=s.npcMemory||{};return s.npcMemory[n.id]||{talks:0,topics:[],met:false,days:[]}}
function remember(n,topic){const s=state(),m=memory(n);m.met=true;m.talks++;m.topics=Array.from(new Set([...(m.topics||[]),topic])).slice(-12);m.days=Array.from(new Set([...(m.days||[]),s.day])).slice(-8);s.npcMemory[n.id]=m;s.relationships=s.relationships||{};s.relationships[n.id]=relationship(n)+1}
function activity(n){const p=profile(n);if(!p)return 'home';const h=hour();for(const row of p.schedule)if(between(h,row[0],row[1]))return row[2];return 'home'}
function targetFor(n,a){const p=profile(n);if(!p)return n.home;switch(a){case'work':return p.work;case'plaza':return {x:1100,y:760};case'rural':return n.id==='raul'?{x:2540,y:1420}:n.id==='pedro'?{x:2480,y:1510}:{x:2360,y:1100};case'home':default:return p.home}}
function applyRoutine(n){const a=activity(n),t=targetFor(n,a);if(t){n.work=t;n.brain=n.brain||{};n.brain.activity=a;n.brain.target={x:t.x,y:t.y};n.brain.mood=mood(n)}return a}
function context(n){const a=activity(n),w=weather(),h=Math.floor(hour());let place={work:'en su trabajo',plaza:'en la plaza',rural:'en la zona rural',home:'en casa'}[a]||'por el pueblo';return {a,w,h,place}}
function lines(n){const p=profile(n),c=context(n),m=memory(n),r=relationship(n),s=state();if(!p)return n.lines||['Buen día.'];let out=[];
 if(!m.met)out.push(`Hola, soy ${n.name}. ¿Cómo estás? No te había visto por acá.`);
 else if(m.days?.includes(s.day))out.push(r>=4?`Qué bueno verte otra vez. Ya nos vamos conociendo.`:`Otra vez por acá. ¿Qué andás buscando?`);
 else out.push(`Buen día. Hoy ando ${c.place}.`);
 if(c.w.includes('lluv'))out.push('Con esta lluvia cambia el ritmo del pueblo, pero siempre hay algo para hacer.');
 else if(c.w.includes('viento'))out.push('Hay bastante viento hoy. En la zona rural se siente enseguida.');
 else if(c.w.includes('nubl'))out.push('Está nublado. Ideal para caminar y mirar con calma.');
 if(n.id==='marta')out.push(r>=3?'Si necesitás algo, decime. Ya sabés que acá se conversa de todo.':p.rumors[0]);
 else if(n.id==='raul')out.push(r>=3?'Si querés conocer de verdad el pueblo, mirá cómo se trabaja la tierra.':p.rumors[0]);
 else if(n.id==='lucia')out.push(r>=3?'Cuando quieras, podemos hablar de la Escuela 273 y de las familias que pasaron por ella.':p.rumors[0]);
 else if(n.id==='pedro')out.push(r>=3?'La producción tiene muchas historias. Algunas todavía las cuentan los que estuvieron desde el principio.':p.rumors[0]);
 else if(n.id==='nico')out.push(r>=3?'Si encontrás una foto o un testimonio, traémelo. La memoria oral también importa.':p.rumors[0]);
 else out.push(r>=3?p.rumors[1]:`Yo suelo fijarme en ${p.knowledge[0]}.`);
 if(s.mission>=5&&p.knowledge.length)out.push(`Si estás investigando la historia, puedo hablarte de ${p.knowledge[0]}.`);
 if(r>=7)out.push(`Te cuento algo que casi no digo: me gusta ${p.likes[0]}.`);
 return out.slice(0,4)}
function onTalk(n){if(!n)return;remember(n,profile(n)?.knowledge?.[0]||'vida cotidiana');n.brain=n.brain||{};n.brain.lastTalkDay=state().day;n.brain.mood='happy';n.lines=lines(n);V.v4?.emit?.('npc_talk',{npc:n.id,day:state().day,relationship:relationship(n)});return n.lines}
function update(dt){for(const n of(V.npcs||[])){const a=applyRoutine(n);n.brain=n.brain||{};n.brain.actionClock=(n.brain.actionClock||0)+dt;if(n.brain.actionClock>5){n.brain.actionClock=0;n.brain.action=['caminar','trabajar','charlar','mirar','descansar'][Math.floor((n.appearanceSeed||0+Math.floor(hour()))%5)]}n.expression=mood(n)==='happy'?'happy':mood(n)==='serious'?'serious':mood(n)==='tired'?'tired':'neutral';if(!Array.isArray(n.memoryTopics))n.memoryTopics=[];n.memoryTopics=memory(n).topics||[]}}
function install(){if(!V.life||V.life.__v5NpcWrapped)return;if(typeof V.life.update==='function'){const old=V.life.update;V.life.update=function(dt,...args){const r=old.call(this,dt,...args);update(dt);return r};V.life.__v5NpcWrapped=true}for(const n of(V.npcs||[])){n.brain=n.brain||{};n.lines=lines(n);n.v5Profile=profile(n)?'cinematic-pixel':'standard'}}
function drawEnhance(ctx,n){if(!n||!ctx)return;const now=performance.now();const bob=n.moving?Math.sin(now/110+(n.appearanceSeed||0))*1.4:0;ctx.save();ctx.translate(n.x,n.y+bob);ctx.imageSmoothingEnabled=false;
 // Detalles pixel-art expresivos: ojos con brillo, mejillas, cabello iluminado, insignias y objetos de actividad.
 const s=n.height||1;ctx.scale(s,s);const head=n.age<16?11:n.age>60?14:13;
 ctx.fillStyle='rgba(255,248,225,.72)';ctx.fillRect(-7,-32,3,2);ctx.fillRect(4,-32,3,2);
 ctx.fillStyle='rgba(255,170,150,.28)';ctx.fillRect(-head+2,-25,4,2);ctx.fillRect(head-6,-25,4,2);
 ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(-9,-41,18,2);
 const a=n.brain?.activity;if(a==='work'||a==='rural'){ctx.fillStyle='#ead39b';ctx.fillRect(10,-4,5,7)}else if(a==='plaza'){ctx.fillStyle='#e0bc4d';ctx.fillRect(-3,48,6,3)}else if(a==='home'){ctx.fillStyle='#6b5742';ctx.fillRect(-16,2,4,7)}
 if(n.brain?.action==='charlar'){ctx.fillStyle='#fff';ctx.fillRect(17,-47,3,3);ctx.fillRect(22,-44,2,2)}
 ctx.restore()}
N.profile=profile;N.lines=lines;N.onTalk=onTalk;N.update=update;N.remember=remember;N.relationship=relationship;N.memory=memory;N.install=install;
install();
V.v4?.register?.('npcLifeV5',N);
})();