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
function kfVend() { return { vendedor: KF_VEND || 'equipo' }; }
function kfRellena(t) {
  return t.replace(/\{id\}/g, KF_VEND).replace(/\{nombre\}/g, KF_V.nombre).replace(/\{ig\}/g, KF_V.ig);
}
(function () {
  if (!KF_V) return;
  document.querySelectorAll('[data-v]').forEach(function (el) { el.innerHTML = kfRellena(el.getAttribute('data-v')); });
  document.querySelectorAll('[data-v-src]').forEach(function (el) {
    el.src = kfRellena(el.getAttribute('data-v-src'));
    el.alt = KF_V.nombre;
  });
})();
var KF_WHATSAPP_FINAL = String((KF_V && KF_V.whatsapp) || KF_E.whatsapp || '').replace(/\D/g, '');
var KF_CALENDARIO_FINAL = (KF_V && KF_V.calendario) || KF_E.calendario || '';

// ── CTA PRINCIPAL: WhatsApp ────────────────────────────────────────────
// El enlace se escribe en el href (no con window.open): el navegador de
// Instagram bloquea muchas ventanas abiertas por script. `Contact` es el
// evento al que optimiza el conjunto del anuncio; lleva `vendedor`.
(function () {
  var waBtn = document.getElementById('kf-wa-btn');
  if (!waBtn) return;
  if (KF_WHATSAPP_FINAL) {
    var texto = (KF_V ? 'Hola ' + KF_V.nombre + ', vengo de tu web de Kunfupay.' : 'Hola, vengo de la web de Kunfupay.') +
      ' Vendo online a clientes de varios países y quiero ver cómo cobrarles a todos.';
    waBtn.href = 'https://wa.me/' + KF_WHATSAPP_FINAL + '?text=' + encodeURIComponent(texto);
    waBtn.target = '_blank';
  } else {
    // Sin número configurado: se queda en el ancla #agenda (baja al calendario).
    console.warn('[Kunfupay] WhatsApp sin configurar para ' + (KF_VEND || 'el equipo') + ': el botón baja al calendario.');
  }
  waBtn.addEventListener('click', function () {
    fbq('track', 'Contact', kfVend());
    gtag('event', 'contact_whatsapp', kfVend());
  });
})();

// ── CTA SECUNDARIO: agendar (baja a #agenda) ───────────────────────────
(function () {
  var btn = document.getElementById('kf-agendar-btn');
  if (!btn) return;
  btn.addEventListener('click', function () {
    fbq('trackCustom', 'cta_agendar', kfVend());
    gtag('event', 'cta_agendar', kfVend());
  });
})();

// Calendario: el del vendedor (o el del equipo) en #kf-cal. Con Calendly, la
// reserva confirmada llega por postMessage y se mide como `Schedule`
// (evento estándar de Meta) + `agenda_reservada` en GA4, con `vendedor`.
(function () {
  var caja = document.getElementById('kf-cal');
  if (!caja) return;
  if (!KF_CALENDARIO_FINAL) {
    console.warn('[Kunfupay] Calendario sin configurar para ' + (KF_VEND || 'el equipo') + '.');
    return;
  }
  var iframe = document.createElement('iframe');
  iframe.src = KF_CALENDARIO_FINAL;
  iframe.title = KF_V ? 'Agenda una llamada con ' + KF_V.nombre + ', de Kunfupay' : 'Agenda una llamada con el equipo de Kunfupay';
  iframe.loading = 'lazy';
  caja.innerHTML = '';
  caja.appendChild(iframe);

  window.addEventListener('message', function (e) {
    var d = e.data;
    if (d && typeof d === 'object' && d.event === 'calendly.event_scheduled') {
      fbq('track', 'Schedule', kfVend());
      gtag('event', 'agenda_reservada', kfVend());
    }
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
