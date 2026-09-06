/* VILLA PELÓN — Runtime Integrator 1.0
   Orquestador estructural. La entrada al juego pertenece a game.js.
   Este módulo NO inicia partidas, NO crea RAF y NO duplica estados.
*/
(()=>{
  'use strict';
  const V=window.VillaPelon||(window.VillaPelon={});
  const E=V.engine;
  if(!E){console.error('[Villa Pelón] Runtime Core ausente');return}

  V.runtime={
    version:'1.0.0',
    platform:['pc','mobile'],
    worldBounds:{w:3200,h:2000},
    authority:{game:'game.js',life:'life.js',data:'village_data.js',integrity:'v57_integrity.js'},
    singlePlayerState:true,
    singleLifeUpdate:true,
    singleVisualAuthority:'game.js'
  };

  const validate=()=>{
    const h=E.health();
    h.runtime=true;
    h.ok=!!(h.game&&h.life&&h.geometry&&h.canvas);
    V.runtime.health=h;
    E.emit('health',h);
    if(!h.ok)console.warn('[Villa Pelón] Health check incompleto',h);
    return h
  };

  E.on('state',state=>{
    if(state==='ready')validate();
    if(state==='running')validate();
  });

  E.on('ready',validate);
  window.addEventListener('villa-pelon-runtime-ready',validate,{once:true});
  V.runtime.validate=validate;
  V.runtime.ready=true;
  validate();
})();
