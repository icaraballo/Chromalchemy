# Comprueba el borrador de acertijos: que no digan el nombre (misma regla que pistas.js) y su longitud.
import json,sys,unicodedata,re
d={c['id']:c for c in json.load(open('data/colores.json'))}
a=json.load(open(sys.argv[1] if len(sys.argv)>1 else 'tools/acertijos-borrador.json'))
norm=lambda s:''.join(ch for ch in unicodedata.normalize('NFD',s) if unicodedata.category(ch)!='Mn').lower()
V={'de','del','la','el','los','las','y','en','con'}
mal=0
for i,t in a.items():
  if i not in d: print('ID?',i); mal+=1; continue
  ws=[norm(w) for w in re.split(r'[\s-]+',d[i]['name']) if len(w)>2 and norm(w) not in V]
  hits=[m for m in re.findall(r'[^\W\d_]+',t) if any(norm(m)==b or (len(b)>4 and norm(m).startswith(b[:-1])) for b in ws)]
  flag=[]
  if hits: flag.append('NOMBRE:'+','.join(hits))
  if len(t)>170: flag.append(f'LARGO {len(t)}')
  if flag: mal+=1; print(i,flag)
print(len(a),'acertijos;',mal,'con avisos; máx',max(len(t) for t in a.values()),'caracteres')
