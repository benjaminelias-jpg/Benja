// ── CONFIG DE ESTA LANDING (vendedores/v1) ─────────────────────────────
// Número de WhatsApp de ventas, en formato internacional SIN «+» ni espacios
// (p. ej. '34600111222'). Vacío = el botón de WhatsApp baja al calendario.
window.KF_WHATSAPP = '';
// URL del calendario para agendar la llamada (Calendly, Google Calendar
// «programación de citas», Cal.com…). Se carga en un <iframe> en #agenda.
// Con Calendly, la reserva dispara `Schedule` en el píxel (ver el script).
window.KF_CALENDAR_URL = '';
// Vendedor de esta landing. Vacío = landing principal (todo el equipo).
// En las landings por vendedor (vendedor-<nombre>/v1) va su id y su nombre:
// viaja como parámetro `vendedor` en Contact/Schedule y saluda en WhatsApp.
window.KF_VENDEDOR = '';
window.KF_VENDEDOR_NOMBRE = '';
