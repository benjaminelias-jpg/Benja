"""Convierte los .md de documento-maestro/_fuente/contenido en HTML y los pasa a PDF.

Uso:  python3 build.py [nombre1 nombre2 ...]     (sin argumentos: todos)
      Cada nombre es un archivo contenido/<nombre>.md y sale pdf/<nombre>.pdf

Markdown reducido (títulos, párrafos, listas, tablas, citas) más estas órdenes:
  ::portada Antetítulo | Título | Subtítulo | Pie
  ::indice
  ::salto
  ::pizarra <ruta de imagen desde la raíz del repo> [w=300]
      x,y | Etiqueta | Por qué           (x,y de 0 a 1 sobre la imagen)
      pie: texto del pie
  ::fin
  ::pizarratexto [w=300]
      <html del texto>
      --
      x,y | Etiqueta | Por qué
      pie: ...
  ::fin
  ::galeria ruta1 = pie1 ; ruta2 = pie2 ...
  ::fig <nombre>           (figuras de figuras.py)
Las líneas que empiezan por «<» pasan tal cual (HTML).
"""
import html
import os
import re
import subprocess
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.normpath(os.path.join(AQUI, '..', '..'))
SAL = os.path.normpath(os.path.join(AQUI, '..', 'pdf'))
TMP = os.path.join(AQUI, '_html')
sys.path.insert(0, AQUI)
import figuras  # noqa: E402

JS = """
window.dibujarPizarras = function () {
  document.querySelectorAll('.pizarra').forEach(function (b) {
    var svg = b.querySelector('svg.cables'), r = b.getBoundingClientRect();
    var ad = b.querySelector('.ad .obj'), ir = ad.getBoundingClientRect();
    svg.setAttribute('width', r.width); svg.setAttribute('height', r.height);
    svg.setAttribute('viewBox', '0 0 ' + r.width + ' ' + r.height);
    var id = 'f' + Math.random().toString(36).slice(2, 8);
    var out = '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#260f63"/></marker></defs>';
    b.querySelectorAll('.co').forEach(function (c) {
      var fx = parseFloat(c.dataset.x), fy = parseFloat(c.dataset.y);
      var n = c.querySelector('.num').getBoundingClientRect();
      var izq = !!c.closest('.izq');
      var x1 = izq ? n.right - r.left + 3 : n.left - r.left - 3, y1 = n.top - r.top + n.height / 2;
      var x2 = ir.left - r.left + fx * ir.width, y2 = ir.top - r.top + fy * ir.height;
      var dx = Math.abs(x1 - x2), s = izq ? 1 : -1;
      var d = 'M' + x1 + ',' + y1 + ' C' + (x1 + s * Math.max(16, dx * 0.5)) + ',' + y1 + ' ' + (x2 - s * Math.max(14, dx * 0.35)) + ',' + y2 + ' ' + x2 + ',' + y2;
      out += '<path class="halo" d="' + d + '"/><path class="cable" d="' + d + '" marker-end="url(#' + id + ')"/>';
    });
    svg.innerHTML = out;
  });
};
"""


def esc(s):
    return html.escape(s, quote=False)


def enlinea(s):
    s = esc(s)
    s = re.sub(r'`([^`]+)`', r'<code>\1</code>', s)
    s = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'(?<![\w*])\*([^*\n]+)\*(?![\w*])', r'<em>\1</em>', s)
    s = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', s)
    return s


def slug(s):
    s = re.sub(r'[^\w\s-]', '', s.lower())
    return re.sub(r'\s+', '-', s.strip())[:60]


def ruta_img(p):
    p = p.strip()
    return 'file://' + (p if p.startswith('/') else os.path.join(RAIZ, p))


