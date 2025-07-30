// 强制刷新页面缓存
(function() {
    // 添加时间戳参数到当前页面URL
    function forceRefresh() {
        const timestamp = new Date().getTime();
        const currentUrl = window.location.href;
        const separator = currentUrl.indexOf('?') !== -1 ? '&' : '?';
        
        // 判断URL中是否已有refresh参数
        if (currentUrl.indexOf('refresh=') > -1) {
            // 已有参数，替换为新的时间戳
            // 暂时注释掉自动刷新功能
            // window.location.href = currentUrl.replace(/refresh=\d+/, 'refresh=' + timestamp);
            console.log('已有refresh参数，不执行强制刷新');
        } else {
            // 没有参数，添加新的时间戳
            // 暂时注释掉自动刷新功能
            // window.location.href = currentUrl + separator + 'refresh=' + timestamp;
            console.log('添加refresh参数但不执行强制刷新');
        }
    }
    
    // 如果URL包含force_refresh参数，则执行强制刷新
    if (window.location.href.indexOf('force_refresh=true') > -1) {
        // 清除浏览器缓存
        window.localStorage.clear();
        window.sessionStorage.clear();
        
        // 强制刷新功能暂时注释
        // setTimeout(forceRefresh, 100);
        console.log('检测到force_refresh参数，但暂时不执行强制刷新');
    }
})(); 