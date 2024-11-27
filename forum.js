document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const newTopicBtn = document.getElementById('newTopicBtn');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const searchInput = document.querySelector('.forum-search input');
    const searchBtn = document.querySelector('.forum-search button');
    const topicList = document.querySelector('.topic-list');
    const pagination = document.querySelector('.pagination');

    // 话题数据示例
    let topics = [
        {
            id: 1,
            title: '高三数学复习经验分享',
            author: '学长笔记',
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=YY',
            category: 'study',
            preview: '分享一下我在高三数学复习中的一些心得体会，希望能帮助到学弟学妹们。重点包括：1. 基础知识梳理方法 2. 难点突破技巧 3. 常见错题分析...',
            date: '2024-11-15',
            views: 256,
            comments: 23,
            likes: 45
        },
        {
            id: 2,
            title: '推荐几本物理辅导书',
            author: '物理达人',
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=WL',
            category: 'books',
            preview: '整理了一些我觉得不错的物理辅导书，包括课本难点解析和习题集。这些书帮助我提高了物理成绩，特别是在解题思路的培养方面...',
            date: '2024-11-14',
            views: 189,
            comments: 15,
            likes: 32
        },
        {
            id: 3,
            title: '化学实验复习技巧',
            author: '实验小达人',
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SY',
            category: 'study',
            preview: '化学实验是高考必考内容，分享一下我的实验复习方法：1. 实验原理理解 2. 操作要点记忆 3. 实验现象分析 4. 注意事项总结...',
            date: '2024-11-13',
            views: 167,
            comments: 19,
            likes: 28
        },
        {
            id: 4,
            title: '语文阅读理解答题技巧',
            author: '文学爱好者',
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=WX',
            category: 'experience',
            preview: '阅读理解一直是很多同学���难点，我总结了一些实用的答题技巧：1. 中心思想把握 2. 作者情感分析 3. 写作手法识别 4. 答题格式规范...',
            date: '2024-11-12',
            views: 234,
            comments: 27,
            likes: 41
        },
        {
            id: 5,
            title: '英语听力提升方法',
            author: '英语达人',
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=YY',
            category: 'study',
            preview: '分享一下我提升英语听力的经验：每天坚持听英语新闻、看英语视频、练习听写等。重点是要培养英语语感，而不是死记硬背...',
            date: '2024-11-11',
            views: 198,
            comments: 21,
            likes: 36
        },
        {
            id: 6,
            title: '推荐几本课外阅读书籍',
            author: '书香门第',
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SX',
            category: 'books',
            preview: '整理了一些值得一读的课外书籍，既能开阔视野，又对写作很有帮助。包括经典文学作品、科普读物、传记等多个类别...',
            date: '2024-11-10',
            views: 145,
            comments: 18,
            likes: 29
        }
    ];

    // 新建话题
    newTopicBtn.addEventListener('click', function() {
        showNewTopicModal();
    });

    // 显示新建话题模态框
    function showNewTopicModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>发布新话题</h2>
                <form id="newTopicForm">
                    <div class="form-group">
                        <label for="topicTitle">标题</label>
                        <input type="text" id="topicTitle" required>
                    </div>
                    <div class="form-group">
                        <label for="topicCategory">分类</label>
                        <select id="topicCategory" required>
                            <option value="study">学习交流</option>
                            <option value="books">书籍分享</option>
                            <option value="experience">经验心得</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="topicContent">内容</label>
                        <textarea id="topicContent" rows="6" required></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="submit" class="btn-primary">发布</button>
                        <button type="button" class="btn-secondary" onclick="closeModal()">取消</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // 关闭模态框
        window.closeModal = function() {
            modal.remove();
        };

        // 处理表单提交
        const form = modal.querySelector('#newTopicForm');
        form.addEventListener('submit', handleNewTopic);
    }

    // 处理新话题提交
    async function handleNewTopic(e) {
        e.preventDefault();
        const formData = {
            title: document.getElementById('topicTitle').value,
            category: document.getElementById('topicCategory').value,
            content: document.getElementById('topicContent').value
        };

        try {
            // 这里添加实际的提交逻辑
            // const response = await fetch('/api/topics', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(formData)
            // });

            showMessage('话题发布成功！', 'success');
            window.closeModal();
            // 重新加载话题列表
            loadTopics();
        } catch (error) {
            showMessage('发布失败，请稍后重试', 'error');
            console.error('Error:', error);
        }
    }

    // 筛选和排序
    categoryFilter.addEventListener('change', filterTopics);
    sortFilter.addEventListener('change', filterTopics);

    // 搜索功能
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    function handleSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const filteredTopics = topics.filter(topic => 
            topic.title.toLowerCase().includes(searchTerm) ||
            topic.preview.toLowerCase().includes(searchTerm)
        );
        renderTopics(filteredTopics);
    }

    // 话题过滤和排序
    function filterTopics() {
        let filtered = [...topics];
        
        // 分类筛选
        if (categoryFilter.value !== 'all') {
            filtered = filtered.filter(topic => topic.category === categoryFilter.value);
        }

        // 排序
        switch (sortFilter.value) {
            case 'hot':
                filtered.sort((a, b) => b.views - a.views);
                break;
            case 'mostComments':
                filtered.sort((a, b) => b.comments - a.comments);
                break;
            default: // latest
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        renderTopics(filtered);
    }

    // 标签点击处理
    const tags = document.querySelectorAll('.hot-tags .tag');
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            // 切换当前标签的激活状态
            this.classList.toggle('active');
            
            // 获取所有激活的标签
            const activeTags = Array.from(document.querySelectorAll('.hot-tags .tag.active'))
                .map(tag => tag.dataset.tag);
            
            // 根据标签筛选话题
            filterTopicsByTags(activeTags);
        });
    });

    // 根据标签筛选话题
    function filterTopicsByTags(activeTags) {
        if (activeTags.length === 0) {
            // 如果没有选中的标签，显示所有话题
            renderTopics(topics);
            return;
        }

        // 筛选包含选中标签的话题
        const filteredTopics = topics.filter(topic => {
            // 这里假设每个话题都有一个tags属性
            // 实际使用时需要在话题数据中添加相应的标签
            return topic.tags && topic.tags.some(tag => activeTags.includes(tag));
        });

        renderTopics(filteredTopics);
    }

    // 更新话题数据结构，添加标签属性
    topics = topics.map(topic => ({
        ...topic,
        tags: generateTopicTags(topic) // 为每个话题生成相关标签
    }));

    // 为话题生成相关标签
    function generateTopicTags(topic) {
        const allTags = ['高考复习', '学习方法', '教材推荐', '考试技巧', '学科难点' ] ;
        // 随机为每个话题分配2-3个标签
        const numTags = Math.floor(Math.random() * 2) + 2;
        const shuffled = allTags.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, numTags);
    }

    // 更新渲染话题的函数，添加标签显示
    function renderTopics(topicsToRender) {
        topicList.innerHTML = topicsToRender.map(topic => `
            <div class="topic-item">
                <div class="topic-avatar">
                    <img src="${topic.avatar}" alt="用户头像">
                </div>
                <div class="topic-content">
                    <div class="topic-header">
                        <h3>${topic.title}</h3>
                        <span class="topic-tag ${topic.category}">${getCategoryName(topic.category)}</span>
                    </div>
                    <div class="topic-preview">${topic.preview}</div>
                    <div class="topic-tags">
                        ${topic.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="topic-meta">
                        <span class="author">作者: ${topic.author}</span>
                        <span class="time"><i class="far fa-clock"></i> ${topic.date}</span>
                        <span class="views"><i class="far fa-eye"></i> ${topic.views}</span>
                        <span class="comments"><i class="far fa-comment"></i> ${topic.comments}</span>
                        <span class="likes"><i class="far fa-heart"></i> ${topic.likes}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 获取分类名称
    function getCategoryName(category) {
        const categories = {
            study: '学习交流',
            books: '书籍分享',
            experience: '经验心得'
        };
        return categories[category] || category;
    }

    // 消息提示
    function showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // 初始加载
    loadTopics();

    // 加载话题数据
    async function loadTopics() {
        try {
            // 这里添加实际的数据加载逻辑
            // const response = await fetch('/api/topics');
            // topics = await response.json();
            
            renderTopics(topics);
        } catch (error) {
            showMessage('加载失败，请刷新重试', 'error');
            console.error('Error:', error);
        }
    }
});
