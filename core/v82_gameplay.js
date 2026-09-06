/* Villa Pelón V82 — GAMEPLAY CORE
   Objetivo: una sola capa de progresión para exploración, misiones y descubrimientos.
   No reemplaza game.js: agrega sistemas sin crear un segundo motor de movimiento.
*/
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={});
 const VERSION='V82.0.0';
 const QUESTS=[
  {id:'q01',title:'Una voz del pueblo',kind:'exploration',text:'Conocé a un vecino y escuchá qué lugar considera importante.',steps:[{type:'talk',target:'Marta',label:'Hablá con Marta'}],reward:{money:300,item:'Recuerdo del pueblo'}},
  {id:'q02',title:'La primera pista',kind:'history',text:'Encontrá una pista y registrala en el Archivo de Memoria.',steps:[{type:'discover',target:'clue',label:'Encontrá una pista histórica'}],reward:{money:500,item:'Ficha de investigación'}},
  {id:'q03',title:'Agua que transforma',kind:'territory',text:'Visitá el canal de riego y observá cómo el agua organiza el territorio.',steps:[{type:'site',target:'canal',label:'Visitá el Canal de Riego'}],reward:{money:450,item:'Cuaderno de campo'}},
  {id:'q04',title:'Más allá del pueblo',kind:'exploration',text:'Llegá hasta el mirador y registrá el paisaje desde la meseta.',steps:[{type:'site',target:'mirador',label:'Llegá al Mirador de la Meseta'}],reward:{money:650,item:'Fotografía del paisaje'}}
 ];
 const ensure=()=>{const s=V.gameState;if(!s)return null;if(!Array.isArray(s.completedQuests))s.completedQuests=[];if(!Array.isArray(s.questProgress))s.questProgress=[];if(!Array.isArray(s.discoveries))s.discoveries=[];return s};
 const addItem=(x)=>{const s=ensure();if(s&&!s.inventory.includes(x))s.inventory.push(x)};
 const notify=(text)=>{let n=document.getElementById('vpToast');if(!n){n=document.createElement('div');n.id='vpToast';document.body.appendChild(n)}n.textContent=text;n.classList.add('show');clearTimeout(n._vp);n._vp=setTimeout(()=>n.classList.remove('show'),2200)};
 function active(){const s=ensure();return QUESTS.find(q=>!s.completedQuests.includes(q.id))||null}
 function completeStep(type,target){const s=ensure();const q=active();if(!q)return false;const step=q.steps.find(x=>x.type===type&&x.target===target);if(!step||s.questProgress.includes(q.id+':'+step.target))return false;s.questProgress.push(q.id+':'+step.target);const done=q.steps.every(x=>s.questProgress.includes(q.id+':'+x.target));if(done){s.completedQuests.push(q.id);s.money+=q.reward.money;addItem(q.reward.item);notify('Misión completada: '+q.title+' · +$'+q.reward.money);V.openDialogue?.('MISIÓN COMPLETADA',[q.title,q.text,'Recompensa: $'+q.reward.money+' · '+q.reward.item]);}return true}
 function discover(id,label){const s=ensure();if(!s.discoveries.includes(id)){s.discoveries.push(id);addItem(label||id);notify('Nuevo descubrimiento: '+(label||id));}return completeStep('discover',id)}
 function visitSite(id){const s=ensure();if(!s.discoveries.includes('site:'+id)){s.discoveries.push('site:'+id);notify('Lugar registrado en tu recorrido.')}return completeStep('site',id)}
 function talk(name){return completeStep('talk',name)}
 function hud(){const s=ensure();if(!s)return;const q=active();const el=document.getElementById('questText');if(el)el.textContent=q?q.title+' — '+q.steps.find(x=>!s.questProgress.includes(q.id+':'+x.target))?.label:q?'Exploración completada.': 'Territorio explorado.';const dc=document.getElementById('discoveryCount');if(dc)dc.textContent=s.discoveries.length}
 function wrap(){
   const oldOpen=V.openDialogue;
   if(!V.__v82wrapped && typeof oldOpen==='function'){
    V.openDialogue=function(speaker,lines){if(speaker==='Marta'||speaker==='Raúl'||speaker==='Lucía'||speaker==='Pedro'||speaker==='Nico')setTimeout(()=>talk(speaker),0);return oldOpen(speaker,lines)};
    V.__v82wrapped=true;
   }
 }
 function saveMigration(){const s=ensure();if(!s)return;s.schema=3;s.gameplayVersion=VERSION}
 function boot(){ensure();saveMigration();wrap();V.gameplay={version:VERSION,quests:QUESTS,active,completeStep,discover,visitSite,talk,hud};hud();setInterval(()=>{wrap();hud()},750);console.info('[Villa Pelón]',VERSION,'— gameplay core listo')}
 const wait=()=>{if(V.gameState&&V.worldAuthority){boot()}else setTimeout(wait,60)};wait();
})();
