// Mide la topbar de campaña y publica su alto en --kf-topbar-h (igual que el
// patrón): el hero ocupa la pantalla MENOS la topbar en móvil.
(function () {
  var tb = document.querySelector('.topbar');
  function medir() {
    var h = (tb && tb.offsetParent !== null) ? tb.getBoundingClientRect().height : 0;
    document.documentElement.style.setProperty('--kf-topbar-h', h + 'px');
  }
  medir();
  window.addEventListener('resize', medir);
  window.addEventListener('orientationchange', medir);
  if (tb && window.ResizeObserver) new ResizeObserver(medir).observe(tb);
})();

// ── VENDEDOR DE LA URL ─────────────────────────────────────────────────
// KF_VENDEDOR lo decide el <head> (ver la config). Aquí se rellenan los
// textos `data-v` y las fotos `data-v-src` con SUS datos de KF_VENDEDORES.
// Las plantillas las escribimos nosotros en el HTML y los valores salen de
// la config: de la URL solo se usa el id para elegir la entrada.
var KF_VEND = window.KF_VENDEDOR || '';
var KF_V = KF_VEND ? window.KF_VENDEDORES[KF_VEND] : null;
var KF_E = window.KF_EQUIPO || {};
// Versión de equipo sin WhatsApp ni calendario de equipo: la visita se
// reparte a un vendedor al azar (se recuerda en la sesión) para que los
// botones lleven a alguien. La página sigue enseñando las cuatro caras.
var KF_TURNO = '';
(function () {
  if (KF_V || KF_E.whatsapp || KF_E.calendario) return;
  var V = window.KF_VENDEDORES || {}, ids = Object.keys(V), id = '';
  if (!ids.length) return;
  try { id = sessionStorage.getItem('kf_turno') || ''; } catch (e) {}
  if (!V[id]) id = ids[Math.floor(Math.random() * ids.length)];
  try { sessionStorage.setItem('kf_turno', id); } catch (e) {}
  KF_TURNO = id;
})();
var KF_T = KF_TURNO ? window.KF_VENDEDORES[KF_TURNO] : null;
function kfVend() {
  var d = { vendedor: KF_VEND || 'equipo' };
  if (KF_TURNO) d.turno = KF_TURNO;
  return d;
}
function kfRellena(t) {
  return t.replace(/\{id\}/g, KF_VEND).replace(/\{nombre\}/g, KF_V.nombre).replace(/\{ig\}/g, KF_V.ig);
}
(function () {
  if (!KF_V) return;
  document.querySelectorAll('[data-v]').forEach(function (el) { el.innerHTML = kfRellena(el.getAttribute('data-v')); });
  document.querySelectorAll('[data-v-src]').forEach(function (el) {
    el.src = kfRellena(el.getAttribute('data-v-src'));
    if (el.hasAttribute('data-v-alt')) el.alt = KF_V.nombre;
  });
})();
var KF_WHATSAPP_FINAL = String((KF_V && KF_V.whatsapp) || KF_E.whatsapp || (KF_T && KF_T.whatsapp) || '').replace(/\D/g, '');
var KF_CALENDARIO_FINAL = (KF_V && KF_V.calendario) || KF_E.calendario || (KF_T && KF_T.calendario) || '';

// ── CTA PRINCIPAL: WhatsApp ────────────────────────────────────────────
// El enlace se escribe en el href (no con window.open): el navegador de
// Instagram bloquea muchas ventanas abiertas por script. `Contact` es el
// evento al que optimiza el conjunto del anuncio; lleva `vendedor`.
(function () {
  var waBtn = document.getElementById('kf-wa-btn');
  if (!waBtn) return;
  if (!KF_WHATSAPP_FINAL && KF_CALENDARIO_FINAL) {
    // Sin WhatsApp pero con calendario: el botón principal pasa a ser el de
    // agendar (texto y enlace) y el secundario del hero se esconde para no
    // repetir el mismo botón dos veces.
    waBtn.href = KF_CALENDARIO_FINAL;
    waBtn.target = '_blank';
    waBtn.textContent = KF_V ? 'Agenda una llamada con ' + KF_V.nombre : 'Agenda una llamada';
    var sec = document.getElementById('kf-agendar-btn');
    if (sec) sec.classList.add('kf-oculto');
  }
  if (KF_WHATSAPP_FINAL) {
    var texto = (KF_V ? 'Hola ' + KF_V.nombre + ', vengo de tu web de Kunfupay.' : 'Hola, vengo de la web de Kunfupay.') +
      ' Vendo online a clientes de varios países y quiero ver cómo cobrarles a todos.';
    waBtn.href = 'https://wa.me/' + KF_WHATSAPP_FINAL + '?text=' + encodeURIComponent(texto);
    waBtn.target = '_blank';
  } else {
    // Sin número configurado: se queda en el ancla #agenda (baja al calendario).
    console.warn('[Kunfupay] WhatsApp sin configurar para ' + (KF_VEND || 'el equipo') + '.');
  }
  waBtn.addEventListener('click', function () {
    var canal = KF_WHATSAPP_FINAL ? 'whatsapp' : 'calendario';
    fbq('track', 'Contact', Object.assign(kfVend(), { canal: canal }));
    gtag('event', 'contact_' + canal, kfVend());
  });
})();

// ── AGENDAR: el botón secundario del hero y el de abajo ────────────────
// Abren la página de reservas del vendedor (no se incrusta). Cuentan como
// `Contact` con canal 'calendario', igual que WhatsApp: los dos son el
// contacto que buscamos y el conjunto optimiza a Contact. Sin calendario,
// los botones y la sección de abajo se esconden.
(function () {
  var btns = document.querySelectorAll('.kf-agendar');
  if (!KF_CALENDARIO_FINAL) {
    btns.forEach(function (b) { b.style.display = 'none'; });
    var sec = document.getElementById('agenda');
    if (sec) sec.style.display = 'none';
    console.warn('[Kunfupay] Calendario sin configurar para ' + (KF_VEND || 'el equipo') + '.');
    return;
  }
  btns.forEach(function (b) {
    b.href = KF_CALENDARIO_FINAL;
    b.target = '_blank';
    b.rel = 'noopener';
    b.addEventListener('click', function () {
      fbq('track', 'Contact', Object.assign(kfVend(), { canal: 'calendario' }));
      fbq('trackCustom', 'cta_agendar', kfVend());
      gtag('event', 'cta_agendar', kfVend());
    });
  });
})();

// Reveal al hacer scroll (igual que el patrón).
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var HERO_HIGHLIGHT_DONE_MS = 1700;
  var loadedAt = performance.now();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var target = entry.target;
      io.unobserve(target);
      var wait = HERO_HIGHLIGHT_DONE_MS - (performance.now() - loadedAt);
      if (wait > 0) {
        setTimeout(function () { target.classList.add('is-visible'); }, wait);
      } else {
        target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(function (el) { io.observe(el); });
})();
