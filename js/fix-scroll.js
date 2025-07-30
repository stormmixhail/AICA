/**
 * 全面修复页面滚动问题
 * 防止页面自动回滚到顶部
 */
(function() {
    // 保存滚动位置
    let lastScrollPosition = 0;
    let ticking = false;
    
    function saveScrollPosition() {
        lastScrollPosition = window.scrollY;
        localStorage.setItem('scrollPosition', lastScrollPosition);
        ticking = false;
    }
    
    // 监听滚动事件，记录位置
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                saveScrollPosition();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // 页面加载时执行
    window.addEventListener('load', function() {
        console.log('彻底修复滚动问题脚本已加载');
        
        // 禁止自动滚动到顶部
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        
        // 恢复之前的滚动位置
        let savedPosition = localStorage.getItem('scrollPosition');
        if (savedPosition) {
            setTimeout(function() {
                window.scrollTo(0, savedPosition);
            }, 100);
        }
        
        // 修复Vue相关的滚动问题
        const vueApp = document.getElementById('app');
        if (vueApp) {
            // Vue应用加载后恢复滚动位置
            const observer = new MutationObserver(function(mutations) {
                setTimeout(function() {
                    let savedPosition = localStorage.getItem('scrollPosition');
                    if (savedPosition) {
                        window.scrollTo(0, savedPosition);
                    }
                }, 100);
            });
            
            observer.observe(vueApp, { 
                childList: true,
                subtree: true,
                attributes: true
            });
        }
        
        // 覆盖原生scrollTo方法，防止自动滚动到顶部
        const originalScrollTo = window.scrollTo;
        window.scrollTo = function(x, y) {
            // 阻止自动滚动到顶部
            if ((x === 0 && y === 0) || 
                (typeof x === 'object' && x !== null && (x.top === 0 || x.top === '0px'))) {
                console.log('阻止了自动滚动到顶部');
                return;
            }
            return originalScrollTo.apply(this, arguments);
        };
        
        // 确保页脚不遮挡内容
        var footer = document.querySelector('.simple-footer');
        var mainContent = document.querySelector('.main-content');
        
        if (footer && mainContent) {
            var footerHeight = footer.offsetHeight;
            mainContent.style.paddingBottom = (footerHeight + 50) + 'px';
        }
        
        // 确保竞争提示区域完全可见
        const competitionAlert = document.querySelector('.competition-alert');
        if (competitionAlert) {
            competitionAlert.style.marginBottom = '100px';
        }
        
        console.log('滚动修复已全面应用 - 防止页面自动回滚');
    });
})(); 