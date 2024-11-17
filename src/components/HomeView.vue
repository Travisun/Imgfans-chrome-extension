<template>
  <div class="h-full">
    <!-- 未配置 API Key 的状态 -->
    <div v-if="!hasApiKey" class="h-full flex flex-col items-center justify-center p-6 space-y-6">
      <div class="w-48 h-48 text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M21 8v13H3V8M23 3H1v5h22V3zM12 12h.01M8 12h.01M16 12h.01" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="8" cy="12" r="1" />
          <circle cx="16" cy="12" r="1" />
        </svg>
      </div>
      <div class="text-center space-y-2">
        <h3 class="text-xl font-semibold text-gray-900">Welcome to ImgFans</h3>
        <p class="text-gray-500">Please configure your API key to get started</p>
      </div>
      <button
          @click="goToSettings"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        Configure API Key
      </button>
    </div>

    <!-- 已配置 API Key 的状态 -->
    <div v-else-if="userData" class="h-full overflow-auto custom-scrollbar">
      <!-- 用户信息头部 -->
      <div class="bg-gradient-to-b from-blue-500 to-blue-600 text-white p-6">
        <div class="flex items-center space-x-4">
          <img
              :src="userData.user.profile_photo_url"
              :alt="userData.user.name"
              class="w-16 h-16 rounded-full border-2 border-white shadow-lg"
          >
          <div>
            <h2 class="text-2xl font-bold">{{ userData.user.name }}</h2>
            <p class="text-blue-100">{{ userData.user.email }}</p>
          </div>
        </div>
      </div>

      <!-- 统计数据卡片 -->
      <div class="grid grid-cols-2 gap-4 p-4 bg-[#f3f4f6]">
        <!-- 存储使用情况 -->
        <div class="col-span-2 bg-white rounded-lg shadow p-4">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Storage Usage</h3>
          <div class="space-y-2">
            <div class="relative pt-1">
              <div class="flex items-center justify-between mb-2">
                <div>
                  <span class="text-xs font-semibold inline-block text-blue-600">
                    {{ formatBytes(userData.stats.storage_used) }} used
                  </span>
                </div>
                <div>
                  <span class="text-xs font-semibold inline-block text-gray-600">
                    {{ formatBytes(userData.stats.storage_quota) }} total
                  </span>
                </div>
              </div>
              <div class="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                <div
                    :style="`width: ${(userData.stats.storage_used / userData.stats.storage_quota) * 100}%`"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 文件统计 -->
        <div class="col-span-2 bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Total Files</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ formatNumber(userData.stats.total_files) }}
              </p>
            </div>
          </div>
        </div>

        <!-- 查看统计 -->
        <div class="col-span-2 bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Views This Month</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ formatNumber(userData.stats.views_month) }}
              </p>
              <p class="text-xs text-gray-500">
                Total: {{ formatNumber(userData.stats.views_total) }}
              </p>
            </div>
          </div>
        </div>

        <!-- 下载统计 -->
        <div class="col-span-2 bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Downloads This Month</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ formatNumber(userData.stats.downloads_month) }}
              </p>
              <p class="text-xs text-gray-500">
                Total: {{ formatNumber(userData.stats.downloads_total) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else class="h-full flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchUserInfo, formatBytes, formatNumber } from '../services/api'

const props = defineProps({
  onSettingsClick: {
    type: Function,
    required: true
  }
})

const hasApiKey = ref(false)
const userData = ref(null)

const goToSettings = () => {
  props.onSettingsClick()
}

// 从存储中获取 API Key 并加载用户数据
const loadUserData = async () => {
  try {
    userData.value = null // 重置数据，显示加载状态
    const storage = chrome?.storage?.sync || localStorage
    const apiKey = await new Promise(resolve => {
      if (chrome?.storage?.sync) {
        storage.get(['apiKey'], result => resolve(result.apiKey))
      } else {
        resolve(storage.getItem('apiKey'))
      }
    })

    if (apiKey) {
      hasApiKey.value = true
      const data = await fetchUserInfo(apiKey)
      userData.value = data
    } else {
      hasApiKey.value = false
      userData.value = null
    }
  } catch (error) {
    console.error('Error loading user data:', error)
    hasApiKey.value = false
    userData.value = null
  }
}

// 暴露刷新方法供父组件调用
defineExpose({
  refreshData: loadUserData
})

onMounted(() => {
  loadUserData()
})
</script>