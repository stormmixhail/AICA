// 模拟API数据文件
// 用于GitHub Pages部署，替代后端API调用

const MockAPI = {
  // 用户相关模拟数据
  users: {
    current: {
      id: 'mock-user-1',
      name: '示例用户',
      email: 'demo@example.com',
      avatar: 'img/avatar-placeholder.svg',
      role: 'user'
    },
    list: [
      { id: 'mock-user-1', name: '示例用户', email: 'demo@example.com', role: 'user' },
      { id: 'mock-user-2', name: '管理员', email: 'admin@example.com', role: 'admin' }
    ]
  },
  
  // 名片相关模拟数据
  cards: [
    { id: 1, title: '营销顾问', description: '专注数字营销策略', tags: ['营销', '咨询'] },
    { id: 2, title: '技术总监', description: '前沿技术解决方案', tags: ['技术', '管理'] },
    { id: 3, title: '创意设计师', description: '视觉创意与品牌塑造', tags: ['设计', '创意'] }
  ],
  
  // 功能区域模拟数据
  functionalAreas: [
    { _id: 'area-1', name: '营销获客', status: 'active', description: '智能营销工具与获客引擎' },
    { _id: 'area-2', name: '数字人', status: 'active', description: '虚拟数字人形象' },
    { _id: 'area-3', name: 'AI名片', status: 'active', description: '智能电子名片系统' }
  ],
  
  // 角色与权限模拟数据
  roles: [
    { _id: 'role-1', name: '管理员', permissions: ['read', 'write', 'admin'] },
    { _id: 'role-2', name: '编辑', permissions: ['read', 'write'] },
    { _id: 'role-3', name: '访客', permissions: ['read'] }
  ],
  
  // 聊天模拟数据
  chats: [
    { id: 'chat-1', userId: 'mock-user-1', messages: [
      { text: '你好，有什么可以帮助你的？', sender: 'ai', timestamp: Date.now() - 10000 },
      { text: '我想了解AI营销功能', sender: 'user', timestamp: Date.now() - 5000 }
    ]},
    { id: 'chat-2', userId: 'mock-user-1', messages: [] }
  ]
};

// 模拟API请求处理函数
const mockFetch = async (url, options = {}) => {
  console.log(`[模拟API请求] ${options.method || 'GET'} ${url}`);
  
  // 延迟100-300ms模拟网络请求
  await new Promise(r => setTimeout(r, 100 + Math.random() * 200));
  
  // 解析URL路径
  const path = url.replace(/^.*\/api\//, '').split('/');
  const resource = path[0];
  
  // 根据路径返回相应数据
  switch(resource) {
    case 'auth':
      if (path[1] === 'me') {
        return { ok: true, json: () => Promise.resolve(MockAPI.users.current) };
      }
      break;
      
    case 'users':
      return { ok: true, json: () => Promise.resolve(MockAPI.users.list) };
      
    case 'cards':
      return { ok: true, json: () => Promise.resolve(MockAPI.cards) };
      
    case 'functional-areas':
    case 'functionalAreas':
    case 'functional-areas':
      if (path.length === 1) {
        return { ok: true, json: () => Promise.resolve(MockAPI.functionalAreas) };
      }
      break;
      
    case 'roles':
      if (path.length === 1) {
        return { ok: true, json: () => Promise.resolve(MockAPI.roles) };
      }
      if (path[1] === 'permissions') {
        return { ok: true, json: () => Promise.resolve(['read', 'write', 'admin']) };
      }
      break;
      
    case 'admin':
      if (path[1] === 'dashboard') {
        return { 
          ok: true, 
          json: () => Promise.resolve({
            userCount: 42,
            activeUsers: 28,
            chatsCount: 156,
            newUsers: 7
          }) 
        };
      }
      break;
  }
  
  // 默认返回空数据
  return { 
    ok: true, 
    json: () => Promise.resolve({ message: '模拟API无匹配数据' })
  };
};

// 替换原生fetch函数
window.originalFetch = window.fetch;
window.fetch = function(url, options) {
  // 检查是否是API请求
  if (url.includes('/api/')) {
    return mockFetch(url, options);
  }
  
  // 非API请求使用原生fetch
  return window.originalFetch(url, options);
};

// 替换axios
if (window.axios) {
  const originalAxiosGet = window.axios.get;
  window.axios.get = function(url, options) {
    if (url.includes('/api/')) {
      return mockFetch(url, options)
        .then(res => res.json())
        .then(data => ({ data }));
    }
    return originalAxiosGet(url, options);
  };
}

console.log('[模拟API] 已启用模拟API数据，所有后端请求将使用本地数据'); 