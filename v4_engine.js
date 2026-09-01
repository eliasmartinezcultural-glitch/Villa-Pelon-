/* Villa Pelón V4 — KERNEL DEL MOTOR
   Capa de ejecución única para compatibilidad y evolución del motor.
   Centraliza el frame loop, migración de partidas, diagnóstico y ciclo de vida.
*/
(()=>{'use strict';
  const V=window.VillaPelon||(window.VillaPelon={});
  const kernel={version:4,booted:false,ready:false,frame:0,fps:0,dt:0,errors:0,maxDt:.05,startedAt:performance.now(),modules:{}};
  V.v4=kernel;

  // El motor anterior solicita RAF por su cuenta. V4 lo convierte en una cola
  // controlada para garantizar un solo frame por ciclo y evitar loops paralelos.
  const nativeRAF=window.requestAnimationFrame.bind(window);
  const pending=[];
  let released=false;
  window.requestAnimationFrame=cb=>{pending.push(cb);return pending.length};

  function migrate(){
    const migrateKey=(from,to)=>{
      try{const raw=localStorage.getItem(from);if(raw&&!localStorage.getItem(to))localStorage.setItem(to,raw)}catch(_){kernel.errors++}
    };
    migrateKey('villa_pelon_v3_save','villa_pelon_v4_save');
    migrateKey('villa_pelon_v3_world','villa_pelon_v4_world');
    migrateKey('villa_pelon_v2_save','villa_pelon_v4_save');
    migrateKey('villa_pelon_v2_story','villa_pelon_v4_story');
  }

  function diagnostics(){
    V.v4.status=()=>({version:4,frame:kernel.frame,fps:Math.round(kernel.fps),dt:kernel.dt,errors:kernel.errors,engine:!!V.engine,world:!!V.world,life:!!V.life,story:!!V.story});
    V.v4.register=(name,module)=>{if(name)kernel.modules[name]=module;return module};
    V.v4.emit=(name,payload)=>{const m=kernel.modules[name];if(m&&typeof m.onEvent==='function')m.onEvent(payload)};
  }

  function release(){
    if(released)return;
    released=true;
    window.requestAnimationFrame=nativeRAF;
    kernel.ready=true;
    if(V.state)V.state.version=4;
    if(V.engine){
      V.v4.register('engine',V.engine);
      // Exponer diagnóstico sin sustituir las funciones sensibles del motor.
      const originalSave=V.engine.save;
      V.engine.save=()=>{try{if(V.state)V.state.version=4}catch(_){}return originalSave?.()};
    }
    const first=pending.shift();
    if(first) nativeRAF(first);
    // Los siguientes frames los solicita el motor original con RAF nativo.
  }

  migrate();
  diagnostics();
  kernel.booted=true;

  // game.js se carga inmediatamente después. Esperamos a que publique V.engine.
  const wait=()=>{if(V.engine)release();else nativeRAF(wait)};
  nativeRAF(wait);
})();
