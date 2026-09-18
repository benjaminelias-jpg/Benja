/* ============================================================
   CREATOR BUSINESS SCORE · Datos de la auditoría
   ------------------------------------------------------------
   Fuente: Manual Maestro de Arquitectura, Algoritmo y
   Diagnósticos (Teoría de las Limitaciones).

   AQUÍ se edita todo el contenido. No hace falta tocar app.js
   para cambiar preguntas, opciones o textos de diagnóstico.

   · ESCALERA  → las 7 limitaciones jerárquicas.
   · PREGUNTAS → 5 preguntas × 5 opciones (texto literal).
   · CASOS     → los 10 casos de la matriz maestra.
   · El enrutado condicional vive en app.js → resolverCaso().
   ============================================================ */

/* ------------------------------------------------------------
   0 · LA ESCALERA JERÁRQUICA (se resuelve de abajo hacia arriba)
   ------------------------------------------------------------ */
const ESCALERA = [
  { n: 1, nombre: 'Mindset y optimización personal' },
  { n: 2, nombre: 'Branding y autoridad percibida' },
  { n: 3, nombre: 'Marketing y calificación' },
  { n: 4, nombre: 'Ventas y conversión' },
  { n: 5, nombre: 'Fulfillment y retención' },
  { n: 6, nombre: 'Operaciones y sistemas' },
  { n: 7, nombre: 'Finanzas y salud de caja' }
];

/* ------------------------------------------------------------
   1 · PREGUNTAS
   El ORDEN de este array es el orden en pantalla. El motor lee cada
   respuesta por su `id`, nunca por su posición, así que se pueden
   reordenar sin tocar app.js.
   Orden actual: comunidad → situación → modelo → facturación → dolor.

   Datos que consume el motor en cada opción:
     tier   (facturación) 1..4 → escalón de madurez (A/B=1, C=2, D=3, E=4)
     desde  (facturación y comunidad) → suelo del tramo, en euros o en
            seguidores. Es lo que lee la regla de calificación.
     valor        0..100 → puntúa la variable de esa pregunta
     ritmo  (situación) caos | inestable | techo | desorden | control
     modelo lowticket | agencia | uno-a-uno | highticket | hibrido | ecommerce
     noAplica (modelo) true → fuera del perfil de Classroom Platinum
     audiencia baja | alta        (corte en 20.000 seguidores)
     menor5k   true en las dos primeras opciones (menos de 5.000)
     area   mindset | branding | marketing | ventas | operacion
   ------------------------------------------------------------ */
