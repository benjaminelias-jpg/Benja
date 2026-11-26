# Prepara una persona de la BBDD para la escena (lienzo con margen + ojo de pez) usando prep_full.py
# uso: python3 -I prep_db.py <id> <n> <salida.png>
import json, os, shutil, subprocess, sys, tempfile
pid, n, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
R = '/home/user/Benja/recursos/personajes'
d = json.load(open(f'{R}/personajes.json')); im = d[pid]['imagenes'][n - 1]
assert im.get('uso') in ('cuerpo entero', 'escena'), f"{im['archivo']} es {im.get('uso')}: no sirve para una escena a pantalla completa"
t = tempfile.mkdtemp(); src = os.path.join(t, 'p.png'); shutil.copy(f"{R}/{im['archivo']}", src)
json.dump({'cara': im['cara'], 'toca_borde': im['toca_borde']}, open(src[:-4] + '.json', 'w'))
here = os.path.dirname(os.path.abspath(__file__))
subprocess.run([sys.executable, '-I', os.path.join(here, 'prep_full.py'), src, out], check=True)
print(pid, im['archivo'], im['uso'], 'licencia:', im.get('licencia'), '| autor:', im.get('autor'))
