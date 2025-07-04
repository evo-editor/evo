import { getSettingById } from "./settings"
import { convertShortcut } from "./shortcuts"
import {
    createNewFile,
    createWindow,
    openFileDialog,
    openFolderDialog,
    saveFile,
    saveAs,
    saveAll,
    openDocumentation,
    openAbout
} from "./utils"




export interface Button {
    type: "button",
    name: string,
    shortcut: null | string,
    click: () => void
}

export interface Separator {
    type: "separator"
}


interface Menu {
    name: string,
    toggle: boolean,
    buttons: (Button | Separator)[]
}











//
// - FILE - 
//
const newFile: Button = {
    type: "button",
    name: "New File",
    shortcut: await convertShortcut(getSettingById("shortcut_new_file")),
    click: createNewFile
}

const newWindow: Button = {
    type: "button",
    name: "New Window",
    shortcut: await convertShortcut(getSettingById("shortcut_new_window")),
    click: createWindow
}

const openFile: Button = {
    type: "button",
    name: "Open File",
    shortcut: await convertShortcut(getSettingById("shortcut_open_file")),
    click: openFileDialog
}

const openFolder: Button = {
    type: "button",
    name: "Open Folder",
    shortcut: await convertShortcut(getSettingById("shortcut_open_folder")),
    click: openFolderDialog
}




const saveButton: Button = {
    type: "button",
    name: "Save",
    shortcut: await convertShortcut(getSettingById("shortcut_save")),
    click: saveFile
}

const saveAsButton: Button = {
    type: "button",
    name: "Save As",
    shortcut: await convertShortcut(getSettingById("shortcut_saveas")),
    click: saveAs
}

const saveAllButton: Button = {
    type: "button",
    name: "Save All",
    shortcut: await convertShortcut(getSettingById("shortcut_saveall")),
    click: saveAll
}














//
// - EDIT - 
//
const undo: Button = {
    type: "button",
    name: "Undo",
    shortcut: await convertShortcut(getSettingById("shortcut_undo")),
    click: createNewFile
}

const redo: Button = {
    type: "button",
    name: "Redo",
    shortcut: await convertShortcut(getSettingById("shortcut_redo")),
    click: createNewFile
}


const cut: Button = {
    type: "button",
    name: "Cut",
    shortcut: await convertShortcut(getSettingById("shortcut_cut")),
    click: createNewFile
}

const copy: Button = {
    type: "button",
    name: "Copy",
    shortcut: await convertShortcut(getSettingById("shortcut_copy")),
    click: createNewFile
}

const paste: Button = {
    type: "button",
    name: "Paste",
    shortcut: await convertShortcut(getSettingById("shortcut_paste")),
    click: createNewFile
}




//
// - VIEW - 
//
const terminal: Button = {
    type: "button",
    name: "Terminal",
    shortcut: await convertShortcut(getSettingById("shortcut_undo")),
    click: createNewFile
}



const explorer: Button = {
    type: "button",
    name: "Explorer",
    shortcut: await convertShortcut(getSettingById("shortcut_undo")),
    click: createNewFile
}


const search: Button = {
    type: "button",
    name: "Search",
    shortcut: await convertShortcut(getSettingById("shortcut_undo")),
    click: createNewFile
}







//
// - HELP - 
//
const docs: Button = {
    type: "button",
    name: "Docs",
    shortcut: await convertShortcut(getSettingById("shortcut_saveall")),
    click: openDocumentation
}

const about: Button = {
    type: "button",
    name: "About",
    shortcut: await convertShortcut(getSettingById("shortcut_saveall")),
    click: openAbout
}






const separator: Separator = {
    type: "separator"
}












export const menuButtons: Menu[] = [
    {
        name: "File",
        toggle: false,
        buttons: [newFile, newWindow, separator, openFile, openFolder, separator, saveButton, saveAsButton, saveAllButton]
    },
    {
        name: "Edit",
        toggle: false,
        buttons: [undo, redo, separator, cut, copy, paste]
    },
    {
        name: "View",
        toggle: false,
        buttons: [terminal, explorer, search]
    },
    {
        name: "Help",
        toggle: false,
        buttons: [docs, about]
    }

]
