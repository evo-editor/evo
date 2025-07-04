import { get } from "svelte/store"
import { open } from "@tauri-apps/api/dialog"
import { open as openShell } from "@tauri-apps/api/shell"
import { readTextFile, writeTextFile } from "@tauri-apps/api/fs"

import { terminalOpened } from "./terminal"
import { triggerDialog, triggerModal } from "./modals"
import { defaultPath, currentPath, projectName, getFiles, openedFiles, selectedFile } from "./files"
import type { OpenedFile } from './files'
import beautify from "js-beautify"



import ExtensionModal from "../components/modals/ExtensionModal.svelte"
import SettingsModal  from "../components/modals/SettingsModal.svelte"
import AccountsModal  from "../components/modals/AccountsModal.svelte"
import AboutModal     from "../components/modals/AboutModal.svelte"
import { getSettingById } from "./settings"




export const openExtensions = (): void => {
    triggerModal(ExtensionModal)
}


export const openSettings = (): void => {
    triggerModal(SettingsModal)
}


export const openAccounts = (): void => {
    triggerModal(AccountsModal)
}



export const openAbout = (): void => {
    triggerModal(AboutModal)
}


export const openDocumentation = async (): Promise<void> => {
    await openShell("https://evo-app.dev")
}




export const toggleTerminal = (): void => {
    terminalOpened.set(!get(terminalOpened))
}











export const closeFile = (): void => {
    if (get(selectedFile) === null)
        return

    const file: OpenedFile = get(openedFiles)[get(selectedFile)!]

    if (file.changes === true) {
        triggerDialog("Do you want to save the changes!", "Save", () => { 
            saveFile() 

            
            get(openedFiles).splice(get(selectedFile) || 0, 1)
            openedFiles.set(get(openedFiles))

            if (get(openedFiles).length === 0)
                selectedFile.set(null)
            else
                selectedFile.set(get(openedFiles).length - 1)
        })
    }
}












export const createNewFile = (): void => {
    console.log("new file")
}

export const createWindow = (): void => {
    console.log("new window")
}



export const openFileDialog = async (): Promise<void> => {
    const selected = await open({
        directory: false,
        multiple: true
    })

    if (!Array.isArray(selected)) return


    for (let index: number = 0; index < selected.length; index++) {
        let text: string = ""

        try {
            text = await readTextFile(selected[index])
        }
        catch(err) {

        }

        const openedFile: OpenedFile = {
            changes: false,
            path: selected[index],
            filename: selected[index].split("\\").pop()!,
            extension: selected[index].split(".").pop()!,
            text: text
        }

        openedFiles.set([...get(openedFiles), openedFile])
        selectedFile.set(get(openedFiles).length - 1)
    }
}


export const openFolderDialog = async (): Promise<void> => {
    const selected = await open({
        directory: true,
        multiple: false
    })
      

    if (selected !== null && !Array.isArray(selected)) {
        defaultPath.set(selected)
        currentPath.set(selected)
        projectName.set(selected.split("\\").pop()!)

        openedFiles.set([])
        selectedFile.set(null)
    
        await getFiles()
    }
}


export const saveFile = async (): Promise<void> => {
    if (get(selectedFile) === null)
        return

    const file: OpenedFile = get(openedFiles)[get(selectedFile)!]

    if (file.changes === false)
        return


    let formattedCode = file.text


    if (getSettingById("format_on_save") === true) {
        if (file.extension === "js")
            formattedCode = beautify.js(file.text)

        if (file.extension === "css")
            formattedCode = beautify.css(file.text)

        if (file.extension === "html")
            formattedCode = beautify.html(file.text)
    }




    try {
        await writeTextFile(file.path, formattedCode) 
        file.changes = false
        file.text = formattedCode
        openedFiles.set(get(openedFiles))
    }
    catch(err) {}
}








export const saveAs = async (): Promise<void> => {

}




export const saveAll = async (): Promise<void> => {
    const openedFilesCopy = get(openedFiles)

    for (let index: number = 0; index < openedFilesCopy.length; index++) {
        if (openedFilesCopy[index].changes === true) {

            try {
                await writeTextFile(openedFilesCopy[index].path, openedFilesCopy[index].text) 
                get(openedFiles)[index].changes = false
                openedFiles.set(get(openedFiles))
            }
            catch(err) {}
        }
    }


    openedFiles.set(get(openedFiles))
}
