// 全局变量
let manageNav;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    manageNav = document.querySelector('.manage-nav');
    
    // 初始化事件监听
    initEventListeners();
    
    // 从URL hash初始化页面
    initFromHash();
    
    // 如果没有hash，显示默认标签页
    if (!window.location.hash) {
        showTab('published');
    }
});

// 显示指定标签页
function showTab(tabId) {
    // 更新导航状态
    document.querySelectorAll('.manage-nav a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-tab') === tabId);
    });
    
    // 更新内容区域显示
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.toggle('active', section.id === tabId);
    });

    // 加载对应内容
    switch(tabId) {
        case 'published':
            loadPublishedBooks();
            break;
        case 'borrowed':
            loadBorrowedRecords();
            break;
        case 'donated':
            loadDonatedRecords();
            break;
        case 'profile':
            loadUserProfile();
            break;
    }
}

// 初始化事件监听器
function initEventListeners() {
    // 导航切换事件
    if (manageNav) {
        manageNav.addEventListener('click', handleNavClick);
    }
    
    // 监听URL hash变化
    window.addEventListener('hashchange', initFromHash);
}

// 根据URL hash初始化页面
function initFromHash() {
    const hash = window.location.hash.slice(1) || 'published';
    showTab(hash);
}

// 处理导航点击
function handleNavClick(e) {
    const navLink = e.target.closest('[data-tab]');
    if (!navLink) return;
    
    e.preventDefault();
    const tabId = navLink.getAttribute('data-tab');
    window.location.hash = tabId;
}

// 显示消息提示
function showMessage(message, type = 'info') {
    // 可以添加一个简单的消息提示实现
    alert(message);
}

// 处理书籍操作
function handleBookActions(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    
    const bookCard = btn.closest('.book-card');
    const bookTitle = bookCard.querySelector('h3').textContent;
    
    if (btn.classList.contains('btn-edit')) {
        handleEditBook(bookCard);
    } else if (btn.classList.contains('btn-delete')) {
        handleDeleteBook(bookCard, bookTitle);
    }
}

// 编辑书籍
function handleEditBook(bookCard) {
    // 这里添加编辑书籍的逻辑
    console.log('编辑书籍:', bookCard);
}

// 删除书籍
function handleDeleteBook(bookCard, bookTitle) {
    if (confirm(`确定要删除《${bookTitle}》吗？`)) {
        // 这里添加删除书籍的API调用
        bookCard.remove();
        showMessage('删除成功', 'success');
    }
}

// 处理消息操作
function handleMessageActions(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    
    const messageItem = btn.closest('.message-item');
    
    if (btn.classList.contains('btn-accept')) {
        handleAcceptRequest(messageItem);
    } else if (btn.classList.contains('btn-reject')) {
        handleRejectRequest(messageItem);
    }
}

// 接受请求
function handleAcceptRequest(messageItem) {
    // 这里添加接受请求的API调用
    messageItem.remove();
    showMessage('已同意请求', 'success');
    updateMessageCount();
}

// 拒绝请求
function handleRejectRequest(messageItem) {
    // 这里添加拒绝请求的API调用
    messageItem.remove();
    showMessage('已拒绝请求', 'success');
    updateMessageCount();
}

// 处理个人信息提交
async function handleProfileSubmit(e) {
    e.preventDefault();
    
    try {
        // 这里添加更新个人信息的API调用
        // const response = await fetch('/api/profile', {
        //     method: 'POST',
        //     body: new FormData(e.target)
        // });
        
        showMessage('个人信息更新成功', 'success');
    } catch (error) {
        showMessage('更新失败，请稍后重试', 'error');
        console.error('Error:', error);
    }
}

// 更新消息数量
function updateMessageCount() {
    const badge = document.querySelector('.badge');
    if (badge) {
        const count = document.querySelectorAll('.message-item').length;
        badge.textContent = count;
        if (count === 0) {
            badge.style.display = 'none';
        }
    }
}

