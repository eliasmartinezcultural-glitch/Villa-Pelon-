/* VILLA PELÓN V61 — menú, guardado por ranuras, idioma, audio y utilidades.
   Capa de interfaz: no crea game loop ni modifica el motor de movimiento/render.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const state=V.gameState;
const SAVE_PREFIX='villa_pelon_save_slot_';
const SETTINGS_KEY='villa_pelon_settings';
const DEFAULTS={x:960,y:650,speed:205,money:10000,energy:100,minutes:480,day:1,quest:0,dialogue:false,saved:false,inventory:[],walk:0,facing:'down',started:true};
let settings={language:'es',music:true,sfx:true};
try{settings={...settings,...JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')}}catch(_){}
const T={
 es:{menu:'MENÚ',resume:'CONTINUAR',save:'GUARDAR PARTIDA',load:'CARGAR PARTIDA',restart:'REINICIAR PARTIDA',music:'MÚSICA',language:'IDIOMA',fullscreen:'PANTALLA COMPLETA',close:'CERRAR',slot:'RANURA',saved:'Partida guardada',loaded:'Partida cargada',newgame:'Nueva partida',confirmRestart:'¿Reiniciar la partida? Se perderá el progreso no guardado.',yes:'SÍ, REINICIAR',no:'CANCELAR',on:'ACTIVADA',off:'DESACTIVADA'},
 en:{menu:'MENU',resume:'RESUME',save:'SAVE GAME',load:'LOAD GAME',restart:'RESTART GAME',music:'MUSIC',language:'LANGUAGE',fullscreen:'FULLSCREEN',close:'CLOSE',slot:'SLOT',saved:'Game saved',loaded:'Game loaded',newgame:'New game',confirmRestart:'Restart the game? Unsaved progress will be lost.',yes:'YES, RESTART',no:'CANCEL',on:'ON',off:'OFF'},
 pt:{menu:'MENU',resume:'CONTINUAR',save:'SALVAR PARTIDA',load:'CARREGAR PARTIDA',restart:'REINICIAR PARTIDA',music:'MÚSICA',language:'IDIOMA',fullscreen:'TELA CHEIA',close:'FECHAR',slot:'SLOT',saved:'Partida salva',loaded:'Partida carregada',newgame:'Nova partida',confirmRestart:'Reiniciar a partida? O progresso não salvo será perdido.',yes:'SIM, REINICIAR',no:'CANCELAR',on:'ATIVADA',off:'DESATIVADA'}
};
const tr=k=>(T[settings.language]||T.es)[k]||k;
function persistSettings(){localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings))}
function snapshot(){return {...state,dialogue:false,saved:false,inventory:Array.isArray(state.inventory)?state.inventory.slice():[]}}
function validSave(s){return s&&typeof s==='object'&&Number.isFinite(Number(s.x))&&Number.isFinite(Number(s.y))&&Number.isFinite(Number(s.minutes))}
function saveSlot(slot=1){if(!state)return false;try{localStorage.setItem(SAVE_PREFIX+slot,JSON.stringify({...snapshot(),schema:1,version:V.version||'V61',savedAt:new Date().toISOString()}));state.saved=true;V.saveGame?.();notify(tr('saved'));setTimeout(()=>{state.saved=false},1200);return true}catch(e){console.warn('[Villa Pelón] save slot',e);return false}}
function loadSlot(slot=1){try{const s=JSON.parse(localStorage.getItem(SAVE_PREFIX+slot)||'null');if(!validSave(s)){notify(tr('newgame'));return false}Object.assign(state,s,{dialogue:false,saved:false});localStorage.setItem('villa_pelon_save',JSON.stringify(snapshot()));V.life?.nextWeather?.();V.engine?.emit('state','running');notify(tr('loaded'));return true}catch(e){console.warn('[Villa Pelón] load slot',e);return false}}
function restart(){if(!state)return;Object.assign(state,DEFAULTS,{inventory:[]});localStorage.removeItem('villa_pelon_save');for(let i=1;i<=3;i++)localStorage.removeItem(SAVE_PREFIX+i);state.started=true;document.getElementById('start')?.classList.add('hidden');document.getElementById('game')?.classList.remove('hidden');document.getElementById('dialogue')?.classList.add('hidden');V.life?.nextWeather?.();V.engine?.emit('state','running');notify(tr('newgame'));}
function notify(text){let n=document.getElementById('vpToast');if(!n){n=document.createElement('div');n.id='vpToast';document.body.appendChild(n)}n.textContent=text;n.classList.add('show');clearTimeout(n._t);n._t=setTimeout(()=>n.classList.remove('show'),1800)}
let audio=null,master=null;
function audioStart(){if(!settings.music)return;if(audio&&audio.state==='running')return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;audio=audio||new AC();master=master||audio.createGain();master.gain.value=.045;master.connect(audio.destination);const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.value=146.83;gain.gain.value=.22;osc.connect(gain).connect(master);osc.start();V.audio={enabled:true,context:audio};}
function audioStop(){if(audio){try{audio.suspend()}catch(_){} }V.audio={enabled:false,context:audio}}
function toggleMusic(){settings.music=!settings.music;persistSettings();settings.music?audioStart():audioStop();updateMenu();}
function fullscreen(){const el=document.documentElement;if(!document.fullscreenElement)el.requestFullscreen?.().catch(()=>{});else document.exitFullscreen?.()}
function applyLanguage(){document.documentElement.lang=settings.language==='es'?'es-AR':settings.language;updateMenu();
 const map={save:'GUARDAR',menu:'MENÚ'};const save=document.getElementById('save');if(save)save.textContent=settings.language==='es'?map.save:tr('save');
 const start=document.getElementById('startBtn');if(start&&settings.language==='en')start.textContent='START';else if(start&&settings.language==='pt')start.textContent='COMEÇAR';
}
function cycleLanguage(){settings.language=settings.language==='es'?'en':settings.language==='en'?'pt':'es';persistSettings();applyLanguage();notify((settings.language||'es').toUpperCase())}
function openMenu(){document.getElementById('vpMenu')?.classList.remove('hidden');updateMenu()}
function closeMenu(){document.getElementById('vpMenu')?.classList.add('hidden')}
function slotInfo(slot){try{const s=JSON.parse(localStorage.getItem(SAVE_PREFIX+slot)||'null');if(!s)return '—';const h=Math.floor((Number(s.minutes)||0)/60)%24,m=Math.floor(Number(s.minutes)||0)%60;return `Día ${s.day||1} · ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')} · $${Math.round(s.money||0)}`}catch(_){return '—'}}
function updateMenu(){const m=document.getElementById('vpMenu');if(!m)return;m.querySelector('[data-t=resume]').textContent=tr('resume');m.querySelector('[data-t=save]').textContent=tr('save');m.querySelector('[data-t=load]').textContent=tr('load');m.querySelector('[data-t=restart]').textContent=tr('restart');m.querySelector('[data-t=fullscreen]').textContent=tr('fullscreen');m.querySelector('[data-t=close]').textContent=tr('close');m.querySelector('[data-t=music]').textContent=`${tr('music')}: ${settings.music?tr('on'):tr('off')}`;m.querySelector('[data-t=language]').textContent=`${tr('language')}: ${(settings.language||'es').toUpperCase()}`;m.querySelectorAll('[data-slot]').forEach(b=>{const s=b.dataset.slot;b.textContent=`${tr('slot')} ${s} · ${slotInfo(s)}`})}
function build(){
 const b=document.createElement('button');b.id='vpMenuButton';b.type='button';b.textContent='☰';b.setAttribute('aria-label','Menú');document.getElementById('game')?.appendChild(b);
 const m=document.createElement('div');m.id='vpMenu';m.className='hidden';m.innerHTML=`<div class="vp-panel"><div class="vp-title">VILLA PELÓN</div><button data-a="resume" data-t="resume"></button><button data-a="save" data-t="save"></button><div class="vp-slots"><button data-a="load" data-slot="1"></button><button data-a="load" data-slot="2"></button><button data-a="load" data-slot="3"></button></div><button data-a="restart" data-t="restart"></button><button data-a="music" data-t="music"></button><button data-a="language" data-t="language"></button><button data-a="fullscreen" data-t="fullscreen"></button><button data-a="close" data-t="close"></button><div class="vp-help">PC: WASD / flechas · E / Espacio · ESC: menú<br>Móvil: controles táctiles</div></div>`;document.getElementById('game')?.appendChild(m);
 b.addEventListener('click',openMenu);m.addEventListener('click',e=>{const x=e.target.closest('[data-a]');if(!x)return;const a=x.dataset.a;if(a==='resume'||a==='close')closeMenu();else if(a==='save')saveSlot(1);else if(a==='load')loadSlot(Number(x.dataset.slot));else if(a==='restart'){if(confirm(tr('confirmRestart')))restart();closeMenu()}else if(a==='music')toggleMusic();else if(a==='language')cycleLanguage();else if(a==='fullscreen')fullscreen()});
 addEventListener('keydown',e=>{if(e.key==='Escape'){const menu=document.getElementById('vpMenu');menu?.classList.contains('hidden')?openMenu():closeMenu()}});
 applyLanguage();
}
V.ui={version:'61.0.0',saveSlot,loadSlot,restart,toggleMusic,cycleLanguage,fullscreen,openMenu,closeMenu,settings};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();
