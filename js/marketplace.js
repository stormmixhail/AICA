// 商机广场页面交互脚本
const marketplaceApp = new Vue({
    el: '#marketplace-app',
    data: {
        // 搜索和筛选相关
        searchKeyword: '',
        currentFilter: 'hot',
        currentCategory: 'all',
        
        // 视频播放器相关
        videoPlayerActive: false,
        currentVideo: {
            id: '',
            title: '',
            author: '',
            authorAvatar: '',
            views: '',
            time: '',
            description: '',
            videoSrc: '',
            category: ''
        },
        
        // 过滤选项
        filters: [
            { id: 'hot', name: '热门' },
            { id: 'new', name: '最新' },
            { id: 'recommended', name: '推荐' },
            { id: 'following', name: '关注' }
        ],
        
        // 行业分类
        categories: [
            { id: 'tech', name: '科技创新', icon: 'img/category-tech.svg' },
            { id: 'finance', name: '金融投资', icon: 'img/category-finance.svg' },
            { id: 'retail', name: '零售消费', icon: 'img/category-retail.svg' },
            { id: 'health', name: '医疗健康', icon: 'img/category-health.svg' },
            { id: 'education', name: '教育培训', icon: 'img/category-tech.svg' },
            { id: 'manufacture', name: '智能制造', icon: 'img/category-tech.svg' },
        ],
        
        // 视频数据
        videos: [
            {
                id: 'v001',
                title: 'AI如何赋能传统企业数字化转型',
                author: '谭云杰',
                authorAvatar: 'img/profile-avatar.jpg',
                views: '1.2万',
                time: '3天前',
                description: '本视频详细讲解了AI技术如何帮助传统企业加速数字化转型，提高运营效率和创新能力。通过多个实际案例分析，展示了AI在客户服务、流程自动化、决策支持等领域的应用价值和实施策略。',
                thumbnail: 'img/videos/customer-thumb1.jpg',
                videoSrc: 'videos/placeholders/digital-human-core.mp4',
                category: 'tech',
                trending: true
            },
            {
                id: 'v002',
                title: '数字名片如何提升销售转化效率',
                author: '张明',
                authorAvatar: 'img/default-avatar.svg',
                views: '8.5千',
                time: '1周前',
                description: '从传统名片到数字名片的演进，本视频分析了数字名片如何帮助销售人员提高客户转化率。通过实时数据追踪、智能跟进提醒和个性化内容推送，数字名片可以显著提升销售效率和客户满意度。',
                thumbnail: 'img/videos/customer-thumb2.jpg',
                videoSrc: 'videos/placeholders/digital-human-emotional.mp4',
                category: 'tech',
                trending: false
            },
            {
                id: 'v003',
                title: '商业网络构建策略与实践',
                author: '王婷',
                authorAvatar: 'img/default-avatar.svg',
                views: '7.8千',
                time: '2周前',
                description: '本视频分享了有效构建和维护商业网络的核心策略和最佳实践。从初期接触到深度合作，从线上社交到线下活动，全方位解析如何打造持久有价值的商业关系网络。',
                thumbnail: 'img/videos/customer-thumb1.jpg',
                videoSrc: 'videos/placeholders/digital-human-final.mp4',
                category: 'finance',
                trending: true
            },
            {
                id: 'v004',
                title: '数字化人脉管理最佳实践',
                author: '李强',
                authorAvatar: 'img/default-avatar.svg',
                views: '6.3千',
                time: '3周前',
                description: '在信息爆炸的时代，如何有效管理日益增长的人脉资源？本视频介绍了数字化人脉管理的工具、方法和策略，帮助职场人士和企业家更高效地组织、分类和利用自己的社交资源。',
                thumbnail: 'img/videos/customer-thumb2.jpg',
                videoSrc: 'videos/placeholders/digital-human-social.mp4',
                category: 'retail',
                trending: false
            },
            {
                id: 'v005',
                title: '如何打造个人品牌影响力',
                author: '刘彦',
                authorAvatar: 'img/default-avatar.svg',
                views: '5.7千',
                time: '1个月前',
                description: '个人品牌是职场竞争的关键因素。本视频从定位、传播、内容创作和社交媒体运营等方面，分享了如何建立专业、独特且有影响力的个人品牌，以及如何将个人品牌转化为实际价值。',
                thumbnail: 'img/videos/customer-thumb1.jpg',
                videoSrc: 'videos/placeholders/digital-human-core.mp4',
                category: 'health',
                trending: true
            },
            {
                id: 'v006',
                title: '智能名片在跨国商务中的应用',
                author: '陈明',
                authorAvatar: 'img/profile-avatar.jpg',
                views: '4.9千',
                time: '1个月前',
                description: '跨国商务面临语言、文化和时区等多重挑战，智能名片如何助力跨国业务发展？本视频探讨了智能名片的多语言支持、异步沟通和文化适应性功能，以及在国际商务场景中的实际应用案例。',
                thumbnail: 'img/videos/customer-thumb2.jpg',
                videoSrc: 'videos/placeholders/digital-human-emotional.mp4',
                category: 'finance',
                trending: true
            }
        ]
    },
    
    computed: {
        // 根据当前筛选条件过滤视频
        filteredVideos() {
            let results = [...this.videos];
            
            // 按关键词过滤
            if (this.searchKeyword) {
                const keyword = this.searchKeyword.toLowerCase();
                results = results.filter(video => 
                    video.title.toLowerCase().includes(keyword) || 
                    video.author.toLowerCase().includes(keyword) ||
                    video.description.toLowerCase().includes(keyword)
                );
            }
            
            // 按类别过滤
            if (this.currentCategory !== 'all') {
                results = results.filter(video => video.category === this.currentCategory);
            }
            
            // 按标签过滤
            if (this.currentFilter === 'hot') {
                results = results.filter(video => video.trending);
            } else if (this.currentFilter === 'new') {
                // 假设这是按时间排序
                results.sort((a, b) => {
                    const timeA = this.parseTime(a.time);
                    const timeB = this.parseTime(b.time);
                    return timeA - timeB;
                });
            }
            // 其他过滤逻辑...
            
            return results;
        }
    },
    
    mounted() {
        // 初始化页面
        this.initPage();
        
        // 检查URL参数
        this.checkUrlParams();
        
        // 添加键盘事件监听
        document.addEventListener('keydown', this.handleKeyDown);
        
        // 添加滚动优化
        this.optimizeScrolling();
    },
    
    beforeDestroy() {
        // 移除事件监听器
        document.removeEventListener('keydown', this.handleKeyDown);
    },
    
    methods: {
        // 初始化页面
        initPage() {
            // 检测设备类型并优化
            this.detectDevice();
            
            // 预加载缩略图
            this.preloadThumbnails();
        },
        
        // 检测设备类型
        detectDevice() {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                document.body.classList.add('mobile');
            }
        },
        
        // 预加载缩略图
        preloadThumbnails() {
            this.videos.forEach(video => {
                const img = new Image();
                img.src = video.thumbnail;
            });
        },
        
        // 检查URL参数
        checkUrlParams() {
            const urlParams = new URLSearchParams(window.location.search);
            
            // 检查分类参数
            const category = urlParams.get('category');
            if (category && this.categories.some(cat => cat.id === category)) {
                this.currentCategory = category;
            }
            
            // 检查过滤参数
            const filter = urlParams.get('filter');
            if (filter && this.filters.some(f => f.id === filter)) {
                this.currentFilter = filter;
            }
            
            // 检查搜索参数
            const search = urlParams.get('search');
            if (search) {
                this.searchKeyword = search;
            }
            
            // 检查视频ID参数（用于直接打开视频）
            const videoId = urlParams.get('video');
            if (videoId) {
                const video = this.videos.find(v => v.id === videoId);
                if (video) {
                    this.$nextTick(() => {
                        this.openVideoPlayer(video);
                    });
                }
            }
        },
        
        // 返回上一页
        goBack() {
            window.history.back();
        },
        
        // 设置筛选条件
        setFilter(filterId) {
            this.currentFilter = filterId;
            this.updateUrl();
        },
        
        // 按行业分类筛选
        filterByCategory(categoryId) {
            this.currentCategory = categoryId;
            this.updateUrl();
        },
        
        // 执行搜索
        search() {
            this.updateUrl();
        },
        
        // 更新URL参数
        updateUrl() {
            const url = new URL(window.location);
            
            // 更新分类参数
            if (this.currentCategory !== 'all') {
                url.searchParams.set('category', this.currentCategory);
            } else {
                url.searchParams.delete('category');
            }
            
            // 更新过滤参数
            if (this.currentFilter !== 'hot') {
                url.searchParams.set('filter', this.currentFilter);
            } else {
                url.searchParams.delete('filter');
            }
            
            // 更新搜索参数
            if (this.searchKeyword) {
                url.searchParams.set('search', this.searchKeyword);
            } else {
                url.searchParams.delete('search');
            }
            
            // 更新URL，但不重新加载页面
            window.history.pushState({}, '', url);
        },
        
        // 打开视频播放器
        openVideoPlayer(video) {
            // 设置当前视频
            this.currentVideo = { ...video };
            
            // 显示播放器
            this.videoPlayerActive = true;
            
            // 防止滚动穿透
            document.body.style.overflow = 'hidden';
            
            // 更新URL参数
            const url = new URL(window.location);
            url.searchParams.set('video', video.id);
            window.history.pushState({}, '', url);
            
            // 添加浏览记录（可以用于推荐系统）
            this.trackVideoView(video);
        },
        
        // 关闭视频播放器
        closeVideoPlayer() {
            // 隐藏播放器
            this.videoPlayerActive = false;
            
            // 恢复滚动
            document.body.style.overflow = '';
            
            // 移除URL中的视频参数
            const url = new URL(window.location);
            url.searchParams.delete('video');
            window.history.pushState({}, '', url);
            
            // 暂停视频播放
            const videoElement = document.querySelector('.video-player video');
            if (videoElement) {
                videoElement.pause();
            }
        },
        
        // 处理键盘事件
        handleKeyDown(event) {
            // Esc键关闭播放器
            if (event.key === 'Escape' && this.videoPlayerActive) {
                this.closeVideoPlayer();
            }
        },
        
        // 优化滚动性能
        optimizeScrolling() {
            // 这里可以添加懒加载、滚动优化等代码
        },
        
        // 记录视频观看
        trackVideoView(video) {
            // 这里可以添加统计代码
            console.log('View tracked for:', video.title);
        },
        
        // 解析时间文本
        parseTime(timeString) {
            if (timeString.includes('天前')) {
                return parseInt(timeString) || 0;
            } else if (timeString.includes('周前')) {
                return parseInt(timeString) * 7 || 0;
            } else if (timeString.includes('个月前')) {
                return parseInt(timeString) * 30 || 0;
            }
            return 0;
        }
    }
});

// 当文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否需要创建一个新的CSS文件
    checkAndCreateCssFile();
    
    // 如果需要，这里可以添加更多初始化代码
});

// 检查并创建CSS文件
function checkAndCreateCssFile() {
    const cssLink = document.querySelector('link[href="css/marketplace.css"]');
    if (cssLink) {
        // 如果CSS文件链接存在，但文件可能不存在
        // 在生产环境中，应该通过服务器端检查文件是否存在
        console.log('Marketplace CSS file is linked.');
    }
}

// 注册全局错误处理
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Marketplace error:', message, source, lineno, error);
    // 可以添加错误上报代码
    return true; // 防止默认错误处理
}; 