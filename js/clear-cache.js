// 强制清除缓存的脚本
(function() {
    // 为所有资源添加随机查询参数
    function addRandomQueryToLinks() {
        const timestamp = new Date().getTime();
        const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
        const scriptElements = document.querySelectorAll('script[src]');
        
        // 为CSS文件添加随机参数
        linkElements.forEach(link => {
            if (link.href) {
                link.href = updateQueryStringParameter(link.href, 'cache_bust', timestamp);
            }
        });
        
        // 为JS文件添加随机参数
        scriptElements.forEach(script => {
            if (script.src) {
                script.src = updateQueryStringParameter(script.src, 'cache_bust', timestamp);
            }
        });
    }
    
    // 更新URL查询参数
    function updateQueryStringParameter(uri, key, value) {
        const re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        const separator = uri.indexOf('?') !== -1 ? "&" : "?";
        
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        } else {
            return uri + separator + key + "=" + value;
        }
    }
    
    // 页面加载时执行
    window.addEventListener('load', addRandomQueryToLinks);
    
    // 尝试在DOM内容加载时就执行
    document.addEventListener('DOMContentLoaded', addRandomQueryToLinks);
    
    // 立即执行一次
    addRandomQueryToLinks();
    
    // 强制清除所有缓存，但不重定向页面
    if (window.location.href.indexOf('clear_cache=true') > -1) {
        // 清除应用缓存
        if (window.applicationCache) {
            try {
                window.applicationCache.swapCache();
            } catch (e) {
                console.log('应用缓存清除失败:', e);
            }
        }
        
        // 清除localStorage
        try {
            localStorage.clear();
        } catch (e) {
            console.log('localStorage清除失败:', e);
        }
        
        // 清除sessionStorage
        try {
            sessionStorage.clear();
        } catch (e) {
            console.log('sessionStorage清除失败:', e);
        }
        
        console.log('Cache cleared at:', new Date().toISOString());
    }
})(); 