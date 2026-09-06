/* Villa Pelón V69 — capa de interacción territorial.
   No reemplaza el motor: lo conecta con objetos, zonas e inventario.
*/
(()=>{'use strict';const V=window.VillaPelon||(window.VillaPelon={});
const S={objects:[
 {id:'plaza',name:'Plaza',x:1160,y:430,zone:'pueblo',text:'El centro del pueblo: un lugar para encontrarse.'},
 {id:'escuela',name:'Escuela',x:580,y:420,zone:'pueblo',text:'Una escuela también guarda memoria de generaciones.'},
 {id:'radio',name:'Radio Oasis',x:1215,y:430,zone:'pueblo',text:'Una voz local puede convertirse en memoria colectiva.'},
 {id:'almacen',name:'Almacén',x:1650,y:440,zone:'pueblo',text:'Pan, yerba y provisiones: la vida cotidiana también cuenta una historia.'},
 {id:'galpon',name:'Galpón rural',x:2145,y:1025,zone:'rural',text:'Herramientas, máquinas y trabajo: acá empieza otra escala del territorio.'},
 {id:'bodega',name:'Bodega',x:2545,y:1230,zone:'rural',text:'La producción transformó el paisaje y la identidad del lugar.'},
 {id:'rio',name:'Río',x:3000,y:850,zone:'river',text:'El agua no es solamente paisaje: es una fuerza que organiza el territorio.'}
],near:null,lastMessage:''};V.interactions69=S;
function zone(x,y){const z=V.territory&&V.territory.zones;if(!z)return null;for(const k of Object.keys(z)){const a=z[k];if(x>=a.x&&x<=a.x+a.w&&y>=a.y&&y<=a.y+a.h)return k}return null}
function nearest(x,y){let best=null,bd=Infinity;for(const o of S.objects){const d=Math.hypot(x-o.x,y-o.y);if(d<bd&&d<95){bd=d;best=o}}return best}
function addItem(id,name,detail){const inv=(V.ui67&&V.ui67.inventory)||[];if(!inv.some(i=>typeof i==='string'&&i.indexOf(name)>=0)){inv.push(name+' — '+detail);if(V.ui67)V.ui67.inventory=inv;return true}return false}
function interact(){const g=V.gameState||null;const x=g?g.x:(V.player&&V.player.x);const y=g?g.y:(V.player&&V.player.y);if(!Number.isFinite(x)||!Number.isFinite(y))return;const o=nearest(x,y);if(!o)return;S.near=o;const gained=o.id==='escuela'?addItem('memoria_escuela','Recuerdo de la escuela','pista histórica'):o.id==='radio'?addItem('voz_local','Voz local','registro de la radio'):o.id==='rio'?addItem('agua_territorio','Agua del territorio','evidencia del paisaje'):false;S.lastMessage=gained?'Guardado en la mochila: '+o.name:o.text;show(S.lastMessage);if(V.audio&&V.audio.wind)V.audio.wind()}
function show(text){let d=document.getElementById('vp69-toast');if(!d){d=document.createElement('div');d.id='vp69-toast';document.body.appendChild(d)}d.textContent=text;d.classList.add('show');clearTimeout(d.__t);d.__t=setTimeout(()=>d.classList.remove('show'),3200)}
function install(){if(V.__v69Installed)return;V.__v69Installed=true;const css=document.createElement('style');css.textContent='#vp69-toast{position:fixed;left:50%;bottom:105px;transform:translateX(-50%) translateY(12px);opacity:0;pointer-events:none;max-width:min(720px,90vw);padding:13px 16px;background:rgba(20,27,21,.94);border:1px solid #b6a77c;color:#f3e8c9;font:14px monospace;text-align:center;transition:.18s;z-index:70}#vp69-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}';document.head.appendChild(css);const oldInteract=window.__villaPelonExternalInteract;window.__villaPelonExternalInteract=()=>{if(oldInteract)oldInteract();interact()};window.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='e'&&!e.repeat)interact()});window.addEventListener('villa-pelon-player-state',e=>{const d=e.detail||{};S.near=nearest(d.x,d.y)});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();V.interactionZone=zone;V.interact69=interact;
})();