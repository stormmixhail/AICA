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
        
        // AI助手相关
        showAssistant: false,
        userInput: '',
        assistantMessages: [],
        isTyping: false,
        
        // 动画追踪
        animationsTriggered: {
            problemCards: false,
            flywheel: false,
            insightCards: false,
            journeySteps: false,
            founderStory: false,
            philosophy: false,
            teamExpertise: false
        }
    },
    
    mounted() {
        // 初始化滚动动画
        this.initScrollAnimations();
        
        // 监听滚动事件
        window.addEventListener('scroll', this.handleScroll);
    },
    
    beforeDestroy() {
        // 清理事件监听器
        window.removeEventListener('scroll', this.handleScroll);
    },
    
    methods: {
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
            this.isTyping = true;
            
            // 延时模拟API请求
            setTimeout(() => {
                this.isTyping = false;
                alert('您的预约已提交成功！我们的顾问将在24小时内与您联系。');
                
                // 重置表单
                this.contactForm = {
                    company: '',
                    name: '',
                    position: '',
                    phone: '',
                    problem: ''
                };
            }, 1500);
        },
        
        // 切换AI助手显示状态
        toggleAssistant() {
            this.showAssistant = !this.showAssistant;
        },
        
        // 发送消息给AI助手
        sendAssistantMessage() {
            if (!this.userInput.trim()) return;
            
            // 添加用户消息
            this.assistantMessages.push({
                type: 'user',
                text: this.userInput.trim()
            });
            
            const userQuestion = this.userInput.trim();
            this.userInput = ''; // 清空输入框
            
            // 显示AI正在输入
            this.isTyping = true;
            
            // 模拟AI回复延迟
            setTimeout(() => {
                this.isTyping = false;
                
                // 根据问题提供相应回复
                let response = this.getAIResponse(userQuestion);
                
                this.assistantMessages.push({
                    type: 'ai',
                    text: response
                });
                
                // 自动滚动到最新消息
                this.$nextTick(() => {
                    const messagesContainer = document.querySelector('.dialog-messages');
                    if (messagesContainer) {
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }
                });
            }, 1000 + Math.random() * 1000); // 随机延迟1-2秒
        },
        
        // 根据用户输入生成AI回复
        getAIResponse(question) {
            // 简单的关键词匹配逻辑
            question = question.toLowerCase();
            
            if (question.includes('价格') || question.includes('费用') || question.includes('多少钱')) {
                return '我们的AI获客引擎有不同的套餐方案，基础版每月3999元起，企业版每月9999元起。我们可以根据您的具体需求提供定制方案，建议您留下联系方式，我们的顾问将为您提供详细报价。';
            } 
            else if (question.includes('怎么用') || question.includes('如何使用') || question.includes('操作流程')) {
                return '使用我们的AI获客引擎非常简单：1. 我们会先进行需求诊断；2. 根据您的业务特点定制获客系统；3. 部署AI工具并与您现有系统集成；4. 提供培训和持续优化支持。整个过程大约需要7-14天。';
            }
            else if (question.includes('案例') || question.includes('成功') || question.includes('效果')) {
                return '我们已经帮助多家企业提升了获客效率。例如，某教育机构使用我们的系统后，获客成本降低了60%，转化率提高了45%。您可以查看我们增长实验室中的详细案例分析。';
            }
            else if (question.includes('区别') || question.includes('优势') || question.includes('为什么选择')) {
                return '我们的独特优势在于：1. 市值管理视角，关注长期企业价值而非短期流量；2. 系统化方法论，构建标准化获客流程；3. AI深度集成，自动化执行和优化；4. 专业团队背景，融合媒体、资本与技术经验。';
            }
            else {
                return '感谢您的问题！我们的AI获客引擎能帮助企业构建标准化、可复制的获客系统，降低获客成本同时提高转化率。您有什么具体的获客难题想要解决吗？或者您可以通过页面底部的表单预约一次免费诊断。';
            }
        },
        
        // 初始化滚动动画
        initScrollAnimations() {
            // 检查是否为移动设备
            const isMobile = window.innerWidth <= 768;
            
            // 添加GSAP动画类以便CSS中可以针对它们
            const addGsapClasses = () => {
                document.querySelectorAll('.problem-card, .flywheel-visual, .stage, .insight-card, .story-act, .philosophy-core, .philosophy-point, .expertise-card, .unique-badge').forEach(el => {
                    el.classList.add('gsap-animate');
                });
            };
            
            addGsapClasses();
            
            // 如果是移动设备，则不初始化复杂动画，直接标记所有动画为已触发
            if (isMobile) {
                Object.keys(this.animationsTriggered).forEach(key => {
                    this.animationsTriggered[key] = true;
                });
                return; // 移动设备直接返回，不执行GSAP动画
            }
            
            // 使用GSAP和ScrollTrigger实现滚动动画（仅在非移动设备上）
            if (window.gsap && window.ScrollTrigger) {
                // 创建更轻量级的滚动触发器
                ScrollTrigger.config({ limitCallbacks: true });
                
                // 问题卡片动画 - 减少位移距离和过渡时间
                gsap.from('.problem-card', {
                    opacity: 0,
                    y: 20,
                    stagger: 0.1, // 减少延迟
                    duration: 0.6, // 减少动画时间
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.problem-section',
                        start: 'top 85%',
                        once: true, // 只触发一次
                        onEnter: () => this.animationsTriggered.problemCards = true
                    }
                });
                
                // 飞轮动画 - 减少变换幅度
                gsap.from('.flywheel-visual', {
                    opacity: 0,
                    scale: 0.9, // 减少缩放幅度
                    duration: 0.8, // 减少动画时间
                    ease: 'back.out(1.4)', // 减少弹性
                    scrollTrigger: {
                        trigger: '.flywheel-visual',
                        start: 'top 85%',
                        once: true
                    }
                });
                
                // 阶段卡片
                gsap.from('.stage', {
                    opacity: 0,
                    y: 20, // 减少位移距离
                    stagger: 0.1, // 减少延迟
                    duration: 0.6, // 减少动画时间
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.flywheel-stages',
                        start: 'top 85%',
                        once: true,
                        onEnter: () => this.animationsTriggered.flywheel = true
                    }
                });
                
                // 洞察卡片动画
                gsap.from('.insight-card', {
                    opacity: 0,
                    y: 20, // 减少位移距离
                    stagger: 0.1, // 减少延迟
                    duration: 0.6, // 减少动画时间
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.insight-cards',
                        start: 'top 85%',
                        once: true,
                        onEnter: () => this.animationsTriggered.insightCards = true
                    }
                });
                
                // 创始人故事动画 - x轴动画可能导致水平滚动问题，改用y轴
                gsap.from('.story-act', {
                    opacity: 0,
                    y: 20, // 改用y轴动画，防止水平滚动问题
                    stagger: 0.2, // 减少延迟
                    duration: 0.7, // 减少动画时间
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.founder-story',
                        start: 'top 85%',
                        once: true,
                        onEnter: () => this.animationsTriggered.founderStory = true
                    }
                });
                
                // 品牌理念动画
                gsap.from('.philosophy-core', {
                    opacity: 0.7, // 提高初始透明度
                    y: 15, // 减少位移距离
                    duration: 0.6, // 减少动画时间
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.brand-philosophy',
                        start: 'top 85%',
                        once: true,
                        onEnter: () => this.animationsTriggered.philosophy = true
                    }
                });
                
                gsap.from('.philosophy-point', {
                    opacity: 0.7, // 提高初始透明度
                    y: 10, // 减少位移距离
                    stagger: 0.1, // 减少延迟
                    duration: 0.6, // 减少动画时间
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.philosophy-details',
                        start: 'top 90%',
                        once: true
                    }
                });
                
                // 团队专长卡片动画
                gsap.from('.expertise-card', {
                    opacity: 0,
                    y: 20, // 减少位移距离
                    stagger: 0.1, // 减少延迟
                    duration: 0.6, // 减少动画时间
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.team-expertise',
                        start: 'top 85%',
                        once: true,
                        onEnter: () => this.animationsTriggered.teamExpertise = true
                    }
                });
                
                // 徽章动画
                gsap.from('.unique-badge', {
                    opacity: 0,
                    scale: 0.9, // 减少缩放幅度
                    duration: 0.6, // 减少动画时间
                    ease: 'back.out(1.4)', // 减少弹性
                    scrollTrigger: {
                        trigger: '.team-unique-value',
                        start: 'top 90%',
                        once: true
                    }
                });
            }
        },
        
        // 处理滚动事件
        handleScroll() {
            // 移动设备直接返回，不执行动画
            if (window.innerWidth <= 768) {
                return;
            }
            
            // 备用滚动处理（如果GSAP不可用）
            if (!window.gsap || !window.ScrollTrigger) {
                this.checkElementVisibility();
            }
        },
        
        // 检查元素是否在视口中
        checkElementVisibility() {
            // 简单的可见性检测逻辑（GSAP不可用时的备用方案）
            const isElementVisible = (el) => {
                const rect = el.getBoundingClientRect();
                return (
                    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
                    rect.bottom >= 0
                );
            };
            
            // 使用requestAnimationFrame以避免布局抖动
            requestAnimationFrame(() => {
                // 检查问题卡片
                if (!this.animationsTriggered.problemCards) {
                    const cards = document.querySelectorAll('.problem-card');
                    if (cards.length && isElementVisible(cards[0])) {
                        this.animationsTriggered.problemCards = true;
                        cards.forEach((card, index) => {
                            // 减少延迟时间提高响应性
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, index * 100);
                        });
                    }
                }
                
                // 检查飞轮相关元素
                if (!this.animationsTriggered.flywheel) {
                    const flywheel = document.querySelector('.flywheel-visual');
                    const stages = document.querySelectorAll('.stage');
                    if (flywheel && isElementVisible(flywheel)) {
                        flywheel.style.opacity = '1';
                        flywheel.style.transform = 'scale(1)';
                    }
                    if (stages.length && isElementVisible(stages[0])) {
                        this.animationsTriggered.flywheel = true;
                        stages.forEach((stage, index) => {
                            setTimeout(() => {
                                stage.style.opacity = '1';
                                stage.style.transform = 'translateY(0)';
                            }, index * 100);
                        });
                    }
                }
                
                // 检查洞察卡片
                if (!this.animationsTriggered.insightCards) {
                    const cards = document.querySelectorAll('.insight-card');
                    if (cards.length && isElementVisible(cards[0])) {
                        this.animationsTriggered.insightCards = true;
                        cards.forEach((card, index) => {
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, index * 100);
                        });
                    }
                }
                
                // 检查创始人故事 - 使用Y轴动画而非X轴
                if (!this.animationsTriggered.founderStory) {
                    const storyActs = document.querySelectorAll('.story-act');
                    if (storyActs.length && isElementVisible(storyActs[0])) {
                        this.animationsTriggered.founderStory = true;
                        storyActs.forEach((act, index) => {
                            setTimeout(() => {
                                act.style.opacity = '1';
                                act.style.transform = 'translateY(0)'; // 改为Y轴动画
                            }, index * 150);
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
                            }, index * 100);
                        });
                    }
                }
                
                // 检查品牌理念
                if (!this.animationsTriggered.philosophy) {
                    const core = document.querySelector('.philosophy-core');
                    const points = document.querySelectorAll('.philosophy-point');
                    if (core && isElementVisible(core)) {
                        this.animationsTriggered.philosophy = true;
                        core.style.opacity = '1';
                        core.style.transform = 'translateY(0)';
                        
                        points.forEach((point, index) => {
                            setTimeout(() => {
                                point.style.opacity = '1';
                                point.style.transform = 'translateY(0)';
                            }, 100 + index * 100);
                        });
                    }
                }
            });
        }
    }
}); 