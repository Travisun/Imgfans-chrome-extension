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

    // 记录HTML代码
    let htmlEmbedCode = "";

    // 创建临时容器用于保存原始HTML
    const createSafeHtml = (html) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.innerHTML;
    };

    dialog.innerHTML = `
        <div class="bg-white rounded-lg space-y-6 mb-6 w-full max-w-2xl mx-4">
            <div class="grid gap-6">
                <!-- Content Area -->
                <div class="space-y-4">
                    <!-- Quick Access Links -->
                    <div class="flex flex-wrap w-full md:px-6 items-center text-center justify-center gap-4 pt-6">
                        <button
                            class="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-800 text-white rounded-md text-sm font-medium"
                            onclick="window.open('${fileInfo.url}?w=1', '_blank')"
                        >
                            <svg t="1731400414598" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12523" width="18" height="18">
                                <path d="M610.944 461.968C648.384 536.608 593.6 624 510.88 624c-61.76 0-111.44-50.24-111.44-112S448 400 512 400v-80c-112 0-192.56 86.128-192.56 192s85.568 192 191.44 192 192-86.128 192-192c0-30.848-7.472-59.92-20.464-85.76l-71.472 35.728zM510.88 176c-240.64 0-448 225.376-448 336 0 110.64 207.36 336 448 336s448.016-225.36 448.016-336c0-110.624-207.376-336-448-336z m0 592c-207.104 0-368-204.192-368-256 0-51.808 160.896-256 368-256s368 204.192 368 256c0 51.808-160.896 256-368 256z" fill="#ffffff" p-id="12524"></path>
                            </svg>
                            &nbsp;View
                        </button>
                        <button
                            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            onclick="window.open('${fileInfo.downloadUrl}', '_blank')"
                        >
                            <svg t="1731400379156" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11123" width="18" height="18">
                                <path d="M565.333333 779.914667l51.445334-54.912a31.733333 31.733333 0 0 1 45.226666-1.226667 32.64 32.64 0 0 1 1.216 45.770667l-97.418666 104a37.034667 37.034667 0 0 1-52.821334 1.397333l-108.362666-104.202667a32.64 32.64 0 0 1-1.152-45.770666 31.733333 31.733333 0 0 1 45.248-1.173334L501.333333 774.421333V512.074667c0-17.877333 14.325333-32.373333 32-32.373334s32 14.506667 32 32.373334v267.84zM512 138.666667c123.018667 0 228.213333 86.709333 259.424 206.88C864.298667 347.146667 938.666667 426.090667 938.666667 522.688c0 97.6-75.914667 177.173333-170.133334 177.173333-17.674667 0-32-14.496-32-32.373333 0-17.877333 14.325333-32.373333 32-32.373333 58.357333 0 106.133333-50.08 106.133334-112.426667 0-62.336-47.776-112.416-106.133334-112.416-5.856 0-11.626667 0.501333-17.301333 1.482667-17.621333 3.050667-34.304-9.098667-37.024-26.986667C698.346667 280.693333 612.714667 203.424 512 203.424c-73.834667 0-140.928 41.536-177.376 107.861333a31.914667 31.914667 0 0 1-30.122667 16.576 140.373333 140.373333 0 0 0-9.568-0.32c-80.149333 0-145.6 68.586667-145.6 153.781334 0 85.184 65.450667 153.792 145.6 153.792 17.674667 0 32 14.496 32 32.373333 0 17.877333-14.325333 32.373333-32 32.373333C178.912 699.861333 85.333333 601.770667 85.333333 481.322667c0-118.314667 90.293333-215.061333 203.456-218.453334C338.090667 186.24 421.013333 138.666667 512 138.666667z" fill="#2c2c2c" p-id="11124"></path>
                            </svg>
                            &nbsp;Download
                        </button>
                        <button
                            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            onclick="this.closest('.fixed').remove()"
                        >
                            <svg t="1731601188715" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4548" width="18" height="18">
                                <path d="M512 69.818182c-257.070545 0-465.454545 208.384-465.454545 465.454545 0 257.070545 208.384 465.454545 465.454545 465.454545 257.070545 0 465.454545-208.384 465.454545-465.454545C977.454545 278.202182 769.070545 69.818182 512 69.818182zM512 954.181818c-231.377455 0-418.909091-187.531636-418.909091-418.909091 0-231.377455 187.531636-418.909091 418.909091-418.909091 231.377455 0 418.909091 187.531636 418.909091 418.909091C930.909091 766.650182 743.377455 954.181818 512 954.181818zM725.922909 321.349818c-9.076364-9.076364-23.831273-9.076364-32.907636 0L512 502.365091 330.984727 321.349818c-9.076364-9.076364-23.831273-9.076364-32.907636 0-9.076364 9.076364-9.076364 23.831273 0 32.907636l181.015273 181.015273-181.015273 181.015273c-9.076364 9.076364-9.076364 23.831273 0 32.907636 9.076364 9.076364 23.831273 9.076364 32.907636 0L512 568.180364l181.015273 181.015273c9.076364 9.076364 23.831273 9.076364 32.907636 0 9.076364-9.076364 9.076364-23.831273 0-32.907636L544.907636 535.272727l181.015273-181.015273C734.999273 345.181091 734.999273 330.426182 725.922909 321.349818z" fill="#707070" p-id="4549"></path>
                            </svg>
                            &nbsp; Close
                        </button>
                    </div>

                    <!-- File Information and Copy Sections -->
                    <div class="space-y-3 p-6 w-full">
                        <h3 class="text-lg max-w-[78vw] font-medium text-gray-900 overflow-hidden whitespace-nowrap truncate">
                            File Name: ${fileInfo.name}
                        </h3>
                        ${Object.entries(fileInfo.references).map(([key, ref]) => {
                            // 对HTML代码进行编码，用于存储在data-copy属性中
                            const encodedCode = ref.code.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                            let htmlEncoded = false;
                            // 考虑修复HTML代码问题
                            if (ref.label.includes('HTML')) {
                                htmlEmbedCode = ref.code;
                                htmlEncoded = true;
                            }
                            return `
                                <div class="max-w-[78vw] space-y-2">
                                    <div class="flex w-full items-center justify-between">
                                        <span class="text-sm text-gray-500">${ref.label}</span>
                                        <button
                                            class="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                                            data-copy="${encodedCode}"
                                        >
                                            <svg t="1731399979030" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6040" width="16" height="16">
                                                <path d="M640 42.666667a85.333333 85.333333 0 0 1 85.333333 85.333333h42.666667a128 128 0 0 1 128 128v597.333333a128 128 0 0 1-128 128H256a128 128 0 0 1-128-128V256a128 128 0 0 1 128-128h42.666667a85.333333 85.333333 0 0 1 85.333333-85.333333h256z m0 256H384a85.333333 85.333333 0 0 1-85.333333-85.333334H256a42.666667 42.666667 0 0 0-42.666667 42.666667v597.333333a42.666667 42.666667 0 0 0 42.666667 42.666667h512a42.666667 42.666667 0 0 0 42.666667-42.666667V256a42.666667 42.666667 0 0 0-42.666667-42.666667h-42.666667a85.333333 85.333333 0 0 1-85.333333 85.333334z m0-170.666667H384v85.333333h256V128z" p-id="6041" fill="#2563eb"></path>
                                            </svg>
                                            <span>Copy</span>
                                        </button>
                                    </div>
                                    <div class="relative">
                                    ${htmlEncoded ? '<pre class="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 overflow-x-auto" id="imgfans-code-html"></pre>' :
                                '<pre class="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 overflow-x-auto">'+ref.code+'</pre>'}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Handle copy button clicks
    dialog.addEventListener('click', async (e) => {
        const copyButton = e.target.closest('button[data-copy]');
        if (copyButton) {
            const code = copyButton.dataset.copy;
            try {
                // 解码HTML内容
                const code = copyButton.dataset.copy.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
                await navigator.clipboard.writeText(code);

                // Update button content to show copied state
                const originalContent = copyButton.innerHTML;
                copyButton.innerHTML = `
                    <svg t="1731400131067" class="icon" viewBox="0 0 1336 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9911" width="18" height="18">
                        <path d="M49.588224 883.816448M1139.531776 883.816448M86.939648 862.977024M538.459136 960.381952c109.876224-153.544704 223.55968-289.842176 308.03968-385.787904 49.87392-56.639488 96.715776-108.155904 141.549568-154.500096 40.576-41.945088 80.805888-80.405504 119.478272-116.59264 65.92-61.693952 142.984192-130.034688 191.446016-159.30368l-61.891584-82.050048c-89.732096 56.139776-176.10752 116.103168-242.799616 162.18112-38.863872 26.855424-74.928128 52.667392-108.915712 77.252608-33.668096 24.356864-68.429824 51.106816-105.081856 79.166464-63.633408 48.712704-145.388544 114.194432-224.555008 181.860352L357.07904 374.989824 123.885568 558.770176 538.459136 960.381952zM1335.92064 862.977024" fill="#2563eb" p-id="9912"></path>
                    </svg>
                    <span>Copied</span>
                `;

                // Reset button content after 2 seconds
                setTimeout(() => {
                    copyButton.innerHTML = originalContent;
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                createToast('Failed to copy');
            }
        }
    });

    document.body.appendChild(dialog);
    // 填写HTML代码
    document.getElementById('imgfans-code-html').textContent= htmlEmbedCode;
    // Add style for pre elements
    const style = document.createElement('style');
    style.textContent = `
        .fixed pre {
            white-space: pre-wrap;
            word-wrap: break-word;
        }
    `;
    document.head.appendChild(style);
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

// 域名检查函数
function isDomainAllowed(currentDomain, allowedDomains) {
    if (!Array.isArray(allowedDomains) || allowedDomains.length === 0) {
        return false;
    }

    return allowedDomains.some(domain => {
        // 处理空值
        if (!domain) return false;
        return currentDomain.includes(domain);
    });
}

// 缓存相关常量
const CACHE_CONSTANTS = {
    INITIAL_CACHE_DAYS: 7,          // 初始缓存有效期（天）
    P1_RETRY_HOURS: 2,              // P1阶段重试间隔（小时）
    P1_MAX_RETRIES: 5,              // P1阶段最大重试次数
    P2_RETRY_DAYS: 1,               // P2阶段重试间隔（天）
    STORAGE_KEYS: {
        REMOTE_DOMAINS: 'wpd_remote',
        CACHE_TIME: 'wpd_cached_at',
        RETRY_COUNT: 'wpd_retry_count',
        RETRY_PHASE: 'wpd_retry_phase'
    }
};

// 检查缓存是否过期
async function isCacheExpired() {
    const {
        wpd_cached_at: cachedAt,
        wpd_retry_count: retryCount,
        wpd_retry_phase: retryPhase
    } = await chrome.storage.sync.get([
        CACHE_CONSTANTS.STORAGE_KEYS.CACHE_TIME,
        CACHE_CONSTANTS.STORAGE_KEYS.RETRY_COUNT,
        CACHE_CONSTANTS.STORAGE_KEYS.RETRY_PHASE
    ]);

    if (!cachedAt) return true;

    const now = new Date();
    const cachedTime = new Date(cachedAt);

    // 根据重试阶段计算有效期
    if (retryPhase === 'P1' && retryCount <= CACHE_CONSTANTS.P1_MAX_RETRIES) {
        // P1阶段：检查小时级别的过期
        const validUntil = new Date(cachedTime.getTime() + retryCount * CACHE_CONSTANTS.P1_RETRY_HOURS * 3600000);
        return now > validUntil;
    } else if (retryPhase === 'P2') {
        // P2阶段：检查天级别的过期
        const validUntil = new Date(cachedTime.getTime() + CACHE_CONSTANTS.P2_RETRY_DAYS * 86400000);
        return now > validUntil;
    }

    // 正常缓存：7天有效期
    const validUntil = new Date(cachedTime.getTime() + CACHE_CONSTANTS.INITIAL_CACHE_DAYS * 86400000);
    return now > validUntil;
}

// 更新缓存的失败处理
async function handleCacheUpdateFailure() {
    const { wpd_retry_count: currentRetryCount, wpd_retry_phase: currentPhase } =
        await chrome.storage.sync.get([
            CACHE_CONSTANTS.STORAGE_KEYS.RETRY_COUNT,
            CACHE_CONSTANTS.STORAGE_KEYS.RETRY_PHASE
        ]);

    let retryCount = (currentRetryCount || 0) + 1;
    let phase = currentPhase || 'P1';
    let newCachedAt = new Date().toISOString();

    if (phase === 'P1' && retryCount > CACHE_CONSTANTS.P1_MAX_RETRIES) {
        // 进入 P2 阶段
        phase = 'P2';
        retryCount = 1;
    }

    await chrome.storage.sync.set({
        [CACHE_CONSTANTS.STORAGE_KEYS.CACHE_TIME]: newCachedAt,
        [CACHE_CONSTANTS.STORAGE_KEYS.RETRY_COUNT]: retryCount,
        [CACHE_CONSTANTS.STORAGE_KEYS.RETRY_PHASE]: phase
    });
}

// 成功更新缓存
async function updateCache(domains) {
    await chrome.storage.sync.set({
        [CACHE_CONSTANTS.STORAGE_KEYS.REMOTE_DOMAINS]: JSON.stringify(domains),
        [CACHE_CONSTANTS.STORAGE_KEYS.CACHE_TIME]: new Date().toISOString(),
        [CACHE_CONSTANTS.STORAGE_KEYS.RETRY_COUNT]: 0,
        [CACHE_CONSTANTS.STORAGE_KEYS.RETRY_PHASE]: null
    });
}

// fetchWebsitePolicyDomains 函数保持不变
async function fetchWebsitePolicyDomains() {
    try {
        // 从存储中获取 API Key
        const apiKey = await new Promise((resolve) => {
            chrome.storage.sync.get(['apiKey'], (result) => {
                resolve(result.apiKey);
            });
        });

        if (!apiKey) {
            console.warn('API key not found');
            return [];
        }

        const response = await fetch('https://imgfans.com/api/v1/website_policy_domains', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch policy list');
        }

        const data = await response.json();
        return data.success ? data.domains : [];
    } catch (error) {
        console.error('Error fetching website policy domains:', error);
        return [];
    }
}

// 初始化按钮事件
function initializeButtonEvents() {
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

// 获取远程域名列表（带缓存机制）
async function getRemoteDomains() {
    try {
        const expired = await isCacheExpired();

        if (!expired) {
            // 使用缓存的数据
            const { wpd_remote } = await chrome.storage.sync.get(CACHE_CONSTANTS.STORAGE_KEYS.REMOTE_DOMAINS);
            return wpd_remote ? JSON.parse(wpd_remote) : [];
        }

        // 尝试获取新数据
        const newDomains = await fetchWebsitePolicyDomains();

        if (newDomains.length > 0) {
            // 更新成功，重置缓存状态
            await updateCache(newDomains);
            return newDomains;
        } else {
            // 获取失败，执行失败处理策略
            await handleCacheUpdateFailure();

            // 返回旧的缓存数据
            const { wpd_remote } = await chrome.storage.sync.get(CACHE_CONSTANTS.STORAGE_KEYS.REMOTE_DOMAINS);
            return wpd_remote ? JSON.parse(wpd_remote) : [];
        }
    } catch (error) {
        console.error('Error in getRemoteDomains:', error);
        // 发生错误时返回缓存数据
        const { wpd_remote } = await chrome.storage.sync.get(CACHE_CONSTANTS.STORAGE_KEYS.REMOTE_DOMAINS);
        return wpd_remote ? JSON.parse(wpd_remote) : [];
    }
}

// 初始化
async function init() {
    try {
        // 先获取本地设置
        const {website_policy, website_policy_domains, apiKey} = await new Promise((resolve) => {
            chrome.storage.sync.get(['website_policy', 'website_policy_domains', 'apiKey'], (result) => {
                resolve(result);
            });
        });
        // 如果策略关闭，直接创建按钮
        if (website_policy === false) {
            uploadButton = createFloatingButton();
            initializeButtonEvents();
            return;
        }

        // 获取当前页面的域名
        const currentDomain = window.location.hostname;

        // 解析本地配置的域名列表
        let localDomains = [];
        try {
            localDomains = JSON.parse(website_policy_domains || '[]');
        } catch (e) {
            console.error('Error parsing local domains:', e);
        }

        // 先检查本地白名单
        if (isDomainAllowed(currentDomain, localDomains)) {
            uploadButton = createFloatingButton();
            initializeButtonEvents();
            return;
        }

        // 检查远程白名单（使用缓存机制）
        if (apiKey) {
            const remoteDomains = await getRemoteDomains();
            if (isDomainAllowed(currentDomain, remoteDomains)) {
                uploadButton = createFloatingButton();
                initializeButtonEvents();
                return;
            }
        }
        // 如果都不匹配，则不显示按钮
        // console.log('Domain not allowed:', currentDomain);
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

// 启动应用
init();