def notas_pizarra(lineas):
    """Devuelve (html notas izquierda, html notas derecha, pie). Cada línea: [L|R] x,y | Etiqueta | Por qué."""
    cos, pie = [], ''
    for ln in lineas:
        ln = ln.strip()
        if not ln:
            continue
        if ln.lower().startswith('pie:'):
            pie = ln[4:].strip()
            continue
        xy, etiqueta, porque = [t.strip() for t in ln.split('|', 2)]
        lado = 'R'
        if xy[0] in 'LR':
            lado, xy = xy[0], xy[1:].strip()
        x, y = xy.split(',')
        cos.append((lado, float(x), float(y), etiqueta, porque))
    h = {'L': '', 'R': ''}
    for i, (lado, x, y, e, p) in enumerate(cos, 1):
        h[lado] += (f'<div class="co" data-x="{x}" data-y="{y}"><div class="num">{i}</div>'
                    f'<div><b>{enlinea(e)}</b><span>{enlinea(p)}</span></div></div>')
    return h['L'], h['R'], pie


def pizarra(obj_html, w, lineas):
    izq, der, pie = notas_pizarra(lineas)
    cap = f'<figcaption>{enlinea(pie)}</figcaption>' if pie else ''
    col_izq = f'<div class="notas izq">{izq}</div>' if izq else ''
    return (f'<figure><div class="pizarra{" dos-lados" if izq else ""}">{col_izq}'
            f'<div class="ad" style="width:{w}px">{obj_html}</div>'
            f'<div class="notas der">{der}</div><svg class="cables"></svg></div>{cap}</figure>')


def cambio(resto, lineas):
    """Antes y después de un anuncio. Líneas: antes: ruta | título ; despues: ruta | título ;
    x,y | Qué se cambió | Por qué (x,y sobre la imagen «después», 0 a 1) ; pie: texto."""
    m = re.search(r'w=(\d+)', resto)
    w = int(m.group(1)) if m else 250
    antes = despues = None
    notas, pie = [], ''
    for ln in lineas:
        ln = ln.strip()
        if not ln:
            continue
        if ln.startswith('antes:'):
            r, _, t = ln[6:].partition('|')
            antes = (r.strip(), t.strip())
        elif ln.startswith('despues:'):
            r, _, t = ln[8:].partition('|')
            despues = (r.strip(), t.strip())
        elif ln.lower().startswith('pie:'):
            pie = ln[4:].strip()
        else:
            xy, e, p = [t.strip() for t in ln.split('|', 2)]
            x, y = xy.split(',')
            notas.append((float(x), float(y), e, p))
    pins = ''.join(f'<span class="pin" style="left:{x * 100:.1f}%;top:{y * 100:.1f}%">{i}</span>'
                   for i, (x, y, _e, _p) in enumerate(notas, 1))
    lista = ''.join(f'<div class="co"><div class="num">{i}</div><div><b>{enlinea(e)}</b>'
                    f'<span>{enlinea(p)}</span></div></div>' for i, (_x, _y, e, p) in enumerate(notas, 1))
    cap = f'<figcaption>{enlinea(pie)}</figcaption>' if pie else ''
    return (f'<figure class="cambio"><div class="par">'
            f'<div class="lado"><div class="etq no">Antes</div><img src="{ruta_img(antes[0])}" style="width:{w}px">'
            f'<div class="tt">{enlinea(antes[1])}</div></div>'
            f'<div class="flecha">&#8594;</div>'
            f'<div class="lado"><div class="etq si">Ahora</div><div class="conpins"><img src="{ruta_img(despues[0])}" style="width:{w}px">{pins}</div>'
            f'<div class="tt">{enlinea(despues[1])}</div></div></div>'
            f'<div class="notas2">{lista}</div>{cap}</figure>')


