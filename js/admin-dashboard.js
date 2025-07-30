// 导入Vue相关功能
const { createApp, ref, reactive, onMounted, computed, onUnmounted, watch } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

// 面包屑组件
const Breadcrumb = {
    template: '#breadcrumb-template',
    setup() {
        const route = Vue.inject('route');
        
        const breadcrumbMap = {
            '/dashboard': ['首页', '系统概览'],
            '/functional-areas': ['首页', '功能区列表'],
            '/predefined-areas': ['首页', '预定义功能区'],
            '/areas-config': ['首页', '功能区配置'],
            '/areas-preview': ['首页', '功能区预览'],
            '/news-editor': ['首页', '新闻内容编辑'],
            '/business-card-settings': ['首页', '联享名片设置'],
            '/user-list': ['首页', '系统管理', '用户管理'],
            '/roles': ['首页', '系统管理', '角色管理'],
            '/system-logs': ['首页', '系统管理', '系统日志']
        };
        
        const breadcrumbs = computed(() => {
            return breadcrumbMap[route.path] || ['首页'];
        });
        
        return { breadcrumbs };
    }
};

// 仪表盘组件
const Dashboard = {
    template: '#dashboard-template',
    setup() {
        // 状态数据
        const stats = reactive({
            totalUsers: 0,
            totalSessions: 0,
            availableCodes: 0,
            totalAreas: 0
        });
        
        // 图表时间范围选择
        const chartTimeRange = ref('week');
        
        // 最近日志
        const recentLogs = ref([
            { time: '2023-06-01 12:00:00', level: 'info', message: '系统启动成功' },
            { time: '2023-06-01 12:01:23', level: 'info', message: '用户登录: admin' },
            { time: '2023-06-01 12:05:45', level: 'warning', message: '系统负载过高' },
            { time: '2023-06-01 12:10:12', level: 'error', message: '数据库连接失败' },
            { time: '2023-06-01 12:15:30', level: 'info', message: '数据库连接恢复' }
        ]);
        
        // 最近用户
        const recentUsers = ref([
            { username: 'user1', name: '张三', email: 'user1@example.com', createdAt: '2023-06-01 10:00:00' },
            { username: 'user2', name: '李四', email: 'user2@example.com', createdAt: '2023-06-01 11:00:00' },
            { username: 'user3', name: '王五', email: 'user3@example.com', createdAt: '2023-06-01 12:00:00' }
        ]);
        
        // 日志级别颜色
        const getLogLevelType = (level) => {
            switch(level) {
                case 'info': return 'info';
                case 'warning': return 'warning';
                case 'error': return 'danger';
                default: return 'info';
            }
        };
        
        // 获取仪表盘数据
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem(CONFIG.TOKEN_KEY);
                if (!token) return;
                
                const response = await fetch(`${CONFIG.API_BASE_URL}/admin/dashboard`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('获取仪表盘数据失败:', errorData);
                    throw new Error(errorData.message || '获取仪表盘数据失败');
                }
                
                const data = await response.json();
                
                if (data && data.data) {
                    stats.totalUsers = data.data.totalUsers || 0;
                    stats.totalSessions = data.data.totalSessions || 0;
                    stats.availableCodes = data.data.availableCodes || 0;
                    stats.totalAreas = data.data.totalAreas || 0;
                    
                    if (data.data.recentLogs) {
                        recentLogs.value = data.data.recentLogs;
                    }
                    
                    if (data.data.recentUsers) {
                        recentUsers.value = data.data.recentUsers;
                    }
                }
            } catch (error) {
                console.error('获取仪表盘数据错误:', error);
                // 使用模拟数据
                stats.totalUsers = 128;
                stats.totalSessions = 1024;
                stats.availableCodes = 56;
                stats.totalAreas = 12;
            }
        };
        
        onMounted(() => {
            fetchDashboardData();
        });
        
        return {
            stats,
            chartTimeRange,
            recentLogs,
            recentUsers,
            getLogLevelType,
            userData: Vue.inject('userData')
        };
    }
};

