/* ============================================================
   CREATOR BUSINESS SCORE · resultado por correo
   Google Apps Script, vinculado a la hoja de Google de los leads.
   ------------------------------------------------------------
   Formulario instantáneo de Meta → fila en la hoja → este script:
     1 · lee las respuestas de la fila,
     2 · calcula el puntaje y el diagnóstico con el MISMO motor que la
         landing (landings/classroom-platinum-score/v1),
     3 · envía el correo con la página de gracias (medalla, puntaje,
         diagnóstico y pasos) y la medalla adjunta,
     4 · escribe el resultado en la fila y, si se configura, lo manda a
         un webhook de salida (CRM, Make, Notion…).

   Hay dos formas de que se active:
     · WEBHOOK: Make/Zapier hace POST a la URL de la app web (con ?token=)
       y el correo sale al momento.
     · RELOJ: cada pocos minutos revisa si hay filas nuevas sin procesar
       (por si la fila la escribió otra herramienta directamente).

   Instalación paso a paso: README.md de esta carpeta.
   ============================================================ */

/* ------------------------------------------------------------
   0 · CONFIGURACIÓN
   Lo único que hace falta tocar. Los secretos (token del webhook) no van
   aquí: los genera `configurar()` y viven en Propiedades del script.

   ⚠ Después de CUALQUIER cambio en este archivo (también aquí en CONFIG):
   Guardar → Implementar → Gestionar implementaciones → ✏ → Versión: nueva
   versión → Implementar. Si no, el webhook sigue con el código anterior
   (el reloj y el menú sí usan el nuevo, y los dos se comportarían distinto).
   ------------------------------------------------------------ */
const CONFIG = {
  NOMBRE_PESTANA: 'Leads',

  // Remitente. El correo sale de la cuenta de Google que autoriza el script:
  // para que salga de hola@kunfupay.com, instala el script con esa cuenta.
  REMITENTE_NOMBRE: 'Classroom Platinum by Kunfupay',
  RESPONDER_A: '',              // p. ej. 'hola@kunfupay.com'. Vacío = la cuenta del script.
  COPIA_OCULTA: '',             // BCC interno opcional (cuenta como destinatario en la cuota).
  CORREO_BAJA: '',              // dirección para pedir la baja (pie del correo). Vacío = RESPONDER_A o la cuenta del script.

  // Medallas pre-generadas (ver medallas/). Una de las dos:
  CARPETA_MEDALLAS_ID: '',      // ID de la carpeta de Drive con los .jpg. Vacío = la que crea
                                // el menú "Importar medallas" junto a esta hoja (recomendado).
  URL_BASE_MEDALLAS: '',        // o una URL pública que termine en '/', p. ej.
                                // 'https://kunfupay.com/landings/classroom-platinum-score/medallas/'
  ADJUNTAR_MEDALLA: true,       // adjunta la tarjeta completa 1080 × 1920 para la story

  // Destinos de los botones. A las URLs se les añaden las mismas UTMs que
  // ponía la landing: utm_term = calificado_si|calificado_no, utm_content = score_N.
  URL_APLICAR: 'https://kunfupay.com/landings/classroom-platinum/gracias',
  URL_KUNFUPAY: 'https://kunfupay.com/?utm_source=CBS&utm_medium=social&utm_campaign=bio',
  UTM_MEDIUM_CORREO: 'email',   // sustituye utm_medium en los botones del correo ('' = no tocar)

  // Webhook de salida: si tiene URL, cada resultado se manda ahí en JSON
  // (mismos campos que guardaba la landing en /api/classroom-platinum/score).
  WEBHOOK_SALIDA: '',

  MINUTOS_REVISION: 5,          // reloj de respaldo: 1, 5, 10, 15 o 30
  MAX_INTENTOS: 3,              // reintentos de un envío que falla
  MAX_POR_EJECUCION: 40,

  // Si en el formulario de Meta escribes una opción con otro texto, añádela
  // aquí apuntando a la opción de la landing (índice empezando en 0):
  //   ALIAS: { facturacion: { 'Entre mil y cinco mil euros': 1 } }
  ALIAS: {}
};

/* El relleno cosmético del puntaje mostrado: el mismo de la landing v1.
   Todo lo que decide algo (caso, calificación, UTM, webhook) usa el REAL. */
const RELLENO_FRACCION = 0.16;

/* ------------------------------------------------------------
   1 · DATOS · copia literal de data.js de la landing v1
   ------------------------------------------------------------ */
const PREGUNTAS = [
  {
    id: 'audiencia', columna: 'Comunidad',
    variable: 'Tamaño de comunidad',
    titulo: '¿De qué tamaño es tu comunidad o audiencia activa?',
    opciones: [
      { label: 'Menos de 1.000 seguidores / Sin comunidad', audiencia: 'baja', menor5k: true,  desde: 0,      valor: 10 },
      { label: '1.000 a 5.000 seguidores',                  audiencia: 'baja', menor5k: true,  desde: 1000,   valor: 30 },
      { label: '5.000 a 20.000 seguidores',                 audiencia: 'baja', menor5k: false, desde: 5000,   valor: 50 },
      { label: '20.000 a 100.000 seguidores',               audiencia: 'alta', menor5k: false, desde: 20000,  valor: 75 },
      { label: 'Más de 100.000 seguidores',                 audiencia: 'alta', menor5k: false, desde: 100000, valor: 92 }
    ]
  },
  {
    id: 'ritmo', columna: 'Situación',
    variable: 'Ritmo del negocio',
    titulo: '¿Qué opción describe mejor tu situación actual y la de tu negocio digital?',
    opciones: [
      { label: 'Atrapado en las tareas del día a día',         ritmo: 'caos',      valor: 12 },
      { label: 'Inestable, con meses altos y bajones',         ritmo: 'inestable', valor: 32 },
      { label: 'Estancado en la misma facturación de siempre', ritmo: 'techo',     valor: 52 },
      { label: 'Estoy creciendo pero necesito equipo',         ritmo: 'desorden',  valor: 68 },
      { label: 'Tengo crecimiento predecible y controlado',    ritmo: 'control',   valor: 92 }
    ]
  },
  {
    id: 'modelo', columna: 'Producto',
    variable: 'Escalabilidad del modelo',
    titulo: '¿Qué producto o servicio vendes principalmente?',
    opciones: [
      { label: 'Cursos low ticket / Infoproductos grabados',    modelo: 'lowticket',  valor: 45 },
      { label: 'Servicios freelance / Agencia entregada 1 a 1', modelo: 'agencia',    valor: 40 },
      { label: 'Coaching / Consultoría 1 a 1 por tiempo',       modelo: 'uno-a-uno',  valor: 30 },
      { label: 'Mentoría grupal High-Ticket',                   modelo: 'highticket', valor: 75 },
      { label: 'Modelo híbrido / Programa escalable',           modelo: 'hibrido',    valor: 90 },
      { label: 'E-commerce / Producto físico',                  modelo: 'ecommerce',  valor: 55, noAplica: true }
    ]
  },
  {
    id: 'facturacion', columna: 'Facturación',
    variable: 'Facturación mensual',
    titulo: '¿Cuál es tu facturación mensual aproximada?',
    opciones: [
      { label: 'Menos de 1.000 €',    tier: 1, desde: 0,     valor: 8 },
      { label: '1.000 € – 5.000 €',   tier: 1, desde: 1000,  valor: 22 },
      { label: '5.000 € – 15.000 €',  tier: 2, desde: 5000,  valor: 45 },
      { label: '15.000 € – 40.000 €', tier: 3, desde: 15000, valor: 70 },
      { label: 'Más de 50.000 €',     tier: 4, desde: 50000, valor: 92 }
    ]
  },
  {
    id: 'limitacion', columna: 'Problema',
    variable: 'Restricción percibida',
    titulo: 'Si pudieras resolver UN solo problema hoy, ¿cuál sería?',
    opciones: [
      { label: 'Hábitos, rutinas y enfoque del fundador',     area: 'mindset' },
      { label: 'Autoridad, diferenciación y posicionamiento', area: 'branding' },
      { label: 'Atracción de prospectos calificados',         area: 'marketing' },
      { label: 'Cierre de llamadas y tasa de conversión',     area: 'ventas' },
      { label: 'Caos en la entrega, equipo y operaciones',    area: 'operacion' }
    ]
  }
];

