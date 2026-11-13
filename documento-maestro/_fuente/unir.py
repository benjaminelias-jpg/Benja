"""Une el maestro y las guías en un solo documento: contenido/completo.md"""
import re, os
C = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'contenido')
partes = [('maestro', ''), ('guia-1-estaticos', 'Guía 1 · '), ('guia-2-video-y-ugc', 'Guía 2 · '),
          ('guia-3-copys-subida-y-medicion', 'Guía 3 · ')]
out = ['pie-pdf: Documento maestro de creatividades · Kunfupay',
       '::portada Kunfupay · Marketing | Documento maestro de creatividades | Todo en un solo documento: el sistema, los ángulos, y las guías de estáticos, vídeo y copys. | Versión del 13 de noviembre de 2026']
for nombre, pref in partes:
    t = open(os.path.join(C, nombre + '.md'), encoding='utf-8').read()
    if nombre == 'maestro':
        t = re.sub(r'^pie-pdf:.*\n::portada.*\n', '', t)
    else:
        t = re.sub(r'^pie-pdf:.*\n', '', t)
        t = re.sub(r'^::portada.*\n', '', t, flags=re.M)
        t = re.sub(r'^::indice\s*\n', '', t, flags=re.M)
        t = re.sub(r'^## (.*)$', lambda m: '## ' + pref + m.group(1), t, flags=re.M)
    if nombre == 'maestro':
        vistos = set(re.findall(r'(creatividades/\S+?\.(?:png|jpg))', t))
    else:
        def quita(m):
            rutas = re.findall(r'(creatividades/\S+?\.(?:png|jpg))', m.group(0))
            return '' if rutas and all(r in vistos for r in rutas) else m.group(0)
        t = re.sub(r'^::(?:pizarra|cambio)[^\n]*\n.*?^::fin[^\n]*\n', quita, t, flags=re.M | re.S)
        t = re.sub(r'^::galeria[^\n]*\n', quita, t, flags=re.M)
    # sin nombre propio en las notas de corrección
    t = re.sub(r'Benja pidió', 'Se pidió', t)
    t = re.sub(r'Benja, el (\d[\d-]*):', r'El \1:', t)
    t = re.sub(r'Benja: ', '', t)
    t = re.sub(r'Lo propuso Benja\.?', '', t)
    out.append(t)
open(os.path.join(C, 'completo.md'), 'w', encoding='utf-8').write('\n'.join(out))
