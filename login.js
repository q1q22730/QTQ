document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const tabBtns = document.querySelectorAll('.tab-btn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    const sendCodeBtn = document.querySelector('.send-code');

    // 标签切换功能
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有活动状态
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
            
            // 添加当前活动状态
            this.classList.add('active');
            const targetForm = this.dataset.tab === 'login' ? loginForm : registerForm;
            targetForm.classList.add('active');
        });
    });

    // 密码显示切换功能
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // 发送验证码功能
    let countdown = 60;
    let timer = null;

    sendCodeBtn.addEventListener('click', function() {
        const email = document.getElementById('regEmail').value;
        if (!validateEmail(email)) {
            showMessage('请输入有效的邮箱地址', 'error');
            return;
        }

        // 开始倒计时
        this.disabled = true;
        startCountdown(this);

        // 这里添加发送验证码的API调用
        sendVerificationCode(email);
    });

    function startCountdown(button) {
        button.textContent = `重新发送(${countdown}s)`;
        
        timer = setInterval(() => {
            countdown--;
            button.textContent = `重新发送(${countdown}s)`;
            
            if (countdown === 0) {
                clearInterval(timer);
                button.disabled = false;
                button.textContent = '发送验证码';
                countdown = 60;
            }
        }, 1000);
    }

    // 登录表单提交
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        try {
            // 这里添加登录API调用
            const response = await login(username, password, rememberMe);
            
            if (response.success) {
                showMessage('登录成功！', 'success');
                // 登录成功后跳转
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            }
        } catch (error) {
            showMessage(error.message || '登录失败，请重试', 'error');
        }
    });

    // 注册表单提交
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value;
        const studentId = document.getElementById('regStudentId').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const verifyCode = document.getElementById('regVerifyCode').value;

        // 表单验证
        if (!validateRegistration(username, studentId, email, password, confirmPassword, verifyCode)) {
            return;
        }

        try {
            // 这里添加注册API调用
            const response = await register({
                username,
                studentId,
                email,
                password,
                verifyCode
            });
            
            if (response.success) {
                showMessage('注册成功！', 'success');
                // 注册成功后切换到登录表面
                setTimeout(() => {
                    document.querySelector('[data-tab="login"]').click();
                }, 1500);
            }
        } catch (error) {
            showMessage(error.message || '注册失败，请重试', 'error');
        }
    });

    // 工具函数
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateRegistration(username, studentId, email, password, confirmPassword, verifyCode) {
        if (!username || username.length < 2) {
            showMessage('用户名至少需要2个字符', 'error');
            return false;
        }

        if (!studentId || !/^\d{8,12}$/.test(studentId)) {
            showMessage('请输入有效的学号', 'error');
            return false;
        }

        if (!validateEmail(email)) {
            showMessage('请输入有效的邮箱地址', 'error');
            return false;
        }

        if (password.length < 6) {
            showMessage('密码至少需要6个字符', 'error');
            return false;
        }

        if (password !== confirmPassword) {
            showMessage('两次输入的密码不一致', 'error');
            return false;
        }

        if (!verifyCode || verifyCode.length !== 6) {
            showMessage('请输入6位验证码', 'error');
            return false;
        }

        return true;
    }

    // 消息提示功能
    function showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // API调用函数（示例）
    async function login(username, password, rememberMe) {
        // 这里添加实际的API调用
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 1000);
        });
    }

    async function register(userData) {
        // 这里添加实际的API调用
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 1000);
        });
    }

    async function sendVerificationCode(email) {
        // 这里添加实际的API调用
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 1000);
        });
    }
}); 