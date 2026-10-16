import cv2, sys, json
V=sys.argv[1]; out=sys.argv[2]
cap=cv2.VideoCapture(V)
fr=cv2.CascadeClassifier(cv2.data.haarcascades+'haarcascade_frontalface_default.xml')
pr=cv2.CascadeClassifier(cv2.data.haarcascades+'haarcascade_profileface.xml')
res=[]; i=0
while True:
    ok,img=cap.read()
    if not ok: break
    if i%3==0:
        g=cv2.cvtColor(cv2.resize(img,(540,960)),cv2.COLOR_BGR2GRAY); g=cv2.equalizeHist(g)
        f=list(fr.detectMultiScale(g,1.1,5,minSize=(60,60)))
        if not f:
            f=list(pr.detectMultiScale(g,1.1,4,minSize=(60,60)))+[(540-x-w,y,w,h) for x,y,w,h in pr.detectMultiScale(cv2.flip(g,1),1.1,4,minSize=(60,60))]
        f=sorted(f,key=lambda b:-b[2]*b[3])[:1]
        res.append({'t':round(i/30,3),'box':[int(v*2) for v in f[0]] if f else None})
    i+=1
json.dump(res,open(out,'w'))
