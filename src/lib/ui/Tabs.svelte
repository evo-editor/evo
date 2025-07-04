<script lang="ts">
    export let tabs: string[] = []
    export let selectedTab: number = 0


    const changeSelectedTab = (tab: number): void => {
        selectedTab = tab
    }



    const handleKeydown = (event: KeyboardEvent) => {
        if (event.code === "Tab" || event.code === "ArrowRight") {
            selectedTab++
            if (selectedTab >= tabs.length) {
                selectedTab = tabs.length - 1
            }
        }

        if ((event.code === "Tab" && event.shiftKey === true) || event.code === "ArrowLeft") {
            selectedTab--
            if (selectedTab < 0) {
                selectedTab = 0
            }
        }
    }
</script>


<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:keydown={handleKeydown}>
    <div class="tabs">
        {#each tabs as name, index}
            <button 
                class="tab" 
                class:selected-tab={selectedTab === index}
                on:click={() => changeSelectedTab(index)}
            >{name}</button>
        {/each}
    </div>


    <div class="tab-body">
        <slot />
    </div>
</div>


<style scoped>
    .tabs {
        display: flex;
        align-items: center;
        gap: 25px;
    }

    .tab {
        color: var(--tab-color);
        font-size: 16px;
        border-radius: 15px;
        transition: 0.2s;
    }

    .tab:hover:not(.selected-tab) {
        color: var(--tab-hover);
        transition: 0.2s;
    }

    .selected-tab {
        color: var(--selected-tab-color);
    }

    .tab-body {
        margin-top: 10px;
    }
</style>