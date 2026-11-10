const params = new URLSearchParams(location.search);
let deviceId = params.get('deviceId') || '';
let stream = null;

async function startCam() {
  if (stream) stream.getTracks().forEach((t) => t.stop());
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: deviceId ? { exact: deviceId } : undefined, width: { ideal: 640 }, height: { ideal: 640 } },
    });
    document.getElementById('v').srcObject = stream;
    document.getElementById('err').hidden = true;
  } catch {
    document.getElementById('err').hidden = false;
  }
}

function markSize(s) {
  document.querySelectorAll('#tools button').forEach((b) => b.classList.toggle('on', b.dataset.s === s));
}

document.querySelectorAll('#tools button').forEach((b) =>
  b.addEventListener('click', () => window.toma.setBubbleSize(b.dataset.s)));

window.toma.onBubbleConfig((c) => {
  if (c.sizeKey) markSize(c.sizeKey);
  if (c.deviceId !== undefined && c.deviceId !== deviceId) { deviceId = c.deviceId; startCam(); }
});
window.toma.onState((s) => {
  document.getElementById('bubble').classList.toggle('rec', s.phase === 'recording');
});

markSize(params.get('size') || 'm');
startCam();
