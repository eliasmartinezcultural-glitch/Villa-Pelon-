/* Villa Pelón V64 — migración de guardados.
   Los campos de sesión (started/dialogue/saved) no forman parte del estado persistente.
   Evita que un guardado antiguo pueda reabrir el juego como "no iniciado" y bloquear UPDATE.
*/
(()=>{
  'use strict';
  const KEY='villa_pelon_save';
  try{
    const raw=localStorage.getItem(KEY);
    if(!raw)return;
    const save=JSON.parse(raw);
    if(!save||typeof save!=='object')return;
    let changed=false;
    ['started','dialogue','saved'].forEach(k=>{
      if(Object.prototype.hasOwnProperty.call(save,k)){delete save[k];changed=true;}
    });
    if(changed)localStorage.setItem(KEY,JSON.stringify(save));
  }catch(_){
    // Un guardado corrupto no debe impedir que el juego arranque.
  }
  const V=window.VillaPelon||(window.VillaPelon={});
  V.saveMigration={version:'64.0.0',transientFieldsRemoved:true};
})();
