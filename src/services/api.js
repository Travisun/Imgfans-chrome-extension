// API 基础配置
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1'

export async function fetchUserInfo(apiKey) {
    try {
        const response = await fetch(`${API_BASE_URL}/user`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error('API request failed')
        }

        return await response.json()
    } catch (error) {
        console.error('Error fetching user info:', error)
        throw error
    }
}

// 格式化字节数为人类可读格式
export function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
}

// 格式化数字为带逗号的字符串
export function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}