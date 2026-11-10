const $ = (s) => document.getElementById(s);
const send = (a) => window.toma.controlAction(a);

$('stop').addEventListener('click', () => send('stop'));
$('pause').addEventListener('click', () => send('pause'));
$('restart').addEventListener('click', () => send('restart'));
$('cancel').addEventListener('click', () => {
  if (confirm('¿Descartar esta grabación?')) send('cancel');
});

function fmt(s) {
  s = Math.max(0, Math.floor(s));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  const p = (n) => String(n).padStart(2, '0');
  return h ? `${h}:${p(m)}:${p(x)}` : `${m}:${p(x)}`;
}

window.toma.onState((st) => {
  const bar = $('bar');
  bar.classList.toggle('paused', st.phase === 'paused');
  $('ico-pause').style.display = st.phase === 'paused' ? 'none' : '';
  $('ico-play').style.display = st.phase === 'paused' ? '' : 'none';
  if (st.phase === 'countdown') {
    $('time').textContent = st.count ? `Empieza en ${st.count}…` : 'Preparando…';
  } else if (st.phase === 'stopping') {
    $('time').textContent = 'Guardando…';
  } else {
    $('time').innerHTML = `<span class="dot"></span>${fmt(st.elapsed)}`;
  }
});
