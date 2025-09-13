<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <div class="container mx-auto px-4 py-8">
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-slate-800 mb-2">
          Wallpaper Engine 视频查看器
        </h1>
        <p class="text-slate-600">
          管理和播放您的 Wallpaper Engine 视频收藏
        </p>
      </header>

      <main class="min-h-[600px]">
        <SettingsPanel
          v-if="!settingsPath"
          @path-set="onPathSet"
        />
        <VideoViewer
          v-else
          :wallpaper-path="settingsPath"
          @open-settings="onOpenSettings"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SettingsPanel from './components/SettingsPanel.vue'
import VideoViewer from './components/VideoViewer.vue'

const settingsPath = ref<string>('')

onMounted(() => {
  // 从本地存储加载保存的路径
  const savedPath = localStorage.getItem('wallpaper-engine-path')
  if (savedPath) {
    settingsPath.value = savedPath
  }
})

const onPathSet = (path: string) => {
  settingsPath.value = path
  localStorage.setItem('wallpaper-engine-path', path)
}

const onOpenSettings = () => {
  settingsPath.value = ''
}
</script>