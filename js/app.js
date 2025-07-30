// 确保组件注册发生在Vue实例创建之前
// 在这里引入组件代码
try {
    // 联享名片组件
    Vue.component('business-card', {
        props: {
            name: String,
            title: String,
            avatar: String,
            intro: String,
            servedCount: Number,
            agentId: String,
            userId: {
                type: String,
                default: function() {
                    return this.agentId || 'default-user';
                }
            }
        },
        template: `
            <div class="card-container">
                <div class="business-card-blue">
                    <div class="card-header-new">
                        <div class="card-person-container">
                            <div class="card-service-counter">
                                <div class="counter-text">已接待</div>
                                <div class="counter-number"><strong>{{ servedCount }}</strong></div>
                                <div class="counter-text">人</div>
                            </div>
                            <div class="card-person-info-blue">
                                <h3 class="person-name">{{ name }}</h3>
                                <div class="person-title">{{ title }}</div>
                            </div>
                            <div class="card-avatar-blue">
                                <img :src="avatar" :alt="name + '头像'">
                            </div>
                        </div>
                    </div>
                    
                    <div class="card-intro-blue">
                        <p>{{ intro }}</p>
                    </div>
                    
                    <div class="card-buttons">
                        <div class="card-btn view-full-btn" @click="viewPersonalCard">查看完整名片</div>
                        <div class="card-btn chat-with-btn" @click="navigateToAgent(agentId)">与{{ name }}对话</div>
                    </div>
                </div>
            </div>
        `,
        methods: {
            navigateTo(page) {
                this.$root.navigateTo(page);
            },
            navigateToAgent(agent) {
                this.$root.navigateToAgent(agent);
            },
            viewPersonalCard() {
                // 导航到个人名片页面，传递用户ID
                window.location.href = 'ai-card-new.html?id=' + this.userId;
            }
        }
    });
    console.log('组件注册成功');
} catch (e) {
    console.error('组件注册失败', e);
}

