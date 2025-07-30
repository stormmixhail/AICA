// 数字人导航栏和新闻部分交互逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 导航链接点击事件
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有导航链接的active类
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            
            // 给当前点击的链接添加active类
            this.classList.add('active');
            
            // 获取目标section的ID
            const targetId = this.getAttribute('href').substring(1);
            
            // 隐藏所有section
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            // 显示目标section
            document.getElementById(targetId).style.display = 'block';
            
            // 平滑滚动到顶部
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
    
    // 子导航点击事件
    const subnavLinks = document.querySelectorAll('.subnav-link');
    const newsBanners = document.querySelectorAll('.news-banner');
    
    subnavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有子导航链接的active类
            subnavLinks.forEach(subLink => subLink.classList.remove('active'));
            
            // 给当前点击的链接添加active类
            this.classList.add('active');
            
            // 获取目标新闻类别
            const targetCategory = this.getAttribute('data-category');
            
            // 隐藏所有新闻横幅
            newsBanners.forEach(banner => {
                banner.classList.remove('active');
            });
            
            // 显示目标新闻横幅
            document.getElementById(`${targetCategory}-news`).classList.add('active');
        });
    });
    
    // 横幅轮播功能
    const bannerSliders = document.querySelectorAll('.banner-slider');
    
    bannerSliders.forEach(slider => {
        const slides = slider.querySelectorAll('.banner-slide');
        const prevBtn = slider.nextElementSibling.querySelector('.prev');
        const nextBtn = slider.nextElementSibling.querySelector('.next');
        const indicators = slider.nextElementSibling.querySelectorAll('.indicator');
        let currentIndex = 0;
        
        // 初始化指示器点击事件
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentIndex = index;
                updateSlider();
            });
        });
        
        // 上一张按钮点击事件
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider();
        });
        
        // 下一张按钮点击事件
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
        });
        
        // 自动轮播
        let autoSlide = setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
        }, 5000);
        
        // 鼠标悬停时暂停自动轮播
        slider.addEventListener('mouseenter', () => {
            clearInterval(autoSlide);
        });
        
        // 鼠标离开时恢复自动轮播
        slider.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateSlider();
            }, 5000);
        });
        
        // 更新轮播状态
        function updateSlider() {
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            slides[currentIndex].classList.add('active');
            indicators[currentIndex].classList.add('active');
        }
    });
    
    // 案例部分 - 切换标签
    const caseTabs = document.querySelectorAll('.case-tab');
    const videoPairs = document.querySelectorAll('.video-pair');
    
    caseTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有标签的active类
            caseTabs.forEach(t => t.classList.remove('active'));
            
            // 给当前点击的标签添加active类
            this.classList.add('active');
            
            // 获取目标视频类别
            const targetCategory = this.getAttribute('data-category');
            
            // 隐藏所有视频组
            videoPairs.forEach(pair => {
                pair.classList.remove('active');
            });
            
            // 显示目标视频组
            document.getElementById(`${targetCategory}-video-pair`).classList.add('active');
        });
    });
    
    // 视频选择按钮点击事件
    const videoSelectBtns = document.querySelectorAll('.video-select-btn');
    
    videoSelectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 获取当前按钮所在的列
            const column = this.closest('.video-column');
            
            // 移除同列中所有按钮的active类
            column.querySelectorAll('.video-select-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // 给当前点击的按钮添加active类
            this.classList.add('active');
            
            // 获取视频信息
            const videoSrc = this.getAttribute('data-video');
            const videoTitle = this.getAttribute('data-title');
            const videoDesc = this.getAttribute('data-desc');
            const thumbSrc = this.getAttribute('data-thumb');
            
            // 获取当前列中的特色视频卡片
            const featuredCard = column.querySelector('.featured-video-card');
            
            // 更新特色视频卡片信息
            featuredCard.setAttribute('data-video', videoSrc);
            featuredCard.setAttribute('data-title', videoTitle);
            featuredCard.setAttribute('data-desc', videoDesc);
            
            // 更新特色视频缩略图
            featuredCard.querySelector('img').src = thumbSrc;
            
            // 更新特色视频标题和描述
            featuredCard.querySelector('h3').textContent = videoTitle;
            featuredCard.querySelector('p').textContent = videoDesc;
        });
    });
    
    // 视频卡片点击事件，打开弹窗播放视频
    const videoCards = document.querySelectorAll('.featured-video-card');
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalTitle = document.querySelector('.modal-title');
    const modalDesc = document.querySelector('.modal-desc');
    const modalClose = document.querySelector('.modal-close');
    
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            // 获取视频信息
            const videoSrc = this.getAttribute('data-video');
            const videoTitle = this.getAttribute('data-title');
            const videoDesc = this.getAttribute('data-desc');
            
            // 设置视频源
            const videoSource = modalVideo.querySelector('source');
            videoSource.src = videoSrc;
            modalVideo.load();
            
            // 设置标题和描述
            modalTitle.textContent = videoTitle;
            modalDesc.textContent = videoDesc;
            
            // 显示弹窗
            videoModal.classList.add('active');
            
            // 播放视频
            modalVideo.play();
        });
    });
    
    // 关闭弹窗
    modalClose.addEventListener('click', () => {
        videoModal.classList.remove('active');
        modalVideo.pause();
    });
    
    // 点击弹窗外部关闭弹窗
    videoModal.addEventListener('click', function(e) {
        if (e.target === this) {
            videoModal.classList.remove('active');
            modalVideo.pause();
        }
    });
    
    // 数据可视化动画 - 为标准页面表格添加
    function initDataBars() {
        const standardSection = document.getElementById('standard-section');
        if (!standardSection) return;
        
        // 监听标准部分的可见性
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 当标准部分进入视口时，添加数据条动画
                    const aicaCells = document.querySelectorAll('.aica-cell');
                    const ordinaryCells = document.querySelectorAll('.ordinary-cell');
                    
                    // AICA 单元格数据条动画
                    aicaCells.forEach(cell => {
                        // 创建数据条
                        const dataBar = document.createElement('div');
                        dataBar.className = 'data-bar';
                        cell.appendChild(dataBar);
                        
                        // 根据内容设置宽度（示例：检查是否包含百分比或数值）
                        const text = cell.textContent.trim();
                        let width = '80%'; // 默认宽度
                        
                        if (text.includes('%')) {
                            const match = text.match(/(\d+)/);
                            if (match) {
                                const percent = parseInt(match[0]);
                                width = Math.min(percent, 100) + '%';
                            }
                        } else if (text.includes('自动') || text.includes('全') || text.includes('智能')) {
                            width = '90%';
                        } else if (text.includes('基础') || text.includes('简单')) {
                            width = '60%';
                        }
                        
                        // 延迟添加宽度以实现动画效果
                        setTimeout(() => {
                            dataBar.style.width = width;
                        }, 300);
                    });
                    
                    // 普通单元格数据条动画
                    ordinaryCells.forEach(cell => {
                        // 创建数据条
                        const dataBar = document.createElement('div');
                        dataBar.className = 'data-bar';
                        cell.appendChild(dataBar);
                        
                        // 根据内容设置宽度
                        const text = cell.textContent.trim();
                        let width = '40%'; // 默认宽度
                        
                        if (text.includes('%')) {
                            const match = text.match(/(\d+)/);
                            if (match) {
                                const percent = parseInt(match[0]);
                                width = Math.min(percent, 50) + '%';
                            }
                        } else if (text.includes('不支持') || text.includes('无')) {
                            width = '20%';
                        } else if (text.includes('基础') || text.includes('简单')) {
                            width = '40%';
                        }
                        
                        // 延迟添加宽度以实现动画效果
                        setTimeout(() => {
                            dataBar.style.width = width;
                        }, 300);
                    });
                    
                    // 取消观察，避免重复触发动画
                    observer.disconnect();
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(standardSection);
    }
    
    // 初始化数据可视化
    initDataBars();
}); 