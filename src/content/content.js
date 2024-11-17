// 保存按钮引用
let uploadButton = null;

// 创建漂浮按钮
function createFloatingButton() {
    const button = document.createElement('div');
    button.className = 'imgfans-floating-button';
    button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
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