# Regenera recursos/personajes/README.md a partir de personajes.json (mapa de temas, uso de cada foto y créditos)
# uso: python3 recursos/personajes/herramientas/make_readme.py
import json, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = json.load(open(os.path.join(R, 'personajes.json')))
imgs = [im for p in d.values() for im in p['imagenes']]
cuenta = lambda u: sum(1 for im in imgs if im.get('uso') == u)
rows = []
for pid, p in d.items():
    fotos = ', '.join(f"`{im['archivo']}` ({im.get('uso', '—')})" for im in p['imagenes']) or '— pendiente —'
    rows.append(f"| {p['nombre']} | {', '.join(p['temas'])} | {fotos} |")
cred = [f"| `{im['archivo']}` | {im.get('autor') or 'ver fuente'} | {im.get('licencia') or 'ver fuente'} | [Commons]({im['fuente']}) |" for im in imgs]
sin = [p['nombre'] for p in d.values() if not p['imagenes']]
md = f"""# Recursos · Personajes en B/N

Base de retratos recortados en blanco y negro para los motion graphics «estilo Ramiro» (skill `motion-graphic-estilo-ramiro`).
Cada personaje va asociado a temas: si el guion habla de marketing, va Hormozi; de dinero o poder, Bezos; de comunicación o innovación, Jobs; etc.

![Hoja de personajes](hoja_personajes.jpg)

- **{len(imgs)} recortes de {sum(1 for p in d.values() if p['imagenes'])} personajes**: PNG en escala de grises con transparencia, con la **silueta completa** que trae cada foto (sin encuadre previo y sin halo).
- `personajes.json`: guarda los datos de cada personaje y de cada foto.
  - Por personaje: temas, palabras clave y por qué encaja.
  - Por foto: posición de la cara (para el ojo de pez y la flecha), bordes que toca la silueta, uso recomendado, autor, licencia y fuente.
- `buscar.py`: sugiere personajes para una frase del guion.
  ```bash
  python3 recursos/personajes/buscar.py "estás perdiendo hasta un 27 % de tus conversiones"
  ```
- Sin foto todavía: **{', '.join(sin)}**. No hay fotos con licencia libre en Wikimedia Commons. Para Hormozi conviene usar la foto que usó Brayan en la skill.

## Regla: siempre de cuerpo completo, sin cortes

En un motion, la persona nunca muestra un corte (ni en la cabeza, ni en los hombros, ni en la base del recorte). Por eso cada foto lleva su `uso`:

- **cuerpo entero** ({cuenta('cuerpo entero')}): la silueta está completa. Sirve para cualquier escena.
- **escena** ({cuenta('escena')}): está completa salvo por abajo, donde el cuerpo sigue. En la escena, ese borde inferior se coloca fuera del encuadre.
- **primer plano** ({cuenta('primer plano')}): la foto original corta hombros o cabeza. No sirve para una escena a pantalla completa; úsala solo en tarjetas o en un marco.

## Mapa de temas

| Personaje | Temas | Fotos (uso) |
|---|---|---|
""" + '\n'.join(rows) + f"""

## Cómo se usa en una escena

`herramientas/prep_persona.py` (y `prep_full.py` en el proyecto del video) aplica el ojo de pez de la skill.
- Lo centra en la cara guardada y deja margen para no recortar la cabeza.
- Mide el borde real de la cabeza para que la punta de la flecha nunca la toque.
- La composición coloca a la persona por el alto de cara (`cara.h`).

## Cómo se hizo (y cómo ampliarla)

1. `herramientas/fetch_v2.py`: candidatas desde los artículos de Wikipedia (en, es, de, fr, it, pt) y la imagen principal de Wikidata, puntuadas por detección de cara (YuNet).
2. Selección manual sobre hojas de contacto (`sheet_candidates.py`).
3. `herramientas/cut_full.py`: recorte de la silueta completa con BiRefNet.
   - Separa a la persona elegida si hay otra al lado.
   - Estima el primer plano para que no quede halo.
   - Pasa a B/N con el contraste de la skill.
4. `herramientas/reprocess_db.py`: rehace toda la base y clasifica el uso de cada foto.
5. Para añadir a alguien: una entrada en `herramientas/config.json` y repetir 1–4.

## Derechos

Las fotos vienen de Wikimedia Commons con licencias libres (dominio público, CC BY, CC BY-SA). **CC BY y CC BY-SA obligan a citar al autor** (por ejemplo en el copy del anuncio o en los créditos). La licencia cubre la foto, no la imagen de la persona. Usar a un famoso en un **anuncio pagado** puede sugerir que respalda la marca y en España el uso comercial de la imagen de una persona necesita su consentimiento. Para contenido orgánico o editorial el riesgo es menor. Úsalos como metáfora visual de una idea, nunca como testimonio ni con frases inventadas.

### Créditos

| Archivo | Autor | Licencia | Fuente |
|---|---|---|---|
""" + '\n'.join(cred) + '\n'
open(os.path.join(R, 'README.md'), 'w').write(md)
print('README:', len(imgs), 'fotos;', {u: cuenta(u) for u in ('cuerpo entero', 'escena', 'primer plano')})
