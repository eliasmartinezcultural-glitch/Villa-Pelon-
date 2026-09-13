/* VILLA PELÓN V152 — ATLAS DE CONOCIMIENTO
   Registro persistente de lo aprendido. No modifica geometría.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const A={version:'152.0',sealed:true,entries:[
{id:'welcome',act:'llegada',title:'El pueblo se aprende caminando',body:'Villa Pelón se presenta como un territorio vivo: lugares, personas, caminos y pequeñas actividades forman una historia común.',source:'narrative',fiction:false},
{id:'community',act:'huellas',title:'Las voces no son todas iguales',body:'Dos habitantes pueden recordar un mismo lugar de maneras diferentes. Escuchar no significa aceptar automáticamente una versión como hecho.',source:'narrative',fiction:false},
{id:'school',act:'huellas',title:'La escuela como memoria',body:'Una escuela puede conservar nombres, fotografías, documentos, actos y recuerdos de generaciones.',source:'historical-reference',fiction:false},
{id:'water',act:'territorio',title:'El agua transforma el paisaje',body:'El riego permite estudiar la relación entre agua, tierra, producción y crecimiento comunitario.',source:'historical-reference',fiction:false},
{id:'production',act:'territorio',title:'Producción e identidad',body:'La actividad productiva no es solamente economía: también puede formar paisajes, celebraciones, oficios y recuerdos.',source:'historical-reference',fiction:false},
{id:'work',act:'territorio',title:'El trabajo rural también cuenta',body:'Las personas que trabajan el territorio forman parte de la memoria social del lugar.',source:'historical-reference',fiction:false},
{id:'river',act:'territorio',title:'El río organiza el espacio',body:'El agua puede funcionar como límite, recurso y referencia para comprender caminos, puentes y recorridos.',source:'world-observation',fiction:false},
{id:'picada21',act:'territorio',title:'Más allá del núcleo',body:'Picada 21 representa el paso desde el núcleo urbano hacia un paisaje más rural y disperso.',source:'world-observation',fiction:false},
{id:'sources',act:'memoria',title:'Cada fuente responde preguntas distintas',body:'Una memoria oral aporta experiencia; una fotografía aporta una imagen fechable si puede contextualizarse; una cronología ordena acontecimientos; un documento institucional puede respaldar determinados datos.',source:'research-method',fiction:false},
{id:'research',act:'memoria',title:'Investigar es relacionar',body:'Una buena investigación conecta afirmación, fuente, contraste y conclusión, y deja visibles las dudas que todavía permanecen.',source:'research-method',fiction:false},
{id:'fiction',act:'memoria',title:'La ficción también enseña',body:'Los personajes y encuentros creados para el juego pueden transmitir valores y preguntas sin hacerse pasar por acontecimientos históricos reales.',source:'narrative-rule',fiction:false},
{id:'open',act:'futuro',title:'El conocimiento abre nuevas preguntas',body:'Completar una campaña no significa saberlo todo. Significa tener herramientas para seguir observando, preguntando y buscando fuentes.',source:'campaign-rule',fiction:false}
]};
V.knowledgeAtlas=A;
V.runtimeAudit=Object.assign(V.runtimeAudit||{},{knowledgeAtlas:true,knowledgeAtlasVersion:'152.0',geometryLocked:true});
window.dispatchEvent(new CustomEvent('villa-pelon-knowledge-atlas-ready',{detail:{version:'152.0'}}));
})();
