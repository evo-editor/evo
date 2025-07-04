<script lang="ts">
    import beautify from "js-beautify"
    import CodeMirror from "svelte-codemirror-editor"
    import { writeTextFile } from "@tauri-apps/api/fs"
    import type OpenedFile from "../stores/files"

    import { html } from "@codemirror/lang-html"
    import { css } from "@codemirror/lang-css"
    import { javascript } from "@codemirror/lang-javascript"
    import { json } from "@codemirror/lang-json"
    import { php } from "@codemirror/lang-php"
    import { java } from "@codemirror/lang-java"
    import { rust } from "@codemirror/lang-rust"
    import { python } from "@codemirror/lang-python"
    import { cpp } from "@codemirror/lang-cpp"
    import { xml } from "@codemirror/lang-xml"
    import { markdown } from "@codemirror/lang-markdown"

    import { oneDark } from "@codemirror/theme-one-dark"
    import { materialLight } from '@ddietr/codemirror-themes/material-light'
    import { materialDark } from '@ddietr/codemirror-themes/material-dark'
    import { solarizedLight } from '@ddietr/codemirror-themes/solarized-light'
    import { solarizedDark } from '@ddietr/codemirror-themes/solarized-dark'
    import { dracula } from '@ddietr/codemirror-themes/dracula'
    import { githubLight } from '@ddietr/codemirror-themes/github-light'
    import { githubDark } from '@ddietr/codemirror-themes/github-dark'
    import { aura } from '@ddietr/codemirror-themes/aura'
    import { tokyoNight } from '@ddietr/codemirror-themes/tokyo-night'
    import { tokyoNightDay } from '@ddietr/codemirror-themes/tokyo-night-day'
    import { tokyoNightStorm } from '@ddietr/codemirror-themes/tokyo-night-storm'

    import Icon from "svelte-icons-pack/Icon.svelte"
    import FiFile from "svelte-icons-pack/fi/FiFile"
    import IoClose from "svelte-icons-pack/io/IoClose"
    import AiFillFile from "svelte-icons-pack/ai/AiFillFile"


    import { fileIcons } from "../stores/icons"
    import { triggerDialog } from "../stores/modals"
    import { getSettingById } from "../stores/settings"
    import { terminalOpened } from "../stores/terminal"
    import { openedFiles, selectedFile } from "../stores/files"
    import { userSettings } from "../stores/settings"

    import Terminal from "./editor-components/Terminal.svelte"
    import AudioPlayer from "../ui/AudioPlayer.svelte"
    import VideoPlayer from "../ui/VideoPlayer.svelte"
    import ImagePreview from "../ui/ImagePreview.svelte"
    import axios from "axios"



    let fileExtension: string = "js"
    const languages = {
        "js": javascript(),
        "ts": javascript(),
        "html": html(),
        "css": css(),
        "json": json(),
        "java": java(),
        "php": php(),
        "cpp": cpp(),
        "rs": rust(),
        "xml": xml(),
        "py": python(),
        "md": markdown()
    }


    const themes = {
        "one-dark": oneDark,
        "material-light": materialLight,
        "material-dark": materialDark,
        "solarized-light": solarizedLight,
        "solarized-dark": solarizedDark,
        "dracula": dracula,
        "github-light": githubLight,
        "github-dark": githubDark,
        "aura": aura,
        "tokyo-night": tokyoNight,
        "tokyo-night-day": tokyoNightDay,
        "tokyo-night-storm": tokyoNightStorm
    }


    $: selectedTheme = $userSettings && getSettingById("editor_theme")
    $: tabSize = $userSettings && getSettingById("tab_size")
    $: fontSize = $userSettings && getSettingById("font_size")
    $: {
        const cursorWidth = $userSettings && getSettingById("cursor_width")
        document.documentElement.style.setProperty("--cursor-width", cursorWidth + "px")
    }






    const changeSelectedFile = (fileIndex: number): void => {
        $selectedFile = fileIndex
    }




    const saveFileIndex = async (fileIndex: number): Promise<void> => {
        if ($selectedFile === null)
            return

        const file: OpenedFile = $openedFiles[fileIndex]

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
            $openedFiles = $openedFiles
        }
        catch(err) {
            console.log(err)
        }
    }



    const closeFileIndex = (fileIndex: number): void => {
        $openedFiles.splice(fileIndex, 1)
        $openedFiles = $openedFiles

        if ($openedFiles.length === 0)
            $selectedFile = null
        else
            $selectedFile = $openedFiles.length - 1
    }


    const closeFile = (fileIndex: number): void => {
        if ($openedFiles[fileIndex].changes === true)
            triggerDialog("Do you want to save the changes?", "Save", () => {
                    saveFileIndex(fileIndex)
                    closeFileIndex(fileIndex)
                },
                "Don't save",
                () => closeFileIndex(fileIndex)
            )
        else
            closeFileIndex(fileIndex)
    }



    const fileContentChanged = (): void => {
        if ($selectedFile !== null) {
            $openedFiles[$selectedFile].changes = true
        }
    }



    let isMouseOver: boolean = false
    const showClose = (value: boolean) => {
        isMouseOver = value
    }


    const runCode = async (): Promise<void> => {
        if ($selectedFile === null) return



        const options = {
            method: 'POST',
            url: 'https://onecompiler-apis.p.rapidapi.com/api/v1/run',
            headers: {
                'x-rapidapi-key': '2b242f59dfmsh33da668fad06e7cp180b99jsn4c0cd8777b70',
                'x-rapidapi-host': 'onecompiler-apis.p.rapidapi.com',
                'Content-Type': 'application/json'
            },

            data: {
                language: 'python',
                stdin: 'Peter',
                files: [
                {
                    name: 'index.py',
                    content: $openedFiles[$selectedFile].text
                }
                ]
            }
        }



	    const { data: codeOutput } = await axios.request(options)
        console.log(codeOutput)
    }




    $: {
        if ($selectedFile !== null)
            fileExtension = $openedFiles[$selectedFile].extension
    }



    const convertBase64 = (data: string, type: string): string => "data:" + type + ";base64," + window.btoa(data)

