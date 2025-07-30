// AI战略名片应用逻辑
new Vue({
    el: '#ai-card-app',
    data: {
        // 个人资料
        profile: {
            name: '陈明远',
            avatar: 'img/profile-avatar.svg', // 改用SVG以确保清晰显示
            titles: [
                'AI增长战略顾问',
                'AI产业赋能基金 合伙人',
                '战略资源链接者'
            ],
            tagline: '我们不创造产品，我们创造增长。',
            phone: '+86 138 8888 8888',
            email: 'contact@mobileaica.com',
            // 新增社交媒体联系方式
            wechat: 'AICA_Growth',
            whatsapp: '+86 138 8888 8888',
            line: 'aica_growth',
            facebook: 'facebook.com/aicagrowth',
            address: '北京市朝阳区建国路88号 SOHO现代城 1505室'
        },
        
        // 分享名片相关
        showShareCardModal: false,
        shareCardImageUrl: null,

        // 当前选择的职位头衔
        currentTitle: 'AI增长战略顾问',
        showTitleOptions: false,
        
        // 价值魔方详情
        showValueModal: false,
        currentValueType: '',
        currentValueDetails: {
            title: '',
            description: ''
        },
        
        // 访客信息采集
        showContactModal: false,
        visitorInfo: {
            name: '',
            company: '',
            position: '',
            phone: '',
            interest: ''
        },
        
        // 聊天功能
        showChatAssistant: false,
        userInput: '',
        isTyping: false,
        messages: [],
        
        // 与人物直接对话功能
        showPersonalChat: false,
        personalChatInput: '',
        isPersonalChatTyping: false,
        personalChatMessages: [],
        
        // 文件列表
        files: [
            {
                name: 'AI获客白皮书.pdf',
                type: 'pdf',
                size: '2.4 MB',
                date: '2023-09-15',
                url: 'files/ai-growth-whitepaper.pdf'
            },
            {
                name: '数字营销趋势报告.pptx',
                type: 'ppt',
                size: '5.1 MB',
                date: '2023-08-20',
                url: 'files/digital-marketing-trends.pptx'
            },
            {
                name: '客户案例分析.xlsx',
                type: 'excel',
                size: '1.2 MB',
                date: '2023-10-05',
                url: 'files/client-case-analysis.xlsx'
            }
        ],
        
        // 视频列表
        videos: [
            {
                title: 'AI营销入门指南',
                thumbnail: 'img/videos/interaction-thumb1.jpg',
                duration: '05:32',
                url: 'videos/interaction-video1.mp4'
            },
            {
                title: '如何利用AI提升转化率',
                thumbnail: 'img/videos/interaction-thumb2.jpg',
                duration: '08:45',
                url: 'videos/interaction-video2.mp4'
            },
            {
                title: '一人公司运营秘诀',
                thumbnail: 'img/videos/customer-thumb1.jpg',
                duration: '12:18',
                url: 'videos/customer-video1.mp4'
            }
        ],
        currentVideo: null,
        showVideoPlayer: false,
        
        // 商机广场相关数据
        opportunities: [
            {
                id: 1,
                title: 'AI零售解决方案',
                summary: '利用AI技术提升零售业客流与转化率，降低运营成本',
                thumbnail: 'img/videos/silicon-thumb1.jpg',
                videoUrl: 'videos/silicon-video1.mp4',
                industry: '零售行业',
                cardsCount: 5,
                description: '我们的AI零售解决方案通过智能客流分析、消费者行为预测和智能库存管理，帮助零售商提升运营效率，降低成本，并提供个性化的购物体验。该方案已在多家连锁零售企业成功落地，平均提升销售额35%，降低库存成本28%。',
                relatedCards: ['王明', '李芳', '张强', '刘伟', '陈思']
            },
            {
                id: 2,
                title: '数字营销合作机会',
                summary: '整合AI创意生成与精准投放，提供全链路营销服务',
                thumbnail: 'img/videos/customer-thumb2.jpg',
                videoUrl: 'videos/customer-video2.mp4',
                industry: '营销服务',
                cardsCount: 3,
                description: '我们正在寻找数字营销领域的合作伙伴，共同打造基于AI的营销服务生态。我们提供AI创意生成、智能投放优化和效果预测分析，可与您的渠道资源和行业经验形成互补，共同为客户创造更大价值。',
                relatedCards: ['赵明', '钱芳', '孙伟']
            },
            {
                id: 3,
                title: 'SaaS产品融资机会',
                summary: '寻求Pre-A轮融资的AI驱动SaaS产品，已有成熟客户案例',
                thumbnail: 'img/videos/silicon-thumb3.jpg',
                videoUrl: 'videos/silicon-video3.mp4',
                industry: '软件服务',
                cardsCount: 2,
                description: '我们的AI客户关系管理SaaS平台已服务超过50家企业客户，月收入稳定增长，目前寻求500万Pre-A轮融资用于扩大市场份额和技术团队建设。产品具有AI驱动的客户洞察、自动化销售流程和智能化客户服务等核心功能。',
                relatedCards: ['周强', '吴婷']
            }
        ],
        
        // 使用指南相关
        showSetupGuideModal: false,
        
        // 商机展示相关
        activeCategory: 'all',
        businessItems: [
            {
                id: 1,
                title: 'AI教育内容生成平台寻求行业合作',
                description: '我们的AI教育内容生成平台可自动生成个性化教学材料，适配不同学习风格和进度，现寻求K12教育机构合作伙伴进行落地应用。',
                tag: '技术合作',
                tagColor: '#3498db',
                contact: '李明',
                date: '2023-11-12',
                category: 'education'
            },
            {
                id: 2,
                title: '智能零售系统寻求连锁店测试',
                description: '我们开发的智能零售系统可提升库存管理效率30%，寻求中小型连锁零售店进行免费试点，共同打造AI零售标杆案例。',
                tag: '试点合作',
                tagColor: '#e74c3c',
                contact: '王芳',
                date: '2023-11-15',
                category: 'retail'
            },
            {
                id: 3,
                title: 'AI风控系统寻求金融机构合作',
                description: '我们的AI风控系统能有效降低贷款违约率20%以上，通过机器学习实现动态风险评估，现寻求金融机构进行技术合作。',
                tag: '风险投资',
                tagColor: '#2ecc71',
                contact: '张伟',
                date: '2023-11-18',
                category: 'finance'
            },
            {
                id: 4,
                title: '5G+AI工业解决方案寻求制造业合作',
                description: '结合5G和AI技术的智能制造解决方案，可实现生产流程优化和设备预测性维护，寻求制造业合作伙伴共建智能工厂。',
                tag: '项目合作',
                tagColor: '#9b59b6',
                contact: '刘强',
                date: '2023-11-20',
                category: 'tech'
            },
            {
                id: 5,
                title: '知识图谱技术寻求研发合作',
                description: '我们在知识图谱领域有深入研究，寻求在医疗、金融或法律等垂直行业有数据资源的合作伙伴，共同开发行业智能解决方案。',
                tag: '技术合作',
                tagColor: '#3498db',
                contact: '陈华',
                date: '2023-11-22',
                category: 'tech'
            }
        ],
        
        // 防止多次触发
        touchStartY: 0,
        isTouchMoving: false,
        hasTouchedChat: false,
        sendButtonEnabled: true,
        
        // 商机详情弹窗
        showOpportunityDetailModal: false,
        currentOpportunity: null,
        
        // 商机详情弹窗
        showBusinessDetailModal: false,
        currentBusinessItem: null,
        
        // 更新数据结构，适应新的UI设计
        cardInfo: {
            avatar: "img/profile-avatar.svg",
            name: "谭云杰",
            title: "深圳营销负责人",
            company: "联享科技",
            isVerified: true,
            slogan: "连接未来，共享商机",
            tags: ["人工智能", "数字营销", "增长策略"],
            bio: "专注于AI营销策略与执行十年，帮助超过50家企业提升营销效率。擅长将技术与营销完美结合，让数据驱动决策，让智能赋能业务。",
            servedCount: 1280,
            projects: 86,
            yearsExperience: 10,
            qrCode: "img/qrcode-placeholder.svg",
            
            // 联系方式
            phone: "+86 13800138000",
            email: "zhang@example.com",
            wechat: "zhangdalian",
            whatsapp: "+86 13800138000",
            line: "zhangdalian",
            facebook: "zhangdalian.aica",
            address: "深圳市福田区新一代产业园1栋30楼"
        }
    },
    
    computed: {
        // 根据当前选择的类别过滤商机项目
        filteredBusinessItems() {
            if (this.activeCategory === 'all') {
                return this.businessItems;
            } else {
                return this.businessItems.filter(item => item.category === this.activeCategory);
            }
        }
    },
    
    mounted() {
        // 添加默认欢迎消息
        this.addAIMessage("您好！我是您的AI战略顾问。请问您想了解哪方面的服务？");
        
        // 监听访问行为
        this.trackVisit();
        
        // 收集设备信息
        this.collectDeviceInfo();
        
        // 添加移动端触摸事件处理
        this.setupTouchEvents();
        
        // 添加返回键监听
        this.setupBackButtonHandler();
        
        // 优化图片加载
        this.preloadImages();
    },
    
    methods: {
        // 返回上一页
        goBack() {
            window.location.href = 'index.html';
        },
        
        // 切换职位头衔下拉菜单
        toggleTitleOptions() {
            this.showTitleOptions = !this.showTitleOptions;
            
            // 点击外部关闭下拉菜单
            if (this.showTitleOptions) {
                setTimeout(() => {
                    document.addEventListener('click', this.closeTitleDropdown);
                }, 10);
            }
        },
        
        // 关闭头衔下拉菜单
        closeTitleDropdown(event) {
            const dropdown = document.querySelector('.dynamic-title');
            if (dropdown && !dropdown.contains(event.target)) {
                this.showTitleOptions = false;
                document.removeEventListener('click', this.closeTitleDropdown);
            }
        },
        
        // 选择职位头衔
        selectTitle(title) {
            this.currentTitle = title;
            this.showTitleOptions = false;
            document.removeEventListener('click', this.closeTitleDropdown);
            
            // 记录交互
            this.trackInteraction('title_change', {
                selected_title: title
            });
        },
        
        // 显示价值详情
        showValueDetails(type) {
            this.currentValueType = type;
            
            switch(type) {
                case 'ai-growth':
                    this.currentValueDetails.title = 'AI驱动增长';
                    break;
                case 'system-efficiency':
                    this.currentValueDetails.title = '系统重塑效率';
                    break;
                case 'capital-future':
                    this.currentValueDetails.title = '资本链接未来';
                    break;
            }
            
            this.showValueModal = true;
            
            // 记录交互
            this.trackInteraction('value_click', {
                value_type: type
            });
            
            // 禁止背景滚动
            document.body.style.overflow = 'hidden';
        },
        
        // 关闭价值详情弹窗
        closeValueModal() {
            this.showValueModal = false;
            
            // 恢复背景滚动
            document.body.style.overflow = '';
        },
        
        // 打开案例研究
        openCaseStudy(type) {
            // 在实际应用中，这里可以链接到相关案例页面或者打开PDF等资源
            console.log('Opening case study:', type);
            
            // 记录交互
            this.trackInteraction('case_study_click', {
                case_type: type
            });
            
            // 弹出联系信息采集窗口（高价值内容触发）
            this.showContactModal = true;
            
            // 禁止背景滚动
            document.body.style.overflow = 'hidden';
        },
        
        // 切换聊天助手显示状态
        toggleChatAssistant() {
            this.showChatAssistant = !this.showChatAssistant;
            
            // 记录交互
            if (this.showChatAssistant) {
                this.trackInteraction('chat_open', {});
                this.scrollToLatestMessage();
                
                // 添加触摸处理
                if (!this.hasTouchedChat) {
                    this.hasTouchedChat = true;
                    const chatContainer = document.querySelector('.chat-container');
                    if (chatContainer) {
                        chatContainer.addEventListener('touchstart', this.handleTouchStart, {passive: true});
                        chatContainer.addEventListener('touchmove', this.handleTouchMove, {passive: false});
                    }
                }
            }
        },
        
        // 发送聊天消息
        sendMessage(event) {
            // 防止移动端键盘上的回车键发送空消息
            if (event && event.type === 'keyup' && event.keyCode === 13) {
                // 在移动设备上，防止发送空行
                if (event.target.value.trim() === '') {
                    event.preventDefault();
                    return;
                }
                
                // 防止表单提交
                event.preventDefault();
            }
            
            if (!this.userInput.trim() || !this.sendButtonEnabled) return;
            
            // 防止快速多次点击
            this.sendButtonEnabled = false;
            
            // 添加用户消息
            this.addUserMessage(this.userInput);
            
            // 记录交互
            this.trackInteraction('user_message', {
                message: this.userInput
            });
            
            // 分析用户意图和兴趣
            this.analyzeUserIntent(this.userInput);
            
            const userInput = this.userInput;
            this.userInput = '';
            
            // 显示正在输入状态
            this.isTyping = true;
            
            // 模拟AI回复延迟
            setTimeout(() => {
                this.generateAIResponse(userInput);
                this.isTyping = false;
                this.sendButtonEnabled = true;
                
                // 检查是否应该请求联系方式
                this.checkIfShouldRequestContact();
            }, 1000 + Math.random() * 1000);
        },
        
        // 添加用户消息到聊天记录
        addUserMessage(text) {
            this.messages.push({
                sender: 'user',
                text: text
            });
            
            // 滚动到最新消息
            this.$nextTick(() => {
                this.scrollToLatestMessage();
            });
        },
        
        // 添加AI消息到聊天记录
        addAIMessage(text) {
            this.messages.push({
                sender: 'ai',
                text: text
            });
            
            // 滚动到最新消息
            this.$nextTick(() => {
                this.scrollToLatestMessage();
            });
        },
        
        // 滚动到最新消息
        scrollToLatestMessage() {
            const container = this.$refs.chatMessages;
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        },
        
        // 生成AI回复
        generateAIResponse(userInput) {
            // 简单关键词匹配
            let responseCategory = 'general';
            
            if (userInput.toLowerCase().includes('ai') && 
                (userInput.toLowerCase().includes('增长') || userInput.toLowerCase().includes('营销') || userInput.toLowerCase().includes('获客'))) {
                responseCategory = 'ai-growth';
            } else if (userInput.toLowerCase().includes('效率') || 
                      userInput.toLowerCase().includes('系统') || 
                      userInput.toLowerCase().includes('一人公司')) {
                responseCategory = 'system-efficiency';
            } else if (userInput.toLowerCase().includes('资本') || 
                      userInput.toLowerCase().includes('融资') || 
                      userInput.toLowerCase().includes('上市')) {
                responseCategory = 'capital-future';
            }
            
            // 从回复库中随机选择一个回复
            const responses = this.intelligentResponses[responseCategory];
            const randomIndex = Math.floor(Math.random() * responses.length);
            const response = responses[randomIndex];
            
            // 添加AI消息
            this.addAIMessage(response);
            
            // 根据用户输入的内容提升兴趣级别
            if (responseCategory !== 'general') {
                if (this.visitorData.interestLevel === 'low') {
                    this.visitorData.interestLevel = 'medium';
                } else if (this.visitorData.interestLevel === 'medium') {
                    this.visitorData.interestLevel = 'high';
                }
                
                this.visitorData.category = responseCategory;
            }
        },
        
        // 分析用户意图和兴趣
        analyzeUserIntent(userInput) {
            // 简单的意图分析示例
            if (userInput.toLowerCase().includes('联系') || 
                userInput.toLowerCase().includes('咨询') || 
                userInput.toLowerCase().includes('电话') ||
                userInput.toLowerCase().includes('微信')) {
                // 用户有联系意图
                this.visitorData.interestLevel = 'high';
                
                // 记录意图
                this.trackInteraction('contact_intent', {
                    message: userInput
                });
            }
            
            // 识别用户感兴趣的服务类别
            if (userInput.toLowerCase().includes('ai') && 
               (userInput.toLowerCase().includes('增长') || userInput.toLowerCase().includes('营销'))) {
                this.visitorData.category = 'ai-growth';
            } else if (userInput.toLowerCase().includes('效率') || 
                      userInput.toLowerCase().includes('系统')) {
                this.visitorData.category = 'system-efficiency';
            } else if (userInput.toLowerCase().includes('资本') || 
                      userInput.toLowerCase().includes('融资')) {
                this.visitorData.category = 'capital-future';
            }
        },
        
        // 检查是否应该请求联系方式
        checkIfShouldRequestContact() {
            if (this.visitorData.interestLevel === 'high' && 
                this.messages.length > 5 && 
                !this.showContactModal) {
                // 用户兴趣度高且交流了多轮，请求联系方式
                setTimeout(() => {
                    this.showContactModal = true;
                    document.body.style.overflow = 'hidden';
                    
                    // 记录弹窗展示
                    this.trackInteraction('contact_modal_shown', {});
                }, 1000);
            }
        },
        
        // 关闭联系信息采集弹窗
        closeContactModal() {
            this.showContactModal = false;
            document.body.style.overflow = '';
        },
        
        // 提交访客信息
        submitVisitorInfo() {
            // 表单验证
            if (!this.visitorInfo.name || !this.visitorInfo.phone) {
                alert('请填写您的姓名和联系电话');
                return;
            }
            
            console.log('提交访客信息:', this.visitorInfo);
            
            // 记录提交行为
            this.trackInteraction('contact_submitted', {
                visitor_info: this.visitorInfo
            });
            
            // 向后端API发送数据
            // 这里可以添加实际的AJAX请求代码
            
            // 显示感谢消息
            this.showContactModal = false;
            document.body.style.overflow = '';
            
            // 在聊天中添加感谢消息
            if (this.showChatAssistant) {
                setTimeout(() => {
                    this.addAIMessage('感谢您提供联系方式！我们的顾问将尽快与您联系。');
                }, 500);
            } else {
                // 如果聊天窗口没有打开，显示一个弹窗
                alert('感谢您提供联系方式！我们的顾问将尽快与您联系。');
            }
            
            // 重置表单
            this.visitorInfo = {
                name: '',
                company: '',
                position: '',
                phone: '',
                interest: ''
            };
        },
        
        // 跟踪访问
        trackVisit() {
            console.log('新访问记录:', this.visitorData.visitTime);
            // 这里可以添加实际的访问跟踪代码，如Google Analytics或自定义后端API
        },
        
        // 跟踪用户交互
        trackInteraction(type, data) {
            const interaction = {
                type: type,
                time: new Date(),
                data: data
            };
            
            this.visitorData.interactions.push(interaction);
            console.log('记录交互:', interaction);
            
            // 这里可以添加实际的交互跟踪代码，如事件上报
        },
        
        // 收集设备信息
        collectDeviceInfo() {
            this.visitorData.deviceInfo = {
                screenWidth: window.innerWidth,
                screenHeight: window.innerHeight,
                userAgent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform
            };
            
            console.log('设备信息:', this.visitorData.deviceInfo);
        },
        
        // 设置触摸事件处理
        setupTouchEvents() {
            document.addEventListener('touchstart', this.handleTouchStart, {passive: true});
            document.addEventListener('touchmove', this.handleTouchMove, {passive: true});
        },
        
        // 处理触摸开始
        handleTouchStart(event) {
            this.touchStartY = event.touches[0].clientY;
            this.isTouchMoving = false;
        },
        
        // 处理触摸移动
        handleTouchMove(event) {
            this.isTouchMoving = true;
            
            // 仅在聊天窗口内处理滚动问题
            if (event.target.closest('.chat-container')) {
                const currentY = event.touches[0].clientY;
                const chatMessages = this.$refs.chatMessages;
                
                if (chatMessages) {
                    // 如果在顶部继续下拉，或在底部继续上拉，则阻止默认行为以防止背景滚动
                    if ((chatMessages.scrollTop <= 0 && currentY > this.touchStartY) ||
                        (chatMessages.scrollHeight - chatMessages.scrollTop <= chatMessages.clientHeight && currentY < this.touchStartY)) {
                        event.preventDefault();
                    }
                }
            }
        },
        
        // 设置返回按钮处理
        setupBackButtonHandler() {
            // 在移动设备上处理物理返回按钮
            if (window.history && window.history.pushState) {
                // 先加入一个空白历史记录，这样后退会先触发我们的事件处理
                const pushUrl = window.location.href;
                window.history.pushState({page: 'ai-card'}, document.title, pushUrl);
                
                window.onpopstate = (event) => {
                    // 如果有弹窗打开，先关闭弹窗
                    if (this.showValueModal) {
                        event.preventDefault();
                        this.closeValueModal();
                        window.history.pushState({page: 'ai-card'}, document.title, pushUrl);
                        return;
                    }
                    
                    if (this.showContactModal) {
                        event.preventDefault();
                        this.closeContactModal();
                        window.history.pushState({page: 'ai-card'}, document.title, pushUrl);
                        return;
                    }

                    if (this.showVideoPlayer) {
                        event.preventDefault();
                        this.closeVideoPlayer();
                        window.history.pushState({page: 'ai-card'}, document.title, pushUrl);
                        return;
                    }
                    
                    if (this.showPersonalChat) {
                        event.preventDefault();
                        this.closePersonalChat();
                        window.history.pushState({page: 'ai-card'}, document.title, pushUrl);
                        return;
                    }
                    
                    if (this.showChatAssistant) {
                        event.preventDefault();
                        this.toggleChatAssistant();
                        window.history.pushState({page: 'ai-card'}, document.title, pushUrl);
                        return;
                    }
                    
                    // 如果没有弹窗，则正常返回上一页
                    window.location.href = 'index.html';
                };
            }
        },
        
        // 预加载图片
        preloadImages() {
            const imagesToPreload = [
                'img/ajia-logo.svg',
                'img/whitepaper-icon.svg',
                'img/case-donna.jpg',
                'img/one-person-company.gif',
                'img/analysis-icon.svg',
                'img/strategy-icon.svg',
                'img/implementation-icon.svg',
                'img/ipo-icon.svg'
            ];
            
            imagesToPreload.forEach(src => {
                const img = new Image();
                img.src = src;
            });
        },

        // 文件模块相关方法
        getFileIcon(type) {
            // 根据文件类型返回对应图标
            switch(type) {
                case 'pdf':
                    return 'img/pdf-icon.svg';
                case 'ppt':
                    return 'img/ppt-icon.svg';
                case 'excel':
                    return 'img/excel-icon.svg';
                case 'doc':
                    return 'img/doc-icon.svg';
                case 'image':
                    return 'img/image-icon.svg';
                default:
                    return 'img/file-icon.svg';
            }
        },
        
        downloadFile(file) {
            // 记录文件下载事件
            this.trackInteraction('file_download', {
                file_name: file.name,
                file_type: file.type
            });
            
            // 实际下载文件
            console.log('下载文件:', file.url);
            
            // 在实际应用中，可以使用以下代码触发文件下载
            // const link = document.createElement('a');
            // link.href = file.url;
            // link.download = file.name;
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);
            
            // 如果是高价值内容，弹出联系方式收集
            if (file.name.includes('白皮书') || file.name.includes('报告')) {
                setTimeout(() => {
                    this.showContactModal = true;
                    document.body.style.overflow = 'hidden';
                }, 500);
            }
        },
        
        // 视频模块相关方法
        playVideo(video) {
            // 记录视频播放事件
            this.trackInteraction('video_play', {
                video_title: video.title,
                video_url: video.url
            });
            
            // 设置当前视频并显示播放器
            this.currentVideo = video;
            this.showVideoPlayer = true;
            
            // 禁止背景滚动
            document.body.style.overflow = 'hidden';
        },
        
        closeVideoPlayer() {
            // 关闭视频播放器
            this.showVideoPlayer = false;
            
            // 恢复背景滚动
            document.body.style.overflow = '';
            
            // 记录视频关闭事件
            this.trackInteraction('video_close', {
                video_title: this.currentVideo.title
            });
            
            // 重置当前视频
            this.currentVideo = null;
        },
        
        // 个人对话模块相关方法
        startPersonalChat() {
            // 显示个人对话弹窗
            this.showPersonalChat = true;
            
            // 禁止背景滚动
            document.body.style.overflow = 'hidden';
            
            // 记录开始对话事件
            this.trackInteraction('personal_chat_start', {
                agent_name: this.profile.name
            });
            
            // 如果是第一次打开，添加欢迎消息
            if (this.personalChatMessages.length === 0) {
                // 从个人消息库中获取欢迎消息
                const welcomeMessage = this.intelligentResponses.personal[0];
                
                this.addPersonalAgentMessage(welcomeMessage);
            }
            
            // 设置消息区域滚动
            this.$nextTick(() => {
                this.scrollToLatestPersonalMessage();
            });
        },
        
        closePersonalChat() {
            // 关闭个人对话弹窗
            this.showPersonalChat = false;
            
            // 恢复背景滚动
            document.body.style.overflow = '';
            
            // 记录关闭对话事件
            this.trackInteraction('personal_chat_close', {});
        },
        
        sendPersonalChatMessage(event) {
            // 防止移动端键盘上的回车键发送空消息
            if (event && event.type === 'keyup' && event.keyCode === 13) {
                // 在移动设备上，防止发送空行
                if (event.target.value.trim() === '') {
                    event.preventDefault();
                    return;
                }
                
                // 防止表单提交
                event.preventDefault();
            }
            
            if (!this.personalChatInput.trim()) return;
            
            // 添加用户消息
            this.addPersonalUserMessage(this.personalChatInput);
            
            // 记录交互
            this.trackInteraction('personal_user_message', {
                message: this.personalChatInput
            });
            
            const userInput = this.personalChatInput;
            this.personalChatInput = '';
            
            // 显示正在输入状态
            this.isPersonalChatTyping = true;
            
            // 模拟回复延迟
            setTimeout(() => {
                this.generatePersonalAgentResponse(userInput);
                this.isPersonalChatTyping = false;
                
                // 检查是否应该请求联系方式
                if (this.personalChatMessages.length > 4 && !this.showContactModal) {
                    setTimeout(() => {
                        this.showContactModal = true;
                        document.body.style.overflow = 'hidden';
                    }, 1000);
                }
            }, 1500 + Math.random() * 1500); // 稍微长一点的延迟，模拟更真实的回复
        },
        
        addPersonalUserMessage(text) {
            this.personalChatMessages.push({
                sender: 'user',
                text: text
            });
            
            // 滚动到最新消息
            this.$nextTick(() => {
                this.scrollToLatestPersonalMessage();
            });
        },
        
        addPersonalAgentMessage(text) {
            this.personalChatMessages.push({
                sender: 'agent',
                text: text
            });
            
            // 滚动到最新消息
            this.$nextTick(() => {
                this.scrollToLatestPersonalMessage();
            });
        },
        
        scrollToLatestPersonalMessage() {
            const container = this.$refs.personalChatMessages;
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        },
        
        generatePersonalAgentResponse(userInput) {
            // 从个人回复库中随机选择一个回复
            const responses = this.intelligentResponses.personal;
            // 跳过第一个欢迎消息
            const randomIndex = Math.floor(Math.random() * (responses.length - 1)) + 1;
            const response = responses[randomIndex];
            
            // 添加个人代理消息
            this.addPersonalAgentMessage(response);
            
            // 提升访客兴趣级别
            if (this.visitorData.interestLevel === 'low') {
                this.visitorData.interestLevel = 'medium';
            } else if (this.visitorData.interestLevel === 'medium') {
                this.visitorData.interestLevel = 'high';
            }
        },
        
        // 查看商机详情
        viewOpportunityDetail(opportunityId) {
            this.currentOpportunity = this.opportunities.find(opp => opp.id === opportunityId);
            if (this.currentOpportunity) {
                this.showOpportunityDetailModal = true;
                document.body.style.overflow = 'hidden';
                
                // 记录交互
                this.trackInteraction('opportunity_view', {
                    opportunity_id: opportunityId,
                    opportunity_title: this.currentOpportunity.title
                });
            }
        },
        
        // 关闭商机详情弹窗
        closeOpportunityDetailModal() {
            this.showOpportunityDetailModal = false;
            document.body.style.overflow = '';
        },
        
        // 查看所有商机
        viewAllOpportunities() {
            // 可以跳转到专门的商机页面或展示更多商机
            this.trackInteraction('view_all_opportunities', {});
            alert('即将推出更多商机，敬请期待！');
        },
        
        // 设置商机类别
        setActiveCategory(category) {
            this.activeCategory = category;
            
            // 记录交互
            this.trackInteraction('business_category_change', {
                selected_category: category
            });
        },
        
        // 查看商机详情
        viewBusinessDetail(item) {
            this.currentBusinessItem = item;
            this.showBusinessDetailModal = true;
            document.body.style.overflow = 'hidden';
            
            // 记录交互
            this.trackInteraction('business_item_view', {
                business_id: item.id,
                business_title: item.title
            });
        },
        
        // 关闭商机详情弹窗
        closeBusinessDetailModal() {
            this.showBusinessDetailModal = false;
            document.body.style.overflow = '';
        },
        
        // 显示设置指南
        showSetupGuide() {
            // 可以显示详细的设置指南或跳转到专门的指南页面
            this.trackInteraction('show_setup_guide', {});
            alert('详细的AI名片设置指南即将推出！');
        },
        
        // 联系商机发布者
        contactBusinessPublisher(item) {
            this.showContactModal = true;
            this.visitorInfo.interest = `对"${item.title}"感兴趣`;
            
            // 记录交互
            this.trackInteraction('contact_business_publisher', {
                business_id: item.id,
                business_title: item.title
            });
        },
        
        // 添加至我的收藏
        addToFavorites(item) {
            // 可以实现收藏功能
            this.trackInteraction('add_to_favorites', {
                item_id: item.id,
                item_title: item.title,
                item_type: 'business'
            });
            alert(`"${item.title}"已添加至您的收藏！`);
        },
        
        // 开始创建我的名片
        startCreateCard() {
            alert('创建名片功能即将上线，敬请期待！');
            // 跳转到创建名片页面或弹出创建名片表单
            this.trackInteraction('create_card_click', {});
        },

        // 分享名片相关方法
        shareCard() {
            // 打开分享名片弹窗
            this.showShareCardModal = true;
            this.trackInteraction('share_card_click', {});
            
            // 延迟一下确保DOM已更新
            this.$nextTick(() => {
                // 生成分享图片
                this.generateShareCardImage();
            });
        },
        
        closeShareCardModal() {
            this.showShareCardModal = false;
        },
        
        generateShareCardImage() {
            const canvas = this.$refs.shareCardCanvas;
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            
            // 设置画布大小 - 标准名片尺寸
            canvas.width = 640;
            canvas.height = 1000;
            
            // 绘制背景
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 绘制顶部渐变背景
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 200);
            gradient.addColorStop(0, '#0070ff');
            gradient.addColorStop(1, '#00c8ff');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, 200);
            
            // 加载头像图片
            const avatar = new Image();
            avatar.crossOrigin = 'Anonymous';
            avatar.src = this.cardInfo.avatar || 'img/profile-avatar.svg';
            
            avatar.onload = () => {
                // 在中央上部绘制圆形头像
                const avatarSize = 120;
                const avatarX = canvas.width / 2 - avatarSize / 2;
                const avatarY = 140; // 头像中心点位于顶部背景下方一点
                
                ctx.save();
                ctx.beginPath();
                ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
                
                // 绘制头像
                ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
                ctx.restore();
                
                // 添加白色圆形边框
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 2, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.stroke();
                
                // 绘制姓名文本
                ctx.fillStyle = '#333333';
                ctx.font = 'bold 36px Arial, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(this.cardInfo.name, canvas.width / 2, avatarY + avatarSize + 60);
                
                // 绘制职位文本
                ctx.fillStyle = '#666666';
                ctx.font = '24px Arial, sans-serif';
                let titleText = this.cardInfo.title;
                if (this.cardInfo.company) {
                    titleText += ` · ${this.cardInfo.company}`;
                }
                ctx.fillText(titleText, canvas.width / 2, avatarY + avatarSize + 100);
                
                // 绘制简介文本
                if (this.cardInfo.bio) {
                    ctx.fillStyle = '#333333';
                    ctx.font = '18px Arial, sans-serif';
                    ctx.textAlign = 'left';
                    
                    // 优化的中文文本换行处理
                    const maxLineWidth = canvas.width - 80;
                    const lineHeight = 30;
                    const text = this.cardInfo.bio;
                    let y = avatarY + avatarSize + 150;
                    
                    // 每16个中文字符左右检查一下是否需要换行
                    let line = '';
                    let currentIndex = 0;
                    
                    while (currentIndex < text.length) {
                        // 每次取一个字符
                        const char = text.charAt(currentIndex);
                        const testLine = line + char;
                        const metrics = ctx.measureText(testLine);
                        
                        if (metrics.width > maxLineWidth) {
                            ctx.fillText(line, 40, y);
                            line = char;
                            y += lineHeight;
                        } else {
                            line = testLine;
                        }
                        
                        currentIndex++;
                    }
                    
                    // 绘制最后一行
                    if (line) {
                        ctx.fillText(line, 40, y);
                    }
                }
                
                // 绘制底部信息
                ctx.fillStyle = '#0070ff';
                ctx.font = 'bold 22px Arial, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('联系方式', canvas.width / 2, canvas.height - 200);
                
                // 绘制联系方式
                ctx.fillStyle = '#333333';
                ctx.font = '18px Arial, sans-serif';
                ctx.textAlign = 'center';
                let contactY = canvas.height - 160;
                
                if (this.cardInfo.phone) {
                    ctx.fillText(`电话: ${this.cardInfo.phone}`, canvas.width / 2, contactY);
                    contactY += 30;
                }
                
                if (this.cardInfo.email) {
                    ctx.fillText(`邮箱: ${this.cardInfo.email}`, canvas.width / 2, contactY);
                    contactY += 30;
                }
                
                if (this.cardInfo.wechat) {
                    ctx.fillText(`微信: ${this.cardInfo.wechat}`, canvas.width / 2, contactY);
                }
                
                // 绘制底部标识
                ctx.fillStyle = '#999999';
                ctx.font = '16px Arial, sans-serif';
                ctx.fillText('AI战略名片 - AICA', canvas.width / 2, canvas.height - 30);
                
                // 将Canvas转换为图片URL
                this.shareCardImageUrl = canvas.toDataURL('image/jpeg', 0.9);
            };
            
            avatar.onerror = () => {
                console.error('加载头像失败，使用默认图像');
                avatar.src = 'img/profile-avatar.svg';
            };
        },
        
        downloadShareCardImage() {
            if (!this.shareCardImageUrl) return;
            
            // 创建下载链接
            const link = document.createElement('a');
            link.href = this.shareCardImageUrl;
            link.download = `${this.cardInfo.name}-名片.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.trackInteraction('download_card_image', {});
        },

        openContact(type, value) {
            this.trackInteraction('contact_click', {
                contact_type: type,
                contact_value: value
            });
            
            switch (type) {
                case 'phone':
                    window.location.href = `tel:${value}`;
                    break;
                case 'email':
                    window.location.href = `mailto:${value}`;
                    break;
                case 'wechat':
                    // 显示微信二维码或复制微信号
                    this.copyToClipboard(value);
                    alert(`微信号 "${value}" 已复制到剪贴板`);
                    break;
                case 'whatsapp':
                    // 去除非数字字符
                    const whatsappNumber = value.replace(/\D/g, '');
                    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
                    break;
                case 'line':
                    window.open(`https://line.me/ti/p/~${encodeURIComponent(value)}`, '_blank');
                    break;
                case 'facebook':
                    window.open(`https://www.facebook.com/${value}`, '_blank');
                    break;
                case 'address':
                    // 打开地图应用
                    const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(value)}`;
                    window.open(mapUrl, '_blank');
                    break;
            }
        },
        
        // 复制文本到剪贴板
        copyToClipboard(text) {
            const el = document.createElement('textarea');
            el.value = text;
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        }
    }
}); 