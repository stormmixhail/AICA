#!/bin/bash

# 创建视频目录（如果不存在）
mkdir -p placeholders

# 创建主场景视频占位符
echo "创建主场景视频占位符..."
touch placeholders/digital-human-emotional.mp4
touch placeholders/digital-human-showcase.mp4
touch placeholders/digital-human-core.mp4
touch placeholders/digital-human-process.mp4
touch placeholders/digital-human-final.mp4

# 创建热点视频占位符
echo "创建热点视频占位符..."
touch placeholders/digital-human-livestream.mp4
touch placeholders/digital-human-ip.mp4
touch placeholders/digital-human-knowledge.mp4
touch placeholders/digital-human-service.mp4

echo "占位符创建完成！"
echo "注意：这些只是占位符文件，实际部署时需要替换为真实视频文件。" 