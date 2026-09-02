/* Villa Pelón V6.43 — NÚCLEO MOTOR CONSOLIDADO
   Cierre funcional de jornada: un único loop, movimiento, render e interacción.
   El núcleo no duplica terreno, edificios ni población. Las capas especializadas
   se integran sobre esta autoridad sin reemplazarla.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const canvas=document.getElementById('world');if(!canvas)throw new Error('V6.43: canvas #world no encontrado');
const ctx=canvas.getContext('2d',{alpha:false});
const world={w:8400,h:5600,version:43};
const old=V.state&&typeof V.state==='object'?V.state:{};
const state=Object.assign({started:false,x:1280,y:820,speed:235,money:10000,energy:100,minutes:480,day:1,mission:0,inventory:[],dialogue:false,saved:false,walk:0,history:[],relationships:{},flags:{},version:43,facing:'down',moving:false},old);
state.flags=state.flags||{};state.relationships=state.relationships||{};state.inventory=Array.isArray(state.inventory)?state.inventory:[];
V.world=world;V.state=state;V.input=V.input||{up:false,down:false,left:false,right:false,interact:false};
const keys={up:['w','arrowup'],down:['s','arrowdown'],left:['a','arrowleft'],right:['d','arrowright']};
const pressed=k=>keys[k].some(x=>V.input[x]||V.input[k]);
function seed(){
 if(!Array.isArray(V.buildings))V.buildings=[];
 if(!Array.isArray(V.npcs))V.npcs=[];
 if(!V.buildings.length){V.buildings.push({id:'home_player',x:920,y:470,w:230,h:160,type:'home',label:'Vivienda'});V.buildings.push({id:'almacen',x:1550,y:470,w:250,h:160,type:'shop',label:'Almacén'});V.buildings.push({id:'panaderia',x:1880,y:760,w:250,h:160,type:'bakery',label:'Panadería'});}
 if(!V.npcs.length)V.npcs.push({id:'raul',name:'Raúl',x:1760,y:910,role:'vecino',dialogue:'El pueblo guarda historias en cada camino.'});
}
seed();
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function solid(b,x,y){return b&&x>b.x-10&&x<b.x+b.w+10&&y>b.y-10&&y<b.y+b.h+10}
function blocked(x,y){if(x<45||y<130||x>world.w-45||y>world.h-45)return true;for(const b of V.buildings||[]){if(b.collision!==false&&solid(b,x,y))return true}return false}
function nearestNPC(max=105){let best=null,bd=max;for(const n of V.npcs||[]){const d=Math.hypot(state.x-n.x,state.y-n.y);if(d<bd){bd=d;best=n}}return best}
function nearestHistory(max=95){const h=Array.isArray(V.history)?V.history:[];let best=null,bd=max;for(const x of h){if(x.x==null||x.y==null)continue;const d=Math.hypot(state.x-x.x,state.y-x.y);if(d<bd){bd=d;best=x}}return best}
function nearestJob(max=95){const j=V.storyJob;if(!j)return null;const d=Math.hypot(state.x-(j.x||0),state.y-(j.y||0));return d<max?j:null}
function nearestCommerce(max=115){let best=null,bd=max;for(const b of V.buildings||[]){if(!['shop','bakery'].includes(String(b.type||'')))continue;const d=Math.hypot(state.x-(b.door?.x??b.x+b.w/2),state.y-(b.door?.y??b.y+b.h/2));if(d<bd){bd=d;best=b}}return best}
function nearest(){return nearestNPC()||nearestHistory()||nearestJob()||nearestCommerce()||V.buildingSystem?.nearest?.(110)||null}
function interact(){
 if(!state.started)return false;
 const n=nearestNPC();if(n){state.relationships[n.id]=(state.relationships[n.id]||0)+1;state.flags.spoke_to_npc=true;state.dialogue=true;if(V.dialogue?.start)V.dialogue.start(n);else if(V.v5Dialogue?.open)V.v5Dialogue.open(n);return true}
 const h=nearestHistory();if(h){state.flags.history_discovered=true;state.history=state.history||[];const id=h.id||h.title||String(h);if(!state.history.includes(id))state.history.push(id);V.history?.inspect?.(h);return true}
 const j=nearestJob();if(j){state.flags.rural_task=true;V.rpgProgression?.api?.tick?.();return true}
 const b=nearestCommerce();if(b){return V.buildingSystem?.enter?!!V.buildingSystem.enter(b):false}
 const building=V.buildingSystem?.nearest?.(110);if(building&&V.buildingSystem?.enter){V.buildingSystem.enter(building);return true}
 return false;
}
function save(){try{const payload={...state,inventory:state.inventory,history:state.history,relationships:state.relationships,flags:state.flags};localStorage.setItem('villa_pelon_v6_state',JSON.stringify(payload));state.saved=true;return true}catch(_){return false}}
function load(){try{const raw=localStorage.getItem('villa_pelon_v6_state');if(!raw)return false;Object.assign(state,JSON.parse(raw));state.inventory=Array.isArray(state.inventory)?state.inventory:[];state.history=Array.isArray(state.history)?state.history:[];state.relationships=state.relationships||{};state.flags=state.flags||{};return true}catch(_){return false}}
function movement(dt){if(!state.started||state.dialogue||V.buildingSystem?.inside)return;let dx=(pressed('right')?1:0)-(pressed('left')?1:0),dy=(pressed('down')?1:0)-(pressed('up')?1:0);const mag=Math.hypot(dx,dy);state.moving=mag>0;if(!mag){state.walk=0;return}dx/=mag;dy/=mag;const speed=state.speed*(V.motion?.speedFactor||1);const nx=state.x+dx*speed*dt,ny=state.y+dy*speed*dt;if(!blocked(nx,state.y))state.x=nx;if(!blocked(state.x,ny))state.y=ny;state.facing=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');state.walk+=dt;state.minutes+=dt*0.12;state.energy=Math.max(0,state.energy-dt*.45)}
function update(dt){if(!state.started)return;movement(dt);if(typeof V.life?.update==='function')V.life.update(dt,state.minutes);if(typeof V.rpgProgression?.api?.tick==='function')V.rpgProgression.api.tick(dt);if(state.minutes>=1440){state.minutes-=1440;state.day++;state.energy=100}V.camera=V.camera||{};V.camera.x=state.x;V.camera.y=state.y;V.camera.zoom=V.camera.zoom||1;}
function fallback(c){c.fillStyle='#a99b79';c.fillRect(0,0,world.w,world.h);c.fillStyle='#75694f';c.fillRect(0,700,world.w,230);c.fillStyle='#667b78';c.fillRect(6900,0,1500,world.h)}
function drawWorld(c){c.clearRect(0,0,canvas.width,canvas.height);c.save();const zoom=V.camera?.zoom||1;c.translate(canvas.width/2,canvas.height/2);c.scale(zoom,zoom);c.translate(-state.x,-state.y);
 if(V.territorialVisuals?.enabled&&typeof V.life?.drawWorld==='function')V.life.drawWorld(c);else fallback(c);
 if(V.npcs?.length){for(const n of V.npcs){c.fillStyle=n.id===nearestNPC()?.id?'#d7a85e':'#604b40';c.fillRect(Math.round(n.x-9),Math.round(n.y-18),18,24);c.fillStyle='#e4c39c';c.fillRect(Math.round(n.x-7),Math.round(n.y-28),14,12)}}
 c.fillStyle='#403b34';c.fillRect(Math.round(state.x-10),Math.round(state.y-20),20,25);c.fillStyle='#d4b37b';c.fillRect(Math.round(state.x-8),Math.round(state.y-31),16,12);
 c.restore()}
function render(){drawWorld(ctx);if(V.activityWorld?.drawOverlay)V.activityWorld.drawOverlay(ctx,canvas.width,canvas.height);if(V.life?.drawOverlay)V.life.drawOverlay(ctx,canvas.width,canvas.height);if(V.buildingSystem?.drawOverlay)V.buildingSystem.drawOverlay(ctx,canvas.width,canvas.height)}
function resize(){const dpr=Math.min(2,devicePixelRatio||1);canvas.width=Math.max(320,Math.floor(innerWidth*dpr));canvas.height=Math.max(240,Math.floor(innerHeight*dpr));canvas.style.width='100%';canvas.style.height='100%';ctx.imageSmoothingEnabled=false}
function key(e,down){const k=String(e.key||'').toLowerCase();for(const n of Object.keys(keys))if(keys[n].includes(k))V.input[n]=down;if(k==='e'||k===' '){if(down&&!e.repeat){e.preventDefault();interact();}V.input.interact=down}if(k==='escape'&&down&&V.buildingSystem?.inside){e.preventDefault();V.buildingSystem.exit?.()}}
window.addEventListener('keydown',e=>key(e,true),true);window.addEventListener('keyup',e=>key(e,false),true);
document.getElementById('save')?.addEventListener('click',save);
const touch=document.getElementById('touch');if(touch)touch.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;b.addEventListener('pointerdown',e=>{e.preventDefault();V.input[k]=true},{passive:false});['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,e=>{e.preventDefault();V.input[k]=false},{passive:false}))});
document.getElementById('interact')?.addEventListener('pointerdown',e=>{e.preventDefault();interact()},{passive:false});
function start(){state.started=true;state.dialogue=false;state._buildingInterior=false;load();state.started=true;resize();V.rpgProgression?.api?.load?.();V.rpgProgression?.api?.tick?.();}
V.engine={version:43,authority:'v6_game_core',movementAuthority:'v6_game_core',renderAuthority:'v6_game_core',inputAuthority:'v6_game_core',state,update,render,interact,save,load,start,nearest,canvas};
V.engine.start=start;window.addEventListener('resize',resize,{passive:true});resize();
let last=performance.now();function frame(now){const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;update(dt);render();requestAnimationFrame(frame)}requestAnimationFrame(frame);
console.info('[Villa Pelón] V6.43 core online');
})();
