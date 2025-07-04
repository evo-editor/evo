import { type } from "@tauri-apps/api/os"
import { register, unregisterAll } from "@tauri-apps/api/globalShortcut"
import { 
    openExtensions, 
    openSettings, 
    openAccounts, 
    toggleTerminal,
    saveFile,
    saveAs,
    saveAll,
    closeFile,
    openFileDialog,
    openFolderDialog,
    createNewFile,
    createWindow
} from "./utils"
import { getSettingById } from "./settings"




export const convertShortcut = async (shortcut: string | null): Promise<string> => {
    if (shortcut === null)
        return ""

    const osType = await type()
    let result = ""

    if (osType === "Darwin") {
        if (shortcut.includes("Command")) {
            result = shortcut.replace("Command", "Cmd").replace("OrControl", "").split("+").join(" + ")
        }
    }
    else {
        if (shortcut.includes("Control")) {
            result = shortcut.replace("Control", "Ctrl").replace("CommandOr", "").split("+").join(" + ")
        }
    }

    return result
}




export const isValidShortcut = (shortcut: string | null): boolean => {
    if (shortcut === null) return false

    return true
}





export const initShortcuts = async (): Promise<void> => {
    await unregisterAll()

    let shortcut = ""


    
    await register('CommandOrControl+Alt+X', openExtensions)
    await register('CommandOrControl+Alt+S', openSettings)
    await register('CommandOrControl+Alt+A', openAccounts)
    await register('CommandOrControl+`', toggleTerminal)



    

    shortcut = getSettingById("shortcut_new_file")
    if (shortcut !== null)
        await register(shortcut, createNewFile)


    shortcut = getSettingById("shortcut_new_window")
    if (shortcut !== null)
        await register(shortcut, createWindow)








    shortcut = getSettingById("shortcut_open_file")
    if (shortcut !== null)
        await register(shortcut, openFileDialog)


    shortcut = getSettingById("shortcut_open_folder")
    if (shortcut !== null)
        await register(shortcut, openFolderDialog)





    shortcut = getSettingById("shortcut_close_current_file")
    if (shortcut !== null)
        await register(shortcut, closeFile)


    shortcut = getSettingById("shortcut_save")
    if (shortcut !== null)
        await register(shortcut, saveFile)



    await register('CommandOrControl+Shift+S', saveAs)
    await register('CommandOrControl+K', saveAll)

}