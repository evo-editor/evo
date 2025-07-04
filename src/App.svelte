<script lang="ts">
    import { onMount } from "svelte"
    import { ToastContainer, FlatToast } from "svelte-toasts"
    import { appWindow } from "@tauri-apps/api/window"
    import { getMatches } from "@tauri-apps/api/cli"
    import { unregisterAll } from "@tauri-apps/api/globalShortcut"
    import { checkUpdate, installUpdate } from "@tauri-apps/api/updater"


    import Titlebar from "./lib/components/Titlebar.svelte"
    import Sidebar  from "./lib/components/Sidebar.svelte"
    import Editor   from "./lib/components/Editor.svelte"

    import Dialog      from "./lib/ui/Dialog.svelte"
    import ContextMenu from "./lib/ui/ContextMenu.svelte"


    import axiosRequest from "./lib/api/axios"
    import { getFiles } from "./lib/stores/files"
    import { connectedUser } from "./lib/stores/auth"
    import { initShortcuts } from "./lib/stores/shortcuts"
    import { readProjectSettings, readUserSettings } from "./lib/stores/settings"
    import { separatorDragging, activityWidth } from "./lib/stores/sidebar"
    import { renderedModal, showDialog, dialogProps } from "./lib/stores/modals"


    

    let showContextMenu: boolean = false
    let contextX: number = 0
    let contextY: number = 0



    
    const separatorMove = (event: MouseEvent): void => {
        if ($separatorDragging) {
            $activityWidth = event.x - 50
        }
    }

    const separatorOff = (): void => {
        $separatorDragging = false
    }




    const changeContextMenu = (event: any, value: boolean): void => {
        event.preventDefault()

        if (value === true) {
            contextX = event.x
            contextY = event.y
        }

        showContextMenu = value
    }






    onMount(async () => {
        // GETTING THE CLI PARAMETERS
        getMatches().then((matches) => {
            console.log(matches)
        })



        // CHECKING FOR NEW UPDATES AND INSTALLING THEM
        // const update = await checkUpdate()
        // if (update.shouldUpdate) {
        //     console.log(`Installing update ${update.manifest?.version}, ${update.manifest?.date}, ${update.manifest.body}`)
        //     await installUpdate()
        // }


        // CHECKING IF THE USER IS CONNECTED AND GETTING THE USER FROM THE DATABASE
        try {
            const { data } = await axiosRequest.get("/user")
            $connectedUser = data.user
        }
        catch(error) {
            $connectedUser = null
        }




        await readUserSettings()
        await getFiles()
        await initShortcuts()


        if ($connectedUser !== null) {
            if ($connectedUser.settings) {
                try {
                    const settings = JSON.parse($connectedUser.settings)
                    readProjectSettings(settings)
                }
                catch(err) {}
            }
        }

        // await appWindow.onFocusChanged(async ({ payload: focused }) => {
        //     focused ? await initShortcuts() : await unregisterAll()
        // })
    })




</script>



<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<main
    class="solarized-dark"
    on:mousemove={separatorMove}
    on:mouseup={separatorOff}
    on:contextmenu={(event) => changeContextMenu(event, true)}
    on:click={(event) => changeContextMenu(event, false)}
>
    <Titlebar />
    <Sidebar />
    <Editor />



    
    {#if $renderedModal}
        <svelte:component this={$renderedModal} />
    {/if}


    {#if $showDialog}
        <Dialog {...dialogProps} />
    {/if}


    {#if showContextMenu}
        <ContextMenu x={contextX} y={contextY} />
    {/if}

    

    <ToastContainer placement="bottom-right" let:data={data}>
        <FlatToast {data} />
    </ToastContainer>
</main>




<style scoped>
    main {
        display: flex;
        flex-direction: row;
        padding-top: 30px;
    }

    :global(.st-toast-description) {
        height: 20px !important;
    }

    :global(.toast-container) {
        overflow: hidden !important;
    }

    :global(.toast-container > ul) {
        padding-top: 50px !important;
    }

    :global(.st-toast-close-btn) {
        fill: white !important;
    }
</style>