class Doc:
    def __init__(self, texto):
        self.l = texto.split('\n')
        self.i = 0
        self.out = []
        self.caps = []
        self.ncap = 0

    def fin(self):
        return self.i >= len(self.l)

    def bloque(self, lineas):
        d = Doc('\n'.join(lineas))
        d.ncap = 999
        d.run(sub=True)
        return ''.join(d.out)

    def lista(self):
        items = []
        pat = re.compile(r'^(\s*)([-*]|\d+\.)\s+(.*)$')
        while not self.fin():
            ln = self.l[self.i]
            m = pat.match(ln)
            if m:
                items.append([len(m.group(1)), m.group(2)[0].isdigit(), m.group(3), m.group(2).rstrip('.')])
            elif ln.strip() and ln.startswith('  ') and items:
                items[-1][2] += ' ' + ln.strip()
            else:
                break
            self.i += 1

        def pinta(k, ind):
            tag = 'ol' if items[k][1] else 'ul'
            ini = f' start="{items[k][3]}"' if items[k][1] and items[k][3] != '1' else ''
            s = f'<{tag}{ini}>'
            while k < len(items) and items[k][0] >= ind:
                if items[k][0] > ind:
                    sub, k = pinta(k, items[k][0])
                    s = s[:-5] + sub + '</li>'
                else:
                    s += '<li>' + enlinea(items[k][2]) + '</li>'
                    k += 1
            return s + f'</{tag}>', k
        return pinta(0, items[0][0])[0]

    def tabla(self):
        filas = []
        while not self.fin() and self.l[self.i].strip().startswith('|'):
            filas.append([c.strip() for c in self.l[self.i].strip().strip('|').split('|')])
            self.i += 1
        cab, cuerpo = filas[0], [f for f in filas[2:]]
        larga = ' class="larga"' if len(cuerpo) > 12 else ''
        s = f'<table{larga}><thead><tr>' + ''.join(f'<th>{enlinea(c)}</th>' for c in cab) + '</tr></thead><tbody>'
        for f in cuerpo:
            s += '<tr>' + ''.join(f'<td>{enlinea(c)}</td>' for c in f) + '</tr>'
        return s + '</tbody></table>'

    def hasta_fin(self):
        ls = []
        while not self.fin() and self.l[self.i].strip() != '::fin':
            ls.append(self.l[self.i])
            self.i += 1
        self.i += 1
        return ls

    def orden(self, ln):
        cmd, _, resto = ln[2:].partition(' ')
        resto = resto.strip()
        if cmd == 'portada':
            k, t, s, m = [x.strip() for x in resto.split('|')]
            return (f'<div class="portada"><div class="k">{esc(k)}</div><h1>{esc(t)}</h1>'
                    f'<div class="s">{enlinea(s)}</div><div class="m">{enlinea(m)}</div></div>')
        if cmd == 'indice':
            return '<!--INDICE-->'
        if cmd == 'salto':
            return '<div style="break-after:page"></div>'
        if cmd == 'fig':
            return getattr(figuras, resto)()
        if cmd == 'galeria':
            h = '<figure><div class="galeria">'
            for par in resto.split(';'):
                r, _, pie = par.partition('=')
                h += f'<div><img src="{ruta_img(r)}">{enlinea(pie.strip())}</div>'
            return h + '</div></figure>'
        if cmd == 'pizarra':
            m = re.match(r'(\S+)(?:\s+w=(\d+))?', resto)
            w = int(m.group(2) or 290)
            return pizarra(f'<img class="obj" src="{ruta_img(m.group(1))}">', w, self.hasta_fin())
        if cmd == 'pizarratexto':
            m = re.search(r'w=(\d+)', resto)
            w = int(m.group(1)) if m else 300
            ls = self.hasta_fin()
            corte = ls.index('--')
            return pizarra('<div class="obj txt">' + '\n'.join(ls[:corte]) + '</div>', w, ls[corte + 1:])
        if cmd == 'imagen':
            r, _, pie = resto.partition('|')
            m = re.search(r'\s+w=(\d+)', r)
            w = int(m.group(1)) if m else 220
            r = re.sub(r'\s+w=\d+', '', r)
            return (f'<figure><div class="solo"><img src="{ruta_img(r)}" style="width:{w}px">'
                    f'<figcaption>{enlinea(pie.strip())}</figcaption></div></figure>')
        if cmd == 'cambio':
            return cambio(resto, self.hasta_fin())
        raise SystemExit('orden desconocida: ' + ln)

    def run(self, sub=False):
        par = []

        def suelta():
            if par:
                cls = ''
                t = ' '.join(par)
                if t.startswith('{lead}'):
                    cls, t = ' class="lead"', t[6:].strip()
                self.out.append(f'<p{cls}>{enlinea(t)}</p>')
                par.clear()
        while not self.fin():
            ln = self.l[self.i]
            st = ln.strip()
            if not st:
                suelta()
                self.i += 1
            elif st.startswith('::'):
                suelta()
                self.i += 1
                self.out.append(self.orden(st))
            elif st.startswith('<'):
                suelta()
                while not self.fin() and self.l[self.i].strip():
                    self.out.append(self.l[self.i])
                    self.i += 1
            elif re.match(r'^#{2,4} ', st):
                suelta()
                n = len(st.split(' ')[0])
                t = st[n + 1:]
                if n == 2 and not sub:
                    self.ncap += 1
                    tit, _, res = t.partition(' || ')
                    self.caps.append((self.ncap, tit, res))
                    self.out.append(f'<h2 id="c{self.ncap}"><span class="n">Parte {self.ncap}</span>{enlinea(tit)}</h2>')
                else:
                    self.out.append(f'<h{n}>{enlinea(t)}</h{n}>')
                self.i += 1
            elif st.startswith('|'):
                suelta()
                self.out.append(self.tabla())
            elif st.startswith('>'):
                suelta()
                ls = []
                while not self.fin() and self.l[self.i].strip().startswith('>'):
                    ls.append(re.sub(r'^\s*> ?', '', self.l[self.i]))
                    self.i += 1
                self.out.append('<blockquote>' + self.bloque(ls) + '</blockquote>')
            elif re.match(r'^([-*]|\d+\.)\s+', st):
                suelta()
                self.out.append(self.lista())
            else:
                par.append(st)
                self.i += 1
        suelta()


