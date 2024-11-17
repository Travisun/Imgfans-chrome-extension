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
    dialog.className = 'imgfans-copy-overlay';
    dialog.innerHTML = `
    <div class="imgfans-copy-dialog">
      <button class="imgfans-close-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <h3>Copy Link</h3>
      <div class="imgfans-copy-options">
        ${Object.entries(fileInfo.references).map(([key, value]) => `
          <div class="imgfans-copy-item">
            <span>${value.label}</span>
            <button data-copy="${encodeURIComponent(value.code)}">Copy</button>
          </div>
        `).join('')}
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
            e.target.matches('.imgfans-close-button') ||
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

        const response = await fetch('https://imgfans.com/api/v1/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const result = await response.json();
        if (result.success) {
            createToast('Upload successful!');
            createCopyDialog(result.file);
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        console.error('Upload error:', error);
        createToast('Failed to upload file');
    }
}

// 初始化
function init() {
    const button = createFloatingButton();

    // 处理拖拽事件
    document.addEventListener('dragover', (e) => {
        e.preventDefault();
        const buttonRect = button.getBoundingClientRect();
        const isOverButton =
            e.clientX >= buttonRect.left &&
            e.clientX <= buttonRect.right &&
            e.clientY >= buttonRect.top &&
            e.clientY <= buttonRect.bottom;

        button.classList.toggle('drag-over', isOverButton);
    });

    document.addEventListener('dragleave', () => {
        button.classList.remove('drag-over');
    });

    document.addEventListener('drop', (e) => {
        e.preventDefault();
        button.classList.remove('drag-over');

        const buttonRect = button.getBoundingClientRect();
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
    button.addEventListener('click', () => {
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