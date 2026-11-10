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
  const t = $('time');
  t.classList.toggle('big', st.phase === 'countdown' && !!st.count);
  if (st.phase === 'countdown') t.textContent = st.count ? String(st.count) : '…';
  else if (st.phase === 'stopping') t.textContent = '…';
  else t.textContent = fmt(st.elapsed);
});
