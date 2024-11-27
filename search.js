document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const gradeFilter = document.getElementById('gradeFilter');
    const subjectFilter = document.getElementById('subjectFilter');
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortOption = document.getElementById('sortOption');
    const resultsContainer = document.getElementById('resultsContainer');
    const resultCount = document.getElementById('resultCount');

    // 搜索参数对象
    let searchParams = {
        keyword: '',
        grade: '',
        subject: '',
        type: '',
        status: '',
        sort: 'relevance',
        page: 1
    };

    // 示例数据
    const mockBooks = [
        {
            id: 1,
            title: '高中数学必修第一册',
            subject: 'math',
            grade: 'grade1',
            type: 'textbook',
            status: 'available',
            author: '人教版',
            publisher: '人民教育出版社',
            condition: '九成新',
            image: 'https://images.weserv.nl/?url=https://img3.doubanio.com/view/subject/l/public/s33880929.jpg'
        },
        // 可以添加更多书籍数据
    ];

    // 初始化事件监听器
    initEventListeners();

    // 初始化搜索结果
    performSearch();

    // 初始化事件监听器
    function initEventListeners() {
        // 搜索按钮点击事件
        searchBtn.addEventListener('click', handleSearch);

        // 回车搜索
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });

        // 筛选器变化事件
        [gradeFilter, subjectFilter, typeFilter, statusFilter, sortOption].forEach(filter => {
            filter.addEventListener('change', handleSearch);
        });

        // 分页按钮点击事件
        document.querySelector('.pagination').addEventListener('click', handlePagination);
    }

    // 处理搜索
    function handleSearch() {
        searchParams = {
            keyword: searchInput.value.trim(),
            grade: gradeFilter.value,
            subject: subjectFilter.value,
            type: typeFilter.value,
            status: statusFilter.value,
            sort: sortOption.value,
            page: 1
        };
        performSearch();
    }

    // 执行搜索
    async function performSearch() {
        try {
            // 这里应该是实际的API调用
            // const response = await fetch('/api/search', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(searchParams)
            // });
            // const data = await response.json();

            // 使用模拟数据
            const filteredBooks = filterBooks(mockBooks);
            renderResults(filteredBooks);
        } catch (error) {
            showMessage('搜索失败，请稍后重试', 'error');
            console.error('Search error:', error);
        }
    }

    // 过滤书籍
    function filterBooks(books) {
        return books.filter(book => {
            const matchesKeyword = !searchParams.keyword || 
                book.title.toLowerCase().includes(searchParams.keyword.toLowerCase());
            const matchesGrade = !searchParams.grade || book.grade === searchParams.grade;
            const matchesSubject = !searchParams.subject || book.subject === searchParams.subject;
            const matchesType = !searchParams.type || book.type === searchParams.type;
            const matchesStatus = !searchParams.status || book.status === searchParams.status;

            return matchesKeyword && matchesGrade && matchesSubject && matchesType && matchesStatus;
        });
    }

    // 渲染搜索结果
    function renderResults(books) {
        resultCount.textContent = `(${books.length})`;
        
        resultsContainer.innerHTML = books.map(book => `
            <div class="book-card">
                <div class="book-image">
                    <img src="${book.image}" alt="${book.title}"
                         onerror="this.src='https://via.placeholder.com/200x300?text=暂无图片'">
                    <div class="book-status status-${book.status}">
                        ${getStatusText(book.status)}
                    </div>
                </div>
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <div class="book-meta">
                        <span><i class="fas fa-book"></i> ${book.author}</span>
                        <span><i class="fas fa-graduation-cap"></i> ${getGradeText(book.grade)}</span>
                        <span><i class="fas fa-bookmark"></i> ${getTypeText(book.type)}</span>
                        <span><i class="fas fa-star"></i> ${book.condition}</span>
                    </div>
                </div>
            </div>
        `).join('');

        updatePagination(books.length);
    }

    // 更新分页
    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / 12); // 每页12项
        const pagination = document.querySelector('.pagination');
        const pageNumbers = pagination.querySelector('.page-numbers');
        
        // 更新页码按钮
        pageNumbers.innerHTML = generatePaginationHTML(totalPages, searchParams.page);
        
        // 更新上一页/下一页按钮状态
        pagination.querySelector('.prev-btn').disabled = searchParams.page === 1;
        pagination.querySelector('.next-btn').disabled = searchParams.page === totalPages;
    }

    // 处理分页点击
    function handlePagination(e) {
        const target = e.target.closest('.page-btn');
        if (!target) return;

        if (target.classList.contains('prev-btn')) {
            searchParams.page = Math.max(1, searchParams.page - 1);
        } else if (target.classList.contains('next-btn')) {
            searchParams.page++;
        } else {
            searchParams.page = parseInt(target.textContent);
        }

        performSearch();
    }

    // 生成分页HTML
    function generatePaginationHTML(totalPages, currentPage) {
        let html = '';
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                html += `<button class="page-btn active">${i}</button>`;
            } else {
                html += `<button class="page-btn">${i}</button>`;
            }
        }
        return html;
    }

    // 获取状态文本
    function getStatusText(status) {
        const statusMap = {
            available: '可借阅',
            borrowed: '已借出',
            reserved: '已预约'
        };
        return statusMap[status] || status;
    }

    // 获取年级文本
    function getGradeText(grade) {
        const gradeMap = {
            grade1: '高一',
            grade2: '高二',
            grade3: '高三'
        };
        return gradeMap[grade] || grade;
    }

    // 获取类型文本
    function getTypeText(type) {
        const typeMap = {
            textbook: '教材',
            workbook: '练习册',
            reference: '参考书',
            notes: '笔记'
        };
        return typeMap[type] || type;
    }

    // 显示消息提示
    function showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
});