// 初始化页面时加载书籍数据
loadPublishedBooks();

// 加载已发布的书籍
async function loadPublishedBooks() {
    try {
        const books = [
            {
                id: 1,
                title: '百年孤独',
                image: '../assets/images/百年孤独.png',
                status: 'available',
                views: 156,
                condition: '全新',
                publishDate: '2024-11-01'
            },
            {
                id: 2,
                title: '时间简史',
                image: '../assets/images/时间简史.png',
                status: 'borrowed',
                views: 234,
                condition: '还算新',
                publishDate: '2024-11-05'
            },
            {
                id: 3,
                title: '三体（全集）',
                image: '../assets/images/三体.png',
                status: 'available',
                views: 378,
                condition: '有点旧',
                publishDate: '2024-11-10'
            }
        ];
        
        renderBooks(books);
    } catch (error) {
        console.error('Error loading books:', error);
        showMessage('加载书籍失败', 'error');
    }
}

// 加载借阅记录
function loadBorrowedRecords() {
    const borrowedRecords = [
        {
            id: 1,
            title: '时间简史',
            image: '../assets/images/时间简史.png',
            borrowDate: '2024-11-03',
            returnDate: '2024-11-17',
            status: 'ongoing'
        },
        {
            id: 2,
            title: '三体',
            image: '../assets/images/三体.png',
            borrowDate: '2024-11-08',
            returnDate: '2024-11-22',
            status: 'completed'
        }
    ];

    const recordList = document.querySelector('#borrowed .record-list');
    if (!recordList) return;

    recordList.innerHTML = borrowedRecords.map(record => `
        <div class="record-item">
            <img src="${record.image}" alt="${record.title}">
            <div class="record-info">
                <h3>${record.title}</h3>
                <div class="record-meta">
                    <span>借阅时间: ${record.borrowDate}</span>
                    <span>归还时间: ${record.returnDate}</span>
                    <span class="status ${record.status}">${getStatusText(record.status)}</span>
                </div>
            </div>
            ${record.status === 'ongoing' ? '<button class="btn-return">申请归还</button>' : ''}
        </div>
    `).join('');
}

