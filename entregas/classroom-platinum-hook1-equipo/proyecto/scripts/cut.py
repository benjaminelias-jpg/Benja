import json, subprocess, sys
import os
E=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC=os.environ.get('SRC_VIDEO', os.path.join(E,'fuente','Classroom Planitnum Hook 1 - Equipo.mp4'))
FPS=30
# (inicio silencio, fin silencio, aire que se conserva)
GAPS=[(2.788,2.974,0.14),(3.665,3.949,0.10),(5.563,5.841,0.10),(6.547,6.755,0.12),(9.702,10.061,0.10),
(11.545,11.697,0.08),(12.606,12.800,0.10),(13.311,13.531,0.10),(17.155,17.342,0.12),(22.252,22.406,0.10),
(22.631,22.896,0.10),(23.608,24.073,0.16),(24.575,24.899,0.16),(25.361,25.514,0.10),(28.480,28.618,0.08),
(29.122,29.351,0.10),(29.941,30.237,0.10),(32.266,32.985,0.14),(35.219,35.602,0.10),(36.619,36.845,0.12)]
END=37.526+0.25
SHOT_CHANGES=[6.667,17.233,32.6]
f=lambda t: round(t*FPS)
for d in ('base','analysis'): os.makedirs(os.path.join(E,d), exist_ok=True)
segs=[]; cur=0
for s,e,k in GAPS:
    a=f(s+k*0.4); b=f(e-k*0.6)
    if b<=a: continue
    segs.append([cur,a]); cur=b
segs.append([cur,f(END)])
# L-cut: en los cambios de plano el plano saliente se queda 2 frames más sobre el audio entrante
LCUT=2
vsegs=[list(x) for x in segs]
for i in range(len(segs)-1):
    out_t=segs[i][1]/FPS; in_t=segs[i+1][0]/FPS
    scs=[sc for sc in SHOT_CHANGES if out_t<sc<in_t+0.05]
    if scs:
        lc=min(LCUT, round(scs[0]*FPS)-segs[i][1])
        vsegs[i][1]+=lc; vsegs[i+1][0]+=lc
        print('L-cut',i,'frames',lc)
tot=sum(b-a for a,b in segs)
assert tot==sum(b-a for a,b in vsegs)
out=[]; o=0
for (a,b),(va,vb) in zip(segs,vsegs):
    out.append({'src_in':a,'src_out':b,'v_in':va,'v_out':vb,'out_in':o}); o+=b-a
json.dump({'fps':FPS,'segments':out,'frames':tot},open(f'{E}/analysis/cuts.json','w'),indent=1)
print('segments',len(out),'frames',tot,'dur',tot/FPS)
def remap(t):
    fr=t*FPS
    for s in out:
        if s['src_in']<=fr<=s['src_out']: return (s['out_in']+fr-s['src_in'])/FPS
    # dentro de un hueco recortado -> al punto de unión
    for s in out:
        if fr<s['src_in']: return s['out_in']/FPS
    return tot/FPS
words=json.load(open(f'{E}/analysis/words.json'))
W=[]
for sg in words:
    for w in sg['words']:
        W.append({'w':w['w'].strip(),'s':round(remap(w['s']),3),'e':round(remap(w['e']),3),'src_s':w['s']})
json.dump(W,open(f'{E}/analysis/words_out.json','w'),ensure_ascii=False,indent=0)
json.dump({'shot_changes_out':[round(remap(t),3) for t in SHOT_CHANGES]},open(f'{E}/analysis/shots_out.json','w'))
print('shot changes out',[round(remap(t),3) for t in SHOT_CHANGES])
# ---- ffmpeg: video
grade="lut3d=file={}/color/skin.cube,eq=contrast=1.06:brightness=-0.01:saturation=0.97,curves=master='0/0 0.06/0.035 0.5/0.5 0.94/0.96 1/1'".format(E)
vf=[]; af=[]
for i,s in enumerate(out):
    vf.append(f"[0:v]trim=start_frame={s['v_in']}:end_frame={s['v_out']},setpts=PTS-STARTPTS[v{i}]")
    st=s['src_in']/FPS; en=s['src_out']/FPS; d=en-st
    af.append(f"[0:a]atrim=start={st:.6f}:end={en:.6f},asetpts=PTS-STARTPTS,afade=t=in:d=0.008,afade=t=out:st={max(0,d-0.008):.6f}:d=0.008[a{i}]")
n=len(out)
fc=';'.join(vf)+';'+''.join(f'[v{i}]' for i in range(n))+f'concat=n={n}:v=1:a=0,{grade},format=yuv420p[vout];'+';'.join(af)+';'+''.join(f'[a{i}]' for i in range(n))+f'concat=n={n}:v=0:a=1[aout]'
open(f'{E}/analysis/cut_filter.txt','w').write(fc)
subprocess.run(['ffmpeg','-v','error','-y','-i',SRC,'-filter_complex_script',f'{E}/analysis/cut_filter.txt','-map','[vout]','-c:v','libx264','-crf','10','-preset','medium','-r','30','-an',f'{E}/base/base_video.mp4','-map','[aout]','-vn','-ar','48000','-ac','2','-c:a','pcm_s24le',f'{E}/base/voice_raw.wav'],check=True)
