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

// ── CTA PRINCIPAL: WhatsApp ────────────────────────────────────────────
// El enlace se escribe en el href (no con window.open): el navegador de
// Instagram bloquea muchas ventanas abiertas por script. `Contact` es el
// evento al que optimiza el conjunto del anuncio.
var KF_VEND = window.KF_VENDEDOR || '';
var KF_VEND_NOMBRE = window.KF_VENDEDOR_NOMBRE || '';
// Parámetro `vendedor` en los eventos: separa en Meta y GA4 qué landing (y
// qué audiencia) trae cada contacto. En la principal va 'equipo'.
function kfVend() { return { vendedor: KF_VEND || 'equipo' }; }

(function () {
  var waBtn = document.getElementById('kf-wa-btn');
  if (!waBtn) return;
  var numero = String(window.KF_WHATSAPP || '').replace(/\D/g, '');
  if (numero) {
    var texto = (KF_VEND_NOMBRE ? 'Hola ' + KF_VEND_NOMBRE + ', vengo de tu web de Kunfupay.' : 'Hola, vengo de la web de Kunfupay.') +
      ' Vendo online a clientes de varios países y quiero ver cómo cobrarles a todos.';
    waBtn.href = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(texto);
    waBtn.target = '_blank';
  } else {
    // Sin número configurado: se queda en el ancla #agenda (baja al calendario).
    console.warn('[Kunfupay] KF_WHATSAPP sin configurar: el botón baja al calendario.');
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

// Calendario: se carga en #kf-cal desde KF_CALENDAR_URL (config del <head>).
// Con Calendly, la reserva confirmada llega por postMessage y se mide como
// `Schedule` (evento estándar de Meta) + `agenda_reservada` en GA4.
(function () {
  var caja = document.getElementById('kf-cal');
  var url = window.KF_CALENDAR_URL;
  if (!caja) return;
  if (!url) {
    console.warn('[Kunfupay] KF_CALENDAR_URL sin configurar: el calendario no se muestra.');
    return;
  }
  var iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.title = 'Agenda una llamada con el equipo de Kunfupay';
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
