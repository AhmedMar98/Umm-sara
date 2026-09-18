#!/bin/bash
# سحب أكواد المواقع الفائزة من awwwards لقراءة أنماطها
set -u
OUT="/home/z/my-project/research/code-samples"
mkdir -p "$OUT"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

fetch_site() {
  local name="$1" url="$2"
  echo "=== $name ==="
  curl -sL --max-time 40 -A "$UA" "$url" -o "$OUT/$name.html" && echo "html: $(wc -c < "$OUT/$name.html") bytes"
  # استخراج روابط CSS من <link rel=stylesheet>
  grep -oE 'href="[^"]+\.css[^"]*"' "$OUT/$name.html" 2>/dev/null | sed 's/href="//;s/"$//' | head -3 > "$OUT/$name-css-urls.txt"
  # تحويل النسبية إلى مطلقة وسحب أول 3 ملفات
  local i=0
  while read -r csspath; do
    [ -z "$csspath" ] && continue
    case "$csspath" in
      http*) full="$csspath" ;;
      //*) full="https:$csspath" ;;
      /*) full="$(echo "$url" | grep -oE 'https?://[^/]+')$csspath" ;;
      *) full="$url$csspath" ;;
    esac
    i=$((i+1))
    curl -sL --max-time 30 -A "$UA" "$full" -o "$OUT/$name-$i.css" && echo "css$i: $(wc -c < "$OUT/$name-$i.css") bytes ($full)"
    [ $i -ge 3 ] && break
  done < "$OUT/$name-css-urls.txt"
  echo ""
}

fetch_site noho "https://noho.ink/"
fetch_site white-desert "https://white-desert.com/"
fetch_site cerebrium "https://cerebrium.ai/"
fetch_site lxl "https://www.lxlcreative.co.uk/"
fetch_site aspen "https://www.aspensearch.com/"
fetch_site warmnfuzzy "https://www.warmnfuzzy.tv/"
echo "DONE"
