/* Villa Pelón CORE MOBILE v1.0 — puente único de entrada para juego por WhatsApp. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const M={version:'1.0.0',online:true,mode:'link-to-play',touch:true};
const state=()=>V.gameState||{};
function repair(){const s=state();if(!s)return; if(!Number.isFinite(Number(s.x))||!Number.isFinite(Number(s.y))){s.x=960;s.y=700} s.x=Number(s.x);s.y=Number(s.y);s.energy=Math.max(0,Math.min(100,Number.isFinite(Number(s.energy))?Number(s.energy):100));s.money=Number.isFinite(Number(s.money))?Number(s.money):10000;s.minutes=Number.isFinite(Number(s.minutes))?Number(s.minutes):480;s.day=Math.max(1,Number.isFinite(Number(s.day))?Number(s.day):1);s.inventory=Array.isArray(s.inventory)?s.inventory:[];s.facing=['up','down','left','right'].includes(s.facing)?s.facing:'down'}
function boot(){repair();document.documentElement.classList.add('vp-mobile-ready');window.dispatchEvent(new CustomEvent('villa-pelon-mobile-ready',{detail:M}))}
V.mobileRuntime=M;V.mobileRuntime.repair=repair;if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
addEventListener('pagehide',()=>V.player?.clear?.(),{passive:true});addEventListener('blur',()=>V.player?.clear?.(),{passive:true});
})();
