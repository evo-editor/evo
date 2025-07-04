<script lang="ts">
    import Folder from "./file-explorer-components/Folder.svelte"
    import { createDir, writeTextFile } from "@tauri-apps/api/fs"

    import { currentPath, projectContent, getFiles, projectName } from "../../stores/files"
    import type { ProjectFile, ProjectFolder } from "../../stores/files"

    import { openFolderDialog } from "../../stores/utils"

    //
    // BUTTON ICONS
    //
    import Icon from "svelte-icons-pack/Icon.svelte"

    import AiFillFileAdd from "svelte-icons-pack/ai/AiFillFileAdd"
    import AiFillFolderAdd from "svelte-icons-pack/ai/AiFillFolderAdd"
    import FiRefreshCw from "svelte-icons-pack/fi/FiRefreshCw"
    import RiDocumentFolderKeyholeLine from "svelte-icons-pack/ri/RiDocumentFolderKeyholeLine"


    let newFileName: string = ""
    let newFolderName: string = ""

    let makeFile: boolean = false
    let makeFolder: boolean = false

    let inputRef: HTMLElement | null = null

    const rootFolder: ProjectFolder = {
        type: "folder",
        isOpen: true,
        path: "",
        name: $projectName ?? "",
        content: []
    }


    //
    // UI STATE
    //

    const toggleFileCreation = (): void => {
        newFileName = ""
        makeFile = true
        makeFolder = false
    }

    const toggleFolderCreation = (): void => {
        newFolderName = ""
        makeFile = false
        makeFolder = true
    }
    

    const createFile = async (): Promise<void> => {
        try { 
            await writeTextFile($currentPath + "\\" + newFileName, '') 
            const file: ProjectFile = {
                type: "file",
                path: $currentPath + "\\" + newFileName,
                filename: newFileName
            }

            $projectContent = [...$projectContent, file]
        }
        catch(err) {

        }

        makeFile = false
    }


    const createFolder = async (): Promise<void> => {
        try { 
            await createDir($currentPath + "\\" + newFolderName) 
            const folder: ProjectFolder = {
                type: "folder",
                isOpen: false,
                path: $currentPath + "\\" + newFolderName,
                name: newFolderName,
                content: []
            }

            $projectContent = [...$projectContent, folder]
        }
        catch(err) {

        }

        makeFolder = false
    }



    const refreshExplorer = async (): Promise<void> => {
        await getFiles()
    }



    const collapseFolders = (): void => {
        const currentFolder = $projectContent

        const collapse = (folderItems: FolderItem[]): void => {
            for (let i = 0; i < folderItems.length; i++) {
                const item = folderItems[i]
                if (item.type === "folder" && item.isOpen) {
                    item.isOpen = false
                    if (item.content) {
                        collapse(item.content)
                    }
                }
            }
        }
        collapse(currentFolder)

        $projectContent = currentFolder
    }








    const clickOutside = (element, callbackFunction) => {
		const onClick = (event) => {
			if (!element.contains(event.target))
				callbackFunction()
	
		}
		
		document.body.addEventListener('click', onClick)
		
		return {
			update(newCallbackFunction) { callbackFunction = newCallbackFunction },
			destroy() { document.body.removeEventListener('click', onClick) }
		}
	}




    $: {
        rootFolder.content = $projectContent
        rootFolder.name = $projectName ?? ""
    }

</script>


<div>
    {#if $projectName}
        <div id="file-explorer-buttons">
            <button title="New File" on:click={toggleFileCreation}>
                <Icon className="sidebar-button-icon" src={AiFillFileAdd} color='white' size=18 />
            </button>
        
            <button title="New Folder" on:click={toggleFolderCreation}>
                <Icon className="sidebar-button-icon" src={AiFillFolderAdd} color='white' size=20 />
            </button>
        
            <button title="Refresh Explorer" on:click={refreshExplorer}>
                <Icon className="sidebar-button-icon" src={FiRefreshCw} color='white' size=18 />
            </button>
        
            <button title="Collapse Folders" on:click={collapseFolders}>
                <Icon className="sidebar-button-icon" src={RiDocumentFolderKeyholeLine} color='white' size=20 />
            </button>
        </div>
    {/if}


    {#if $projectName}
        <Folder folder={rootFolder} />
    {:else}
        <div class="empty">
            <h1>No Folder Opened!</h1>
            <button class="open-folder-button" on:click={openFolderDialog}>Open Folder</button>
        </div>
    {/if}
    

    {#if makeFile}
        <input type="text" class="explorer-input" use:clickOutside={() => { makeFile = false }} bind:this={inputRef} bind:value={newFileName} on:change={() => createFile()}>
    {/if}

    {#if makeFolder}
        <input type="text" class="explorer-input" use:clickOutside={() => { makeFolder = false }} bind:this={inputRef} bind:value={newFolderName} on:change={() => createFolder()}>
    {/if}
</div>


<style>
    #file-explorer-buttons {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 7px;
        margin: 15px;
        margin-top: 5px;
        margin-left: 10px;
    }

    #file-explorer-buttons > button {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .explorer-input {
        background-color: rgba(194, 204, 204, 0.705);
        padding: 2px 10px;
        width: 100%;
    }

    .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .empty > h1 {
        text-align: center;
    }

    .open-folder-button {
        background-color: #00404A;
        padding: 5px 10px;
        margin-top: 5px;
    }
</style>