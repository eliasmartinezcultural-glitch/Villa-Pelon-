/* VILLA PELÓN V69 — mundo y contenido territorial.
   Villa Pelón es el nombre de la experiencia jugable.
   Su contexto histórico de referencia es San Patricio del Chañar, Neuquén.
   Los hechos históricos incorporados al juego deben conservar fuente verificable.
*/
window.VillaPelon=window.VillaPelon||{};
window.VillaPelon.villageData={
 version:'V69',
 setting:{name:'Villa Pelón',realHistoricalReference:'San Patricio del Chañar, Neuquén',region:'valle irrigado de la estepa patagónica',tone:'pueblo pequeño, cotidiano, rural y vivo',objective:'recorrer el territorio y reconstruir su historia mediante misiones, testimonios, documentos, objetos y lugares'},
 intro:{title:'VILLA PELÓN · UNA HISTORIA NACIDA DEL TERRITORIO',text:'Villa Pelón toma su nombre dentro del juego, pero su punto de partida histórico es San Patricio del Chañar, en el valle del río Neuquén. La historia real de ese territorio está ligada al agua, al trabajo rural, a las chacras, al crecimiento de una comunidad y a la transformación productiva del valle.',objective:'El juego comienza con ese contexto real y después construye una experiencia narrativa propia. Cuando aparezca un hecho histórico, deberá estar documentado; cuando aparezca ficción, deberá estar identificada como ficción.',rule:'Villa Pelón es el universo jugable. San Patricio del Chañar es la referencia histórica real que guía la investigación.'},
 historicalContext:{
  place:'San Patricio del Chañar, Neuquén, Argentina',
  facts:[
   {year:'1898',text:'La familia Gasparri, vinculada al origen del nombre San Patricio, emigró desde Italia hacia el entonces Territorio del Neuquén.',source:'Gobierno de la Provincia del Neuquén'},
   {year:'1968',text:'Roberto Gasparri adquirió grandes extensiones de tierra en el área del Chañar y comenzó el proceso que llevaría a la transformación productiva del valle.',source:'CFI / estudios sobre la dinámica agraria de San Patricio del Chañar'},
   {year:'1969–1971',text:'Se desarrollaron obras de riego y sistematización que permitieron poner tierras en producción mediante agua vinculada al río Neuquén.',source:'CFI / documentación histórica y productiva'},
   {year:'1973',text:'El 21 de mayo se creó la Comisión de Fomento de San Patricio del Chañar mediante el Decreto Provincial 1339.',source:'Gobierno de la Provincia del Neuquén / Dirección Provincial de Estadística y Censos'},
   {year:'1974',text:'Comenzó a funcionar la Comisión de Fomento y se inauguraron obras iniciales de infraestructura; también se organizó el sistema de riego local.',source:'Gobierno de la Provincia del Neuquén'},
   {year:'Producción',text:'El territorio desarrolló una fuerte identidad frutícola y posteriormente un importante polo vitivinícola.',source:'Gobierno de la Provincia del Neuquén / CFI'},
   {year:'Paleontología',text:'En el área de la bodega Familia Schroeder se hallaron restos fósiles atribuidos a Panamericansaurus schroederi, un dinosaurio que vivió hace aproximadamente 72 millones de años.',source:'Legislatura de la Provincia del Neuquén'}
  ],
  note:'Estos datos son contexto histórico para el juego. No deben convertirse automáticamente en diálogos o misiones sin conservar su fuente y distinguir evidencia de ficción.'
 },
 districts:[
  {id:'centro',name:'Centro',description:'Plaza, comercios, escuela, radio y circulación cotidiana.'},
  {id:'barrio',name:'Barrio',description:'Casas, patios, árboles, veredas y vida vecinal. Las viviendas quedan fuera de las rutas principales.'},
  {id:'rural',name:'Rural / chacras',description:'Frutales, viñedos, canales, galpones, herramientas y caminos productivos.'},
  {id:'rio',name:'Río y ribera',description:'El río es un elemento territorial mayor: agua, borde natural, vegetación y espacios abiertos.'},
  {id:'bodega',name:'Zona de bodega y viñedos',description:'Viñedos, caminos internos, bodega y futuras misiones sobre la transformación vitivinícola.'},
  {id:'meseta',name:'Meseta y campo abierto',description:'Suelo seco, viento, horizonte patagónico y sitios de investigación paleontológica.'},
  {id:'servicios',name:'Servicios y comunidad',description:'Escuela, radio y espacios donde se organiza la vida colectiva.'}
 ],
 landmarks:[
  {id:'plaza',name:'Plaza del Pueblo',district:'centro',activity:'encuentro'},
  {id:'almacen',name:'Almacén El Encuentro',district:'centro',activity:'comercio'},
  {id:'panaderia',name:'Panadería La Esquina',district:'barrio',activity:'comercio'},
  {id:'ferreteria',name:'Ferretería del Valle',district:'barrio',activity:'herramientas'},
  {id:'escuela',name:'Escuela de Villa Pelón',district:'servicios',activity:'educacion'},
  {id:'radio',name:'Radio Oasis',district:'servicios',activity:'comunicacion'},
  {id:'galpon',name:'Galpón Rural',district:'rural',activity:'trabajo'},
  {id:'chacras',name:'Las Chacras',district:'rural',activity:'produccion'},
  {id:'vinedos',name:'Los Viñedos',district:'bodega',activity:'produccion'},
  {id:'bodega',name:'Bodega La Ribera',district:'bodega',activity:'vitivinicultura'},
  {id:'canal',name:'Canal de Riego',district:'rural',activity:'riego'},
  {id:'ribera',name:'Ribera del Río',district:'rio',activity:'exploracion'},
  {id:'fossils',name:'Sitio de fósiles',district:'meseta',activity:'paleontologia'},
  {id:'meseta',name:'La Meseta',district:'meseta',activity:'exploracion'}
 ],
 rules:[
  'Las rutas son corredores de circulación: no se colocan casas sobre ellas.',
  'El barrio concentra viviendas; las zonas rurales concentran chacras, galpones, viñedos y caminos productivos.',
  'El río funciona como elemento natural del mapa y no como suelo edificable.',
  'Los sitios fósiles son puntos de investigación, no lugares para inventar hallazgos.',
  'Los hechos históricos reales necesitan fuente verificable.',
  'La ficción de Villa Pelón debe estar diferenciada de la historia real de San Patricio del Chañar.'
 ],
 commerces:[
  {id:'almacen',name:'Almacén El Encuentro',category:'comercio',products:[['pan',120],['yerba',900],['azucar',700],['comestibles',600]]},
  {id:'ferreteria',name:'Ferretería del Valle',category:'herramientas',products:[['pala',4500],['azada',3800],['tijera de podar',5200],['llave inglesa',6500]]},
  {id:'panaderia',name:'Panadería La Esquina',category:'alimentos',products:[['pan',120],['tortas fritas',350],['facturas',500]]}
 ],
 ruralActivities:['cosecha','riego','poda','mantenimiento de canales','reparación de herramientas','cuidado de animales','carga de cajones','trabajo en viña','mantenimiento de galpón'],
 dailyLife:['tomar mate','comprar pan','ir al almacén','caminar por la plaza','escuchar la radio','visitar vecinos','hacer compras','regar','trabajar en la chacra','caminar junto al canal','descansar','volver a casa'],
 vehicles:['auto','camioneta','tractor','camión','bicicleta','carro de trabajo'],
 animals:['vaca','caballo','gallina','perro','gato'],
 vegetation:['álamo','chañar','frutales','vid','arbustos de ribera','cortina de álamos'],
 tools:['pala','azada','tijera de podar','cajón de cosecha','llave inglesa','manguera de riego'],
 environmentalDetails:['río Neuquén','acequias','canales','cortinas de álamos','suelo seco y pedregoso','viento','polvo de camino','hileras de viña','frutales','galpones rurales','horizonte abierto'],
 educationalRule:'Los hechos históricos reales deben tener fuente verificable. Las historias ficticias deben identificarse como ficción.',
 sourceModel:'La investigación histórica real se transforma en evidencias jugables sin confundir el universo ficticio Villa Pelón con la localidad histórica San Patricio del Chañar.'
};
