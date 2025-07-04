<script lang="ts">
    import { onMount } from "svelte"
    import { tooltip } from "@svelte-plugins/tooltips"
    import { register, unregisterAll } from "@tauri-apps/api/globalShortcut"
    import { SortableList } from "@jhubbardsf/svelte-sortablejs"


	import Icon from "svelte-icons-pack/Icon.svelte"
    import RiSystemShieldUserLine from "svelte-icons-pack/ri/RiSystemShieldUserLine"
    import IoSettingsOutline from "svelte-icons-pack/io/IoSettingsOutline"
    import IoBagAddSharp from "svelte-icons-pack/io/IoBagAddSharp"

    import { opened, selectedButton, sidebarButtons } from "../../stores/sidebar"
    import { openExtensions, openAccounts, openSettings } from "../../stores/utils"


    const changeSelectedButton = (buttonNumber: number): void => {
        if ($selectedButton === buttonNumber) {
            $opened = !$opened
            $selectedButton = -1
            return
        }

        $selectedButton = buttonNumber
        $opened = true
    }

</script>




<div id="sidebar-buttons">
    <SortableList class="button-list list-group col" animation={150} ghostClass="bg-info">
        {#each $sidebarButtons as {icon, hoverTitle}, index}
            <button 
                title={hoverTitle} 
                class:selected-button={index === $selectedButton}  
                class:top-rounded={$selectedButton === index - 1 && $selectedButton >= 0}
                class:bottom-rounded={$selectedButton === index + 1 && $selectedButton >= 0}  
                on:click={() => changeSelectedButton(index)}
                class="list-group-item"
            >
                <Icon 
                    className="sidebar-button-icon" 
                    src={icon} 
                    color={index === $selectedButton ? 'var(--sidebar-button-selected)' : 'var(--sidebar-button-color)'} 
                    size=26 
                />
            </button>
        {/each}
    </SortableList>



    <div class="filler" class:top-rounded={$selectedButton === $sidebarButtons.length - 1}></div>



    <button
        title="Extensions"   
        class="bottom-button"
        on:click={openExtensions}
    >
        <Icon 
            className="sidebar-button-icon" 
            src={IoBagAddSharp} 
            color="white" 
            size=26 
        />
    </button>


    <button
        on:click={openAccounts}
    >
        <Icon 
            className="sidebar-button-icon" 
            src={RiSystemShieldUserLine} 
            color="white" 
            size=26 
        />
    </button>


    <button
        title="Settings"
        on:click={openSettings}
    >
        <Icon 
            className="sidebar-button-icon" 
            src={IoSettingsOutline} 
            color="white"
            size=26 
        />
    </button>
</div>



<style>
    :global(button > .sidebar-button-icon) {
        transition: 0.1s;
    }

    :global(button:hover > .sidebar-button-icon) {
        fill: var(--sidebar-button-hover) !important;
        stroke: var(--sidebar-button-hover) !important;
        transition: 0.1s;
    }


    .top-rounded {
        border-top-right-radius: 10px;
    }
    
    .bottom-rounded {
        border-bottom-right-radius: 10px;
    }


    #sidebar-buttons, :global(.button-list) {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        background-color: #00212B;
    }

    #sidebar-buttons > button, :global(.button-list > button) {
        width: 50px;
        height: 50px;    
        background-color: var(--sidebar-background);
        border: 2px solid transparent;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .bottom-button {
        margin-top: auto;
    }

    .selected-button {
        border-left: 2px solid var(--sidebar-button-selected) !important; 
        background-color: transparent !important;
    }

    .filler {
        flex-grow: 1;
        background-color: var(--sidebar-background);
    }
</style>