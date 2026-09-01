/* Datos de contenido para el mundo de Villa Pelón. Separados del motor para poder ampliar el juego sin reescribirlo. */
window.VillaPelon = window.VillaPelon || {};
window.VillaPelon.villageData = {
  commerces:[
    {id:'almacen',name:'Almacén El Encuentro',category:'comercio',products:[['pan',120],['yerba',900],['azucar',700],['comestibles',600]]},
    {id:'ferreteria',name:'Ferretería Rural',category:'herramientas',products:[['pala',4500],['azada',3800],['tijera de podar',5200],['llave inglesa',6500]]},
    {id:'panaderia',name:'Panadería',category:'alimentos',products:[['pan',120],['tortas fritas',350],['facturas',500]]}
  ],
  ruralActivities:['cosecha','riego','poda','reparación de herramientas','cuidado de animales','carga de cajones'],
  dailyLife:['tomar mate','comprar pan','ir al almacén','caminar por la plaza','escuchar la radio','visitar vecinos','hacer compras','descansar'],
  vehicles:['auto','camioneta','tractor','camión','bicicleta'],
  animals:['vaca','caballo','gallina'],
  tools:['pala','azada','tijera de podar','cajón de cosecha','llave inglesa'],
  educationalRule:'Los hechos históricos reales deben tener fuente verificable. Las historias ficticias deben identificarse como ficción.'
};