const CASOS = {
  '1.1': {
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
  '2.1': {
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
  '3.1': {
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
    limitacion: 'Product-market fit y conciencia',
    desbloqueo: 'Product-market fit y visibilidad',
    titular: 'Tu mercado todavía no percibe el retorno de contratarte',
    diagnostico: 'Tu negocio genera tracción esporádica, pero tu limitación número uno es la alineación entre el product-market fit y el mensaje de marketing. Tu audiencia no percibe de inmediato el retorno que obtendrá al contratarte.',
    x: 'Bajo nivel de conciencia del prospecto sobre tu solución, y falta de claridad en el empaquetado de la oferta.',
    pasos: [
      { titulo: 'Audita a tus clientes más exitosos', desc: 'Analiza qué tiene en común el 20 % de clientes con mejores resultados y enfoca tu mensaje solo en ese perfil.' },
      { titulo: 'Rediseña tu propuesta de valor', desc: 'Empaqueta la oferta destacando el resultado final tangible y el tiempo necesario para conseguirlo.' },
      { titulo: 'Aplica seguimiento riguroso en el CRM', desc: 'Organiza a tus prospectos con estados de temperatura claros para dar seguimiento efectivo tras la primera reunión.' }
    ]
  },
  '4.1': {
    limitacion: 'Mindset y optimización personal',
    desbloqueo: 'Hábitos y sistema de trabajo',
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

const FUERA_DE_PERFIL = {
  chip: 'Fuera del perfil de Platinum',
  fase: 'Tu puntuación y tu diagnóstico son válidos igual. Lo que no encaja es Classroom Platinum: el programa trabaja con negocios digitales de infoproductos, servicios y mentorías, así que un e-commerce de producto físico queda fuera de su alcance.',
  nota: 'Por eso no te pedimos que apliques a Classroom Platinum esta vez. Quédate con tu puntuación y con los tres pasos: aplican igual a tu negocio.'
};

const PASO_KUNFUPAY = {
  titulo: 'Con Kunfupay simplificas cada venta',
  desc: 'Nuestra plataforma, dedicada al infoproductor, registra cada venta con su método de pago, su comisión y su neto real, en un solo panel. Contamos con un sistema de optimización fiscal para maximizar las ganancias de tu producto digital. Consulta tus estadísticas sin hojas de cálculo complicadas.'
};

/* Franjas de la medalla (TARJETA.franjas): el puntaje MOSTRADO elige el metal. */
const FRANJAS = [
  { desde: 75, medalla: 'Oro',    titular: 'Mi negocio no depende de mi estado de ánimo',        reto: '¿Cuánto aguanta el tuyo sin ti?' },
  { desde: 55, medalla: 'Plata',  titular: 'Mi desorden factura bien. Mi sistema, todavía no',   reto: '¿Tu número le gana al mío?' },
  { desde: 35, medalla: 'Bronce', titular: 'Hago mucho y todavía no sé qué funciona',            reto: '¿Vendes por sistema o por suerte?' },
  { desde: 0,  medalla: 'Acero',  titular: 'Prefiero un número incómodo que otro año a ciegas',  reto: '¿Te atreverías a publicar el tuyo?' }
];

/* ------------------------------------------------------------
   2 · MOTOR · copia literal de app.js de la landing v1
   ------------------------------------------------------------ */
const PESOS = { facturacion: .35, ritmo: .25, modelo: .15, conversion: .15, comunidad: .10 };
const FACTURACION_MINIMA_PARA_CALIFICAR = 1000;   // euros al mes
const COMUNIDAD_MINIMA_PARA_CALIFICAR = 5000;     // seguidores
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function puntajeVisible(interno) {
  return Math.round(interno + (100 - interno) * RELLENO_FRACCION);
}

function calcularConversion(facturacion, audiencia) {
  return Math.max(5, Math.min(98, Math.round(50 + (facturacion.valor - audiencia.valor) * 0.8)));
}

function calcularPuntaje(r) {
  const variables = {
    facturacion: r.facturacion.valor,
    ritmo: r.ritmo.valor,
    modelo: r.modelo.valor,
    comunidad: r.audiencia.valor,
    conversion: calcularConversion(r.facturacion, r.audiencia)
  };
  const total = Object.keys(PESOS).reduce(function (acc, k) { return acc + variables[k] * PESOS[k]; }, 0);
  return { total: Math.round(total), variables: variables };
}

function resolverCaso(r) {
  const tier = r.facturacion.tier;
  const modelo = r.modelo.modelo;
  const ritmo = r.ritmo.ritmo;
  const area = r.limitacion.area;
  const audienciaAlta = r.audiencia.audiencia === 'alta';
  const audienciaMenor5k = r.audiencia.menor5k === true;

  if (tier === 4) {
    if (modelo === 'agencia' || modelo === 'uno-a-uno') return { clave: '1.1', exacto: true };
    if ((modelo === 'highticket' || modelo === 'hibrido') && area === 'operacion') return { clave: '1.2', exacto: true };
    if (modelo === 'lowticket' || modelo === 'ecommerce' || ritmo === 'inestable') return { clave: '1.3', exacto: true };
    return { clave: '1.2', exacto: false };
  }
  if (tier === 3) {
    if (area === 'ventas' || ritmo === 'caos' || ritmo === 'inestable') return { clave: '2.1', exacto: true };
    if (audienciaAlta && area === 'marketing') return { clave: '2.2', exacto: true };
    if (modelo === 'uno-a-uno' && area === 'operacion') return { clave: '2.3', exacto: true };
    return { clave: '2.1', exacto: false };
  }
  if (tier === 2) {
    if (area === 'branding' || audienciaMenor5k) return { clave: '3.1', exacto: true };
    if (area === 'marketing' || area === 'ventas') return { clave: '3.2', exacto: true };
    return { clave: '3.2', exacto: false };
  }
  if (area === 'mindset' || ritmo === 'caos') return { clave: '4.1', exacto: true };
  return { clave: '4.2', exacto: true };
}

/** r = { audiencia, ritmo, modelo, facturacion, limitacion } con las opciones elegidas. */
function evaluar(r) {
  const p = calcularPuntaje(r);
  const c = resolverCaso(r);
  const noAplica = r.modelo.noAplica === true;
  const califica = !noAplica
    && r.facturacion.desde >= FACTURACION_MINIMA_PARA_CALIFICAR
    && r.audiencia.desde >= COMUNIDAD_MINIMA_PARA_CALIFICAR;
  const visible = puntajeVisible(p.total);
  return {
    respuestas: r,
    puntaje: p.total,                 // REAL: decide y se mide
    puntajeVisible: visible,          // MOSTRADO: solo se pinta
    variables: p.variables,
    claveCaso: c.clave, exacto: c.exacto, caso: CASOS[c.clave],
    califica: califica, noAplica: noAplica,
    desenlace: noAplica ? 'no_aplica' : (califica ? 'calificado' : 'descalificado'),
    franja: franjaDe(visible)
  };
}

function franjaDe(puntaje) {
  for (var i = 0; i < FRANJAS.length; i++) if (puntaje >= FRANJAS[i].desde) return FRANJAS[i];
  return FRANJAS[FRANJAS.length - 1];
}

/* ------------------------------------------------------------
   3 · LEER LAS RESPUESTAS
   Meta entrega el texto de la opción (a veces en_formato_clave). Se compara
   normalizado: sin tildes, sin mayúsculas, sin signos, y "1.000" = "1000".
   ------------------------------------------------------------ */
function normalizar(s) {
  return String(s == null ? '' : s)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/(\d)[.,\s](?=\d{3}(\D|$))/g, '$1')
    .replace(/(\d+)\s*k\b/g, function (m, n) { return n + '000'; })
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function numerosDe(normalizado) {
  return normalizado.match(/\d+/g) || [];
}

/** Devuelve el índice de la opción de `pregunta` que corresponde a `valor`, o -1. */
function emparejarOpcion(pregunta, valor) {
  const v = normalizar(valor);
  if (!v) return -1;

  const alias = (CONFIG.ALIAS && CONFIG.ALIAS[pregunta.id]) || {};
  for (var a in alias) if (normalizar(a) === v) return Number(alias[a]);

  const ops = pregunta.opciones.map(function (o) { return normalizar(o.label); });
  const exacta = ops.indexOf(v);
  if (exacta !== -1) return exacta;

  // Por palabras: la opción y el valor comparten casi todo. Si hay números,
  // tienen que ser exactamente los mismos (evita que "1000 5000" case con
  // "5000 15000").
  const tv = v.split(' ');
  const nv = numerosDe(v).join(',');
  var mejor = -1, mejorPuntos = 0, empate = false;
  ops.forEach(function (o, i) {
    if (numerosDe(o).join(',') !== nv) return;
    const to = o.split(' ');
    const comunes = to.filter(function (t) { return tv.indexOf(t) !== -1; }).length;
    const union = new Set(to.concat(tv)).size;
    const puntos = comunes / union;
    if (puntos > mejorPuntos) { mejor = i; mejorPuntos = puntos; empate = false; }
    else if (puntos === mejorPuntos && puntos > 0) empate = true;
  });
  return (mejorPuntos >= 0.5 && !empate) ? mejor : -1;
}

/** De un objeto { audiencia: 'texto', ... } a opciones elegidas, o la lista de fallos. */
function leerRespuestas(textos) {
  const r = {}, fallos = [];
  PREGUNTAS.forEach(function (p) {
    const valor = textos[p.id];
    const i = emparejarOpcion(p, valor);
    if (i < 0 || !p.opciones[i]) fallos.push(p.columna + (valor ? ': "' + String(valor).slice(0, 80) + '" no coincide con ninguna opción' : ': vacía'));
    else r[p.id] = p.opciones[i];
  });
  return { r: r, fallos: fallos };
}

/* ------------------------------------------------------------
   4 · LA HOJA
   Las columnas se buscan por su encabezado, no por su posición: se pueden
   reordenar o añadir otras. Si la hoja viene de Make con los títulos de las
   preguntas de Meta, también se reconocen.
   ------------------------------------------------------------ */
const COLUMNAS = [
  { k: 'fecha',        h: 'Fecha',        alias: ['fecha', 'created time', 'fecha de creacion', 'date'] },
  { k: 'id',           h: 'ID lead',      alias: ['id lead', 'lead id', 'id', 'leadgen id', 'id del lead'] },
  { k: 'nombre',       h: 'Nombre',       alias: ['nombre', 'nombre completo', 'full name', 'name'] },
  { k: 'email',        h: 'Correo',       alias: ['correo', 'email', 'e mail', 'correo electronico'] },
  { k: 'telefono',     h: 'Teléfono',     alias: ['telefono', 'phone', 'phone number', 'numero de telefono', 'whatsapp'] },
  { k: 'audiencia',    h: 'Comunidad',    alias: ['comunidad'],   contiene: ['comunidad', 'audiencia', 'seguidores'] },
  { k: 'ritmo',        h: 'Situación',    alias: ['situacion'],   contiene: ['situacion', 'describe mejor', 'ritmo'] },
  { k: 'modelo',       h: 'Producto',     alias: ['producto'],    contiene: ['producto', 'servicio', 'vendes'] },
  { k: 'facturacion',  h: 'Facturación',  alias: ['facturacion'], contiene: ['facturacion', 'facturas'] },
  { k: 'limitacion',   h: 'Problema',     alias: ['problema'],    contiene: ['problema', 'resolver', 'dolor'] },
  { k: 'origen',       h: 'Origen',       alias: ['origen', 'platform', 'plataforma'] },
  { k: 'puntaje',      h: 'Puntaje',      alias: ['puntaje'] },
  { k: 'puntaje_real', h: 'Puntaje real', alias: ['puntaje real'] },
  { k: 'medalla',      h: 'Medalla',      alias: ['medalla'] },
  { k: 'caso',         h: 'Caso',         alias: ['caso'] },
  { k: 'diagnostico',  h: 'Diagnóstico',  alias: ['diagnostico'] },
  { k: 'desenlace',    h: 'Desenlace',    alias: ['desenlace'] },
  { k: 'estado',       h: 'Estado',       alias: ['estado'] },
  { k: 'enviado',      h: 'Enviado',      alias: ['enviado', 'enviado en'] },
  { k: 'detalle',      h: 'Detalle',      alias: ['detalle'] },
  { k: 'intentos',     h: 'Intentos',     alias: ['intentos'] }
];
const COLUMNAS_TEXTO = ['id', 'telefono'];   // formato texto: sin notación científica ni fórmulas

/** { clave: índice de columna (0..n) } a partir de la fila de encabezados. */
function mapearColumnas(encabezados) {
  const norm = encabezados.map(normalizar);
  const mapa = {}, usadas = {};
  COLUMNAS.forEach(function (c) {
    for (var i = 0; i < norm.length; i++) {
      if (!usadas[i] && c.alias.indexOf(norm[i]) !== -1) { mapa[c.k] = i; usadas[i] = true; return; }
    }
  });
  COLUMNAS.forEach(function (c) {
    if (mapa[c.k] !== undefined || !c.contiene) return;
    for (var i = 0; i < norm.length; i++) {
      if (usadas[i]) continue;
      if (c.contiene.some(function (w) { return norm[i].indexOf(w) !== -1; })) { mapa[c.k] = i; usadas[i] = true; return; }
    }
  });
  return mapa;
}

function propiedades() { return PropertiesService.getScriptProperties(); }

function hojaDeLeads() {
  const id = propiedades().getProperty('HOJA_ID');
  const libro = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  if (!libro) throw new Error('No encuentro la hoja: ejecuta configurar() desde la hoja.');
  var hoja = libro.getSheetByName(CONFIG.NOMBRE_PESTANA);
  if (!hoja) hoja = libro.insertSheet(CONFIG.NOMBRE_PESTANA);
  return asegurarEncabezados(hoja);
}

/** Pone los encabezados si la hoja está vacía y añade al final los de resultado que falten. */
function asegurarEncabezados(hoja) {
  const ultimaCol = Math.max(hoja.getLastColumn(), 1);
  var encabezados = hoja.getRange(1, 1, 1, ultimaCol).getValues()[0];
  if (encabezados.every(function (x) { return String(x).trim() === ''; })) {
    encabezados = COLUMNAS.map(function (c) { return c.h; });
    hoja.getRange(1, 1, 1, encabezados.length).setValues([encabezados]).setFontWeight('bold');
    hoja.setFrozenRows(1);
  }
  var mapa = mapearColumnas(encabezados);
  const faltan = COLUMNAS.filter(function (c) { return mapa[c.k] === undefined; });
  if (faltan.length) {
    hoja.getRange(1, encabezados.length + 1, 1, faltan.length)
      .setValues([faltan.map(function (c) { return c.h; })]).setFontWeight('bold');
    encabezados = encabezados.concat(faltan.map(function (c) { return c.h; }));
    mapa = mapearColumnas(encabezados);
  }
  COLUMNAS_TEXTO.forEach(function (k) {
    if (mapa[k] !== undefined) hoja.getRange(1, mapa[k] + 1, hoja.getMaxRows(), 1).setNumberFormat('@');
  });
  return { hoja: hoja, mapa: mapa, ancho: encabezados.length };
}

/** Texto que llega de fuera y va a una celda nueva: nunca se interpreta como
    fórmula. El teléfono y el ID se limpian a sus caracteres válidos (sus
    columnas son de texto); el resto lleva el apóstrofo de "esto es texto". */
function celdaSegura(v, clave) {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return v;
  const s = String(v).trim().slice(0, 500);
  if (clave === 'telefono') return s.replace(/[^\d+()\-\s]/g, '').replace(/^[-\s]+/, '').slice(0, 40);
  if (clave === 'id') return s.replace(/[^\w\-]/g, '').slice(0, 60);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

/** Al leer: quita el apóstrofo protector si una herramienta lo dejó literal. */
function leerTexto(v) {
  return String(v == null ? '' : v).replace(/^'/, '').trim();
}

/* ------------------------------------------------------------
   5 · PROCESAR LAS FILAS PENDIENTES
   Estados: (vacío) pendiente → enviando → enviado.
   Si falla: error (se reintenta hasta MAX_INTENTOS) · incompleto (faltan
   respuestas; se corrige la fila y se vacía Estado) · omitido (correo no
   válido o vacío) · duplicado (mismo ID de lead ya enviado) · revisar (quedó
   en "enviando": pudo salir o no; se revisa y se vacía Estado para reenviar).
   Para reenviar cualquier fila: vaciar su celda de Estado.

   El script SOLO escribe sus columnas de resultado, nunca las de entrada:
   así no deshace la protección contra fórmulas ni pisa lo que alguien
   corrija a mano mientras tanto.
   ------------------------------------------------------------ */
const COLUMNAS_DEL_SCRIPT = ['puntaje', 'puntaje_real', 'medalla', 'caso', 'diagnostico', 'desenlace', 'estado', 'enviado', 'detalle', 'intentos'];

/** opciones: { esperaCerrojo (ms), presupuesto (ms), maxFilas, primero (nº de fila a atender antes que las demás) } */
function procesarPendientes(opciones) {
  const o = opciones || {};
  const cerrojo = LockService.getScriptLock();
  if (!cerrojo.tryLock(o.esperaCerrojo || 25000)) return { procesadas: 0, enviadas: 0, errores: 0, ocupado: true };
  try {
    return procesarPendientesSinCerrojo(o);
  } finally {
    SpreadsheetApp.flush();
    cerrojo.releaseLock();
  }
}

/** Destinatarios que gasta cada envío: el lead y los de la copia oculta. */
function destinatariosPorEnvio() {
  return 1 + (CONFIG.COPIA_OCULTA ? String(CONFIG.COPIA_OCULTA).split(',').filter(function (x) { return x.trim(); }).length : 0);
}

function procesarPendientesSinCerrojo(o) {
  const inicio = Date.now();
  const presupuesto = o.presupuesto || 4.5 * 60 * 1000;
  const maxFilas = o.maxFilas || CONFIG.MAX_POR_EJECUCION;
  const h = hojaDeLeads();
  const hoja = h.hoja, mapa = h.mapa;
  const ultima = hoja.getLastRow();
  const resumen = { procesadas: 0, enviadas: 0, errores: 0 };
  if (ultima < 2) return resumen;

  const filas = hoja.getRange(2, 1, ultima - 1, h.ancho).getValues();
  const col = function (fila, k) { return mapa[k] === undefined ? '' : fila[mapa[k]]; };

  const idsEnviados = {};
  filas.forEach(function (f) {
    const est = leerTexto(col(f, 'estado'));
    const id = leerTexto(col(f, 'id'));
    if (id && (est === 'enviado' || est === 'enviando' || est === 'revisar')) idsEnviados[id] = true;
  });

  // La fila que acaba de llegar por el webhook va primero; luego, en orden.
  const orden = filas.map(function (_, i) { return i; });
  if (o.primero && o.primero >= 2 && o.primero - 2 < filas.length) {
    orden.splice(o.primero - 2, 1);
    orden.unshift(o.primero - 2);
  }

  for (var j = 0; j < orden.length; j++) {
    if (resumen.procesadas >= maxFilas) break;
    if (Date.now() - inicio > presupuesto) break;
    const i = orden[j];
    const fila = filas[i];
    const nFila = i + 2;
    const estado = leerTexto(col(fila, 'estado'));
    const intentos = Number(col(fila, 'intentos')) || 0;

    if (estado === 'enviando') {
      escribirResultado(hoja, nFila, mapa, fila, {
        estado: 'revisar',
        detalle: 'Se cortó mientras se enviaba: puede que el correo saliera. Revisa en Enviados y vacía Estado para reenviar.'
      });
      continue;
    }
    if (leerTexto(col(fila, 'email')) === '') continue;
    if (!(estado === '' || (estado === 'error' && intentos < CONFIG.MAX_INTENTOS))) continue;
    if (MailApp.getRemainingDailyQuota() < destinatariosPorEnvio()) {
      escribirResultado(hoja, nFila, mapa, fila, { detalle: 'Sin cuota diaria de correo: se enviará cuando se renueve.' });
      break;
    }

    resumen.procesadas++;
    var salida;
    try {
      salida = procesarFila(hoja, nFila, fila, mapa, idsEnviados);
    } catch (err) {
      salida = 'error';
      escribirResultado(hoja, nFila, mapa, fila, { detalle: 'Error inesperado: ' + String(err && err.message || err).slice(0, 200) });
    }
    if (salida === 'enviado') resumen.enviadas++;
    if (salida === 'error') resumen.errores++;
  }
  return resumen;
}

/**
 * Escribe en la fila SOLO las columnas del script (`cambios`: { clave: valor })
 * y actualiza la copia en memoria. Antes comprueba que la fila sigue siendo
 * la misma (mismo ID y correo): si alguien ordenó o borró filas mientras
 * tanto, no escribe nada y la fila se atiende en la siguiente pasada.
 */
function escribirResultado(hoja, nFila, mapa, fila, cambios) {
  const identidad = ['id', 'email'].filter(function (k) { return mapa[k] !== undefined; });
  for (var i = 0; i < identidad.length; i++) {
    const k = identidad[i];
    if (leerTexto(hoja.getRange(nFila, mapa[k] + 1).getValue()) !== leerTexto(fila[mapa[k]])) return false;
  }
  const cols = Object.keys(cambios)
    .filter(function (k) { return COLUMNAS_DEL_SCRIPT.indexOf(k) !== -1 && mapa[k] !== undefined; })
    .map(function (k) { fila[mapa[k]] = cambios[k]; return mapa[k]; })
    .sort(function (a, b) { return a - b; });
  // Columnas contiguas en un solo setValues.
  var desde = 0;
  while (desde < cols.length) {
    var hasta = desde;
    while (hasta + 1 < cols.length && cols[hasta + 1] === cols[hasta] + 1) hasta++;
    const tramo = fila.slice(cols[desde], cols[hasta] + 1);
    hoja.getRange(nFila, cols[desde] + 1, 1, tramo.length).setValues([tramo]);
    desde = hasta + 1;
  }
  return true;
}

function esErrorDeCuota(err) {
  return /too many times|quota|cuota|limit exceeded/i.test(String(err && err.message || err));
}

function procesarFila(hoja, nFila, fila, mapa, idsEnviados) {
  const col = function (k) { return mapa[k] === undefined ? '' : fila[mapa[k]]; };
  const escribir = function (cambios) { return escribirResultado(hoja, nFila, mapa, fila, cambios); };
  const intentos = Number(col('intentos')) || 0;

  const email = leerTexto(col('email')).toLowerCase();
  if (!EMAIL_VALIDO.test(email)) {
    escribir({ estado: 'omitido', detalle: 'Correo no válido: ' + leerTexto(col('email')).slice(0, 80) });
    return 'omitido';
  }
  const idLead = leerTexto(col('id'));
  if (idLead && idsEnviados[idLead]) {
    escribir({ estado: 'duplicado', detalle: 'Este ID de lead ya tiene un correo enviado en otra fila.' });
    return 'duplicado';
  }

  const textos = {};
  PREGUNTAS.forEach(function (p) { textos[p.id] = leerTexto(col(p.id)); });
  const leidas = leerRespuestas(textos);
  if (leidas.fallos.length) {
    escribir({ estado: 'incompleto', detalle: 'No entiendo la respuesta de ' + leidas.fallos.join(' · ') + '. Corrígela (o añade un ALIAS) y vacía Estado.' });
    return 'incompleto';
  }

  const res = evaluar(leidas.r);
  const lead = { email: email, nombre: leerTexto(col('nombre')), telefono: leerTexto(col('telefono')), id: idLead, fecha: col('fecha'), origen: leerTexto(col('origen')) };

  const reclamada = escribir({
    puntaje: res.puntajeVisible, puntaje_real: res.puntaje, medalla: res.franja.medalla, caso: res.claveCaso,
    diagnostico: res.caso.limitacion, desenlace: res.desenlace, estado: 'enviando', intentos: intentos + 1, detalle: ''
  });
  if (!reclamada) return 'movida';
  SpreadsheetApp.flush();

  try {
    const avisos = enviarCorreo(res, lead);
    if (idLead) idsEnviados[idLead] = true;
    const aviso = enviarWebhookSalida(res, lead);
    if (aviso) avisos.push(aviso);
    escribir({ estado: 'enviado', enviado: new Date(), detalle: avisos.join(' · ') });
    return 'enviado';
  } catch (err) {
    if (esErrorDeCuota(err)) {
      // No es culpa del lead: no gasta intento y sale en cuanto haya cuota.
      escribir({ estado: '', intentos: intentos, detalle: 'Sin cuota diaria de correo: se enviará cuando se renueve.' });
      return 'cuota';
    }
    const agotado = intentos + 1 >= CONFIG.MAX_INTENTOS;
    escribir({ estado: 'error', detalle: 'No se pudo enviar' + (agotado ? ' (sin más reintentos)' : '') + ': ' + String(err && err.message || err).slice(0, 300) });
    return 'error';
  }
}

/* ------------------------------------------------------------
   6 · EL CORREO
   Réplica de la página de gracias de la landing en HTML de correo:
   tablas y estilos en línea (Gmail, Outlook, Apple Mail), 600 px en
   escritorio y a todo el ancho en el móvil, como la opción D.
   ------------------------------------------------------------ */
const C = {
  morado: '#6b33f4', moradoOscuro: '#5c21e0', morado800: '#4d1bbc', morado50: '#f4f3ff', morado200: '#d9d4ff', morado300: '#bcb2ff',
  fondoTarjeta: '#240c66', naranja: '#f97316', texto: '#18181b', sutil: '#52525b', apagado: '#71717a', borde: '#e4e4e7', pista: '#f4f4f5', fondo: '#f4f4f5'
};
const FUENTE = "'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** El nombre va en el asunto y en el saludo: solo se usa si es un nombre de
    verdad (letras), para que nadie meta un enlace o un aviso falso en un
    correo oficial rellenando el formulario. */
function primerNombre(nombre) {
  const n = String(nombre || '').normalize('NFC').trim()
    .split(/[\s\u2800\u3164\u115F\u1160\u200B-\u200F\u202A-\u202E\u2060-\u206F]+/)[0] || '';
  if (!/^\p{L}[\p{L}\p{M}'’\-]{0,23}$/u.test(n)) return '';
  return n.charAt(0).toUpperCase() + n.slice(1).toLowerCase();
}

/** Pone o sustituye parámetros de consulta en una URL (Apps Script no tiene URL()). */
function conParametros(url, params) {
  const hash = url.indexOf('#') === -1 ? '' : url.slice(url.indexOf('#'));
  const sinHash = hash ? url.slice(0, url.indexOf('#')) : url;
  const q = sinHash.indexOf('?');
  const base = q === -1 ? sinHash : sinHash.slice(0, q);
  const pares = q === -1 ? [] : sinHash.slice(q + 1).split('&').filter(String);
  const claves = Object.keys(params).filter(function (k) { return params[k] !== '' && params[k] !== null && params[k] !== undefined; });
  const restantes = pares.filter(function (p) { return claves.indexOf(decodeURIComponent(p.split('=')[0])) === -1; });
  claves.forEach(function (k) { restantes.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k])); });
  return base + (restantes.length ? '?' + restantes.join('&') : '') + hash;
}

function urlConResultado(base, res) {
  return conParametros(base, {
    utm_medium: CONFIG.UTM_MEDIUM_CORREO,
    utm_term: res.califica && !res.noAplica ? 'calificado_si' : 'calificado_no',
    utm_content: 'score_' + res.puntaje
  });
}

function nombresMedalla(res) {
  const base = 'cbs-' + res.puntajeVisible + '-' + res.claveCaso;
  return { cabecera: base + '-correo.jpg', completa: base + '.jpg' };
}

/** Blob de una medalla desde la carpeta de Drive (con caché de IDs), o null. */
/** La carpeta de medallas: la de CONFIG o la que creó "Importar medallas". */
function carpetaMedallasId() {
  return CONFIG.CARPETA_MEDALLAS_ID || propiedades().getProperty('CARPETA_MEDALLAS_ID') || '';
}

function medallaDeDrive(nombre) {
  const carpeta = carpetaMedallasId();
  if (!carpeta) return null;
  const cache = CacheService.getScriptCache();
  const clave = 'medalla:' + carpeta + ':' + nombre;
  var id = cache.get(clave);
  if (id === '-') return null;
  if (id) {
    const f = DriveApp.getFileById(id);
    if (!f.isTrashed()) return f.getBlob();
  }
  const it = DriveApp.getFolderById(carpeta).getFilesByName(nombre);
  while (it.hasNext()) {
    const f = it.next();
    if (f.isTrashed()) continue;
    cache.put(clave, f.getId(), 21600);
    return f.getBlob();
  }
  cache.put(clave, '-', 300);   // el "no está" caduca pronto: puede estar subiéndose
  return null;
}

/** Qué imágenes lleva el correo y de dónde salen. Nunca impide el envío. */
function imagenesDelCorreo(res) {
  const n = nombresMedalla(res);
  const out = { src: '', descarga: '', inline: {}, adjuntos: [], avisos: [] };
  try {
    if (CONFIG.URL_BASE_MEDALLAS) {
      out.src = CONFIG.URL_BASE_MEDALLAS + n.cabecera;
      out.descarga = CONFIG.URL_BASE_MEDALLAS + n.completa;
      if (CONFIG.ADJUNTAR_MEDALLA) {
        const r = UrlFetchApp.fetch(out.descarga, { muteHttpExceptions: true });
        if (r.getResponseCode() === 200) out.adjuntos.push(r.getBlob().setName('mi-medalla-creator-business-score.jpg'));
        else out.avisos.push('Adjunto no disponible (' + r.getResponseCode() + ')');
      }
    } else if (carpetaMedallasId()) {
      const cab = medallaDeDrive(n.cabecera);
      if (cab) { out.inline.medalla = cab.setName('medalla.jpg'); out.src = 'cid:medalla'; }
      else out.avisos.push('Falta ' + n.cabecera + ' en la carpeta de medallas');
      if (CONFIG.ADJUNTAR_MEDALLA) {
        const comp = medallaDeDrive(n.completa);
        if (comp) out.adjuntos.push(comp.setName('mi-medalla-creator-business-score.jpg'));
        else out.avisos.push('Falta ' + n.completa);
      }
    } else {
      out.avisos.push('Sin carpeta de medallas (menú → Importar medallas): se envió con la cabecera de texto');
    }
  } catch (err) {
    out.src = ''; out.inline = {}; out.adjuntos = [];
    out.avisos.push('Medalla no disponible: ' + String(err && err.message || err).slice(0, 120));
  }
  return out;
}

function asuntoDe(res, lead) {
  const n = primerNombre(lead.nombre);
  return (n ? n + ', tu' : 'Tu') + ' Creator Business Score: ' + res.puntajeVisible + '/100 · Medalla de ' + res.franja.medalla;
}

/** Dirección para darse de baja que aparece en el pie. */
function correoDeBaja() {
  if (CONFIG.CORREO_BAJA || CONFIG.RESPONDER_A) return CONFIG.CORREO_BAJA || CONFIG.RESPONDER_A;
  try { return Session.getEffectiveUser().getEmail(); } catch (err) { return ''; }
}

function enviarCorreo(res, lead) {
  const img = imagenesDelCorreo(res);
  img.baja = correoDeBaja();
  const correo = construirCorreo(res, lead, img);
  const opciones = {
    to: lead.email,
    subject: correo.asunto,
    htmlBody: correo.html,
    body: correo.texto,
    name: CONFIG.REMITENTE_NOMBRE
  };
  if (CONFIG.RESPONDER_A) opciones.replyTo = CONFIG.RESPONDER_A;
  if (CONFIG.COPIA_OCULTA) opciones.bcc = CONFIG.COPIA_OCULTA;
  if (Object.keys(img.inline).length) opciones.inlineImages = img.inline;
  if (img.adjuntos.length) opciones.attachments = img.adjuntos;
  MailApp.sendEmail(opciones);
  return img.avisos;
}

/** { asunto, html, texto } — pura: no toca Drive ni la hoja (se prueba en local). */
function construirCorreo(res, lead, img) {
  img = img || { src: '', descarga: '', adjuntos: [] };
  const v = res.puntajeVisible, f = res.franja, caso = res.caso;
  const nombre = primerNombre(lead && lead.nombre);
  const hayAdjunto = img.adjuntos && img.adjuntos.length > 0;
  const desbloqueo = caso.desbloqueo || caso.limitacion;

  const chip = res.noAplica
    ? { t: FUERA_DE_PERFIL.chip, bg: '#f4f4f5', bd: '#d4d4d8', c: '#52525b' }
    : res.califica
      ? { t: 'Calificas para aplicar', bg: '#ecfdf3', bd: '#abefc6', c: '#166534' }
      : { t: 'Fase de ordenar', bg: '#fef3f2', bd: '#fecdca', c: '#b42318' };
  const faseHtml = res.noAplica
    ? esc(FUERA_DE_PERFIL.fase)
    : res.califica
      ? 'Ya facturas y tienes comunidad: calificas para aplicar a <strong style="color:' + C.moradoOscuro + ';font-weight:800;">Classroom Platinum</strong>, el programa de escalado de Kunfupay.'
      : 'Tu negocio genera ingresos, pero todavía no opera como empresa. Primero se ordena, después se escala.';
  const faseTexto = faseHtml.replace(/<[^>]+>/g, '');

  const cta = res.noAplica ? null : res.califica
    ? { t: 'Aplicar a Classroom Platinum', url: urlConResultado(CONFIG.URL_APLICAR, res), bg: C.morado, sombra: 'rgba(107,51,244,.45)' }
    : { t: 'Empezar con Kunfupay', url: urlConResultado(CONFIG.URL_KUNFUPAY, res), bg: C.naranja, sombra: 'rgba(249,115,22,.5)' };
  const notaCta = res.noAplica ? FUERA_DE_PERFIL.nota
    : res.califica ? 'Si tu resultado es positivo, puedes aplicar a nuestro plan de inversión para potenciar tu negocio digital.' : '';

  const barras = [
    ['Ritmo del negocio', res.variables.ritmo],
    ['Escalabilidad del modelo', res.variables.modelo],
    ['Conversión de audiencia', res.variables.conversion],
    ['Tamaño de comunidad', res.variables.comunidad]
  ];
  const pasos = caso.pasos.map(function (p, i) { return { n: '0' + (i + 1), t: p.titulo, d: p.desc }; });
  const conKunfupay = !res.califica && !res.noAplica;
  const tituloPasos = conKunfupay ? '3 pasos de acción inmediatos, y cómo te ayudamos' : '3 pasos de acción inmediatos';
  const asunto = asuntoDe(res, lead || {});
  const preheader = f.titular + '. Tu diagnóstico y 3 pasos para tu negocio.';
  const alt = 'Tu medalla: ' + v + ' sobre 100, ' + f.medalla + '.';

  /* ---------- piezas HTML ---------- */
  const p = function (txt, estilo) { return '<p style="margin:0;font-family:' + FUENTE + ';' + estilo + '">' + txt + '</p>'; };
  const eyebrow = function (t) { return p(esc(t).toUpperCase(), 'font-size:12px;line-height:16px;font-weight:700;letter-spacing:1px;color:' + C.apagado + ';'); };
  const boton = function (t, url, bg, sombra, estiloExtra) {
    return '<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;"><tr>' +
      '<td align="center" bgcolor="' + bg + '" style="border-radius:999px;background:' + bg + ';box-shadow:0 10px 24px -10px ' + sombra + ';mso-padding-alt:16px 34px;' + (estiloExtra || '') + '">' +
      '<a href="' + esc(url) + '" target="_blank" style="display:inline-block;padding:16px 34px;font-family:' + FUENTE + ';font-size:16px;line-height:20px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;">' + esc(t) + '</a>' +
      '</td></tr></table>';
  };
  const panel = function (interior) {
    return '<tr><td class="px-panel" style="padding:0 24px 20px;">' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ' + C.borde + ';border-radius:18px;background:#ffffff;">' +
      '<tr><td class="px-in" style="padding:26px 26px 24px;">' + interior + '</td></tr></table></td></tr>';
  };

  const hojaSobreTarjeta = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="' + C.fondoTarjeta + '" style="background:' + C.fondoTarjeta + ';"><tr><td style="padding:0;font-size:0;line-height:0;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background:#ffffff;border-radius:28px 28px 0 0;"><tr><td height="26" style="height:26px;font-size:0;line-height:0;">&nbsp;</td></tr></table>' +
    '</td></tr></table>';
  const cabecera = img.src
    ? '<img src="' + esc(img.src) + '" width="600" alt="' + esc(alt) + '" class="hero" style="display:block;width:100%;max-width:600px;height:auto;border:0;outline:none;text-decoration:none;border-radius:24px 24px 0 0;background:' + C.fondoTarjeta + ';">'
    : cabeceraDeTexto(res);

  var hojaBlanca = '';
  if (nombre) hojaBlanca += p('Hola, ' + esc(nombre) + '. Este es tu resultado.', 'font-size:16px;line-height:24px;font-weight:700;color:' + C.texto + ';padding:0 0 6px;');
  hojaBlanca += p('Comparte tu resultado con otros creadores y rétalos a superarte.' + (hayAdjunto ? ' Tu medalla va adjunta a este correo, lista para tu story.' : ''), 'font-size:14px;line-height:21px;color:' + C.sutil + ';');
  if (img.descarga) {
    hojaBlanca += '<div style="height:14px;line-height:14px;font-size:0;">&nbsp;</div>' +
      '<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td align="center" bgcolor="' + C.pista + '" style="border-radius:999px;border:1px solid ' + C.borde + ';mso-padding-alt:11px 22px;">' +
      '<a href="' + esc(img.descarga) + '" target="_blank" style="display:inline-block;padding:11px 22px;font-family:' + FUENTE + ';font-size:14px;line-height:18px;font-weight:700;color:' + C.sutil + ';text-decoration:none;">Descargar mi medalla</a></td></tr></table>';
  }
  hojaBlanca += '<div style="height:22px;line-height:22px;font-size:0;">&nbsp;</div>' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td style="border-radius:999px;background:' + chip.bg + ';border:1px solid ' + chip.bd + ';padding:5px 12px;font-family:' + FUENTE + ';font-size:12.5px;line-height:17px;font-weight:600;color:' + chip.c + ';">' + esc(chip.t) + '</td></tr></table>' +
    '<div style="height:12px;line-height:12px;font-size:0;">&nbsp;</div>' +
    p(faseHtml, 'font-size:14px;line-height:22px;color:' + C.apagado + ';text-align:center;max-width:360px;margin:0 auto;') +
    '<div style="height:24px;line-height:24px;font-size:0;border-bottom:1px solid #f1f1f3;">&nbsp;</div>' +
    '<div style="height:24px;line-height:24px;font-size:0;">&nbsp;</div>';
  if (cta) hojaBlanca += boton(cta.t, cta.url, cta.bg, cta.sombra);
  if (notaCta) hojaBlanca += (cta ? '<div style="height:14px;line-height:14px;font-size:0;">&nbsp;</div>' : '') +
    p(esc(notaCta), 'font-size:13px;line-height:20px;color:' + C.apagado + ';text-align:center;max-width:380px;margin:0 auto;');

  var filasBarras = '';
  barras.forEach(function (b, i) {
    const val = Math.max(0, Math.min(100, Number(b[1]) || 0));
    const color = val < 60 ? C.morado300 : C.morado;
    filasBarras += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"' + (i ? ' style="margin-top:16px;"' : '') + '><tr>' +
      '<td style="font-family:' + FUENTE + ';font-size:14.5px;line-height:20px;font-weight:600;color:' + C.texto + ';">' + esc(b[0]) + '</td>' +
      '<td align="right" width="44" style="font-family:' + FUENTE + ';font-size:14.5px;line-height:20px;color:' + C.sutil + ';">' + val + '</td></tr>' +
      '<tr><td colspan="2" style="padding-top:7px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="' + C.pista + '" style="background:' + C.pista + ';border-radius:999px;"><tr>' +
      (val > 0 ? '<td width="' + val + '%" bgcolor="' + color + '" style="background:' + color + ';height:6px;line-height:6px;font-size:0;border-radius:999px;">&nbsp;</td>' : '') +
      (val < 100 ? '<td style="height:6px;line-height:6px;font-size:0;">&nbsp;</td>' : '') +
      '</tr></table></td></tr></table>';
  });

  const paso = function (n, t, d, kunfupay) {
    const circulo = kunfupay
      ? 'background:' + C.morado + ';color:#ffffff;'
      : 'background:' + C.morado50 + ';color:' + C.moradoOscuro + ';';
    const fila = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' +
      '<td width="32" valign="top" style="padding-right:16px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" valign="middle" width="32" height="32" style="width:32px;height:32px;border-radius:999px;' + circulo + 'font-family:' + FUENTE + ';font-size:12.5px;font-weight:700;">' + n + '</td></tr></table></td>' +
      '<td valign="top">' +
      p(esc(t), 'font-size:16px;line-height:21px;font-weight:700;color:' + (kunfupay ? C.morado800 : C.texto) + ';padding:0 0 5px;') +
      p(esc(d), 'font-size:14px;line-height:22px;color:' + (kunfupay ? C.sutil : C.apagado) + ';') +
      '</td></tr></table>';
    if (!kunfupay) return fila;
    return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:2px;background:' + C.morado50 + ';border:1px solid ' + C.morado200 + ';border-radius:14px;"><tr><td style="padding:16px;">' + fila + '</td></tr></table>';
  };
  var htmlPasos = '';
  pasos.forEach(function (x, i) { htmlPasos += (i ? '<div style="height:20px;line-height:20px;font-size:0;">&nbsp;</div>' : '') + paso(x.n, x.t, x.d, false); });
  if (conKunfupay) htmlPasos += '<div style="height:20px;line-height:20px;font-size:0;">&nbsp;</div>' + paso('04', PASO_KUNFUPAY.titulo, PASO_KUNFUPAY.desc, true);

  const html =
'<!doctype html><html lang="es" xmlns="http://www.w3.org/1999/xhtml"><head>' +
'<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
'<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">' +
'<title>' + esc(asunto) + '</title>' +
'<!--[if !mso]><!--><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"><!--<![endif]-->' +
'<!--[if mso]><style>table,td,p,a,h2,h3,strong{font-family:\'Segoe UI\',Arial,sans-serif!important;}</style><![endif]-->' +
'<style>' +
  ':root{color-scheme:light;supported-color-schemes:light;}' +
  'body{margin:0;padding:0;-webkit-text-size-adjust:100%;}' +
  'a{text-decoration:none;}' +
  '@media only screen and (max-width:620px){' +
    '.marco{padding:0!important;}' +
    '.contenedor{width:100%!important;max-width:100%!important;border-radius:0!important;}' +
    '.hero{border-radius:0!important;}' +
    '.px{padding-left:20px!important;padding-right:20px!important;}' +
    '.px-panel{padding-left:12px!important;padding-right:12px!important;}' +
    '.px-in{padding:22px 18px 20px!important;}' +
  '}' +
'</style></head>' +
'<body style="margin:0;padding:0;background:' + C.fondo + ';">' +
'<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">' + esc(preheader) + '&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="' + C.fondo + '" style="background:' + C.fondo + ';"><tr>' +
'<td align="center" class="marco" style="padding:24px 12px;">' +
'<!--[if mso]><table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="contenedor" bgcolor="#ffffff" style="width:100%;max-width:600px;background:#ffffff;border-radius:24px;">' +
  '<tr><td style="padding:0;font-size:0;line-height:0;">' + cabecera + hojaSobreTarjeta + '</td></tr>' +
  '<tr><td class="px" align="center" style="padding:0 40px 30px;text-align:center;">' + hojaBlanca + '</td></tr>' +
  panel(eyebrow('Resultados') + '<div style="height:16px;line-height:16px;font-size:0;">&nbsp;</div>' + filasBarras) +
  panel(eyebrow('Diagnóstico personalizado') + '<div style="height:14px;line-height:14px;font-size:0;">&nbsp;</div>' +
    '<h2 style="margin:0;font-family:' + FUENTE + ';font-size:21px;line-height:28px;font-weight:700;color:' + C.texto + ';">' + esc(caso.titular) + '</h2>' +
    '<div style="height:14px;line-height:14px;font-size:0;">&nbsp;</div>' +
    p(esc(caso.diagnostico), 'font-size:15px;line-height:24px;color:' + C.sutil + ';') +
    '<div style="height:14px;line-height:14px;font-size:0;">&nbsp;</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:' + C.morado50 + ';border:1px solid ' + C.morado200 + ';border-radius:14px;"><tr><td style="padding:14px 16px;">' +
    p('<strong style="color:' + C.moradoOscuro + ';">La “X” en tu negocio.</strong> ' + esc(caso.x), 'font-size:14.5px;line-height:22px;color:' + C.sutil + ';') +
    '</td></tr></table>') +
  panel(eyebrow('Por dónde empezar') + '<div style="height:14px;line-height:14px;font-size:0;">&nbsp;</div>' +
    '<h3 style="margin:0;font-family:' + FUENTE + ';font-size:21px;line-height:28px;font-weight:800;letter-spacing:-0.5px;color:' + C.texto + ';">' + esc(tituloPasos) + '</h3>' +
    '<div style="height:18px;line-height:18px;font-size:0;">&nbsp;</div>' + htmlPasos) +
  '<tr><td class="px" style="padding:12px 40px 34px;border-top:1px solid #f1f1f3;">' +
    p('Kunfupay · Creator Business Score', 'font-size:12.5px;line-height:19px;color:' + C.apagado + ';font-weight:600;') +
    p('Auditoría orientativa. No constituye una oferta de financiamiento.', 'font-size:12.5px;line-height:19px;color:' + C.apagado + ';') +
    '<div style="height:10px;line-height:10px;font-size:0;">&nbsp;</div>' +
    p('Recibes este correo porque completaste el Creator Business Score de Kunfupay en Facebook o Instagram.' +
      (img.baja ? ' Si no quieres recibir más correos de Kunfupay, escribe a <a href="mailto:' + esc(img.baja) + '?subject=Baja" style="color:#71717a;text-decoration:underline;">' + esc(img.baja) + '</a>.' : ''),
      'font-size:11.5px;line-height:17px;color:#a1a1aa;') +
  '</td></tr>' +
'</table>' +
'<!--[if mso]></td></tr></table><![endif]-->' +
'</td></tr></table></body></html>';

  /* ---------- versión de texto ---------- */
  const lineas = [];
  lineas.push((nombre ? 'Hola, ' + nombre + '. ' : '') + 'Este es tu Creator Business Score.');
  lineas.push('');
  lineas.push(v + '/100 · Medalla de ' + f.medalla);
  lineas.push('"' + f.titular + '"');
  lineas.push('Mi próximo desbloqueo: ' + desbloqueo);
  if (hayAdjunto) lineas.push('Tu medalla va adjunta a este correo, lista para tu story.');
  if (img.descarga) lineas.push('Descargar mi medalla: ' + img.descarga);
  lineas.push('');
  lineas.push(chip.t.toUpperCase());
  lineas.push(faseTexto);
  if (cta) lineas.push(cta.t + ': ' + cta.url);
  if (notaCta) lineas.push(notaCta);
  lineas.push('');
  lineas.push('RESULTADOS');
  barras.forEach(function (b) { lineas.push('· ' + b[0] + ': ' + b[1]); });
  lineas.push('');
  lineas.push('DIAGNÓSTICO PERSONALIZADO');
  lineas.push(caso.titular);
  lineas.push(caso.diagnostico);
  lineas.push('La “X” en tu negocio. ' + caso.x);
  lineas.push('');
  lineas.push('POR DÓNDE EMPEZAR · ' + tituloPasos);
  pasos.forEach(function (x) { lineas.push(x.n + ' · ' + x.t + ': ' + x.d); });
  if (conKunfupay) lineas.push('04 · ' + PASO_KUNFUPAY.titulo + ': ' + PASO_KUNFUPAY.desc);
  lineas.push('');
  lineas.push('—');
  lineas.push('Kunfupay · Creator Business Score');
  lineas.push('Auditoría orientativa. No constituye una oferta de financiamiento.');
  if (img.baja) lineas.push('Si no quieres recibir más correos de Kunfupay, escribe a ' + img.baja + '.');

  return { asunto: asunto, html: html, texto: lineas.join('\n') };
}

/** Cabecera sin imagen (si falta la medalla): el puntaje en texto sobre el morado de la tarjeta. */
function cabeceraDeTexto(res) {
  const f = res.franja, caso = res.caso;
  const t = function (txt, estilo) { return '<p style="margin:0;font-family:' + FUENTE + ';color:#ffffff;' + estilo + '">' + txt + '</p>'; };
  return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="' + C.fondoTarjeta + '" style="background:' + C.fondoTarjeta + ';border-radius:24px 24px 0 0;" class="hero"><tr>' +
    '<td align="center" style="padding:40px 28px 44px;text-align:center;">' +
    t('CREATOR BUSINESS SCORE', 'font-size:12px;line-height:16px;letter-spacing:3px;font-weight:700;opacity:.8;') +
    '<div style="height:18px;line-height:18px;font-size:0;">&nbsp;</div>' +
    t(String(res.puntajeVisible), 'font-size:88px;line-height:88px;font-weight:800;letter-spacing:-3px;') +
    t('sobre 100 · ' + esc(f.medalla).toUpperCase(), 'font-size:13px;line-height:20px;font-weight:700;letter-spacing:2px;opacity:.85;padding-top:6px;') +
    '<div style="height:22px;line-height:22px;font-size:0;">&nbsp;</div>' +
    t(esc(f.titular), 'font-size:20px;line-height:27px;font-weight:800;') +
    '<div style="height:16px;line-height:16px;font-size:0;">&nbsp;</div>' +
    t('MI PRÓXIMO DESBLOQUEO', 'font-size:11px;line-height:16px;letter-spacing:2px;font-weight:700;opacity:.7;') +
    t(esc(caso.desbloqueo || caso.limitacion), 'font-size:16px;line-height:24px;font-weight:600;') +
    '</td></tr></table>';
}

/* ------------------------------------------------------------
   7 · WEBHOOK DE ENTRADA (app web)
   POST https://script.google.com/macros/s/…/exec?token=XXXX
   Cuerpo JSON: los datos del lead con estas claves (las que falten se
   ignoran), o el objeto del lead de Meta tal cual (field_data):
     { "id_lead", "fecha", "nombre", "email", "telefono",
       "comunidad", "situacion", "producto", "facturacion", "problema",
       "origen" }
   Sin cuerpo, solo procesa lo pendiente de la hoja.
   ------------------------------------------------------------ */
function doPost(e) {
  const responder = function (obj) {
    return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
  };
  const token = propiedades().getProperty('WEBHOOK_TOKEN');
  var datos = {}, ilegible = false;
  const cuerpo = e && e.postData && e.postData.contents;
  const parametros = (e && e.parameter) || {};
  const otrosParametros = Object.keys(parametros).filter(function (k) { return k !== 'token'; });
  if (cuerpo) {
    try { datos = JSON.parse(cuerpo); } catch (err) { datos = {}; ilegible = otrosParametros.length === 0; }
  }
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) { datos = {}; ilegible = true; }
  const traeCampos = ilegible || otrosParametros.length > 0 || Object.keys(datos).some(function (k) { return k !== 'token'; });
  const recibido = (e && e.parameter && e.parameter.token) || datos.token || '';
  if (!token || !igualesSeguro(String(recibido), token)) return responder({ ok: false, error: 'token no válido' });

  const salida = { ok: true };
  var lead = null;
  try {
    lead = leadEntrante(datos, parametros);
    if (!lead && traeCampos) {
      console.error('Webhook: cuerpo recibido sin datos de lead reconocibles: ' + String(cuerpo).slice(0, 300));
      return responder({ ok: false, error: 'El cuerpo no trae ningún campo reconocible (email, nombre, respuestas…). Revisa el mapeo en Make.' });
    }
    if (lead) salida.fila = anexarLead(lead);
  } catch (err) {
    console.error('Webhook: no se pudo guardar el lead: ' + (err && err.stack || err));
    return responder({ ok: false, error: 'No se pudo guardar el lead: ' + String(err && err.message || err).slice(0, 200) });
  }
  // Respuesta rápida (Make corta a los 40 s): se atiende la fila recién
  // llegada y poco más; el resto lo recoge el reloj.
  try {
    const r = procesarPendientes({ esperaCerrojo: 3000, presupuesto: 20000, maxFilas: 3, primero: salida.fila > 0 ? salida.fila : 0 });
    salida.procesadas = r.procesadas; salida.enviadas = r.enviadas; salida.errores = r.errores;
    if (r.ocupado) salida.nota = 'Guardado. Otra ejecución estaba enviando: saldrá en la próxima pasada del reloj.';
  } catch (err) {
    salida.nota = 'Guardado; el envío se reintentará: ' + String(err && err.message || err).slice(0, 200);
  }
  return responder(salida);
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, servicio: 'creator-business-score' })).setMimeType(ContentService.MimeType.JSON);
}

function igualesSeguro(a, b) {
  if (a.length !== b.length) return false;
  var d = 0;
  for (var i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

/** Del cuerpo del POST a { clave de columna: valor }, o null si no trae un lead. */
function leadEntrante(datos, parametros) {
  const plano = {};
  const anadir = function (k, v) {
    if (v === null || v === undefined || typeof v === 'object') return;
    if (String(v).trim() === '') return;
    plano[k] = v;
  };
  Object.keys(parametros).forEach(function (k) { if (k !== 'token') anadir(k, parametros[k]); });
  Object.keys(datos).forEach(function (k) { if (k !== 'token' && k !== 'field_data') anadir(k, datos[k]); });
  // Formato del lead de Meta: field_data: [{ name, values: [...] }]
  if (Array.isArray(datos.field_data)) {
    datos.field_data.forEach(function (c) {
      if (c && c.name) anadir(c.name, Array.isArray(c.values) ? c.values.join(', ') : c.values);
    });
  }
  const claves = Object.keys(plano);
  if (!claves.length) return null;

  // Mismo reconocimiento que los encabezados de la hoja, más los nombres
  // que usa Meta en sus campos estándar.
  const extra = { email: 'email', full_name: 'nombre', first_name: 'nombre', phone_number: 'telefono', created_time: 'fecha', id_lead: 'id', leadgen_id: 'id', id: 'id', platform: 'origen', situacion: 'ritmo', producto: 'modelo', problema: 'limitacion', comunidad: 'audiencia' };
  const mapa = mapearColumnas(claves);
  const lead = {};
  claves.forEach(function (k, i) {
    const kk = extra[k] || extra[normalizar(k).replace(/ /g, '_')];
    if (kk && lead[kk] === undefined) lead[kk] = plano[k];
  });
  Object.keys(mapa).forEach(function (k) { if (lead[k] === undefined) lead[k] = plano[claves[mapa[k]]]; });
  if (!lead.email && !PREGUNTAS.some(function (p) { return lead[p.id]; })) return null;
  return lead;
}

/**
 * Añade el lead como fila nueva y devuelve su número de fila (0 si no se
 * pudo saber). NUNCA lo descarta: si otra ejecución tiene el cerrojo, lo añade
 * igual (appendRow es atómico) sin mirar si el ID ya estaba; si era un
 * reintento, la fila quedará como "duplicado" y no se enviará dos veces.
 */
function anexarLead(lead) {
  const cerrojo = LockService.getScriptLock();
  const conCerrojo = cerrojo.tryLock(10000);
  try {
    const h = hojaDeLeads();
    const id = celdaSegura(lead.id, 'id');
    if (conCerrojo && id && h.mapa.id !== undefined && h.hoja.getLastRow() >= 2) {
      const ids = h.hoja.getRange(2, h.mapa.id + 1, h.hoja.getLastRow() - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) if (leerTexto(ids[i][0]) === id) return i + 2;
    }
    const fila = new Array(h.ancho).fill('');
    Object.keys(lead).forEach(function (k) {
      if (h.mapa[k] !== undefined && COLUMNAS.some(function (c) { return c.k === k; })) fila[h.mapa[k]] = celdaSegura(lead[k], k);
    });
    if (h.mapa.fecha !== undefined && !fila[h.mapa.fecha]) fila[h.mapa.fecha] = new Date();
    if (h.mapa.estado !== undefined) fila[h.mapa.estado] = '';
    if (!leerTexto(lead.email) && h.mapa.estado !== undefined) {
      fila[h.mapa.estado] = 'omitido';
      if (h.mapa.detalle !== undefined) fila[h.mapa.detalle] = 'Llegó sin correo: revisa en Make el campo email del módulo HTTP.';
    }
    h.hoja.appendRow(fila);
    if (!conCerrojo) return 0;
    SpreadsheetApp.flush();
    return h.hoja.getLastRow();
  } finally {
    if (conCerrojo) cerrojo.releaseLock();
  }
}

/* ------------------------------------------------------------
   8 · WEBHOOK DE SALIDA
   Mismos campos que la landing mandaba a /api/classroom-platinum/score,
   más el resultado completo. El puntaje que decide es el REAL.
   ------------------------------------------------------------ */
function cuerpoWebhookSalida(res, lead) {
  const r = res.respuestas;
  return {
    evento: 'cbs_resultado',
    email: lead.email,
    nombre: lead.nombre || '',
    telefono: lead.telefono || '',
    id_lead: lead.id || '',
    puntaje: res.puntaje,
    puntaje_visible: res.puntajeVisible,
    medalla: res.franja.medalla,
    caso: res.claveCaso + ' · ' + res.caso.titular,
    clave_caso: res.claveCaso,
    diagnostico_limitacion: res.caso.limitacion,
    califica: !!res.califica,
    no_aplica: !!res.noAplica,
    desenlace: res.desenlace,
    comunidad: r.audiencia.label,
    ritmo: r.ritmo.label,
    modelo: r.modelo.label,
    facturacion: r.facturacion.label,
    limitacion: r.limitacion.label,
    variables: res.variables,
    url_origen: 'meta_formulario_instantaneo' + (lead.origen ? ':' + lead.origen : ''),
    utm: { utm_source: 'meta', utm_medium: 'formulario_instantaneo', utm_term: res.califica && !res.noAplica ? 'calificado_si' : 'calificado_no', utm_content: 'score_' + res.puntaje }
  };
}

function enviarWebhookSalida(res, lead) {
  if (!CONFIG.WEBHOOK_SALIDA) return '';
  try {
    const r = UrlFetchApp.fetch(CONFIG.WEBHOOK_SALIDA, {
      method: 'post', contentType: 'application/json',
      payload: JSON.stringify(cuerpoWebhookSalida(res, lead)),
      muteHttpExceptions: true, followRedirects: true
    });
    const code = r.getResponseCode();
    return code >= 200 && code < 300 ? '' : 'Webhook de salida respondió ' + code;
  } catch (err) {
    return 'Webhook de salida falló: ' + String(err && err.message || err).slice(0, 150);
  }
}

/* ------------------------------------------------------------
   9 · MENÚ, CONFIGURACIÓN Y PRUEBAS
   ------------------------------------------------------------ */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Creator Business Score')
    .addItem('1 · Configurar (una sola vez)', 'configurar')
    .addItem('2 · Importar medallas a Drive', 'importarMedallas')
    .addItem('Ver token del webhook', 'mostrarWebhook')
    .addSeparator()
    .addItem('Enviarme los 3 correos de prueba', 'enviarPruebas')
    .addItem('Procesar pendientes ahora', 'procesarPendientesDesdeMenu')
    .addItem('Reenviar la fila seleccionada', 'reenviarSeleccion')
    .addToUi();
}

function configurar() {
  const props = propiedades();
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  if (libro) props.setProperty('HOJA_ID', libro.getId());
  if (!props.getProperty('WEBHOOK_TOKEN')) props.setProperty('WEBHOOK_TOKEN', Utilities.getUuid().replace(/-/g, ''));
  hojaDeLeads();

  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'procesarPendientes') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('procesarPendientes').timeBased().everyMinutes(CONFIG.MINUTOS_REVISION).create();

  const avisos = [];
  if (carpetaMedallasId()) {
    try {
      const n = contarMedallas(DriveApp.getFolderById(carpetaMedallasId()));
      avisos.push('Carpeta de medallas: ' + n + ' de ' + TOTAL_MEDALLAS + (n < TOTAL_MEDALLAS ? ' → menú "2 · Importar medallas a Drive"' : ' ✔'));
    } catch (err) { avisos.push('No puedo abrir la carpeta de medallas: revisa CARPETA_MEDALLAS_ID.'); }
  } else if (!CONFIG.URL_BASE_MEDALLAS) {
    avisos.push('Falta importar las medallas: menú "2 · Importar medallas a Drive".');
  }
  avisos.push('Revisión automática cada ' + CONFIG.MINUTOS_REVISION + ' min activada.');
  avisos.push('Cuota de correo restante hoy: ' + MailApp.getRemainingDailyQuota());
  aviso('Configuración lista', avisos.join('\n') + '\n\nDespués: Implementar → Nueva implementación → Aplicación web, y "Ver token del webhook".');
}

function mostrarWebhook() {
  const token = propiedades().getProperty('WEBHOOK_TOKEN');
  if (!token) { aviso('Webhook', 'Primero ejecuta "1 · Configurar".'); return; }
  aviso('Token del webhook', 'Token: ' + token +
    '\n\nLa URL para Make es la "URL de la aplicación web" de Implementar → Gestionar implementaciones (termina en /exec), con esto al final:' +
    '\n?token=' + token +
    '\n\nComprobación: abre esa URL (sin el token) en una ventana de incógnito; debe mostrar {"ok":true,"servicio":"creator-business-score"}.' +
    '\nPara cambiar el token si se filtra: Configuración del proyecto → Propiedades del script → borra WEBHOOK_TOKEN y vuelve a ejecutar Configurar.');
}

function procesarPendientesDesdeMenu() {
  const r = procesarPendientes();
  aviso('Procesado', r.ocupado ? 'Otra ejecución está procesando; inténtalo en un minuto.' : 'Filas procesadas: ' + r.procesadas + ' · enviadas: ' + r.enviadas + ' · con error: ' + r.errores);
}

function reenviarSeleccion() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  const rango = libro.getActiveRange();
  const h = hojaDeLeads();
  if (!rango || rango.getSheet().getName() !== h.hoja.getName() || rango.getRow() < 2) {
    aviso('Reenviar', 'Selecciona una celda de la fila del lead en la pestaña ' + CONFIG.NOMBRE_PESTANA + '.');
    return;
  }
  for (var r = rango.getRow(); r <= rango.getLastRow(); r++) {
    if (h.mapa.estado !== undefined) h.hoja.getRange(r, h.mapa.estado + 1).setValue('');
    if (h.mapa.intentos !== undefined) h.hoja.getRange(r, h.mapa.intentos + 1).setValue('');
  }
  procesarPendientesDesdeMenu();
}

