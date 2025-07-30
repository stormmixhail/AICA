// 检查和修复滚动问题
function ensureScrollability() {
    // 防止body被固定或隐藏
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    
    // 检查是否有position:fixed的元素导致滚动问题
    const fixedElements = document.querySelectorAll('*[style*="position: fixed"], .chatbot-container, .chatbot-toggle');
    fixedElements.forEach(el => {
        if (el.classList.contains('chatbot-container') || el.classList.contains('chatbot-toggle')) {
            // 这些元素应该保持fixed
            return;
        }
        // 其他fixed元素可能导致滚动问题，将其改为absolute
        if (window.getComputedStyle(el).position === 'fixed') {
            el.style.position = 'absolute';
        }
    });
}

// AI获客引擎页面交互脚本
const marketingApp = new Vue({
    el: '#marketing-app',
    data: {
        // 联系表单
        contactForm: {
            company: '',
            name: '',
            position: '',
            phone: '',
            problem: ''
        },
        
        // 新的聊天框控制
        showChatbot: false,
        
        // 动画追踪
        animationsTriggered: {
            problemCards: false,
            flywheel: false,
            insightCards: false,
            journeySteps: false,
            founderStory: false,
            philosophy: false,
            teamExpertise: false
        },

        // 窗口宽度
        windowWidth: window.innerWidth
    },
    
    mounted() {
        // 确保页面可滚动
        ensureScrollability();
        
        // 初始化滚动动画
        this.initScrollAnimations();
        
        // 监听滚动事件
        window.addEventListener('scroll', this.handleScroll);

        // 监听窗口尺寸变化
        window.addEventListener('resize', this.handleResize);

        // 设置问题卡片动画索引
        this.setProblemCardIndices();
        
        // 检查初始视窗中的元素
        this.$nextTick(() => {
            this.checkElementVisibility();
            // 再次确保页面可滚动
            ensureScrollability();
        });
    },
    
    beforeDestroy() {
        // 清理事件监听器
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
    },
    
    methods: {
        // 处理窗口大小变化
        handleResize() {
            this.windowWidth = window.innerWidth;
            this.checkElementVisibility();
            ensureScrollability(); // 确保窗口大小变化时页面仍可滚动
        },

        // 设置问题卡片的动画索引
        setProblemCardIndices() {
            this.$nextTick(() => {
                const cards = document.querySelectorAll('.problem-card');
                cards.forEach((card, index) => {
                    card.style.setProperty('--card-index', index);
                });
            });
        },

        // 返回上一页
        goBack() {
            window.location.href = 'index.html';
        },
        
        // 滚动到联系表单
        scrollToContact() {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        },
        
        // 导航到其他页面
        navigateTo(page) {
            window.location.href = `${page}.html`;
        },
        
        // 提交联系表单
        submitForm() {
            // 表单验证
            if (!this.contactForm.name || !this.contactForm.phone) {
                alert('请填写您的姓名和联系电话');
                return;
            }
            
            // 模拟表单提交
            alert('您的预约已提交成功！我们的顾问将在24小时内与您联系。');
            
            // 重置表单
            this.contactForm = {
                company: '',
                name: '',
                position: '',
                phone: '',
                problem: ''
            };
            
            // 确保弹窗关闭后页面仍可滚动
            setTimeout(ensureScrollability, 500);
        },
        
        // 切换聊天框显示状态
        toggleChatbot() {
            this.showChatbot = !this.showChatbot;
            
            // 确保打开/关闭聊天框后页面仍可滚动
            setTimeout(ensureScrollability, 300);
        },
        
        // 初始化滚动动画
        initScrollAnimations() {
            // 使用GSAP和ScrollTrigger实现滚动动画
            if (window.gsap && window.ScrollTrigger) {
                // 检查是否为小屏幕
                const isSmallScreen = this.windowWidth <= 560;
                
                // 根据屏幕大小调整动画参数
                const animParams = isSmallScreen ? 
                    {
                        duration: 0.5, // 更快的动画
                        stagger: 0.1, // 更小的间隔
                        y: 15, // 更小的位移
                    } : 
                    {
                        duration: 0.8,
                        stagger: 0.2,
                        y: 30,
                    };
                
                // 如果是小屏幕，则减少动画数量和复杂度
                if (!isSmallScreen) {
                    // 问题卡片动画
                    gsap.from('.problem-card', {
                        opacity: 0,
                        y: animParams.y,
                        stagger: animParams.stagger,
                        duration: animParams.duration,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: '.problem-section',
                            start: 'top 80%',
                            onEnter: () => this.animationsTriggered.problemCards = true
                        }
                    });
                    
                    // 飞轮动画
                    gsap.from('.flywheel-visual', {
                        opacity: 0,
                        scale: 0.9,
                        duration: animParams.duration,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: '.flywheel-visual',
                            start: 'top 80%'
                        }
                    });
                    
                    gsap.from('.stage', {
                        opacity: 0,
                        y: animParams.y,
                        stagger: animParams.stagger,
                        duration: animParams.duration,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: '.flywheel-stages',
                            start: 'top 80%',
                            onEnter: () => this.animationsTriggered.flywheel = true
                        }
                    });
                    
                    // 洞察卡片动画
                    gsap.from('.insight-card', {
                        opacity: 0,
                        y: animParams.y,
                        stagger: animParams.stagger,
                        duration: animParams.duration,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: '.insight-cards',
                            start: 'top 80%',
                            onEnter: () => this.animationsTriggered.insightCards = true
                        }
                    });
                    
                    // 创始人故事动画
                    gsap.from('.story-act', {
                        opacity: 0,
                        x: -30,
                        stagger: animParams.stagger,
                        duration: animParams.duration,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: '.founder-story',
                            start: 'top 80%',
                            onEnter: () => {
                                this.animationsTriggered.founderStory = true;
                                // 添加visible类以显示故事
                                document.querySelectorAll('.story-act').forEach((act, index) => {
                                    setTimeout(() => {
                                        act.classList.add('visible');
                                    }, index * 150);
                                });
                            }
                        }
                    });
                    
                    // 品牌理念动画
                    gsap.from('.philosophy-core', {
                        opacity: 0.5,
                        y: animParams.y,
                        duration: animParams.duration,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: '.brand-philosophy',
                            start: 'top 80%',
                            onEnter: () => this.animationsTriggered.philosophy = true
                        }
                    });
                    
                    gsap.from('.philosophy-point', {
                        opacity: 0.5,
                        y: animParams.y / 2,
                        stagger: animParams.stagger,
                        duration: animParams.duration,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: '.philosophy-details',
                            start: 'top 90%'
                        }
                    });
                    
                    // 团队专长卡片动画
                    gsap.from('.expertise-card', {
                        opacity: 0,
                        y: animParams.y,
                        stagger: animParams.stagger,
                        duration: animParams.duration,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: '.team-expertise',
                            start: 'top 80%',
                            onEnter: () => this.animationsTriggered.teamExpertise = true
                        }
                    });
                } else {
                    // 小屏幕只应用简单的淡入动画
                    const elements = [
                        '.problem-card',
                        '.stage',
                        '.insight-card',
                        '.story-act',
                        '.expertise-card'
                    ];
                    
                    elements.forEach(selector => {
                        document.querySelectorAll(selector).forEach(el => {
                            el.style.opacity = 1;
                            el.style.transform = 'none';
                        });
                    });
                    
                    // 标记所有动画已触发
                    Object.keys(this.animationsTriggered).forEach(key => {
                        this.animationsTriggered[key] = true;
                    });
                    
                    // 使所有故事可见
                    document.querySelectorAll('.story-act').forEach(act => {
                        act.classList.add('visible');
                    });
                }
                
                // 确保动画不会影响滚动
                setTimeout(ensureScrollability, 100);
            }
        },
        
        // 处理滚动事件
        handleScroll() {
            // 防抖处理，避免频繁计算导致性能问题
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
            }
            
            this.scrollTimeout = setTimeout(() => {
                // 只在大屏幕上检查元素可见性
                if (this.windowWidth > 560) {
                    this.checkElementVisibility();
                }
                
                // 确保滚动操作后页面可正常滚动
                ensureScrollability();
            }, 100); // 100ms防抖
        },
        
        // 专门检查故事Act的可见性
        checkStoryActsVisibility() {
            const storyActs = document.querySelectorAll('.story-act');
            if (storyActs.length && !this.animationsTriggered.founderStory) {
                const isElementVisible = (el) => {
                    const rect = el.getBoundingClientRect();
                    return (
                        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
                        rect.bottom >= 0
                    );
                };
                
                if (isElementVisible(storyActs[0])) {
                    this.animationsTriggered.founderStory = true;
                    storyActs.forEach((act, index) => {
                        setTimeout(() => {
                            act.classList.add('visible');
                        }, index * 300);
                    });
                }
            }
        },
        
        // 检查元素是否在视口中
        checkElementVisibility() {
            // 简单的可见性检测逻辑（GSAP不可用时的备用方案）
            const isElementVisible = (el) => {
                const rect = el.getBoundingClientRect();
                return (
                    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
                    rect.bottom >= 0
                );
            };
            
            // 检查问题卡片
            if (!this.animationsTriggered.problemCards) {
                const cards = document.querySelectorAll('.problem-card');
                if (cards.length && isElementVisible(cards[0])) {
                    this.animationsTriggered.problemCards = true;
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                }
            }
            
            // 检查创始人故事
            if (!this.animationsTriggered.founderStory) {
                const storyActs = document.querySelectorAll('.story-act');
                if (storyActs.length && isElementVisible(storyActs[0])) {
                    this.animationsTriggered.founderStory = true;
                    storyActs.forEach((act, index) => {
                        setTimeout(() => {
                            act.classList.add('visible');
                        }, index * 300);
                    });
                }
            }
            
            // 检查团队专长卡片
            if (!this.animationsTriggered.teamExpertise) {
                const expertiseCards = document.querySelectorAll('.expertise-card');
                if (expertiseCards.length && isElementVisible(expertiseCards[0])) {
                    this.animationsTriggered.teamExpertise = true;
                    expertiseCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                }
            }
            
            // 飞轮检查
            if (!this.animationsTriggered.flywheel) {
                const flywheel = document.querySelector('.flywheel-visual');
                const stages = document.querySelectorAll('.stage');
                
                if (flywheel && isElementVisible(flywheel)) {
                    this.animationsTriggered.flywheel = true;
                    flywheel.style.opacity = '1';
                    flywheel.style.transform = 'scale(1) rotate(0)';
                    
                    // 小屏幕添加持续旋转
                    if (this.windowWidth <= 560 && !flywheel.classList.contains('rotating')) {
                        flywheel.classList.add('rotating');
                        // 使用CSS动画代替GSAP
                        flywheel.style.animation = 'spin 40s linear infinite';
                    }
                    
                    // 启动阶段动画
                    if (stages.length) {
                        stages.forEach((stage, index) => {
                            setTimeout(() => {
                                stage.style.opacity = '1';
                                stage.style.transform = 'translateY(0)';
                            }, 500 + index * 200);
                        });
                    }
                }
            }
        }
    }
}); 