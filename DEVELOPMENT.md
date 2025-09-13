# 开发指南

本文档为开发者提供详细的技术指导和最佳实践。

## 开发环境配置

### 必需工具

- **Node.js**: >= 16.0
- **Rust**: >= 1.70
- **Git**: 最新版本

### 推荐IDE

- **VS Code**: 配合以下扩展
  - Vue Language Features (Volar)
  - TypeScript Vue Plugin (Volar)
  - rust-analyzer
  - Tauri
  - Tailwind CSS IntelliSense

- **JetBrains IDEA**:
  - Vue.js 插件
  - Rust 插件

### 环境验证

运行以下命令验证环境：

```bash
# 检查 Node.js
node --version
npm --version

# 检查 Rust
rustc --version
cargo --version

# 检查 Tauri CLI
npm run tauri -- version
```

## 项目架构

### 前端架构 (Vue 3)

```
src/
├── components/           # Vue 组件
│   ├── SettingsPanel.vue # 设置面板组件
│   └── VideoViewer.vue   # 视频查看器组件
├── types/               # TypeScript 类型定义
│   └── index.ts         # 核心类型定义
├── utils/               # 工具函数 (待扩展)
└── style.css           # 全局样式 + Tailwind CSS
```

### 后端架构 (Tauri + Rust)

```
src-tauri/
├── src/
│   ├── main.rs         # 应用入口点
│   ├── lib.rs          # 库入口，导出命令
│   ├── commands.rs     # Tauri 命令实现
│   └── build.rs        # 构建脚本
├── Cargo.toml          # Rust 依赖配置
└── tauri.conf.json     # Tauri 应用配置
```

### 数据流

```
Vue 组件 → Tauri API → Rust 命令 → 文件系统
    ↑                                    ↓
  状态更新 ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
```

## 开发工作流

### 1. 新功能开发

**步骤 1: 设计 Rust 命令**
```rust
// src-tauri/src/commands.rs
#[tauri::command]
pub fn new_command(param: String) -> Result<String, String> {
    // 实现功能逻辑
    Ok("结果".to_string())
}
```

**步骤 2: 导出命令**
```rust
// src-tauri/src/lib.rs
pub use commands::new_command;
```

**步骤 3: 注册命令**
```rust
// src-tauri/src/main.rs
.invoke_handler(tauri::generate_handler![
    new_command
])
```

**步骤 4: 配置权限**
```json
// src-tauri/tauri.conf.json
"allowlist": {
  "all": false,
  "fs": {
    "readFile": true
  }
}
```

**步骤 5: 创建 Vue 组件**
```vue
<template>
  <div @click="executeCommand">
    <!-- 组件内容 -->
  </div>
</template>

<script setup lang="ts">
import { invoke } from '@tauri-apps/api/tauri'

const executeCommand = async () => {
  const result = await invoke('new_command', { param: 'value' })
  console.log(result)
}
</script>
```

### 2. 调试技巧

#### 前端调试
```javascript
// 控制台日志
console.log('数据:', data)
console.warn('警告:', warning)
console.error('错误:', error)

// Vue DevTools
// 在开发模式下自动可用，支持组件检查和状态调试
```

#### 后端调试
```rust
// 标准输出
println!("调试信息: {}", value);
eprintln!("错误信息: {}", error);

// 使用 log crate (需要添加依赖)
#[macro_use]
extern crate log;
info!("信息: {}", value);
warn!("警告: {}", warning);
error!("错误: {}", error);
```

#### Tauri 特定调试
```bash
# 详细输出
npm run tauri dev -- --verbose

# 调试模式
npm run tauri dev -- --debug

# 检查模式
npm run tauri dev -- --no-watch
```

### 3. 性能优化

#### 前端优化
```javascript
// 1. 组件懒加载
const VideoViewer = defineAsyncComponent(() =>
  import('./components/VideoViewer.vue')
)

// 2. 图片懒加载
<img
  :src="video.thumbnail"
  loading="lazy"
  @load="onImageLoad"
/>

// 3. 防抖搜索
import { debounce } from 'lodash-es'

const debouncedSearch = debounce((query) => {
  searchVideos(query)
}, 300)
```

#### 后端优化
```rust
// 1. 异步处理
#[tauri::command]
pub async fn scan_videos(path: String) -> Result<Vec<Video>, String> {
    tokio::spawn(async move {
        // 后台扫描
    }).await?;
}

// 2. 内存优化
// 避免不必要的数据克隆
let videos: Vec<Video> = entries
    .into_iter()
    .map(|entry| Video::from_entry(entry))
    .collect();

// 3. 错误处理
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ScanError {
    #[error("路径不存在: {0}")]
    PathNotFound(String),
    #[error("IO 错误: {0}")]
    IoError(#[from] std::io::Error),
}
```

## 测试策略

### 单元测试

