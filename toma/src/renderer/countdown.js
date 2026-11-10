const disc = document.getElementById('disc');
const num = document.getElementById('n');
let shown = 0;

window.toma.onState((st) => {
  const n = st.phase === 'countdown' ? st.count || 0 : 0;
  disc.classList.toggle('show', n > 0);
  if (n > 0 && n !== shown) {
    shown = n;
    num.textContent = String(n);
    num.classList.remove('tick');
    void num.offsetWidth; // reinicia la animación
    num.classList.add('tick');
  }
});
