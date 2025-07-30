// 数字人新闻页面增强脚本

document.addEventListener('DOMContentLoaded', function() {
    // 图片资源预加载
    const preloadImages = () => {
        // 预加载新闻图片
        const newsImages = [
            'img/news/tech-news1.jpg',
            'img/news/tech-news2.jpg', 
            'img/news/tech-news3.jpg',
            'img/news/silicon-news1.jpg',
            'img/news/silicon-news2.jpg',
            'img/news/industry-news1.jpg',
            'img/news/industry-news2.jpg',
            'img/news/application-news1.jpg',
            'img/news/application-news2.jpg'
        ];
        
        // 预加载视频缩略图
        const videoThumbs = [
            'img/videos/tech-thumb1.jpg',
            'img/videos/tech-thumb2.jpg',
            'img/videos/tech-thumb3.jpg',
            'img/videos/tech-thumb4.jpg',
            'img/videos/customer-thumb1.jpg',
            'img/videos/customer-thumb2.jpg',
            'img/videos/customer-thumb3.jpg',
            'img/videos/customer-thumb4.jpg',
            'img/videos/interaction-thumb1.jpg',
            'img/videos/interaction-thumb2.jpg',
            'img/videos/interaction-thumb3.jpg',
            'img/videos/interaction-thumb4.jpg',
            'img/videos/silicon-thumb1.jpg',
            'img/videos/silicon-thumb2.jpg',
            'img/videos/silicon-thumb3.jpg',
            'img/videos/silicon-thumb4.jpg'
        ];
        
        [...newsImages, ...videoThumbs].forEach(src => {
            const img = new Image();
            img.src = src;
        });
    };
    
    // 添加滚动动画
    const initScrollAnimation = () => {
        // 检测是否支持IntersectionObserver
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            // 监听新闻项和视频卡片
            document.querySelectorAll('.news-item, .case-video-card').forEach(item => {
                observer.observe(item);
            });
        } else {
            // 回退支持：为所有元素添加动画类
            document.querySelectorAll('.news-item, .case-video-card').forEach(item => {
                item.classList.add('animate-in');
            });
        }
    };
    
    // 视频预加载功能
    const setupLazyVideoLoading = () => {
        // 当用户点击视频缩略图时，才加载视频
        document.querySelectorAll('.case-video-card').forEach(card => {
            card.addEventListener('click', function() {
                const videoUrl = this.getAttribute('data-video-url');
                if (videoUrl) {
                    const videoElement = document.querySelector('.video-player');
                    if (videoElement) {
                        // 设置视频源并预加载
                        videoElement.src = videoUrl;
                        videoElement.load();
                    }
                }
            });
        });
    };
    
    // 添加深色/浅色模式切换
    const setupThemeToggle = () => {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                const isDarkMode = document.body.classList.contains('dark-mode');
                localStorage.setItem('digital-human-theme', isDarkMode ? 'dark' : 'light');
                
                // 更新图标
                const icon = this.querySelector('i');
                if (icon) {
                    icon.className = isDarkMode ? 'bi bi-sun' : 'bi bi-moon';
                }
            });
            
            // 初始化主题
            const savedTheme = localStorage.getItem('digital-human-theme');
            if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.body.classList.add('dark-mode');
                const icon = themeToggle.querySelector('i');
                if (icon) {
                    icon.className = 'bi bi-sun';
                }
            }
        }
    };
    
    // 添加图片和视频放大效果
    const setupImageZoom = () => {
        document.querySelectorAll('.news-image img, .video-thumbnail img').forEach(img => {
            img.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.transition = 'transform 0.5s ease';
            });
            
            img.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    };
    
    // 高亮显示特色技术文章
    const highlightFeaturedTech = () => {
        document.querySelectorAll('.news-item').forEach(item => {
            const title = item.querySelector('.news-title');
            if (title && (
                title.textContent.includes('Toolwiz') || 
                title.textContent.includes('HeyGem') || 
                title.textContent.includes('DUIX')
            )) {
                item.classList.add('tech-highlight');
                
                // 添加特色标签
                const tag = document.createElement('span');
                tag.className = 'featured-tag';
                tag.textContent = '特色技术';
                item.querySelector('.news-image').appendChild(tag);
            }
        });
    };
    
    // 初始化所有功能
    const init = () => {
        preloadImages();
        setupThemeToggle();
        initScrollAnimation();
        setupLazyVideoLoading();
        setupImageZoom();
        
        // 在Vue渲染完成后执行
        setTimeout(() => {
            highlightFeaturedTech();
        }, 500);
    };
    
    // 启动初始化
    init();
});

// 添加CSS动态加载功能
function loadCSS(src) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = src;
    document.head.appendChild(link);
}

// 按需加载额外的CSS资源
if (window.innerWidth <= 768) {
    loadCSS('css/digital-human-news-mobile.css?v=' + new Date().getTime());
} 