/** Los tres desenlaces, a tu propio correo. No toca la hoja. */
function enviarPruebas() {
  const yo = Session.getEffectiveUser().getEmail();
  const casos = [
    { nombre: 'Prueba Califica', i: { audiencia: 3, ritmo: 3, modelo: 4, facturacion: 3, limitacion: 4 } },
    { nombre: 'Prueba Ordenar',  i: { audiencia: 1, ritmo: 0, modelo: 1, facturacion: 0, limitacion: 0 } },
    { nombre: 'Prueba Ecommerce', i: { audiencia: 2, ritmo: 2, modelo: 5, facturacion: 2, limitacion: 2 } }
  ];
  const avisos = [];
  casos.forEach(function (c) {
    const r = {};
    PREGUNTAS.forEach(function (p) { r[p.id] = p.opciones[c.i[p.id]]; });
    const res = evaluar(r);
    const a = enviarCorreo(res, { email: yo, nombre: c.nombre });
    avisos.push(c.nombre + ': ' + res.puntajeVisible + '/100 ' + res.franja.medalla + (a.length ? ' (' + a.join('; ') + ')' : ''));
  });
  aviso('Pruebas enviadas a ' + yo, avisos.join('\n'));
}

function aviso(titulo, texto) {
  try { SpreadsheetApp.getUi().alert(titulo, texto, SpreadsheetApp.getUi().ButtonSet.OK); }
  catch (err) { Logger.log(titulo + '\n' + texto); }
}

