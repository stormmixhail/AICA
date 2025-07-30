#!/bin/bash

# 替换所有HTML文件中的Vue.js CDN引用为本地引用
find . -name "*.html" -type f -exec sed -i '' 's|<script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>|<script src="js/lib/vue.min.js"></script>|g' {} \;

echo "替换完成！所有Vue.js引用已更新为本地路径。" 