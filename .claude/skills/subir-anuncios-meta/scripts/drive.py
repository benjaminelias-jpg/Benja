"""Drive público sin conector: listar carpetas y descargar archivos.

  python3 -I drive.py ls  <ID_CARPETA>            -> nombre<TAB>id<TAB>tipo por línea
  python3 -I drive.py get <ID_ARCHIVO> <destino>  -> descarga el archivo

La carpeta o el archivo tienen que estar compartidos con «cualquiera con el enlace».
Usa el certificado del proxy del entorno si existe (nunca desactives la verificación TLS)."""
import os
import re
import ssl
import sys
import urllib.request

CA = "/root/.ccr/ca-bundle.crt"
ctx = ssl.create_default_context(cafile=CA) if os.path.exists(CA) else ssl.create_default_context()


def abrir(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    return urllib.request.urlopen(req, context=ctx, timeout=120)


def ls(fid):
    html = abrir(f"https://drive.google.com/embeddedfolderview?id={fid}").read().decode("utf-8", "replace")
    for m in re.finditer(r'<div class="flip-entry" id="entry-([^"]+)".*?<div class="flip-entry-title">(.*?)</div>', html, re.S):
        tipo = "carpeta" if f"/drive/folders/{m.group(1)}" in html else "archivo"
        print(f"{m.group(2)}\t{m.group(1)}\t{tipo}")


def get(fid, destino):
    url = f"https://drive.usercontent.google.com/download?id={fid}&export=download&confirm=t"
    with abrir(url) as r, open(destino, "wb") as f:
        while True:
            b = r.read(1 << 20)
            if not b:
                break
            f.write(b)
    print(destino, os.path.getsize(destino), "bytes")


if __name__ == "__main__":
    if sys.argv[1] == "ls":
        ls(sys.argv[2])
    elif sys.argv[1] == "get":
        get(sys.argv[2], sys.argv[3])
    else:
        sys.exit("uso: drive.py ls <id> | get <id> <destino>")
