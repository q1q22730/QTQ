document.addEventListener('DOMContentLoaded', function() {
    const publishForm = document.getElementById('publishForm');
    const imageUpload = document.getElementById('bookImages');
    const imagePreview = document.getElementById('imagePreview');

    // 图片上传预览
    imageUpload.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        imagePreview.innerHTML = ''; // 清空预览区域

        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                const previewContainer = document.createElement('div');
                previewContainer.className = 'preview-image';

                reader.onload = function(e) {
                    previewContainer.innerHTML = `
                        <img src="${e.target.result}" alt="预览图片">
                        <button type="button" class="remove-image">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                };

                reader.readAsDataURL(file);
                imagePreview.appendChild(previewContainer);
            }
        });

        // 如果没有预览图片，显示上传提示
        if (imagePreview.children.length === 0) {
            imagePreview.innerHTML = `
                <div class="upload-hint">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>点击或拖拽上传图片</p>
                </div>
            `;
        }
    });

    // 拖拽上传
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        imagePreview.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    imagePreview.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        imageUpload.files = files;
        
        // 触发change事件以更新预览
        const event = new Event('change');
        imageUpload.dispatchEvent(event);
    }

    // 表单提交处理
    publishForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // 表单验证
        const requiredFields = publishForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        if (!isValid) {
            showMessage('请填写所有必填项', 'error');
            return;
        }

        // 收集表单数据
        const formData = new FormData();
        formData.append('bookName', document.getElementById('bookName').value);
        formData.append('bookCategory', document.getElementById('bookCategory').value);
        formData.append('bookGrade', document.getElementById('bookGrade').value);
        formData.append('bookCondition', document.getElementById('bookCondition').value);
        formData.append('contactName', document.getElementById('contactName').value);
        formData.append('contactPhone', document.getElementById('contactPhone').value);
        formData.append('description', document.getElementById('description').value);

        // 添加图片文件
        const imageFiles = imageUpload.files;
        for (let i = 0; i < imageFiles.length; i++) {
            formData.append('images[]', imageFiles[i]);
        }

        try {
            // 这里添加实际的表单提交逻辑
            // const response = await fetch('/api/publish', {
            //     method: 'POST',
            //     body: formData
            // });

            // 模拟提交成功
            showMessage('书籍发布成功！', 'success');
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 2000);
        } catch (error) {
            showMessage('发布失败，请稍后重试', 'error');
            console.error('Error:', error);
        }
    });

    // 消息提示函数
    function showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // 电话号码格式验证
    const phoneInput = document.getElementById('contactPhone');
    phoneInput.addEventListener('input', function(e) {
        const phone = e.target.value.replace(/\D/g, '');
        if (phone.length > 11) {
            e.target.value = phone.slice(0, 11);
        } else {
            e.target.value = phone;
        }
    });
});