// 功能区管理组件
const FunctionalAreas = {
    template: '#functional-areas-template',
    setup() {
        // 功能区列表
        const functionalAreas = ref([]);
        const loading = ref(false);
        
        // 对话框状态
        const dialogVisible = ref(false);
        const dialogType = ref('add'); // 'add' 或 'edit'
        const initDialogVisible = ref(false);
        const overwriteExisting = ref(false);
        const importDialogVisible = ref(false);
        const overwriteExistingImport = ref(false);
        const importFile = ref(null);
        
        // 引用
        const uploadRef = ref(null);
        const downloadLink = ref(null);
        
        // 表单数据
        const areaForm = reactive({
            _id: '',
            name: '',
            code: '',
            description: '',
            isEnabled: true,
            order: 0,
            accessRoles: ['admin'],
            configJson: '{}',
            config: {}
        });
        
        // 表单验证规则
        const rules = {
            name: [
                { required: true, message: '请输入功能区名称', trigger: 'blur' },
                { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
            ],
            code: [
                { required: true, message: '请输入功能区代码', trigger: 'blur' },
                { pattern: /^[a-zA-Z0-9_-]+$/, message: '只能使用字母、数字、下划线和连字符', trigger: 'blur' }
            ]
        };
        
        // 获取功能区列表
        const fetchFunctionalAreas = async () => {
            loading.value = true;
            try {
                const token = localStorage.getItem(CONFIG.TOKEN_KEY);
                if (!token) {
                    console.log('未找到登录令牌');
                    loading.value = false;
                    return;
                }
                
                const response = await fetch(`${CONFIG.API_BASE_URL}/functional-areas`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('获取功能区列表失败:', errorData);
                    throw new Error(errorData.message || '获取功能区列表失败');
                }
                
                const data = await response.json();
                
                if (data && data.data) {
                    functionalAreas.value = data.data;
                }
            } catch (error) {
                console.error('获取功能区列表错误:', error);
                // 使用模拟数据
                functionalAreas.value = [
                    {
                        _id: '1',
                        name: '首页轮播图',
                        code: 'home_carousel',
                        description: '首页轮播图设置',
                        isEnabled: true,
                        order: 0,
                        accessRoles: ['admin']
                    },
                    {
                        _id: '2',
                        name: '网站导航',
                        code: 'site_nav',
                        description: '网站导航菜单设置',
                        isEnabled: true,
                        order: 1,
                        accessRoles: ['admin']
                    },
                    {
                        _id: '3',
                        name: '会员功能',
                        code: 'member_features',
                        description: '会员专享功能区',
                        isEnabled: false,
                        order: 2,
                        accessRoles: ['admin', 'user']
                    }
                ];
            } finally {
                loading.value = false;
            }
        };
        
        // 显示添加功能区对话框
        const showAddAreaDialog = () => {
            dialogType.value = 'add';
            resetForm();
            dialogVisible.value = true;
        };
        
        // 编辑功能区
        const editArea = (row) => {
            dialogType.value = 'edit';
            Object.assign(areaForm, row);
            // 配置转为JSON字符串
            areaForm.configJson = JSON.stringify(row.config || {}, null, 2);
            dialogVisible.value = true;
        };
        
        // 删除功能区
        const deleteArea = async (row) => {
            try {
                await ElementPlus.ElMessageBox.confirm(
                    `确定要删除功能区"${row.name}"吗？`,
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                );
                
                const token = localStorage.getItem(CONFIG.TOKEN_KEY);
                if (!token) {
                    console.log('未找到登录令牌');
                    return;
                }
                
                const response = await fetch(`${CONFIG.API_BASE_URL}/functional-areas/${row._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('删除功能区失败:', errorData);
                    throw new Error(errorData.message || '删除功能区失败');
                }
                
                ElementPlus.ElMessage.success('删除成功');
                fetchFunctionalAreas(); // 重新加载数据
            } catch (error) {
                if (error === 'cancel') return;
                console.error('删除功能区错误:', error);
                ElementPlus.ElMessage.error(error.message || '删除失败');
            }
        };
        
        // 更新功能区状态
        const updateStatus = async (id, status) => {
            try {
                const token = localStorage.getItem(CONFIG.TOKEN_KEY);
                if (!token) {
                    console.log('未找到登录令牌');
                    return;
                }
                
                const response = await fetch(`${CONFIG.API_BASE_URL}/functional-areas/${id}/status`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ isEnabled: status })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('更新功能区状态失败:', errorData);
                    throw new Error(errorData.message || '更新功能区状态失败');
                }
                
                ElementPlus.ElMessage.success(`功能区已${status ? '启用' : '禁用'}`);
            } catch (error) {
                console.error('更新功能区状态错误:', error);
                ElementPlus.ElMessage.error(error.message || '更新状态失败');
                fetchFunctionalAreas(); // 出错时重新加载数据
            }
        };
        
        // 提交表单
        const submitAreaForm = async () => {
            try {
                // 将JSON字符串转为对象
                try {
                    areaForm.config = JSON.parse(areaForm.configJson);
                } catch (e) {
                    ElementPlus.ElMessage.error('配置JSON格式不正确');
                    return;
                }
                
                const token = localStorage.getItem(CONFIG.TOKEN_KEY);
                if (!token) {
                    console.log('未找到登录令牌');
                    return;
                }
                
                let url = `${CONFIG.API_BASE_URL}/functional-areas`;
                let method = 'POST';
                
                if (dialogType.value === 'edit') {
                    url = `${CONFIG.API_BASE_URL}/functional-areas/${areaForm._id}`;
                    method = 'PATCH';
                }
                
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(areaForm)
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('保存功能区失败:', errorData);
                    throw new Error(errorData.message || '保存功能区失败');
                }
                
                ElementPlus.ElMessage.success(`${dialogType.value === 'add' ? '添加' : '更新'}成功`);
                dialogVisible.value = false;
                fetchFunctionalAreas(); // 重新加载数据
            } catch (error) {
                console.error('保存功能区错误:', error);
                ElementPlus.ElMessage.error(error.message || '保存失败');
            }
        };

        // 初始化预定义功能区（显示确认对话框）
        const initPredefinedAreas = () => {
            overwriteExisting.value = false;
            initDialogVisible.value = true;
        };
        
        // 确认初始化预定义功能区
        const confirmInitPredefinedAreas = async () => {
            try {
                loading.value = true;
                const token = localStorage.getItem(CONFIG.TOKEN_KEY);
                if (!token) {
                    console.log('未找到登录令牌');
                    return;
                }
                
                const url = `${CONFIG.API_BASE_URL}/functional-areas/init-predefined${overwriteExisting.value ? '?overwrite=true' : ''}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('初始化预定义功能区失败:', errorData);
                    throw new Error(errorData.message || '初始化预定义功能区失败');
                }
                
                const result = await response.json();
                
                ElementPlus.ElMessage({
                    message: `初始化完成！新建: ${result.data.created}, 更新: ${result.data.updated}, 跳过: ${result.data.skipped}`,
                    type: 'success',
                    duration: 5000
                });
                
                initDialogVisible.value = false;
                fetchFunctionalAreas(); // 重新加载数据
            } catch (error) {
                console.error('初始化预定义功能区错误:', error);
                ElementPlus.ElMessage.error(error.message || '初始化失败');
            } finally {
                loading.value = false;
            }
        };
        
        // 处理下拉菜单命令
        const handleCommand = (command) => {
            if (command === 'export') {
                exportConfig();
            } else if (command === 'import') {
                importDialogVisible.value = true;
            }
        };
        
        // 导出配置
        const exportConfig = async () => {
            try {
                loading.value = true;
                const token = localStorage.getItem(CONFIG.TOKEN_KEY);
                if (!token) {
                    console.log('未找到登录令牌');
                    return;
                }
                
                const url = `${CONFIG.API_BASE_URL}/functional-areas/export`;
                
                // 创建下载链接
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('导出功能区配置失败:', errorData);
                    throw new Error(errorData.message || '导出功能区配置失败');
                }
                
                // 获取响应数据
                const data = await response.json();
                
                // 创建下载文件
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url_object = window.URL.createObjectURL(blob);
                
                // 设置下载链接
                downloadLink.value.href = url_object;
                downloadLink.value.download = `functional-areas-export-${new Date().toISOString().slice(0, 10)}.json`;
                
                // 触发下载
                downloadLink.value.click();
                
                // 释放URL对象
                window.URL.revokeObjectURL(url_object);
                
                ElementPlus.ElMessage({
                    message: `成功导出 ${data.count} 个功能区配置`,
                    type: 'success'
                });
            } catch (error) {
                console.error('导出功能区配置错误:', error);
                ElementPlus.ElMessage.error(error.message || '导出失败');
            } finally {
                loading.value = false;
            }
        };
        
        // 文件改变时的处理
        const handleFileChange = (file) => {
            importFile.value = file;
        };
        
        // 超过限制时的处理
        const handleExceed = () => {
            ElementPlus.ElMessage.warning('只能上传一个文件');
        };
        
        // 导入配置
        const importConfig = async () => {
            try {
                if (!importFile.value) {
                    ElementPlus.ElMessage.warning('请先选择要导入的文件');
                    return;
                }
                
                loading.value = true;
                
                // 读取文件内容
                const reader = new FileReader();
                reader.readAsText(importFile.value.raw);
                
                reader.onload = async (e) => {
                    try {
                        const content = e.target.result;
                        let importData;
                        
                        try {
                            importData = JSON.parse(content);
                        } catch (err) {
                            ElementPlus.ElMessage.error('文件格式不正确，请确保是有效的JSON文件');
                            loading.value = false;
                            return;
                        }
                        
                        if (!importData.functionalAreas || !Array.isArray(importData.functionalAreas)) {
                            ElementPlus.ElMessage.error('导入文件格式不正确，缺少functionalAreas数组');
                            loading.value = false;
                            return;
                        }
                        
                        const token = localStorage.getItem(CONFIG.TOKEN_KEY);
                        if (!token) {
                            console.log('未找到登录令牌');
                            return;
                        }
                        
                        const url = `${CONFIG.API_BASE_URL}/functional-areas/import${overwriteExistingImport.value ? '?overwrite=true' : ''}`;
                        const response = await fetch(url, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(importData)
                        });
                        
                        if (!response.ok) {
                            const errorData = await response.json();
                            console.error('导入功能区配置失败:', errorData);
                            throw new Error(errorData.message || '导入功能区配置失败');
                        }
                        
                        const result = await response.json();
                        
                        ElementPlus.ElMessage({
                            message: `导入完成！新建: ${result.data.created}, 更新: ${result.data.updated}, 失败: ${result.data.failed}`,
                            type: 'success',
                            duration: 5000
                        });
                        
                        // 重置导入状态
                        importDialogVisible.value = false;
                        importFile.value = null;
                        if (uploadRef.value) {
                            uploadRef.value.clearFiles();
                        }
                        
                        // 重新加载数据
                        fetchFunctionalAreas();
                    } catch (error) {
                        console.error('处理导入文件错误:', error);
                        ElementPlus.ElMessage.error(error.message || '导入失败');
                        loading.value = false;
                    }
                };
                
                reader.onerror = () => {
                    ElementPlus.ElMessage.error('读取文件失败');
                    loading.value = false;
                };
            } catch (error) {
                console.error('导入配置错误:', error);
                ElementPlus.ElMessage.error(error.message || '导入失败');
                loading.value = false;
            }
        };
        
        // 重置表单
        const resetForm = () => {
            areaForm._id = '';
            areaForm.name = '';
            areaForm.code = '';
            areaForm.description = '';
            areaForm.isEnabled = true;
            areaForm.order = 0;
            areaForm.accessRoles = ['admin'];
            areaForm.configJson = '{}';
            areaForm.config = {};
        };
        
        onMounted(() => {
            fetchFunctionalAreas();
        });
        
        return {
            functionalAreas,
            loading,
            dialogVisible,
            dialogType,
            initDialogVisible,
            overwriteExisting,
            importDialogVisible,
            overwriteExistingImport,
            importFile,
            uploadRef,
            downloadLink,
            areaForm,
            rules,
            showAddAreaDialog,
            editArea,
            deleteArea,
            updateStatus,
            submitAreaForm,
            initPredefinedAreas,
            confirmInitPredefinedAreas,
            handleCommand,
            handleFileChange,
            handleExceed,
            importConfig
        };
    }
};

