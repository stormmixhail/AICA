/**
 * 数字人新版页面交互脚本 - 与AI Marketing风格保持一致
 */

// GSAP动画初始化
if (typeof gsap !== 'undefined') {
    // 注册ScrollTrigger插件
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
}

// 视频资源管理器 - 全局对象
const VideoResourceManager = {
    // 用于存储视频加载状态
    videoStates: {},
    
    // 初始化视频元素
    initVideo: function(videoElement, options = {}) {
        if (!videoElement || !(videoElement instanceof HTMLVideoElement)) {
            console.error('无效的视频元素');
            return false;
        }
        
        const videoId = videoElement.src || videoElement.id || Math.random().toString(36).substring(7);
        
        // 设置视频状态
        this.videoStates[videoId] = {
            element: videoElement,
            loaded: false,
            error: false,
            playAttempts: 0,
            options: Object.assign({
                autoPreload: false,
                showError: true,
                errorCallback: null,
                loadedCallback: null
            }, options)
        };
        
        // 添加事件监听器
        this.addVideoListeners(videoElement, videoId);
        
        return true;
    },
    
    // 添加视频事件监听器
    addVideoListeners: function(videoElement, videoId) {
        const state = this.videoStates[videoId];
        if (!state) return;
        
        // 加载完成事件
        videoElement.addEventListener('loadeddata', () => {
            console.log(`视频加载完成: ${videoId}`);
            state.loaded = true;
            state.error = false;
            
            if (state.options.loadedCallback && typeof state.options.loadedCallback === 'function') {
                state.options.loadedCallback(videoElement);
            }
        });
        
        // 错误事件
        videoElement.addEventListener('error', (e) => {
            console.error(`视频加载错误: ${videoId}`, e);
            state.error = true;
            state.loaded = false;
            
            if (state.options.showError && videoElement.parentElement) {
                // 如果父元素存在且需要显示错误，添加错误UI
                this.showVideoError(videoElement);
            }
            
            if (state.options.errorCallback && typeof state.options.errorCallback === 'function') {
                state.options.errorCallback(e, videoElement);
            }
        });
    },
    
    // 显示视频错误UI
    showVideoError: function(videoElement) {
        // 确保父元素存在
        if (!videoElement.parentElement) return;
        
        // 检查是否已存在错误UI
        if (videoElement.parentElement.querySelector('.video-error-overlay')) return;
        
        const errorOverlay = document.createElement('div');
        errorOverlay.className = 'video-error-overlay';
        errorOverlay.innerHTML = '<i class="bi bi-exclamation-triangle"></i><span>视频加载失败</span>';
        errorOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            z-index: 10;
        `;
        
        const icon = errorOverlay.querySelector('i');
        if (icon) {
            icon.style.cssText = `
                font-size: 24px;
                margin-bottom: 8px;
                color: #ff4d4f;
            `;
        }
        
        const text = errorOverlay.querySelector('span');
        if (text) {
            text.style.cssText = `
                font-size: 14px;
            `;
        }
        
        videoElement.parentElement.appendChild(errorOverlay);
    },
    
    // 预加载视频首帧
    preloadVideoFrame: function(videoElement, time = 0.1) {
        if (!videoElement || !(videoElement instanceof HTMLVideoElement)) {
            console.error('无效的视频元素');
            return Promise.reject('无效的视频元素');
        }
        
        return new Promise((resolve, reject) => {
            const videoId = videoElement.src || videoElement.id || Math.random().toString(36).substring(7);
            
            // 初始化视频状态（如果尚未初始化）
            if (!this.videoStates[videoId]) {
                this.initVideo(videoElement, {
                    loadedCallback: () => resolve(videoElement),
                    errorCallback: (e) => reject(e)
                });
            }
            
            // 如果视频已经加载，直接设置时间点并返回
            if (videoElement.readyState >= 2) {
                console.log(`视频已加载，设置时间点: ${time}`);
                try {
                    videoElement.currentTime = time;
                    videoElement.pause();
                    resolve(videoElement);
                } catch (e) {
                    reject(e);
                }
                return;
            }
            
            // 否则，监听事件
            const loadedHandler = () => {
                try {
                    videoElement.currentTime = time;
                    videoElement.pause();
                    videoElement.removeEventListener('loadeddata', loadedHandler);
                    videoElement.removeEventListener('error', errorHandler);
                    resolve(videoElement);
                } catch (e) {
                    reject(e);
                }
            };
            
            const errorHandler = (e) => {
                videoElement.removeEventListener('loadeddata', loadedHandler);
                videoElement.removeEventListener('error', errorHandler);
                reject(e);
            };
            
            videoElement.addEventListener('loadeddata', loadedHandler);
            videoElement.addEventListener('error', errorHandler);
            
            // 触发加载
            if (videoElement.networkState === 0 || videoElement.networkState === 3) {
                videoElement.load();
            }
        });
    },
    
    // 释放未使用的资源
    releaseUnusedResources: function() {
        console.log('释放未使用的视频资源');
        
        const videos = document.querySelectorAll('video:not([data-keep-loaded])');
        videos.forEach(video => {
            // 跳过当前正在播放的视频
            if (!video.paused) return;
            
            // 暂停并清空源
            video.pause();
            
            // 只在视频不可见时释放资源
            const rect = video.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
            
            if (!isVisible) {
                video.removeAttribute('src');
                video.load(); // 触发浏览器释放资源
                
                // 标记为未加载
                const videoId = video.dataset.videoId;
                if (videoId && this.videoStates[videoId]) {
                    this.videoStates[videoId].loaded = false;
                }
                
                console.log('释放视频资源:', video.src || video.id || '未知视频');
            }
        });
    }
};

// 页面加载完成后的初始化代码
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded - 页面加载完成');
    
    // 立即执行卡片动画
    setTimeout(function() {
        console.log('开始执行卡片动画...');
        const cards = document.querySelectorAll('.value-card');
        const lines = document.querySelectorAll('.connector-line');
        
        if(cards.length > 0) {
            console.log('找到卡片:', cards.length, '连接线:', lines.length);
            
            // 强制设置卡片和连接线初始状态
            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.8s ease';
            });
            
            lines.forEach(line => {
                line.style.height = '0';
                line.style.opacity = '0';
                line.style.transition = 'all 0.6s ease';
            });
            
            // 执行动画
            setTimeout(() => {
                console.log('显示第一张卡片');
                if(cards[0]) {
                    cards[0].style.opacity = '1';
                    cards[0].style.transform = 'translateY(0)';
                }
                
                // 第一条连接线
                setTimeout(() => {
                    console.log('显示第一条连接线');
                    if(lines[0]) {
                        lines[0].style.opacity = '1';
                        lines[0].style.height = '40px';
                    }
                    
                    // 第二张卡片
                    setTimeout(() => {
                        console.log('显示第二张卡片');
                        if(cards[1]) {
                            cards[1].style.opacity = '1';
                            cards[1].style.transform = 'translateY(0)';
                        }
                        
                        // 第二条连接线
                        setTimeout(() => {
                            console.log('显示第二条连接线');
                            if(lines[1]) {
                                lines[1].style.opacity = '1';
                                lines[1].style.height = '40px';
                            }
                            
                            // 第三张卡片
                            setTimeout(() => {
                                console.log('显示第三张卡片');
                                if(cards[2]) {
                                    cards[2].style.opacity = '1';
                                    cards[2].style.transform = 'translateY(0)';
                                }
                            }, 800);
                        }, 600);
                    }, 800);
                }, 600);
            }, 500);
        }
    }, 100);

    // 实现标签页切换功能
    initTabSwitching();
    
    // 实现视频交互
    initVideoInteractions();
    
    // 实现滚动监听效果
    initScrollEffects();
    
    // 初始化技术对比工具
    initRoiCalculator();
    
    // 初始化服务包交互
    initServicePackages();
});

/**
 * 初始化GSAP动画
 */
function initGsapAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // 头部与Hero区域动画
    const heroTl = gsap.timeline();
    
    heroTl.from('.main-title', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out'
    }).from('.subtitle', {
        duration: 0.8,
        y: 20,
        opacity: 0,
        ease: 'power3.out'
    }, '-=0.7').from('.hero-cta', {
        duration: 0.8,
        y: 15,
        opacity: 0,
        ease: 'power2.out'
    }, '-=0.5');
    
    // 背景数字人动画延迟显示
    gsap.from('.digital-human-background', {
        duration: 1.2,
        opacity: 0,
        y: 50,
        ease: 'power2.out',
        delay: 0.5
    });
    
    // 视频控制功能
    function initVideoControls() {
        const caseVideo = document.getElementById('case-video');
        const playButton = document.getElementById('video-play-button');
        
        if (playButton && caseVideo) {
            // 点击播放按钮
            playButton.addEventListener('click', function() {
                // 尝试播放视频
                const playPromise = caseVideo.play();
                
                // 处理播放可能的错误
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        // 播放成功
                        this.style.display = 'none';
                        console.log('视频开始播放');
                    })
                    .catch(error => {
                        // 播放失败 (通常是自动播放策略阻止)
                        console.error('播放错误:', error);
                        // 尝试静音播放
                        caseVideo.muted = true;
                        caseVideo.play().then(() => {
                            this.style.display = 'none';
                            console.log('静音播放成功');
                        }).catch(e => {
                            console.error('静音播放失败:', e);
                        });
                    });
                }
            });
            
            // 添加点击视频区域播放功能
            caseVideo.addEventListener('click', function() {
                if (this.paused) {
                    this.play();
                    if (playButton) playButton.style.display = 'none';
                } else {
                    this.pause();
                    if (playButton) playButton.style.display = 'flex';
                }
            });
            
            // 视频结束后显示播放按钮
            caseVideo.addEventListener('ended', function() {
                console.log('视频播放结束');
                playButton.style.display = 'flex';
            });
            
            // 视频暂停后显示播放按钮
            caseVideo.addEventListener('pause', function() {
                if (!this.ended) {
                    console.log('视频已暂停');
                    playButton.style.display = 'flex';
                }
            });
            
            // 添加视频错误处理
            caseVideo.addEventListener('error', function(e) {
                console.error('视频错误:', this.error);
                alert('视频加载失败，请刷新页面重试');
            });
            
            // 直接初始化视频动画
            animateVideoSection();
        }
    }
    
    // 页面加载时启动动画和功能
    document.addEventListener('DOMContentLoaded', function() {
        // 初始化视频控制
        initVideoControls();
        
        // 视频区域动画
        animateVideoSection();
    });
    
    // 视频区域动画
    function animateVideoSection() {
        console.log('启动视频区域动画');
        const videoSection = document.querySelector('.real-case-section');
        if (!videoSection) {
            console.warn('未找到视频区域元素');
            return;
        }
        
        // 使用基本的CSS动画，不依赖GSAP
        // 首先设置初始状态
        const elements = {
            title: videoSection.querySelector('.case-title'),
            video: videoSection.querySelector('.vertical-video'),
            caption: videoSection.querySelector('.video-caption'),
            insight: videoSection.querySelector('.founder-insight'),
            points: Array.from(videoSection.querySelectorAll('.insight-point')),
            value: videoSection.querySelector('.value-proposition'),
            highlight: videoSection.querySelector('.value-highlight')
        };
        
        // 设置初始状态
        if (elements.title) {
            elements.title.style.opacity = '0';
            elements.title.style.transform = 'translateY(30px)';
            elements.title.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }
        
        if (elements.video) {
            elements.video.style.opacity = '0';
            elements.video.style.transform = 'translateY(40px) scale(0.95)';
            elements.video.style.transition = 'opacity 1s ease, transform 1s ease';
        }
        
        if (elements.caption) {
            elements.caption.style.opacity = '0';
            elements.caption.style.transform = 'translateY(20px)';
            elements.caption.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
        
        if (elements.insight) {
            elements.insight.style.opacity = '0';
            elements.insight.style.transform = 'translateY(40px)';
            elements.insight.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }
        
        elements.points.forEach(point => {
            point.style.opacity = '0';
            point.style.transform = 'translateX(-20px)';
            point.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        if (elements.value) {
            elements.value.style.opacity = '0';
            elements.value.style.transform = 'translateY(20px)';
            elements.value.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        }
        
        if (elements.highlight) {
            elements.highlight.style.opacity = '0';
            elements.highlight.style.transform = 'translateY(10px)';
            elements.highlight.style.transition = 'opacity 1s ease, transform 1s ease, background-color 1s ease';
        }
        
        // 添加监听器，当元素进入视口时触发动画
        function handleIntersection(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('视频区域进入视口，开始动画');
                    startAnimation();
                    observer.unobserve(entry.target);
                }
            });
        }
        
        // 创建观察器
        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.2
        });
        
        // 开始观察
        observer.observe(videoSection);
        
        // 动画顺序
        function startAnimation() {
            // 标题
            setTimeout(() => {
                if (elements.title) {
                    elements.title.style.opacity = '1';
                    elements.title.style.transform = 'translateY(0)';
                }
            }, 200);
            
            // 视频
            setTimeout(() => {
                if (elements.video) {
                    elements.video.style.opacity = '1';
                    elements.video.style.transform = 'translateY(0) scale(1)';
                }
            }, 600);
            
            // 视频说明
            setTimeout(() => {
                if (elements.caption) {
                    elements.caption.style.opacity = '1';
                    elements.caption.style.transform = 'translateY(0)';
                }
            }, 900);
            
            // 创始人介绍
            setTimeout(() => {
                if (elements.insight) {
                    elements.insight.style.opacity = '1';
                    elements.insight.style.transform = 'translateY(0)';
                }
            }, 1200);
            
            // 要点
            elements.points.forEach((point, index) => {
                setTimeout(() => {
                    point.style.opacity = '1';
                    point.style.transform = 'translateX(0)';
                }, 1500 + index * 200);
            });
            
            // 价值主张
            setTimeout(() => {
                if (elements.value) {
                    elements.value.style.opacity = '1';
                    elements.value.style.transform = 'translateY(0)';
                }
            }, 2200);
            
            // 价值亮点
            setTimeout(() => {
                if (elements.highlight) {
                    elements.highlight.style.opacity = '1';
                    elements.highlight.style.transform = 'translateY(0)';
                    elements.highlight.style.backgroundColor = 'rgba(26, 86, 219, 0.1)';
                }
            }, 2400);
        }
    }
    
    // 行业切入部分卡片动画
    gsap.from('#industry-section .section-title, #industry-section .section-subtitle', {
        scrollTrigger: {
            trigger: '#industry-section',
            start: 'top 80%',
        },
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.2,
        ease: 'power2.out'
    });
    
    gsap.from('.industry-grid .feature-card', {
        scrollTrigger: {
            trigger: '.industry-grid',
            start: 'top 80%',
        },
        duration: 0.8,
        y: 40,
        opacity: 0,
        stagger: 0.3,
        ease: 'power2.out'
    });
    
    // 解决方案部分的飞轮动画
    if (document.querySelector('.flywheel-placeholder')) {
        gsap.to('.flywheel-placeholder', {
            rotation: 360,
            duration: 20,
            repeat: -1,
            ease: 'linear'
        });
    }
    
    // 页面滚动触发动画
    if (typeof ScrollTrigger !== 'undefined') {
        // 解决方案部分
        gsap.from('#solution-section .section-title, #solution-section .section-subtitle', {
            scrollTrigger: {
                trigger: '#solution-section',
                start: 'top 80%',
            },
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.2,
            ease: 'power2.out'
        });
        
        gsap.from('.solution-grid .feature-card', {
            scrollTrigger: {
                trigger: '.solution-grid',
                start: 'top 80%',
            },
            duration: 0.8,
            y: 40,
            opacity: 0,
            stagger: 0.3,
            ease: 'power2.out'
        });
        
        // 技术护城河部分
        gsap.from('#technology-section .section-title, #technology-section .section-subtitle', {
            scrollTrigger: {
                trigger: '#technology-section',
                start: 'top 80%',
            },
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.2,
            ease: 'power2.out'
        });
        
        gsap.from('.difference-item', {
            scrollTrigger: {
                trigger: '.tech-difference',
                start: 'top 80%',
            },
            duration: 0.7,
            x: -30,
            opacity: 0,
            stagger: 0.2,
            ease: 'power2.out'
        });
        
        gsap.from('.philosophy-core', {
            scrollTrigger: {
                trigger: '.brand-philosophy',
                start: 'top 80%',
            },
            duration: 0.8,
            y: 20,
            opacity: 0,
            ease: 'back.out(1.2)'
        });
        
        // 案例部分
        gsap.from('#case-section .section-title, #case-section .section-subtitle', {
            scrollTrigger: {
                trigger: '#case-section',
                start: 'top 80%',
            },
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.2,
            ease: 'power2.out'
        });
        
        gsap.from('.case-tabs', {
            scrollTrigger: {
                trigger: '.case-tabs',
                start: 'top 85%',
            },
            duration: 0.6,
            y: 20,
            opacity: 0,
            ease: 'power2.out'
        });
        
        gsap.from('.insight-card', {
            scrollTrigger: {
                trigger: '.insight-cards',
                start: 'top 80%',
            },
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.15,
            ease: 'power2.out'
        });
        
        gsap.from('.case-action', {
            scrollTrigger: {
                trigger: '.case-action',
                start: 'top 85%',
            },
            duration: 0.6,
            y: 20,
            opacity: 0,
            ease: 'power2.out'
        });
        
        // 体验闭环部分
        gsap.from('#experience-section .section-title, #experience-section .section-subtitle', {
            scrollTrigger: {
                trigger: '#experience-section',
                start: 'top 80%',
            },
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.2,
            ease: 'power2.out'
        });
        
        gsap.from('.experience-stages .stage', {
            scrollTrigger: {
                trigger: '.experience-stages',
                start: 'top 80%',
            },
            duration: 0.7,
            y: 40,
            opacity: 0,
            stagger: 0.15,
            ease: 'power2.out'
        });
        
        gsap.from('.package-card', {
            scrollTrigger: {
                trigger: '.package-section',
                start: 'top 80%',
            },
            duration: 0.7,
            y: 30,
            opacity: 0,
            stagger: 0.2,
            ease: 'power2.out'
        });
        
        // 品牌记忆点部分
        gsap.from('#brand-section .section-title, #brand-section .section-subtitle', {
            scrollTrigger: {
                trigger: '#brand-section',
                start: 'top 80%',
            },
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.2,
            ease: 'power2.out'
        });
        
        gsap.from('.visual-element', {
            scrollTrigger: {
                trigger: '.visual-hammer',
                start: 'top 80%',
            },
            duration: 0.7,
            x: -30,
            opacity: 0,
            stagger: 0.2,
            ease: 'power2.out'
        });
        
        gsap.from('.verbal-element', {
            scrollTrigger: {
                trigger: '.verbal-system',
                start: 'top 80%',
            },
            duration: 0.7,
            x: 30,
            opacity: 0,
            stagger: 0.2,
            ease: 'power2.out'
        });
        
        gsap.from('.contact-action', {
            scrollTrigger: {
                trigger: '.contact-action',
                start: 'top 85%',
            },
            duration: 0.6,
            y: 20,
            opacity: 0,
            ease: 'power2.out'
        });
        
        // 联系我们部分
        gsap.from('#contact .section-title, #contact .section-subtitle', {
            scrollTrigger: {
                trigger: '#contact',
                start: 'top 85%',
            },
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.2,
            ease: 'power2.out'
        });
        
        gsap.from('.contact-form .form-group', {
            scrollTrigger: {
                trigger: '.contact-form',
                start: 'top 80%',
            },
            duration: 0.5,
            y: 20,
            opacity: 0,
            stagger: 0.1,
            ease: 'power2.out'
        });
    }
}

/**
 * 实现标签页切换功能
 */
function initTabSwitching() {
    // 案例标签页切换
    const tabButtons = document.querySelectorAll('.tab-button');
    if (tabButtons.length) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // 这部分在Vue中已经处理，这里是为了非Vue环境准备
                // 获取当前激活的标签
                const activeTab = this.getAttribute('data-tab');
                
                // 移除所有标签的激活状态
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // 添加当前标签的激活状态
                this.classList.add('active');
                
                // 显示对应的内容
                const caseDetails = document.querySelectorAll('.case-detail');
                caseDetails.forEach(detail => {
                    if (detail.getAttribute('data-tab') === activeTab) {
                        detail.style.display = 'block';
                    } else {
                        detail.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // 视频分类标签切换
    const categoryTabs = document.querySelectorAll('.category-tab');
    if (categoryTabs.length) {
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // 移除所有标签的激活状态
                categoryTabs.forEach(t => t.classList.remove('active'));
                
                // 添加当前标签的激活状态
                this.classList.add('active');
                
                // 获取当前分类
                const category = this.getAttribute('data-category');
                
                // 这里可以添加视频切换逻辑
                // 例如从后端加载对应分类的视频
                console.log('Loading videos for category:', category);
                
                // 模拟视频切换效果
                const videoThumbnails = document.querySelectorAll('.video-thumbnail');
                if (videoThumbnails.length) {
                    videoThumbnails.forEach(thumb => {
                        if (thumb.getAttribute('data-category') === category) {
                            thumb.classList.add('active');
                            gsap.from(thumb, {
                                duration: 0.5,
                                opacity: 0,
                                scale: 0.95,
                                ease: 'power2.out'
                            });
                        } else {
                            thumb.classList.remove('active');
                        }
                    });
                }
            });
        });
    }
}

/**
 * 实现视频交互功能
 */
function initVideoInteractions() {
    // 视频缩略图点击处理
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    if (videoThumbnails.length) {
        videoThumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const videoTitle = this.querySelector('.stage-desc').textContent;
                
                // 创建视频弹出层
                const modalHTML = `
                    <div class="video-modal">
                        <div class="modal-overlay"></div>
                        <div class="modal-content">
                            <div class="modal-header">
                                <h3>${videoTitle}</h3>
                                <button class="modal-close">&times;</button>
                            </div>
                            <div class="modal-body">
                                <div class="video-placeholder">
                                    <p>视频加载中...</p>
                                    <p><small>（实际项目中这里会播放真实视频）</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                // 添加到页面
                document.body.insertAdjacentHTML('beforeend', modalHTML);
                
                // 添加关闭功能
                setTimeout(() => {
                    const modal = document.querySelector('.video-modal');
                    const closeBtn = modal.querySelector('.modal-close');
                    const overlay = modal.querySelector('.modal-overlay');
                    
                    closeBtn.addEventListener('click', () => {
                        document.body.removeChild(modal);
                    });
                    
                    overlay.addEventListener('click', () => {
                        document.body.removeChild(modal);
                    });
                    
                    // 添加模态框样式
                    const style = document.createElement('style');
                    style.textContent = `
                        .video-modal {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            z-index: 1000;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        
                        .modal-overlay {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background-color: rgba(0, 0, 0, 0.75);
                        }
                        
                        .modal-content {
                            position: relative;
                            width: 80%;
                            max-width: 800px;
                            background-color: white;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                        }
                        
                        .modal-header {
                            padding: 16px;
                            background-color: #f5f5f5;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        
                        .modal-header h3 {
                            margin: 0;
                            font-size: 18px;
                        }
                        
                        .modal-close {
                            background: none;
                            border: none;
                            font-size: 24px;
                            cursor: pointer;
                            color: #666;
                        }
                        
                        .modal-body {
                            padding: 20px;
                        }
                        
                        .video-placeholder {
                            background-color: #eee;
                            height: 400px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            text-align: center;
                            color: #666;
                        }
                    `;
                    document.head.appendChild(style);
                }, 10);
            });
        });
    }
}

