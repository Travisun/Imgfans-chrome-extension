chrome.runtime.onInstalled.addListener(() => {
    // 在安装后打开指定的 URL
    chrome.tabs.create({ url: "https://imgfans.com/chrome-extension/welcome?installed=true" });
});
