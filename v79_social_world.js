/* Villa Pelón V79 — mundo social y espacial integrado.
   Conecta agenda, ubicación, conversación y memoria sin duplicar el motor principal.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S={version:'V79.1',lastPlayer:null,lastNpc:null,nearby:null};
const POINTS={casa:[900,575],plaza:[1160,430],escuela:[580,420],almacen:[1650,440],radio:[1215,430],chacra:[2145,1025],galpon:[2145,430],bodega:[2380,1130]};
const LINES={
 Marta:{'en casa':'Estoy ordenando unas cosas. Después me toca el almacén.','trabajando en el almacén':'Acá se cruza todo el pueblo: compras, noticias y conversaciones.','almuerzo y mandados':'Siempre aparece algún mandado cuando uno sale.','vuelta a casa':'Ya va siendo hora de volver.','resguardado por la lluvia':'Con esta lluvia, mejor esperar bajo techo.'},
 Raúl:{'en casa':'Temprano salgo para la chacra.','trabajando en la chacra':'La chacra tiene otro reloj. El agua y la temporada mandan.','descanso':'Un rato de descanso y seguimos.','regreso y mandados':'Antes de volver siempre aparece algún mandado.','resguardado por la lluvia':'Cuando llueve fuerte, el campo obliga a cambiar los planes.'},
 Lucía:{'en casa':'Hoy también hay cosas que hacer en la escuela.','trabajando en la escuela':'La escuela conserva muchas historias del pueblo.','tareas de la escuela':'Siempre aparece alguna foto o papel que merece ser guardado.','en la plaza':'La plaza es un buen lugar para encontrarse.','resguardado por la lluvia':'La lluvia cambia el movimiento de todo el pueblo.'},
 Pedro:{'en casa':'En un rato salgo para el campo.','trabajando en el campo':'Acá se aprende mirando la tierra todos los días.','descanso':'Hay que parar un rato para poder seguir.','regreso':'El día rural empieza temprano y termina cuando baja el sol.'},
 Nico:{'en casa':'Después paso por la radio.','en la radio':'Una voz puede conectar lugares que parecen separados.','almuerzo y plaza':'A la hora del almuerzo la plaza se llena de cruces.','en la plaza':'Siempre hay alguien con quien conversar.'},
 Rosa:{'en casa':'Salgo a hacer unos mandados.','haciendo mandados':'El almacén es parte de la rutina de cualquiera.','en la plaza':'Acá uno se encuentra con conocidos sin haberlos buscado.'},
 Tomas:{'en casa':'Hoy toca trabajo temprano.','trabajando':'Las herramientas cuentan tanto como las manos.','descanso':'Un descanso corto y seguimos.','mandados':'Antes de volver, unas compras.'},
 Elena:{'en casa':'Ya casi es hora de salir.','trabajando':'El comercio tiene su propio ritmo.','almuerzo':'A mediodía todos necesitamos parar.','en la plaza':'Después del trabajo, un rato de plaza.'}
};
function distance(a,b){return Math.hypot((a.x||0)-(b.x||0),(a.y||0)-(b.y||0))}
function nearestNpc(){const g=V.gameState;if(!g||!Array.isArray(V.npcs))return null;let best=null,d=Infinity;V.npcs.forEach(n=>{const q=distance(g,n);if(q<95&&q<d){d=q;best=n}});return best}
function lifeNpc(name){return V.life?.ambient?.find(o=>o.name===name)||null}
function activity(n){const l=lifeNpc(n.name);return l?.activity||n.activity||'de paso'}
function conversation(n){const a=activity(n),by=LINES[n.name]||{};return by[a]||`${n.name} está ${a}. En un pueblo, hasta una rutina puede contar una historia.`}
function open(n){if(!n)return false;const text=conversation(n);if(typeof V.openDialogue==='function'){V.openDialogue(n.name,[text,'Si querés conocer mejor el territorio, seguí recorriendo y observando.']);return true}return false}
function tick(){const g=V.gameState;if(!g)return;const n=nearestNpc();S.lastPlayer={x:g.x,y:g.y};S.nearby=n?{name:n.name,distance:Math.round(distance(g,n)),activity:activity(n)}:null;if(n!==S.lastNpc){S.lastNpc=n;if(n&&V.worldEvent)V.worldEvent('npc-nearby',{npc:n.name,activity:activity(n)})}}
function install(){if(V.__v79Installed)return;V.__v79Installed=true;V.socialWorld79=S;V.socialWorld79.nearestNpc=nearestNpc;V.socialWorld79.open=open;V.socialWorld79.activity=activity;tick();setInterval(tick,250)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
