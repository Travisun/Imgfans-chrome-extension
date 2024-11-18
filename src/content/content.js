// 保存按钮引用
let uploadButton = null;

// 创建漂浮按钮
function createFloatingButton() {
    const button = document.createElement('div');
    button.className = 'imgfans-floating-button';
    button.title = 'Drop images / Click here to upload';
    button.innerHTML = `
    <svg id="uuid-d7590b42-0086-4116-a0b1-b3c030c6c995" data-name="图层 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 196.08 185.57">
      <path d="M45.56,32.2c4.7,0,8.6-1.5,11.6-4.5s4.5-6.8,4.5-11.6-1.5-8.6-4.5-11.6S50.36,0,45.56,0s-8.6,1.5-11.6,4.5-4.5,6.8-4.5,11.6,1.5,8.6,4.5,11.6,6.8,4.5,11.6,4.5Z" style=" stroke-width: 0px;"/>
      <path d="M168.3,32.15s7.14-5.8,17.64-5.51c.88.02,3.66.16,6.52.35,1.33.09,2.54.18,3.62.26-5.16-8.88-11.58-16.94-19.01-23.93-6.87.78-13.03,2.28-18.51,4.57-8.4,3.5-15,9-19.8,16.5-4.8,7.6-7.9,17.3-9.1,29.4l-1.16,11.3h-48.19l-6.01,21.5h51.99l-5.02,48.7c-.6,6.4-2.2,11.6-4.6,15.4-2.4,3.8-5.7,6.7-9.7,8.5-4,1.8-8.7,3.1-14.1,3.7l-6.06.65-5.21,19.47c6.64,1.49,13.52,2.37,20.57,2.54,7.41-1.24,13.93-3.19,19.5-5.97,3.76-1.88,6.2-3.77,6.72-4.16,9.38-6.96,13.68-15.57,16.13-20.62,1.94-4.01,4.4-10.12,5.74-18.05,2.46-16.72,4.92-33.45,7.38-50.17h25.62l5.75-21.5h-31.37c.68-5.51,1.37-11.02,2.05-16.54.27-2.28,1.55-10.67,8.62-16.41Z" style=" stroke-width: 0px;"/>
      <path d="M50.06,121.8c-.89-.23-3.22-.97-4.84-3.08-1.27-1.66-1.5-3.4-1.64-8.21-.17-5.98-.26-8.97,0-10.67.78-5.03,2.32-6.3,4.51-12.31.92-2.53,2.98-8.15,3.28-13.54.05-.92.55-13.07-7.92-21.7,0,0-7.97-8.7-28.5-8.7-3.04,0-6.14.15-9.2.37-2.87,7.86-4.83,16.17-5.76,24.78,3.92-.69,7.91-1.05,12.06-1.05s7,.9,8.7,2.7c1.7,1.8,2,4.5,1.1,8-.9,3.6-2,7.3-3.4,11.3-1.4,3.9-2.7,8-3.8,12.2-1.2,4.2-1.9,8.5-2.2,12.9-.6,10.1,2,17.8,7.7,23.1s14.5,7.9,26.4,7.9c4.09,0,7.79-.44,11.15-1.29l7.54-26.95c-2.61,1.4-4.97,2.44-7.09,3.04-3.78,1.06-5.68,1.82-8.1,1.2Z" style=" stroke-width: 0px;"/>
    </svg>
  `;
    document.body.appendChild(button);
    return button;
}

// 更新上传进度UI
function updateUploadProgress(progress) {
    if (!uploadButton) return;

    if (progress < 100) {
        // 确保移除等待状态
        uploadButton.classList.remove('waiting');
        // 添加上传状态
        uploadButton.classList.add('uploading');

        // 通过 CSS 变量更新进度（可选）
        uploadButton.style.setProperty('--upload-progress', `${progress}%`);

        // 如果进度接近完成，预先添加等待状态
        if (progress >= 98) {
            uploadButton.classList.remove('uploading');
            uploadButton.classList.add('waiting');
        }
    } else {
        // 切换到等待状态
        uploadButton.classList.remove('uploading');
        uploadButton.classList.add('waiting');
    }
}

// 重置按钮状态
function resetButtonState() {
    if (!uploadButton) return;

    // 移除所有状态类
    uploadButton.classList.remove('uploading', 'waiting');
    // 清除进度变量
    uploadButton.style.removeProperty('--upload-progress');
}

// 创建提示框
function createToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'imgfans-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, duration);
}