const PREGUNTAS = [
  {
    id: 'audiencia',
    variable: 'Tamaño de comunidad',
    titulo: '¿De qué tamaño es tu comunidad o audiencia activa?',
    ayuda: 'Sirve para detectar la desalineación entre alcance y ventas.',
    opciones: [
      { label: 'Menos de 1.000 seguidores / Sin comunidad', audiencia: 'baja', menor5k: true,  desde: 0,      valor: 10 },
      { label: '1.000 a 5.000 seguidores',                  audiencia: 'baja', menor5k: true,  desde: 1000,   valor: 30 },
      { label: '5.000 a 20.000 seguidores',                 audiencia: 'baja', menor5k: false, desde: 5000,   valor: 50 },
      { label: '20.000 a 100.000 seguidores',               audiencia: 'alta', menor5k: false, desde: 20000,  valor: 75 },
      { label: 'Más de 100.000 seguidores',                 audiencia: 'alta', menor5k: false, desde: 100000, valor: 92 }
    ]
  },
  {
    id: 'ritmo',
    variable: 'Ritmo del negocio',
    titulo: '¿Qué opción describe mejor tu situación actual y la de tu negocio digital?',
    ayuda: 'Mide la volatilidad de tu caja y la previsibilidad de tu operación.',
    opciones: [
      { label: 'Atrapado en las tareas del día a día',      ritmo: 'caos',      valor: 12 },
      { label: 'Inestable, con meses altos y bajones',      ritmo: 'inestable', valor: 32 },
      { label: 'Estancado en la misma facturación de siempre', ritmo: 'techo',  valor: 52 },
      { label: 'Estoy creciendo pero necesito equipo',      ritmo: 'desorden',  valor: 68 },
      { label: 'Tengo crecimiento predecible y controlado', ritmo: 'control',   valor: 92 }
    ]
  },
  {
    id: 'modelo',
    variable: 'Escalabilidad del modelo',
    titulo: '¿Qué producto o servicio vendes principalmente?',
    ayuda: 'Es el multiplicador de fricción: marca cuándo colapsa tu entrega.',
    opciones: [
      { label: 'Cursos low ticket / Infoproductos grabados',     modelo: 'lowticket',  valor: 45 },
      { label: 'Servicios freelance / Agencia entregada 1 a 1',  modelo: 'agencia',    valor: 40 },
      { label: 'Coaching / Consultoría 1 a 1 por tiempo',        modelo: 'uno-a-uno',  valor: 30 },
      { label: 'Mentoría grupal High-Ticket',                    modelo: 'highticket', valor: 75 },
      { label: 'Modelo híbrido / Programa escalable',            modelo: 'hibrido',    valor: 90 },
      /* E-commerce: puntúa y recibe diagnóstico como cualquier otro, pero
         queda fuera del perfil de Classroom Platinum (`noAplica`). */
      { label: 'E-commerce / Producto físico',                   modelo: 'ecommerce',  valor: 55, noAplica: true }
    ]
  },
  {
    id: 'facturacion',
    variable: 'Facturación mensual',
    titulo: '¿Cuál es tu facturación mensual aproximada?',
    ayuda: 'Determina tu escalón real de madurez. Ingresos brutos de un mes normal.',
    opciones: [
      { label: 'Menos de 1.000 €',       tier: 1, desde: 0,     valor: 8 },
      { label: '1.000 € – 5.000 €',      tier: 1, desde: 1000,  valor: 22 },
      { label: '5.000 € – 15.000 €',     tier: 2, desde: 5000,  valor: 45 },
      { label: '15.000 € – 40.000 €',    tier: 3, desde: 15000, valor: 70 },
      { label: 'Más de 50.000 €',        tier: 4, desde: 50000, valor: 92 }
    ]
  },
  {
    id: 'limitacion',
    variable: 'Restricción percibida',
    titulo: 'Si pudieras resolver UN solo problema hoy, ¿cuál sería?',
    ayuda: 'La X que sientes en tu día a día. Elige la que más te duele hoy.',
    opciones: [
      { label: 'Hábitos, rutinas y enfoque del fundador',     area: 'mindset' },
      { label: 'Autoridad, diferenciación y posicionamiento', area: 'branding' },
      { label: 'Atracción de prospectos calificados',         area: 'marketing' },
      { label: 'Cierre de llamadas y tasa de conversión',     area: 'ventas' },
      { label: 'Caos en la entrega, equipo y operaciones',    area: 'operacion' }
    ]
  },
  {
    /* Paso de captación: no puntúa ni enruta, solo recoge el correo.
       `tipo: 'email'` hace que el formulario pinte un campo en vez de opciones. */
    id: 'email',
    tipo: 'email',
    variable: 'Correo de contacto',
    titulo: '¿A qué correo enviamos tu puntuación?',
    ayuda: 'Te llega con el diagnóstico completo y los pasos de acción.',
    placeholder: 'tu@correo.com'
  }
];

/* ------------------------------------------------------------
   2 · MATRIZ MAESTRA DE DIAGNÓSTICOS
   Cada caso: escalón de la escalera + diagnóstico + la X + 3 pasos.
   ------------------------------------------------------------ */
