use std::fs;
use std::path::Path;
use serde_json::Value;

// 扫描Wallpaper Engine目录中的视频文件
#[tauri::command]
pub fn scan_wallpaper_videos(path: String) -> Result<Vec<Value>, String> {
    let wallpaper_path = Path::new(&path);
    let mut videos = Vec::new();

    if !wallpaper_path.exists() {
        return Err("路径不存在".to_string());
    }

    // 递归扫描目录
    if let Ok(entries) = fs::read_dir(wallpaper_path) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                // 检查是否是wallpaper项目目录（通常包含scene.json和video.mp4）
                if let Ok(project_entries) = fs::read_dir(&path) {
                    let mut has_video = false;
                    let _has_config = false;
                    let mut video_file = None;
                    let mut thumbnail_file = None;

                    for project_entry in project_entries.flatten() {
                        let project_path = project_entry.path();
                        let file_name = project_path.file_name()
                            .and_then(|name| name.to_str())
                            .unwrap_or("");

                        if file_name == "video.mp4" || file_name.ends_with(".mp4") {
                            has_video = true;
                            video_file = Some(project_path.clone());
                        } else if file_name == "scene.json" {
                            // _has_config = true; // 暂时注释掉，避免未使用变量警告
                        } else if file_name == "thumb.jpg" || file_name == "thumb.png" {
                            thumbnail_file = Some(project_path);
                        }
                    }

                    if has_video {
                        let video_path = video_file.unwrap().to_string_lossy().to_string();
                        let thumbnail_path = thumbnail_file
                            .map(|p| p.to_string_lossy().to_string())
                            .unwrap_or_else(|| "".to_string());

                        let folder_name = path.file_name()
                            .and_then(|name| name.to_str())
                            .unwrap_or("未知");

                        videos.push(serde_json::json!({
                            "name": folder_name,
                            "path": video_path,
                            "thumbnail": thumbnail_path,
                            "folder": path.to_string_lossy().to_string()
                        }));
                    }
                }
            }
        }
    }

    Ok(videos)
}

// 用系统默认播放器打开视频
#[tauri::command]
pub fn open_video_in_player(path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        use std::process::Command;
        Command::new("cmd")
            .args(&["/C", "start", "", &path])
            .spawn()
            .map_err(|e| format!("无法打开视频: {}", e))?;
    }

    #[cfg(target_os = "macos")]
    {
        use std::process::Command;
        Command::new("open")
            .arg(&path)
            .spawn()
            .map_err(|e| format!("无法打开视频: {}", e))?;
    }

    #[cfg(target_os = "linux")]
    {
        use std::process::Command;
        Command::new("xdg-open")
            .arg(&path)
            .spawn()
            .map_err(|e| format!("无法打开视频: {}", e))?;
    }

    Ok(())
}