/* ------------------------------------------------------------
   10 · IMPORTAR LAS MEDALLAS A DRIVE (una vez)
   Descarga las 430 imágenes del repositorio público y las guarda en una
   carpeta "Medallas · Creator Business Score" junto a esta hoja (o en
   CONFIG.CARPETA_MEDALLAS_ID). Salta las que ya están, así que se puede
   repetir sin duplicar; si no le da tiempo, se reprograma sola y sigue.
   ------------------------------------------------------------ */
const ORIGEN_MEDALLAS = 'https://raw.githubusercontent.com/benjaminelias-jpg/Benja/486c6e83a728e3e7b9e79aaa35ba9526cf884ecf/2026-09-25-correo-creator-business-score/medallas/';
const TOTAL_MEDALLAS = 430;

function contarMedallas(carpeta) {
  const it = carpeta.getFiles();
  var n = 0;
  while (it.hasNext()) { const f = it.next(); if (!f.isTrashed() && /^cbs-\d+-\d\.\d(-correo)?\.jpg$/.test(f.getName())) n++; }
  return n;
}

function carpetaParaMedallas() {
  const id = carpetaMedallasId();
  if (id) return DriveApp.getFolderById(id);
  const libro = SpreadsheetApp.openById(propiedades().getProperty('HOJA_ID') || SpreadsheetApp.getActiveSpreadsheet().getId());
  const padres = DriveApp.getFileById(libro.getId()).getParents();
  const donde = padres.hasNext() ? padres.next() : DriveApp.getRootFolder();
  const carpeta = donde.createFolder('Medallas · Creator Business Score');
  propiedades().setProperty('CARPETA_MEDALLAS_ID', carpeta.getId());
  return carpeta;
}

