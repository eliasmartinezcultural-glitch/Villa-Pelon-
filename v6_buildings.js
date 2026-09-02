/* Villa Pelón V6.0 — POBLAMIENTO FINO
   Completa el mapa expandido con arquitectura funcional y variada.
   Usa la misma lista V.buildings del motor para conservar colisión e interacción. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
if(!Array.isArray(V.buildings))return;
const existing=new Set(V.buildings.map(b=>`${b.x}:${b.y}:${b.type}`));
const add=(b)=>{const k=`${b.x}:${b.y}:${b.type}`;if(!existing.has(k)){V.buildings.push({...b,collision:true,interactable:true});existing.add(k)}};
[
{x:3660,y:420,w:260,h:170,label:'CASA DE BARRIO',type:'home'},
{x:4020,y:420,w:310,h:185,label:'CASA FAMILIAR',type:'home'},
{x:4380,y:420,w:240,h:160,label:'CASA',type:'home'},
{x:4700,y:420,w:330,h:190,label:'CASA FAMILIAR',type:'home'},
{x:3660,y:1030,w:330,h:190,label:'PANADERÍA DEL VALLE',type:'bakery'},
{x:4080,y:1030,w:250,h:165,label:'FERRETERÍA',type:'shop'},
{x:4400,y:1030,w:280,h:175,label:'DESPENSA DEL BARRIO',type:'shop'},
{x:4750,y:1030,w:260,h:170,label:'CASA',type:'home'},
{x:5200,y:680,w:290,h:180,label:'CASA',type:'home'},
{x:5530,y:680,w:360,h:200,label:'TALLER MECÁNICO',type:'rural'},
{x:5200,y:1080,w:270,h:170,label:'CASA',type:'home'},
{x:5530,y:1080,w:300,h:185,label:'CASA',type:'home'},
{x:3300,y:2100,w:360,h:210,label:'SALÓN VECINAL',type:'public'},
{x:3750,y:2100,w:300,h:185,label:'CASA',type:'home'},
{x:4120,y:2100,w:270,h:175,label:'CASA',type:'home'},
{x:4460,y:2100,w:330,h:190,label:'TALLER RURAL',type:'rural'},
{x:4860,y:2100,w:290,h:180,label:'CASA',type:'home'},
{x:5220,y:2100,w:340,h:195,label:'CASA',type:'home'},
{x:5800,y:3000,w:430,h:250,label:'GALPÓN DE CHACRA',type:'rural'},
{x:6350,y:3300,w:500,h:270,label:'BODEGA Y DEPÓSITO',type:'rural'},
{x:7000,y:3650,w:380,h:230,label:'GALPÓN DE PRODUCCIÓN',type:'rural'},
{x:7550,y:4200,w:320,h:200,label:'CASA RURAL',type:'home'},
{x:6750,y:4500,w:300,h:190,label:'CASA RURAL',type:'home'},
{x:5850,y:4550,w:350,h:210,label:'GALPÓN',type:'rural'}
].forEach(add);
V.buildingRegistryV6={version:1,added:true,count:V.buildings.length,features:['expanded-neighborhoods','commerce','services','rural-buildings','varied-homes','functional-collision']};
})();
