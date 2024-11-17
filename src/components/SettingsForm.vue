<template>
  <div class="space-y-6">
    <!-- 标题和说明 -->
    <div class="space-y-2">
      <h3 class="text-lg font-medium text-gray-900">API Configuration</h3>
      <p class="text-sm text-gray-500">
        Configure your API settings for accessing ImgFans services.
      </p>
    </div>

    <!-- API Key 输入表单 -->
    <div class="space-y-4">
      <div class="space-y-2">
        <label for="apiKey" class="block text-sm font-medium text-gray-700">
          API Key
        </label>
        <div class="space-y-1">
          <div class="flex">
            <input
                type="password"
                id="apiKey"
                v-model="apiKey"
                :class="[
                'block w-full p-2 rounded-md border-gray-300 shadow-sm text-sm',
                'focus:border-blue-500 focus:ring-blue-500',
                'disabled:bg-gray-50 disabled:text-gray-500',
              ]"
                :disabled="isSaving"
                placeholder="Enter your API key"
            />
          </div>
          <p class="text-xs text-gray-500">
            You can find your API key in your
            <a
                href="https://imgfans.com/user/api-tokens"
                target="_blank"
                class="text-blue-600 hover:text-blue-700 hover:underline"
            >ImgFans account settings</a>.
          </p>
        </div>
      </div>

      <!-- 保存按钮 -->
      <div class="flex items-center justify-end">
        <div class="flex items-center space-x-2">
          <span v-if="saveStatus" class="text-sm" :class="statusClass">
            {{ saveStatus }}
          </span>
          <button
              @click="saveSettings"
              :disabled="isSaving"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
          >
            <span v-if="isSaving">Saving...</span>
            <span v-else>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['settings-saved'])

const apiKey = ref('')
const isSaving = ref(false)
const saveStatus = ref('')
const statusClass = ref('')

// 储存服务
const storage = {
  get: async function(keys) {
    if (chrome?.storage?.sync) {
      return new Promise((resolve) => {
        chrome.storage.sync.get(keys, (result) => {
          resolve(result)
        })
      })
    } else {
      // 开发环境使用 localStorage
      const result = {}
      keys.forEach(key => {
        result[key] = localStorage.getItem(key)
      })
      return result
    }
  },
  set: async function(data) {
    if (chrome?.storage?.sync) {
      return new Promise((resolve) => {
        chrome.storage.sync.set(data, resolve)
      })
    } else {
      // 开发环境使用 localStorage
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, value)
      })
    }
  }
}

// 从存储加载设置
onMounted(async () => {
  try {
    const result = await storage.get(['apiKey'])
    if (result.apiKey) {
      apiKey.value = result.apiKey
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
})

// 保存设置
const saveSettings = async () => {
  isSaving.value = true
  saveStatus.value = ''

  try {
    await storage.set({
      apiKey: apiKey.value
    })

    saveStatus.value = 'Settings saved successfully'
    statusClass.value = 'text-green-600'

    // 触发保存成功事件
    emit('settings-saved')

    // 3秒后清除状态消息
    setTimeout(() => {
      saveStatus.value = ''
    }, 3000)
  } catch (error) {
    console.error('Failed to save settings:', error)
    saveStatus.value = 'Failed to save settings'
    statusClass.value = 'text-red-600'
  } finally {
    isSaving.value = false
  }
}
</script>