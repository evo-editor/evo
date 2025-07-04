#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{command, Window};
use tauri_plugin_oauth::{start_with_config, cancel, OauthConfig};
use regex::Regex;
use std::io::{self, BufRead};
use jwalk::WalkDir;
use std::fs;
use std::borrow::Cow;
use std::process::Command;
use serde::{Serialize, Deserialize};
use std::env::{current_dir, set_current_dir};


#[derive(Serialize, Deserialize)]
struct SearchResult {
    filename: String,
    lines: Vec<String>
}

#[derive(Serialize, Deserialize)]
struct ExecuteCommandResult {
    output: String,
    path: String
}




#[command]
fn read_binary_file(path: &str) -> Vec<u8> {
    let contents = match fs::read(path) {
        Ok(file) => file,
        Err(_error) => vec![],
    };

    contents
}




#[command]
async fn start_server(window: Window) -> Result<u16, String> {
    let mut config = OauthConfig::default();
    let html = include_str!("../../html.txt");

    config.response = Some(Cow::from(html));


    start_with_config(config, move |url| {
        let _ = window.emit("redirect_uri", url);
    })
    .map_err(|err| err.to_string())
}


#[command]
fn stop_server(port: u16) -> bool {
    let result: bool = match cancel(port) {
        Ok(()) => true,
        Err(_error) => false,
    };

    return result;
}


#[command]
fn search(folder_path: &str, pattern: &str) -> Vec<SearchResult> {
    let regex = Regex::new(pattern).expect("Invalid regex pattern");
    let mut results = Vec::new();

    for entry in WalkDir::new(folder_path)
        .into_iter()
        .filter_map(Result::ok)
        .filter(|e| e.file_type().is_file())
    {
        let path = entry.path();

        if let Ok(file) = fs::File::open(path.clone()) {
            let reader = io::BufReader::new(file);
            let mut matched_lines = Vec::new();

            for line in reader.lines().filter_map(Result::ok) {
                if regex.is_match(&line) {
                    matched_lines.push(line);
                }
            }

            if !matched_lines.is_empty() {
                let search_result = SearchResult {
                    filename: path.display().to_string(),
                    lines: matched_lines
                };

                results.push(search_result);
            }
        }
    }

    return results;
}

#[tauri::command]
fn exec_command(command: &str, path: &str) -> ExecuteCommandResult {

    set_current_dir(path).expect("Invalid path!");

    let output = Command::new("sh")
        .arg("-c")
        .arg(command)
        .output();




    let result = match output {
        Ok(output) if output.status.success() => {
            String::from_utf8_lossy(&output.stdout).to_string()
        },
        Ok(output) => {
            String::from_utf8_lossy(&output.stderr).to_string()
        },
        Err(e) => e.to_string(),
    };


    let path = current_dir().unwrap().to_str().unwrap().to_string();

    let command_output = ExecuteCommandResult {
        output: result,
        path: path
    };


    command_output
}




fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_oauth::init())
        .invoke_handler(tauri::generate_handler![start_server, stop_server, search, exec_command, read_binary_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}