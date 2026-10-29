# Landing de vendedores v2 · una sola landing, vendedor por URL

Genera `landings/vendedores/v2/index.html`. Es la misma página que la v1, pero sirve para todo el equipo. El vendedor sale de la URL:

- `?vendedor=jorge` es la forma recomendada.
- También vale el id en `utm_content`, `utm_term` o `utm_campaign`, como palabra suelta. Por ejemplo, `utm_content=rmk3_jorge_tweet`.

Con vendedor, la página enseña solo su foto, su nombre, su WhatsApp y su calendario. Sin vendedor, o con un id que no existe, sale la versión de equipo. Los datos de cada uno están en `KF_VENDEDORES` y los del equipo en `KF_EQUIPO`, en `config.js` (van al `<head>`).

Para regenerarla, desde esta carpeta:

```
python3 build.py ../plantilla-fiscal-v1.html ../../vendedores/v2/index.html .
```

La v1 (`landings/vendedores/v1`) y las landings por vendedor (`landings/vendedor-*/v1`) se mantienen tal cual. Sus piezas están en `landings/_build/`.
