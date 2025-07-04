<script lang="ts">
    import InputBoolean from "../../ui/InputBoolean.svelte"
    import InputNumber  from "../../ui/InputNumber.svelte"
    import InputOption  from "../../ui/InputOption.svelte"
    import Tabs         from "../../ui/Tabs.svelte"

    import { userSettings } from "../../stores/settings"
    import InputShortcut from "../../ui/InputShortcut.svelte"


    const tabs: string[] = Object.keys($userSettings)
    let selectedTab: number = 0
</script>




<Tabs {tabs} bind:selectedTab>
    {#each Object.keys($userSettings[tabs[selectedTab]]) as sectionName}
        {@const settings = Object.keys($userSettings[tabs[selectedTab]][sectionName])}

        <div class="setting-section">
            <h2>{sectionName}</h2>

            {#each settings as settingName}
                {@const input = $userSettings[tabs[selectedTab]][sectionName][settingName]}
                
                <div class="setting-group">
                    <h4>{settingName}</h4>
                    
                    {#if input.type === "number"}
                        <InputNumber id={input.id} min={input.min} max={input.max} value={input.value} />
                    {/if}

                                
                    {#if input.type === "boolean"}
                        <InputBoolean id={input.id} value={input.value} />
                    {/if}

                                                        
                    {#if input.type === "shortcut"}
                        <InputShortcut id={input.id} value={input.value} />
                    {/if}


                    {#if input.type === "option"}
                        <InputOption id={input.id} value={input.value} options={input.options} />
                    {/if}
                </div>

            {/each}
        </div>
    {/each}
</Tabs>



<style scoped>
    .setting-section {
        margin: 15px auto;
        gap: 10px;
    }


    .setting-group {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
    }
</style>