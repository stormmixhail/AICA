// 全局配置文件
const CONFIG = {
  // API基础地址
  API_BASE_URL: "/api",
  // 默认头像
  DEFAULT_AVATAR: "/img/user-avatar.svg",
  // 登录令牌保存键名
  TOKEN_KEY: "aica_token"
};

// 防止CONFIG被修改
Object.freeze(CONFIG);

// Dify API配置
const DIFY_CONFIG = {
  // Dify API端点
  apiEndpoint: "https://api.dify.ai/v1/workflows/run",
  // Dify API密钥
  apiKey: "app-zSBPJ5bqKXjkKr7hlXZRhsi1",
  // 角色提示词配置
  rolePrompts: {
    "account-analyst": "你是一位AI秘书长，负责安排日程、整理文件、回复邮件等秘书工作。",
    "data-analyst": "你是一位客户关系总监，负责管理与客户的关系，解决客户问题，提升客户满意度。",
    "sop-expert": "你是一位创意总监，负责提供创意想法，设计创意方案。",
    "content-creator": "你是一位增长项目总监，负责制定增长策略，推动业务增长。",
    "customer-success": "你是一位AI参谋长，负责提供战略建议，分析市场趋势。"
  }
};

// 防止DIFY_CONFIG被修改
Object.freeze(DIFY_CONFIG);

// 确保在浏览器环境中将变量暴露到全局作用域
if (typeof window !== "undefined") {
  window.CONFIG = CONFIG;
  window.DIFY_CONFIG = DIFY_CONFIG;
}
