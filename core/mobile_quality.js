/* Villa Pelón CORE MOBILE QUALITY v1.0 — ergonomía y seguridad de entrada. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const Q={version:'1.0.0',target:'mobile-link',minTouch:44,orientation:'any',safeArea:true,noZoom:true};
function boot(){document.documentElement.classList.add('vp-mobile-quality');const canvas=document.getElementById('world');if(canvas){canvas.setAttribute('role','img');canvas.setAttribute('aria-label','Mundo de Villa Pelón');}document.querySelectorAll('button').forEach(b=>{b.style.webkitTapHighlightColor='transparent';});window.dispatchEvent(new CustomEvent('villa-pelon-mobile-quality-ready',{detail:Q}));}
V.mobileQuality=Q;if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
