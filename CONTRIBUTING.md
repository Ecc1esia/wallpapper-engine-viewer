# 贡献指南

感谢您对 Wallpaper Engine 视频查看器项目的关注！我们欢迎任何形式的贡献。

## 📋 目录

- [行为准则](#行为准则)
- [开始贡献](#开始贡献)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [问题报告](#问题报告)
- [功能请求](#功能请求)
- [Pull Request 流程](#pull-request-流程)

## 🤝 行为准则

本项目采用友善和包容的行为准则。请：

- 使用友好和尊重的语言
- 接受建设性的批评
- 专注于技术问题
- 尊重不同的观点和经验

## 🚀 开始贡献

### 准备工作

1. **Fork 项目**
   ```bash
   # 访问项目页面
   # 点击 "Fork" 按钮
   ```

2. **克隆本地副本**
   ```bash
   git clone https://github.com/YOUR_USERNAME/wallpaper-engine-viewer.git
   cd wallpaper-engine-viewer
   ```

3. **设置上游仓库**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/wallpaper-engine-viewer.git
   ```

4. **安装依赖**
   ```bash
   npm install
   ```

### 创建功能分支

```bash
# 创建新分支
git checkout -b feature/your-feature-name

# 或者修复分支
git checkout -b fix/issue-number

# 或者文档分支
git checkout -b docs/update-documentation
```

## 🔄 开发流程

### 1. 选择任务

- 查看 [Issues](https://github.com/your-repo/issues) 寻找合适的任务
- 选择标记为 `good first issue` 或 `help wanted` 的问题
- 或者创建新的 issue 讨论您的想法

### 2. 开发环境

```bash
# 启动开发服务器
npm run tauri dev

# 运行测试
npm test

# 代码检查
npm run lint

# 格式化代码
npm run format
```

### 3. 提交更改

```bash
# 添加更改
git add .

# 提交更改
git commit -m "type(scope): description"

# 推送到您的仓库
git push origin feature/your-feature-name
```

## 💻 代码规范

### TypeScript / Vue

#### 命名规范

- **组件名**: PascalCase
  ```typescript
  // ✅ 正确
  export default defineComponent({
    name: 'VideoViewer'
  })

  // ❌ 错误
  export default defineComponent({
    name: 'videoViewer'
  })
  ```

- **文件名**: kebab-case
  ```
  ✅ video-viewer.vue
  ❌ VideoViewer.vue
  ❌ videoViewer.vue
  ```

- **变量名**: camelCase
  ```typescript
  // ✅ 正确
  const videoPath = ref('')
  const loadVideos = async () => {}

  // ❌ 错误
  const VideoPath = ref('')
  const LoadVideos = async () => {}
  ```

- **常量名**: SCREAMING_SNAKE_CASE
  ```typescript
  // ✅ 正确
  const MAX_VIDEO_COUNT = 100
  const API_BASE_URL = 'https://api.example.com'
  ```

#### 组件规范

```vue
<template>
  <!-- 使用语义化的 HTML 标签 -->
  <div class="video-container">
    <video-item
      v-for="video in videos"
      :key="video.path"
      :video="video"
      @play="onVideoPlay"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VideoItem from './VideoItem.vue'
import type { VideoItem as VideoItemType } from '@/types'

// Props 定义
interface Props {
  wallpaperPath: string
}

const props = defineProps<Props>()

// Emits 定义
const emit = defineEmits<{
  'open-settings': []
}>()

// 响应式数据
const videos = ref<VideoItemType[]>([])
const loading = ref(false)

// 生命周期
onMounted(() => {
  loadVideos()
})

// 方法定义
const loadVideos = async () => {
  try {
    loading.value = true
    // 加载视频逻辑
  } catch (error) {
    console.error('加载视频失败:', error)
  } finally {
    loading.value = false
  }
}

// 事件处理
const onVideoPlay = (video: VideoItemType) => {
  emit('play-video', video)
}
</script>

<style scoped>
.video-container {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}
</style>
```

### Rust

#### 命名规范

- **函数名**: snake_case
  ```rust
  // ✅ 正确
  pub fn scan_wallpaper_videos(path: String) -> Result<Vec<Video>, String>

  // ❌ 错误
  pub fn ScanWallpaperVideos(path: String) -> Result<Vec<Video>, String>
  ```

- **结构体/枚举**: PascalCase
  ```rust
  // ✅ 正确
  pub struct VideoItem {
      pub name: String,
      pub path: String,
  }

  // ❌ 错误
  pub struct video_item {
      pub name: String,
      pub path: String,
  }
  ```

- **常量**: SCREAMING_SNAKE_CASE
  ```rust
  // ✅ 正确
  const MAX_PATH_LENGTH: usize = 1024;

  // ❌ 错误
  const max_path_length: usize = 1024;
  ```

#### 代码风格

```rust
// ✅ 正确的错误处理
#[tauri::command]
pub fn scan_videos(path: String) -> Result<Vec<Video>, String> {
    if !Path::new(&path).exists() {
        return Err("路径不存在".to_string());
    }

    let videos = scan_directory(&path)
        .map_err(|e| format!("扫描失败: {}", e))?;

    Ok(videos)
}

// ✅ 正确的文档注释
/// 扫描指定目录中的视频文件
///
/// # 参数
/// * `path` - 要扫描的目录路径
///
/// # 返回
/// 返回包含找到的视频文件的 Vec
///
/// # 错误
/// 如果路径不存在或无法访问，返回错误
pub fn scan_videos(path: String) -> Result<Vec<Video>, ScanError> {
    // 实现代码
}
```

## 📝 提交规范

### 提交消息格式

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### 类型 (Type)

- `feat`: 新功能
- `fix`: 错误修复
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建或工具变动

### 示例

```bash
# ✅ 正确的提交消息
feat(video): 添加视频搜索功能
fix(dialog): 修复路径选择器在 Windows 上的崩溃问题
docs(readme): 更新安装说明
style(component): 统一按钮样式
refactor(scanner): 优化文件扫描逻辑

# ❌ 错误的提交消息
修复了bug
添加了新功能
更新代码
```

### 提交步骤

```bash
# 1. 检查更改
git status

# 2. 查看更改内容
git diff

# 3. 添加相关文件
git add src/components/VideoViewer.vue

# 4. 提交更改
git commit -m "feat(video): 添加视频预览功能"

# 5. 推送到远程
git push origin feature/video-preview
```

## 🐛 问题报告

### 报告 Bug

使用 [Bug 报告模板](.github/ISSUE_TEMPLATE/bug_report.yml) 提供以下信息：

- 清晰的错误描述
- 重现步骤
- 期望行为
- 实际行为
- 环境信息（操作系统、版本号等）
- 相关截图或日志

### 功能请求

使用 [功能请求模板](.github/ISSUE_TEMPLATE/feature_request.yml) 提供以下信息：

- 功能描述
- 使用场景
- 建议的实现方案
- 优先级

## 🔄 Pull Request 流程

### 1. 创建 PR

1. 推送您的功能分支到您的 fork
2. 访问原仓库的 Pull Requests 页面
3. 点击 "New Pull Request"
4. 选择您的分支作为源分支
5. 填写 PR 描述

### 2. PR 描述

使用 [PR 模板](.github/PULL_REQUEST_TEMPLATE.md) 包含：

- 变更描述
- 相关 Issue
- 测试清单
- 截图（如适用）
- 技术细节

### 3. 代码审查

- 确保代码符合项目规范
- 响应审查意见
- 更新代码直到通过审查

### 4. 合并

- 维护者会合并通过审查的 PR
- 合并后，您的分支可以被删除

## 🎯 贡献想法

### 寻找贡献机会

1. **查看 Issues**
   - 标记为 `good first issue` 的问题
   - 标记为 `help wanted` 的问题
   - 未标记的问题

2. **改进文档**
   - 修复拼写错误
   - 添加更多示例
   - 改进现有说明

3. **添加测试**
   - 单元测试
   - 集成测试
   - E2E 测试

4. **性能优化**
   - 代码重构
   - 算法优化
   - 内存优化

5. **新功能**
   - 讨论 Issue 中的想法
   - 提出新的功能建议

### 初次贡献者建议

从简单的任务开始：

1. 修复文档拼写错误
2. 添加代码注释
3. 改进错误消息
4. 添加简单的测试
5. 修复小 Bug

## 📞 获取帮助

如果您需要帮助：

1. **查看文档**
   - [README.md](README.md)
   - [DEVELOPMENT.md](DEVELOPMENT.md)

2. **讨论问题**
   - 在 Issue 中讨论
   - 加入社区讨论

3. **联系维护者**
   - 通过 GitHub Issues
   - 邮件联系

## 🏆 贡献者认可

所有贡献者都会在以下地方获得认可：

- [贡献者列表](#贡献者)
- Release 说明
- GitHub 贡献图

---

感谢您的贡献！🎉

## 贡献者

感谢所有为此项目做出贡献的人：

<!-- 将在第一个 PR 中添加贡献者列表 -->