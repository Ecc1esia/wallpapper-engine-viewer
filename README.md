<<<<<<< HEAD
# wallpapper-engine-viewer
用于小红车视频的viewer
=======
# Wallpaper Engine 视频查看器

一个基于 Tauri + Vue 3 + Tailwind CSS 的桌面应用程序，用于管理和播放 Wallpaper Engine 中的视频文件。

## 功能特性

- 📁 自动扫描 Wallpaper Engine 安装目录
- 🎬 视频预览图显示
- 🔍 搜索和排序功能
- 🎯 点击直接调用系统播放器播放视频
- 💾 路径设置自动保存
- 🎨 现代化的用户界面
- 🚀 跨平台支持 (Windows/macOS/Linux)

## 系统要求

- **操作系统**: Windows 10+ / macOS 10.14+ / Linux
- **Node.js**: 16.0 或更高版本
- **Rust**: 1.70 或更高版本
- **内存**: 最少 4GB RAM
- **存储**: 最少 1GB 可用空间

## 开发环境设置

### 1. 前置依赖安装

#### macOS
```bash
# 安装 Homebrew (如果尚未安装)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 安装 Node.js
brew install node

# 验证安装
node --version
npm --version
rustc --version
cargo --version
```

#### Windows
```bash
# 使用 winget 安装
winget install Node.js
winget install Rustlang.Rust

# 或者下载安装程序:
# Node.js: https://nodejs.org/
# Rust: https://rustup.rs/
```

#### Linux (Ubuntu/Debian)
```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# 安装系统依赖
sudo apt-get install -y libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```

### 2. 项目安装

```bash
# 克隆项目
git clone <repository-url>
cd wallpaper-engine-viewer

# 安装 Node.js 依赖
npm install

# 验证 Tauri CLI 是否正确安装
npm run tauri -- version
```

## 开发指南

### 开发模式运行

```bash
# 启动开发服务器 (同时启动前端和后端)
npm run tauri dev

# 或者分别启动
# 终端1: 启动前端开发服务器
npm run dev

# 终端2: 启动 Tauri 开发服务器
npm run tauri dev
```

**开发模式特性:**
- 热重载支持
- 开发工具集成
- 自动重新编译 Rust 代码
- 详细的错误日志

### 调试方法

#### 前端调试
1. **浏览器开发者工具**:
   - 在开发模式下，按 `F12` 或右键选择"检查"
   - 支持 Vue DevTools 扩展
   - 控制台日志和网络监控

2. **Vue 组件调试**:
   ```javascript
   // 在组件中添加调试信息
   console.log('Video data:', video)
   console.warn('Path not found:', path)
   ```

#### 后端调试
1. **Rust 日志**:
   ```rust
   // 在 main.rs 或 commands.rs 中添加日志
   println!("扫描路径: {}", path);
   eprintln!("错误信息: {}", error);
   ```

2. **Tauri 开发工具**:
   - 开发模式下会自动显示控制台窗口
   - 查看 `src-tauri/target/debug/` 目录下的日志文件

3. **常用调试命令**:
   ```bash
   # 检查 Rust 代码编译
   cd src-tauri && cargo check

   # 运行 Rust 测试
   cd src-tauri && cargo test

   # 查看详细的构建输出
   npm run tauri dev -- --verbose
   ```

#### 常见问题解决

1. **端口占用**:
   ```bash
   # 查找占用 1420 端口的进程
   lsof -ti:1420 | xargs kill -9

   # 或者使用其他端口
   # 在 vite.config.ts 中修改端口
   ```

2. **依赖问题**:
   ```bash
   # 清理 Node.js 缓存
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install

   # 清理 Rust 缓存
   cd src-tauri
   cargo clean
   cargo build
   ```

3. **权限问题** (macOS/Linux):
   ```bash
   # 给予执行权限
   chmod +x src-tauri/target/debug/wallpaper-engine-viewer
   ```

## 构建和打包

### 开发构建

```bash
# 构建前端资源
npm run build

# 构建 Rust 二进制文件
cd src-tauri && cargo build
```

