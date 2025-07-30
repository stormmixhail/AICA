/**
 * 功能区客户端工具
 * 用于在前端页面中获取和应用功能区配置
 */

class FunctionalAreaClient {
    constructor(config = {}) {
        this.apiBaseUrl = config.apiBaseUrl || CONFIG.API_BASE_URL;
        this.cache = {};
        this.cacheExpiry = config.cacheExpiry || 5 * 60 * 1000; // 默认缓存5分钟
        this.cacheTimestamps = {};
        this.defaultConfig = config.defaultConfig || {};
        this.initialized = false;
    }

    /**
     * 初始化功能区客户端
     * @returns {Promise<boolean>} 是否初始化成功
     */
    async init() {
        try {
            // 获取所有可用的功能区
            await this.getAllFunctionalAreas();
            this.initialized = true;
            return true;
        } catch (error) {
            console.error('功能区客户端初始化失败:', error);
            return false;
        }
    }

    /**
     * 获取所有功能区
     * @returns {Promise<Array>} 功能区列表
     */
    async getAllFunctionalAreas() {
        try {
            // 检查是否有有效缓存
            if (this._isValidCache('allAreas')) {
                return this.cache.allAreas;
            }

            const token = localStorage.getItem(CONFIG.TOKEN_KEY);
            const headers = {
                'Content-Type': 'application/json'
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${this.apiBaseUrl}/functional-areas`, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '获取功能区列表失败');
            }

            const data = await response.json();
            
            if (data && data.data) {
                // 更新缓存
                this.cache.allAreas = data.data;
                this.cacheTimestamps.allAreas = Date.now();
                return data.data;
            }

            return [];
        } catch (error) {
            console.error('获取功能区列表错误:', error);
            return [];
        }
    }

    /**
     * 根据代码获取功能区
     * @param {string} code 功能区代码
     * @returns {Promise<Object|null>} 功能区配置
     */
    async getAreaByCode(code) {
        try {
            // 检查是否有有效缓存
            const cacheKey = `area_${code}`;
            if (this._isValidCache(cacheKey)) {
                return this.cache[cacheKey];
            }

            const token = localStorage.getItem(CONFIG.TOKEN_KEY);
            const headers = {
                'Content-Type': 'application/json'
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${this.apiBaseUrl}/functional-areas/code/${code}`, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                if (response.status === 404) {
                    // 功能区不存在，返回默认配置
                    return this.defaultConfig[code] || null;
                }
                const errorData = await response.json();
                throw new Error(errorData.message || '获取功能区失败');
            }

            const data = await response.json();
            
            if (data && data.data) {
                // 更新缓存
                this.cache[cacheKey] = data.data;
                this.cacheTimestamps[cacheKey] = Date.now();
                return data.data;
            }

            return null;
        } catch (error) {
            console.error(`获取功能区[${code}]错误:`, error);
            // 出错时返回默认配置
            return this.defaultConfig[code] || null;
        }
    }

    /**
     * 应用功能区配置到DOM元素
     * @param {string} code 功能区代码 
     * @param {string|Element} selector 选择器或DOM元素
     * @param {Function} callback 回调函数，接收配置作为参数
     */
    async applyArea(code, selector, callback) {
        // 检查功能区是否存在且已启用
        const area = await this.getAreaByCode(code);
        
        if (!area || !area.isEnabled) {
            // 功能区不存在或未启用，隐藏相关元素
            const element = typeof selector === 'string' 
                ? document.querySelector(selector) 
                : selector;
            
            if (element) {
                element.style.display = 'none';
            }
            return null;
        }

        // 功能区存在且已启用，调用回调函数应用配置
        if (typeof callback === 'function') {
            const element = typeof selector === 'string' 
                ? document.querySelector(selector) 
                : selector;
            
            if (element) {
                element.style.display = '';
                callback(area, element);
            }
        }

        return area;
    }

    /**
     * 检查缓存是否有效
     * @param {string} key 缓存键
     * @returns {boolean} 是否有效
     * @private
     */
    _isValidCache(key) {
        if (!this.cache[key] || !this.cacheTimestamps[key]) {
            return false;
        }

        const now = Date.now();
        const timestamp = this.cacheTimestamps[key];
        
        return now - timestamp < this.cacheExpiry;
    }

    /**
     * 清除缓存
     * @param {string} [key] 特定的缓存键，如果不提供则清除所有缓存
     */
    clearCache(key) {
        if (key) {
            delete this.cache[key];
            delete this.cacheTimestamps[key];
        } else {
            this.cache = {};
            this.cacheTimestamps = {};
        }
    }
}

// 导出功能区客户端实例
window.FunctionalAreaClient = FunctionalAreaClient;

// 创建默认实例
window.functionalArea = new FunctionalAreaClient(); 