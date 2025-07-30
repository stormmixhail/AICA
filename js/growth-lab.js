// 增长实验室页面交互脚本
const growthLabApp = new Vue({
    el: '#growth-lab-app',
    data: {
        // 内容筛选
        activeFilter: 'all',
        searchQuery: '',
        activeTag: null,
        
        // 分页
        currentPage: 1,
        itemsPerPage: 6,
        
        // 轮播
        currentSlide: 0,
        
        // 订阅
        email: '',
        
        // 图表实例
        growthChart: null,
        acquisitionCostChart: null,
        
        // 热门标签
        popularTags: [
            { id: 'ai', name: 'AI营销' },
            { id: 'content', name: '内容策略' },
            { id: 'redbook', name: '小红书获客' },
            { id: 'conversion', name: '转化率优化' },
            { id: 'social', name: '社交媒体' },
            { id: 'user-profile', name: '用户画像' },
            { id: 'ecommerce', name: '电商运营' },
            { id: 'roi', name: '营销ROI' }
        ],
        
        // 内容列表
        contentItems: [
            {
                id: 'vuca-social-trends',
                type: 'insight',
                title: 'VUCA时代社交用户五大特征',
                subtitle: '深度解析当前市场环境下催生的社交用户新趋势及其对品牌营销的启示',
                category: '趋势洞察',
                date: '2024-07-28',
                imageUrl: 'img/social-trends/vuca-social-trends.svg?v=20250728',
                featured: true,
                url: 'article-vuca-social-trends.html',
                excerpt: '在市场大环境"VUCA化"凸显的背景下，社交用户呈现出AI里AI气、即时满足、圈层分化、情感代偿、虚实消融五大特征，深刻影响着品牌营销策略与消费者互动方式。',
                readTime: '15分钟',
                tags: ['social', 'user-profile', 'ai']
            },
            { 
                id: 'newrank2024-whitepaper', 
                type: 'whitepaper', 
                title: '《新榜2024线上获客白皮书》',
                featured: true,
                date: '2024-07-20',
                readTime: '18分钟',
                tags: ['content', 'roi', 'conversion']
            },
            { 
                id: 'insight-user-profile-ai', 
                type: 'insight', 
                title: '用户画像双驱动模型：打造精准营销新范式',
                featured: true,
                date: '2024-07-15',
                readTime: '15分钟',
                tags: ['user-profile', 'ai', 'conversion']
            },
            { 
                id: 'method-high-conversion-notes', 
                type: 'method', 
                title: '内容营销实战：3步写出高转化笔记',
                featured: true,
                date: '2024-07-22',
                readTime: '10分钟',
                tags: ['content', 'conversion', 'redbook']
            },
            { 
                id: 'method-redbook-content', 
                type: 'method', 
                title: '5个步骤打造小红书爆款内容',
                featured: false,
                date: '2024-07-18',
                readTime: '12分钟',
                tags: ['redbook', 'content', 'conversion']
            },
            { 
                id: 'case-education', 
                type: 'case', 
                title: '如何为教育机构节省60%广告预算？',
                featured: false,
                date: '2024-04-15',
                readTime: '8分钟',
                tags: ['roi', 'conversion']
            },
            { 
                id: 'method-comment-analysis', 
                type: 'method', 
                title: 'AI分析千条评论提炼爆款话术',
                featured: false,
                date: '2024-03-28',
                readTime: '12分钟',
                tags: ['ai', 'content']
            },
            { 
                id: 'case-ai-engine', 
                type: 'case', 
                title: '从0到1：打造AI增长引擎',
                featured: false,
                date: '2024-02-19',
                readTime: '15分钟',
                tags: ['ai', 'roi']
            },
            { 
                id: 'insight-competition', 
                type: 'insight', 
                title: '获客内卷时代，企业应如何应对？',
                featured: false,
                date: '2024-01-25',
                readTime: '10分钟',
                tags: ['social', 'conversion']
            },
            { 
                id: 'whitepaper-flywheel', 
                type: 'whitepaper', 
                title: '《增长飞轮：从获客到价值倍增》',
                featured: false,
                date: '2023-12-10',
                readTime: '20分钟',
                tags: ['roi', 'conversion']
            },
            { 
                id: 'method-capital-view', 
                type: 'method', 
                title: '资本视角下的获客系统构建法',
                featured: false,
                date: '2023-11-18',
                readTime: '14分钟',
                tags: ['roi']
            }
        ]
    },
    
    computed: {
        // 根据筛选条件和搜索词过滤内容
        filteredContent() {
            let result = this.contentItems;
            
            // 按类型筛选
            if (this.activeFilter !== 'all') {
                result = result.filter(item => item.type === this.activeFilter);
            }
            
            // 按标签筛选
            if (this.activeTag) {
                result = result.filter(item => 
                    item.tags && item.tags.includes(this.activeTag)
                );
            }
            
            // 搜索过滤
            if (this.searchQuery.trim()) {
                const query = this.searchQuery.trim().toLowerCase();
                result = result.filter(item => 
                    item.title.toLowerCase().includes(query) || 
                    (item.excerpt && item.excerpt.toLowerCase().includes(query)) ||
                    item.id.toLowerCase().includes(query)
                );
            }
            
            // 按日期排序
            result.sort((a, b) => {
                const dateA = new Date(a.date || '2024-01-01');
                const dateB = new Date(b.date || '2024-01-01');
                return dateB - dateA;
            });
            
            return result;
        },
        
        // 当前页面显示的内容
        paginatedContent() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredContent.slice(start, end);
        },
        
        // 总页数
        totalPages() {
            return Math.ceil(this.filteredContent.length / this.itemsPerPage);
        },
        
        // 当前筛选标题
        filterTitle() {
            if (this.activeTag) {
                const tag = this.popularTags.find(t => t.id === this.activeTag);
                return tag ? `${tag.name}相关内容` : '筛选内容';
            }
            
            switch(this.activeFilter) {
                case 'all': return '所有内容';
                case 'case': return '案例分析';
                case 'whitepaper': return '白皮书';
                case 'method': return '方法论';
                case 'insight': return '行业洞察';
                default: return '内容列表';
            }
        },
        
        // 轮播内容
        insightSlides() {
            return this.contentItems.filter(item => !item.featured).slice(0, 6);
        }
    },
    
    watch: {
        // 监听筛选器和搜索条件变化，重置分页
        activeFilter() {
            this.currentPage = 1;
        },
        searchQuery() {
            this.currentPage = 1;
        },
        activeTag() {
            this.currentPage = 1;
        }
    },
    
    mounted() {
        // 检查URL参数，设置初始筛选条件
        const urlParams = new URLSearchParams(window.location.search);
        const filter = urlParams.get('filter');
        if (filter && ['all', 'case', 'whitepaper', 'method', 'insight'].includes(filter)) {
            this.activeFilter = filter;
        }
        
        const tag = urlParams.get('tag');
        if (tag && this.popularTags.some(t => t.id === tag)) {
            this.activeTag = tag;
        }
        
        // 动画效果：内容卡片渐入
        this.animateContentCards();
        
        // 初始化图表
        this.$nextTick(() => {
            this.initGrowthChart();
            this.initAcquisitionCostChart();
        });
        
        // 监听滚动事件，实现延迟加载和滚动动画
        window.addEventListener('scroll', this.handleScroll);
    },
    
    beforeDestroy() {
        // 清理事件监听和图表实例
        window.removeEventListener('scroll', this.handleScroll);
        
        if (this.growthChart) {
            this.growthChart.destroy();
        }
        
        if (this.acquisitionCostChart) {
            this.acquisitionCostChart.destroy();
        }
    },
    
    methods: {
        // 返回上一页
        goBack() {
            window.location.href = 'ai-marketing.html';
        },
        
        // 设置筛选条件
        setFilter(filter) {
            this.activeFilter = filter;
            this.activeTag = null;
            
            // 更新URL参数，便于分享特定筛选结果
            const url = new URL(window.location);
            url.searchParams.set('filter', filter);
            url.searchParams.delete('tag');
            window.history.pushState({}, '', url);
        },
        
        // 按标签筛选
        filterByTag(tagId) {
            this.activeTag = tagId;
            this.activeFilter = 'all';
            
            // 更新URL参数
            const url = new URL(window.location);
            url.searchParams.set('tag', tagId);
            url.searchParams.set('filter', 'all');
            window.history.pushState({}, '', url);
            
            // 滚动到内容列表
            this.$nextTick(() => {
                document.querySelector('.content-grid').scrollIntoView({ behavior: 'smooth' });
            });
        },
        
        // 检查内容是否可见（筛选和分页）
        isContentVisible(type, id) {
            // 根据当前活跃的过滤条件检查内容是否应该显示
            if (this.activeFilter !== 'all' && this.activeFilter !== type) {
                return false;
            }
            
            // 根据标签过滤
            if (this.activeTag) {
                const item = this.contentItems.find(item => item.id === id || ('article-' + item.id) === id);
                if (!item || !item.tags || !item.tags.includes(this.activeTag)) {
                    return false;
                }
            }
            
            // 搜索过滤
            if (this.searchQuery.trim()) {
                const query = this.searchQuery.trim().toLowerCase();
                const item = this.contentItems.find(item => item.id === id || ('article-' + item.id) === id);
                
                if (!item) return false;
                
                const titleMatch = item.title.toLowerCase().includes(query);
                const excerptMatch = item.excerpt ? item.excerpt.toLowerCase().includes(query) : false;
                const idMatch = item.id.toLowerCase().includes(query);
                
                if (!titleMatch && !excerptMatch && !idMatch) {
                    return false;
                }
            }
            
            return true;
        },
        
        // 下一页
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.scrollToTop();
                this.animateContentCards();
            }
        },
        
        // 上一页
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.scrollToTop();
                this.animateContentCards();
            }
        },
        
        // 轮播控制 - 下一个
        nextSlide() {
            const sliderItems = document.querySelectorAll('.insight-card');
            if (!sliderItems.length) return;
            
            // 实现轮播效果
            sliderItems.forEach(item => {
                item.style.transition = 'transform 0.4s ease';
                item.style.transform = 'translateX(-100%)';
            });
            
            setTimeout(() => {
                // 把第一个元素移到最后
                const slider = document.querySelector('.insights-slider');
                const firstItem = slider.firstElementChild;
                slider.appendChild(firstItem);
                
                // 重置位置
                sliderItems.forEach(item => {
                    item.style.transition = 'none';
                    item.style.transform = 'translateX(0)';
                });
            }, 400);
        },
        
        // 轮播控制 - 上一个
        prevSlide() {
            const sliderItems = document.querySelectorAll('.insight-card');
            if (!sliderItems.length) return;
            
            // 先把最后一个元素移到最前
            const slider = document.querySelector('.insights-slider');
            const lastItem = slider.lastElementChild;
            
            // 设置初始位置
            lastItem.style.transition = 'none';
            lastItem.style.transform = 'translateX(-100%)';
            slider.prepend(lastItem);
            
            // 强制回流
            lastItem.offsetHeight;
            
            // 设置过渡并移动
            lastItem.style.transition = 'transform 0.4s ease';
            lastItem.style.transform = 'translateX(0)';
        },
        
        // 滚动到顶部
        scrollToTop() {
            const contentGrid = document.querySelector('.content-grid');
            if (contentGrid) {
                contentGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        },
        
        // 打开文章详情
        openArticle(articleId) {
            // 将用户重定向到对应的文章页面
            window.location.href = `article-${articleId}.html`;
        },
        
        // 订阅操作
        subscribe() {
            // 邮箱格式验证
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!this.email || !emailRegex.test(this.email)) {
                alert('请输入有效的电子邮箱地址');
                return;
            }
            
            // 模拟订阅请求
            alert('感谢您的订阅！我们将定期向 ' + this.email + ' 发送最新的增长洞察。');
            this.email = '';
        },
        
        // 导航到其他页面
        navigateTo(page) {
            window.location.href = `${page}.html`;
        },
        
        // 处理滚动事件
        handleScroll() {
            // 简单的可见性检测逻辑，用于延迟加载或滚动动画
            const isElementVisible = (el, offset = 0) => {
                if (!el) return false;
                const rect = el.getBoundingClientRect();
                return (
                    rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
                    rect.bottom >= 0
                );
            };
            
            // 检测并添加动画效果
            const sections = [
                '.featured-main', 
                '.featured-grid', 
                '.latest-insights',
                '.industry-data',
                '.experts-grid',
                '.subscribe-card',
                '.cta-content'
            ];
            
            sections.forEach(selector => {
                const element = document.querySelector(selector);
                if (element && isElementVisible(element, 100) && !element.classList.contains('animated')) {
                    element.classList.add('animated');
                }
            });
            
            // 检测内容卡片并添加动画
            const cards = document.querySelectorAll('.content-card:not(.animated)');
            cards.forEach((card, index) => {
                if (isElementVisible(card, 50)) {
                    setTimeout(() => {
                        card.classList.add('animated');
                    }, index * 100);
                }
            });
        },
        
        // 内容卡片动画
        animateContentCards() {
            // 实现内容卡片的渐入动画
            setTimeout(() => {
                const cards = document.querySelectorAll('.content-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }, 100);
        },
        
        // 初始化增长趋势图表
        initGrowthChart() {
            const ctx = document.getElementById('growthChart');
            if (!ctx) return;
            
            this.growthChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
                    datasets: [{
                        label: '传统获客',
                        data: [30, 35, 40, 42, 45, 48, 50],
                        borderColor: '#bdbdbd',
                        backgroundColor: 'rgba(189, 189, 189, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    }, {
                        label: 'AI驱动获客',
                        data: [30, 45, 65, 90, 120, 145, 170],
                        borderColor: '#3366ff',
                        backgroundColor: 'rgba(51, 102, 255, 0.1)',
                        borderWidth: 3,
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: '2024年增长趋势对比'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: '增长指数 (基准=30)'
                            }
                        }
                    }
                }
            });
        },
        
        // 初始化获客成本图表
        initAcquisitionCostChart() {
            const ctx = document.getElementById('acquisitionCostChart');
            if (!ctx) return;
            
            this.acquisitionCostChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['传统广告', '搜索引擎', '社交媒体', 'AI内容营销', '口碑引流'],
                    datasets: [{
                        label: '客户获取成本 (元)',
                        data: [580, 320, 260, 150, 80],
                        backgroundColor: [
                            'rgba(244, 67, 54, 0.7)',
                            'rgba(255, 152, 0, 0.7)',
                            'rgba(33, 150, 243, 0.7)',
                            'rgba(76, 175, 80, 0.7)',
                            'rgba(156, 39, 176, 0.7)'
                        ],
                        borderColor: [
                            'rgba(244, 67, 54, 1)',
                            'rgba(255, 152, 0, 1)',
                            'rgba(33, 150, 243, 1)',
                            'rgba(76, 175, 80, 1)',
                            'rgba(156, 39, 176, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `获客成本: ${context.raw}元/客户`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: '获客成本 (元/客户)'
                            }
                        }
                    }
                }
            });
        }
    }
}); 