// 主页应用逻辑
new Vue({
    el: '#app',
    data: {
        // 添加智能体配置
        agents: {
            'tan-agent': {
                name: '谭云杰',
                title: '创始人 & CEO',
                avatar: 'img/tan-avatar.svg?v=20250716'
            },
            'zheng-agent': {
                name: '郑明',
                title: '联合创始人 & CTO',
                avatar: 'img/zheng-avatar.svg?v=20250716'
            },
            'product-agent': {
                name: '李晓华',
                title: '产品总监',
                avatar: 'img/ai-avatar.svg?v=20250716'
            },
            'marketing-agent': {
                name: '营销助手',
                title: 'AI营销专家',
                avatar: 'img/ai-avatar.svg?v=20250716'
            },
            'content-agent': {
                name: '内容助手',
                title: 'AI内容创作专家',
                avatar: 'img/digital-human-avatar.svg?v=20250716'
            },
            'crm-agent': {
                name: '客户管理助手',
                title: 'AI客户关系专家',
                avatar: 'img/card-assistant-avatar.svg?v=20250716'
            },
            'strategy-agent': {
                name: '战略顾问',
                title: 'AI战略分析专家',
                avatar: 'img/ai-avatar.svg?v=20250716'
            }
        },
        // 只保留三个新闻
        newsList: [
            {
                id: 1,
                title: "【签就业协议】薪资8000+人工智能 \"全媒体运营师\" 定向就业培训报名！",
                excerpt: "人力资源社会保障部相关负责人表示，此次开展大规模职业技能培训，主要是适应新质生产力发展、就业岗位挖潜扩容等需要，培养更多紧缺技能人才。",
                image: "img/news/application-banner1.jpg?v=20250716",
                category: "招生就业"
            },
            {
                id: 2,
                title: "AI一人公司：重塑个体创业者的商业模式",
                excerpt: "人工智能技术正在为个体创业者提供前所未有的可能性，通过AI工具，一个人可以完成过去需要团队才能实现的任务。了解如何构建和运营AI驱动的一人公司。",
                image: "img/news/industry-banner1.jpg?v=20250716",
                category: "创业创新"
            },
            {
                id: 3,
                title: "联享名片：打造智能化商业社交新范式",
                excerpt: "联享名片正在成为商业社交的新标准，融合AI助手、实时数据分析和智能跟进功能，让每一次商业互动都能产生最大价值。",
                image: "img/news/application-banner2.jpg?v=20250716",
                category: "产品动态"
            }
        ],
        currentNewsIndex: 0,
        carouselInterval: null
    },
    mounted() {
        // 启动新闻轮播
        this.startNewsCarousel();
        
        // 确保页面可以滚动
        document.body.style.overflowY = 'auto';
        document.documentElement.style.overflowY = 'auto';
        
        // 修复滚动问题
        this.fixScrollIssue();
    },
    
    // 新增方法 - 修复滚动问题
    beforeDestroy() {
        // 组件销毁时停止轮播
        this.stopNewsCarousel();
        
        // 保存滚动位置
        localStorage.setItem('scrollPosition', window.scrollY);
    },
    methods: {
        // 导航到功能页面
        navigateTo(page) {
            switch(page) {
                case 'ai-marketing':
                    window.location.href = 'ai-marketing.html';
                    break;
                case 'digital-human':
                    window.location.href = 'digital-human.html';
                    break;
                case 'digital-human-new':
                    window.location.href = 'digital-human-new.html';
                    break;
                case 'ai-company':
                    window.location.href = 'ai-company.html';
                    break;
                case 'ai-card':
                    window.location.href = 'ai-card.html';
                    break;
                case 'ai-card-new':
                    window.location.href = 'ai-card-new.html';
                    break;
                case 'article-multimedia-training':
                    window.location.href = 'article-multimedia-training.html';
                    break;
                default:
                    break;
            }
        },
        
        // 导航到智能体页面
        navigateToAgent(agent) {
            if (this.agents[agent]) {
                // 将智能体信息存储到sessionStorage
                sessionStorage.setItem('currentAgent', JSON.stringify(this.agents[agent]));
                
                // 跳转到智能体聊天页面
                window.location.href = 'agent-chat.html?agent=' + agent;
            } else {
                alert('即将推出：' + agent + ' 功能');
            }
        },
        
        // 新闻轮播控制方法
        startNewsCarousel() {
            // 清除已有的定时器
            this.stopNewsCarousel();
            
            // 设置新的定时器，每6秒切换一次
            this.carouselInterval = setInterval(() => {
                this.nextNews();
            }, 6000);
        },
        
        stopNewsCarousel() {
            if (this.carouselInterval) {
                clearInterval(this.carouselInterval);
                this.carouselInterval = null;
            }
        },
        
        nextNews(event) {
            // 阻止事件冒泡，避免触发新闻卡片的点击事件
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            this.currentNewsIndex = (this.currentNewsIndex + 1) % this.newsList.length;
        },
        
        prevNews(event) {
            // 阻止事件冒泡，避免触发新闻卡片的点击事件
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            this.currentNewsIndex = (this.currentNewsIndex - 1 + this.newsList.length) % this.newsList.length;
        },
        
        setCurrentNews(index, event) {
            // 阻止事件冒泡，避免触发新闻卡片的点击事件
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            this.currentNewsIndex = index;
            // 重置自动轮播计时器
            this.startNewsCarousel();
        },
        
        viewNews(newsId) {
            console.log('查看新闻:', newsId);
            
            // 固定新闻的处理逻辑
            if (newsId === 'news1') {
                window.location.href = 'article-ai-employment-training.html';
            } else if (newsId === 'news2') {
                window.location.href = 'article-multimedia-training.html';
            } else if (newsId === 'news3') {
                window.location.href = 'article-ai-miit-training.html';
            } else {
                // 处理动态新闻的逻辑
                const newsItem = this.newsList.find(news => news.id === newsId);
                if (newsItem) {
                    window.location.href = `digital-human-news.html?id=${newsId}`;
                }
            }
        }
    },
    beforeDestroy() {
        // 组件销毁时停止轮播
        this.stopNewsCarousel();
    },
    
    // 修复滚动问题的方法
    fixScrollIssue() {
        // 恢复保存的滚动位置
        const savedPosition = localStorage.getItem('scrollPosition');
        if (savedPosition) {
            setTimeout(() => {
                window.scrollTo({
                    top: parseInt(savedPosition),
                    behavior: 'auto'
                });
                console.log('恢复滚动位置:', savedPosition);
            }, 200);
        }
        
        // 禁止定时器导致的页面自动滚动
        window.addEventListener('scroll', () => {
            clearTimeout(this._scrollTimer);
            this._scrollTimer = setTimeout(() => {
                localStorage.setItem('scrollPosition', window.scrollY);
            }, 100);
        });
    }
}); 