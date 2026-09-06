/* VILLA PELÓN V64 — misiones y arco narrativo.
   Diseño: descubrir una historia territorial mediante personas, lugares y evidencias.
   Regla: ningún dato ficticio se presenta como hecho histórico comprobado. */
window.VillaPelon=window.VillaPelon||{};
window.VillaPelon.missionData={
 version:'V64',
 chapterOrder:['agua','primeras_chacras','comunidad','frutales','vino','memoria_viva'],
 chapters:[
  {id:'agua',title:'Donde empieza el agua',tone:'descubrimiento',summary:'Antes de entender el pueblo hay que entender cómo el agua transformó el paisaje.',missions:[
   {id:'agua_01',title:'El canal que nadie mira',goal:'Encontrá el tramo viejo del canal y hablá con una persona que conozca su recorrido.',steps:['visitar:canal_viejo','hablar:raul','observar:compuerta'],evidence:'plano_riego_01',reward:{money:400,item:'cuaderno_del_riego'},status:'documental_pendiente'},
   {id:'agua_02',title:'La tierra cambia',goal:'Compará una parcela seca con una parcela productiva y descubrí qué papel cumple el riego.',steps:['visitar:las_chacras','observar:acequia','hablar:marta'],evidence:'testimonio_riego_01',reward:{money:650,item:'fotografia_acequia'},status:'documental_pendiente'}
  ]},
  {id:'primeras_chacras',title:'Cuando llegaron las chacras',tone:'trabajo',summary:'La transformación del paisaje también fue una transformación de la vida cotidiana.',missions:[
   {id:'chacras_01',title:'Una jornada de trabajo',goal:'Acompañá una tarea rural desde el galpón hasta la parcela.',steps:['visitar:galpon','tomar_herramienta','hacer:trabajo_rural','entregar:cajon'],evidence:'objeto_herramienta_01',reward:{money:850,item:'libreta_de_jornal'},status:'documental_pendiente'},
   {id:'chacras_02',title:'Las primeras cosechas',goal:'Reconstruí qué se producía en los primeros años de la transformación agrícola.',steps:['hablar:pedro','buscar:archivo_escuela','visitar:chacras'],evidence:'registro_cosecha_01',reward:{money:900,item:'foto_cosecha'},status:'documental_pendiente'}
  ]},
  {id:'comunidad',title:'Un pueblo se hace entre todos',tone:'comunidad',summary:'La historia deja de ser solamente paisaje cuando aparecen escuela, comercio, radio, club y vecinos.',missions:[
   {id:'comunidad_01',title:'La escuela guarda memoria',goal:'Encontrá una fotografía o documento que permita reconstruir una escena de la vida escolar.',steps:['visitar:escuela','hablar:lucia','encontrar:foto_escolar'],evidence:'foto_escuela_01',reward:{money:700,item:'fotografia_escolar'},status:'documental_pendiente'},
   {id:'comunidad_02',title:'La voz del pueblo',goal:'Visitá la radio y reuní tres recuerdos de vecinos.',steps:['visitar:radio','hablar:nico','hablar:marta','hablar:raul'],evidence:'testimonios_orales_01',reward:{money:1000,item:'archivo_de_voces'},status:'documental_pendiente'}
  ]},
  {id:'frutales',title:'El tiempo de los frutos',tone:'cotidiano',summary:'El calendario rural organiza el trabajo, las compras, los encuentros y las fiestas.',missions:[
   {id:'frutales_01',title:'Temporada',goal:'Seguí una jornada de cosecha y descubrí cómo cambia el pueblo durante la temporada.',steps:['visitar:chacras','hacer:cosecha','entregar:cajon','escuchar:radio'],evidence:'calendario_cosecha_01',reward:{money:1200,item:'calendario_rural'},status:'documental_pendiente'}
  ]},
  {id:'vino',title:'La nueva identidad productiva',tone:'transformacion',summary:'Con el tiempo aparecen nuevos cultivos, bodegas y otra forma de mirar el paisaje.',missions:[
   {id:'vino_01',title:'Entre hileras',goal:'Recorré Los Viñedos y hablá con alguien que explique el trabajo de una vendimia.',steps:['visitar:los_vinedos','hablar:pedro','observar:bodega_la_ribera'],evidence:'registro_vinedo_01',reward:{money:1500,item:'etiqueta_de_villa_pelon'},status:'documental_pendiente'}
  ]},
  {id:'memoria_viva',title:'Lo que todavía se recuerda',tone:'memoria',summary:'El final del recorrido no entrega una única verdad: reúne documentos, voces y lugares para que el jugador arme su propia memoria.',missions:[
   {id:'memoria_01',title:'El archivo de Villa Pelón',goal:'Reuní seis evidencias y organizalas en el Archivo de Memoria.',steps:['coleccionar:6_evidencias','visitar:escuela','visitar:radio','visitar:plaza'],evidence:'archivo_final',reward:{money:3000,item:'archivo_de_memoria'},status:'documental_pendiente'}
  ]}
 ],
 evidenceRules:{real:'Una evidencia histórica real requiere fuente verificable antes de presentarse como hecho.',oral:'Los testimonios se conservan como testimonios, diferenciándolos de hechos documentales.',fiction:'La ambientación ficticia puede ampliar el mundo, pero se marca internamente como ficción.',translation:'La investigación del territorio real se transforma en nombres, personajes y espacios ficticios propios de Villa Pelón.'}
};
