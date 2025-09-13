<template>
  <div class="space-y-6">
    <!-- 顶部工具栏 -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h2 class="text-2xl font-bold text-slate-800">视频库</h2>
          <div v-if="videos.length > 0" class="text-sm text-slate-600">
            共 {{ videos.length }} 个视频
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="refreshVideos"
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <svg
              :class="{ 'animate-spin': loading }"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            <span>刷新</span>
          </button>
          <button
            @click="openSettings"
            class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
          >
            设置
          </button>
        </div>
      </div>

      <!-- 搜索和过滤 -->
      <div class="mt-4 flex items-center space-x-4">
        <div class="flex-1 relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索视频..."
            class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <svg
            class="w-5 h-5 text-slate-400 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <select
          v-model="sortBy"
          class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="name">按名称排序</option>
          <option value="date">按日期排序</option>
        </select>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-slate-600">正在扫描视频文件...</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <div>
          <h3 class="text-red-800 font-semibold">扫描失败</h3>
          <p class="text-red-700 text-sm mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredVideos.length === 0" class="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
      <svg class="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
      </svg>
      <h3 class="text-lg font-semibold text-slate-800 mb-2">没有找到视频文件</h3>
      <p class="text-slate-600 mb-4">
        {{ searchQuery ? '没有匹配的搜索结果' : '请确保Wallpaper Engine目录包含视频文件' }}
      </p>
      <button
        @click="refreshVideos"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        重新扫描
      </button>
    </div>

    <!-- 视频网格 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="video in filteredVideos"
        :key="video.path"
        @click="playVideo(video)"
        class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
      >
        <!-- 视频预览图 -->
        <div class="aspect-video bg-slate-200 relative overflow-hidden">
          <img
            v-if="video.thumbnail"
            :src="getThumbnailUrl(video.thumbnail)"
            :alt="video.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400">
            <svg class="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </div>

          <!-- 播放按钮遮罩 -->
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <div class="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <svg class="w-6 h-6 text-blue-600 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- 视频信息 -->
        <div class="p-4">
          <h3 class="font-semibold text-slate-800 truncate mb-1">{{ video.name }}</h3>
          <p class="text-sm text-slate-600 truncate">{{ video.folder }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'
import { convertFileSrc } from '@tauri-apps/api/tauri'

import type { VideoItem } from '../types'

interface Props {
  wallpaperPath: string
}

interface Emits {
  'open-settings': []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const videos = ref<VideoItem[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const sortBy = ref('name')

// 过滤和排序视频
const filteredVideos = computed(() => {
  let filtered = videos.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(video =>
      video.name.toLowerCase().includes(query) ||
      video.folder.toLowerCase().includes(query)
    )
  }

  if (sortBy.value === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'date') {
    filtered.sort((a, b) => b.path.localeCompare(a.path))
  }

  return filtered
})

// 获取缩略图URL
const getThumbnailUrl = (thumbnailPath: string) => {
  try {
    return convertFileSrc(thumbnailPath)
  } catch {
    return ''
  }
}

// 扫描视频文件
const scanVideos = async () => {
  loading.value = true
  error.value = ''

  try {
    const result = await invoke<VideoItem[]>('scan_wallpaper_videos', {
      path: props.wallpaperPath
    })
    videos.value = result
  } catch (err) {
    error.value = (err as Error).message
    console.error('Failed to scan videos:', err)
  } finally {
    loading.value = false
  }
}

// 播放视频
const playVideo = async (video: VideoItem) => {
  try {
    await invoke('open_video_in_player', { path: video.path })
  } catch (err) {
    console.error('Failed to play video:', err)
    error.value = '无法播放视频: ' + (err as Error).message
    setTimeout(() => error.value = '', 5000)
  }
}

// 刷新视频列表
const refreshVideos = () => {
  scanVideos()
}

// 打开设置
const openSettings = () => {
  emit('open-settings')
}

// 监听路径变化
watch(() => props.wallpaperPath, () => {
  if (props.wallpaperPath) {
    scanVideos()
  }
}, { immediate: true })

onMounted(() => {
  if (props.wallpaperPath) {
    scanVideos()
  }
})
</script>