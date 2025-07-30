# AICA前端项目

这是AICA项目的前端代码，已配置为可在GitHub Pages上部署。

## 部署说明

1. 创建一个新的GitHub仓库
2. 将`frontend`目录下的所有文件上传到该仓库
3. 在GitHub仓库设置中，启用GitHub Pages：
   - 转到仓库的"Settings" > "Pages"
   - 在"Source"部分，选择"main"分支和"/(root)"目录
   - 点击"Save"按钮

## 本地开发

可以使用以下命令在本地运行项目：

```bash
npm install
npm start
```

## 注意事项

- 本项目使用了本地Vue.js（`js/lib/vue.min.js`）
- 使用`mock-api.js`模拟后端API响应
- 所有依赖都已本地化，无需后端支持 