### 生产打包

```bash
# 构建最终发布版本
npm run tauri build

# 构建特定平台
npm run tauri build -- --target x86_64-pc-windows-msvc  # Windows
npm run tauri build -- --target x86_64-apple-darwin     # macOS
npm run tauri build -- --target x86_64-unknown-linux-gnu # Linux
```

**打包输出位置:**
- Windows: `src-tauri/target/release/bundle/msi/`
- macOS: `src-tauri/target/release/bundle/dmg/`
- Linux: `src-tauri/target/release/bundle/deb/` 或 `appimage/`

### 高级构建选项

#### 自定义构建配置
编辑 `src-tauri/tauri.conf.json`:
```json
{
  "tauri": {
    "bundle": {
      "identifier": "com.yourcompany.wallpaper-engine-viewer",
      "icon": ["icons/32x32.png", "icons/128x128.png", "icons/icon.icns"],
      "category": "Utility",
      "shortDescription": "Wallpaper Engine Video Manager",
      "longDescription": "A desktop application to manage and play Wallpaper Engine videos."
    }
  }
}
```

#### 代码签名
```bash
# Windows 代码签名
npm run tauri build -- --bundles msi --sign

# macOS 代码签名
npm run tauri build -- --bundles dmg --sign
```

## 部署

### 安装程序分发

#### Windows (MSI)
```bash
# 构建 MSI 安装包
npm run tauri build -- --bundles msi

# 输出: src-tauri/target/release/bundle/msi/wallpaper-engine-viewer_0.1.0_x64_en-US.msi
```

#### macOS (DMG)
```bash
# 构建 DMG 镜像文件
npm run tauri build -- --bundles dmg

# 输出: src-tauri/target/release/bundle/dmg/wallpaper-engine-viewer_0.1.0_x64.dmg
```

#### Linux (DEB/RPM)
```bash
# 构建 DEB 包 (Ubuntu/Debian)
npm run tauri build -- --bundles deb

# 构建 RPM 包 (Fedora/CentOS)
npm run tauri build -- --bundles rpm

# 构建 AppImage (通用 Linux)
npm run tauri build -- --bundles appimage
```

### 自动更新

配置自动更新功能 (在 `src-tauri/tauri.conf.json` 中):
```json
{
  "tauri": {
    "updater": {
      "active": true,
      "endpoints": ["https://your-update-server.com/update"],
      "dialog": true,
      "pubkey": "你的公钥"
    }
  }
}
```

## 性能优化

### 前端优化
1. **代码分割**:
   ```javascript
   // 懒加载组件
   const VideoViewer = defineAsyncComponent(() => import('./components/VideoViewer.vue'))
   ```

2. **图片优化**:
   ```vue
   <template>
     <img
       :src="video.thumbnail"
       :alt="video.name"
       loading="lazy"
       class="w-full h-full object-cover"
     />
   </template>
   ```

3. **缓存策略**:
   ```javascript
   // 使用 localStorage 缓存路径设置
   const cachedPath = localStorage.getItem('wallpaper-engine-path')
   ```

### 后端优化
1. **异步处理**:
   ```rust
   #[tauri::command]
   pub async fn scan_wallpaper_videos(path: String) -> Result<Vec<Value>, String> {
       // 使用异步文件操作
       tokio::spawn(async move {
           // 后台处理
       });
   }
   ```

2. **内存管理**:
   ```rust
   // 避免不必要的数据克隆
   let videos: Vec<Value> = entries
       .into_iter()
       .map(|entry| create_video_item(entry))
       .collect();
   ```

## 测试

### 单元测试
```bash
# 运行 Rust 测试
cd src-tauri && cargo test

# 运行特定测试
cd src-tauri && cargo test scan_videos
```

### 端到端测试
```bash
# 安装测试依赖
npm install --save-dev @playwright/test

# 运行 E2E 测试
npm run test:e2e
```

### 性能测试
```bash
# 使用 Lighthouse 进行性能审计
npm run audit

# 内存使用分析
npm run analyze:memory
```

