// 沉浸式页面交互逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 初始化变量
    let currentScene = 1;
    const totalScenes = 5;
    let isScrolling = false;
    let touchStartY = 0;
    let touchEndY = 0;
    
    // 获取DOM元素
    const scenes = document.querySelectorAll('.scene');
    const hotspots = document.querySelectorAll('.hotspot');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    // 初始化页面
    initPage();
    
    // 初始化函数
    function initPage() {
        // 显示第一个场景
        showScene(1);
        
        // 添加滚轮事件监听
        window.addEventListener('wheel', handleScroll);
        
        // 添加触摸事件监听（移动端）
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);
        
        // 添加热点交互事件
        hotspots.forEach(hotspot => {
            hotspot.addEventListener('mouseenter', handleHotspotHover);
            hotspot.addEventListener('mouseleave', handleHotspotLeave);
            
            // 为移动设备添加点击事件
            hotspot.addEventListener('click', function(event) {
                // 阻止事件冒泡
                event.stopPropagation();
                
                // 切换热点详情显示
                toggleHotspotDetail(this);
            });
        });
        
        // 添加滚动指示器点击事件
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                navigateToScene(currentScene + 1);
            });
        }
        
        // 添加价格卡片动画
        initPricingCards();
        
        // 添加成就卡片动画
        initAchievementCards();
        
        // 添加客户反馈点击事件
        initTestimonials();
        
        // 监听滚动以触发动画
        window.addEventListener('scroll', handleScrollAnimation);
        
        // 初始触发一次动画检查
        setTimeout(checkElementsInView, 500);
        
        // 添加场景元素的动画效果
        animateSceneElements();
    }
    
    // 处理滚轮事件
    function handleScroll(event) {
        if (isScrolling) return;
        
        isScrolling = true;
        
        // 判断滚动方向
        if (event.deltaY > 0) {
            // 向下滚动，前进到下一个场景
            if (currentScene === totalScenes) {
                // 如果已经是最后一个场景，显示404错误
                showError404();
            } else {
                navigateToScene(currentScene + 1);
            }
        } else {
            // 向上滚动，后退到上一个场景
            navigateToScene(currentScene - 1);
        }
        
        // 防抖，避免连续滚动
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }
    
    // 处理触摸开始事件
    function handleTouchStart(event) {
        touchStartY = event.touches[0].clientY;
    }
    
    // 处理触摸结束事件
    function handleTouchEnd(event) {
        if (isScrolling) return;
        
        touchEndY = event.changedTouches[0].clientY;
        const touchDiff = touchStartY - touchEndY;
        
        // 判断滑动方向和距离是否足够触发翻页
        if (Math.abs(touchDiff) > 50) {
            isScrolling = true;
            
            if (touchDiff > 0) {
                // 向上滑动，前进到下一个场景
                if (currentScene === totalScenes) {
                    // 如果已经是最后一个场景，显示404错误
                    showError404();
                } else {
                    navigateToScene(currentScene + 1);
                }
            } else {
                // 向下滑动，后退到上一个场景
                navigateToScene(currentScene - 1);
            }
            
            // 防抖，避免连续滚动
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    }
    
    // 导航到指定场景
    function navigateToScene(sceneNumber) {
        if (sceneNumber < 1 || sceneNumber > totalScenes) {
            // 如果尝试导航到超出范围的场景，显示404错误
            if (sceneNumber > totalScenes) {
                showError404();
            }
            return;
        }
        
        // 更新当前场景
        currentScene = sceneNumber;
        
        // 显示当前场景
        showScene(currentScene);
        
        // 更新URL hash（可选）
        window.location.hash = `scene-${currentScene}`;
        
        // 检查元素是否在视图中以触发动画
        checkElementsInView();
        
        // 添加场景切换的动画效果
        document.body.classList.add('scene-transition');
        setTimeout(() => {
            document.body.classList.remove('scene-transition');
        }, 1000);
    }
    
    // 显示404错误页面
    function showError404() {
        const errorPage = document.getElementById('error-404');
        if (errorPage) {
            errorPage.classList.add('visible');
        }
    }
    
    // 隐藏404错误页面
    window.hideError404 = function() {
        const errorPage = document.getElementById('error-404');
        if (errorPage) {
            errorPage.classList.remove('visible');
            // 回到第一个场景
            navigateToScene(1);
        }
    }
    
    // 显示指定场景
    function showScene(sceneNumber) {
        // 隐藏所有场景
        scenes.forEach((scene, index) => {
            scene.style.display = 'none';
        });
        
        // 显示指定场景
        if (scenes[sceneNumber - 1]) {
            scenes[sceneNumber - 1].style.display = 'flex';
        }
        
        // 更新滚动指示器
        updateScrollIndicator();
        
        // 添加动画效果
        animateSceneElements();
    }
    
    // 处理热点悬停事件
    function handleHotspotHover(event) {
        const hotspot = event.currentTarget;
        hotspot.classList.add('active');
    }
    
    // 处理热点离开事件
    function handleHotspotLeave(event) {
        const hotspot = event.currentTarget;
        hotspot.classList.remove('active');
    }
    
    // 切换热点详情显示
    function toggleHotspotDetail(hotspot) {
        // 关闭其他热点详情
        document.querySelectorAll('.hotspot.showing-detail').forEach(item => {
            if (item !== hotspot) {
                item.classList.remove('showing-detail');
            }
        });
        
        // 切换当前热点详情
        hotspot.classList.toggle('showing-detail');
    }
    
    // 更新滚动指示器
    function updateScrollIndicator() {
        if (!scrollIndicator) return;
        
        // 如果是最后一个场景，隐藏滚动指示器
        if (currentScene === totalScenes) {
            scrollIndicator.style.display = 'none';
        } else {
            scrollIndicator.style.display = 'flex';
        }
    }
    
    // 初始化价格卡片
    function initPricingCards() {
        const pricingCards = document.querySelectorAll('.pricing-card');
        pricingCards.forEach((card, index) => {
            card.style.setProperty('--delay', index);
        });
    }
    
    // 初始化成就卡片
    function initAchievementCards() {
        const achievementCards = document.querySelectorAll('.achievement-card');
        achievementCards.forEach((card, index) => {
            card.style.setProperty('--delay', index);
        });
    }
    
    // 初始化客户反馈
    function initTestimonials() {
        const dots = document.querySelectorAll('.testimonial-dots .dot');
        const testimonials = document.querySelectorAll('.testimonial');
        
        if (dots.length === 0 || testimonials.length === 0) return;
        
        // 隐藏除第一个外的所有testimonial
        testimonials.forEach((testimonial, index) => {
            if (index !== 0) {
                testimonial.style.display = 'none';
            }
        });
        
        // 为每个点添加点击事件
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                // 更新活动点
                dots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                
                // 显示对应的testimonial
                testimonials.forEach((t, i) => {
                    t.style.display = i === index ? 'block' : 'none';
                });
            });
        });
    }
    
    // 处理滚动动画
    function handleScrollAnimation() {
        checkElementsInView();
    }
    
    // 检查元素是否在视图中以触发动画
    function checkElementsInView() {
        // 检查标题和副标题
        const titles = document.querySelectorAll('.scene-title, .scene-subtitle, .scene-quote');
        titles.forEach(title => {
            if (isElementInViewport(title)) {
                title.classList.add('visible');
            }
        });
        
        // 检查流程步骤和箭头
        const processElements = document.querySelectorAll('.process-step, .process-arrow');
        processElements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('visible');
            }
        });
        
        // 检查CTA按钮
        const ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            if (isElementInViewport(button)) {
                button.classList.add('visible');
            }
        });
    }
    
    // 判断元素是否在视图中
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // 添加场景元素的动画效果
    function animateSceneElements() {
        // 为当前场景的元素添加动画
        const currentSceneElement = scenes[currentScene - 1];
        if (currentSceneElement) {
            // 找到当前场景中的所有可动画元素
            const animElements = currentSceneElement.querySelectorAll('.scene-title, .scene-subtitle, .scene-quote, .process-step, .process-arrow, .cta-button, .hotspot');
            
            // 为每个元素添加可见类，并设置延迟
            animElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('visible');
                }, 200 * index); // 每个元素延迟200ms
            });
        }
    }
}); 