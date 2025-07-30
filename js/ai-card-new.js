// AI卡片页面
// 注册ScrollTrigger插件
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    console.log('注册ScrollTrigger插件');
    gsap.registerPlugin(ScrollTrigger);
} else {
    console.error('GSAP或ScrollTrigger未加载');
}

const cardApp = new Vue({
    el: '#card-app',
    data: {
        contactForm: {
            company: '',
            name: '',
            position: '',
            phone: '',
            problem: ''
        },
        screenWidth: window.innerWidth,
        isMobile: false,
        isScrolling: false,
        valueBlockWidth: 0,
        valueScrollPosition: 0,
        userInput: '',
        formSubmitted: false,
        formError: false
    },
    
    mounted() {
        console.log('组件挂载完成');
        console.log('GSAP状态:', { 
            gsap: typeof gsap !== 'undefined',
            ScrollTrigger: typeof ScrollTrigger !== 'undefined'
        });
        
        // 确保GSAP和ScrollTrigger已加载
        if (typeof gsap === 'undefined') {
            console.error('GSAP未加载，无法初始化动画');
            
            // 尝试重新加载GSAP
            const gsapScript = document.createElement('script');
            gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js';
            gsapScript.onload = () => {
                console.log('GSAP已重新加载');
                
                const scrollTriggerScript = document.createElement('script');
                scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/ScrollTrigger.min.js';
                scrollTriggerScript.onload = () => {
                    console.log('ScrollTrigger已重新加载');
                    gsap.registerPlugin(ScrollTrigger);
                    this.initScrollAnimations();
                };
                document.head.appendChild(scrollTriggerScript);
            };
            document.head.appendChild(gsapScript);
        } else if (typeof ScrollTrigger === 'undefined') {
            console.error('ScrollTrigger未加载，无法初始化动画');
            
            // 尝试重新加载ScrollTrigger
            const scrollTriggerScript = document.createElement('script');
            scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/ScrollTrigger.min.js';
            scrollTriggerScript.onload = () => {
                console.log('ScrollTrigger已重新加载');
                gsap.registerPlugin(ScrollTrigger);
                this.initScrollAnimations();
            };
            document.head.appendChild(scrollTriggerScript);
        } else {
            // 初始化滚动动画
            setTimeout(() => {
                this.initScrollAnimations();
            }, 500); // 延迟500ms确保DOM已完全加载
        }
        
        // 检测设备类型和屏幕大小
        this.checkDevice();
        
        // 监听窗口大小变化
        window.addEventListener('resize', this.handleResize);
        
        // 监听滚动事件
        window.addEventListener('scroll', this.handleScroll);
        
        // 强制刷新SVG图像以解决缓存问题
        this.forceSvgRefresh();
        
        // 如果是移动设备，为核心价值区域添加横向滚动功能
        if (this.isMobile) {
            this.setupHorizontalScroll();
        }
        
        // 从URL参数中检查要执行的操作
        this.handleUrlParams();
    },
    
    beforeDestroy() {
        // 清理事件监听器
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        
        // 清理核心价值区域的滚动监听器
        const valueTimeline = document.querySelector('.value-timeline');
        if (valueTimeline) {
            valueTimeline.removeEventListener('scroll', this.handleValueScroll);
        }
    },
    
    methods: {
        // 检测设备类型和屏幕大小
        checkDevice() {
            // 更新屏幕宽度
            this.screenWidth = window.innerWidth;
            
            // 判断是否为移动设备
            this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || this.screenWidth <= 768;
            
            // 如果是窄屏设备，应用额外的样式优化
            if (this.screenWidth <= 560) {
                document.body.classList.add('narrow-screen');
                
                // 为窄屏设备优化滚动性能
                this.optimizeScrollPerformance();
            } else {
                document.body.classList.remove('narrow-screen');
            }
        },
        
        // 处理窗口大小变化
        handleResize() {
            this.checkDevice();
            
            // 如果是移动设备，重新设置横向滚动功能
            if (this.isMobile) {
                this.setupHorizontalScroll();
            }
        },
        
        // 从URL参数中检查要执行的操作
        handleUrlParams() {
            const urlParams = new URLSearchParams(window.location.search);
            const section = urlParams.get('section');
            const action = urlParams.get('action');
            
            if (section) {
                const targetElement = document.getElementById(section);
                if (targetElement) {
                setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                }
            }
        },
        
        // 返回上一页
        goBack() {
            window.history.back();
        },
        
        // 导航到指定页面
        navigateTo(page) {
            if (page === 'cards') {
                window.location.href = 'card-collection.html?tab=cards';
            } else if (page === 'marketplace') {
                window.location.href = 'card-collection.html?tab=marketplace';
            } else if (page === 'growthlab') {
                window.location.href = 'growth-lab.html';
            }
        },
        
        // 导航到商机广场
        goToMarketplace() {
            window.location.href = "card-collection.html?tab=marketplace";
        },
        
        // 导航到名片广场
        goToCardCollection() {
            window.location.href = "card-collection.html?tab=cards";
        },
        
        // 设置核心价值区域的横向滚动
        setupHorizontalScroll() {
            const valueTimeline = document.querySelector('.value-timeline');
            const dots = document.querySelectorAll('.value-nav-dots .dot');
            
            if (!valueTimeline || !dots.length) return;
            
            // 计算单个值块的宽度
            const valueBlock = valueTimeline.querySelector('.value-block');
            if (valueBlock) {
                // 获取确切的宽度和间隔
                const blockRect = valueBlock.getBoundingClientRect();
                const blockWidth = blockRect.width;
                const computedStyle = window.getComputedStyle(valueTimeline);
                const gap = parseInt(computedStyle.columnGap || computedStyle.gap || '16px', 10);
                this.valueBlockWidth = blockWidth + gap;
                
                // 初始化时确保dot状态正确
                this.updateActiveDot(valueTimeline);
            }
            
            // 添加滚动监听，优化性能，使用节流函数
            let lastScrollTime = 0;
            valueTimeline.addEventListener('scroll', (e) => {
                const now = Date.now();
                if (now - lastScrollTime > 50) { // 50ms节流
                    lastScrollTime = now;
                    this.updateActiveDot(valueTimeline);
                }
            }, { passive: true }); // passive 参数提高滚动性能
            
            // 为导航点添加点击事件
            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    const index = parseInt(dot.getAttribute('data-index'), 10);
                    this.scrollToBlock(valueTimeline, index);
                });
            });
            
            // 为移动设备添加触摸滑动支持，优化触摸体验
            this.enableTouchSwipe(valueTimeline);
        },
        
        // 更新活动导航点
        updateActiveDot(timeline) {
            if (!timeline) return;
            
            // 计算当前显示的块索引
            const scrollPosition = timeline.scrollLeft;
            const blockWidth = this.valueBlockWidth;
            const index = Math.round(scrollPosition / blockWidth);
            
            // 更新导航点状态
            const dots = document.querySelectorAll('.value-nav-dots .dot');
            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        },
        
        // 滚动到指定的值块
        scrollToBlock(element, index) {
            if (!element) return;
            
            const position = index * this.valueBlockWidth;
            
            // 使用平滑滚动
            element.scrollTo({
                left: position,
                behavior: 'smooth'
            });
        },
        
        // 为移动设备启用触摸滑动，优化版本
        enableTouchSwipe(element) {
            if (!element) return;
            
            let startX, startY;
            let scrollLeft;
            let isScrolling = false;
            let isVerticalScroll = false;
            let hasMoved = false;
            let touchStartTime = 0;
            
            const startDrag = (e) => {
                isScrolling = true;
                hasMoved = false;
                touchStartTime = Date.now();
                
                // 记录起始点
                if (e.type.includes('mouse')) {
                    startX = e.pageX;
                    startY = e.pageY;
                } else {
                    startX = e.touches[0].pageX;
                    startY = e.touches[0].pageY;
                }
                
                scrollLeft = element.scrollLeft;
                
                // 阻止拖动期间的文本选择
                document.body.style.userSelect = 'none';
                
                // 添加移动和结束事件监听器
                if (e.type === 'mousedown') {
                    document.addEventListener('mousemove', drag, { passive: false });
                    document.addEventListener('mouseup', endDrag);
                }
            };
            
            const drag = (e) => {
                if (!isScrolling) return;
                
                const x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
                const y = e.type.includes('mouse') ? e.pageY : e.touches[0].pageY;
                
                // 计算水平和垂直距离
                const deltaX = startX - x;
                const deltaY = startY - y;
                
                // 如果尚未确定方向，并且已经有足够的移动距离
                if (!hasMoved && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
                    // 如果垂直移动大于水平移动，则判定为垂直滚动
                    if (Math.abs(deltaY) > Math.abs(deltaX)) {
                        isVerticalScroll = true;
                    } else {
                        isVerticalScroll = false;
                        // 阻止页面滚动，只有确定为水平滚动时才阻止默认行为
                        e.preventDefault();
                    }
                    hasMoved = true;
                }
                
                // 如果是水平滚动，则移动滑块
                if (hasMoved && !isVerticalScroll) {
                    e.preventDefault();
                    const scrollX = scrollLeft + deltaX;
                    element.scrollLeft = scrollX;
                }
            };
            
            const endDrag = (e) => {
                isScrolling = false;
                document.body.style.userSelect = '';
                
                // 移除事件监听器
                if (e && e.type === 'mouseup') {
                    document.removeEventListener('mousemove', drag);
                    document.removeEventListener('mouseup', endDrag);
                }
                
                // 如果只是轻触而没有移动，则判断为点击
                if (!hasMoved && Date.now() - touchStartTime < 300) {
                    // 计算点击位置相对于元素的偏移
                    const rect = element.getBoundingClientRect();
                    const offsetX = (e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX) - rect.left;
                    
                    // 计算点击位置对应的索引
                    const index = Math.floor(offsetX / this.valueBlockWidth);
                    
                    // 如果点击的是元素而不是间隙，则滚动到该位置
                    if (index >= 0 && index < element.children.length) {
                        this.scrollToBlock(element, index);
                    }
                }
                
                // 滑动结束后更新导航点
                this.updateActiveDot(element);
                
                // 添加动量滚动效果，如果滑动速度快则多滚动一段距离
                if (hasMoved && !isVerticalScroll && e.type !== 'mouseup') {
                    const touchEndTime = Date.now();
                    const timeElapsed = touchEndTime - touchStartTime;
                    
                    if (timeElapsed < 150) {  // 如果滑动速度快
                        // 计算当前索引
                        const currentIndex = Math.round(element.scrollLeft / this.valueBlockWidth);
                        const deltaX = startX - (e.changedTouches ? e.changedTouches[0].pageX : e.pageX);
                        
                        // 根据滑动方向和速度决定是否翻页
                        if (Math.abs(deltaX) > 30) {  // 有足够的滑动距离
                            const targetIndex = deltaX > 0 ? 
                                Math.min(currentIndex + 1, element.children.length - 1) : 
                                Math.max(currentIndex - 1, 0);
                            
                            this.scrollToBlock(element, targetIndex);
                        }
                    }
                }
            };
            
            // 添加事件监听器
            element.addEventListener('mousedown', startDrag);
            element.addEventListener('touchstart', startDrag, { passive: true });
            element.addEventListener('touchmove', drag, { passive: false });
            element.addEventListener('touchend', endDrag);
        },
        
        // 强制刷新SVG图像以解决缓存问题
        forceSvgRefresh() {
            const svgImages = document.querySelectorAll('img[src$=".svg"]');
            const timestamp = new Date().getTime();
            
            svgImages.forEach(svg => {
                if (svg.src.includes('?v=')) {
                    // 已经有版本参数的不处理
                    return;
                }
                const originalSrc = svg.src.split('?')[0];
                svg.src = `${originalSrc}?refresh=${timestamp}`;
            });
        },
        
        // 提交联系表单
        submitForm() {
            // 表单验证
            if (!this.contactForm.company || !this.contactForm.name || !this.contactForm.phone) {
                alert('请填写公司名称、姓名和联系电话');
                return;
            }
            
            // 模拟提交表单
            this.isTyping = true;
            
            // 模拟API调用延迟
            setTimeout(() => {
                this.isTyping = false;
                alert('您的信息已提交，我们的顾问将尽快与您联系！');
                
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
        
        // 初始化滚动动画
        initScrollAnimations() {
            // 确保GSAP和ScrollTrigger已加载
            if (typeof gsap === 'undefined') {
                console.error('GSAP未加载，动画无法初始化');
                return;
            }
            
            // 确保ScrollTrigger已注册
            if (typeof ScrollTrigger !== 'undefined' && gsap.registerPlugin) {
                console.log('确认ScrollTrigger插件注册');
                gsap.registerPlugin(ScrollTrigger);
            }
            
            try {
                // 创建动画时间轴
                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: '.hero-section',
                        start: 'top center',
                        end: 'bottom top',
                        toggleActions: 'play none none reverse',
                        markers: false // 调试时可设为true
                    }
                });
                
                // 标题和副标题动画
                timeline.from('.main-title', {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                }).from('.subtitle', {
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                }, '-=0.3').from('.hero-graphic', {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'back.out'
                }, '-=0.4');
                
                // 为特色功能卡片添加滚动动画
                gsap.utils.toArray('.feature-card').forEach((card, i) => {
                    gsap.from(card, {
                        scrollTrigger: {
                            trigger: card,
                            start: 'top bottom-=100',
                            toggleActions: 'play none none none',
                            markers: false // 调试时可设为true
                        },
                        y: 50,
                        opacity: 0,
                        duration: 0.5,
                        delay: i * 0.1,
                        ease: 'power2.out'
                    });
                });
                
                // 为核心价值块添加动画
                gsap.utils.toArray('.value-block').forEach((block, i) => {
                    gsap.from(block, {
                        scrollTrigger: {
                            trigger: '.core-value-section',
                            start: 'top bottom-=50',
                            toggleActions: 'play none none none',
                            markers: false // 调试时可设为true
                        },
                        y: 30,
                        opacity: 0,
                        duration: 0.5,
                        delay: 0.1 + (i * 0.15),
                        ease: 'power2.out'
                    });
                });
                
                // 为体验指引添加动画
                gsap.from('.experience-guide', {
                    scrollTrigger: {
                        trigger: '.experience-guide',
                        start: 'top bottom-=50',
                        toggleActions: 'play none none none',
                        markers: false // 调试时可设为true
                    },
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                });
                
                // 为导航点添加动画
                gsap.from('.value-nav-dots', {
                    scrollTrigger: {
                        trigger: '.core-value-section',
                        start: 'top center',
                        toggleActions: 'play none none none',
                        markers: false // 调试时可设为true
                    },
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
                
                // 为卡片图标添加动画
                gsap.to('.card-icon', {
                    duration: 1,
                    scale: 1.2,
                    ease: 'elastic.out(1, 0.3)',
                    repeat: 0,
                    yoyo: true
                });
                
                console.log('动画初始化完成', { 
                    gsap: typeof gsap !== 'undefined',
                    ScrollTrigger: typeof ScrollTrigger !== 'undefined',
                    registeredPlugins: gsap && gsap.registerPlugin ? 'available' : 'unavailable'
                });
            } catch (error) {
                console.error('动画初始化失败:', error);
            }
        },
        
        // 处理滚动事件
        handleScroll() {
            // 保留必要的滚动处理逻辑
            if (!this.scrollTimeout) {
                this.scrollTimeout = setTimeout(this.handleDelayedScroll.bind(this), 100);
            }
        },
        
        // 延迟处理滚动事件
        handleDelayedScroll() {
            // 清除超时
            this.scrollTimeout = null;
            
            // 可以在这里添加必要的滚动相关逻辑
        },
        
        // 优化滚动性能
        optimizeScrollPerformance() {
            // 简化元素的动画处理，不需要特别优化
            window.addEventListener('scroll', this.handleScroll);
        },
        
        // 设置延迟加载
        setupLazyLoading() {
            // 如果浏览器支持，使用IntersectionObserver来实现延迟加载
            if ('IntersectionObserver' in window) {
                const lazyImages = document.querySelectorAll('img[data-src]');
                
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    });
                });
                
                lazyImages.forEach(img => {
                    imageObserver.observe(img);
                });
            }
        }
    }
}); 