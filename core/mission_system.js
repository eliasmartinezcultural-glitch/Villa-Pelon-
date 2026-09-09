/* VILLA PELÓN — MISSION CATALOG V90.3 */
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={}),M=V.missions=V.missions||{};M.version='90.3';
 M.list=[
 {id:'welcome',chapter:'PUEBLO',title:'Conocé Villa Pelón',description:'Empezá a recorrer el pueblo y conocé a alguien.',objectives:[{id:'talk_marta',type:'talk',target:'marta',label:'Hablá con Marta'},{id:'plaza',type:'reach',target:'plaza',label:'Recorré la plaza'}],reward:500,next:'memory_01'},
 {id:'memory_01',chapter:'MEMORIA',title:'Una pista del pueblo',description:'Encontrá una primera pista para abrir el camino de la memoria.',objectives:[{id:'clue',type:'collect',target:'historic_clue',label:'Encontrá la pista histórica'}],reward:2500,next:'community_01'},
 {id:'community_01',chapter:'COMUNIDAD',title:'Las voces del pueblo',description:'Conocé dos voces de la comunidad.',objectives:[{id:'talk_nico',type:'talk',target:'nico',label:'Hablá con Nico'},{id:'talk_lucia',type:'talk',target:'lucia',label:'Hablá con Lucía'}],reward:1800,next:'rural_01'},
 {id:'rural_01',chapter:'TERRITORIO',title:'Del pueblo a la chacra',description:'Salí del núcleo urbano y conocé el sector rural.',objectives:[{id:'rural',type:'reach',target:'rural',label:'Llegá al sector rural'},{id:'talk_elena',type:'talk',target:'elena',label:'Hablá con Elena'}],reward:2200,next:'winery_01'},
 {id:'winery_01',chapter:'PRODUCCIÓN',title:'El valle productivo',description:'Explorá el área de bodegas y conocé a Tomás.',objectives:[{id:'winery',type:'reach',target:'winery',label:'Llegá al área de bodegas'},{id:'talk_tomas',type:'talk',target:'tomas',label:'Hablá con Tomás'}],reward:3000,next:'picada21_intro'},
 {id:'picada21_intro',chapter:'TERRITORIO',title:'Camino a Picada 21',description:'Seguí el camino rural y reconocé la conexión entre el pueblo y Picada 21.',objectives:[{id:'picada',type:'reach',target:'picada21',label:'Llegá a Picada 21'},{id:'stop',type:'inspect',target:'picada21_stop',label:'Inspeccioná la parada'}],reward:3500,next:'free_explore'},
 {id:'free_explore',chapter:'LIBRE',title:'Villa Pelón abierta',description:'La ruta principal ya está recorrida. Ahora podés explorar libremente.',objectives:[],reward:0,next:null}
 ];
 M.ensure=s=>{s.missionId=s.missionId||'welcome';s.missionStep=Number.isFinite(+s.missionStep)?Math.max(0,+s.missionStep):0;s.missionFlags=s.missionFlags&&typeof s.missionFlags==='object'?s.missionFlags:{};s.missionHistory=Array.isArray(s.missionHistory)?s.missionHistory:[]};
 M.current=s=>{M.ensure(s);return M.list.find(x=>x.id===s.missionId)||M.list[0]};M.objective=s=>M.current(s).objectives[s.missionStep]||null;
 M.completeStep=(s,key)=>{M.ensure(s);const m=M.current(s),o=M.objective(s);if(!o||o.type+':'+o.target!==key)return false;s.missionStep++;if(s.missionStep>=m.objectives.length){s.money=(+s.money||0)+(+m.reward||0);s.missionFlags[m.id]=true;s.missionHistory.push({id:m.id,title:m.title,day:s.day||1,reward:m.reward||0});const next=m.next;s.missionId=next||m.id;s.missionStep=0;return{complete:true,reward:m.reward||0,mission:m.title,next}}return{complete:false}};
 M.status=s=>{const m=M.current(s),o=M.objective(s);return{id:m.id,chapter:m.chapter,title:m.title,description:m.description,step:s.missionStep,total:m.objectives.length,objective:o?.label||'Exploración libre',reward:m.reward||0,history:s.missionHistory.length}};
})();
