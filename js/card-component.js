// 联享名片组件
Vue.component('business-card', {
    props: {
        name: String,
        title: String,
        avatar: String,
        intro: String,
        servedCount: Number,
        agentId: String
    },
    template: `
        <div class="card-container">
            <div class="business-card-blue">
                <div class="card-header-new">
                    <div class="card-service-counter">已接待 <strong>{{ servedCount }}</strong> 人</div>
                    <div class="card-person-container">
                        <div class="card-person-info-blue">
                            <h3 class="person-name">{{ name }}</h3>
                            <div class="person-title">{{ title }}</div>
                        </div>
                        <div class="card-avatar-blue">
                            <img :src="avatar" :alt="name + '头像'">
                        </div>
                    </div>
                </div>
                
                <div class="card-intro-blue">
                    <p>{{ intro }}</p>
                </div>
                
                <div class="card-buttons">
                    <div class="card-btn view-full-btn" @click="navigateTo('ai-card-new')">查看完整名片</div>
                    <div class="card-btn chat-with-btn" @click="navigateToAgent(agentId)">与{{ name }}对话</div>
                </div>
            </div>
        </div>
    `,
    methods: {
        navigateTo(page) {
            this.$parent.navigateTo(page);
        },
        navigateToAgent(agent) {
            this.$parent.navigateToAgent(agent);
        }
    }
}); 