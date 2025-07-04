<script lang="ts">
    import SidebarButtons from "./sidebar-components/SidebarButtons.svelte"
    import FileExplorer   from "./sidebar-components/FileExplorer.svelte"
    import Search         from "./sidebar-components/Search.svelte"

    
    import { opened, selectedButton, sidebarButtons, ButtonType, separatorDragging, activityWidth } from "../stores/sidebar"



    const separatorOn = (): void => {
        $separatorDragging = true
    }

    $: if ($activityWidth < 50) {
        $opened = false
        $selectedButton = -1
    }
</script>


<section id="sidebar">
    <SidebarButtons />


    <div id="sidebar-activity" class:hide={!$opened} style="width: {$activityWidth}px">
        {#if $selectedButton > -1 && $selectedButton < $sidebarButtons.length}
            <h4 class="activity-title">{$sidebarButtons[$selectedButton].name}</h4>
        {/if}


        <div class="activity-content">
            {#if $selectedButton === ButtonType.FileExplorer} <FileExplorer /> {/if}
            {#if $selectedButton === ButtonType.Search}       <Search />       {/if}
        </div>
    </div>


    <button 
        id="separator" 
        class:hide={!$opened}
        on:mousedown={separatorOn} 
    ></button>
</section>



<style>
    .hide {
        display: none;
    }

    #sidebar {
        height: 100%;
        max-width: 50%;
        display: flex;
        flex-direction: row;
        background-color: white;
        flex-shrink: 0;
    }


    #separator {
        cursor: e-resize;
        width: 3px;
        height: 100%;
        background-color: #004052;
    }


    #sidebar-activity {
        min-width: 150px;
        background-color: #00212B;
        padding: 10px;
    }

    .activity-title {
        color: grey;
        margin: 10px;
        margin-bottom: 5px;
    }

    
    .activity-content {
        display: flex;
        flex-direction: column;
    }
</style>