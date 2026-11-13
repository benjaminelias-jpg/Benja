"""Cuenta los patrones que se repiten en los copys de todos los anuncios. Salida: datos/patrones.json"""
import json, re, sys
base='/home/user/Benja/creatividades/'
anuncios=[]  # (grupo, nombre, texto)
d=json.load(open(base+'metodos-de-pago/hubs/_fuente/copys_hubs.json',encoding='utf-8'))
for k,v in d.items():
    anuncios.append(('Estático de hub',k,'\n'.join(l for l in '\n'.join([v['largo'],v['corto'],v['t1'],v['t2']]).split('\n') if 'empresa de tecnología financiera' not in l)))
def bloques(path,grupo,nivel):
    t=open(base+path,encoding='utf-8').read()
    partes=re.split(r'\n(?='+('#'*nivel)+r' )',t)
    for p in partes[1:]:
        nombre=p.split('\n',1)[0].lstrip('# ').strip()
        p='\n'.join(l for l in p.split('\n') if not l.startswith('#') and 'empresa de tecnología financiera' not in l)
        anuncios.append((grupo,nombre,p))
bloques('metodos-de-pago/hubs/COPYS-REELS-HUBS.md','Reel de hub',3)
bloques('metodos-de-pago/espana/COPYS-ESTATICOS-ESPANA.md','Estático de España',2)
bloques('optimizacion-fiscal/COPYS-REELS-FISCAL-NOV.md','Reel fiscal',2)
bloques('classroom-platinum/COPYS-REELS-VC-INVERSION.md','Reel Classroom',2)
t=open(base+'metodos-de-pago/COPYS-REEL-DEJA-DE-PERDER-VENTAS.md',encoding='utf-8').read()
anuncios.append(('Reel de España','REEL / DEJA DE PERDER VENTAS / MET PAGOS',t))
pat={
 'cifra27':r'27 ?%','cifra30':r'30 ?%',
 'hasta':r'hasta (un )?\d+ ?%',
 'filtro':r'Si (vendes|das|eres|cobras|tienes)',
 'cierre':r'mira si tu negocio encaja',
 'no_vendes':r'Si todavía no vendes',
 'paraTi':r'Esto es para ti si',
 'clic':r'descubre cómo',
 'stripe':r'Stripe','paypal':r'PayPal','hotmart':r'Hotmart',
 'tarjeta':r'tarjeta',
 'enlace':r'enlace',
 'recibes':r'recibes? (euros|dólares)',
 'aviso':r'empresa de tecnología financiera',
 'impuestos':r'impuestos',
 'mor':r'Merchant of Record',
 'tutu':r'tú a tú','ventas_caen':r'(se cae|pierdes|perdiendo)',
}
res={k:[] for k in pat}
for g,n,tx in anuncios:
    for k,r in pat.items():
        if re.search(r,tx,re.I if k not in('stripe','paypal','hotmart') else 0): res[k].append(n)
print(len(anuncios),'anuncios')
from collections import Counter
print(Counter(g for g,_,_ in anuncios))
out={'total':len(anuncios),'por_grupo':dict(Counter(g for g,_,_ in anuncios)),'cuenta':{k:len(v) for k,v in res.items()},'quien':{k:v for k,v in res.items() if k in ('cifra27','cifra30','impuestos','mor','hotmart','paypal')}}
json.dump(out,open('/home/user/Benja/documento-maestro/_fuente/datos/patrones.json','w'),ensure_ascii=False,indent=1)
for k,v in res.items(): print(k,len(v))
print(res['cifra27'][:5], res['mor'], res['impuestos'])
