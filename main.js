document.addEventListener('DOMContentLoaded', function() {
    // 图片懒加载
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 节流函数
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // 用户下拉菜单切换
    const userInfo = document.querySelector('.user-info');
    const userDropdown = document.querySelector('.user-dropdown');

    if (userInfo && userDropdown) {
        userInfo.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });

        // 点击其他区域关闭下拉菜单
        document.addEventListener('click', function() {
            userDropdown.classList.remove('active');
        });

        // 阻止下拉菜单内部点击事件冒泡
        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // 退出登录
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // 这里添加退出登录的逻辑
            if (confirm('确定要退出登录吗？')) {
                // 执行退出操作
                window.location.href = 'login.html';
            }
        });
    }
});

// 添加安全相关代码
const security = {
    // XSS防护
    escapeHtml: function(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    // CSRF Token处理
    getCsrfToken: function() {
        return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    },

    // 输入验证
    validateInput: function(input, pattern) {
        return pattern.test(input);
    }
};

// 添加全局错误处理
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo);
    showErrorMessage('抱歉，出现了一些问题，请稍后重试');
    return false;
};

// 添加错误提示组件
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// 添加加载状态指示器
const loadingIndicator = {
    show: function() {
        const loader = document.createElement('div');
        loader.className = 'loading-spinner';
        document.body.appendChild(loader);
    },
    
    hide: function() {
        const loader = document.querySelector('.loading-spinner');
        if (loader) {
            loader.remove();
        }
    }
};

// 添加页面切换动画
const pageTransition = {
    init: function() {
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', this.handleTransition);
        });
    },
    
    handleTransition: function(e) {
        // 添加页面切换动画逻辑
    }
};
