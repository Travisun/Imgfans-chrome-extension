import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { writeFileSync, copyFileSync, mkdirSync } from 'fs'

// 复制文件的辅助函数
function copyFiles(src, dest) {
    try {
        copyFileSync(src, dest)
    } catch (err) {
        console.error(`Error copying ${src} to ${dest}:`, err)
    }
}

export default defineConfig({
    plugins: [
        vue(),
        {
            name: 'copy-manifest',
            closeBundle() {
                // 确保目标目录存在
                try {
                    mkdirSync('dist/icons', { recursive: true })
                } catch (err) {
                    console.error('Error creating directories:', err)
                }

                // 复制 manifest.json
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
            }
        }
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                popup: resolve(__dirname, 'src/popup/index.html')
            },
            output: {
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name].[hash].js',
                assetFileNames: 'assets/[name].[ext]'
            }
        }
    }
})