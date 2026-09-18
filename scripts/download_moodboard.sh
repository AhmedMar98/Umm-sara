#!/bin/bash
# تنزيل صور نتائج البحث البصري + تسميتها
set -u
OUT="/home/z/my-project/research/pinterest/imgs"
mkdir -p "$OUT"
cd /home/z/my-project/research/pinterest

node -e "
const fs = require('fs');
const files = ['mood-dark-luxury','mood-uiux','mood-colors','mood-immersive'];
let all = [];
for (const f of files) {
  const j = JSON.parse(fs.readFileSync(f + '.json','utf8'));
  j.results.forEach((r, i) => all.push({ board: f.replace('mood-',''), i, url: r.original_url, source: r.source }));
}
fs.writeFileSync('_download_list.json', JSON.stringify(all));
console.log('total: ' + all.length);
console.log('sources: ' + [...new Set(all.map(a=>a.source))].join(' | '));
"

n=0
while read -r line; do
  n=$((n+1))
  board=$(echo "$line" | node -e "const l=JSON.parse(require('fs').readFileSync(0,'utf8'));console.log(l.board+l.i)")
  url=$(echo "$line" | node -e "const l=JSON.parse(require('fs').readFileSync(0,'utf8'));console.log(l.url)")
  ext="${url##*.}"
  case "$ext" in jpg|jpeg|png|webp) ;; *) ext="jpg";; esac
  curl -sL --max-time 30 "$url" -o "$OUT/$board.$ext" && echo "$n $board ok" || echo "$n $board FAIL"
done < <(node -e "const a=require('/home/z/my-project/research/pinterest/_download_list.json');a.forEach(x=>console.log(JSON.stringify(x)))")
echo "DONE"
