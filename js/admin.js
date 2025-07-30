// 管理员页面应用逻辑
new Vue({
    el: '#admin-app',
    data: {
        // 用户数据
        userData: null,
        isAdmin: false,
        
        // 用户列表
        users: [],
        isLoading: true,
        errorMessage: '',
        
        // 添加用户
        showAddUserModal: false,
        newUser: {
            username: '',
            password: '',
            name: '',
            email: '',
            role: 'user',
            accountType: ''
        },
        isAddingUser: false,
        addUserError: ''
    },
    methods: {
        // 获取当前用户信息
        async getCurrentUser() {
            const token = localStorage.getItem(CONFIG.TOKEN_KEY);
            
            if (!token) {
                console.log('未找到登录令牌');
                // 临时用户数据，后续重新实现
                this.userData = { 
                    username: 'temp_user',
                    name: '临时用户',
                    role: 'admin'
                };
                this.isAdmin = true;
                this.getUsers();
                return;
            }
            
            console.log('正在获取当前用户信息...');
            try {
                const response = await fetch(`${CONFIG.API_BASE_URL}/auth/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('获取用户信息失败:', errorData);
                    throw new Error(errorData.message || '获取用户信息失败');
                }
                
                const data = await response.json();
                
                if (!data.data || !data.data.user) {
                    console.error('响应缺少用户数据:', data);
                    throw new Error('获取用户信息失败');
                }
                
                this.userData = data.data.user;
                console.log('获取用户信息成功', this.userData.username);
                
                // 检查是否是管理员
                this.isAdmin = this.userData.role === 'admin';
                
                if (!this.isAdmin) {
                    console.error('非管理员用户，无权限访问此页面');
                    alert('您没有管理员权限，无法访问此页面');
                    window.location.href = 'index.html';
                    return;
                }
                
                // 如果是管理员，获取用户列表
                this.getUsers();
            } catch (error) {
                console.error('检查登录状态错误:', error);
                alert('获取用户信息失败');
                // 临时用户数据，后续重新实现
                this.userData = { 
                    username: 'temp_user',
                    name: '临时用户',
                    role: 'admin'
                };
                this.isAdmin = true;
                this.getUsers();
            }
        },
        
        // 获取用户列表
        async getUsers() {
            this.isLoading = true;
            this.errorMessage = '';
            
            const token = localStorage.getItem(CONFIG.TOKEN_KEY);
            
            if (!token) {
                console.log('未找到登录令牌');
                // 临时数据，后续重新实现
                this.users = [
                    {
                        _id: 1,
                        username: 'admin',
                        name: '管理员',
                        email: 'admin@example.com',
                        role: 'admin',
                        accountType: '标准版',
                        createdAt: new Date().toISOString()
                    }
                ];
                this.isLoading = false;
                return;
            }
            
            try {
                console.log('正在获取用户列表...');
                const response = await fetch(`${CONFIG.API_BASE_URL}/users`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('获取用户列表失败:', errorData);
                    throw new Error(errorData.message || '获取用户列表失败');
                }
                
                const data = await response.json();
                
                if (!data.data || !data.data.users) {
                    console.error('响应缺少用户列表数据:', data);
                    throw new Error('获取用户列表失败');
                }
                
                this.users = data.data.users;
                console.log('获取用户列表成功，共', this.users.length, '个用户');
            } catch (error) {
                console.error('获取用户列表错误:', error);
                this.errorMessage = error.message || '获取用户列表失败';
                
                // 临时数据，后续重新实现
                this.users = [
                    {
                        _id: 1,
                        username: 'admin',
                        name: '管理员',
                        email: 'admin@example.com',
                        role: 'admin',
                        accountType: '标准版',
                        createdAt: new Date().toISOString()
                    }
                ];
            } finally {
                this.isLoading = false;
            }
        },
        
        // 添加用户
        async addUser() {
            this.isAddingUser = true;
            this.addUserError = '';
            
            // 表单验证
            if (!this.newUser.username || !this.newUser.password || !this.newUser.name || !this.newUser.email) {
                this.addUserError = '请填写所有必填字段';
                this.isAddingUser = false;
                return;
            }
            
            const token = localStorage.getItem(CONFIG.TOKEN_KEY);
            
            if (!token) {
                console.log('未找到登录令牌，跳转到登录页');
                window.location.href = 'login.html';
                return;
            }
            
            try {
                console.log('正在添加新用户:', this.newUser.username);
                const response = await fetch(`${CONFIG.API_BASE_URL}/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(this.newUser)
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    console.error('添加用户失败:', data);
                    throw new Error(data.message || '添加用户失败');
                }
                
                // 添加成功，关闭模态框并重新加载用户列表
                console.log('添加用户成功:', this.newUser.username);
                this.showAddUserModal = false;
                this.newUser = {
                    username: '',
                    password: '',
                    name: '',
                    email: '',
                    role: 'user',
                    accountType: ''
                };
                
                // 重新加载用户列表
                this.getUsers();
            } catch (error) {
                console.error('添加用户错误:', error);
                this.addUserError = error.message || '添加用户失败';
            } finally {
                this.isAddingUser = false;
            }
        },
        
        // 退出登录
        logout() {
            console.log('退出登录');
            localStorage.removeItem(CONFIG.TOKEN_KEY);
            window.location.href = 'index.html';
        },
        
        // 格式化日期
        formatDate(dateString) {
            if (!dateString) return '未知时间';
            
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return '无效日期';
            }
            
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        
        // 返回首页
        goToHome() {
            window.location.href = 'index.html';
        }
    },
    mounted() {
        // 初始化时获取当前用户信息
        this.getCurrentUser();
    }
}); 