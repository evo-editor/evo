<script lang="ts">
    import { invoke } from '@tauri-apps/api'
    import { openFolderDialog } from '../../stores/utils'
    import { defaultPath, projectName } from '../../stores/files'

    let value: string = ""
    let results: any[] = []


    const onChange = async (): Promise<void> => {
        results = await invoke("search", { folderPath: $defaultPath, pattern: value })
        results.map(obj => ({ ...obj, show: true }))
    }
</script>


{#if $projectName}
    <div>
        <input type="text" placeholder="Search" bind:value={value} on:change={onChange}>

        {#each results as {filename, lines, show}}
            <div class="search-result">
                <button on:click={() => show = !show}>{filename.split("\\").pop()}</button>

                {#if !show}
                    {#each lines as line}
                        <span class="result-line">{line}</span>
                    {/each}
                {/if}
            </div>
        {/each}
    </div>
{:else}
    <div class="empty">
        <h1>No Folder Opened!</h1>
        <button class="open-folder-button" on:click={openFolderDialog}>Open Folder</button>
    </div>
{/if}
    


<style scoped>
    .search-result {
        display: flex;
        flex-direction: column;
    }

    .result-line {
        flex-shrink: 0;
        white-space: nowrap;
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