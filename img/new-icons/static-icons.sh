#!/bin/bash

# 创建静态PNG图标
# 请确保已安装 wkhtmltoimage 或 Chrome/Puppeteer
# brew install wkhtmltopdf (Mac OS)
# apt-get install wkhtmltopdf (Linux)

# 设置目录
OUTPUT_DIR="./static"
mkdir -p "$OUTPUT_DIR"

# 使用wkhtmltoimage生成PNG图片
create_png() {
    local html_file="$1"
    local output_file="$2"
    local width="$3"
    local height="$4"
    
    echo "正在从 $html_file 创建 PNG 图片..."
    wkhtmltoimage --width "$width" --height "$height" --quality 100 "$html_file" "$output_file"
    echo "PNG图片已创建: $output_file"
}

# 创建商机广场图标PNG
create_png "marketplace-icon.html" "${OUTPUT_DIR}/marketplace-icon.png" 200 200

# 创建连接断层图标PNG
create_png "connectivity-icon.html" "${OUTPUT_DIR}/connectivity-icon.png" 200 200

# 创建便捷分发图标PNG
create_png "share-icon.html" "${OUTPUT_DIR}/share-icon.png" 200 200

# 创建商务连接操作系统图标PNG
create_png "business-connection-system.html" "${OUTPUT_DIR}/business-connection-system.png" 300 300

echo "所有PNG图片创建完成！"

# 注意：此脚本需要执行权限
# chmod +x static-icons.sh
