# Genera las 8 texturas de grano (ruido de color, 540×960) que la plantilla cicla a 12 fps.
# Determinista (semilla fija). Uso: python3 scripts/generar_grano.py assets
import sys, os, numpy as np
from PIL import Image
out = sys.argv[1] if len(sys.argv) > 1 else "assets"
os.makedirs(out, exist_ok=True)
rng = np.random.default_rng(1990)
for i in range(8):
    g = np.clip(rng.normal(124, 29, (960, 540, 3)), 0, 255).astype(np.uint8)
    Image.fromarray(g).save(os.path.join(out, f"grano-{i}.png"))
print(f"OK → {out}/grano-0..7.png")
