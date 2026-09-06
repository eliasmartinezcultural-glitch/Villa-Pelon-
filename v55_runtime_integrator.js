/* VILLA PELÓN — Runtime Integrator 1.1
   Orquestador estructural. La lógica jugable pertenece a game.js.
   Este módulo sólo administra la transición narrativa de entrada y salud del runtime.
   No crea RAF, no mueve al jugador y no mantiene un segundo estado de partida.
*/
(()=>{
  'use strict';
  const V=window.VillaPelon||(window.VillaPelon={});
  const E=V.engine;
  if(!E){console.error('[Villa Pelón] Runtime Core ausente');return}

  V.runtime={
    version:'1.1.0',
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
    return h;
  };

  E.on('state',state=>{if(state==='ready'||state==='running')validate()});
  E.on('ready',validate);
  window.addEventListener('villa-pelon-runtime-ready',validate,{once:true});

  // La narrativa puede controlar el momento de entrada, pero la partida real
  // se inicia exclusivamente mediante el handler existente de game.js.
  const start=document.getElementById('start');
  const game=document.getElementById('game');
  const copy=document.getElementById('introText');
  const button=document.getElementById('startBtn');
  if(start&&game&&copy&&button&&!V.runtime.__intro){
    V.runtime.__intro=true;
    const story=[
      'En un pequeño pueblo, cada calle guarda una historia. Cada casa conserva una memoria. Cada persona forma parte de una vida que continúa día tras día.',
      'Las mañanas comienzan despacio. Se abren las puertas, el trabajo empieza y las voces se encuentran en las calles, en la plaza, en la escuela y en las chacras.',
      'El pueblo no es solamente un lugar. Es la suma de sus recuerdos, sus vínculos y las pequeñas decisiones de quienes lo habitan.',
      'Y ahora, una nueva historia está a punto de comenzar.'
    ];
    let i=0;
    const show=()=>{copy.textContent=story[i]};
    show();
    const next=()=>{
      i++;
      if(i<story.length){show();window.setTimeout(next,3300);return}
      button.click();
    };
    window.setTimeout(next,3800);
  }

  V.runtime.validate=validate;
  V.runtime.ready=true;
  validate();
})();
