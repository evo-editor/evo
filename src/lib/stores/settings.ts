import { readTextFile, createDir, BaseDirectory, writeTextFile } from "@tauri-apps/api/fs"
import { get, writable } from "svelte/store"
import axiosRequest from "../api/axios";
import { connectedUser } from "./auth";



export let userSettings = writable({
    "General": {

    },

    "Appearance": {
        "Theme": {
            "Editor Theme": {
                "id": "editor_theme",
                "description": "Changing the colors of the editor",
                "type": "option",
                "value": "solarized-dark",
                "options": [
                    { name: "Solarized Light", id: "solarized-light" },
                    { name: "Solarized Dark", id: "solarized-dark" },
                    { name: "Github Light", id: "github-light" },
                    { name: "Github Dark", id: "github-dark" },
                    { name: "Material Light", id: "material-light" },
                    { name: "Material Dark", id: "material-dark" },
                    { name: "Dracula", id: "dracula" },
                    { name: "One Dark", id: "one-dark" },
                    { name: "Aura", id: "aura" },
                    { name: "Tokyo Night", id: "tokyo-night" },
                    { name: "Tokyo Night Day", id: "tokyo-night-day" },
                    { name: "Tokyo Night Storm", id: "tokyo-night-storm" },
                ]
            },
        }
    },

    "Editor": {
        "Font": {        
            "Font Size": {
                "id": "font_size",
                "description": "Adjusts the font size of the editor",
                "type": "number",
                "min": 2,
                "max": 20,
                "value": 14 
            },
            "Tab Size": {
                "id": "tab_size",
                "description": "Adjusts the tab size of the editor",
                "type": "number",
                "min": 1,
                "max": 10,
                "value": 4
            }
        },

        "Cursor": {
            "Width": {
                "id": "cursor_width",
                "description": "Adjusts the tab size of the editor",
                "type": "number",
                "min": 1,
                "max": 5,
                "value": 1
            }
        },

        "Formatting": {
            "Format On Save": {
                "id": "format_on_save",
                "description": "Formatting on save",
                "type": "boolean",
                "value": false
            },

            "Format On Paste": {
                "id": "format_on_paste",
                "description": "Formatting on paste",
                "type": "boolean",
                "value": false
            },

        }          
    },

    "Shortcuts": {
        "Text": {
            "Undo": {
                "id": "shortcut_undo",
                "type": "shortcut",
                "value": "CommandOrControl+Z"
            },
            "Redo": {
                "id": "shortcut_redo",
                "type": "shortcut",
                "value": "CommandOrControl+Y"
            },
            "Cut": {
                "id": "shortcut_cut",
                "type": "shortcut",
                "value": "CommandOrControl+X"
            },
            "Copy": {
                "id": "shortcut_copy",
                "type": "shortcut",
                "value": "CommandOrControl+C"
            },
            "Paste": {
                "id": "shortcut_paste",
                "type": "shortcut",
                "value": "CommandOrControl+V"
            },
            "Find": {
                "id": "shortcut_find",
                "type": "shortcut",
                "value": "CommandOrControl+F"
            },
            "Replace": {
                "id": "shortcut_replace",
                "type": "shortcut",
                "value": "CommandOrControl+H"
            },
        },

        "Window": {
            "Fullscreen": {
                "id": "shortcut_fullscreen",
                "type": "shortcut",
                "value": "F11"
            },
        },

        "Files": {
            "Save": {
                "id": "shortcut_save",
                "type": "shortcut",
                "value": "CommandOrControl+S"
            },
            "Save As": {
                "id": "shortcut_saveas",
                "type": "shortcut",
                "value": "CommandOrControl+Shift+S"
            },
            "Save All": {
                "id": "shortcut_saveall",
                "type": "shortcut",
                "value": "CommandOrControl+S"
            },

            "Close Current File": {
                "id": "shortcut_close_current_file",
                "type": "shortcut",
                "value": "CommandOrControl+W"
            },

            "Open File": {
                "id": "shortcut_open_file",
                "type": "shortcut",
                "value": "CommandOrControl+O"
            },

            "Open Folder": {
                "id": "shortcut_open_folder",
                "type": "shortcut",
                "value": "CommandOrControl+Shift+O"
            },

            "New File": {
                "id": "shortcut_new_file",
                "type": "shortcut",
                "value": "CommandOrControl+N"
            },

            "New Window": {
                "id": "shortcut_new_window",
                "type": "shortcut",
                "value": "CommandOrControl+Shift+N"
            },

            "Open Docs": {
                "id": "shortcut_new_window",
                "type": "shortcut",
                "value": "CommandOrControl+Shift+N"
            },
        }
    }
})


export const configFilePath: string = "EVO"
export const configFileName: string = "settings.json"

export const searchID = (ID: string): [string, string, string] | null => {
    let found = null

    userSettings.subscribe(settings => {
        const categories: string[] = Object.keys(settings)
        for (let category of categories) {
            const sections = Object.keys(settings[category])
            for (let section of sections) {
                const items = Object.keys(settings[category][section])
                for (let item of items) {
                    const currentSetting = settings[category][section][item]
                    if (currentSetting.id === ID) {
                        found = [category, section, item]
                        return
                    }
                }
            }
        }
    })

    return found
}


export const getSettingById = (ID: string): string | boolean | number | null => {
    let value = null

    userSettings.subscribe(settings => {
        const location = searchID(ID)

        if (location) {
            value = settings[location[0]][location[1]][location[2]].value
        }
    })
    return value
}




export const updateUserSettings = async (ID: string, newValue: string | number | boolean): Promise<void> => {
    const text = await readTextFile(configFilePath + "/" + configFileName, { dir: BaseDirectory.AppData })
    const fileSettings = JSON.parse(text)
    const location = searchID(ID)
    if (location) {
        userSettings.update(settings => {
            settings[location[0]][location[1]][location[2]].value = newValue
            return settings
        })

        fileSettings[ID] = newValue
        await writeTextFile(configFilePath + "/" + configFileName, JSON.stringify(fileSettings), { dir: BaseDirectory.AppData })

        if (get(connectedUser) !== null)
            await axiosRequest.post("/update-settings", { settings: fileSettings })
    }
}



export const readUserSettings = async (): Promise<void> => {
    try {
        const text = await readTextFile(configFilePath + "/" + configFileName, { dir: BaseDirectory.AppData })
        const fileSettings = JSON.parse(text)
        userSettings.update(settings => {
            for (let ID in fileSettings) {
                const location = searchID(ID)
                if (location) {
                    settings[location[0]][location[1]][location[2]].value = fileSettings[ID]
                }
            }
            return settings
        })
    } catch (err) {}
}



export const readProjectSettings = async (fileSettings): Promise<void> => {
    try {
        userSettings.update(settings => {
            for (let ID in fileSettings) {
                const location = searchID(ID)
                if (location) {
                    settings[location[0]][location[1]][location[2]].value = fileSettings[ID]
                }
            }
            return settings
        })
    } catch (err) {}
}