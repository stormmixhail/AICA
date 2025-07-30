// 数字人标准对比页面交互逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 初始化变量
    const comparisonRows = document.querySelectorAll('.comparison-table tbody tr:not(.category-row)');
    const backToHome = document.querySelector('.back-to-home');
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    // 为表格行添加鼠标悬停动画
    comparisonRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            // 突出显示当前行
            this.style.transition = 'background-color 0.3s ease';
            this.style.backgroundColor = 'rgba(0, 180, 216, 0.1)';
            
            // 提高文本清晰度
            const cells = this.querySelectorAll('td');
            cells.forEach(cell => {
                cell.style.transition = 'all 0.3s ease';
                cell.style.textShadow = '0 0 1px rgba(255, 255, 255, 0.5)';
            });
        });
        
        row.addEventListener('mouseleave', function() {
            // 恢复默认样式
            this.style.backgroundColor = '';
            
            // 恢复文本样式
            const cells = this.querySelectorAll('td');
            cells.forEach(cell => {
                cell.style.textShadow = '';
            });
        });
    });
    
    // 为返回按钮添加动画效果
    if (backToHome) {
        backToHome.addEventListener('mouseenter', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.transition = 'transform 0.2s ease';
                img.style.transform = 'translateX(-2px)';
            }
        });
        
        backToHome.addEventListener('mouseleave', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = '';
            }
        });
    }
    
    // 为CTA按钮添加动画效果
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.transform = 'translateY(-3px)';
            
            if (this.classList.contains('primary')) {
                this.style.boxShadow = '0 6px 12px rgba(0, 180, 216, 0.4)';
            } else {
                this.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
                this.style.backgroundColor = 'rgba(0, 180, 216, 0.1)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
            
            if (!this.classList.contains('primary')) {
                this.style.backgroundColor = '';
            }
        });
    });
    
    // 滚动到顶部按钮
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            if (backToHome) {
                backToHome.style.opacity = '1';
                backToHome.style.pointerEvents = 'auto';
            }
        } else {
            if (backToHome) {
                backToHome.style.opacity = '0.5';
            }
        }
    });
    
    // 初始化
    if (backToHome) {
        backToHome.style.opacity = '0.5';
        backToHome.style.transition = 'all 0.3s ease';
    }

    // 初始化数据条动画
    initDataBars();
    
    // 初始化技术特色对比动画
    initFeatureBars();
    
    // 数据条动画初始化
    function initDataBars() {
        const aicaCells = document.querySelectorAll('.aica-cell');
        const ordinaryCells = document.querySelectorAll('.ordinary-cell');
        
        // 观察器配置
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        // 创建交叉观察器
        const observer = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 为所有单元格添加数据条
                    if (entry.target.classList.contains('comparison-table')) {
                        addDataBarsToTable();
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, options);
        
        // 观察表格
        const table = document.querySelector('.comparison-table');
        if (table) {
            observer.observe(table);
        }
        
        // 添加数据条到表格
        function addDataBarsToTable() {
            // AICA 单元格数据条
            aicaCells.forEach(cell => {
                // 创建数据条
                const dataBar = document.createElement('div');
                dataBar.className = 'data-bar';
                cell.appendChild(dataBar);
                
                // 根据内容设置宽度
                const text = cell.textContent.trim();
                let width = '80%'; // 默认宽度
                
                if (text.includes('%')) {
                    const match = text.match(/(\d+)/);
                    if (match) {
                        const percent = parseInt(match[0]);
                        width = Math.min(percent, 100) + '%';
                    }
                } else if (text.includes('自动') || text.includes('全') || text.includes('智能')) {
                    width = '90%';
                } else if (text.includes('基础') || text.includes('简单')) {
                    width = '60%';
                }
                
                // 延迟添加宽度以实现动画效果
                setTimeout(() => {
                    dataBar.style.width = width;
                }, 300);
            });
            
            // 普通单元格数据条
            ordinaryCells.forEach(cell => {
                // 创建数据条
                const dataBar = document.createElement('div');
                dataBar.className = 'data-bar';
                cell.appendChild(dataBar);
                
                // 根据内容设置宽度
                const text = cell.textContent.trim();
                let width = '40%'; // 默认宽度
                
                if (text.includes('%')) {
                    const match = text.match(/(\d+)/);
                    if (match) {
                        const percent = parseInt(match[0]);
                        width = Math.min(percent, 50) + '%';
                    }
                } else if (text.includes('不支持') || text.includes('无')) {
                    width = '20%';
                } else if (text.includes('基础') || text.includes('简单')) {
                    width = '40%';
                }
                
                // 延迟添加宽度以实现动画效果
                setTimeout(() => {
                    dataBar.style.width = width;
                }, 300);
            });
        }
    }
    
    // 技术特色对比条动画初始化
    function initFeatureBars() {
        const featureBars = document.querySelectorAll('.feature-bar');
        
        // 观察器配置
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        // 创建交叉观察器
        const observer = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 显示特色对比条
                    if (entry.target.classList.contains('tech-features')) {
                        animateFeatureBars();
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, options);
        
        // 观察特色区域
        const techFeatures = document.querySelector('.tech-features');
        if (techFeatures) {
            observer.observe(techFeatures);
        }
        
        // 为特色对比条添加动画
        function animateFeatureBars() {
            // 获取所有技术特色卡片
            const featureCards = document.querySelectorAll('.tech-feature-card');
            
            // 为每个卡片的条形图添加动画
            featureCards.forEach((card, index) => {
                const aicaBar = card.querySelector('.aica-bar');
                const ordinaryBar = card.querySelector('.ordinary-bar');
                
                // 延迟执行动画以创建序列效果
                setTimeout(() => {
                    if (aicaBar) {
                        const targetWidth = aicaBar.style.width;
                        aicaBar.style.width = '0';
                        setTimeout(() => {
                            aicaBar.style.width = targetWidth;
                        }, 100);
                    }
                    
                    if (ordinaryBar) {
                        const targetWidth = ordinaryBar.style.width;
                        ordinaryBar.style.width = '0';
                        setTimeout(() => {
                            ordinaryBar.style.width = targetWidth;
                        }, 600);
                    }
                }, index * 300);
            });
        }
    }
}); 