function importarMedallas() {
  // Si viene de su propia reprogramación, se borra ese disparador de un solo uso.
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'importarMedallas') ScriptApp.deleteTrigger(t);
  });
  const inicio = Date.now();
  const carpeta = carpetaParaMedallas();
  const lista = JSON.parse(UrlFetchApp.fetch(ORIGEN_MEDALLAS + 'lista.json').getContentText());
  const hay = {};
  const it = carpeta.getFiles();
  while (it.hasNext()) { const f = it.next(); if (!f.isTrashed()) hay[f.getName()] = true; }
  const faltan = lista.filter(function (n) { return !hay[n]; });

  var hechas = 0, fallidas = 0;
  for (var i = 0; i < faltan.length; i += 10) {
    if (Date.now() - inicio > 4.5 * 60 * 1000) break;
    const lote = faltan.slice(i, i + 10);
    const resp = UrlFetchApp.fetchAll(lote.map(function (n) { return { url: ORIGEN_MEDALLAS + 'img/' + n, muteHttpExceptions: true }; }));
    resp.forEach(function (r, j) {
      if (r.getResponseCode() === 200) { carpeta.createFile(r.getBlob().setContentType('image/jpeg').setName(lote[j])); hechas++; }
      else fallidas++;
    });
  }
  const quedan = faltan.length - hechas;
  if (quedan > fallidas) {
    ScriptApp.newTrigger('importarMedallas').timeBased().after(60 * 1000).create();
    aviso('Importando medallas…', 'Van ' + (lista.length - quedan) + ' de ' + lista.length + '. Sigue sola en un minuto: no hace falta hacer nada.');
  } else if (quedan) {
    aviso('Medallas', 'Faltan ' + quedan + ' que no se pudieron descargar. Vuelve a ejecutar "Importar medallas".');
  } else {
    aviso('Medallas listas', 'Las ' + lista.length + ' medallas están en la carpeta "' + carpeta.getName() + '".');
  }
  return { importadas: hechas, fallidas: fallidas, quedan: quedan, carpeta: carpeta.getId() };
}

/* Para las pruebas en local (Node). En Apps Script `module` no existe. */
if (typeof module !== 'undefined') {
  module.exports = {
    CONFIG, PREGUNTAS, CASOS, FRANJAS, evaluar, puntajeVisible, franjaDe, normalizar, emparejarOpcion, leerRespuestas,
    mapearColumnas, construirCorreo, conParametros, urlConResultado, primerNombre, leadEntrante, cuerpoWebhookSalida,
    nombresMedalla, celdaSegura, esc, doPost, doGet, procesarPendientes, anexarLead, configurar, enviarPruebas,
    importarMedallas, mostrarWebhook, carpetaMedallasId, ORIGEN_MEDALLAS
  };
}
