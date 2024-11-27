document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const donationForm = document.getElementById('donationForm');
    const booksList = document.getElementById('booksList');
    const addBookBtn = document.getElementById('addBookBtn');
    
    // 初始化事件监听
    initEventListeners();
    
    // 初始化事件监听器
    function initEventListeners() {
        // 添加书籍按钮点击事件
        addBookBtn.addEventListener('click', addNewBook);
        
        // 表单提交事件
        donationForm.addEventListener('submit', handleSubmit);
        
        // 捐赠方式切换事件
        document.querySelectorAll('input[name="donationType"]').forEach(radio => {
            radio.addEventListener('change', handleDonationTypeChange);
        });
        
        // 交接方式切换事件
        document.querySelectorAll('input[name="handoverMethod"]').forEach(radio => {
            radio.addEventListener('change', handleHandoverMethodChange);
        });
    }
    
    // 添加新书籍
    function addNewBook() {
        const bookCount = booksList.children.length + 1;
        if (bookCount > 10) {
            showMessage('最多只能添加10本书', 'error');
            return;
        }
        
        const bookItem = document.createElement('div');
        bookItem.className = 'book-item';
        bookItem.innerHTML = `
            <div class="book-header">
                <h5>书籍 #${bookCount}</h5>
                <button type="button" class="remove-book"><i class="fas fa-times"></i></button>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label>书籍名称</label>
                    <input type="text" name="bookName[]" required>
                </div>
                <div class="form-field">
                    <label>科目</label>
                    <select name="bookSubject[]" required>
                        <option value="">请选择</option>
                        <option value="chinese">语文</option>
                        <option value="math">数学</option>
                        <option value="english">英语</option>
                        <option value="physics">物理</option>
                        <option value="chemistry">化学</option>
                        <option value="biology">生物</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label>年级</label>
                    <select name="bookGrade[]" required>
                        <option value="">请选择</option>
                        <option value="grade1">高一</option>
                        <option value="grade2">高二</option>
                        <option value="grade3">高三</option>
                    </select>
                </div>
                <div class="form-field">
                    <label>成色</label>
                    <select name="bookCondition[]" required>
                        <option value="">请选择</option>
                        <option value="new">全新</option>
                        <option value="like-new">九成新</option>
                        <option value="good">七成新</option>
                        <option value="fair">五成新</option>
                    </select>
                </div>
            </div>
            <div class="form-field">
                <label>书籍描述</label>
                <textarea name="bookDescription[]" rows="3" 
                    placeholder="请简要描述书籍的使用情况、笔记等信息"></textarea>
            </div>
        `;
        
        // 添加移除按钮事件
        bookItem.querySelector('.remove-book').addEventListener('click', function() {
            bookItem.remove();
            updateBookNumbers();
        });
        
        booksList.appendChild(bookItem);
        updateBookNumbers();
    }
    
    // 更新书籍编号
    function updateBookNumbers() {
        booksList.querySelectorAll('.book-item').forEach((item, index) => {
            item.querySelector('h5').textContent = `书籍 #${index + 1}`;
        });
        
        // 更新添加按钮状态
        addBookBtn.style.display = booksList.children.length >= 10 ? 'none' : 'block';
    }
    
    // 处理捐赠方式变更
    function handleDonationTypeChange(e) {
        const type = e.target.value;
        const notesField = document.getElementById('donationNotes');
        
        switch(type) {
            case 'direct':
                notesField.placeholder = '如有特殊说明请在此备注';
                break;
            case 'library':
                notesField.placeholder = '请说明是否有特殊保管要求';
                break;
            case 'corner':
                notesField.placeholder = '请说明希望放置的教室位置';
                break;
        }
    }
    
    // 处理交接方式变更
    function handleHandoverMethodChange(e) {
        const method = e.target.value;
        const notesField = document.getElementById('donationNotes');
        
        if (method === 'self') {
            notesField.placeholder = '请说明预计送达时间';
        } else if (method === 'pickup') {
            notesField.placeholder = '请填写上门取件的地址和期望时间';
        }
    }
    
    // 处理表单提交
    async function handleSubmit(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // 收集表单数据
        const formData = new FormData(donationForm);
        const donationData = {
            donationType: formData.get('donationType'),
            handoverMethod: formData.get('handoverMethod'),
            donor: {
                name: formData.get('donorName'),
                phone: formData.get('donorPhone'),
                email: formData.get('donorEmail'),
                class: formData.get('donorClass')
            },
            books: collectBooksData(),
            notes: formData.get('notes')
        };
        
        try {
            // 这里添加实际的API调用
            // const response = await fetch('/api/donations', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(donationData)
            // });
            
            showMessage('捐赠申请提交成功！我们会尽快与您联系', 'success');
            donationForm.reset();
            resetForm();
        } catch (error) {
            showMessage('提交失败，请稍后重试', 'error');
            console.error('Error:', error);
        }
    }
    
    // 收集书籍数据
    function collectBooksData() {
        const books = [];
        const bookItems = booksList.querySelectorAll('.book-item');
        
        bookItems.forEach(item => {
            books.push({
                name: item.querySelector('input[name="bookName[]"]').value,
                subject: item.querySelector('select[name="bookSubject[]"]').value,
                grade: item.querySelector('select[name="bookGrade[]"]').value,
                condition: item.querySelector('select[name="bookCondition[]"]').value,
                description: item.querySelector('textarea[name="bookDescription[]"]').value
            });
        });
        
        return books;
    }
    
    // 表单验证
    function validateForm() {
        const requiredFields = donationForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                showFieldError(field);
            } else {
                field.classList.remove('error');
                removeFieldError(field);
            }
        });
        
        if (!isValid) {
            showMessage('请填写所有必填项', 'error');
        }
        
        return isValid;
    }
    
    // 重置表单
    function resetForm() {
        // 保留第一个书籍表单项
        const firstBook = booksList.firstElementChild.cloneNode(true);
        booksList.innerHTML = '';
        booksList.appendChild(firstBook);
        
        // 清空所有输入
        firstBook.querySelectorAll('input, select, textarea').forEach(input => {
            input.value = '';
        });
        
        // 重置添加按钮
        addBookBtn.style.display = 'block';
    }
    
    // 显示字段错误
    function showFieldError(field) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = '此字段为必填项';
        
        const existingError = field.parentElement.querySelector('.field-error');
        if (!existingError) {
            field.parentElement.appendChild(errorDiv);
        }
    }
    
    // 移除字段错误
    function removeFieldError(field) {
        const errorDiv = field.parentElement.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
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
