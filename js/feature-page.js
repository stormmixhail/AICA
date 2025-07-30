// 功能页面应用逻辑
new Vue({
    el: '#feature-app',
    data: {
        // 页面状态
        detailsExpanded: true,
        
        // 对话相关
        userInput: '',
        messages: [],
        currentUserMessages: [], // 存储当前用户消息组
        currentAIMessages: [], // 存储当前AI消息组
        isTyping: false,
        
        // 示例回复（实际项目中应该从后端获取）
        sampleResponses: {
            'ai-marketing': [
                "您好！我是AI获客助手。我可以帮您分析目标客户群体，制定精准营销策略。",
                "根据您的行业特点，我建议从以下几个渠道获取潜在客户：1. 社交媒体广告 2. 内容营销 3. 搜索引擎优化 4. 合作伙伴推荐",
                "我可以为您生成针对性的营销文案和素材，提高转化率。需要我为您做个示例吗？"
            ],
            'digital-human': [
                "您好！我是数字人助手。我可以帮您创建专属的AI数字分身，提升品牌形象。",
                "您的数字人可以24小时在线，处理客户咨询，进行产品演示，甚至参与直播和视频制作。",
                "我们提供多种风格和形象定制，可以完美匹配您的品牌调性。需要看看一些案例吗？"
            ],
            'ai-company': [
                "您好！我是AI一人公司助手。我可以帮您搭建一整套创业所需的AI工具和系统。",
                "从市场调研、产品开发到营销推广、客户服务，AI可以作为您的得力助手，大幅提升效率。",
                "我们的解决方案适合个人创业者和小型团队，让您以小博大，实现业务增长。想了解具体应用场景吗？"
            ],
            'ai-card': [
                "您好！我是AI联享名片助手。我可以帮您创建智能电子名片，链接所有商业机会。",
                "您的AI名片不仅包含基本联系方式，还能智能回答客户问题，收集潜在需求，进行初步沟通。",
                "每张名片都有独特的追踪ID，让您清楚了解客户来源和互动情况。要体验一下AI名片的效果吗？"
            ]
        }
    },
    mounted() {
        // 页面加载时默认展开详情
        this.detailsExpanded = true;
        
        // 页面加载时显示欢迎消息
        const pageType = this.getPageType();
        if (pageType && this.sampleResponses[pageType]) {
            this.addAIMessage(this.sampleResponses[pageType][0]);
        }
    },
    methods: {
        // 切换详情展开/折叠状态
        toggleDetails() {
            this.detailsExpanded = !this.detailsExpanded;
        },
        
        // 返回首页
        goBack() {
            window.location.href = 'index.html';
        },
        
        // 滚动到功能区
        scrollToFunction() {
            document.querySelector('.function-area').scrollIntoView({ 
                behavior: 'smooth' 
            });
        },
        
        // 发送用户消息
        sendMessage() {
            if (!this.userInput.trim()) return;
            
            // 添加用户消息
            this.addUserMessage(this.userInput);
            const userInput = this.userInput;
            this.userInput = '';
            
            // 模拟AI正在输入
            this.isTyping = true;
            
            // 模拟AI回复延迟
            setTimeout(() => {
                this.isTyping = false;
                
                // 根据页面类型获取示例回复
                const pageType = this.getPageType();
                if (pageType && this.sampleResponses[pageType]) {
                    const responses = this.sampleResponses[pageType];
                    const randomIndex = Math.floor(Math.random() * responses.length);
                    this.addAIMessage(responses[randomIndex]);
                }
            }, 1000);
        },
        
        // 添加用户消息
        addUserMessage(text) {
            // 如果当前有AI消息组，将其添加到messages并清空
            if (this.currentAIMessages.length > 0) {
                this.messages.push({
                    type: 'ai',
                    texts: [...this.currentAIMessages]
                });
                this.currentAIMessages = [];
            }
            
            // 添加到当前用户消息组
            this.currentUserMessages.push(text);
            
            // 将当前用户消息组添加到messages
            this.messages.push({
                type: 'user',
                texts: [...this.currentUserMessages]
            });
            
            // 更新DOM后滚动到底部
            this.$nextTick(() => {
                this.scrollToBottom();
            });
        },
        
        // 添加AI消息
        addAIMessage(text) {
            // 如果当前有用户消息组，将其添加到messages并清空
            if (this.currentUserMessages.length > 0) {
                this.messages.pop(); // 移除最后一个用户消息组，因为它已经被添加过了
                this.currentUserMessages = [];
            }
            
            // 添加到当前AI消息组
            this.currentAIMessages.push(text);
            
            // 将当前AI消息组添加到messages
            this.messages.push({
                type: 'ai',
                texts: [...this.currentAIMessages]
            });
            
            // 更新DOM后滚动到底部
            this.$nextTick(() => {
                this.scrollToBottom();
            });
        },
        
        // 获取当前页面类型
        getPageType() {
            const path = window.location.pathname;
            if (path.includes('ai-marketing')) return 'ai-marketing';
            if (path.includes('digital-human')) return 'digital-human';
            if (path.includes('ai-company')) return 'ai-company';
            if (path.includes('ai-card')) return 'ai-card';
            return null;
        },
        
        // 滚动到对话底部
        scrollToBottom() {
            const chatContainer = document.querySelector('.chat-messages');
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }
}); 