<script lang="ts">
    import { invoke } from "@tauri-apps/api"
    import { fileIcons } from "../../../stores/icons"
    import { openedFiles, selectedFile } from "../../../stores/files"
    import type { ProjectFile, OpenedFile } from "../../../stores/files"

    import Icon from "svelte-icons-pack/Icon.svelte"
    import AiFillFile from "svelte-icons-pack/ai/AiFillFile"


    export let file: ProjectFile
    const extension: string = file.filename.split(".").pop() || ''



    const openFile = async (item: ProjectFile): Promise<void> => {
        for (let index: number = 0; index < $openedFiles.length; index++) {
            if ($openedFiles[index].path === item.path) {
                $selectedFile = index
                return
            }
        }



        let text: string = ""

        try {
            const bytes: Uint8Array = await invoke("read_binary_file", { path: item.path })

            for (let i = 0; i < bytes.length; i++)
                text += String.fromCharCode(bytes[i])
        }
        catch(err) {}


        const newFileOpened: OpenedFile = {
            changes: false,
            path: item.path,
            filename: item.filename,
            extension: item.filename.split(".").pop() || '',
            text
        }



        $openedFiles = [...$openedFiles, newFileOpened]
        $selectedFile = $openedFiles.length - 1
    }
</script>



<button title={file.path} class="file-item-button" on:click={() => openFile(file)}>
    <Icon 
        src={fileIcons[extension] ? fileIcons[extension].icon : AiFillFile} 
        color={fileIcons[extension] ? fileIcons[extension].color : "white"} 
        size=16 
        className="keep-size" 
    />
    {file.filename}
</button>



<style>

    .file-item-button {
        width: 100%;
        padding: 2px 10px;
        padding-left: 25px;
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
        white-space: nowrap;
    }

    .file-item-button:hover {
        background-color: rgba(194, 204, 204, 0.705);
    }

    :global(.keep-size) {
        flex-shrink: 0;
    }
</style>