const CASOS = {
  /* ===== BLOQUE 1 · más de 50.000 € ===== */
  '1.1': {
    bloque: 'Bloque 1 · Más de 50.000 € al mes',
    escalon: 6,
    limitacion: 'Operaciones y sistemas',
    titular: 'Has topado con el techo operativo de tu propio tiempo',
    diagnostico: 'Tu negocio ha alcanzado un volumen de facturación sobresaliente vendiendo horas o servicios personalizados. No tienes un problema de validación ni de captación: tu limitación número uno es el techo operativo y la dependencia absoluta de tu tiempo. Estás operando como el cuello de botella central de la entrega.',
    x: 'Tu tiempo físico es la restricción del sistema. Si entran 10 clientes más esta semana, la calidad de la entrega colapsa, porque no tienes procesos estandarizados ni un modelo apalancado.',
    pasos: [
      { titulo: 'Transiciona a un modelo híbrido o grupal', desc: 'Empaqueta tu metodología uno a uno en un programa grupal con soporte grabado y sesiones en vivo, para atender a decenas de clientes a la vez.' },
      { titulo: 'Estandariza el onboarding en menos de 14 días', desc: 'Crea manuales de procesos (SOPs) para que incorporar a un cliente o a un empleado no requiera tu presencia.' },
      { titulo: 'Aplica la matriz Objetivos → Proyectos → Acciones → Tareas', desc: 'Lidera por área con objetivos que bajen a tareas con tiempos específicos y reporte semanal.' }
    ]
  },
  '1.2': {
    bloque: 'Bloque 1 · Más de 50.000 € al mes',
    escalon: 5,
    limitacion: 'Fulfillment y retención',
    titular: 'Tus clientes ganan su primer resultado y se van',
    diagnostico: 'Cuentas con un sistema de captación y ventas altamente eficiente, pero tu limitación número uno es la retención y el valor de vida del cliente, por falta de una oferta cebolla. Tus alumnos obtienen los primeros resultados y se retiran, porque no les ofreces el siguiente paso lógico.',
    x: 'Ausencia de un sistema de ofertas encadenadas. Cada programa debe resolver el problema futuro que aparece justo cuando el cliente resuelve el inicial.',
    pasos: [
      { titulo: 'Diseña tu oferta cebolla', desc: 'Estructura un programa avanzado enfocado en los nuevos problemas de escala que enfrentan tus graduados.' },
      { titulo: 'Implementa un Service Roadmap proactivo', desc: 'Dibuja el mapa paso a paso, con tiempos estandarizados por fase, para anticiparte al estancamiento del cliente antes de que se queje.' },
      { titulo: 'Mide el NPS por encima de 8 sobre 10', desc: 'Y mantén la tasa de reembolsos por debajo del 2 % o 3 % del efectivo cobrado.' }
    ]
  },
  '1.3': {
    bloque: 'Bloque 1 · Más de 50.000 € al mes',
    escalon: 7,
    limitacion: 'Finanzas y salud de caja',
    titular: 'Vendes mucho, pero el tráfico se come tu margen',
    diagnostico: 'Tienes volumen masivo de ventas y sistemas automatizados, pero tu limitación número uno está en las finanzas y el margen neto de beneficio. El costo de adquisición de tráfico absorbe tu margen operativo, porque no hay un producto de alto valor en la parte trasera del embudo.',
    x: 'Falta un backend high-ticket que financie la adquisición de tráfico pagado. Un negocio sano de infoproductos debe mantener un margen de beneficio del 80 %.',
    pasos: [
      { titulo: 'Construye una oferta high-ticket de acompañamiento', desc: 'Usa tu curso de bajo ticket como puerta de entrada para vender una mentoría o consultoría de alto valor.' },
      { titulo: 'Audita el P&L cada mes', desc: 'Revisa ingresos, costos fijos y variables, y elimina herramientas o suscripciones innecesarias.' },
      { titulo: 'Estructura los tres fondos de caja', desc: 'Divide utilidades en fondo de emergencia (de 3 a 6 meses de costos), fondo de ahorro y fondo de inversión.' }
    ]
  },

  /* ===== BLOQUE 2 · 15.000 € – 40.000 € ===== */
  '2.1': {
    bloque: 'Bloque 2 · 15.000 € – 40.000 € al mes',
    escalon: 4,
    limitacion: 'Ventas y conversión',
    titular: 'Generas reuniones de valor, pero el cierre se te escapa',
    diagnostico: 'Tu estrategia de marketing genera reuniones de valor, pero tu limitación número uno está en el proceso comercial y la conversión de cierre. Las llamadas se extienden durante semanas sin tomar decisiones y pierdes margen por falta de seguimiento estructurado.',
    x: 'Tasa de cierre por debajo del 35 % en llamadas asistidas, o asistencia a las llamadas por debajo del 80 %.',
    pasos: [
      { titulo: 'Filtra la asistencia por encima del 80 %', desc: 'Exige consumir un vídeo o documento de nutrición antes de la reunión. Si el prospecto no lo consume, se reprograma o se cancela.' },
      { titulo: 'Cierra en la primera llamada', desc: 'Rediseña el guion para diagnosticar el dolor real, evaluar la urgencia y eliminar las objeciones de postergación en la misma sesión.' },
      { titulo: 'Gestiona el CRM por KPIs diarios', desc: 'Fija metas mensuales derivadas del promedio de los últimos 90 días y divídelas en objetivos semanales y diarios por cada closer.' }
    ]
  },
  '2.2': {
    bloque: 'Bloque 2 · 15.000 € – 40.000 € al mes',
    escalon: 3,
    limitacion: 'Marketing y calificación',
    titular: 'Haces contenido, pero no llegan las ventas',
    diagnostico: 'Tienes una audiencia amplia en redes sociales, pero sufres el síndrome de hacer contenido sin vender. Tu limitación número uno está en el marketing y la calificación de audiencia: atraes seguidores virales turistas, que no están calificados para comprar servicios de alto valor.',
    x: 'Menos del 80 % de tu audiencia está calificada para adquirir tu servicio, y tu mensaje no explica la propuesta en menos de 10 segundos.',
    pasos: [
      { titulo: 'Aplica la regla de los 10 segundos', desc: 'Reestructura la promesa principal para que cualquiera entienda a quién ayudas y qué resultado entregas en menos de 10 segundos.' },
      { titulo: 'Elimina los reels virales genéricos', desc: 'Deja de crear contenido masivo de tendencia y publica contenido de nicho orientado solo a compradores calificados.' },
      { titulo: 'Publica activos de nutrición de formato largo', desc: 'Graba vídeos extensos en YouTube o VSL explicando en detalle tu mecanismo único y casos de éxito reales.' }
    ]
  },
  '2.3': {
    bloque: 'Bloque 2 · 15.000 € – 40.000 € al mes',
    escalon: 5,
    limitacion: 'Fulfillment y estructura',
    titular: 'Tu agenda es el techo: vendes horas, no un sistema',
    diagnostico: 'Has alcanzado una facturación sólida vendiendo sesiones uno a uno, pero tu limitación número uno es que has topado con el techo físico de tus horas. Tu servicio opera de forma reactiva a las demandas del cliente, y consume el tiempo que necesitas para liderar y vender.',
    x: 'Falta un servicio activo estructurado, un Service Roadmap. Vendes tu tiempo en lugar de un sistema de aprendizaje apalancado.',
    pasos: [
      { titulo: 'Empaqueta tu método', desc: 'Convierte el contenido repetitivo de tus sesiones uno a uno en un currículum grabado con soporte grupal semanal.' },
      { titulo: 'Diseña tu Service Roadmap', desc: 'Mapea las fases exactas que debe completar el alumno, con tiempos estandarizados por etapa para detectar retrasos de forma automática.' },
      { titulo: 'Libera espacio en la agenda', desc: 'Bloquea horarios fijos semanales dedicados solo a dirección comercial y estrategia de marketing.' }
    ]
  },

  /* ===== BLOQUE 3 · 5.000 € – 15.000 € ===== */
  '3.1': {
    bloque: 'Bloque 3 · 5.000 € – 15.000 € al mes',
    escalon: 2,
    limitacion: 'Branding y autoridad',
    titular: 'Cierras a pulso porque nadie llega educado a la llamada',
    diagnostico: 'Has validado tu propuesta inicial, pero tu limitación número uno es el branding y la autoridad percibida. Cerrar ventas exige un esfuerzo comercial agotador, porque no cuentas con un ecosistema que eduque y genere confianza en el prospecto antes de la llamada.',
    x: 'No hay respuesta clara a la pregunta del mercado: ¿por qué tengo que escucharte a ti y no a la competencia? Faltan activos de nutrición largos y prueba social transparente.',
    pasos: [
      { titulo: 'Lanza un VSL o vídeo de nutrición largo', desc: 'Publica un vídeo extenso en YouTube o en tu landing explicando tu metodología, tu historia y los obstáculos que superaste.' },
      { titulo: 'Conecta tu historia con la promesa', desc: 'Muestra cómo usaste tu propio mecanismo único para conseguir los resultados que hoy prometes.' },
      { titulo: 'Documenta casos de éxito transparentes', desc: 'Muestra testimonios detallados de alumnos anteriores para elevar el nivel de conciencia antes de la llamada.' }
    ]
  },
  '3.2': {
    bloque: 'Bloque 3 · 5.000 € – 15.000 € al mes',
    escalon: 3,
    limitacion: 'Product-market fit y conciencia',
    titular: 'Tu mercado todavía no percibe el retorno de contratarte',
    diagnostico: 'Tu negocio genera tracción esporádica, pero tu limitación número uno es la alineación entre el product-market fit y el mensaje de marketing. Tu audiencia no percibe de inmediato el retorno que obtendrá al contratarte.',
    x: 'Bajo nivel de conciencia del prospecto sobre tu solución, y falta de claridad en el empaquetado de la oferta.',
    pasos: [
      { titulo: 'Audita a tus clientes más exitosos', desc: 'Analiza qué tiene en común el 20 % de clientes con mejores resultados y enfoca tu mensaje solo en ese perfil.' },
      { titulo: 'Rediseña tu propuesta de valor', desc: 'Empaqueta la oferta destacando el resultado final tangible y el tiempo necesario para conseguirlo.' },
      { titulo: 'Aplica seguimiento riguroso en el CRM', desc: 'Organiza a tus prospectos con estados de temperatura claros para dar seguimiento efectivo tras la primera reunión.' }
    ]
  },

  /* ===== BLOQUE 4 · menos de 5.000 € ===== */
  '4.1': {
    bloque: 'Bloque 4 · Menos de 5.000 € al mes',
    escalon: 1,
    limitacion: 'Mindset y optimización personal',
    titular: 'El motor del negocio eres tú, y todavía no está a punto',
    diagnostico: 'Tu negocio está en etapa de arranque o reinicio. Tu limitación número uno es el mindset y la optimización personal del fundador. Intentar invertir en publicidad pagada, agencias o herramientas complejas en este punto provocará abrumamiento y pérdida de capital.',
    x: 'Tu vida personal, hábitos, salud y descanso no están optimizados al 95 %. Escalar en este estado equivale a inyectar esteroides a un cuerpo obeso.',
    pasos: [
      { titulo: 'Optimiza tu vida personal al 95 %', desc: 'Establece horarios estrictos de sueño, alimentación saludable y actividad física diaria para sostener el nivel de energía requerido.' },
      { titulo: 'Enfócate en una sola oferta', desc: 'Elimina proyectos secundarios y concéntrate en validar una única propuesta de valor durante los próximos 90 días.' },
      { titulo: 'Establece un KPI de ejecución diaria', desc: 'Define una o dos tareas clave al día enfocadas en prospección o conversación con clientes potenciales.' }
    ]
  },
  '4.2': {
    bloque: 'Bloque 4 · Menos de 5.000 € al mes',
    escalon: 1,
    limitacion: 'Validación inicial y claridad',
    titular: 'Estás resolviendo problemas de un negocio que aún no tienes',
    diagnostico: 'Estás intentando resolver problemas de escalabilidad avanzada, como editar mejores vídeos o contratar colaboradores, cuando tu limitación número uno real es la claridad de la oferta y la validación inicial.',
    x: 'Dispersión de energía en múltiples canales sin haber validado una oferta high-ticket mediante prospección directa.',
    pasos: [
      { titulo: 'Simplifica tu oferta a high-ticket', desc: 'Define un servicio de acompañamiento de valor claro, enfocado en resolver un dolor específico.' },
      { titulo: 'Inicia conversaciones orgánicas diarias', desc: 'Habla directamente con tu perfil ideal para entender sus objeciones y validar el mensaje en la práctica.' },
      { titulo: 'Aplica metas de supervivencia a 90 días', desc: 'Mantén el foco en conseguir tus primeros 3 a 5 clientes antes de invertir en software o diseño de marca.' }
    ]
  }
};

