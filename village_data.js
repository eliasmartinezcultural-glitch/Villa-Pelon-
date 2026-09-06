/* VILLA PELÓN V63 — mundo y contenido territorial.
   El territorio es una ficción coherente inspirada en un valle rural norpatagónico real.
   El nombre de la localidad real de referencia no forma parte del juego. */
window.VillaPelon=window.VillaPelon||{};
window.VillaPelon.villageData={
 version:'V63',
 setting:{name:'Villa Pelón',region:'valle irrigado de la estepa patagónica',tone:'pueblo pequeño, cotidiano, silencioso y vivo',objective:'reconstruir la historia mediante misiones, testimonios, documentos, objetos y lugares',identity:'territorio ficticio inspirado en una localidad rural real; el nombre real permanece fuera de la experiencia'},
 intro:{title:'VILLA PELÓN · DONDE EL AGUA GUARDA LA MEMORIA',text:'Villa Pelón está en un valle seco donde el agua hizo posible la vida. Alrededor de los canales crecieron las chacras, los frutales, los viñedos, los galpones y las casas. Con el tiempo aparecieron caminos, comercios, una escuela, una radio y nuevas formas de trabajo. Pero la historia del pueblo nunca quedó guardada en un solo lugar: está repartida entre las personas, las fotografías, los papeles, las herramientas y el paisaje.',objective:'Tu objetivo es descubrir esa historia. Caminá por el pueblo, conocé a sus vecinos, ayudá en las chacras, entrá en comercios y edificios, seguí caminos rurales y reuní evidencias. Cada misión completa una pequeña parte de la memoria de Villa Pelón.',rule:'Villa Pelón es el nombre del mundo del juego. Los hechos históricos que inspiran sus misiones se investigan y documentan por separado. La ficción de ambientación nunca se presenta como historia real.'},
 districts:[
  {id:'centro',name:'Centro',description:'Plaza, almacenes, panadería, ferretería y movimiento cotidiano.'},
  {id:'residencial',name:'Barrio de casas',description:'Casas bajas, patios, árboles, veredas, perros y conversaciones de vecinos.'},
  {id:'chacras',name:'Las Chacras',description:'Frutales, hileras de viña, canales de riego, acequias, herramientas y trabajo de temporada.'},
  {id:'vinedos',name:'Los Viñedos',description:'Parcelas productivas, caminos internos, galpones y una bodega pequeña vinculada a la comunidad.'},
  {id:'ribera',name:'Ribera del Río Pelón',description:'Agua, vegetación, senderos y espacios abiertos donde el pueblo cambia de ritmo.'},
  {id:'meseta',name:'La Meseta',description:'Terreno seco y abierto, viento, caminos de tierra y horizonte patagónico.'},
  {id:'servicios',name:'Servicios y comunidad',description:'Escuela, radio y espacios donde se organiza la vida colectiva.'}
 ],
 landmarks:[
  {id:'plaza',name:'Plaza del Pueblo',district:'centro',activity:'encuentro'},
  {id:'almacen',name:'Almacén El Encuentro',district:'centro',activity:'comercio'},
  {id:'panaderia',name:'Panadería La Esquina',district:'centro',activity:'comercio'},
  {id:'ferreteria',name:'Ferretería del Valle',district:'centro',activity:'herramientas'},
  {id:'escuela',name:'Escuela de Villa Pelón',district:'servicios',activity:'educacion'},
  {id:'radio',name:'Radio Oasis',district:'servicios',activity:'comunicacion'},
  {id:'galpon',name:'Galpón Rural',district:'chacras',activity:'trabajo'},
  {id:'chacras',name:'Las Chacras',district:'chacras',activity:'produccion'},
  {id:'vinedos',name:'Los Viñedos',district:'vinedos',activity:'produccion'},
  {id:'bodega',name:'Bodega La Ribera',district:'vinedos',activity:'vitivinicultura'},
  {id:'canal',name:'Canal Viejo',district:'chacras',activity:'riego'},
  {id:'ribera',name:'Ribera del Río Pelón',district:'ribera',activity:'exploracion'},
  {id:'meseta',name:'La Meseta',district:'meseta',activity:'exploracion'},
  {id:'camino_alamos',name:'Camino de los Álamos',district:'meseta',activity:'circulacion'}
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
 environmentalDetails:['acequias','canales','cortinas de álamos','suelo seco y pedregoso','viento','polvo de camino','hileras de viña','frutales','galpones rurales','horizonte abierto'],
 educationalRule:'Los hechos históricos reales deben tener fuente verificable. Las historias ficticias deben identificarse como ficción.',
 sourceModel:'La investigación histórica externa se transforma en evidencias jugables sin introducir el nombre real de la localidad de referencia en la experiencia de Villa Pelón.'
};
