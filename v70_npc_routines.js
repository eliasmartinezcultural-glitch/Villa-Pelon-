/* Villa Pelón V70 — rutinas territoriales simples para NPCs existentes. */
(()=>{'use strict';const V=window.VillaPelon||(window.VillaPelon={});const R={version:'V70',plans:{}};V.npcRoutines70=R;
function hour(){return Number(V.worldState?.time)||8}
function choose(n){const h=hour();if(!n)return null;const name=(n.name||n.id||'').toLowerCase();if(name.includes('marta'))return h<13?'radio':'home';if(name.includes('raul'))return h<12?'rural':'shop';if(name.includes('luc'))return h<14?'school':'plaza';if(name.includes('pedro'))return h<18?'rural':'home';if(name.includes('nico'))return h<10?'school':h<17?'plaza':'home';return h<8||h>=21?'home':'plaza'}
R.activityFor=choose;R.locationFor=(n)=>({home:{x:900,y:575},radio:{x:1215,y:430},school:{x:580,y:420},shop:{x:1650,y:440},plaza:{x:1160,y:430},rural:{x:2145,y:1025}})[choose(n)]||null;
})();