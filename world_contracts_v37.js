/* Villa Pelón V37 — contratos de mundo: eventos, ritmo territorial y UX contextual. */
(() => {
  'use strict';
  const V=window.VillaPelon||(window.VillaPelon={});
  const C=V.worldContracts=V.worldContracts||{version:'V37',events:[],active:null,lastKey:'',boot:Date.now()};
  const $=id=>document.getElementById(id);
  const read=()=>({
    clock:$('clock')?.textContent||'08:00',
    day:Number($('day')?.textContent||1),
    money:Number(String($('money')?.textContent||0).replace(/[^0-9.-]/g,''))||0,
    energy:Number(String($('energy')?.textContent||0).replace(/[^0-9.-]/g,''))||0,
    weather:($('weather')?.textContent||'Despejado').toLowerCase()
  });
  const phase=(h)=>h<6?'madrugada':h<9?'mañana':h<12?'media mañana':h<14?'mediodía':h<17?'siesta':h<20?'tarde':'noche';
  const schedule={
    madrugada:['Las casas descansan y las calles quedan casi vacías.','El pueblo comienza a recuperar movimiento.'],
    mañana:['Se abren comercios y empiezan los recorridos diarios.','La escuela y el almacén toman actividad.'],
    'media mañana':['La plaza recibe encuentros y mandados.','La circulación aumenta entre el centro y las zonas de trabajo.'],
    'mediodía':['Es hora de almorzar y bajar el ritmo.','Los trabajadores buscan una pausa.'],
    siesta:['El calor reduce el movimiento exterior.','La actividad se concentra en casas y espacios de trabajo.'],
    tarde:['Regresan las tareas rurales y los viajes por el pueblo.','El movimiento se reparte entre centro y chacras.'],
    noche:['La radio y las reuniones comunitarias ganan protagonismo.','Las viviendas comienzan a encender sus luces.']
  };
  function log(type,text){
    const e={type,text,at:Date.now(),day:read().day};
    C.events.push(e);if(C.events.length>100)C.events.splice(0,C.events.length-100);
    try{localStorage.setItem('villa_pelon_world_v37',JSON.stringify(C.events))}catch(_){ }
  }
  try{const a=JSON.parse(localStorage.getItem('villa_pelon_world_v37')||'[]');if(Array.isArray(a))C.events=a.slice(-100)}catch(_){ }
  function toast(text){
    let el=$('v37Toast');
    if(!el){el=document.createElement('div');el.id='v37Toast';el.style.cssText='position:fixed;left:50%;top:72px;transform:translateX(-50%);z-index:30;max-width:min(88vw,520px);padding:9px 13px;border:1px solid rgba(255,255,255,.16);border-radius:10px;background:rgba(25,29,24,.92);color:#f7e8c7;font:12px monospace;text-align:center;box-shadow:0 8px 28px rgba(0,0,0,.25);pointer-events:none;opacity:0;transition:opacity .2s';document.body.appendChild(el)}
    el.textContent=text;el.style.opacity='1';clearTimeout(el._t);el._t=setTimeout(()=>el.style.opacity='0',3400);
  }
  function eventFor(s){
    const h=Number(s.clock.split(':')[0])||0,p=phase(h),w=s.weather;
    let key=s.day+'|'+p+'|'+w;
    if(key===C.lastKey)return;
    C.lastKey=key;
    const pool=schedule[p]||schedule.mañana;
    let text=pool[s.day%pool.length];
    if(w.includes('lluv'))text+=' La lluvia cambia el ritmo de las actividades exteriores.';
    else if(w.includes('viento'))text+=' El viento se siente en calles, árboles y zonas rurales.';
    C.active={phase:p,text,day:s.day,weather:w};log('ritmo',text);toast('VIDA DEL PUEBLO · '+text);
  }
  function mount(){
    let panel=$('v37World');
    if(!panel){panel=document.createElement('aside');panel.id='v37World';panel.style.cssText='position:fixed;right:10px;bottom:74px;z-index:18;width:min(300px,calc(100vw - 20px));padding:10px 12px;border:1px solid rgba(255,255,255,.13);border-radius:12px;background:rgba(31,35,29,.88);backdrop-filter:blur(5px);color:#eee4cd;font:11px monospace;pointer-events:none';document.body.appendChild(panel)}
    const s=read(),h=Number(s.clock.split(':')[0])||0,p=phase(h),a=(schedule[p]||[])[s.day%2]||'';
    panel.innerHTML='<b style="font-size:12px">RITMO DE VILLA PELÓN</b><br><span style="opacity:.72">'+p.toUpperCase()+' · DÍA '+s.day+'</span><br><span>'+a+'</span><br><span style="opacity:.7">Clima: '+s.weather+' · Energía: '+Math.round(s.energy)+'</span>';
  }
  function tick(){const s=read();eventFor(s);mount();V.worldContracts.read=read;V.worldContracts.phase=()=>phase(Number(read().clock.split(':')[0])||0);V.worldContracts.log=log;V.worldContracts.getActive=()=>C.active;}
  setInterval(tick,1000);setTimeout(tick,700);
})();
