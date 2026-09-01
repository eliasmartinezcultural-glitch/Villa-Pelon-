/* V4 language bridge — translates core visible HUD after settings change. */
(()=>{'use strict';
const labels={es:{day:'DÍA',time:'HORA',money:'DINERO',energy:'ENERGÍA',weather:'CLIMA',save:'GUARDAR',interact:'INTERACTUAR',next:'SEGUIR'},en:{day:'DAY',time:'TIME',money:'MONEY',energy:'ENERGY',weather:'WEATHER',save:'SAVE',interact:'INTERACT',next:'NEXT'},pt:{day:'DIA',time:'HORA',money:'DINHEIRO',energy:'ENERGIA',weather:'CLIMA',save:'SALVAR',interact:'INTERAGIR',next:'CONTINUAR'}};
let last='';
function apply(){let lang='es';try{lang=JSON.parse(localStorage.getItem('villa_pelon_v4_settings')||'{}').language||'es'}catch(_){}if(lang===last)return;last=lang;const l=labels[lang]||labels.es;const stats=document.querySelectorAll('#hud .stat');if(stats.length>=5){stats[0].childNodes[0].textContent=l.day+' ';stats[1].childNodes[0].textContent=l.time+' ';stats[2].childNodes[0].textContent='$ ';stats[3].childNodes[0].textContent=l.energy+' ';stats[4].childNodes[0].textContent=l.weather+' '}const save=document.getElementById('save');if(save)save.textContent=l.save;const inter=document.getElementById('interact');if(inter)inter.setAttribute('aria-label',l.interact);const next=document.getElementById('dialogueNext');if(next)next.textContent=l.next;document.documentElement.lang=lang==='pt'?'pt':lang==='en'?'en':'es'}
setInterval(apply,700);apply();
})();
