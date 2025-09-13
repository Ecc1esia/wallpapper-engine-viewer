<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-slate-800 mb-3">
          欢迎使用 Wallpaper Engine 视频查看器
        </h2>
        <p class="text-slate-600 leading-relaxed">
          请选择您的 Wallpaper Engine 安装目录，应用将自动扫描其中的视频文件。
        </p>
      </div>

      <div class="space-y-6">
        <div>
          <label for="wallpaper-path" class="block text-sm font-semibold text-slate-700 mb-2">
            Wallpaper Engine 路径
          </label>
          <div class="flex gap-3">
            <input
              id="wallpaper-path"
              v-model="inputPath"
              type="text"
              placeholder="例如: C:\\Program Files (x86)\\Steam\\steamapps\\common\\wallpaper_engine"
              class="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <button
              @click="selectDirectory"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              浏览
            </button>
          </div>
        </div>

        <div v-if="commonPaths.length > 0">
          <h3 class="text-sm font-semibold text-slate-700 mb-3">常见路径</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="path in commonPaths"
              :key="path"
              @click="selectCommonPath(path)"
              class="px-3 py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-sm border border-slate-200 hover:border-blue-300 transition-colors"
            >
              {{ path }}
            </button>
          </div>
        </div>

        <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-red-800 text-sm">{{ error }}</span>
          </div>
        </div>

        <div v-if="success" class="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-green-800 text-sm">{{ success }}</span>
          </div>
        </div>

        <button
          @click="savePath"
          :disabled="!inputPath.trim()"
          class="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500"
        >
          保存并继续
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { open } from '@tauri-apps/api/dialog'

const emit = defineEmits<{
  'path-set': [path: string]
}>()

const inputPath = ref('')
const error = ref('')
const success = ref('')

// 常见的Wallpaper Engine安装路径
const commonPaths = ref<string[]>([])

onMounted(async () => {
  // 检测平台并设置常见路径
  const platform = await getPlatform()

  if (platform === 'windows') {
    commonPaths.value = [
      'C:\\Program Files (x86)\\Steam\\steamapps\\common\\wallpaper_engine',
      'C:\\Program Files\\Steam\\steamapps\\common\\wallpaper_engine',
      'D:\\Steam\\steamapps\\common\\wallpaper_engine',
      'E:\\Steam\\steamapps\\common\\wallpaper_engine'
    ]
  } else if (platform === 'macos') {
    commonPaths.value = [
      '~/Library/Application Support/Steam/steamapps/common/wallpaper_engine',
      '/Applications/Steam.app/Contents/MacOS/steamapps/common/wallpaper_engine'
    ]
  } else if (platform === 'linux') {
    commonPaths.value = [
      '~/.steam/steam/steamapps/common/wallpaper_engine',
      '~/.steam/root/steamapps/common/wallpaper_engine',
      '/usr/games/steamapps/common/wallpaper_engine'
    ]
  }
})

const getPlatform = (): string => {
  if (navigator.userAgent.includes('Windows')) return 'windows'
  if (navigator.userAgent.includes('Mac')) return 'macos'
  return 'linux'
}

const selectDirectory = async () => {
  try {
    const selected = await open({
      directory: true,
      multiple: false,
      title: '选择Wallpaper Engine安装目录'
    })

    if (selected) {
      inputPath.value = selected as string
    }
  } catch (err) {
    error.value = '选择目录失败: ' + (err as Error).message
    setTimeout(() => error.value = '', 5000)
  }
}

const selectCommonPath = (path: string) => {
  inputPath.value = path
}

const savePath = async () => {
  if (!inputPath.value.trim()) {
    error.value = '请输入有效的路径'
    setTimeout(() => error.value = '', 5000)
    return
  }

  try {
    // 调用Tauri命令验证路径
    const { invoke } = await import('@tauri-apps/api/tauri')
    const videos = await invoke('scan_wallpaper_videos', { path: inputPath.value })

    success.value = `路径设置成功！找到 ${Array.isArray(videos) ? videos.length : 0} 个视频文件`
    error.value = ''

    // 延迟发射事件，让用户看到成功消息
    setTimeout(() => {
      emit('path-set', inputPath.value)
    }, 1500)

  } catch (err) {
    error.value = '路径无效或无法访问: ' + (err as Error).message
    success.value = ''
    setTimeout(() => error.value = '', 5000)
  }
}
</script>