def construir(nombre):
    src = os.path.join(AQUI, 'contenido', nombre + '.md')
    texto = open(src, encoding='utf-8').read()
    pie_pdf = ''
    m = re.match(r'^pie-pdf:\s*(.*)\n', texto)
    if m:
        pie_pdf, texto = m.group(1), texto[m.end():]
    d = Doc(texto)
    d.run()
    cuerpo = '\n'.join(d.out)
    indice = '<div class="indice"><h2 style="break-before:auto"><span class="n">Contenido</span>Qué hay en este documento</h2><ol>'
    for n, t, r in d.caps:
        indice += f'<li><b>{n}</b>{enlinea(t)}<span>{enlinea(r)}</span></li>'
    indice += '</ol></div>'
    cuerpo = cuerpo.replace('<!--INDICE-->', indice)
    css = open(os.path.join(AQUI, 'estilo.css'), encoding='utf-8').read()
    page = (f'<!doctype html><html lang="es"><head><meta charset="utf-8"><title>{esc(pie_pdf)}</title>'
            f'<style>{css}</style></head><body>{cuerpo}<script>{JS}</script></body></html>')
    os.makedirs(TMP, exist_ok=True)
    os.makedirs(SAL, exist_ok=True)
    h = os.path.join(TMP, nombre + '.html')
    open(h, 'w', encoding='utf-8').write(page)
    subprocess.run(['node', os.path.join(AQUI, 'render.js'), h, os.path.join(SAL, nombre + '.pdf'), pie_pdf], check=True)


if __name__ == '__main__':
    nombres = sys.argv[1:] or sorted(f[:-3] for f in os.listdir(os.path.join(AQUI, 'contenido')) if f.endswith('.md'))
    for n in nombres:
        construir(n)
