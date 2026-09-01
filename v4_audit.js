/* Villa Pelón V4 — AUDITORÍA QUIRÚRGICA 421
   Diagnóstico de arquitectura, conexiones, plataforma y estado.
   No crea motor, RAF ni listeners de juego.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const A=V.audit421={version:1,checks:[],ok:false};
const check=(id,pass,detail)=>A.checks.push({id,pass:!!pass,detail:String(detail||'')});
function run(){
 A.checks.length=0;
 const scripts=[...document.scripts].map(s=>(s.src||'').split('/').pop().split('?')[0]);
 const count=n=>scripts.filter(x=>x===n).length;
 check('canvas',!!document.getElementById('world'),'canvas #world presente');
 check('engine',!!V.engine&&typeof V.engine.render==='function','motor principal y render disponibles');
 check('state',!!V.state&&V.state.version===4,'estado V4 activo');
 check('world',!!V.world&&V.world.version===4,'mundo V4 activo');
 check('playability',!!V.v4Playability?.authority,'jugabilidad V4 conectada');
 check('characters',!!V.v4Characters,'personajes V4 conectados');
 check('life',!!V.life,'sistema de vida conectado');
 check('mobile',!!V.platform||!!V.mobilePro,'capa móvil conectada');
 check('visual',!!V.visualPower,'Visual Power cargado');
 check('single_game',count('game.js')===1,'game.js cargado una sola vez');
 check('single_visual',count('v4_visual_power.js')<=1,'Visual Power sin duplicación');
 check('no_v3_runtime',!scripts.includes('v3.js')&&!scripts.includes('v3_world.js'),'runtime V3 no cargado');
 check('no_duplicate_mobile',!scripts.includes('v4_mobile.js'),'capa móvil antigua no cargada');
 check('no_duplicate_gameplay',!scripts.includes('v4_gameplay.js'),'compatibilidad gameplay antigua no cargada');
 check('raf_owner',scripts.includes('game.js'),'game.js es el propietario del ciclo');
 const bad=A.checks.filter(x=>!x.pass);
 A.ok=bad.length===0;
 A.timestamp=Date.now();
 A.summary=A.ok?'AUDITORÍA OK':'FALLAS: '+bad.map(x=>x.id).join(', ');
 if(V.v4)V.v4.audit=A;
 console.info('[Villa Pelón] AUDITORÍA 421',A.summary,A.checks);
 return A;
}
function boot(){run();setTimeout(run,250);setTimeout(run,1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
