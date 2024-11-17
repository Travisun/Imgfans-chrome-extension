import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, renameSync, rmdirSync, readdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 复制文件的辅助函数
function copyFiles(src, dest) {
    try {
        copyFileSync(src, dest)
    } catch (err) {
        console.error(`Error copying ${src} to ${dest}:`, err)
    }
}

// 移动文件的辅助函数
function moveFile(src, dest) {
    try {
        renameSync(src, dest)
    } catch (err) {
        console.error(`Error moving ${src} to ${dest}:`, err)
    }
}

// 删除空目录的辅助函数
function removeEmptyDirectories(directory) {
    try {
        const files = readdirSync(directory)
        for (const file of files) {
            const fullPath = resolve(directory, file)
            if (readdirSync(fullPath).length === 0) {
                rmdirSync(fullPath)
            }
        }
        if (readdirSync(directory).length === 0) {
            rmdirSync(directory)
        }
    } catch (err) {
        console.error(`Error removing empty directories in ${directory}:`, err)
    }
}

export default defineConfig({
    plugins: [
        vue(),
        {
            name: 'post-build',
            closeBundle() {
                // 确保目标目录存在
                const dirs = ['dist/icons', 'dist/popup', 'dist/content']
                dirs.forEach(dir => {
                    try {
                        mkdirSync(dir, { recursive: true })
                    } catch (err) {
                        console.error(`Error creating directory ${dir}:`, err)
                    }
                })

                // 复制静态文件
                copyFiles(
                    resolve(__dirname, 'src/manifest.json'),
                    resolve(__dirname, 'dist/manifest.json')
                )

                // 复制图标
                const icons = ['16', '48', '128']
                icons.forEach(size => {
                    copyFiles(
                        resolve(__dirname, `public/icons/icon-${size}.png`),
                        resolve(__dirname, `dist/icons/icon-${size}.png`)
                    )
                })

                // 移动 HTML 文件到正确位置
                moveFile(
                    resolve(__dirname, 'dist/src/popup/index.html'),
                    resolve(__dirname, 'dist/popup/index.html')
                )
                copyFiles(
                    resolve(__dirname, 'src/content/content.css'),
                    resolve(__dirname, 'dist/content/content.css')
                )

                // 清理空目录
                try {
                    // 移除 dist/src/popup
                    const popupDir = resolve(__dirname, 'dist/src/popup')
                    if (readdirSync(popupDir).length === 0) {
                        rmdirSync(popupDir)
                    }

                    // 移除 dist/src
                    const srcDir = resolve(__dirname, 'dist/src')
                    if (readdirSync(srcDir).length === 0) {
                        rmdirSync(srcDir)
                    }
                } catch (err) {
                    console.error('Error cleaning empty directories:', err)
                }

                console.log('Post-build file operations completed')
            }
        }
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        cssCodeSplit: false,
        rollupOptions: {
            input: {
                popup: resolve(__dirname, 'src/popup/index.html'),
                content: resolve(__dirname, 'src/content/content.js')
            },
            output: {
                // JS 文件输出配置
                entryFileNames: (chunkInfo) => {
                    if (chunkInfo.name === 'content') {
                        return 'content/[name].js'
                    }
                    return 'popup/[name].js'
                },
                // 代码分割后的 chunk 输出配置
                chunkFileNames: (chunkInfo) => {
                    if (chunkInfo.name.includes('content')) {
                        return 'content/chunks/[name].[hash].js'
                    }
                    return 'popup/chunks/[name].[hash].js'
                },
                // 资源文件输出配置
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name.split('.')
                    const ext = info[info.length - 1]

                    // content 相关资源
                    if (assetInfo.name.includes('content')) {
                        return `content/[name][extname]`
                    }

                    // popup 相关资源
                    if (ext === 'css') {
                        return `popup/styles/[name][extname]`
                    }
                    if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext)) {
                        return `popup/images/[name][extname]`
                    }
                    if (['woff', 'woff2', 'ttf', 'eot'].includes(ext)) {
                        return `popup/fonts/[name][extname]`
                    }

                    return `popup/assets/[name].[hash][extname]`
                }
            }
        }
    }
})