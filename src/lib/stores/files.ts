import { writable, get } from "svelte/store"
import { readDir, readTextFile, type FileEntry } from "@tauri-apps/api/fs"
import { readProjectSettings } from "./settings"




export interface ProjectFile {
    type: "file",
    path: string,
    filename: string
}

export interface ProjectFolder {
    type: "folder",
    isOpen: boolean,
    path: string,
    name: string,
    content: (ProjectFile | ProjectFolder)[]
}


export interface OpenedFile {
    path: string,
    filename: string,
    extension: string,
    text: string,
    changes: boolean
}




export const defaultPath = writable<string | null>(null)
export const currentPath = writable<string | null>(null)

export const projectName = writable<string | null>(null)
export const selectedFile = writable<number | null>(null)

export const projectContent = writable<(ProjectFile | ProjectFolder)[]>([])
export const openedFiles = writable<OpenedFile[]>([])




const processEntries = async (entries: FileEntry[]): Promise<(ProjectFile | ProjectFolder)[]> => {
    const arr: (ProjectFile | ProjectFolder)[] = []


    for (let i = 0; i < entries.length; i++) {
        if (entries[i].children) {
            const folder: ProjectFolder = {
                type: "folder",
                isOpen: false,
                path: entries[i].path,
                name: entries[i].name!,
                content: []
            }

            arr.push(folder)
        }

        else {
            const file: ProjectFile = {
                type: "file",
                path: entries[i].path,
                filename: entries[i].name!
            }

            arr.push(file)
        }
    }

    return arr
}



export const getFiles = async (): Promise<void> => {
    if (!get(defaultPath)) return


    let entries: FileEntry[] = await readDir(get(defaultPath)!)
    let arr: (ProjectFile | ProjectFolder)[] = await processEntries(entries)

    projectContent.set(arr)





    // CHECKING FOR EXISTENCE OF .EVO FOLDER AND SETTINGS FILE
    for (let index: number = 0; index < arr.length; index++) {
        if (arr[index].type === "folder")  {
            if (arr[index].name === ".evo") {
                arr[index].content = await readDir(arr[index].path)


                const fileContent: FileEntry[] = arr[index].content.filter((e: ProjectFile | ProjectFolder) => e.type !== "file")
                const settingsIndex: number = fileContent.map((e: FileEntry) => e.name).indexOf("settings.json")
                
                if (settingsIndex > -1) {
                    let text: string = ""

                    try {
                        text = await readTextFile(fileContent[settingsIndex].path)
                        const result = JSON.parse(text)

                        readProjectSettings(result)
                    }
                    catch(err) {}
                }

            }
        }
    }


    let areFolders: boolean = true
    while (areFolders) {
        areFolders = false
        let test: (ProjectFile | ProjectFolder)[] = []


        for (let i: number = 0; i < arr.length; i++) {
            if (arr[i].type === "folder") {
                areFolders = true
                entries = await readDir(arr[i].path)
                
                if ("content" in arr[i])
                    arr[i].content = await processEntries(entries)

                test = [...test, ...arr[i].content]
            }
        }

        arr = test
    }
}