/* ------------------------------------------------------------
   3 · CIERRE Y DESTINOS
   ------------------------------------------------------------ */
const URL_KUNFUPAY = 'https://kunfupay.com/?utm_source=CBS&utm_medium=social&utm_campaign=bio';

/* Cuando Classroom Platinum tenga su propia URL de aplicación, se pone aquí y
   el botón de Aplicar se convierte en enlace igual que el de Kunfupay. */
const URL_CLASSROOM = null;

/* Cierre para quien elige E-commerce / Producto físico: recibe su puntuación y
   su diagnóstico completos, pero Classroom Platinum no es para su tipo de
   negocio. El tono es informativo, no un rechazo. */
const FUERA_DE_PERFIL = {
  chip: 'Fuera del perfil de Platinum',
  fase: 'Tu puntuación y tu diagnóstico son válidos igual. Lo que no encaja es Classroom Platinum: el programa trabaja con negocios digitales de infoproductos, servicios y mentorías, así que un e-commerce de producto físico queda fuera de su alcance.',
  nota: 'Por eso no te pedimos que apliques a Classroom Platinum esta vez. Quédate con tu puntuación y con los tres pasos: aplican igual a tu negocio.'
};

/* ------------------------------------------------------------
   4 · LA MEDALLA COMPARTIBLE
   La imagen de 1080 × 1920 que se genera al terminar. El puntaje elige
   una franja, y la franja pone el metal, el titular y el reto.

   LA ESCALERA ES DE METALES, y se detiene en el oro a propósito: el
   PLATINO es lo que vende Classroom Platinum. Un test gratis no puede
   entregar la cima, o el programa se queda sin peldaño que ofrecer.

   El titular va en PRIMERA PERSONA: lo publica el usuario en su story,
   no lo dice la marca. Y ninguno afirma nada que el motor no respalde
   (ver "Lo que hay detrás de cada metal" en el README).

   Las franjas se leen de mayor a menor: gana la primera que encaja.
   ------------------------------------------------------------ */
