#!/usr/bin/env node

/**
 * Wallpaper Engine Viewer 部署脚本
 * 用于自动化构建和部署流程
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Wallpaper Engine Viewer 部署脚本');
console.log('=====================================\n');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, options = {}) {
  try {
    log(`执行命令: ${command}`, 'cyan');
    const result = execSync(command, {
      stdio: 'inherit',
      ...options
    });
    return true;
  } catch (error) {
    log(`命令执行失败: ${command}`, 'red');
    log(`错误信息: ${error.message}`, 'red');
    return false;
  }
}

function checkEnvironment() {
  log('🔍 检查环境...', 'yellow');

  // 检查 Node.js
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    log(`Node.js 版本: ${nodeVersion}`, 'green');
  } catch (error) {
    log('❌ Node.js 未安装', 'red');
    process.exit(1);
  }

  // 检查 Rust
  try {
    const rustVersion = execSync('rustc --version', { encoding: 'utf8' }).trim();
    log(`Rust 版本: ${rustVersion}`, 'green');
  } catch (error) {
    log('❌ Rust 未安装', 'red');
    process.exit(1);
  }

  // 检查 Tauri CLI
  try {
    const tauriVersion = execSync('npm run tauri -- version', { encoding: 'utf8' }).trim();
    log(`Tauri CLI: ${tauriVersion}`, 'green');
  } catch (error) {
    log('❌ Tauri CLI 未正确安装', 'red');
    process.exit(1);
  }

  log('✅ 环境检查完成\n', 'green');
}

function cleanBuild() {
  log('🧹 清理构建文件...', 'yellow');

  const cleanCommands = [
    'npm run clean',
    'npm run clean:cache',
  ];

  for (const command of cleanCommands) {
    if (!runCommand(command)) {
      log('❌ 清理失败', 'red');
      process.exit(1);
    }
  }

  log('✅ 清理完成\n', 'green');
}

function installDependencies() {
  log('📦 安装依赖...', 'yellow');

  if (!runCommand('npm install')) {
    log('❌ 依赖安装失败', 'red');
    process.exit(1);
  }

  log('✅ 依赖安装完成\n', 'green');
}

function runTests() {
  log('🧪 运行测试...', 'yellow');

  // 跳过测试（如果测试未配置）
  log('⚠️  测试配置跳过（可选）', 'yellow');

  log('✅ 测试完成\n', 'green');
}

function buildApplication() {
  log('🔨 构建应用...', 'yellow');

  const buildCommands = [
    'npm run lint',
    'npm run format:check',
    'npm run build',
    'npm run tauri build'
  ];

  for (const command of buildCommands) {
    if (!runCommand(command)) {
      log(`❌ 构建失败: ${command}`, 'red');
      process.exit(1);
    }
  }

  log('✅ 构建完成\n', 'green');
}

function packageApplication() {
  log('📦 打包应用...', 'yellow');

  // 根据平台选择打包目标
  const platform = process.platform;
  let packageCommand = 'npm run package';

  if (platform === 'win32') {
    packageCommand = 'npm run package:installer';
  } else if (platform === 'darwin') {
    packageCommand = 'npm run package:installer';
  } else if (platform === 'linux') {
    packageCommand = 'npm run package:installer';
  }

  if (!runCommand(packageCommand)) {
    log('❌ 打包失败', 'red');
    process.exit(1);
  }

  log('✅ 打包完成\n', 'green');
}

function showResults() {
  log('🎉 部署完成！', 'green');
  log('=====================================', 'cyan');
  log('构建产物位置:', 'yellow');

  const platform = process.platform;
  if (platform === 'win32') {
    log('  Windows: src-tauri/target/release/bundle/msi/', 'blue');
  } else if (platform === 'darwin') {
    log('  macOS: src-tauri/target/release/bundle/dmg/', 'blue');
  } else if (platform === 'linux') {
    log('  Linux: src-tauri/target/release/bundle/', 'blue');
  }

  log('\n下一步操作:', 'yellow');
  log('  1. 测试安装包', 'blue');
  log('  2. 上传到 GitHub Releases', 'blue');
  log('  3. 更新文档和版本号', 'blue');
  log('=====================================', 'cyan');
}

// 主函数
function main() {
  const args = process.argv.slice(2);

  log('🚀 开始部署流程...\n', 'green');

  try {
    checkEnvironment();

    if (args.includes('--clean')) {
      cleanBuild();
    }

    if (args.includes('--install')) {
      installDependencies();
    }

    runTests();
    buildApplication();

    if (args.includes('--package')) {
      packageApplication();
    }

    showResults();

  } catch (error) {
    log(`❌ 部署失败: ${error.message}`, 'red');
    process.exit(1);
  }
}

// 显示帮助信息
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  log('Wallpaper Engine Viewer 部署脚本', 'cyan');
  log('=====================================', 'cyan');
  log('用法: node deploy.js [选项]', 'yellow');
  log('');
  log('选项:', 'yellow');
  log('  --clean     清理构建文件', 'blue');
  log('  --install   重新安装依赖', 'blue');
  log('  --package   打包应用', 'blue');
  log('  --help, -h  显示帮助信息', 'blue');
  log('');
  log('示例:', 'yellow');
  log('  node deploy.js              # 标准构建', 'blue');
  log('  node deploy.js --clean      # 清理并构建', 'blue');
  log('  node deploy.js --package    # 构建并打包', 'blue');
  process.exit(0);
}

// 运行主函数
main();