</script>


<section id="editor">
    <div id="opened-files">
        {#each $openedFiles as {path, filename, extension, changes}, index}
            <button 
                title={path} 
                class:selected-file={index === $selectedFile} 
                on:click={() => changeSelectedFile(index)}
                on:auxclick={() => closeFile(index)}    
            >

                <Icon 
                    src={fileIcons[extension] ? fileIcons[extension].icon : AiFillFile} 
                    color={fileIcons[extension] ? fileIcons[extension].color : "white"} 
                    size=18
                    className="keep-size" 
                />

                <span>{filename}</span>

                <button 
                    class="close-file-button" 
                    title="Close (Ctrl + F4)" 
                    on:click={() => closeFile(index)}
                    on:mouseenter={() => showClose(true)}
                    on:mouseleave={() => showClose(false)}
                >
                    {#if !changes || isMouseOver}
                        <Icon src={IoClose} color='white' size=20 />
                    {:else}
                        <div class="unsaved-file-marker-wrapper">
                            <div class="unsaved-file-marker"></div>
                        </div>
                    {/if}
                </button>
            </button>
        {/each}

        {#if fileExtension === "py"}
            <button class="run-code-button" on:click={runCode}>Run</button>
        {/if}
    </div>


    {#if $selectedFile === null}
        <div class="no-file-menu">
            <Icon src={FiFile} color='white' size=50 />
            <h3>No file selected</h3>
        </div>
    {:else}
        {#if fileExtension === "mp3"}
            <AudioPlayer src={convertBase64($openedFiles[$selectedFile].text, "audio/mpeg")} type="audio/mp3" file={$openedFiles[$selectedFile].filename} />
        {:else if fileExtension === "mp4"}
            <VideoPlayer src={convertBase64($openedFiles[$selectedFile].text, "video/mp4")} />
        {:else if fileExtension === "png"}
            <ImagePreview src={convertBase64($openedFiles[$selectedFile].text, "image/png")} />
        {:else if fileExtension === "jpg"}
            <ImagePreview src={convertBase64($openedFiles[$selectedFile].text, "image/jpg")} />
        {:else if fileExtension === "jpeg"}
            <ImagePreview src={convertBase64($openedFiles[$selectedFile].text, "image/jpeg")} />
        {:else if fileExtension === "gif"}
            <ImagePreview src={convertBase64($openedFiles[$selectedFile].text, "image/gif")} />
        {:else}
            <CodeMirror 
                bind:value={$openedFiles[$selectedFile].text} 
                lang={languages[fileExtension]} 
                theme={themes[selectedTheme]}
                on:change={fileContentChanged}
                tabSize={tabSize}
            />
        {/if}
    {/if}

    
    {#if $terminalOpened}
        <Terminal />
    {/if}
</section>




<style>
    :global(.cm-line *, .cm-line, .cm-gutterElement) {
        font-family: 'MonoLisa', monospace !important;
    }

    :global(.codemirror-wrapper, .cm-editor) {
        height: 100%;
    }

    :global(.c1, .cm-layer) {
        position: unset !important;
    }

    :global(.ͼ1 .cm-cursor, .ͼ1 .cm-dropCursor) {
        border-left-width: var(--cursor-width);
    }


    .run-code-button {
        margin-left: auto;
    }


    #editor {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        background-color: #002B36;
    }

    #opened-files {
        height: 40px;
        display: flex;
        flex-shrink: 0;
        overflow-x: auto;
        background-color: #004052;
    }

    #opened-files > button {
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
        background-color: #002B37;
        border: 2.5px solid #002B37;
        padding: 0 7px;

    }




    .unsaved-file-marker-wrapper {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .unsaved-file-marker {
        background-color: white;
        width: 9px;
        height: 9px;
        border-radius: 9px;
    }

    .selected-file {
        border-bottom: 2px solid rgb(217, 255, 0) !important;
    }

    .close-file-button {
        width: 20px !important;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.2s;
    }

    .close-file-button:hover {
        background-color: #3131b3;
        transition: 0.2s;
    }

    .no-file-menu {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 15px;
    }
</style>