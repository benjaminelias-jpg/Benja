/* ============================================================
   CREATOR BUSINESS SCORE · motor + interfaz
   ------------------------------------------------------------
   1 · Estado y navegación entre vistas
   2 · MOTOR: puntuación (0-100) y enrutado a caso de la matriz
   3 · Render del formulario
   4 · Render del resultado
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Reglas de negocio ajustables ---------- */
  const PESOS = { facturacion: .35, ritmo: .25, modelo: .15, conversion: .15, comunidad: .10 };
  /* Califica quien factura al menos 1.000 € al mes Y tiene al menos 5.000
     seguidores. El puntaje no interviene: es un semáforo de madurez, no la
     puerta. Los dos umbrales se comparan con el campo `desde` de la opción
     elegida, que es el suelo de cada tramo. */
  const FACTURACION_MINIMA_PARA_CALIFICAR = 1000;   // euros al mes
  const COMUNIDAD_MINIMA_PARA_CALIFICAR = 5000;     // seguidores
  const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ---------- Estado ---------- */
  let paso = 0;
  let avanzando = false;  // cierra la pregunta mientras corre el auto-avance
  const respuestas = new Array(PREGUNTAS.length).fill(null); // índices de opción

  /* ---------- Atajos DOM ---------- */
  const $ = (sel) => document.querySelector(sel);
  const vistas = { landing: $('#viewLanding'), quiz: $('#viewQuiz'), result: $('#viewResult') };

  function mostrarVista(nombre) {
    Object.values(vistas).forEach((v) => v.classList.remove('view--active'));
    vistas[nombre].classList.add('view--active');
    // Al salir del resultado se limpia siempre. Al entrar, la clase la pone
    // `prepararTarjeta()` en cuanto la medalla existe de verdad: así, en
    // móvil, la cabecera no desaparece antes de que haya un logo que la
    // reemplace (si el canvas falla, `caerAlAnillo()` la deja puesta).
    if (nombre !== 'result') document.body.classList.remove('vista-resultado');
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  /* ============================================================
     2 · MOTOR
     ============================================================ */

  /** Traduce los índices elegidos a los datos crudos de cada opción. */
  function leerRespuestas() {
    const r = {};
    PREGUNTAS.forEach((p, i) => {
      r[p.id] = p.opciones ? p.opciones[respuestas[i]] : respuestas[i];
    });
    return r;
  }

  /** Conversión de audiencia: cuánto factura el negocio para el tamaño de su comunidad. */
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
    const total = Object.keys(PESOS).reduce((acc, k) => acc + variables[k] * PESOS[k], 0);
    return { total: Math.round(total), variables };
  }

  /**
   * ENRUTADO CONDICIONAL (Manual Maestro, sección VI).
   *
   * Se evalúa por bloques de facturación y, dentro de cada bloque, en el
   * MISMO ORDEN que el manual: la primera regla que encaja gana.
   *
   * Regla dura: la facturación determina la madurez del sistema. A quien
   * factura más de 50.000 € nunca se le diagnostica falta de validación, ventas
   * esporádicas ni falta de audiencia; su restricción siempre está en
   * Fulfillment, Operaciones o Finanzas.
   *
   * `exacto` distingue las combinaciones que el manual define de forma
   * literal de las que caen al caso por defecto del bloque.
   */
  function resolverCaso(r) {
    const tier = r.facturacion.tier;
    const modelo = r.modelo.modelo;
    const ritmo = r.ritmo.ritmo;
    const area = r.limitacion.area;
    const audienciaAlta = r.audiencia.audiencia === 'alta';
    const audienciaMenor5k = r.audiencia.menor5k === true;

    /* ===== BLOQUE 1 · más de 50.000 € ===== */
    if (tier === 4) {
      // Venta de tiempo (agencia o uno a uno) → techo operativo.
      if (modelo === 'agencia' || modelo === 'uno-a-uno') return { clave: '1.1', exacto: true };
      // Apalancado + dolor de entrega → fulfillment y oferta cebolla.
      if ((modelo === 'highticket' || modelo === 'hibrido') && area === 'operacion') return { clave: '1.2', exacto: true };
      // Low ticket, e-commerce, o caja inestable → finanzas y margen.
      // El e-commerce vive del margen sobre el costo de tráfico, no de una
      // oferta cebolla, así que su caso por defecto en este bloque es 1.3.
      if (modelo === 'lowticket' || modelo === 'ecommerce' || ritmo === 'inestable') return { clave: '1.3', exacto: true };
      // Resto del bloque: modelo apalancado sin dolor de entrega.
      return { clave: '1.2', exacto: false };
    }

    /* ===== BLOQUE 2 · 15.000 € – 40.000 € ===== */
    if (tier === 3) {
      if (area === 'ventas' || ritmo === 'caos' || ritmo === 'inestable') return { clave: '2.1', exacto: true };
      if (audienciaAlta && area === 'marketing') return { clave: '2.2', exacto: true };
      if (modelo === 'uno-a-uno' && area === 'operacion') return { clave: '2.3', exacto: true };
      return { clave: '2.1', exacto: false };
    }

    /* ===== BLOQUE 3 · 5.000 € – 15.000 € ===== */
    if (tier === 2) {
      if (area === 'branding' || audienciaMenor5k) return { clave: '3.1', exacto: true };
      if (area === 'marketing' || area === 'ventas') return { clave: '3.2', exacto: true };
      return { clave: '3.2', exacto: false };
    }

    /* ===== BLOQUE 4 · menos de 5.000 € ===== */
    if (area === 'mindset' || ritmo === 'caos') return { clave: '4.1', exacto: true };
    return { clave: '4.2', exacto: true };
  }

  function evaluar() {
    const r = leerRespuestas();
    const { total, variables } = calcularPuntaje(r);
    const { clave, exacto } = resolverCaso(r);
    // El modelo de negocio puede quedar fuera del perfil de Classroom Platinum
    // (hoy, e-commerce de producto físico). Puntúa y se diagnostica igual, pero
    // no se le ofrece aplicar, facture lo que facture.
    const noAplica = r.modelo.noAplica === true;
    const califica = !noAplica
      && r.facturacion.desde >= FACTURACION_MINIMA_PARA_CALIFICAR
      && r.audiencia.desde >= COMUNIDAD_MINIMA_PARA_CALIFICAR;
    return { respuestas: r, email: r.email || '', puntaje: total, variables, caso: CASOS[clave], claveCaso: clave, exacto, califica, noAplica };
  }

  /* ============================================================
     3 · FORMULARIO
     ============================================================ */
  const qTitle = $('#qTitle'), qHelp = $('#qHelp'), qOptions = $('#qOptions');
  const qCounter = $('#qCounter'), qPct = $('#qPct'), qBar = $('#qBar');
  const btnNext = $('#btnNext'), btnBack = $('#btnBack');

  function pintarPregunta() {
    const p = PREGUNTAS[paso];
    qTitle.textContent = p.titulo;
    qHelp.textContent = p.ayuda;
    qCounter.textContent = `Pregunta ${paso + 1} de ${PREGUNTAS.length}`;

    const pct = Math.round((paso / PREGUNTAS.length) * 100);
    qPct.textContent = `${pct} %`;
    qBar.style.width = `${pct}%`;

    qOptions.innerHTML = '';

    if (p.tipo === 'email') {
      qOptions.removeAttribute('role');
      const campo = document.createElement('input');
      campo.type = 'email';
      campo.className = 'campo';
      campo.placeholder = p.placeholder || '';
      campo.autocomplete = 'email';
      campo.inputMode = 'email';
      campo.setAttribute('aria-label', p.titulo);
      campo.value = typeof respuestas[paso] === 'string' ? respuestas[paso] : '';
      campo.addEventListener('input', () => {
        const v = campo.value.trim();
        respuestas[paso] = v;
        btnNext.disabled = !EMAIL_VALIDO.test(v);
      });
      qOptions.appendChild(campo);
      // El foco automático solo en escritorio: en móvil abriría el teclado de
      // golpe y taparía la pregunta.
      if (window.matchMedia('(min-width: 861px)').matches) setTimeout(() => campo.focus(), 60);
    } else {
      qOptions.setAttribute('role', 'radiogroup');
      p.opciones.forEach((op, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option';
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', String(respuestas[paso] === i));
        btn.innerHTML = `<span class="option__dot"><i></i></span><span class="option__label"></span>`;
        btn.querySelector('.option__label').textContent = op.label;
        btn.addEventListener('click', () => elegir(i));
        qOptions.appendChild(btn);
      });
    }

    // Las preguntas de opción avanzan solas al elegir, así que no llevan botón
    // de continuar. El paso del correo sí lo necesita: no hay nada que pulsar.
    avanzando = false;
    btnNext.hidden = p.tipo !== 'email';
    btnNext.disabled = p.tipo === 'email'
      ? !EMAIL_VALIDO.test(String(respuestas[paso] || '').trim())
      : true;
    btnNext.textContent = 'Envíame mi puntuación';
    btnBack.textContent = paso === 0 ? 'Volver al inicio' : 'Atrás';
  }

  /** Elegir una opción ya es responder: se marca y se pasa a la siguiente.
      La pausa corta deja ver la marca antes de cambiar de pregunta. */
  function elegir(i) {
    if (avanzando) return;              // doble clic: la primera pulsación manda
    avanzando = true;
    respuestas[paso] = i;
    [...qOptions.children].forEach((el, idx) => el.setAttribute('aria-checked', String(idx === i)));
    const espera = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180;
    setTimeout(avanzar, espera);
  }

  function avanzar() {
    if (paso < PREGUNTAS.length - 1) { paso += 1; pintarPregunta(); }
    else { mostrarVista('result'); pintarResultado(evaluar()); }
  }

  $('#qForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (btnNext.disabled || btnNext.hidden) return;
    avanzar();
  });

  btnBack.addEventListener('click', () => {
    if (paso === 0) { mostrarVista('landing'); return; }
    paso -= 1;
    pintarPregunta();
  });

  // El lockup vuelve a la portada dentro de la misma página. Antes era un
  // enlace a './', que fuera de la raíz del dominio daba un 404.
  $('#btnMarca').addEventListener('click', () => {
    paso = 0;
    mostrarVista('landing');
  });

  $('#btnStart').addEventListener('click', () => {
    paso = 0;
    respuestas.fill(null);
    pintarPregunta();
    mostrarVista('quiz');
  });

  /* ============================================================
     4 · RESULTADO
     ============================================================ */
  const CIRC = 2 * Math.PI * 96; // r=96 en el SVG

  function pintarResultado(res) {
    const { puntaje, variables, caso, califica, noAplica } = res;
    registrarDesenlace(res);
    prepararTarjeta(res);
    // Con la pestaña en segundo plano el navegador congela las transiciones en
    // su valor inicial. En ese caso se salta la animación y se pinta directo,
    // para que nadie vea nunca un anillo vacío ni barras a cero.
    const animar = document.visibilityState === 'visible';

    // Anillo + contador.
    // El valor final se escribe de forma síncrona (con un reflow forzado entre
    // medias): así la transición CSS anima igual, pero si la pestaña está en
    // segundo plano —donde requestAnimationFrame no corre— el resultado ya
    // queda pintado correcto en lugar de congelarse en cero.
    const ring = $('#ringValue');
    ring.style.transition = animar ? '' : 'none';
    ring.style.strokeDasharray = CIRC.toFixed(1);
    if (animar) {
      ring.style.strokeDashoffset = CIRC.toFixed(1);
      void ring.getBoundingClientRect();
    }
    ring.style.strokeDashoffset = (CIRC * (1 - puntaje / 100)).toFixed(1);
    animarNumero($('#scoreNum'), puntaje);

    // Chip + fase
    const chip = $('#resChip');
    chip.className = 'chip ' + (noAplica ? 'chip--neutral' : califica ? 'chip--success' : 'chip--danger');
    chip.textContent = noAplica ? FUERA_DE_PERFIL.chip : califica ? 'Calificas para aplicar' : 'Fase de ordenar';
    const fase = $('#resPhase');
    fase.textContent = '';
    if (noAplica) {
      fase.textContent = FUERA_DE_PERFIL.fase;
    } else if (califica) {
      const destacado = document.createElement('strong');
      destacado.className = 'destacado';
      destacado.textContent = 'programa de escalado de Classroom Kunfupay';
      fase.append('Tu negocio ya funciona como empresa, así que puedes aplicar al ', destacado, '.');
    } else {
      fase.textContent = 'Tu negocio genera ingresos, pero todavía no opera como empresa. Primero se ordena, después se escala.';
    }

    // Barras
    const filas = [
      ['Ritmo del negocio', variables.ritmo],
      ['Escalabilidad del modelo', variables.modelo],
      ['Conversión de audiencia', variables.conversion],
      ['Tamaño de comunidad', variables.comunidad]
    ];
    const bars = $('#resBars');
    bars.innerHTML = '';
    filas.forEach(([nombre, valor], i) => {
      const row = document.createElement('div');
      row.className = 'bar' + (valor < 60 ? ' bar--weak' : '');
      row.innerHTML = `<span class="bar__name"></span><span class="bar__track"><span class="bar__fill"></span></span><span class="bar__val"></span>`;
      row.querySelector('.bar__name').textContent = nombre;
      row.querySelector('.bar__val').textContent = valor;
      bars.appendChild(row);
      const fill = row.querySelector('.bar__fill');
      if (animar) {
        fill.style.width = '0%';
        fill.style.transitionDelay = `${180 + i * 140}ms`;
        void fill.getBoundingClientRect();
      } else {
        fill.style.transition = 'none';
      }
      fill.style.width = `${valor}%`;
    });

    // Diagnóstico
    $('#resTitle').textContent = caso.titular;
    $('#resDiag').textContent = caso.diagnostico;
    $('#resInsight').textContent = caso.x;

    // Pasos
    const steps = $('#resSteps');
    steps.innerHTML = '';
    caso.pasos.forEach((p, i) => steps.appendChild(crearPaso(String(i + 1).padStart(2, '0'), p.titulo, p.desc)));

    $('#resStepsTitle').textContent = califica || noAplica
      ? '3 pasos de acción inmediatos'
      : '3 pasos de acción inmediatos, y cómo te ayudamos';

    // Paso 04 · Kunfupay solo para quien todavía no califica. Quien está fuera
    // de perfil no recibe oferta: se queda con su diagnóstico y nada más.
    if (!califica && !noAplica) {
      const k = crearPaso('04', PASO_KUNFUPAY.titulo, PASO_KUNFUPAY.desc);
      k.classList.add('step--kunfupay');
      steps.appendChild(k);
    }

    // CTA
    const cta = $('#resCta');
    cta.innerHTML = '';

    // Fuera de perfil: cierre sin botón. No se le empuja a aplicar a un
    // programa que no es para su negocio, ni se le redirige a otra oferta.
    if (noAplica) {
      const nota = document.createElement('span');
      nota.className = 'note';
      nota.textContent = FUERA_DE_PERFIL.nota;
      cta.appendChild(nota);
      return;
    }

    const destino = califica ? URL_CLASSROOM : URL_KUNFUPAY;
    // Con URL sale como enlace real (clic derecho, abrir en pestaña nueva,
    // medición); sin URL queda como botón a la espera de destino.
    const btn = document.createElement(destino ? 'a' : 'button');
    if (destino) {
      btn.href = urlConResultado(destino, califica, puntaje, noAplica);
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
    } else {
      btn.type = 'button';
    }
    btn.className = 'btn ' + (califica ? 'btn--primary' : 'btn--super');
    btn.textContent = califica ? 'Aplicar a Classroom Platinum' : 'Empezar con Kunfupay';
    // La nota bajo el botón es el único texto de cierre: antes había además un
    // párrafo suelto al pie del resultado, que se eliminó.
    const note = document.createElement('span');
    note.className = 'note';
    note.textContent = califica
      ? 'Si tu resultado es positivo, puedes aplicar a nuestro plan de inversión para potenciar tu negocio digital.'
      : 'Tu puntaje no queda registrado. Empieza a cobrar con Kunfupay, pon en marcha los pasos 1 y 2 y vuelve a medir: la puerta a Classroom Platinum sigue abierta.';
    cta.append(btn, note);

  }

  /* ============================================================
     4b · TARJETA COMPARTIBLE
     ============================================================ */
  const medalla = $('#medalla'), medallaAcciones = $('#medallaAcciones');
  const sharePreview = $('#sharePreview'), ringFallback = $('#ringFallback');
  const btnShare = $('#btnShare'), btnDownload = $('#btnDownload'), shareNote = $('#shareNote');
  /* JPEG, no PNG: la tarjeta es un degradado a pantalla completa y en PNG
     pesaba 2,2 MB. En JPEG de calidad alta baja a la décima parte, y las
     redes lo recomprimen igual al subirlo. */
  const NOMBRE_ARCHIVO = 'creator-business-score.jpg';
  const TIPO_ARCHIVO = 'image/jpeg';
  const CALIDAD = 0.92;

  /* El blob se prepara en cuanto se pinta el resultado, no al pulsar.
     Safari exige que navigator.share() salga del gesto del usuario, y
     generar el PNG en medio rompe esa cadena. */
  let tarjetaBlob = null;
  let tarjetaUrl = null;
  let tarjetaPuntaje = null;

  function puedeCompartirArchivos(blob) {
    if (!navigator.canShare || !navigator.share || !window.File) return false;
    try {
      return navigator.canShare({ files: [new File([blob], NOMBRE_ARCHIVO, { type: TIPO_ARCHIVO })] });
    } catch (err) { return false; }
  }

  /** Si la medalla no se puede generar, el anillo ocupa su sitio. El puntaje
      nunca puede depender de que el canvas funcione. */
  function caerAlAnillo() {
    medalla.hidden = true;
    medallaAcciones.hidden = true;
    ringFallback.hidden = false;
    // Sin medalla, la cabecera vuelve: es la única marca que queda en
    // pantalla. Si se ocultara igual, el resultado se quedaría sin logo.
    document.body.classList.remove('vista-resultado');
  }

  async function prepararTarjeta(res) {
    medalla.hidden = false;
    medalla.classList.remove('medalla--lista');
    medallaAcciones.hidden = true;
    ringFallback.hidden = true;
    btnShare.hidden = true;
    sharePreview.removeAttribute('src');
    if (tarjetaUrl) { URL.revokeObjectURL(tarjetaUrl); tarjetaUrl = null; }
    tarjetaBlob = null;

    if (typeof window.CBSTarjeta === 'undefined' || !window.HTMLCanvasElement) { caerAlAnillo(); return; }

    try {
      const canvas = await window.CBSTarjeta.dibujar(res);
      tarjetaBlob = await new Promise((ok) => canvas.toBlob(ok, TIPO_ARCHIVO, CALIDAD));
      if (!tarjetaBlob) { caerAlAnillo(); return; }

      tarjetaPuntaje = res.puntaje;
      tarjetaUrl = URL.createObjectURL(tarjetaBlob);
      // La medalla ya se genera: ahora sí toca ocultar la cabecera en móvil.
      document.body.classList.add('vista-resultado');
      sharePreview.src = tarjetaUrl;
      // La imagen lleva texto, así que el alt tiene que decir lo mismo que ella.
      sharePreview.alt = `Tu medalla: ${res.puntaje} sobre 100, ${window.CBSTarjeta.franjaDe(res.puntaje).medalla}.`;
      medalla.classList.add('medalla--lista');
      medallaAcciones.hidden = false;
      btnShare.hidden = !puedeCompartirArchivos(tarjetaBlob);
      // Donde no hay menú nativo, descargar deja de ser la opción secundaria.
      btnDownload.className = 'btn ' + (btnShare.hidden ? 'btn--primary' : 'btn--ghost');
    } catch (err) {
      caerAlAnillo();
    }
  }

  function descargarTarjeta() {
    if (!tarjetaUrl) return;
    const a = document.createElement('a');
    a.href = tarjetaUrl;
    a.download = NOMBRE_ARCHIVO;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  btnDownload.addEventListener('click', descargarTarjeta);

  btnShare.addEventListener('click', async () => {
    if (!tarjetaBlob) return;
    const archivo = new File([tarjetaBlob], NOMBRE_ARCHIVO, { type: TIPO_ARCHIVO });
    try {
      await navigator.share({
        files: [archivo],
        title: 'Mi Creator Business Score',
        text: window.CBSTarjeta.textoParaCompartir(tarjetaPuntaje)
      });
    } catch (err) {
      // El usuario canceló el menú, o el navegador lo rechazó: en el segundo
      // caso al menos se queda con la imagen.
      if (err && err.name === 'AbortError') return;
      shareNote.textContent = 'No se pudo abrir el menú de compartir. Descarga la imagen y súbela a mano.';
      descargarTarjeta();
    }
  });

  /**
   * Deja el desenlace registrado en tres sitios, para que se pueda medir
   * aunque el botón final no tenga destino todavía:
   *
   *   1 · La URL de la propia página, con `utm_content` y `utm_term`. NO se
   *       tocan `utm_source`, `utm_medium` ni `utm_campaign`: los trae la
   *       campaña que trajo a la visita y deben sobrevivir intactos.
   *   2 · Atributos `data-` en la vista de resultado, que cualquier
   *       herramienta puede leer del DOM.
   *   3 · Un evento `cbs:resultado` en `document`, para engancharle GTM, el
   *       píxel de Meta o lo que haga falta sin tocar este archivo.
   */
  function registrarDesenlace(res) {
    const valor = desenlace(res.califica, res.noAplica);

    try {
      const u = new URL(window.location.href);
      u.searchParams.set('utm_content', valor);
      u.searchParams.set('utm_term', 'score_' + res.puntaje);
      window.history.replaceState(null, '', u.toString());
    } catch (err) { /* sin History API, seguimos: es solo medición */ }

    const vista = vistas.result;
    vista.dataset.desenlace = valor;
    vista.dataset.score = res.puntaje;
    vista.dataset.caso = res.claveCaso;

    document.dispatchEvent(new CustomEvent('cbs:resultado', {
      detail: {
        desenlace: valor, puntaje: res.puntaje, caso: res.claveCaso,
        limitacion: res.caso.limitacion, califica: res.califica,
        noAplica: res.noAplica, email: res.email
      }
    }));
  }

  /**
   * Añade el resultado de la auditoría a la URL de destino, respetando la
   * taxonomía UTM de Kunfupay (minúsculas y guion bajo):
   *   utm_content = calificado | descalificado | no_aplica
   *   utm_term    = score_<puntaje>
   * Si el destino ya trae esos parámetros, se sobrescriben.
   */
  function desenlace(califica, noAplica) {
    if (noAplica) return 'no_aplica';
    return califica ? 'calificado' : 'descalificado';
  }

  function urlConResultado(base, califica, puntaje, noAplica) {
    try {
      const u = new URL(base, window.location.href);
      u.searchParams.set('utm_content', desenlace(califica, noAplica));
      u.searchParams.set('utm_term', 'score_' + puntaje);
      return u.toString();
    } catch (err) {
      return base;
    }
  }

  function crearPaso(n, titulo, desc) {
    const el = document.createElement('div');
    el.className = 'step';
    el.innerHTML = `<span class="step__n"></span><div><h4></h4><p></p></div>`;
    el.querySelector('.step__n').textContent = n;
    el.querySelector('h4').textContent = titulo;
    el.querySelector('p').textContent = desc;
    return el;
  }

  function animarNumero(el, destino) {
    // Se escribe el valor final primero: la cuenta atrás es un adorno y nunca
    // debe ser la única vía por la que el usuario ve su puntaje.
    el.textContent = destino;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || document.visibilityState !== 'visible') return;
    const inicio = performance.now(), dur = 900;
    function tick(t) {
      const p = Math.min(1, (t - inicio) / dur);
      el.textContent = Math.round(destino * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Arranque ---------- */
  pintarPregunta();

  /* ---------- API de pruebas (consola) ----------
     CBS.simular([0,0,0,0,0]) → devuelve el resultado sin tocar la interfaz.
     Índices en el orden de PREGUNTAS: comunidad, situación, modelo,
     facturación y dolor. El paso del correo se rellena solo.                 */
  window.CBS = {
    simular(indices) {
      const previo = respuestas.slice();
      indices.forEach((v, i) => { respuestas[i] = v; });
      if (typeof respuestas[PREGUNTAS.length - 1] !== 'string') respuestas[PREGUNTAS.length - 1] = 'test@kunfupay.com';
      const out = evaluar();
      previo.forEach((v, i) => { respuestas[i] = v; });
      return {
        puntaje: out.puntaje, caso: out.claveCaso, exacto: out.exacto,
        califica: out.califica, noAplica: out.noAplica, escalon: out.caso.escalon,
        limitacion: out.caso.limitacion, variables: out.variables
      };
    }
  };
})();