/**
 * 实现滚动监听效果
 */
function initScrollEffects() {
    // 创建导航快捷锚点
    createNavigationAnchors();
    
    // 监听页面滚动，实现导航锚点高亮效果
    window.addEventListener('scroll', debounce(function() {
        // 获取当前滚动位置
        const scrollPosition = window.scrollY + 80;
        
        // 获取所有部分
        const sections = document.querySelectorAll('.section');
        
        // 检查当前位置属于哪个部分
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // 获取当前部分ID
                const sectionId = section.getAttribute('id');
                
                // 高亮对应的导航锚点
                const navAnchors = document.querySelectorAll('.nav-anchor');
                navAnchors.forEach(anchor => {
                    if (anchor.getAttribute('data-target') === sectionId) {
                        anchor.classList.add('active');
                    } else {
                        anchor.classList.remove('active');
                    }
                });
            }
        });
    }, 100));
    
    // 平滑滚动功能
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // 考虑导航栏高度
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 创建页面导航锚点
 */
function createNavigationAnchors() {
    // 如果已存在导航锚点，则不重复创建
    if (document.querySelector('.nav-anchors')) return;
    
    // 创建导航锚点容器
    const anchorsHTML = `
        <div class="nav-anchors">
            <div class="nav-anchor" data-target="hero-section"></div>
            <div class="nav-anchor" data-target="industry-section"></div>
            <div class="nav-anchor" data-target="solution-section"></div>
            <div class="nav-anchor" data-target="technology-section"></div>
            <div class="nav-anchor" data-target="case-section"></div>
            <div class="nav-anchor" data-target="experience-section"></div>
            <div class="nav-anchor" data-target="brand-section"></div>
        </div>
    `;
    
    // 添加到页面
    document.body.insertAdjacentHTML('beforeend', anchorsHTML);
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .nav-anchors {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 90;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .nav-anchor {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.2);
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .nav-anchor:hover {
            background-color: rgba(51, 102, 255, 0.6);
            transform: scale(1.2);
        }
        
        .nav-anchor.active {
            background-color: rgba(51, 102, 255, 1);
            transform: scale(1.3);
        }
        
        @media (max-width: 768px) {
            .nav-anchors {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 添加点击事件
    const navAnchors = document.querySelectorAll('.nav-anchor');
    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 60,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 初始化ROI计算器功能
 */
function initRoiCalculator() {
    const calculatorBtn = document.querySelector('.calculator-btn');
    if (calculatorBtn) {
        calculatorBtn.addEventListener('click', function() {
            // 创建ROI计算器弹出层
            const modalHTML = `
                <div class="calculator-modal">
                    <div class="modal-overlay"></div>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>数字人ROI计算器</h3>
                            <button class="modal-close">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="calculator-form">
                                <div class="form-group">
                                    <label for="company-size">企业规模（员工数）</label>
                                    <input type="number" id="company-size" placeholder="例如：100">
                                </div>
                                <div class="form-group">
                                    <label for="monthly-budget">月度预算（人民币）</label>
                                    <input type="number" id="monthly-budget" placeholder="例如：50000">
                                </div>
                                <div class="form-group">
                                    <label for="application-scenario">主要应用场景</label>
                                    <select id="application-scenario">
                                        <option value="customer-service">客户服务</option>
                                        <option value="live-streaming">直播带货</option>
                                        <option value="education">教育培训</option>
                                        <option value="government">政务服务</option>
                                    </select>
                                </div>
                                <div class="form-action">
                                    <button class="calculate-btn">计算投资回报</button>
                                </div>
                                <div class="calculator-results" style="display: none;">
                                    <h4>预计ROI分析结果</h4>
                                    <div class="result-item">
                                        <span class="result-label">预计月度节省成本</span>
                                        <span class="result-value" id="cost-saving">-</span>
                                    </div>
                                    <div class="result-item">
                                        <span class="result-label">预计效率提升</span>
                                        <span class="result-value" id="efficiency-boost">-</span>
                                    </div>
                                    <div class="result-item">
                                        <span class="result-label">投资回报周期</span>
                                        <span class="result-value" id="roi-period">-</span>
                                    </div>
                                    <div class="result-notes">
                                        <p>* 以上数据基于行业平均水平估算，实际效果可能因企业情况而异</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // 添加到页面
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            setTimeout(() => {
                // 添加功能和样式
                const modal = document.querySelector('.calculator-modal');
                const closeBtn = modal.querySelector('.modal-close');
                const overlay = modal.querySelector('.modal-overlay');
                const calculateBtn = modal.querySelector('.calculate-btn');
                const resultsDiv = modal.querySelector('.calculator-results');
                
                closeBtn.addEventListener('click', () => {
                    document.body.removeChild(modal);
                });
                
                overlay.addEventListener('click', () => {
                    document.body.removeChild(modal);
                });
                
                calculateBtn.addEventListener('click', () => {
                    // 获取输入值
                    const companySize = document.getElementById('company-size').value || 100;
                    const monthlyBudget = document.getElementById('monthly-budget').value || 50000;
                    const scenario = document.getElementById('application-scenario').value;
                    
                    // 根据不同场景计算ROI（示例计算逻辑）
                    let costSaving, efficiencyBoost, roiPeriod;
                    
                    switch (scenario) {
                        case 'customer-service':
                            costSaving = `¥${Math.round(monthlyBudget * 1.5).toLocaleString()}`;
                            efficiencyBoost = '75%';
                            roiPeriod = '2.5个月';
                            break;
                        case 'live-streaming':
                            costSaving = `¥${Math.round(monthlyBudget * 2.2).toLocaleString()}`;
                            efficiencyBoost = '300%';
                            roiPeriod = '1.8个月';
                            break;
                        case 'education':
                            costSaving = `¥${Math.round(monthlyBudget * 1.3).toLocaleString()}`;
                            efficiencyBoost = '50%';
                            roiPeriod = '3个月';
                            break;
                        case 'government':
                            costSaving = `¥${Math.round(monthlyBudget * 1.2).toLocaleString()}`;
                            efficiencyBoost = '45%';
                            roiPeriod = '3.5个月';
                            break;
                        default:
                            costSaving = `¥${Math.round(monthlyBudget * 1.5).toLocaleString()}`;
                            efficiencyBoost = '60%';
                            roiPeriod = '2.8个月';
                    }
                    
                    // 更新结果
                    document.getElementById('cost-saving').textContent = costSaving;
                    document.getElementById('efficiency-boost').textContent = efficiencyBoost;
                    document.getElementById('roi-period').textContent = roiPeriod;
                    
                    // 显示结果
                    resultsDiv.style.display = 'block';
                    
                    // 结果动画
                    gsap.from('.calculator-results', {
                        duration: 0.5,
                        y: 20,
                        opacity: 0,
                        ease: 'power2.out'
                    });
                });
                
                // 添加样式
                const style = document.createElement('style');
                style.textContent = `
                    .calculator-modal {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 1000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    
                    .modal-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.75);
                    }
                    
                    .modal-content {
                        position: relative;
                        width: 90%;
                        max-width: 600px;
                        background-color: white;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    }
                    
                    .modal-header {
                        padding: 16px;
                        background-color: #f5f5f5;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    
                    .modal-header h3 {
                        margin: 0;
                        font-size: 18px;
                    }
                    
                    .modal-close {
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #666;
                    }
                    
                    .modal-body {
                        padding: 20px;
                    }
                    
                    .calculator-form .form-group {
                        margin-bottom: 16px;
                    }
                    
                    .calculator-form label {
                        display: block;
                        margin-bottom: 8px;
                        font-size: 14px;
                        color: #555;
                    }
                    
                    .calculator-form input,
                    .calculator-form select {
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        font-size: 14px;
                    }
                    
                    .form-action {
                        text-align: center;
                        margin: 20px 0;
                    }
                    
                    .calculate-btn {
                        background-color: #3366ff;
                        color: white;
                        font-size: 16px;
                        font-weight: 600;
                        padding: 10px 30px;
                        border-radius: 6px;
                        border: none;
                        cursor: pointer;
                        transition: all 0.3s;
                    }
                    
                    .calculate-btn:hover {
                        background-color: #0040cb;
                    }
                    
                    .calculator-results {
                        background-color: #f5f8ff;
                        padding: 20px;
                        border-radius: 8px;
                        margin-top: 20px;
                    }
                    
                    .calculator-results h4 {
                        margin-top: 0;
                        margin-bottom: 16px;
                        color: #333;
                    }
                    
                    .result-item {
                        display: flex;
                        justify-content: space-between;
                        padding: 8px 0;
                        border-bottom: 1px dashed #ddd;
                    }
                    
                    .result-label {
                        color: #555;
                    }
                    
                    .result-value {
                        font-weight: 700;
                        color: #3366ff;
                    }
                    
                    .result-notes {
                        margin-top: 16px;
                        font-size: 12px;
                        color: #777;
                    }
                `;
                document.head.appendChild(style);
                
            }, 10);
        });
    }
}

/**
 * 初始化服务包交互功能
 */
function initServicePackages() {
    const packageBtns = document.querySelectorAll('.package-btn');
    if (packageBtns.length) {
        packageBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const packageType = this.closest('.package-card').querySelector('h4').textContent;
                
                // 弹出对话框
                alert(`您选择了"${packageType}"服务包，我们将会联系您进行详细咨询。`);
                
                // 滚动到联系表单
                document.getElementById('contact').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }
    
    // 特惠按钮交互
    const offerBtn = document.querySelector('.offer-btn');
    if (offerBtn) {
        offerBtn.addEventListener('click', function() {
            // 滚动到联系表单
            document.getElementById('contact').scrollIntoView({
                behavior: 'smooth'
            });
            
            // 高亮联系表单
            gsap.to('.contact-form', {
                duration: 0.3,
                backgroundColor: 'rgba(51, 102, 255, 0.1)',
                yoyo: true,
                repeat: 3
            });
        });
    }
}

/**
 * 辅助函数：防抖函数，用于优化滚动等高频率事件
 */
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
} 