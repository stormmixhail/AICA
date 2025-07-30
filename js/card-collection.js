// 名片广场和商机广场页面交互脚本
document.addEventListener('DOMContentLoaded', function() {
const cardCollectionApp = new Vue({
    el: '#app',
    data: {
        activeTab: 'cards',  // 默认显示名片广场
        cardsFilter: 'all',  // 名片筛选选项
        screenWidth: window.innerWidth,
        isMobile: false,
            
            // 搜索和筛选相关 - 商机广场
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
            
            // 过滤选项 - 商机广场
            filters: [
                { id: 'hot', name: '热门' },
                { id: 'new', name: '最新' },
                { id: 'recommended', name: '推荐' },
                { id: 'following', name: '关注' }
            ],
            
            // 行业分类 - 商机广场
            categories: [
                { id: 'tech', name: '科技创新', icon: 'img/category-tech.svg' },
                { id: 'finance', name: '金融投资', icon: 'img/category-finance.svg' },
                { id: 'retail', name: '零售消费', icon: 'img/category-retail.svg' },
                { id: 'health', name: '医疗健康', icon: 'img/category-health.svg' },
                { id: 'education', name: '教育培训', icon: 'img/category-tech.svg' },
                { id: 'manufacture', name: '智能制造', icon: 'img/category-tech.svg' },
            ],
            
            // 视频数据 - 商机广场
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
                
                return results;
        }
    },
    
    mounted() {
            console.log("卡片和商机页面已加载");
            
        // 检查URL参数，确定应该显示哪个标签
            this.checkUrlParams();
        
        // 检测设备类型和屏幕大小
        this.checkDevice();
        
        // 监听窗口大小变化
        window.addEventListener('resize', this.handleResize);
        
        // 应用移动端优化
        if (this.isMobile) {
            this.optimizeForMobile();
        }
        
        // 初始化动画效果
        this.initAnimations();
        
            // 添加键盘事件监听
        document.addEventListener('keydown', this.handleKeyDown);
        
            // 优化滚动性能
            this.optimizeScrolling();
    },
    
    beforeDestroy() {
        // 清理事件监听器
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.handleKeyDown);
        },
        
        methods: {
            // 检查URL参数
            checkUrlParams() {
                const urlParams = new URLSearchParams(window.location.search);
                
                // 检查标签参数
                const tab = urlParams.get('tab');
                if (tab === 'marketplace') {
                    this.activeTab = 'marketplace';
                } else if (tab === 'cards') {
                    this.activeTab = 'cards';
                }
                
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
            
        // 设置当前激活的标签
        setActiveTab(tab) {
            this.activeTab = tab;
            
            // 更新URL参数，但不重新加载页面
            const url = new URL(window.location);
            url.searchParams.set('tab', tab);
            window.history.pushState({}, '', url);
            
            // 触发内容变化的过渡动画
            this.$nextTick(() => {
                this.animateTabChange();
            });
                
                // 更新页面标题
                document.title = tab === 'cards' ? '名片广场 - AICA' : '商机广场 - AICA';
        },
        
        // 返回上一页
        goBack() {
            window.history.back();
        },
        
        // 检测设备类型和屏幕大小
        checkDevice() {
            // 更新屏幕宽度
            this.screenWidth = window.innerWidth;
            
            // 判断是否为移动设备
                this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || this.screenWidth <= 768;
        },
        
        // 处理窗口大小变化
        handleResize() {
                // 更新屏幕宽度
                this.screenWidth = window.innerWidth;
                
                // 重新检测设备类型
                this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || this.screenWidth <= 768;
            
                // 根据设备类型应用不同的优化
            if (this.isMobile) {
                this.optimizeForMobile();
            }
                
                // 确保滚动正常工作
                this.ensureScrollability();
        },
        
            // 移动端优化
        optimizeForMobile() {
                // 添加移动端特定的类
                document.body.classList.add('mobile');
                
                // 调整滚动条和交互元素尺寸
                document.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.style.minWidth = '80px';
                });
                
                // 确保页面可以滚动
                this.ensureScrollability();
            },
            
            // 确保页面可以滚动
            ensureScrollability() {
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
                
                // 如果视频播放器是打开的，阻止背景滚动
                if (this.videoPlayerActive) {
                    document.body.style.overflow = 'hidden';
            }
        },
        
            // 名片广场功能：查看名片
        viewCard(name) {
                console.log('查看名片:', name);
                // 这里可以添加导航到名片详情页面的代码
                window.location.href = `personal-card.html?name=${encodeURIComponent(name)}`;
        },
        
            // 名片广场功能：与名片对话
        chatWithCard(name) {
                console.log('与TA对话:', name);
                // 这里可以添加导航到对话页面的代码
                window.location.href = `agent-chat.html?name=${encodeURIComponent(name)}`;
        },
        
            // 商机广场功能：打开视频播放器
            openVideoPlayer(video) {
                // 设置当前视频
                this.currentVideo = video;
            
                // 显示播放器
            this.videoPlayerActive = true;
            
                // 阻止背景滚动
            document.body.style.overflow = 'hidden';
            
                // 更新URL参数
                if (video.id) {
                    const url = new URL(window.location);
                    url.searchParams.set('video', video.id);
                    window.history.pushState({}, '', url);
                }
        },
        
        // 关闭视频播放器
        closeVideoPlayer() {
                // 暂停视频播放
                const videoElement = document.querySelector('.video-player video');
                if (videoElement) {
                    videoElement.pause();
            }
            
                // 隐藏播放器
            this.videoPlayerActive = false;
            
                // 恢复滚动
            document.body.style.overflow = '';
                
                // 移除URL中的视频参数
                const url = new URL(window.location);
                url.searchParams.delete('video');
                window.history.pushState({}, '', url);
        },
        
            // 处理模态框背景点击
        handleModalClick(event) {
            if (event.target.classList.contains('video-modal')) {
                this.closeVideoPlayer();
            }
        },
        
            // 处理键盘事件
        handleKeyDown(event) {
                // Esc键关闭播放器
            if (event.key === 'Escape' && this.videoPlayerActive) {
                this.closeVideoPlayer();
            }
        },
        
            // 商机广场功能：设置筛选条件
            setFilter(filterId) {
                this.currentFilter = filterId;
                this.updateUrl();
            },
            
            // 商机广场功能：按行业分类筛选
            filterByCategory(categoryId) {
                this.currentCategory = categoryId;
                this.updateUrl();
                
                // 如果当前不在商机广场标签，切换到商机广场
                if (this.activeTab !== 'marketplace') {
                    this.setActiveTab('marketplace');
                }
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
        },
        
        // 初始化动画效果
        initAnimations() {
                // 使用GSAP动画库来添加一些平滑过渡效果
                if (window.gsap) {
                    try {
                        // 淡入卡片
                gsap.from('.profile-card', {
                    opacity: 0,
                            y: 30,
                    stagger: 0.1,
                    duration: 0.5,
                            ease: 'power2.out'
                });
                
                        // 视频卡片淡入
                gsap.from('.video-card', {
                    opacity: 0,
                            y: 30,
                    stagger: 0.1,
                    duration: 0.5,
                    ease: 'power2.out',
                            delay: 0.2
                });
                    } catch (e) {
                        console.error('GSAP动画初始化失败:', e);
                    }
            }
        },
        
        // 标签切换动画
        animateTabChange() {
                if (window.gsap) {
                    try {
                const activePanel = document.querySelector('.content-panel.active');
                
                        if (activePanel) {
                            // 隐藏所有面板
                            gsap.set('.content-panel', { display: 'none' });
                            
                            // 显示激活的面板并添加动画
                            gsap.set(activePanel, { display: 'block' });
                            gsap.from(activePanel.children, {
                        opacity: 0,
                                y: 20,
                                stagger: 0.1,
                                duration: 0.5,
                                ease: 'power2.out'
                            });
                        }
                    } catch (e) {
                        console.error('标签切换动画失败:', e);
                    }
                }
            },
            
            // 优化滚动性能
            optimizeScrolling() {
                // 防止重绘/回流
                const debounce = (fn, delay) => {
                    let timer = null;
                    return function(...args) {
                        if (timer) clearTimeout(timer);
                        timer = setTimeout(() => fn.apply(this, args), delay);
                    };
                };
                
                // 优化滚动事件
                window.addEventListener('scroll', debounce(() => {
                    // 可以添加滚动相关的处理
                }, 100));
                
                // 图片懒加载
                if ('IntersectionObserver' in window) {
                    try {
                        const imgOptions = {
                            threshold: 0.1,
                            rootMargin: '0px 0px 100px 0px'
                        };
                        
                        const imgObserver = new IntersectionObserver((entries, observer) => {
                            entries.forEach(entry => {
                                if (entry.isIntersecting) {
                                    const img = entry.target;
                                    const src = img.getAttribute('data-src');
                                    
                                    if (src) {
                                        img.src = src;
                                        img.removeAttribute('data-src');
                                    }
                                    
                                    observer.unobserve(img);
                                }
                            });
                        }, imgOptions);
                        
                        document.querySelectorAll('img[data-src]').forEach(img => {
                            imgObserver.observe(img);
                        });
                    } catch (e) {
                        console.error('懒加载初始化失败:', e);
            }
        }
    }
        }
    });
}); 