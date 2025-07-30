#!/bin/bash

# 安装必要的工具
# 请确保已安装 npm、puppeteer-screenshot-cli 和 ImageMagick
# npm install -g puppeteer-screenshot-cli
# brew install imagemagick (Mac OS)
# apt-get install imagemagick (Linux)

# 设置目录
HTML_DIR="../"
OUTPUT_DIR="./"

# 创建GIF图片
create_gif() {
    local html_file="$1"
    local output_file="$2"
    local width="$3"
    local height="$4"
    local delay="$5"
    local frames="$6"
    
    echo "正在从 $html_file 创建 GIF 图片..."
    
    # 创建临时目录
    local temp_dir="temp_frames"
    mkdir -p "$temp_dir"
    
    # 生成多个帧
    for ((i=1; i<=$frames; i++)); do
        echo "生成帧 $i/$frames..."
        puppeteer-screenshot --url "file://$(pwd)/$html_file" --output "$temp_dir/frame_$i.png" --width "$width" --height "$height" --wait 300
        sleep 0.5
    done
    
    # 使用ImageMagick合成GIF
    echo "合成GIF..."
    convert -delay "$delay" -loop 0 "$temp_dir/frame_*.png" "$output_file"
    
    # 清理临时文件
    rm -rf "$temp_dir"
    
    echo "GIF图片已创建: $output_file"
}

# 创建商机广场图标GIF
create_gif "${HTML_DIR}/marketplace-icon.html" "${OUTPUT_DIR}/marketplace-icon.gif" 200 200 20 10

# 创建连接断层图标GIF
create_gif "${HTML_DIR}/connectivity-icon.html" "${OUTPUT_DIR}/connectivity-icon.gif" 200 200 20 10

# 创建便捷分发图标GIF
create_gif "${HTML_DIR}/share-icon.html" "${OUTPUT_DIR}/share-icon.gif" 200 200 20 10

# 创建商务连接操作系统图标GIF
create_gif "${HTML_DIR}/business-connection-system.html" "${OUTPUT_DIR}/business-connection-system.gif" 300 300 20 10

echo "所有GIF图片创建完成！"

# 注意：此脚本需要执行权限
# chmod +x create-gifs.sh
