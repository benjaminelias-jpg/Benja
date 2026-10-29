# Cómo se generan las landings de vendedores

- `plantilla-fiscal-v1.html`: copia de kunfupay.com/landings/fiscal/v1, la plantilla común de las landings.
- `build.py` genera la principal, `landings/vendedores/v1/index.html`, a partir de la plantilla y de las piezas de esta carpeta (texto del hero, CTA, equipo, calendario, CSS y script).
- `vendedores.py` genera, a partir de la principal, una landing por vendedor: `landings/vendedor-{taiab,rafa,juan,jorge}/v1/`.

Para regenerar todo, desde esta carpeta:

```
python3 build.py plantilla-fiscal-v1.html ../vendedores/v1/index.html .
python3 vendedores.py ../vendedores/v1/index.html ..
```

Cada landing lleva arriba, en la config del `<head>`, su `KF_WHATSAPP` y su `KF_CALENDAR_URL`. Si se regenera, hay que volver a ponerlos, o mejor añadirlos a `VENDEDORES` en `vendedores.py`.