// 角色管理组件
const Roles = {
    template: '#roles-template',
    setup() {
        // 角色列表
        const roles = ref([]);
        const loading = ref(false);
        
        // 对话框状态
        const dialogVisible = ref(false);
        const dialogType = ref('add'); // 'add' 或 'edit'
        const permissionsDialogVisible = ref(false);
        const currentRole = ref(null);
        
        // 权限列表
        const permissions = ref([]);
        const selectedPermissions = ref([]);
        
        // 表单数据
        const roleForm = reactive({
            _id: '',
            name: '',
            code: '',
            description: '',
            isActive: true,
            isSystemRole: false
        });
        
        // 表单验证规则
        const rules = {
            name: [
                { required: true, message: '请输入角色名称', trigger: 'blur' },
                { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
            ],
            code: [
                { required: true, message: '请输入角色代码', trigger: 'blur' },
                { pattern: /^[a-zA-Z0-9_-]+$/, message: '只能使用字母、数字、下划线和连字符', trigger: 'blur' }
            ]
        };
        
        // 获取所有角色
        const fetchRoles = async () => {
            loading.value = true;
            try {
                const token = localStorage.getItem(CONFIG.TOKEN_KEY);
                if (!token) {
                    console.log('未找到登录令牌');
                    loading.value = false;
                    return;
                }
                
                const response = await fetch(`${CONFIG.API_BASE_URL}/roles`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('获取角色列表失败:', errorData);
                    throw new Error(errorData.message || '获取角色列表失败');
                }
                
                const data = await response.json();
                
                if (data && data.data) {
                    roles.value = data.data;
                }
            } catch (error) {
                console.error('获取角色列表错误:', error);
                // 使用模拟数据
                roles.value = [
                    {
                        _id: '1',
                        name: '管理员',
                        code: 'admin',
                        description: '系统管理员，拥有所有权限',
                        isSystemRole: true,
                        isActive: true,
                        permissions: ['user:manage', 'content:manage']
                    },
                    {
                        _id: '2',
                        name: '普通用户',
                        code: 'user',
                        description: '普通注册用户',
                        isSystemRole: true,
                        isActive: true,
                        permissions: ['content:view']
                    }
                ];
            } finally {
                loading.value = false;
            }
        };
        
        // 获取所有权限
        const fetchPermissions = async () => {
            try {
                const token = localStorage.getItem(CONFIG.TOKEN_KEY);
                if (!token) {
                    console.log('未找到登录令牌');
                    return;
                }
                
                const response = await fetch(`${CONFIG.API_BASE_URL}/roles/permissions`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('获取权限列表失败:', errorData);
                    throw new Error(errorData.message || '获取权限列表失败');
                }
                
                const data = await response.json();
                
                if (data && data.data) {
                    permissions.value = data.data;
                }
            } catch (error) {
                console.error('获取权限列表错误:', error);
                // 使用模拟数据
                permissions.value = [
                    { key: 'USER_MANAGE', value: 'user:manage', name: '用户管理' },
                    { key: 'USER_VIEW', value: 'user:view', name: '用户查看' },
                    { key: 'CONTENT_MANAGE', value: 'content:manage', name: '内容管理' },
                    { key: 'CONTENT_VIEW', value: 'content:view', name: '内容查看' },
                    { key: 'AREA_MANAGE', value: 'area:manage', name: '功能区管理' },
                    { key: 'AREA_VIEW', value: 'area:view', name: '功能区查看' },
                    { key: 'SETTING_MANAGE', value: 'setting:manage', name: '系统设置管理' },
                    { key: 'SETTING_VIEW', value: 'setting:view', name: '系统设置查看' },
                    { key: 'REDEEM_MANAGE', value: 'redeem:manage', name: '兑换码管理' },
                    { key: 'LOG_VIEW', value: 'log:view', name: '日志查看' }
                ];
            }
        };
        
        // 按分类分组权限
        const groupedPermissions = computed(() => {
            const groups = {};
            
            for (const permission of permissions.value) {
                const [category] = permission.value.split(':');
                const categoryName = getCategoryName(category);
                
                if (!groups[categoryName]) {
                    groups[categoryName] = [];
                }
                
                groups[categoryName].push(permission);
            }
            
            return groups;
        });
        
        // 获取权限分类名称
        const getCategoryName = (category) => {
            const categoryMap = {
                'user': '用户',
                'content': '内容',
                'area': '功能区',
                'setting': '系统设置',
                'redeem': '兑换码',
                'log': '日志'
            };
            
            return categoryMap[category] || category;
        };
        
        // 显示添加角色对话框
        const showAddRoleDialog = () => {
            dialogType.value = 'add';
            resetForm();
            dialogVisible.value = true;
        };
        
        // 编辑角色
        const editRole = (row) => {
            dialogType.value = 'edit';
            Object.assign(roleForm, row);
            dialogVisible.value = true;
        };
        
        // 显示编辑权限对话框
        const showEditPermissions = (role) => {
            currentRole.value = role;
            selectedPermissions.value = [...(role.permissions || [])];
            permissionsDialogVisible.value = true;
        };
        
        // 保存权限
        const savePermissions = async () => {
            if (!currentRole.value) return;
            
            try {
                const token = localStorage.getItem(CONFIG.TOKEN_KEY);
                if (!token) {
                    console.log('未找到登录令牌');
                    return;
                }
                
                const response = await fetch(`${CONFIG.API_BASE_URL}/roles/${currentRole.value._id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        permissions: selectedPermissions.value
                    })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('保存角色权限失败:', errorData);
                    throw new Error(errorData.message || '保存角色权限失败');
                }
                
                ElementPlus.ElMessage.success('权限保存成功');
                permissionsDialogVisible.value = false;
                fetchRoles(); // 重新加载数据
            } catch (error) {
                console.error('保存角色权限错误:', error);
                ElementPlus.ElMessage.error(error.message || '保存失败');
            }
        };
        
        // 删除角色
        const deleteRole = async (row) => {
            try {
                await ElementPlus.ElMessageBox.confirm(
                    `确定要删除角色"${row.name}"吗？`,
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                );
                
                const token = localStorage.getItem(CONFIG.TOKEN_KEY);
                if (!token) {
                    console.log('未找到登录令牌');
                    return;
                }
                
                const response = await fetch(`${CONFIG.API_BASE_URL}/roles/${row._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('删除角色失败:', errorData);
                    throw new Error(errorData.message || '删除角色失败');
                }
                
                ElementPlus.ElMessage.success('删除成功');
                fetchRoles(); // 重新加载数据
            } catch (error) {
                if (error === 'cancel') return;
                console.error('删除角色错误:', error);
                ElementPlus.ElMessage.error(error.message || '删除失败');
            }
        };
        
        // 更新角色状态
        const updateStatus = async (id, status) => {
            try {
                const token = localStorage.getItem(CONFIG.TOKEN_KEY);
                if (!token) {
                    console.log('未找到登录令牌');
                    return;
                }
                
                const response = await fetch(`${CONFIG.API_BASE_URL}/roles/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ isActive: status })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('更新角色状态失败:', errorData);
                    throw new Error(errorData.message || '更新角色状态失败');
                }
                
                ElementPlus.ElMessage.success(`角色已${status ? '启用' : '禁用'}`);
            } catch (error) {
                console.error('更新角色状态错误:', error);
                ElementPlus.ElMessage.error(error.message || '更新状态失败');
                fetchRoles(); // 出错时重新加载数据
            }
        };
        
        // 提交表单
        const submitRoleForm = async () => {
            try {
                const token = localStorage.getItem(CONFIG.TOKEN_KEY);
                if (!token) {
                    console.log('未找到登录令牌');
                    return;
                }
                
                let url = `${CONFIG.API_BASE_URL}/roles`;
                let method = 'POST';
                
                if (dialogType.value === 'edit') {
                    url = `${CONFIG.API_BASE_URL}/roles/${roleForm._id}`;
                    method = 'PATCH';
                }
                
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(roleForm)
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('保存角色失败:', errorData);
                    throw new Error(errorData.message || '保存角色失败');
                }
                
                ElementPlus.ElMessage.success(`${dialogType.value === 'add' ? '添加' : '更新'}成功`);
                dialogVisible.value = false;
                fetchRoles(); // 重新加载数据
            } catch (error) {
                console.error('保存角色错误:', error);
                ElementPlus.ElMessage.error(error.message || '保存失败');
            }
        };
        
        // 初始化默认角色
        const initDefaultRoles = async () => {
            try {
                const token = localStorage.getItem(CONFIG.TOKEN_KEY);
                if (!token) {
                    console.log('未找到登录令牌');
                    return;
                }
                
                const response = await fetch(`${CONFIG.API_BASE_URL}/roles/init`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('初始化默认角色失败:', errorData);
                    throw new Error(errorData.message || '初始化默认角色失败');
                }
                
                ElementPlus.ElMessage.success('默认角色初始化成功');
                fetchRoles(); // 重新加载数据
            } catch (error) {
                console.error('初始化默认角色错误:', error);
                ElementPlus.ElMessage.error(error.message || '初始化失败');
            }
        };
        
        // 重置表单
        const resetForm = () => {
            roleForm._id = '';
            roleForm.name = '';
            roleForm.code = '';
            roleForm.description = '';
            roleForm.isActive = true;
            roleForm.isSystemRole = false;
        };
        
        onMounted(() => {
            fetchRoles();
            fetchPermissions();
        });
        
        return {
            roles,
            loading,
            dialogVisible,
            dialogType,
            permissionsDialogVisible,
            currentRole,
            roleForm,
            rules,
            selectedPermissions,
            groupedPermissions,
            showAddRoleDialog,
            editRole,
            showEditPermissions,
            savePermissions,
            deleteRole,
            updateStatus,
            submitRoleForm,
            initDefaultRoles
        };
    }
};

// 新闻编辑组件
const NewsEditor = {
    template: '#news-editor-template',
    setup() {
        // 新闻列表和过滤
        const newsList = ref([]);
        const filteredNews = ref([]);
        const currentCategory = ref('all');
        const loading = ref(false);
        
        // 编辑器实例
        let editor = null;
        
        // 对话框状态
        const dialogVisible = ref(false);
        const dialogType = ref('add'); // 'add' 或 'edit'
        const previewVisible = ref(false);
        
        // 表单引用
        const newsFormRef = ref(null);
        
        // 新闻表单数据
        const newsForm = reactive({
            id: '',
            title: '',
            category: 'company',
            image: '',
            summary: '',
            content: '',
            author: '',
            publishDate: new Date(),
            isPublished: true,
            isTopNews: false
        });
        
        // 表单验证规则
        const rules = {
            title: [
                { required: true, message: '请输入新闻标题', trigger: 'blur' },
                { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
            ],
            category: [
                { required: true, message: '请选择新闻分类', trigger: 'change' }
            ],
            summary: [
                { required: true, message: '请输入新闻摘要', trigger: 'blur' }
            ],
            author: [
                { required: true, message: '请输入作者', trigger: 'blur' }
            ]
        };
        
        // 获取新闻列表
        const fetchNewsList = async () => {
            loading.value = true;
            try {
                // 模拟API请求获取新闻列表
                // 在实际应用中，这里应该是一个真实的API调用
                setTimeout(() => {
                    newsList.value = [
                        {
                            id: '1',
                            title: '人工智能技术发展进入快车道',
                            category: 'tech',
                            image: '/img/news/application-banner1.jpg',
                            summary: 'AI技术在过去一年里取得了突破性进展',
                            content: '<p>人工智能技术正在各个领域展现出强大潜力，从医疗到金融，从教育到制造，AI正在改变我们的生活和工作方式。</p><p>特别是在自然语言处理领域，大型语言模型如GPT系列的出现，标志着AI能力的重大飞跃。</p>',
                            author: '技术研发团队',
                            publishDate: '2023-06-15',
                            isPublished: true,
                            isTopNews: true
                        },
                        {
                            id: '2',
                            title: '数字人技术打造全新客户体验',
                            category: 'industry',
                            image: '/img/news/application-banner2.jpg',
                            summary: '数字人助力企业客户服务进入智能交互新时代',
                            content: '<p>数字人技术正在客户服务领域掀起革命。通过结合AI、计算机视觉和自然语言处理技术，企业可以创建高度拟真的数字人，为客户提供24/7全天候服务。</p>',
                            author: '客户体验部',
                            publishDate: '2023-06-10',
                            isPublished: true,
                            isTopNews: false
                        },
                        {
                            id: '3',
                            title: '智能助理让商业办公更高效',
                            category: 'company',
                            image: '/img/news/application-news1.jpg',
                            summary: '智能助理提升工作效率的三大关键因素',
                            content: '<p>随着AI技术的成熟，智能助理正在成为现代办公环境中不可或缺的一部分。从日程安排到文档整理，从数据分析到会议记录，智能助理可以处理各种重复性任务，让员工专注于更具创造性的工作。</p>',
                            author: '产品团队',
                            publishDate: '2023-06-05',
                            isPublished: false,
                            isTopNews: false
                        }
                    ];
                    
                    // 初始过滤
                    filterNewsByCategory(currentCategory.value);
                    loading.value = false;
                }, 500);
            } catch (error) {
                console.error('获取新闻列表错误:', error);
                loading.value = false;
            }
        };
        
        // 按分类过滤新闻
        const filterNewsByCategory = (category) => {
            if (category === 'all') {
                filteredNews.value = [...newsList.value];
            } else {
                filteredNews.value = newsList.value.filter(item => item.category === category);
            }
        };
        
        // 创建新闻
        const createNews = () => {
            dialogType.value = 'add';
            resetNewsForm();
            dialogVisible.value = true;
            
            // 等待DOM更新后初始化编辑器
            Vue.nextTick(() => {
                initEditor();
            });
        };
        
        // 编辑新闻
        const editNews = (news) => {
            dialogType.value = 'edit';
            Object.assign(newsForm, JSON.parse(JSON.stringify(news))); // 深拷贝防止直接修改原对象
            dialogVisible.value = true;
            
            // 等待DOM更新后初始化编辑器并设置内容
            Vue.nextTick(() => {
                initEditor();
                if (editor) {
                    editor.txt.html(newsForm.content || '');
                }
            });
        };
        
        // 删除新闻
        const deleteNews = async (news) => {
            try {
                await ElementPlus.ElMessageBox.confirm(
                    `确定要删除新闻"${news.title}"吗？`,
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                );
                
                // 模拟删除操作
                newsList.value = newsList.value.filter(item => item.id !== news.id);
                filterNewsByCategory(currentCategory.value);
                
                ElementPlus.ElMessage.success('删除成功');
            } catch (error) {
                if (error === 'cancel') return;
                console.error('删除新闻错误:', error);
                ElementPlus.ElMessage.error('删除失败');
            }
        };
        
        // 更新新闻状态
        const updateNewsStatus = async (id, status) => {
            try {
                // 模拟API请求更新状态
                const news = newsList.value.find(item => item.id === id);
                if (news) {
                    news.isPublished = status;
                    ElementPlus.ElMessage.success(`新闻已${status ? '发布' : '下线'}`);
                }
            } catch (error) {
                console.error('更新新闻状态错误:', error);
                ElementPlus.ElMessage.error('更新状态失败');
            }
        };
        
        // 初始化编辑器
        const initEditor = () => {
            // 先确保先前的编辑器实例被销毁
            if (editor) {
                editor.destroy();
                editor = null;
            }
            
            // 检查wangEditor是否加载
            if (!window.wangEditor) {
                console.error('未找到wangEditor，请检查是否已加载相关库');
                ElementPlus.ElMessage.error('加载编辑器失败');
                return;
            }
            
            try {
                // 获取编辑器容器
                const editorElement = document.getElementById('news-content-editor');
                if (!editorElement) {
                    console.error('未找到编辑器容器元素');
                    return;
                }
                
                // 创建编辑器实例
                const E = window.wangEditor;
                editor = new E(editorElement);
                
                // 配置编辑器
                editor.config.height = 300;
                editor.config.placeholder = '请输入新闻内容';
                
                // 图片上传配置（这里使用base64，实际项目中应该上传到服务器）
                editor.config.uploadImgShowBase64 = true;
                
                // 设置内容变化回调
                editor.config.onchange = (html) => {
                    newsForm.content = html;
                    console.log('编辑器内容已更新');
                };
                
                // 创建编辑器
                editor.create();
                console.log('编辑器已初始化');
                
                // 如果有初始内容，设置到编辑器
                if (newsForm.content) {
                    editor.txt.html(newsForm.content);
                }
            } catch (error) {
                console.error('初始化编辑器错误:', error);
                ElementPlus.ElMessage.error('初始化编辑器失败');
            }
        };
        
        // 处理图片变更
        const handleImageChange = (file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.raw);
            reader.onload = () => {
                newsForm.image = reader.result;
            };
        };
        
        // 移除图片
        const handleImageRemove = () => {
            newsForm.image = '';
        };
        
        // 提交新闻表单
        const submitNewsForm = async () => {
            if (!newsFormRef.value) return;
            
            // 表单验证
            await newsFormRef.value.validate(async (valid, fields) => {
                if (!valid) {
                    console.log('表单验证失败', fields);
                    return;
                }
                
                // 确保从编辑器获取最新内容
                if (editor) {
                    newsForm.content = editor.txt.html();
                }
                
                // 检查内容是否为空
                if (!newsForm.content || newsForm.content.trim() === '') {
                    ElementPlus.ElMessage.error('新闻内容不能为空');
                    return;
                }
                
                try {
                    loading.value = true;
                    
                    if (dialogType.value === 'add') {
                        // 模拟添加新闻
                        const newNews = {
                            ...JSON.parse(JSON.stringify(newsForm)), // 深拷贝
                            id: 'news_' + Date.now(),
                            publishDate: formatDate(newsForm.publishDate)
                        };
                        newsList.value.unshift(newNews);
                        ElementPlus.ElMessage.success('新闻添加成功');
                    } else {
                        // 模拟更新新闻
                        const index = newsList.value.findIndex(item => item.id === newsForm.id);
                        if (index !== -1) {
                            newsList.value[index] = {
                                ...JSON.parse(JSON.stringify(newsForm)),
                                publishDate: formatDate(newsForm.publishDate)
                            };
                            ElementPlus.ElMessage.success('新闻更新成功');
                        }
                    }
                    
                    // 重新过滤
                    filterNewsByCategory(currentCategory.value);
                    
                    // 关闭对话框
                    dialogVisible.value = false;
                    
                } catch (error) {
                    console.error('保存新闻错误:', error);
                    ElementPlus.ElMessage.error('保存失败: ' + (error.message || '未知错误'));
                } finally {
                    loading.value = false;
                }
            });
        };
        
        // 预览新闻
        const previewNews = () => {
            // 确保从编辑器获取最新内容
            if (editor) {
                newsForm.content = editor.txt.html();
            }
            
            previewVisible.value = true;
        };
        
        // 监听对话框关闭事件，销毁编辑器
        watch(dialogVisible, (val) => {
            if (!val && editor) {
                // 延迟销毁编辑器，避免潜在问题
                setTimeout(() => {
                    editor.destroy();
                    editor = null;
                    console.log('编辑器已销毁');
                }, 100);
            }
        });
        
        // 重置新闻表单
        const resetNewsForm = () => {
            newsForm.id = '';
            newsForm.title = '';
            newsForm.category = 'company';
            newsForm.image = '';
            newsForm.summary = '';
            newsForm.content = '';
            newsForm.author = '';
            newsForm.publishDate = new Date();
            newsForm.isPublished = true;
            newsForm.isTopNews = false;
            
            // 重置编辑器内容
            if (editor) {
                editor.txt.html('');
            }
        };
        
        // 格式化日期
        const formatDate = (date) => {
            if (!date) return '';
            
            if (typeof date === 'string') return date;
            
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        // 获取分类名称
        const getCategoryName = (category) => {
            const categories = {
                company: '公司动态',
                industry: '行业资讯',
                tech: '技术前沿',
                case: '案例分析'
            };
            return categories[category] || category;
        };
        
        // 获取分类标签类型
        const getCategoryType = (category) => {
            const types = {
                company: 'primary',
                industry: 'success',
                tech: 'info',
                case: 'warning'
            };
            return types[category] || '';
        };
        
        onMounted(() => {
            fetchNewsList();
        });
        
        onUnmounted(() => {
            // 销毁编辑器
            if (editor) {
                editor.destroy();
                editor = null;
                console.log('页面卸载，编辑器已销毁');
            }
        });
        
        return {
            newsList,
            filteredNews,
            currentCategory,
            loading,
            dialogVisible,
            dialogType,
            previewVisible,
            newsForm,
            newsFormRef,
            rules,
            createNews,
            editNews,
            deleteNews,
            updateNewsStatus,
            handleImageChange,
            handleImageRemove,
            submitNewsForm,
            previewNews,
            filterNewsByCategory,
            getCategoryName,
            getCategoryType,
            formatDate
        };
    }
};

// 联享名片设置组件
const BusinessCardSettings = {
    template: '#business-card-settings-template',
    setup() {
        // 状态数据
        const activeTab = ref('basic');
        const loading = ref(false);
        const saveSuccessVisible = ref(false);
        
        // 图标选择器
        const iconDialogVisible = ref(false);
        const iconSearchQuery = ref('');
        const currentEditingFeatureIndex = ref(-1);
        
        // 表单数据
        const cardSettings = reactive({
            title: '联享智能名片',
            subtitle: '数字化您的品牌影响力',
            description: '智能AI名片助力您建立专业品牌形象，高效连接客户资源',
            features: [
                {
                    icon: 'el-icon-share',
                    title: '一键分享',
                    description: '轻松分享您的联系方式和专业背景'
                },
                {
                    icon: 'el-icon-data-analysis',
                    title: '数据分析',
                    description: '查看名片访问和互动数据'
                },
                {
                    icon: 'el-icon-edit',
                    title: '个性定制',
                    description: '自定义您的名片样式和内容'
                },
                {
                    icon: 'el-icon-connection',
                    title: '智能连接',
                    description: 'AI助力精准拓展人脉网络'
                }
            ],
            ctaButton: {
                text: '立即创建我的智能名片',
                link: '/ai-card-new.html'
            },
            demoImage: '/img/card-demo.png'
        });
        
        // 获取设置数据
        const fetchCardSettings = async () => {
            loading.value = true;
            try {
                // 模拟API请求获取名片设置
                // 在实际应用中，这里应该是一个真实的API调用
                setTimeout(() => {
                    // 如果有保存的配置则加载
                    const savedSettings = localStorage.getItem('business_card_settings');
                    if (savedSettings) {
                        const parsed = JSON.parse(savedSettings);
                        Object.assign(cardSettings, parsed);
                    }
                    loading.value = false;
                }, 500);
            } catch (error) {
                console.error('获取名片设置错误:', error);
                loading.value = false;
            }
        };
        
        // 保存所有设置
        const saveAllSettings = async () => {
            loading.value = true;
            try {
                // 模拟API请求保存名片设置
                setTimeout(() => {
                    // 在实际应用中，这里应该是一个真实的API调用
                    localStorage.setItem('business_card_settings', JSON.stringify(cardSettings));
                    loading.value = false;
                    saveSuccessVisible.value = true;
                }, 500);
            } catch (error) {
                console.error('保存名片设置错误:', error);
                ElementPlus.ElMessage.error('保存设置失败');
                loading.value = false;
            }
        };
        
        // 重置设置
        const resetSettings = () => {
            ElementPlus.ElMessageBox.confirm(
                '确定要重置所有设置吗？这将恢复到默认设置。',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(() => {
                // 重置为默认值
                cardSettings.title = '联享智能名片';
                cardSettings.subtitle = '数字化您的品牌影响力';
                cardSettings.description = '智能AI名片助力您建立专业品牌形象，高效连接客户资源';
                cardSettings.features = [
                    {
                        icon: 'el-icon-share',
                        title: '一键分享',
                        description: '轻松分享您的联系方式和专业背景'
                    },
                    {
                        icon: 'el-icon-data-analysis',
                        title: '数据分析',
                        description: '查看名片访问和互动数据'
                    },
                    {
                        icon: 'el-icon-edit',
                        title: '个性定制',
                        description: '自定义您的名片样式和内容'
                    },
                    {
                        icon: 'el-icon-connection',
                        title: '智能连接',
                        description: 'AI助力精准拓展人脉网络'
                    }
                ];
                cardSettings.ctaButton.text = '立即创建我的智能名片';
                cardSettings.ctaButton.link = '/ai-card-new.html';
                cardSettings.demoImage = '/img/card-demo.png';
                
                ElementPlus.ElMessage.success('已重置为默认设置');
            }).catch(() => {
                // 取消重置
            });
        };
        
        // 添加特性
        const addFeature = () => {
            cardSettings.features.push({
                icon: 'el-icon-star-off',
                title: '新增特性',
                description: '请填写特性描述'
            });
        };
        
        // 移除特性
        const removeFeature = (index) => {
            cardSettings.features.splice(index, 1);
        };
        
        // 移动特性排序
        const moveFeature = (index, direction) => {
            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= cardSettings.features.length) return;
            
            const temp = cardSettings.features[index];
            cardSettings.features[index] = cardSettings.features[newIndex];
            cardSettings.features[newIndex] = temp;
        };
        
        // 打开图标选择器
        const openIconSelector = (index) => {
            currentEditingFeatureIndex.value = index;
            iconDialogVisible.value = true;
        };
        
        // 选择图标
        const selectIcon = (icon) => {
            if (currentEditingFeatureIndex.value !== -1) {
                cardSettings.features[currentEditingFeatureIndex.value].icon = icon;
            }
            iconDialogVisible.value = false;
        };
        
        // 处理演示图片变更
        const handleDemoImageChange = (file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.raw);
            reader.onload = () => {
                cardSettings.demoImage = reader.result;
            };
        };
        
        // 移除演示图片
        const handleDemoImageRemove = () => {
            cardSettings.demoImage = '';
        };
        
        // 预览名片页面
        const previewCardPage = () => {
            window.open('/ai-card-new.html', '_blank');
        };
        
        // Element Plus图标列表（部分常用图标）
        const iconList = [
            'el-icon-edit', 'el-icon-share', 'el-icon-delete', 
            'el-icon-setting', 'el-icon-menu', 'el-icon-message', 
            'el-icon-location', 'el-icon-time', 'el-icon-star-off', 
            'el-icon-star-on', 'el-icon-phone', 'el-icon-picture', 
            'el-icon-document', 'el-icon-camera', 'el-icon-video-camera',
            'el-icon-connection', 'el-icon-mic', 'el-icon-bell', 
            'el-icon-user', 'el-icon-data-analysis', 'el-icon-data-line',
            'el-icon-coffee-cup', 'el-icon-collection', 'el-icon-chat-dot-round',
            'el-icon-chat-round', 'el-icon-chat-square', 'el-icon-coin',
            'el-icon-collection-tag', 'el-icon-coordinate', 'el-icon-credit-card',
            'el-icon-data-board', 'el-icon-discount', 'el-icon-dish',
            'el-icon-document-add', 'el-icon-document-checked', 'el-icon-download',
            'el-icon-eleme', 'el-icon-finished', 'el-icon-files',
            'el-icon-folder', 'el-icon-folder-add', 'el-icon-folder-checked',
            'el-icon-folder-delete', 'el-icon-folder-opened', 'el-icon-goods',
            'el-icon-guide', 'el-icon-headset', 'el-icon-help',
            'el-icon-house', 'el-icon-info', 'el-icon-key',
            'el-icon-link', 'el-icon-lock', 'el-icon-medal',
            'el-icon-money', 'el-icon-notification', 'el-icon-office-building',
            'el-icon-operation', 'el-icon-opportunity', 'el-icon-paperclip',
            'el-icon-phone-outline', 'el-icon-picture-outline', 'el-icon-platform'
        ];
        
        // 过滤图标
        const filteredIcons = computed(() => {
            if (!iconSearchQuery.value) return iconList;
            return iconList.filter(icon => 
                icon.replace('el-icon-', '').includes(iconSearchQuery.value.toLowerCase())
            );
        });
        
        onMounted(() => {
            fetchCardSettings();
        });
        
        return {
            activeTab,
            loading,
            saveSuccessVisible,
            iconDialogVisible,
            iconSearchQuery,
            cardSettings,
            filteredIcons,
            saveAllSettings,
            resetSettings,
            addFeature,
            removeFeature,
            moveFeature,
            openIconSelector,
            selectIcon,
            handleDemoImageChange,
            handleDemoImageRemove,
            previewCardPage
        };
    }
};

// 预定义功能区组件
const PredefinedAreas = {
    template: '#predefined-areas-template',
    setup() {
        // 状态数据
        const loading = ref(false);
        const areaStatus = reactive({
            home_news_carousel: false,
            business_card: false,
            main_feature_buttons: false,
            news_library: false,
            growth_lab_resources: false
        });
        
        // 获取功能区状态
        const fetchAreasStatus = async () => {
            loading.value = true;
            try {
                // 模拟API请求获取功能区状态
                setTimeout(() => {
                    // 在实际应用中，这里应该是一个真实的API调用
                    const areas = [
                        { code: 'home_news_carousel', isConfigured: true },
                        { code: 'business_card', isConfigured: true },
                        { code: 'main_feature_buttons', isConfigured: false },
                        { code: 'news_library', isConfigured: false },
                        { code: 'growth_lab_resources', isConfigured: false }
                    ];
                    
                    areas.forEach(area => {
                        areaStatus[area.code] = area.isConfigured;
                    });
                    
                    loading.value = false;
                }, 500);
            } catch (error) {
                console.error('获取功能区状态错误:', error);
                loading.value = false;
            }
        };
        
        // 初始化所有预定义功能区
        const initAllPredefinedAreas = async () => {
            try {
                await ElementPlus.ElMessageBox.confirm(
                    '确定要一键初始化所有预定义功能区吗？这将覆盖任何现有的同名功能区。',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                );
                
                loading.value = true;
                
                // 模拟API请求初始化所有功能区
                setTimeout(() => {
                    // 在实际应用中，这里应该是一个真实的API调用
                    // 将所有状态设置为已配置
                    Object.keys(areaStatus).forEach(key => {
                        areaStatus[key] = true;
                    });
                    
                    loading.value = false;
                    ElementPlus.ElMessage.success('所有预定义功能区已成功初始化');
                }, 1000);
            } catch (error) {
                if (error === 'cancel') return;
                console.error('初始化所有功能区错误:', error);
                ElementPlus.ElMessage.error('初始化失败');
                loading.value = false;
            }
        };
        
        // 初始化单个预定义功能区
        const initPredefinedArea = async (code) => {
            try {
                await ElementPlus.ElMessageBox.confirm(
                    `确定要初始化"${getAreaName(code)}"功能区吗？`,
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                );
                
                loading.value = true;
                
                // 模拟API请求初始化功能区
                setTimeout(() => {
                    // 在实际应用中，这里应该是一个真实的API调用
                    areaStatus[code] = true;
                    
                    loading.value = false;
                    ElementPlus.ElMessage.success(`${getAreaName(code)}功能区已成功初始化`);
                }, 800);
            } catch (error) {
                if (error === 'cancel') return;
                console.error('初始化功能区错误:', error);
                ElementPlus.ElMessage.error('初始化失败');
                loading.value = false;
            }
        };
        
        // 预览功能区
        const previewArea = (code) => {
            const routes = {
                home_news_carousel: '/areas-preview?code=home_news_carousel',
                business_card: '/ai-card-new.html',
                main_feature_buttons: '/areas-preview?code=main_feature_buttons',
                news_library: '/areas-preview?code=news_library',
                growth_lab_resources: '/growth-lab.html'
            };
            
            const route = routes[code];
            if (route) {
                window.open(route, '_blank');
            }
        };
        
        // 获取功能区名称
        const getAreaName = (code) => {
            const names = {
                home_news_carousel: '首页轮播新闻模块',
                business_card: '联享名片功能区',
                main_feature_buttons: '首页四大功能按钮',
                news_library: '新闻资讯库',
                growth_lab_resources: '增长实验室资源库'
            };
            return names[code] || code;
        };
        
        onMounted(() => {
            fetchAreasStatus();
        });
        
        return {
            loading,
            areaStatus,
            initAllPredefinedAreas,
            initPredefinedArea,
            previewArea
        };
    }
};

// 功能区配置组件
const AreasConfig = {
    template: '#areas-config-template',
    setup() {
        // 状态数据
        const loading = ref(false);
        const selectedArea = ref('');
        const activeTab = ref('basic');
        const functionalAreas = ref([]);
        
        // 表单数据
        const areaForm = reactive({
            _id: '',
            name: '',
            description: '',
            isEnabled: true,
            order: 0,
            accessRoles: [],
            configJson: '{}'
        });
        
        // 获取功能区列表
        const fetchFunctionalAreas = async () => {
            loading.value = true;
            try {
                // 模拟API请求获取功能区列表
                setTimeout(() => {
                    // 在实际应用中，这里应该是一个真实的API调用
                    functionalAreas.value = [
                        {
                            _id: '1',
                            name: '首页轮播新闻模块',
                            code: 'home_news_carousel',
                            description: '网站首页顶部轮播新闻展示区域',
                            isEnabled: true,
                            order: 10,
                            accessRoles: ['admin', 'user', 'guest'],
                            config: {
                                title: '最新动态',
                                autoplay: true,
                                interval: 5000,
                                items: [
                                    {
                                        id: '1',
                                        title: '人工智能技术发展进入快车道',
                                        description: 'AI技术在过去一年里取得了突破性进展',
                                        image: '/img/news/application-banner1.jpg',
                                        link: '/news-detail.html?id=1'
                                    },
                                    {
                                        id: '2',
                                        title: '数字人技术打造全新客户体验',
                                        description: '数字人助力企业客户服务进入智能交互新时代',
                                        image: '/img/news/application-banner2.jpg',
                                        link: '/news-detail.html?id=2'
                                    }
                                ],
                                moreLink: '/news-list.html'
                            }
                        },
                        {
                            _id: '2',
                            name: '联享名片功能区',
                            code: 'business_card',
                            description: '数字化智能名片功能区域',
                            isEnabled: true,
                            order: 20,
                            accessRoles: ['admin', 'user', 'guest'],
                            config: {
                                title: '联享智能名片',
                                subtitle: '数字化您的品牌影响力',
                                description: '智能AI名片助力您建立专业品牌形象，高效连接客户资源',
                                features: [
                                    {
                                        icon: 'share-icon',
                                        title: '一键分享',
                                        description: '轻松分享您的联系方式和专业背景'
                                    }
                                ],
                                ctaButton: {
                                    text: '立即创建我的智能名片',
                                    link: '/ai-card-new.html'
                                }
                            }
                        },
                        {
                            _id: '3',
                            name: '首页四大功能按钮',
                            code: 'main_feature_buttons',
                            description: '网站首页主要功能导航按钮',
                            isEnabled: false,
                            order: 30,
                            accessRoles: ['admin', 'user'],
                            config: {}
                        }
                    ];
                    loading.value = false;
                }, 500);
            } catch (error) {
                console.error('获取功能区列表错误:', error);
                loading.value = false;
            }
        };
        
        // 当前选择的功能区
        const currentArea = computed(() => {
            return functionalAreas.value.find(area => area.code === selectedArea.value) || null;
        });
        
        // 监听选择的功能区变化
        watch(selectedArea, (newVal) => {
            if (newVal && currentArea.value) {
                // 加载功能区数据到表单
                const area = currentArea.value;
                areaForm._id = area._id;
                areaForm.name = area.name;
                areaForm.description = area.description;
                areaForm.isEnabled = area.isEnabled;
                areaForm.order = area.order;
                areaForm.accessRoles = [...area.accessRoles];
                areaForm.configJson = JSON.stringify(area.config || {}, null, 2);
            } else {
                // 重置表单
                resetForm();
            }
        });
        
        // 保存功能区配置
        const saveAreaConfig = async () => {
            try {
                // 验证JSON格式
                try {
                    JSON.parse(areaForm.configJson);
                } catch (e) {
                    ElementPlus.ElMessage.error('配置JSON格式不正确');
                    return;
                }
                
                loading.value = true;
                
                // 模拟API请求保存功能区配置
                setTimeout(() => {
                    // 在实际应用中，这里应该是一个真实的API调用
                    const index = functionalAreas.value.findIndex(area => area.code === selectedArea.value);
                    if (index !== -1) {
                        const updatedArea = { ...functionalAreas.value[index] };
                        updatedArea.name = areaForm.name;
                        updatedArea.description = areaForm.description;
                        updatedArea.isEnabled = areaForm.isEnabled;
                        updatedArea.order = areaForm.order;
                        updatedArea.accessRoles = [...areaForm.accessRoles];
                        updatedArea.config = JSON.parse(areaForm.configJson);
                        
                        functionalAreas.value[index] = updatedArea;
                    }
                    
                    loading.value = false;
                    ElementPlus.ElMessage.success('功能区配置保存成功');
                }, 800);
            } catch (error) {
                console.error('保存功能区配置错误:', error);
                ElementPlus.ElMessage.error('保存配置失败');
                loading.value = false;
            }
        };
        
        // 重置表单
        const resetForm = () => {
            areaForm._id = '';
            areaForm.name = '';
            areaForm.description = '';
            areaForm.isEnabled = true;
            areaForm.order = 0;
            areaForm.accessRoles = [];
            areaForm.configJson = '{}';
        };
        
        // 格式化JSON
        const formatJSON = (json) => {
            try {
                return JSON.stringify(JSON.parse(json), null, 2);
            } catch (e) {
                return json;
            }
        };
        
        onMounted(() => {
            fetchFunctionalAreas();
        });
        
        return {
            loading,
            selectedArea,
            activeTab,
            functionalAreas,
            currentArea,
            areaForm,
            saveAreaConfig,
            resetForm,
            formatJSON
        };
    }
};

// 功能区预览组件
const AreasPreview = {
    template: '#areas-preview-template',
    setup() {
        // 状态数据
        const loading = ref(false);
        const selectedArea = ref('');
        const functionalAreas = ref([]);
        const previewUrl = ref('');
        
        // 获取功能区列表
        const fetchFunctionalAreas = async () => {
            loading.value = true;
            try {
                // 模拟API请求获取功能区列表
                setTimeout(() => {
                    // 在实际应用中，这里应该是一个真实的API调用
                    functionalAreas.value = [
                        {
                            _id: '1',
                            name: '首页轮播新闻模块',
                            code: 'home_news_carousel',
                            description: '网站首页顶部轮播新闻展示区域',
                            isEnabled: true
                        },
                        {
                            _id: '2',
                            name: '联享名片功能区',
                            code: 'business_card',
                            description: '数字化智能名片功能区域',
                            isEnabled: true
                        },
                        {
                            _id: '3',
                            name: '首页四大功能按钮',
                            code: 'main_feature_buttons',
                            description: '网站首页主要功能导航按钮',
                            isEnabled: false
                        },
                        {
                            _id: '4',
                            name: '新闻资讯库',
                            code: 'news_library',
                            description: '网站新闻资讯内容库',
                            isEnabled: true
                        },
                        {
                            _id: '5',
                            name: '增长实验室资源库',
                            code: 'growth_lab_resources',
                            description: '增长实验室的方法论、工具和案例资源',
                            isEnabled: true
                        }
                    ];
                    loading.value = false;
                }, 500);
            } catch (error) {
                console.error('获取功能区列表错误:', error);
                loading.value = false;
            }
        };
        
        // 当前选择的功能区
        const currentArea = computed(() => {
            return functionalAreas.value.find(area => area.code === selectedArea.value) || null;
        });
        
        // 监听选择的功能区变化
        watch(selectedArea, (newVal) => {
            if (newVal) {
                updatePreviewUrl(newVal);
            } else {
                previewUrl.value = '';
            }
        });
        
        // 更新预览URL
        const updatePreviewUrl = (code) => {
            // 根据功能区代码设置预览URL
            const previewUrls = {
                home_news_carousel: '/home-example.html#carousel',
                business_card: '/ai-card-new.html',
                main_feature_buttons: '/home-example.html#features',
                news_library: '/home-example.html#news',
                growth_lab_resources: '/growth-lab.html'
            };
            
            previewUrl.value = previewUrls[code] || '';
        };
        
        // 刷新预览
        const refreshPreview = () => {
            // 重新加载iframe
            const iframe = document.querySelector('.preview-iframe');
            if (iframe) {
                iframe.src = iframe.src;
            }
        };
        
        // 在新窗口打开
        const openInNewWindow = () => {
            if (previewUrl.value) {
                window.open(previewUrl.value, '_blank');
            }
        };
        
        // 编辑当前功能区
        const editCurrentArea = () => {
            if (selectedArea.value) {
                // 跳转到功能区配置页面
                router.push({
                    path: '/areas-config',
                    query: { code: selectedArea.value }
                });
            }
        };
        
        onMounted(() => {
            fetchFunctionalAreas();
        });
        
        return {
            loading,
            selectedArea,
            functionalAreas,
            currentArea,
            previewUrl,
            refreshPreview,
            openInNewWindow,
            editCurrentArea
        };
    }
};

// 空白组件，用于未实现的页面
const EmptyComponent = {
    template: `
        <div class="empty-page">
            <el-empty description="此页面正在开发中..."></el-empty>
        </div>
    `
};

// 定义路由
const routes = [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: Dashboard },
    { path: '/functional-areas', component: FunctionalAreas },
    { path: '/predefined-areas', component: PredefinedAreas },
    { path: '/areas-config', component: AreasConfig },
    { path: '/areas-preview', component: AreasPreview },
    { path: '/news-editor', component: NewsEditor },
    { path: '/business-card-settings', component: BusinessCardSettings },
    { path: '/roles', component: EmptyComponent },
    { path: '/user-list', component: EmptyComponent },
    { path: '/content-pages', component: EmptyComponent },
    { path: '/content-news', component: EmptyComponent },
    { path: '/redeem-codes', component: EmptyComponent },
    { path: '/system-logs', component: EmptyComponent },
    { path: '/settings', component: EmptyComponent }
];

// 创建 Vue Router 实例
const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// 创建应用
const app = createApp({
    setup() {
        // 侧边栏折叠状态
        const collapsed = ref(false);
        
        // 当前激活的菜单项
        const activeMenu = computed(() => {
            return router.currentRoute.value.path;
        });
        
        // 侧边栏折叠切换
        const toggleSidebar = () => {
            collapsed.value = !collapsed.value;
        };
        
        // 全屏切换
        const toggleFullScreen = () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        };
        
        return {
            collapsed,
            activeMenu,
            toggleSidebar,
            toggleFullScreen
        };
    }
});

// 更新Breadcrumb组件
Breadcrumb.setup = function() {
    const route = Vue.inject('route');
    
    const breadcrumbMap = {
        '/dashboard': ['首页', '系统概览'],
        '/functional-areas': ['首页', '功能区列表'],
        '/predefined-areas': ['首页', '预定义功能区'],
        '/areas-config': ['首页', '功能区配置'],
        '/areas-preview': ['首页', '功能区预览'],
        '/news-editor': ['首页', '新闻内容编辑'],
        '/business-card-settings': ['首页', '联享名片设置'],
        '/user-list': ['首页', '系统管理', '用户管理'],
        '/roles': ['首页', '系统管理', '角色管理'],
        '/system-logs': ['首页', '系统管理', '系统日志']
    };
    
    const breadcrumbs = computed(() => {
        return breadcrumbMap[route.path] || ['首页'];
    });
    
    return { breadcrumbs };
};

// 注册组件
app.component('breadcrumb', Breadcrumb);

// 提供路由实例
app.provide('route', router.currentRoute);

// 使用路由
app.use(router);

// 挂载应用
app.mount('#app'); 