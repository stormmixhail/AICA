#!/bin/bash

# 修复SVG文件脚本
# 作用：清理损坏的SVG文件，删除Mac系统生成的._前缀文件，并确保SVG文件正确加载

# 设置工作目录
IMG_DIR="img"

# 1. 删除Mac系统生成的._前缀文件
echo "正在删除Mac系统生成的._前缀文件..."
find $IMG_DIR -name "._*" -delete

# 2. 检查并修复损坏的SVG文件
echo "正在检查损坏的SVG文件..."
for svg_file in $(find $IMG_DIR -name "*.svg"); do
  # 检查文件大小是否小于100字节（可能是损坏的文件）
  file_size=$(stat -f%z "$svg_file")
  if [ $file_size -lt 100 ]; then
    echo "发现损坏的SVG文件: $svg_file (大小: $file_size 字节)"
    
    # 备份损坏的文件
    cp "$svg_file" "${svg_file}.bak"
    
    # 根据文件名创建基本的SVG内容
    filename=$(basename "$svg_file")
    filename_no_ext="${filename%.*}"
    
    # 创建基本SVG内容
    cat > "$svg_file" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  <defs>
    <linearGradient id="${filename_no_ext}Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4285F4"/>
      <stop offset="100%" stop-color="#34A853"/>
    </linearGradient>
  </defs>
  <g fill="none" stroke="url(#${filename_no_ext}Gradient)" stroke-width="2">
    <rect x="10" y="14" width="44" height="36" rx="2" stroke-width="2"/>
    <circle cx="32" cy="32" r="12" stroke-width="2"/>
    <path d="M20 26h24" stroke-width="2"/>
    <path d="M20 32h24" stroke-width="2"/>
    <path d="M20 38h24" stroke-width="2"/>
  </g>
</svg>
EOF
    echo "已修复SVG文件: $svg_file"
  fi
done

# 3. 更新HTML文件中的SVG引用，添加版本号参数
echo "正在更新HTML文件中的SVG引用..."
current_date=$(date +%Y%m%d)
for html_file in $(find . -name "*.html"); do
  # 使用sed替换SVG引用，添加版本号参数
  sed -i '' "s/\.svg\"/\.svg?v=$current_date\"/g" "$html_file"
  echo "已更新HTML文件: $html_file"
done

# 4. 更新JS文件中的SVG引用
echo "正在更新JS文件中的SVG引用..."
for js_file in $(find js -name "*.js"); do
  # 使用sed替换SVG引用，添加版本号参数
  sed -i '' "s/\.svg'/\.svg?v=$current_date'/g" "$js_file"
  echo "已更新JS文件: $js_file"
done

echo "SVG文件修复完成！"
echo "请重新启动服务器并清除浏览器缓存以查看更改。"

# 使脚本可执行: chmod +x fix-svg-files.sh 