const TARJETA = {
  ancho: 1080,
  alto: 1920,
  fuente: 'Plus Jakarta Sans',
  eyebrow: 'Creator Business Score',
  etiquetaDesbloqueo: 'Mi próximo desbloqueo',
  cta: 'Gánate tu medalla en 5 preguntas',
  /* El render 3D de la medalla, en cromo neutro: un solo archivo que la
     tarjeta tiñe con el color de cada metal. `diametro` es el ancho al que
     se dibuja la moneda en la tarjeta de 1080 px; la posición de la moneda
     dentro del archivo se mide sola leyendo su alfa, sin coordenadas a mano.
     `tinte` es el modo de fusión del canvas: 'color' conserva el sombreado del
     cromo y le pone el tono del metal. Si el archivo no carga, la tarjeta cae
     al anillo plano de antes. */
  medalla3d: {
    src: 'assets/medalla-3d.webp',
    respaldo: 'assets/medalla-3d.png',
    diametro: 540,
    tinte: 'color'
  },
  /* El quinto peldaño de la pista de niveles. No se puede ganar en el test:
     es lo que vende Classroom Platinum, y se pinta cerrado con candado. */
  nivelBloqueado: 'Platino',
  /* `color` tiñe SOLO la cinta del rango: el borde, el relleno y el texto.
     Todo lo demás sigue en blanco sobre el morado de marca. Es lo que hace
     que las cuatro medallas se distingan de un vistazo cuando circulan
     juntas. Para volver al blanco de antes, basta con quitar los `color`. */
  /* Texto de la pastilla del pie. Antes era el dominio de la página; ahora
     es fijo, así que la tarjeta no delata en qué entorno se generó
     (localhost, staging...). Cambialo aquí si hace falta otro texto. */
  url: 'Classroom Platinum by Kunfupay',
  franjas: [
    {
      desde: 75, medalla: 'Oro', color: '#f7cf6b',
      titular: 'Mi negocio no depende de mi estado de ánimo',
      reto: '¿Cuánto aguanta el tuyo sin ti?'
    },
    {
      /* "Factura bien" se sostiene: por debajo de 5.000 € al mes nadie
         alcanza esta franja. Comprobado sobre las 3.750 combinaciones. */
      desde: 55, medalla: 'Plata', color: '#e2e8f4',
      titular: 'Mi desorden factura bien. Mi sistema no existe',
      reto: '¿Tu número le gana al mío?'
    },
    {
      /* Aquí SÍ cabe quien factura menos de 1.000 €, así que el titular no
         puede afirmar ventas. El anterior, "Vendo todos los meses", habría
         hecho mentir a esa parte de la franja delante de su audiencia. */
      desde: 35, medalla: 'Bronce', color: '#eaa87a',
      titular: 'Hago mucho y todavía no sé qué funciona',
      reto: '¿Vendes por sistema o por suerte?'
    },
    {
      /* El estatus sale del coraje, no del logro: es la única forma de que
         la franja baja se comparta en lugar de esconderse. */
      desde: 0, medalla: 'Acero', color: '#b4bdd2',
      titular: 'Prefiero un número incómodo que otro año a ciegas',
      reto: '¿Te atreverías a publicar el tuyo?'
    }
  ]
};

const PASO_KUNFUPAY = {
  titulo: 'Con Kunfupay simplificas cada venta',
  desc: 'Nuestra plataforma, dedicada al infoproductor, registra cada venta con su método de pago, su comisión y su neto real, en un solo panel. Contamos con un sistema de optimización fiscal para maximizar las ganancias de tu producto digital. Consulta tus estadísticas sin hojas de cálculo complicadas.'
};
