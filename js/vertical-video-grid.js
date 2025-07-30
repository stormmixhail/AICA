/**
 * 竖版视频瀑布流功能
 * 实现视频过滤、点击弹窗播放视频功能
 */
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有视频卡片
    const videoCards = document.querySelectorAll('.video-card');
    // 获取视频模态框
    const videoModal = document.getElementById('videoModal');
    // 获取模态框中的视频元素
    const modalVideo = document.getElementById('modalVideo');
    // 获取模态框中的标题和描述
    const modalTitle = document.querySelector('.modal-title');
    const modalDesc = document.querySelector('.modal-desc');
    // 获取关闭按钮
    const closeButton = document.querySelector('.modal-close');
    // 获取过滤按钮
    const filterButtons = document.querySelectorAll('.filter-btn');

    // 视频卡片点击事件
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            // 获取视频数据
            const videoSrc = this.getAttribute('data-video');
            const videoTitle = this.getAttribute('data-title');
            const videoDesc = this.getAttribute('data-desc');
            
            // 设置模态框内容
            modalVideo.src = videoSrc;
            modalTitle.textContent = videoTitle;
            modalDesc.textContent = videoDesc;
            
            // 显示模态框
            videoModal.classList.add('active');
            
            // 加载并播放视频
            modalVideo.load();
            modalVideo.play();
        });
    });

    // 关闭模态框
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            closeVideoModal();
        });
    }

    // 点击模态框背景关闭
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });

    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });

    // 关闭模态框函数
    function closeVideoModal() {
        videoModal.classList.remove('active');
        modalVideo.pause();
        modalVideo.currentTime = 0;
    }

    // 视频过滤功能
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有过滤按钮的active类
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // 为当前按钮添加active类
            this.classList.add('active');
            
            // 获取过滤类别
            const filterValue = this.getAttribute('data-filter');
            
            // 过滤视频卡片
            videoCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 初始布局优化 - 确保视频卡片高度按9:16比例设置
    function optimizeLayout() {
        // 针对不同屏幕宽度调整布局
        if (window.innerWidth <= 767) {
            // 小屏幕设备 - 单列显示
            const containerWidth = document.querySelector('.video-grid').offsetWidth;
            videoCards.forEach(card => {
                const width = containerWidth;
                const height = width * (16/9); // 9:16的反比
                card.style.height = `${height}px`;
            });
        } else {
            // 大屏幕设备 - 多列显示
            const containerWidth = document.querySelector('.video-grid').offsetWidth;
            const columns = window.innerWidth >= 1200 ? 3 : 2;
            const cardWidth = (containerWidth / columns) - (columns > 1 ? 15 : 0); // 考虑间距
            videoCards.forEach(card => {
                const height = cardWidth * (16/9); // 9:16的反比
                card.style.height = `${height}px`;
            });
        }
    }

    // 首次加载和窗口大小变化时优化布局
    optimizeLayout();
    window.addEventListener('resize', optimizeLayout);
}); 