/* VILLA PELÓN — Runtime Core 1.2
   Autoridad estructural para ciclo de vida, servicios y salud del motor.
   No dibuja, no crea un segundo game loop ni duplica guardado.
*/
(()=>{
  'use strict';
  const V=window.VillaPelon||(window.VillaPelon={});
  const E=V.engine=V.engine||{};
  E.version='1.2.0';
  E.state=E.state||'boot';
  E.services=E.services||Object.create(null);
  E.events=E.events||Object.create(null);
  E.register=(name,service)=>{if(!name||!service)return null;E.services[name]=service;return service};
  E.get=name=>E.services[name]||null;
  E.on=(name,fn)=>{if(typeof fn!=='function')return()=>{};(E.events[name]||(E.events[name]=[])).push(fn);return()=>{E.events[name]=(E.events[name]||[]).filter(x=>x!==fn)}};
  E.emit=(name,payload)=>(E.events[name]||[]).slice().forEach(fn=>{try{fn(payload)}catch(err){console.error('[Villa Pelón runtime]',err)}});
  E.setState=state=>{E.state=state;E.emit('state',state)};
  E.health=()=>({
    version:E.version,
    state:E.state,
    game:!!V.gameState,
    life:!!V.life,
    geometry:!!V.worldGeometry,
    canvas:!!document.getElementById('world'),
    detailCanvas:!!document.getElementById('worldDetail'),
    singleBuildingRenderer:V.buildingDetail?.renderOwner==='render_compositor_v93'&&V.renderCompositor?.singleRAF===true,
    buildingRendererOwner:V.buildingDetail?.renderOwner||null,
    save:typeof V.saveGame==='function'
  });
  E.pause=()=>{if(E.state==='running')E.setState('paused')};
  E.resume=()=>{if(E.state==='paused')E.setState('running')};
  E.setState('boot');
  E.register('world',()=>V.world);
  window.addEventListener('villa-pelon-runtime-ready',()=>E.emit('ready',E.health()));
  /* Un único dueño del beforeunload: el motor. Runtime sólo pausa y pide
     guardado cuando la pestaña pierde visibilidad, sin registrar otro unload. */
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      E.pause();
      try{if(typeof V.saveGame==='function'&&V.gameState&&V.gameState.started)V.saveGame()}catch(err){console.warn('[Villa Pelón] autosave visibility',err)}
    }else if(V.gameState&&V.gameState.started)E.resume();
  });
  E.setState('ready');
  window.VILLA_PELON_ENGINE='1.2.0';
})();
