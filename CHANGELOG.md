# 更新日志

本文档记录了项目的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
本项目遵循 [语义化版本](https://semver.org/spec/v2.0.0.html)。

## [未发布]

### 新增
- 初始项目架构
- Vue 3 + TypeScript + Tailwind CSS 前端
- Tauri + Rust 后端
- 视频扫描功能
- 路径设置功能
- 搜索和排序功能
- 系统播放器集成

---

## [0.1.0] - 2024-01-XX

### 新增 (Added)
- ✨ 完整的应用架构
  - Vue 3 Composition API 前端框架
  - TypeScript 类型安全支持
  - Tailwind CSS 现代化样式
  - Tauri 跨平台桌面应用框架
  - Rust 高性能后端

- 🎬 核心功能
  - Wallpaper Engine 路径自动检测
  - 视频文件自动扫描和识别
  - 视频预览图显示
  - 搜索和排序功能
  - 一键调用系统播放器

- 🎨 用户界面
  - 响应式设计，支持桌面和移动端
  - 现代化的设置面板
  - 网格式视频展示
  - 加载状态和错误处理
  - 暗色主题支持

- 🔧 开发工具
  - 完整的开发环境配置
  - 代码质量工具 (ESLint, Prettier)
  - 类型检查和代码格式化
  - 调试和日志支持

- 📚 文档
  - 详细的用户手册
  - 开发者指南
  - API 文档
  - 贡献指南

### 技术特性 (Technical Features)

- 前端: Vue 3 + TypeScript + Tailwind CSS
- 后端: Tauri + Rust
- 构建工具: Vite + Cargo
- 包管理: npm + cargo
- 测试: Vitest + Playwright
- 代码质量: ESLint + Prettier + rustfmt + clippy

### 系统要求 (System Requirements)

- Windows 10+ / macOS 10.14+ / Linux
- Node.js 16+
- Rust 1.70+
- 最少 4GB RAM
- 最少 1GB 存储空间

### 已知问题 (Known Issues)

- 某些 Linux 发行版可能需要额外依赖
- macOS 上的代码签名需要开发者证书
- Windows 上的 SmartScreen 可能会拦截首次运行

---

## 版本说明

### 版本号规则

- **主版本号**: 不兼容的 API 更改
- **次版本号**: 向下兼容的功能新增
- **修订号**: 向下兼容的问题修复

### 更新类型

- **新增 (Added)**: 新功能
- **更改 (Changed)**: 已有功能的变更
- **废弃 (Deprecated)**: 即将移除的功能
- **移除 (Removed)**: 已移除的功能
- **修复 (Fixed)**: 任何错误修复
- **安全 (Security)**: 安全相关的修复

---

## 贡献

欢迎通过 [GitHub Issues](https://github.com/your-repo/issues) 报告问题或建议功能。

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。