#### Rust 测试
```rust
// src-tauri/tests/test_commands.rs
#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::TempDir;

    #[test]
    fn test_scan_videos() {
        let temp_dir = TempDir::new().unwrap();
        let result = scan_wallpaper_videos(temp_dir.path().to_string_lossy());
        assert!(result.is_ok());
    }
}
```

#### Vue 组件测试
```typescript
// src/components/__tests__/VideoViewer.spec.ts
import { mount } from '@vue/test-utils'
import VideoViewer from '../VideoViewer.vue'

describe('VideoViewer', () => {
  it('渲染视频列表', () => {
    const wrapper = mount(VideoViewer, {
      props: { wallpaperPath: '/test/path' }
    })
    expect(wrapper.find('.video-grid').exists()).toBe(true)
  })
})
```

### 端到端测试

```typescript
// tests/e2e/video.spec.ts
import { test, expect } from '@playwright/test'

test('播放视频', async ({ page }) => {
  await page.goto('/')
  await page.click('[data-testid="video-item"]')
  await expect(page).toHaveURL(/player/)
})
```

## 部署流程

### 1. 代码审查清单

- [ ] 代码格式化 (`npm run format`)
- [ ] 代码检查 (`npm run lint`)
- [ ] Rust 检查 (`cargo fmt && cargo clippy`)
- [ ] 测试通过 (`npm test`)
- [ ] 文档更新

### 2. 版本管理

```bash
# 更新版本号
npm version patch/minor/major

# 构建发布版本
npm run tauri build

# 创建 Git 标签
git push --follow-tags
```

### 3. 持续集成

示例 GitHub Actions 配置:

```yaml
name: CI/CD
on: [push, pull_request]
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Setup Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
```

## 常见问题解决

### 编译错误

1. **Rust 编译错误**
   ```bash
   # 清理构建缓存
   cd src-tauri && cargo clean

   # 更新依赖
   cargo update

   # 检查版本兼容性
   cargo tree
   ```

2. **TypeScript 错误**
   ```bash
   # 清理 Node.js 缓存
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

### 运行时错误

1. **权限错误**
   ```json
   // 检查 tauri.conf.json 权限设置
   "allowlist": {
     "fs": {
       "readFile": true,
       "readDir": true
     },
     "shell": {
       "open": true
     }
   }
   ```

2. **路径问题**
   ```rust
   // 使用 Tauri 提供的路径解析
   use tauri::path::PathResolver;

   let app_dir = path_resolver.app_dir();
   let resource_dir = path_resolver.resource_dir();
   ```

## 性能监控

### 前端监控

```javascript
// 性能指标
const perfData = {
  loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
  domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
}

// 错误监控
window.addEventListener('error', (event) => {
  console.error('前端错误:', event.error)
})
```

### 后端监控

```rust
// 性能计时
use std::time::Instant;

let start = Instant::now();
// 执行操作
let duration = start.elapsed();
println!("操作耗时: {:?}", duration);

// 内存使用
use std::process::Command;

let output = Command::new("ps")
    .arg("pid")
    .output()
    .expect("Failed to execute command");
```

## 安全考虑

### 数据验证

```rust
// 输入验证
pub fn validate_path(path: &str) -> Result<(), String> {
    if path.is_empty() {
        return Err("路径不能为空".to_string());
    }

    if path.contains("..") {
        return Err("路径不能包含相对目录".to_string());
    }

    Ok(())
}
```

### 错误处理

```rust
// 避免暴露敏感信息
#[tauri::command]
pub fn sensitive_operation(input: String) -> Result<String, String> {
    match validate_input(&input) {
        Ok(_) => perform_operation(input),
        Err(e) => {
            log::error!("操作失败: {}", e);
            Err("操作失败，请检查输入".to_string())
        }
    }
}
```

## 贡献指南

### 代码风格

- **Rust**: 遵循 `cargo fmt` 和 `cargo clippy`
- **TypeScript**: 使用 Prettier 和 ESLint
- **Vue**: 使用 Composition API 和 `<script setup>`

### 提交规范

```bash
# 提交消息格式
<type>(<scope>): <description>

# 示例
feat(video): 添加视频搜索功能
fix(dialog): 修复路径选择器崩溃
docs(readme): 更新安装说明
```

### 分支管理

- `main`: 主分支，保持稳定
- `develop`: 开发分支，集成最新功能
- `feature/*`: 功能分支
- `hotfix/*`: 紧急修复分支

## 参考资料

- [Tauri 官方文档](https://tauri.app/)
- [Vue 3 文档](https://vuejs.org/)
- [Rust 程序设计语言](https://doc.rust-lang.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/)

## 联系方式

- 技术支持: [GitHub Issues](https://github.com/your-repo/issues)
- 文档问题: [Documentation](https://docs.example.com)
- 功能请求: [Feature Requests](https://github.com/your-repo/discussions)