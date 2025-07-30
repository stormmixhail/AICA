#!/bin/bash
echo "启动本地服务器..."
echo "请在浏览器中访问: http://localhost:8000/digital-human-new.html"
echo "按 Ctrl+C 停止服务"
python3 -m http.server 8000 || python -m SimpleHTTPServer 8000
