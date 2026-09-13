/* VILLA PELÓN V153 — BIBLIA NARRATIVA
   Contrato de continuidad para futuras historias y NPC.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const B={version:'153.0',sealed:true,theme:'Un pueblo se comprende a través de sus personas, su territorio y su memoria.',tone:['cálido','curioso','humano','rural','misterioso sin exageración'],forbidden:['villano artificial que domine toda la historia','catástrofe permanente','misiones sin relación con Villa Pelón','exposición histórica larga sin interacción','NPC intercambiables'],
arc:{protagonist:{function:'observador-investigador',growth:['orientarse','escuchar','relacionar','contrastar','contar']},community:{rule:'cada personaje aporta una mirada parcial; la verdad histórica se construye con evidencia'},ending:'la campaña termina abriendo nuevas preguntas y rutas de investigación'},
characters:[
{id:'marta',role:'vecina y memoria cotidiana',knowledge:'vida diaria',arc:'de bienvenida a testigo recurrente'},
{id:'celso',role:'vecino conversador',knowledge:'nombres e identidad',arc:'ayuda a distinguir recuerdo de fuente'},
{id:'nico',role:'joven del pueblo',knowledge:'presente y curiosidad',arc:'formula preguntas que el jugador debe investigar'},
{id:'lucia',role:'referente comunitaria',knowledge:'relaciones y vida social',arc:'conecta personas y recuerdos'},
{id:'julia',role:'vínculo con la escuela',knowledge:'educación y memoria',arc:'enseña cómo una institución conserva rastros'},
{id:'mateo',role:'trabajador rural',knowledge:'agua, producción y territorio',arc:'conecta paisaje con trabajo'},
{id:'tomas',role:'productor',knowledge:'actividad productiva',arc:'muestra que producir también transforma identidad'},
{id:'rosa',role:'trabajadora y memoria del trabajo',knowledge:'oficios y celebraciones',arc:'lleva al jugador desde producción hacia memoria social'},
{id:'raul',role:'voz vinculada a comunicación',knowledge:'relatos y difusión',arc:'plantea el problema de cómo se cuenta una historia'},
{id:'amalia',role:'guardiana del archivo',knowledge:'fuentes e investigación',arc:'convierte al jugador en investigador'}
],
chapterRule:'Cada capítulo debe cambiar lo que el jugador comprende del anterior. Ningún capítulo debe ser un simple paseo decorativo.',
continuity:'Los hechos canónicos, relaciones, conocimientos desbloqueados y decisiones importantes deben registrarse; futuras misiones no pueden contradecirlos silenciosamente.'};
V.storyBible=B;
V.runtimeAudit=Object.assign(V.runtimeAudit||{},{storyBible:true,storyBibleVersion:'153.0',geometryLocked:true});
window.dispatchEvent(new CustomEvent('villa-pelon-story-bible-ready',{detail:{version:'153.0'}}));
})();
