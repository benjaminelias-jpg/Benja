# LUT 3D: corrige piel magenta (hue 295-335) sin tocar la luz violeta de la pared (hue 255-285).
import numpy as np, sys
N=33; out=sys.argv[1]
SHIFT=float(sys.argv[2]) if len(sys.argv)>2 else 32   # grados hacia rojo/rosa
DESAT=float(sys.argv[3]) if len(sys.argv)>3 else 0.62  # factor de saturación en piel
g=np.linspace(0,1,N)
b,gg,r=np.meshgrid(g,g,g,indexing='ij')  # .cube: R varía más rápido
rgb=np.stack([r,gg,b],-1).reshape(-1,3)
mx=rgb.max(1); mn=rgb.min(1); d=mx-mn+1e-9
h=np.zeros(len(rgb))
R,G,B=rgb.T
m=mx==R; h[m]=((G-B)[m]/d[m])%6
m=mx==G; h[m]=((B-R)[m]/d[m])+2
m=mx==B; h[m]=((R-G)[m]/d[m])+4
h=h*60; s=np.where(mx>0,d/mx,0); v=mx
def smooth(x):
    x=np.clip(x,0,1); return x*x*(3-2*x)
# peso por tono: 0 en <=288, 1 en 302..330, 0 en >=350
w=smooth((h-288)/14)*(1-smooth((h-330)/20))
w*=smooth((s-0.18)/0.25)              # solo colores saturados
nh=(h+SHIFT*w)%360
ns=s*(1-(1-DESAT)*w)
nv=v*(1+0.04*w)                        # un poco de luz en piel
# hsv->rgb
c=nv*ns; hp=nh/60; x=c*(1-np.abs(hp%2-1)); z=np.zeros_like(c)
conds=[(hp<1),(hp<2),(hp<3),(hp<4),(hp<5),(hp<=6)]
vals=[(c,x,z),(x,c,z),(z,c,x),(z,x,c),(x,z,c),(c,z,x)]
o=np.zeros_like(rgb); done=np.zeros(len(rgb),bool)
for cd,(a1,a2,a3) in zip(conds,vals):
    sel=cd&~done; o[sel]=np.stack([a1,a2,a3],-1)[sel]; done|=sel
o+= (nv-c)[:,None]
o=np.clip(o,0,1)
with open(out,'w') as f:
    f.write(f'LUT_3D_SIZE {N}\n')
    for p in o: f.write(f'{p[0]:.6f} {p[1]:.6f} {p[2]:.6f}\n')
