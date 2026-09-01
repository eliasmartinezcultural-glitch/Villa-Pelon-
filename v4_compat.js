/* Villa Pelón V4 — COMPATIBILIDAD Y MIGRACIÓN */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),K=V.v4||(V.v4={version:4});
const copy=(a,b)=>{try{const x=localStorage.getItem(a);if(x&&!localStorage.getItem(b))localStorage.setItem(b,x)}catch(_){} };
copy('villa_pelon_v3_save','villa_pelon_v4_save');copy('villa_pelon_v3_world','villa_pelon_v4_world');copy('villa_pelon_v2_save','villa_pelon_v4_save');copy('villa_pelon_v2_story','villa_pelon_v4_story');
function install(){
 if(!V.engine||V.engine.__v4Compat)return false;V.engine.__v4Compat=true;
 const baseSave=V.engine.save,baseLoad=V.engine.load;
 V.engine.save=()=>{V.state.version=4;baseSave?.();try{localStorage.setItem('villa_pelon_v4_save',JSON.stringify({...V.state,version:4}))}catch(_){} };
 V.engine.load=()=>{baseLoad?.();V.state.version=4;try{const x=JSON.parse(localStorage.getItem('villa_pelon_v4_save')||'null');if(x)Object.assign(V.state,x,{version:4})}catch(_){} };
 K.modules=K.modules||{};K.modules.compat={version:4,saveKey:'villa_pelon_v4_save',worldKey:'villa_pelon_v4_world'};
 setInterval(()=>{if(V.state)V.state.version=4;copy('villa_pelon_v3_save','villa_pelon_v4_save');copy('villa_pelon_v3_world','villa_pelon_v4_world')},1000);
 return true;
}
const wait=()=>install()||requestAnimationFrame(wait);wait();
})();