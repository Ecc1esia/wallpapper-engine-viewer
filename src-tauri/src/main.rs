// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

// 引入commands模块
use wallpaper_engine_viewer_lib::*;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // 设置窗口图标和标题
            let main_window = app.get_window("main").unwrap();
            main_window.set_title("Wallpaper Engine 视频查看器").unwrap();

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            scan_wallpaper_videos,
            open_video_in_player
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}