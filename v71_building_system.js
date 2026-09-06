/* Villa Pelón V71 — autoridad de edificios, puertas e interiores.
   No crea mapas paralelos: lee V.worldGeometry.buildings y agrega identidad territorial.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const B={version:'V71',inside:null,registry:{},snapshot:null};
const META={
 escuela:{id:'escuela',label:'Escuela',type:'school',zone:'pueblo',description:'Aula, patio y memoria de generaciones.'},
 radio:{id:'radio',label:'Radio Oasis',type:'radio',zone:'pueblo',description:'La voz cotidiana del pueblo.'},
 almacen:{id:'almacen',label:'Almacén',type:'shop',zone:'pueblo',description:'Provisiones y encuentros de todos los días.'},
 galpon:{id:'galpon',label:'Galpón rural',type:'rural',zone:'rural',description:'Herramientas, máquinas y trabajo de chacra.'},
 bodega:{id:'bodega',label:'Bodega',type:'rural',zone:'rural',description:'Producción, cosecha y transformación del territorio.'},
 casa:{id:'casa',label:'Vivienda',type:'home',zone:'pueblo',description:'Una casa también guarda historias familiares.'}
};
function player(){const g=V.gameState||{};const p=V.player||{};return{x:Number.isFinite(g.x)?g.x:p.x,y:Number.isFinite(g.y)?g.y:p.y}}
function buildings(){return (V.worldGeometry&&Array.isArray(V.worldGeometry.buildings))?V.worldGeometry.buildings:[]}
function sync(){buildings().forEach((b,i)=>{const key=String(b.id||b.label||b.type||('building-'+i)).toLowerCase().replace(/\s+/g,'-');if(!B.registry[key]){const t=b.type||'home';B.registry[key]={...b,id:key,meta:META[t]||{id:key,label:b.label||'Edificio',type:t,zone:'pueblo',description:'Un lugar del territorio.'},door:{x:b.x+b.w/2,y:b.y+b.h+18}}}})}
function nearest(){sync();const p=player();let best=null,dist=Infinity;Object.values(B.registry).forEach(b=>{const d=Math.hypot(p.x-b.door.x,p.y-b.door.y);if(d<dist&&d<85){best=b;dist=d}});return best}
function getState(){return B.inside}
function enter(b){if(!b)return false;const p=player();B.snapshot={x:p.x,y:p.y};B.inside={id:b.id,label:b.meta.label,type:b.meta.type,description:b.meta.description,zone:b.meta.zone,enteredAt:Date.now()};if(V.worldEvent)V.worldEvent('building-enter',{building:b.id,label:b.meta.label});render();return true}
function exit(){if(!B.inside)return false;const old=B.inside;B.inside=null;if(B.snapshot){const g=V.gameState||V.player;if(g){g.x=B.snapshot.x;g.y=B.snapshot.y}}if(V.worldEvent)V.worldEvent('building-exit',{building:old.id});B.snapshot=null;render();return true}
function interact(){if(B.inside)return exit();const b=nearest();if(b)return enter(b);return false}
function render(){let el=document.getElementById('v71-interior');if(B.inside){if(!el){el=document.createElement('div');el.id='v71-interior';el.innerHTML='<div class="v71-room"><div class="v71-kicker">INTERIOR · VILLA PELÓN</div><h2></h2><p></p><div class="v71-room-grid"><span>PUERTA</span><span>OBJETOS</span><span>PERSONAS</span></div><button type="button">SALIR · E</button></div>';document.body.appendChild(el);el.querySelector('button').onclick=exit}el.querySelector('h2').textContent=B.inside.label;el.querySelector('p').textContent=B.inside.description;el.classList.add('active')}else if(el){el.classList.remove('active')}}
function style(){if(document.getElementById('v71-style'))return;const s=document.createElement('style');s.id='v71-style';s.textContent='#v71-interior{position:fixed;inset:0;z-index:10000;display:none;place-items:center;background:rgba(20,24,20,.94);font-family:system-ui,sans-serif;color:#eee}#v71-interior.active{display:grid}.v71-room{width:min(720px,88vw);min-height:430px;padding:34px;border:2px solid rgba(220,205,164,.55);background:linear-gradient(180deg,#75654d,#493e31);box-shadow:0 24px 80px #000}.v71-kicker{font-size:12px;letter-spacing:.18em;opacity:.7}.v71-room h2{font-size:34px;margin:10px 0}.v71-room p{max-width:540px;line-height:1.6;opacity:.9}.v71-room-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:48px 0;padding-top:20px;border-top:1px solid rgba(255,255,255,.2)}.v71-room-grid span{padding:18px;background:rgba(0,0,0,.18);font-size:11px;letter-spacing:.12em}.v71-room button{padding:12px 18px;background:#d8c59a;border:0;font-weight:700;cursor:pointer}' ;document.head.appendChild(s)}
function tick(){if(B.inside){const p=player();if(B.snapshot&&V.gameState){V.gameState.x=B.snapshot.x;V.gameState.y=B.snapshot.y}}}
V.buildings71={...B,nearest,enter,exit,interact,getState};window.addEventListener('keydown',e=>{if(e.key.toLowerCase()!=='e'||e.repeat)return;interact()});window.addEventListener('click',style,{once:true});setInterval(tick,100);style();sync();
})();