// ── CONFIG DE ESTA LANDING (vendedores/v2) ─────────────────────────────
// UNA sola landing para todo el equipo. El anuncio de cada vendedor lleva
// su id en la URL y la página enseña SOLO a esa persona: su foto, su
// nombre, su WhatsApp y su calendario. Sin id (o con uno que no existe),
// sale la versión de equipo con las cuatro caras.
//
//   ?vendedor=jorge                      ← la forma recomendada
//   ?utm_content=jorge  (o utm_term / utm_campaign con «jorge» como palabra)
//
// El vendedor se recuerda en la sesión: si recarga sin parámetros, sigue
// viendo al mismo.
//
// WhatsApp: formato internacional SIN «+» ni espacios (p. ej. '34600111222').
// Calendario: URL de Calendly, Google Calendar «programación de citas»,
// Cal.com…; se carga en un <iframe> en #agenda. Con Calendly, la reserva
// dispara `Schedule` en el píxel. Un campo vacío usa el del equipo.
window.KF_EQUIPO = { whatsapp: '', calendario: '' };
window.KF_VENDEDORES = {
  taiab: { nombre: 'Taiab', ig: 'taiab.kunfupay', whatsapp: '', calendario: '' },
  rafa:  { nombre: 'Rafa',  ig: 'rafa.kunfupay',  whatsapp: '', calendario: '' },
  juan:  { nombre: 'Juan',  ig: 'juan.kunfupay',  whatsapp: '', calendario: '' },
  jorge: { nombre: 'Jorge', ig: 'jorge.kunfupay', whatsapp: '', calendario: '' }
};

// Se decide AQUÍ, en el <head>, antes de pintar: el atributo data-vendedor
// del <html> esconde la versión de equipo por CSS y no hay parpadeo de caras.
// El id solo ELIGE una entrada de KF_VENDEDORES; nada de la URL se pinta.
(function () {
  var V = window.KF_VENDEDORES, id = '';
  var q = new URLSearchParams(location.search);
  var directo = (q.get('vendedor') || '').toLowerCase().trim();
  if (V[directo]) id = directo;
  if (!id) {
    ['utm_content', 'utm_term', 'utm_campaign'].some(function (k) {
      var v = (q.get(k) || '').toLowerCase();
      return Object.keys(V).some(function (x) {
        if (new RegExp('(^|[^a-z])' + x + '([^a-z]|$)').test(v)) { id = x; return true; }
        return false;
      });
    });
  }
  try {
    if (id) sessionStorage.setItem('kf_vendedor', id);
    else if (V[sessionStorage.getItem('kf_vendedor')]) id = sessionStorage.getItem('kf_vendedor');
  } catch (e) {}
  window.KF_VENDEDOR = id;
  if (id) document.documentElement.setAttribute('data-vendedor', id);
})();
