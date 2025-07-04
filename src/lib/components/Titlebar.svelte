<script lang="ts">
    import { onMount } from "svelte"
    import { appWindow } from "@tauri-apps/api/window"
    import { menuButtons } from "../stores/titblebar"
    import { projectName } from "../stores/files"



    import Logo from "../ui/Logo.svelte"
	import Icon from "svelte-icons-pack/Icon.svelte" 
    import IoClose from "svelte-icons-pack/io/IoClose"
    import AiOutlineRight  from "svelte-icons-pack/ai/AiOutlineRight"
    import FaWindowMinimize from "svelte-icons-pack/fa/FaWindowMinimize"
    import FaWindowMaximize from "svelte-icons-pack/fa/FaWindowMaximize"
    import RiSystemCheckboxMultipleBlankLine from "svelte-icons-pack/ri/RiSystemCheckboxMultipleBlankLine"
    

        






    let titlebarWidth: number = 0
    let projectTitleWidth: number = 0
    let titlebarButtonsWidth: number = 0
    let removedButtonCounter: number = 0

    let buttonWidths = Array(menuButtons.length).fill(null)
    let allButtons: number[] = []



    //
    // - FULLSCREEN TOGGLE -
    //

    let windowMaximized: boolean = false

    onMount(async () => {
        windowMaximized = await appWindow.isMaximized()

        if (buttonWidths.length > 0) {
            allButtons = buttonWidths.map(e => e.offsetWidth + 5)
        }
    })




    let lastClickTime: number = 0
    const doubleClickThreshold: number = 400

    const handleMouseDown = (): void => {
        const now: number = Date.now()

        if (now - lastClickTime <= doubleClickThreshold) {
            toggleMaximization()
        }
        else {
            dragWindow()
        }

        lastClickTime = now
    }



    const dragWindow = async (): Promise<void> => {
        if (windowMaximized)
            windowMaximized = false

        await appWindow.startDragging()
    }

    const toggleMaximization = (): void => {
        appWindow.toggleMaximize()
        windowMaximized = !windowMaximized
    }






    // - SUBMENU TOGGLER-
    let lastIndex: number | null = null
    const openSubmenu = (index: number) => {
        if (menuButtons[index].toggle === true) {
            menuButtons[index].toggle = false
            lastIndex = null
            return
        }

        menuButtons[index].toggle = true

        if (lastIndex !== null)
            menuButtons[lastIndex].toggle = false

        lastIndex = index
    }


    const closeSubmenu = (index: number): void => {
        menuButtons[index].toggle = false
        lastIndex = null
    }










    $: {
        const maxRight: number = (titlebarWidth / 2) - (projectTitleWidth / 2) - 10

        if (titlebarButtonsWidth >= maxRight && allButtons.length > 0) {
            removedButtonCounter++
        }
        else if (allButtons.length > 0) {
            if (titlebarButtonsWidth + allButtons[allButtons.length - removedButtonCounter] < maxRight) {
                removedButtonCounter--
                if (removedButtonCounter < 0) removedButtonCounter = 0
            }
        }
    }

</script>


<nav id="titlebar" bind:clientWidth={titlebarWidth}>
    <div class="menu" bind:clientWidth={titlebarButtonsWidth}>
        <Logo width={20} margin={10} />

        
        {#each menuButtons as {name, buttons, toggle}, index}
            {#if (buttonWidths.length > 0 && index < menuButtons.length - removedButtonCounter) || (buttonWidths.length === 0 && index < menuButtons.length)}
                <div class="dropdown" bind:this={buttonWidths[index]}>
                    <button class="dropdown-button" on:click={() => openSubmenu(index)}>
                        {name}
                    </button>


                    {#if buttons.length > 0}
                        <div class="dropdown-content" on:click={() => closeSubmenu(index)} role="none">
                            {#each buttons as item}
                                {#if item.type === "separator"}
                                    <div class="separator"></div>
                                {:else}
                                    <button class="submenu-button" on:click={item.click}>
                                        <span>{item.name}</span>
                                        <span>{item.shortcut}</span>
                                    </button>
                                {/if}
                            {/each}
                        </div>
                    {/if}
                </div>
            {/if}
        {/each}

        

        {#if removedButtonCounter > 0}

        <div class="dropdown">
            <button class="dropdown-button" on:click={() => openSubmenu(index)}>
                ···
            </button>


            <div class="dropdown-content">
                {#each menuButtons as {name, buttons, toggle}, index}
                    {#if (buttonWidths.length > 0 && index >= menuButtons.length - removedButtonCounter) || (buttonWidths.length === 0 && index > menuButtons.length)}
                        <button class="submenu-button">{name} <Icon src={AiOutlineRight} color="white" size=14 /></button>    
                    {/if}
                {/each}
            </div>
        </div>
        {/if}
    </div>



    <button class="project-title" on:mousedown={handleMouseDown}>
        <span bind:clientWidth={projectTitleWidth}>{$projectName ?? "EVO"}</span>
    </button>



    <div class="window-buttons">
        <button class="window-button" on:click={appWindow.minimize}>
            <Icon src={FaWindowMinimize} color="white" size=10 />
        </button>

        <button class="window-button" on:click={toggleMaximization}>
            {#if windowMaximized}
                <Icon src={RiSystemCheckboxMultipleBlankLine} color="white" size=14 />
            {:else}
                <Icon src={FaWindowMaximize} color="white" size=12 />
            {/if}
        </button>

        <button class="window-button close-button" on:click={appWindow.close}>
            <Icon src={IoClose} color="white" size=20 />
        </button>
    </div>
</nav>


<style scoped>
    #titlebar {
        height: 30px;
        position: fixed;
        z-index: 100000;
        top: 0;
        left: 0;
        width: 100vw;
        display: flex;
        justify-content: space-between;
        align-items: center;


        border-width: var(--titlebar-border-width);
        border-color: var(--titlebar-button-color);
        background-color: var(--titlebar-background);
    }


    .window-buttons {
        display: flex;
        justify-content: flex-end;
        flex-shrink: 0;
    }

    .window-button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 45px;
        height: 30px;
        cursor: default;
    }

    .window-button:hover {
        background-color: var(--title-button-hover);
    }

    .close-button:hover {
        background-color: var(--close-hover);
    }


    .project-title {
        background-color: var(--titlebar-background);
        position: absolute;
        width: 100vw;
        z-index: -1;
        font-size: 15px;
        flex-shrink: 0;
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: default;
        letter-spacing: 1.05px;
    }


    .menu {
        display: flex;
        align-items: center;
        gap: 2px;
    }


    .dropdown {
        position: relative;
        display: inline-block;
        flex-shrink: 0;
    }

    .dropdown-button {
        flex-shrink: 0;
        padding: 1px 8px;
        cursor: default;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .dropdown-button:hover {
        background-color: var(--title-button-hover);
    }


    .dropdown-content {
        background-color: var(--titlebar-background);
        padding: 5px;
        border-radius: 5px;
        display: none;
        position: fixed;
        z-index: 100;
    }



    .dropdown:hover .dropdown-content {
        display: block;
    }


    .submenu-button {
        display: flex;
        justify-content: space-between;
        gap: 25px;
        border-radius: 3px;
        padding: 2px 10px;
        margin: 5px auto;
        width: 100%;
    }

    .submenu-button:hover {
        background-color: var(--title-button-hover);
    }


    .separator {
        height: 2px !important;
        background-color: white;
        margin-top: 1.5px;
        margin-bottom: 1.5px;
    }
</style>