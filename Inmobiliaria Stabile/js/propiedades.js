/* ==========================================================================
   STABILE INMOBILIARIA — Base de datos de propiedades
   --------------------------------------------------------------------------
   TODA la información del sitio vive acá. Para publicar una propiedad nueva,
   copiá un objeto completo, pegalo en el array y editá los valores.
   No hace falta tocar el HTML: el listado, los filtros, el select de barrios
   y las fichas individuales se generan solos desde este archivo.

   Ver README.md → "Cómo agregar una propiedad" para el detalle de cada campo.
   ========================================================================== */

const PROPIEDADES = [
  {
    id: 'STB-001',
    operacion: 'venta',
    tipo: 'departamento',
    titulo: 'Departamento 2 dormitorios en Barrio Alberdi',
    direccion: 'Coronel Agustín Olmedo 73, 3er piso',
    barrio: 'Alberdi',
    precio: 63000,
    moneda: 'USD',
    expensas: null,
    dormitorios: 2,
    banos: 1,
    cochera: false,
    destacada: true,
    caracteristicas: [
      'Totalmente amoblado',
      'Dormitorios con placard',
      'Living-comedor amplio amoblado',
      'Aire acondicionado',
      'Calefactor',
      'Cocina equipada',
      'Lavadero',
      'Baño con mampara',
      'Balcón',
      'Expensas bajas',
      'Listo para escriturar',
    ],
    descripcion:
      'Departamento de dos dormitorios en el corazón de Barrio Alberdi, sobre calle Coronel Agustín Olmedo, en un tercer piso tranquilo y luminoso. Se entrega totalmente amoblado y en condiciones de habitarse desde el primer día. Ambos dormitorios cuentan con placard y el living-comedor es amplio, ya amoblado, con aire acondicionado y calefactor para resolver las dos estaciones. La cocina está equipada y tiene lavadero independiente, algo poco frecuente en unidades de esta superficie. El baño es completo, con mampara, y el balcón suma un espacio exterior propio. Las expensas son bajas y la documentación está en regla: la unidad está lista para escriturar, sin trámites pendientes ni deudas. Una opción concreta tanto para vivienda propia como para renta, en una zona con demanda sostenida de alquiler por su cercanía a la Universidad y al centro.',
    cercanias: [
      'A 900 m del Shopping Nuevo Centro',
      'A 300 m de Plaza Colón',
      'A 200 m de la Central de Policía',
    ],
    condiciones: null,
    imagenes: [
      'img/stb-001-1.jpg',
      'img/stb-001-2.jpg',
      'img/stb-001-3.jpg',
      'img/stb-001-4.jpg',
      'img/stb-001-5.jpg',
    ],
  },

  {
    id: 'STB-002',
    operacion: 'alquiler',
    tipo: 'casa',
    titulo: 'Casa 3 dormitorios con galería y asador en Alta Córdoba',
    direccion: 'Fray León Torres 553, entre Jujuy y Lavalleja',
    barrio: 'Alta Córdoba',
    precio: 1000000,
    moneda: 'ARS',
    expensas: null,
    dormitorios: 3,
    banos: 2,
    cochera: true,
    destacada: true,
    caracteristicas: [
      'Impuestos de Rentas y Municipalidad incluidos',
      'Dormitorio independiente en suite',
      'Sótano de guardado',
      'Garage para 2 autos',
      'Living amplio',
      'Cocina-comedor con artefacto',
      'Patio interno',
      'Galería cubierta con asador',
      'Patio amplio con césped',
    ],
    descripcion:
      'Casa de tres dormitorios sobre Fray León Torres, entre Jujuy y Lavalleja, en pleno Alta Córdoba. La distribución es cómoda y pensada para una familia: living amplio al frente, cocina-comedor con artefacto incluido y patio interno que aporta luz natural a los ambientes centrales. Uno de los tres dormitorios es independiente, en suite y con sótano de guardado propio, lo que lo hace ideal para uso de huéspedes, oficina en casa o adolescente. Completan dos baños y un garage con capacidad real para dos autos. El fondo es el punto fuerte de la propiedad: galería cubierta con asador y patio amplio con césped, un espacio poco habitual a esta distancia del centro. El valor del alquiler incluye los impuestos de Rentas y Municipalidad, de modo que el gasto mensual es previsible desde el primer mes.',
    cercanias: [
      'A 5 cuadras de Avenida Juan B. Justo',
      'A 700 m de la Plaza Alta Córdoba',
      'A 10 minutos del centro en colectivo',
    ],
    condiciones:
      'Contrato por 2 años con aumento trimestral por IPC. El monto publicado incluye los impuestos de Rentas y Municipalidad. Se solicitan garantía propietaria o seguro de caución, recibo de sueldo o comprobante de ingresos y documentación personal.',
    imagenes: [
      'img/stb-002-1.jpg',
      'img/stb-002-2.jpg',
      'img/stb-002-3.jpg',
      'img/stb-002-4.jpg',
      'img/stb-002-5.jpg',
    ],
  },

  {
    id: 'STB-003',
    operacion: 'alquiler',
    tipo: 'departamento',
    titulo: 'Departamento 2 dormitorios muy luminoso en Alta Córdoba',
    direccion: 'Tucumán 2146, 1er piso por escaleras',
    barrio: 'Alta Córdoba',
    precio: 470000,
    moneda: 'ARS',
    expensas: 84000,
    dormitorios: 2,
    banos: 1,
    cochera: false,
    destacada: false,
    caracteristicas: [
      'Dormitorios con placard premium',
      'Cocina y living-comedor integrados',
      'Artefacto de cocina incluido',
      'Calefactor',
      'Baño completo',
      'Muy iluminado y ventilado',
      'Expensas con agua incluida',
    ],
    descripcion:
      'Departamento de dos dormitorios sobre calle Tucumán al 2100, en un primer piso por escaleras dentro de Alta Córdoba. Es una unidad muy iluminada y bien ventilada: recibe luz natural durante buena parte del día y tiene ventilación cruzada, lo que se nota especialmente en verano. Los dos dormitorios cuentan con placard de terminación premium, con buena capacidad de guardado. La cocina está integrada al living-comedor, se entrega con artefacto y el ambiente suma calefactor. El baño es completo. Las expensas incluyen el agua, de modo que el gasto fijo mensual queda acotado y sin sorpresas. Ubicación muy conveniente, con comercios, colectivos y servicios a pocas cuadras.',
    cercanias: [
      'A 400 m de Avenida Juan B. Justo',
      'A 600 m de la Plaza Alta Córdoba',
      'A 3 cuadras del Mercado Norte de Alta Córdoba',
    ],
    condiciones:
      'Contrato por 2 años con aumento trimestral por IPC. Expensas a cargo del inquilino: $84.000 mensuales, con agua incluida. Se solicitan garantía propietaria o seguro de caución, comprobante de ingresos y documentación personal.',
    imagenes: [
      'img/stb-003-1.jpg',
      'img/stb-003-2.jpg',
      'img/stb-003-3.jpg',
      'img/stb-003-4.jpg',
    ],
  },

  {
    id: 'STB-004',
    operacion: 'alquiler',
    tipo: 'departamento',
    titulo: 'Departamento dúplex 2 dormitorios en Barrio Rivadavia',
    direccion: 'Gorriti 2153, Torre C, piso 10',
    barrio: 'Rivadavia',
    precio: 350000,
    moneda: 'ARS',
    expensas: 57900,
    dormitorios: 2,
    banos: 1,
    cochera: false,
    destacada: false,
    caracteristicas: [
      'Tipología dúplex en dos plantas',
      'Planta baja: living y cocina-comedor',
      'Artefacto de cocina incluido',
      'Ventilador de techo en cada ambiente',
      'Planta alta: 2 dormitorios con placard',
      'Baño completo en planta alta',
      'Impuestos incluidos',
      'No se cobra mes de depósito',
    ],
    descripcion:
      'Departamento dúplex en Barrio Rivadavia, sobre calle Gorriti, a solo 30 metros de Avenida Sabattini. La unidad está en la Torre C, piso 10, y se desarrolla en dos plantas, lo que separa con claridad la zona social de la zona de descanso. En planta baja está el living y la cocina-comedor, con artefacto incluido y ventilador de techo. En planta alta se ubican los dos dormitorios, ambos con placard y ventilador, y el baño completo. La altura del piso asegura buena ventilación y vistas despejadas. El valor incluye los impuestos y, a diferencia de la mayoría de las operaciones del mercado, no se cobra mes de depósito, lo que reduce de forma importante el costo de ingreso.',
    cercanias: [
      'A 30 m de Avenida Sabattini',
      'A 5 minutos de Ciudad Universitaria en colectivo',
      'Sobre corredor de transporte público hacia el centro',
    ],
    condiciones:
      'Contrato por 2 años con aumento trimestral por IPC. El monto publicado incluye impuestos. Expensas a cargo del inquilino: $57.900 mensuales. No se cobra mes de depósito. Se solicitan garantía propietaria o seguro de caución, comprobante de ingresos y documentación personal.',
    imagenes: [
      'img/stb-004-1.jpg',
      'img/stb-004-2.jpg',
      'img/stb-004-3.jpg',
      'img/stb-004-4.jpg',
    ],
  },

  {
    id: 'STB-005',
    operacion: 'alquiler',
    tipo: 'departamento',
    titulo: 'Departamento interno 1 dormitorio con patio en San Martín',
    direccion: 'Suquía 747',
    barrio: 'San Martín',
    precio: 180000,
    moneda: 'ARS',
    expensas: 0,
    dormitorios: 1,
    banos: 1,
    cochera: false,
    destacada: false,
    caracteristicas: [
      'Sin expensas',
      'Departamento interno, muy tranquilo',
      'Dormitorio amplio (sin placard)',
      'Cocina amoblada (sin artefacto)',
      'Baño completo',
      'Patio propio amplio',
    ],
    descripcion:
      'Departamento interno de un dormitorio sobre calle Suquía al 700, en Barrio San Martín. Al ser una unidad interna es notablemente silenciosa, sin ruido de calle, y cuenta con un patio propio amplio de uso exclusivo, algo muy difícil de encontrar en este rango de precio. El dormitorio es amplio, aunque se entrega sin placard. La cocina está amoblada con bajo mesada y alacenas, sin artefacto. El baño es completo. La gran ventaja del alquiler es que no paga expensas: el valor mensual publicado es el gasto real de la unidad. Ideal para una persona sola o una pareja que busca tranquilidad y espacio exterior propio a pocos minutos del centro.',
    cercanias: [
      'A 8 cuadras de Avenida Colón',
      'A 10 minutos del centro en colectivo',
      'Comercios y almacenes a menos de 200 m',
    ],
    condiciones:
      'Contrato por 2 años con aumento trimestral por IPC. La unidad no paga expensas. Se solicitan garantía propietaria o seguro de caución, comprobante de ingresos y documentación personal.',
    imagenes: [
      'img/stb-005-1.jpg',
      'img/stb-005-2.jpg',
      'img/stb-005-3.jpg',
      'img/stb-005-4.jpg',
    ],
  },
];

/* --------------------------------------------------------------------------
   Datos de la inmobiliaria. Se usan para los links de WhatsApp, el footer,
   los datos de contacto y el JSON-LD de las fichas.
   -------------------------------------------------------------------------- */
const EMPRESA = {
  nombre: 'STABILE INMOBILIARIA',
  whatsapp: '5493513440506', // formato internacional, sin + ni espacios
  whatsappVisible: '+54 9 351 344 0506',
  telefonoVisible: '351 344 0506',
  email: 'contacto@stabileinmobiliaria.com.ar',
  direccion: 'Av. Colón 1234, Piso 2, Of. B',
  ciudad: 'Córdoba',
  provincia: 'Córdoba',
  pais: 'AR',
  codigoPostal: 'X5000',
  matricula:
    'Mat. XXXX - Colegio Profesional de Martilleros y Corredores Públicos de la Provincia de Córdoba',
  horarios: 'Lunes a viernes de 9 a 13 y de 16 a 20 h. Sábados de 9 a 13 h.',
  instagram: 'https://instagram.com/',
  facebook: 'https://facebook.com/',
  // Reemplazar por el dominio definitivo antes de publicar (se usa en el JSON-LD).
  sitio: 'https://stabile-inmobiliaria.vercel.app',
};
