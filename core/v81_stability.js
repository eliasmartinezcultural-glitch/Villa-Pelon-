/* Villa Pelón V81 — estabilidad, coherencia territorial y experiencia multiplataforma.
   No crea otro motor: corrige la integración de los sistemas existentes.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const VERSION='V81.0.0';
const SAVE_KEY='villa_pelon_save';
const SAVE_SCHEMA=2;

function storageOK(){
  try{const k='vp_v81_test';localStorage.setItem(k,'1');localStorage.removeItem(k);return true}catch(_){return false}
}
function finite(v,d){return Number.isFinite(Number(v))?Number(v):d}
function normalizeState(){
  const s=V.gameState;if(!s)return false;
  s.x=finite(s.x,620);s.y=finite(s.y,620);s.speed=finite(s.speed,205);s.money=finite(s.money,10000);s.energy=Math.max(0,Math.min(100,finite(s.energy,100)));s.minutes=Math.max(0,Math.min(1439,finite(s.minutes,480)));s.day=Math.max(1,Math.floor(finite(s.day,1)));s.quest=Math.max(0,Math.floor(finite(s.quest,0)));s.inventory=Array.isArray(s.inventory)?s.inventory.filter(x=>typeof x==='string').slice(0,100):[];s.facing=['up','down','left','right'].includes(s.facing)?s.facing:'down';s.dialogue=false;
  if(!Number.isFinite(s.walk))s.walk=0;
  if(!Number.isFinite(s.saved))s.saved=false;
  return true;
}
function unifyWorld(){
  const authority=V.worldAuthority?.geometry;if(!authority)return false;
  const local=V.worldGeometry;
  /* game.js keeps a private reference to its buildings array. Mutating that
     array, instead of replacing it, makes the canonical world authoritative
     without creating a second movement engine. */
  if(local?.buildings&&Array.isArray(authority.buildings)){
    local.buildings.length=0;
    authority.buildings.forEach(b=>local.buildings.push({...b}));
  }
  if(V.world){V.world.w=authority.width;V.world.h=authority.height;V.world.width=authority.width;V.world.height=authority.height;V.world.safeMargin=authority.safeMargin}
  return true;
}
function validPosition(x,y){
  const blocked=V.worldAuthority?.blocked;
  return blocked?!blocked(x,y,14):true;
}
function normalizePosition(){
  const s=V.gameState;if(!s)return;
  if(validPosition(s.x,s.y))return;
  const candidates=[[620,620],[520,760],[700,620],[600,700],[500,650]];
  const p=candidates.find(([x,y])=>validPosition(x,y));
  if(p){s.x=p[0];s.y=p[1]}
}
function migrateSave(){
  if(!storageOK())return;
  try{
    const raw=localStorage.getItem(SAVE_KEY);if(!raw)return;
    const s=JSON.parse(raw);if(!s||typeof s!=='object')return;
    if(!Array.isArray(s.inventory))s.inventory=[];
    s.schema=SAVE_SCHEMA;s.version=VERSION;
    localStorage.setItem(SAVE_KEY,JSON.stringify(s));
  }catch(e){console.warn('[Villa Pelón V81] no se pudo migrar el guardado',e)}
}
const siteText={
  plaza:['PLAZA DEL PUEBLO','Este espacio funciona como punto de encuentro y referencia para orientarte por el territorio.'],
  chacras:['LAS CHACRAS','La zona productiva conecta paisaje, trabajo, agua y vida cotidiana.'],
  vinedos:['LOS VIÑEDOS','Las hileras de vid muestran cómo el paisaje productivo transforma el territorio.'],
  canal:['CANAL DE RIEGO','El agua es una clave del territorio. En las futuras misiones históricas, cada afirmación documental deberá tener fuente.'],
  'canal-viejo':['CANAL VIEJO','Este lugar queda preparado para una futura misión de investigación sobre territorio, riego y memoria.'],
  ribera:['RIBERA DEL RÍO','Podés recorrer la ribera sin entrar al cauce. El río funciona como referencia espacial y ambiental.'],
  fossils:['SITIO DE FÓSILES','Zona de investigación. Los hallazgos reales solo se incorporarán cuando estén respaldados por fuentes científicas.'],
  mirador:['MIRADOR DE LA MESETA','Desde acá se entiende mejor el contraste entre meseta, superficie irrigada y río.']
};
function nearestSite(){
  const s=V.gameState;if(!s)return null;let best=null,bestD=105;
  (V.worldAuthority?.geometry?.sites||[]).forEach(p=>{const d=Math.hypot(s.x-p.x,s.y-p.y);if(d<bestD){best=p;bestD=d}});
  return best;
}
function interactSite(){
  const s=V.gameState;if(!s||!s.started||s.dialogue)return false;
  const p=nearestSite(),t=p&&siteText[p.id];if(!t)return false;
  V.openDialogue?.(t[0],[t[1],'Este contenido es territorial. Los datos históricos específicos se incorporarán con fuentes verificables.']);
  return true;
}
function bindSiteInteraction(){
  /* Capture phase prevents the old generic E/pointer handler from firing when
     a canonical site is the intended interaction target. */
  addEventListener('keydown',e=>{
    if(!['e',' '].includes(String(e.key).toLowerCase()))return;
    if(interactSite()){e.preventDefault();e.stopImmediatePropagation()}
  },true);
  document.addEventListener('pointerdown',e=>{
    if(!e.target.closest?.('#interact'))return;
    if(interactSite()){e.preventDefault();e.stopImmediatePropagation()}
  },true);
}
function mobileSafety(){
  const style=document.createElement('style');style.id='vp-v81-safety';style.textContent=`html,body{overscroll-behavior:none}body{touch-action:manipulation}#world{touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}.touch button,#interact,#save,.main-tools button{touch-action:none;-webkit-tap-highlight-color:transparent}.intro-screen{padding-top:max(12px,env(safe-area-inset-top));padding-bottom:max(12px,env(safe-area-inset-bottom))}`;document.head.appendChild(style);
}
function boot(){
  if(!normalizeState())return;
  unifyWorld();migrateSave();normalizePosition();mobileSafety();bindSiteInteraction();
  V.stability={version:VERSION,saveSchema:SAVE_SCHEMA,canonicalWorld:true,mobileSafety:true,deviceLocalSave:true};
  document.documentElement.dataset.villaPelonVersion=VERSION;
  console.info('[Villa Pelón]',VERSION,'OK — mundo canónico, posición validada, interacción territorial integrada');
}
function wait(){if(V.gameState&&V.worldAuthority&&V.worldGeometry){boot();return}setTimeout(wait,50)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
