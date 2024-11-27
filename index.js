document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const booksGrid = document.querySelector('.books-grid');
    const newsGrid = document.querySelector('.news-grid');
    const statNumbers = document.querySelectorAll('.stat-number');

    // 初始化页面
    initializePage();

    // 页面初始化
    function initializePage() {
        loadLatestBooks();
        loadLatestNews();
        animateStatNumbers();
    }

    // 加载最新书籍
    async function loadLatestBooks() {
        try {
            // 这里添加实际的API调用
            // const response = await fetch('/api/books/latest');
            // const books = await response.json();
            
            // 示例数据
            const books = [
                {
                    id: 1,
                    title: '理想国',
                    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/理想国.jpg-YcAYqf6OXMgU3buAptMQ80ilay8sq9.jpeg',
                    subject: '哲学经典',
                    author: '柏拉图',
                    description: '西方哲学的源头'
                },
                {
                    id: 2,
                    title: '国富论',
                    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/国富论.jpg-242t9vjEqUfcS4yarOSZK5gX5hSdyL.jpeg',
                    subject: '经济学著作',
                    author: '亚当·斯密',
                    description: '现代经济学之父'
                },
                {
                    id: 3,
                    title: '小王子',
                    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/小王子.jpg-gGPkhgUKU5A1rQy2kNhQsoCxjtiicG.jpeg',
                    subject: '文学名著',
                    author: '圣埃克苏佩里',
                    description: '永恒的经典童话'
                },
                {
                    id: 4,
                    title: '窄门',
                    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/窄门.jpg-ZZM8kBviUMMNbaOAB3GFlHWbqPM1o2.jpeg',
                    subject: '诺贝尔文学奖',
                    author: '安德烈·纪德',
                    description: '诺贝尔文学奖作品'
                }
            ];

            renderBooks(books);
        } catch (error) {
            console.error('Error loading latest books:', error);
            showMessage('加载最新书籍失败', 'error');
        }
    }

    // 渲染书籍列表
    function renderBooks(books) {
        booksGrid.innerHTML = books.map(book => `
            <div class="book-card">
                <div class="book-cover">
                    <img src="${book.image}" alt="${book.title}">
                    <span class="book-category">${book.subject}</span>
                </div>
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <div class="book-meta">
                        <span class="author">作者：${book.author}</span>
                        <p class="description">${book.description}</p>
                    </div>
                </div>
            </div>
        `).join('');

        // 添加悬浮效果
        const bookCards = document.querySelectorAll('.book-card');
        bookCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)';
                card.style.transition = 'all 0.3s ease';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                card.style.transition = 'all 0.3s ease';
            });
        });
    }

    // 加载最新动态
    async function loadLatestNews() {
        try {
            // 这里添加实际的API调用
            // const response = await fetch('/api/news/latest');
            // const news = await response.json();
            
            // 示例数据
            const news = [
                {
                    id: 1,
                    title: '2024年春季教材捐赠活动开始啦！',
                    content: '为了帮助更多同学获得教材资源，我们开展了新一轮的教材捐赠活动...',
                    author: '网站管理员',
                    date: '2024-11-15'
                },
                {
                    id: 2,
                    title: '关于教材借阅规则的更新通知',
                    content: '为了提供更好的借阅体验，我们对借阅规则进行了优化...',
                    author: '网站管理员',
                    date: '2024-11-14'
                },
                // 更多动态数据...
            ];

            renderNews(news);
        } catch (error) {
            console.error('Error loading latest news:', error);
            showMessage('加载最新动态失败', 'error');
        }
    }

    // 渲染动态列表
    function renderNews(newsItems) {
        newsGrid.innerHTML = newsItems.map(item => `
            <div class="news-card">
                <div class="news-content">
                    <h3 class="news-title">${item.title}</h3>
                    <p class="news-excerpt">${item.content.substring(0, 100)}...</p>
                    <div class="news-meta">
                        <span class="news-author">${item.author}</span>
                        <span class="news-date">${formatDate(item.date)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 数字动画效果
    function animateStatNumbers() {
        statNumbers.forEach(stat => {
            const targetNumber = parseInt(stat.textContent);
            animateNumber(stat, targetNumber);
        });
    }

    // 数字动画
    function animateNumber(element, target) {
        let current = 0;
        const increment = target / 100;
        const duration = 2000; // 2秒
        const interval = duration / 100;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, interval);
    }

    // 获取书籍类别
    function getSubjectText(subject) {
        const subjectMap = {
            math: '学习材料',
            chinese: '课外读物',
            english: '笔记资料',
            physics: '漫画绘本',
            chemistry: '杂志',
            biology: '其他'
        };
        return subjectMap[subject] || subject;
    }

    // 获取年级文本
    function getGradeText(grade) {
        const gradeMap = {
            grade1: '适用全部年级',
            grade2: '高一',
            grade3: '高二',
            grade4: '高三'
        };
        return gradeMap[grade] || grade;
    }

    // 格式化日期
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    // 显示消息提示
    function showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 4px;
            background-color: ${type === 'success' ? '#4caf50' : '#dc3545'};
            color: white;
            z-index: 1000;
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}); 