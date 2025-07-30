#!/bin/bash

# 替换GSAP引用
find . -name "*.html" -type f -exec sed -i '' 's|<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js"></script>|<script src="js/lib/gsap.min.js"></script>|g' {} \;

# 替换ScrollTrigger引用
find . -name "*.html" -type f -exec sed -i '' 's|<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/ScrollTrigger.min.js"></script>|<script src="js/lib/ScrollTrigger.min.js"></script>|g' {} \;

# 替换替代版本的GSAP引用
find . -name "*.html" -type f -exec sed -i '' 's|<script src="https://cdn.jsdelivr.net/npm/gsap@3.11.4/dist/gsap.min.js"></script>|<script src="js/lib/gsap.min.js"></script>|g' {} \;

# 替换替代版本的ScrollTrigger引用
find . -name "*.html" -type f -exec sed -i '' 's|<script src="https://cdn.jsdelivr.net/npm/scrolltrigger@1.0.0/dist/ScrollTrigger.min.js"></script>|<script src="js/lib/ScrollTrigger.min.js"></script>|g' {} \;

echo "替换完成！所有JavaScript库引用已更新为本地路径。" 