## 故障排除

### 常见错误

1. **编译错误**:
   ```
   error: OUT_DIR env var is not set
   ```
   解决: 确保 `build.rs` 文件存在且 `tauri-build` 依赖已添加

2. **图标缺失**:
   ```
   failed to read icon /icons/32x32.png
   ```
   解决: 运行 `npm run tauri icon` 创建图标文件

3. **权限错误**:
   ```
   Permission denied: fs::read_dir
   ```
   解决: 检查 `tauri.conf.json` 中的权限设置

4. **平台特定问题**:
   - **Windows**: 确保 Visual Studio Build Tools 已安装
   - **macOS**: 确保 Xcode 命令行工具已安装
   - **Linux**: 确保所有系统依赖已安装

### 日志收集
```bash
# 查看应用日志
# macOS
~/Library/Logs/wallpaper-engine-viewer/

# Linux
~/.local/share/wallpaper-engine-viewer/logs/

# Windows
%APPDATA%\wallpaper-engine-viewer\logs\
```

## 贡献指南

### 开发流程
1. Fork 项目仓库
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交更改: `git commit -m 'Add new feature'`
4. 推送分支: `git push origin feature/new-feature`
5. 创建 Pull Request

### 代码规范
- 遵循 ESLint 和 Prettier 配置
- Rust 代码遵循 `cargo fmt` 和 `cargo clippy`
- 提交信息使用 Conventional Commits 格式

### 提交前检查
```bash
# 格式化代码
npm run format
cargo fmt

# 运行 linting
npm run lint
cargo clippy

# 运行测试
npm test
cargo test
```

## 使用说明

1. **首次运行**：应用会要求您选择 Wallpaper Engine 的安装目录
2. **常见路径**：
   - Windows: `C:\Program Files (x86)\Steam\steamapps\common\wallpaper_engine`
   - macOS: `~/Library/Application Support/Steam/steamapps/common/wallpaper_engine`
   - Linux: `~/.steam/steam/steamapps/common/wallpaper_engine`
3. **自动扫描**：应用会自动扫描目录中的所有视频文件
4. **播放视频**：点击任意视频缩略图即可使用系统默认播放器播放

## 技术栈

- **前端**：Vue 3 + TypeScript + Tailwind CSS
- **后端**：Tauri + Rust
- **构建工具**：Vite
- **UI组件**：自定义组件，使用 Tailwind CSS 样式

## 项目结构

```
src/
├── components/          # Vue 组件
│   ├── SettingsPanel.vue # 路径设置面板
│   └── VideoViewer.vue   # 视频查看器
├── types/              # TypeScript 类型定义
└── style.css          # 全局样式

src-tauri/
├── src/               # Rust 源代码
│   ├── main.rs        # 主程序
│   ├── lib.rs         # 库入口
│   └── commands.rs    # 命令实现
├── build.rs           # 构建脚本
└── tauri.conf.json    # Tauri 配置
```

## 开发说明

### 添加新功能

1. 在 `src/components/` 目录下创建新的 Vue 组件
2. 在 `src-tauri/src/commands.rs` 中添加相应的 Rust 命令
3. 在 `src-tauri/src/lib.rs` 中导出新命令
4. 更新 `tauri.conf.json` 中的权限设置

### 样式指南

- 使用 Tailwind CSS 类名
- 遵循 BEM 命名约定
- 保持响应式设计

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 支持

- 📧 邮件支持: [your-email@example.com](mailto:your-email@example.com)
- 🐛 问题反馈: [GitHub Issues](https://github.com/your-repo/issues)
- 📖 文档: [完整文档](https://your-docs-site.com)

## 更新日志

### v0.1.0 (2024-01-XX)
- ✨ 初始版本发布
- 🎬 基础视频浏览功能
- 🔍 搜索和排序功能
- 🎯 系统播放器集成
- 💾 路径设置保存
- 🎨 现代化 UI 设计
>>>>>>> e442ec5 (Initial commit: Wallpaper Engine Viewer)