// 加载捐赠记录
function loadDonatedRecords() {
    const donatedRecords = [
        {
            id: 1,
            title: '百年孤独',
            image: '../assets/images/百年孤独.png',
            donateDate: '2024-11-12',
            recipient: '李同学',
            status: 'completed'
        },
        {
            id: 2,
            title: '人生感悟',
            image: '../assets/images/人生感悟.png',
            donateDate: '2024-11-20',
            recipient: '王同学',
            status: 'ongoing'
        }
    ];

    const recordList = document.querySelector('#donated .record-list');
    if (!recordList) return;

    recordList.innerHTML = donatedRecords.map(record => `
        <div class="record-item">
            <img src="${record.image}" alt="${record.title}">
            <div class="record-info">
                <h3>${record.title}</h3>
                <div class="record-meta">
                    <span>捐赠时间: ${record.donateDate}</span>
                    <span>受赠者: ${record.recipient}</span>
                    <span class="status ${record.status}">${getStatusText(record.status)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// 渲染书籍列表
function renderBooks(books) {
    const booksGrid = document.querySelector('.books-grid');
    if (!booksGrid) return;

    booksGrid.innerHTML = books.map(book => `
        <div class="book-card" data-id="${book.id}">
            <img src="${book.image}" alt="${book.title}">
            <div class="book-info">
                <h3>${book.title}</h3>
                <div class="book-meta">
                    <span class="status ${book.status}">${getStatusText(book.status)}</span>
                    <span class="views">浏览: ${book.views}</span>
                    <span class="condition ${getConditionClass(book.condition)}">成色: ${book.condition}</span>
                    <span class="date">发布于: ${formatDate(book.publishDate)}</span>
                </div>
                <div class="book-actions">
                    <button class="btn-edit"><i class="fas fa-edit"></i> 编辑</button>
                    <button class="btn-delete"><i class="fas fa-trash"></i> 删除</button>
                </div>
            </div>
        </div>
    `).join('');

    // 添加悬浮效果
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
            card.style.transition = 'all 0.3s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            card.style.transition = 'all 0.3s ease';
        });
    });
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        'available': '可借阅',
        'borrowed': '已借出',
        'reserved': '已预订'
    };
    return statusMap[status] || status;
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

// 添加获取成色样式类的函数
function getConditionClass(condition) {
    const classMap = {
        '全新': 'condition-new',
        '还算新': 'condition-good',
        '有点旧': 'condition-fair',
        '很旧': 'condition-poor'
    };
    return classMap[condition] || '';
}

// 加载用户个人信息
function loadUserProfile() {
    const userProfile = {
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=YY',
        name: '张同学',
        phone: '138****1234',
        email: 'zhang@example.com',
        class: '高二(3)班',
        id: '202401001',
        joinDate: '2024-11-01',
        borrowCount: 12,
        donateCount: 5,
        creditScore: 98
    };

    const profileContainer = document.querySelector('.profile-container');
    if (!profileContainer) return;

    profileContainer.innerHTML = `
        <div class="profile-card">
            <div class="profile-header">
                <div class="avatar-section">
                    <img src="${userProfile.avatar}" alt="用户头像" class="profile-avatar">
                    <div class="avatar-overlay">
                        <i class="fas fa-camera"></i>
                        <span>更换头像</span>
                    </div>
                </div>
                <div class="profile-title">
                    <h3>${userProfile.name}</h3>
                    <span class="student-id">学号：${userProfile.id}</span>
                </div>
            </div>
            
            <div class="profile-stats">
                <div class="stat-item">
                    <span class="stat-value">${userProfile.borrowCount}</span>
                    <span class="stat-label">借阅次数</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${userProfile.donateCount}</span>
                    <span class="stat-label">捐赠次数</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${userProfile.creditScore}</span>
                    <span class="stat-label">信用分</span>
                </div>
            </div>

            <form class="profile-form">
                <div class="form-group">
                    <label><i class="fas fa-user"></i>姓名</label>
                    <input type="text" value="${userProfile.name}" readonly class="form-control">
                </div>
                <div class="form-group">
                    <label><i class="fas fa-phone"></i>联系电话</label>
                    <input type="tel" value="${userProfile.phone}" class="form-control">
                    <button type="button" class="btn-edit-field">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-envelope"></i>邮箱</label>
                    <input type="email" value="${userProfile.email}" class="form-control">
                    <button type="button" class="btn-edit-field">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-graduation-cap"></i>年级班级</label>
                    <input type="text" value="${userProfile.class}" readonly class="form-control">
                </div>
                <div class="form-group">
                    <label><i class="fas fa-calendar-alt"></i>加入时间</label>
                    <input type="text" value="${userProfile.joinDate}" readonly class="form-control">
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-save">
                        <i class="fas fa-save"></i>保存修改
                    </button>
                </div>
            </form>
        </div>
    `;

    // 添加表单提交事件监听
    const form = profileContainer.querySelector('form');
    form.addEventListener('submit', handleProfileSubmit);

    // 添加头像更换事件监听
    const avatarSection = profileContainer.querySelector('.avatar-section');
    avatarSection.addEventListener('click', handleAvatarChange);
}

// 处理头像更换
function handleAvatarChange() {
    // 模拟点击隐藏的文件输入框
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 这里可以添加上传头像的逻辑
            showMessage('头像更新成功', 'success');
        }
    };
    input.click();
}

// 处理个人信息提交
function handleProfileSubmit(e) {
    e.preventDefault();
    // 这里添加保存个人信息的逻辑
    showMessage('个人信息更新成功', 'success');
}
