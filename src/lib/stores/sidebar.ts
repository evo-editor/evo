import { writable } from "svelte/store"

import Icon from "svelte-icons-pack/Icon.svelte"
import BsFiles from "svelte-icons-pack/bs/BsFiles"
import AiOutlineSearch from "svelte-icons-pack/ai/AiOutlineSearch"
import IoBagAddSharp from "svelte-icons-pack/io/IoBagAddSharp"


export enum ButtonType {
    FileExplorer,
    Search
}


interface sidebarButton {
    type: ButtonType,
    icon: Icon,
    name: string,
    shortcut: string | null,
    hoverTitle: string
}



export const opened            = writable<boolean>(true)
export const selectedButton    = writable<number>(0)
export const separatorDragging = writable<boolean>(false)
export const activityWidth     = writable<number>(200)


export const sidebarButtons = writable<sidebarButton[]>([
    {
        type: ButtonType.FileExplorer,
        icon: BsFiles,
        name: "Files",
        shortcut: "CommandOrControl+Shift+E",
        hoverTitle: "Explorer (Ctrl + Shift + E)",
    },
    {
        type: ButtonType.Search,
        icon: AiOutlineSearch,
        name: "Search",
        shortcut: "CommandOrControl+Shift+F",
        hoverTitle: "Search (Ctrl + Shift + F)"
    }
])
