const params = new URLSearchParams(location.search);
const video = document.getElementById('v');
const errEl = document.getElementById('err');
let deviceId = params.get('deviceId') || '';
let stream = null;
let starting = 0;

async function startCam() {
  const turn = ++starting;
  if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; }
  try {
    const s = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: deviceId ? { exact: deviceId } : undefined, width: { ideal: 640 }, height: { ideal: 640 } },
    });
    if (turn !== starting) { s.getTracks().forEach((t) => t.stop()); return; }
    stream = s;
    video.srcObject = s;
    errEl.hidden = true;
    s.getVideoTracks()[0].addEventListener('ended', () => {
      if (stream !== s) return;
      errEl.textContent = 'Se desconectó la cámara';
      errEl.hidden = false;
    });
  } catch {
    if (turn === starting) {
      errEl.textContent = 'No se pudo abrir la cámara';
      errEl.hidden = false;
    }
  }
}

function markSize(s) {
  document.querySelectorAll('#tools button').forEach((b) => b.classList.toggle('on', b.dataset.s === s));
}

document.querySelectorAll('#tools button').forEach((b) =>
  b.addEventListener('click', () => window.toma.setBubbleSize(b.dataset.s)));

window.toma.onBubbleConfig((c) => {
  if (c.sizeKey) markSize(c.sizeKey);
  if (typeof c.mirror === 'boolean') video.classList.toggle('mirror', c.mirror);
  if (c.deviceId !== undefined && c.deviceId !== deviceId) { deviceId = c.deviceId; startCam(); }
});

video.classList.toggle('mirror', params.get('mirror') !== '0');
markSize(params.get('size') || 'm');
startCam();