// 创建复制对话框
function createCopyDialog(fileInfo) {
    const dialog = document.createElement('div');
    dialog.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[999999] backdrop-blur-sm';
    dialog.innerHTML = `
        <div class="w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl transform transition-all">
            <div class="relative p-6">
                <!-- 关闭按钮 -->
                <button class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" stroke-width="2" class="text-gray-500">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <!-- 标题 -->
                <div class="text-center mb-6">
                    <h3 class="text-xl font-semibold text-gray-900">Share Link</h3>
                    <p class="mt-1 text-sm text-gray-500">Choose your preferred format below</p>
                </div>

                <!-- 选项列表 -->
                <div class="space-y-4">
                    ${Object.entries(fileInfo.references).map(([key, value]) => `
                        <div class="group relative rounded-xl border border-gray-200 hover:border-indigo-500 transition-all duration-200">
                            <div class="p-4">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-sm font-medium text-gray-700">${value.label}</span>
                                    <button 
                                        data-copy="${encodeURIComponent(value.code)}"
                                        class="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                                    >
                                        Copy Code
                                    </button>
                                </div>
                                <pre class="mt-2 p-3 bg-gray-50 rounded-lg text-sm font-mono text-gray-600 overflow-x-auto">${value.code}</pre>
                            </div>
                            <div class="absolute inset-0 border-2 border-indigo-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // 处理复制按钮点击
    dialog.addEventListener('click', (e) => {
        if (e.target.matches('button[data-copy]')) {
            const code = decodeURIComponent(e.target.dataset.copy);
            navigator.clipboard.writeText(code)
                .then(() => createToast('Copied to clipboard!'))
                .catch(() => createToast('Failed to copy'));
        } else if (
            e.target.matches('.imgfans-close-button') || e.target.matches('.x0') ||
            e.target.matches('.imgfans-copy-overlay')
        ) {
            dialog.remove();
        }
    });

    document.body.appendChild(dialog);
}
// 上传文件
async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        // 从存储中获取 API Key
        const apiKey = await new Promise((resolve) => {
            chrome.storage.sync.get(['apiKey'], (result) => {
                resolve(result.apiKey);
            });
        });

        if (!apiKey) {
            createToast('Please configure your API key first');
            return;
        }

        // 创建 XHR 请求来监控上传进度
        const xhr = new XMLHttpRequest();


        // 修改上传文件函数中的进度处理部分
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const progress = Math.round((event.loaded / event.total) * 100);
                updateUploadProgress(progress);

                // 当上传完成时（但还在等待服务器响应）
                if (progress >= 100) {
                    updateUploadProgress(100); // 触发等待状态
                }
            }
        };

        // 确保在请求完成时重置状态
        xhr.onloadend = () => {
            if (xhr.status === 200) {
                const result = JSON.parse(xhr.responseText);
                if (result.success) {
                    setTimeout(() => {
                        resetButtonState();
                        createToast('Upload successful!');
                        createCopyDialog(result.file);
                    }, 500); // 添加小延迟使过渡更平滑
                } else {
                    resetButtonState();
                    createToast('Upload failed');
                }
            } else {
                resetButtonState();
                createToast('Upload failed');
            }
        };

        // 发起请求
        xhr.open('POST', 'https://imgfans.com/api/v1/upload');
        xhr.setRequestHeader('Authorization', `Bearer ${apiKey}`);
        xhr.send(formData);

    } catch (error) {
        console.error('Upload error:', error);
        resetButtonState();
        createToast('Failed to upload file');
    }
}


// 初始化
function init() {
    // 创建按钮并保存引用
    uploadButton = createFloatingButton();

    // 处理拖拽事件
    document.addEventListener('dragover', (e) => {
        e.preventDefault();
        const buttonRect = uploadButton.getBoundingClientRect();
        const isOverButton =
            e.clientX >= buttonRect.left &&
            e.clientX <= buttonRect.right &&
            e.clientY >= buttonRect.top &&
            e.clientY <= buttonRect.bottom;

        uploadButton.classList.toggle('drag-over', isOverButton);
    });

    document.addEventListener('dragleave', () => {
        uploadButton.classList.remove('drag-over');
    });

    document.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadButton.classList.remove('drag-over');

        const buttonRect = uploadButton.getBoundingClientRect();
        const isOverButton =
            e.clientX >= buttonRect.left &&
            e.clientX <= buttonRect.right &&
            e.clientY >= buttonRect.top &&
            e.clientY <= buttonRect.bottom;

        if (isOverButton && e.dataTransfer.files.length > 0) {
            uploadFile(e.dataTransfer.files[0]);
        }
    });

    // 处理点击上传
    uploadButton.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        document.body.appendChild(input);

        input.addEventListener('change', () => {
            if (input.files.length > 0) {
                uploadFile(input.files[0]);
            }
            input.remove();
        });

        input.click();
    });
}

// 启动应用
init();