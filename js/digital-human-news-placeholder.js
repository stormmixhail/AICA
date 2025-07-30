/**
 * 数字人新闻图片占位生成器
 * 在正式图片设计完成之前，使用Canvas绘制临时的数据可视化图像作为配图
 */

document.addEventListener('DOMContentLoaded', function() {
    // 检查是否有图片加载失败
    const setupImageErrorHandling = () => {
        // 处理列表页图片
        const newsImages = document.querySelectorAll('.news-image img');
        newsImages.forEach(img => {
            // 图片加载出错时生成占位图
            img.addEventListener('error', function() {
                generateNewsPlaceholder(this);
            });
            
            // 检查图片是否已经加载失败
            if (!img.complete || img.naturalHeight === 0) {
                generateNewsPlaceholder(img);
            }
        });
        
        // 处理详情弹窗中的图片
        const handleModalImages = () => {
            // 处理顶部大图
            const detailImage = document.querySelector('.news-detail-image');
            if (detailImage && (!detailImage.complete || detailImage.naturalHeight === 0)) {
                generateNewsPlaceholder(detailImage, true);
            }
            
            // 处理内容中的图片
            const contentImages = document.querySelectorAll('.news-content img, .content-image');
            contentImages.forEach(img => {
                if (!img.complete || img.naturalHeight === 0) {
                    generateNewsPlaceholder(img, true);
                }
            });
        };
        
        // 监听弹窗打开事件
        const app = document.getElementById('digital-human-news-app').__vue__;
        if (app) {
            // 使用Vue实例的watch功能监听showNewsModal变化
            const originalOpenNewsDetail = app.openNewsDetail;
            app.openNewsDetail = function(news) {
                originalOpenNewsDetail.call(app, news);
                // 等待DOM更新后处理图片
                setTimeout(handleModalImages, 100);
            };
        }
        
        // 观察DOM变化，处理新增的图片
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // 元素节点
                            const newImages = node.querySelectorAll('img');
                            newImages.forEach(img => {
                                img.addEventListener('error', function() {
                                    generateNewsPlaceholder(this, true);
                                });
                                
                                if (!img.complete || img.naturalHeight === 0) {
                                    generateNewsPlaceholder(img, true);
                                }
                            });
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    };
    
    // 初始化
    setupImageErrorHandling();

    // 生成新闻占位图
    function generateNewsPlaceholder(imgElement, isDetail = false) {
        let articleTitle = '';
        
        // 根据不同位置获取标题信息
        if (isDetail) {
            const modalHeader = document.querySelector('.news-modal-header h3');
            if (modalHeader) {
                articleTitle = modalHeader.textContent;
            }
        } else {
            const newsItem = imgElement.closest('.news-item');
            if (newsItem) {
                const titleElement = newsItem.querySelector('.news-title');
                if (titleElement) {
                    articleTitle = titleElement.textContent;
                }
            }
        }
        
        if (!articleTitle) {
            // 如果无法获取标题，使用默认标题
            articleTitle = '数字人技术';
        }
        
        const parentDiv = imgElement.parentElement;
        const canvas = document.createElement('canvas');
        
        // 设置Canvas尺寸
        canvas.width = 800;
        canvas.height = 450;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.classList.add('placeholder-canvas');
        
        // 如果是img在内容中，保留原来的类名
        if (imgElement.classList.contains('content-image')) {
            canvas.classList.add('content-image');
        } else if (imgElement.classList.contains('news-detail-image')) {
            canvas.classList.add('news-detail-image');
        }
        
        // 替换图片元素
        parentDiv.replaceChild(canvas, imgElement);
        
        // 根据文章标题选择不同的占位图样式
        if (articleTitle.includes('400亿元') || articleTitle.includes('市场规模')) {
            drawMarketSizeChart(canvas);
        } else if (articleTitle.includes('114.4万家') || articleTitle.includes('企业数量')) {
            drawCompanyDistributionMap(canvas);
        } else if (articleTitle.includes('应用场景') || articleTitle.includes('三大方向')) {
            drawApplicationScenarios(canvas);
        } else if (articleTitle.includes('技术标准') || articleTitle.includes('标准体系')) {
            drawTechStandardSystem(canvas);
        } else if (articleTitle.includes('黄金期') || articleTitle.includes('政策')) {
            drawPolicyIndustrySync(canvas);
        } else if (articleTitle.includes('千亿')) {
            drawGrowthCurve(canvas);
        } else if (articleTitle.includes('指导意见')) {
            drawPolicyDocumentCover(canvas);
        } else {
            // 默认数字人科技背景
            drawTechBackground(canvas);
        }
    }
    
    // 市场规模图表
    function drawMarketSizeChart(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // 更亮的背景
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, '#f0f9ff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // 添加亮度更高的边框
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 3;
        ctx.strokeRect(5, 5, width - 10, height - 10);
        
        // 更大更醒目的标题
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 32px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('数字人核心市场规模', width/2, 50);
        
        // 数据值 - 更大更醒目
        ctx.fillStyle = '#3498db';
        ctx.font = 'bold 56px Arial, sans-serif';
        ctx.fillText('400亿元', width/2, height/2);
        
        // 绘制柱状图 - 更高对比度的颜色
        const barWidth = 60;
        const barSpacing = 40;
        const barValues = [180, 280, 340, 400];
        const years = ['2022', '2023', '2024', '2025'];
        const baseY = height - 80;
        
        for (let i = 0; i < barValues.length; i++) {
            const barHeight = barValues[i] * 0.5;
            const x = width/2 - ((barValues.length/2) * (barWidth + barSpacing)) + i * (barWidth + barSpacing);
            
            // 高对比度渐变柱
            const barGradient = ctx.createLinearGradient(x, baseY - barHeight, x, baseY);
            barGradient.addColorStop(0, '#2980b9');
            barGradient.addColorStop(1, '#3498db');
            ctx.fillStyle = barGradient;
            
            // 绘制柱子
            ctx.fillRect(x, baseY - barHeight, barWidth, barHeight);
            
            // 柱子上方文本 - 更加醒目
            ctx.fillStyle = '#2c3e50';
            ctx.font = 'bold 16px Arial, sans-serif';
            ctx.fillText(barValues[i] + '亿', x + barWidth/2, baseY - barHeight - 10);
            
            // 柱子下方年份 - 更加醒目
            ctx.fillStyle = '#34495e';
            ctx.font = 'bold 14px Arial, sans-serif';
            ctx.fillText(years[i], x + barWidth/2, baseY + 20);
        }
        
        // 添加水印
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.font = 'bold 20px Arial, sans-serif';
        ctx.fillText('数字人新闻', width - 100, height - 20);
    }
    
    // 企业分布地图
    function drawCompanyDistributionMap(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // 渐变背景
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#f5f7fa');
        gradient.addColorStop(1, '#f1f4fb');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // 标题
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 24px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('数字人企业区域分布', width/2, 50);
        
        // 绘制简化中国地图轮廓
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.bezierCurveTo(250, 150, 350, 180, 450, 180);
        ctx.bezierCurveTo(500, 180, 550, 200, 580, 250);
        ctx.bezierCurveTo(600, 280, 580, 320, 550, 350);
        ctx.bezierCurveTo(500, 380, 450, 370, 400, 350);
        ctx.bezierCurveTo(350, 330, 300, 320, 250, 300);
        ctx.bezierCurveTo(220, 280, 200, 250, 200, 200);
        ctx.closePath();
        ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
        ctx.fill();
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制主要城市点
        const cities = [
            { name: '北京', x: 450, y: 200, size: 15, percent: '28%' },
            { name: '上海', x: 500, y: 280, size: 12, percent: '22%' },
            { name: '广州', x: 400, y: 320, size: 10, percent: '18%' },
            { name: '深圳', x: 420, y: 340, size: 8, percent: '15%' }
        ];
        
        cities.forEach(city => {
            // 城市亮点
            ctx.beginPath();
            ctx.arc(city.x, city.y, city.size, 0, Math.PI * 2);
            
            const pointGradient = ctx.createRadialGradient(
                city.x, city.y, 0,
                city.x, city.y, city.size
            );
            pointGradient.addColorStop(0, 'rgba(142, 68, 173, 0.9)');
            pointGradient.addColorStop(1, 'rgba(142, 68, 173, 0.1)');
            
            ctx.fillStyle = pointGradient;
            ctx.fill();
            
            // 城市名称和百分比
            ctx.fillStyle = '#2c3e50';
            ctx.font = 'bold 14px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(city.name, city.x, city.y - city.size - 5);
            ctx.font = '12px Arial, sans-serif';
            ctx.fillText(city.percent, city.x, city.y + city.size + 15);
        });
        
        // 添加总数
        ctx.fillStyle = '#8e44ad';
        ctx.font = 'bold 32px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('114.4万家', width/2, height - 80);
        ctx.font = '16px Arial, sans-serif';
        ctx.fillText('数字人相关企业总数', width/2, height - 60);
    }
    
    // 应用场景三角形
    function drawApplicationScenarios(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // 渐变背景
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#fff7f0');
        gradient.addColorStop(1, '#f7f9ff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // 标题
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 24px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('数字人应用场景三大方向', width/2, 50);
        
        // 绘制三角形连接线
        const centerX = width/2;
        const centerY = height/2;
        const radius = 150;
        
        const points = [
            { x: centerX, y: centerY - radius }, // 上
            { x: centerX - radius * 0.866, y: centerY + radius * 0.5 }, // 左下
            { x: centerX + radius * 0.866, y: centerY + radius * 0.5 }  // 右下
        ];
        
        // 连接线
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
        ctx.lineTo(points[2].x, points[2].y);
        ctx.closePath();
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 中心圆
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
        ctx.fillStyle = '#f39c12';
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('数字人', centerX, centerY);
        
        // 三个顶点的圆和文字
        const directions = ['媒介数字人', '服务数字人', '行业数字人'];
        const descriptions = ['虚拟主播/内容创作', '智能客服/个人助手', '垂直领域专家'];
        const colors = ['#3498db', '#e74c3c', '#2ecc71'];
        
        for (let i = 0; i < points.length; i++) {
            // 圆
            ctx.beginPath();
            ctx.arc(points[i].x, points[i].y, 40, 0, Math.PI * 2);
            ctx.fillStyle = colors[i];
            ctx.fill();
            
            // 方向名称
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(directions[i], points[i].x, points[i].y);
            
            // 描述
            ctx.fillStyle = '#2c3e50';
            ctx.font = '14px Arial, sans-serif';
            ctx.fillText(descriptions[i], points[i].x, points[i].y + 60);
        }
    }
    
    // 技术标准体系图
    function drawTechStandardSystem(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // 渐变背景
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#f5f7fa');
        gradient.addColorStop(1, '#f2f6fd');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // 标题
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 24px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('数字人技术标准体系', width/2, 50);
        
        // 绘制三层架构
        const layerHeight = 80;
        const layerWidth = 500;
        const startY = 120;
        const startX = (width - layerWidth) / 2;
        const layers = ['交互规范', '数据安全', '伦理准则'];
        const descriptions = [
            '语音、语义、表情的响应与准确率',
            '用户数据加密与匿名化处理',
            '禁止虚假宣传与诱导性营销'
        ];
        
        for (let i = 0; i < layers.length; i++) {
            // 层背景
            ctx.beginPath();
            ctx.roundRect(startX, startY + i * (layerHeight + 20), layerWidth, layerHeight, 10);
            
            const layerGradient = ctx.createLinearGradient(
                startX, startY + i * (layerHeight + 20),
                startX + layerWidth, startY + i * (layerHeight + 20)
            );
            layerGradient.addColorStop(0, '#34495e');
            layerGradient.addColorStop(1, '#2c3e50');
            
            ctx.fillStyle = layerGradient;
            ctx.fill();
            
            // 层标题
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 20px Arial, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(layers[i], startX + 20, startY + i * (layerHeight + 20) + 30);
            
            // 层描述
            ctx.fillStyle = '#ecf0f1';
            ctx.font = '16px Arial, sans-serif';
            ctx.fillText(descriptions[i], startX + 20, startY + i * (layerHeight + 20) + 60);
        }
        
        // 添加"标准化"文字
        ctx.save();
        ctx.translate(width - 80, height / 2);
        ctx.rotate(Math.PI / 2);
        ctx.fillStyle = 'rgba(44, 62, 80, 0.2)';
        ctx.font = 'bold 60px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('标准化', 0, 0);
        ctx.restore();
    }
    
    // 政策与产业协同图
    function drawPolicyIndustrySync(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // 渐变背景
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#fef9e7');
        gradient.addColorStop(1, '#f9f4f4');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // 标题
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 24px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('数字人产业发展黄金期', width/2, 50);
        
        // 绘制两个圆环
        const radius = 120;
        const leftCenterX = width/2 - radius - 20;
        const rightCenterX = width/2 + radius + 20;
        const centerY = height/2;
        
        // 左圆环 - 政策
        ctx.beginPath();
        ctx.arc(leftCenterX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(52, 73, 94, 0.1)';
        ctx.fill();
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 右圆环 - 产业
        ctx.beginPath();
        ctx.arc(rightCenterX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(241, 196, 15, 0.1)';
        ctx.fill();
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 圆环重叠部分
        ctx.beginPath();
        ctx.arc(leftCenterX + 40, centerY, radius - 40, 0, Math.PI * 2);
        ctx.arc(rightCenterX - 40, centerY, radius - 40, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(230, 126, 34, 0.2)';
        ctx.fill();
        
        // 标签文字
        ctx.fillStyle = '#34495e';
        ctx.font = 'bold 24px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('政策支持', leftCenterX, centerY - 20);
        ctx.fillStyle = '#f39c12';
        ctx.fillText('产业发展', rightCenterX, centerY - 20);
        
        // 中心"黄金期"文字
        ctx.fillStyle = '#e67e22';
        ctx.font = 'bold 36px Arial, sans-serif';
        ctx.fillText('黄金期', width/2, centerY + 10);
        
        // 上升曲线背景
        ctx.beginPath();
        ctx.moveTo(100, height - 100);
        ctx.bezierCurveTo(
            width/3, height - 150,
            width*2/3, height - 180,
            width - 100, height - 80
        );
        ctx.strokeStyle = 'rgba(230, 126, 34, 0.3)';
        ctx.lineWidth = 10;
        ctx.stroke();
    }
    
    // 市场规模增长曲线图
    function drawGrowthCurve(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // 渐变背景
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#fff9f4');
        gradient.addColorStop(1, '#fff5f5');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // 标题
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 24px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('数字人市场规模增长预测', width/2, 50);
        
        // 坐标轴
        const padding = 80;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const baseY = height - padding;
        
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, baseY);
        ctx.lineTo(width - padding, baseY);
        ctx.strokeStyle = '#7f8c8d';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 年份标签
        const years = ['2023', '2024', '2025'];
        for (let i = 0; i < years.length; i++) {
            const x = padding + (chartWidth / 2) * i;
            
            // 年份文本
            ctx.fillStyle = '#7f8c8d';
            ctx.font = '16px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(years[i], x, baseY + 30);
            
            // 刻度线
            ctx.beginPath();
            ctx.moveTo(x, baseY);
            ctx.lineTo(x, baseY + 10);
            ctx.strokeStyle = '#7f8c8d';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // 增长曲线
        const curvePoints = [
            { x: padding, y: baseY - chartHeight * 0.3 },
            { x: padding + chartWidth / 2, y: baseY - chartHeight * 0.6 },
            { x: padding + chartWidth, y: baseY - chartHeight * 0.8 }
        ];
        
        ctx.beginPath();
        ctx.moveTo(curvePoints[0].x, curvePoints[0].y);
        ctx.bezierCurveTo(
            curvePoints[0].x + 100, curvePoints[0].y - 50,
            curvePoints[1].x - 100, curvePoints[1].y,
            curvePoints[1].x, curvePoints[1].y
        );
        ctx.bezierCurveTo(
            curvePoints[1].x + 100, curvePoints[1].y,
            curvePoints[2].x - 100, curvePoints[2].y + 50,
            curvePoints[2].x, curvePoints[2].y
        );
        
        // 曲线渐变
        const curveGradient = ctx.createLinearGradient(
            padding, baseY,
            padding, padding
        );
        curveGradient.addColorStop(0, '#e74c3c');
        curveGradient.addColorStop(1, '#e67e22');
        
        ctx.strokeStyle = curveGradient;
        ctx.lineWidth = 5;
        ctx.stroke();
        
        // 数据点
        for (const point of curvePoints) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#e74c3c';
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // 千亿标记
        ctx.fillStyle = '#c0392b';
        ctx.font = 'bold 36px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('千亿', curvePoints[2].x, curvePoints[2].y - 30);
        
        // 元宇宙、AI等小图标
        const icons = [
            { text: 'AI', x: width * 0.25, y: height * 0.3 },
            { text: '元宇宙', x: width * 0.5, y: height * 0.2 },
            { text: '产业链', x: width * 0.75, y: height * 0.25 }
        ];
        
        for (const icon of icons) {
            // 图标背景
            ctx.beginPath();
            ctx.arc(icon.x, icon.y, 20, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(52, 152, 219, 0.7)';
            ctx.fill();
            
            // 图标文字
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(icon.text, icon.x, icon.y);
        }
    }
    
    // 政策文件封面
    function drawPolicyDocumentCover(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // 渐变背景
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#f5f5f5');
        gradient.addColorStop(1, '#e8f0fe');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // 文件封面外框
        const padding = 50;
        ctx.beginPath();
        ctx.rect(padding, padding, width - padding * 2, height - padding * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = 'rgba(231, 76, 60, 0.7)';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 上部红色标题栏
        ctx.beginPath();
        ctx.rect(padding, padding, width - padding * 2, 80);
        ctx.fillStyle = '#c0392b';
        ctx.fill();
        
        // 文件标题
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('数字人产业发展指导意见', width/2, padding + 45);
        
        // 文件编号
        ctx.fillStyle = '#7f8c8d';
        ctx.font = '14px Arial, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('工信部发〔2025〕10号', width - padding - 20, padding + 120);
        
        // 中央图案
        const centerY = height/2 + 20;
        
        // 人形轮廓
        ctx.beginPath();
        ctx.arc(width/2, centerY - 60, 50, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(width/2, centerY - 10);
        ctx.bezierCurveTo(
            width/2 - 40, centerY + 40,
            width/2 - 20, centerY + 100,
            width/2, centerY + 120
        );
        ctx.bezierCurveTo(
            width/2 + 20, centerY + 100,
            width/2 + 40, centerY + 40,
            width/2, centerY - 10
        );
        ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
        ctx.fill();
        
        // 数字网格背景
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 5; j++) {
                if (Math.random() > 0.7) {
                    const x = width/3 + i * 40;
                    const y = centerY - 100 + j * 40;
                    ctx.fillStyle = `rgba(52, 152, 219, ${Math.random() * 0.3})`;
                    ctx.fillText('0', x, y);
                    ctx.fillText('1', x + 10, y + 10);
                }
            }
        }
        
        // 底部部委标识
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 18px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('工业和信息化部', width/2, height - padding - 40);
        ctx.font = '16px Arial, sans-serif';
        ctx.fillText('2025年4月', width/2, height - padding - 20);
    }
    
    // 通用科技背景
    function drawTechBackground(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // 更亮的背景
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, '#f5f5ff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // 添加清晰的边框
        ctx.strokeStyle = '#4285F4';
        ctx.lineWidth = 3;
        ctx.strokeRect(5, 5, width - 10, height - 10);
        
        // 绘制明亮的标题
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 36px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('数字人技术', width/2, height/2 - 20);
        
        // 添加说明文字
        ctx.fillStyle = '#555555';
        ctx.font = 'normal 24px Arial, sans-serif';
        ctx.fillText('AI-Generated Placeholder', width/2, height/2 + 20);
        
        // 绘制数字人图标
        ctx.beginPath();
        ctx.arc(width/2, height/2 - 100, 60, 0, Math.PI * 2);
        ctx.fillStyle = '#4285F4';
        ctx.fill();
        
        // 绘制人形
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(width/2, height/2 - 120, 20, 0, Math.PI * 2); // 头部
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(width/2, height/2 - 100);
        ctx.lineTo(width/2, height/2 - 60); // 身体
        ctx.lineTo(width/2 - 30, height/2 - 40); // 左腿
        ctx.moveTo(width/2, height/2 - 60);
        ctx.lineTo(width/2 + 30, height/2 - 40); // 右腿
        ctx.moveTo(width/2, height/2 - 90);
        ctx.lineTo(width/2 - 30, height/2 - 70); // 左手
        ctx.moveTo(width/2, height/2 - 90);
        ctx.lineTo(width/2 + 30, height/2 - 70); // 右手
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 5;
        ctx.stroke();
        
        // 添加点状连接效果 - 更加醒目
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 4 + 2;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(66, 133, 244, ${Math.random() * 0.5 + 0.2})`;
            ctx.fill();
        }
        
        // 添加连线
        ctx.strokeStyle = 'rgba(66, 133, 244, 0.3)';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < 10; i++) {
            const x1 = Math.random() * width;
            const y1 = Math.random() * height;
            const x2 = Math.random() * width;
            const y2 = Math.random() * height;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        // 添加水印
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.font = 'bold 20px Arial, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('数字人新闻', width - 20, height - 20);
    }
}); 