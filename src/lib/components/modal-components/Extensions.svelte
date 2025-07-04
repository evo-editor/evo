<script lang="ts">
    import { onMount } from "svelte"
    import { connectedUser } from "../../stores/auth"
    import axiosRequest from "../../api/axios"
    import Tabs from "../../ui/Tabs.svelte"



    interface Extension {
        name: string,
        description: string,
        downloads: number
    }

    const tabs: string[] = ["Market", "Installed", "Create"]
    let extensions: Extension[] = []
    let selectedTab: number = 0



    onMount(async () => {
        try {
            const { data } = await axiosRequest.get("/extensions")
            extensions = data
        }
        catch(error) {}
    })

</script>



<Tabs {tabs} bind:selectedTab>
    {#if selectedTab === 0}
        {#if extensions.length == 0}
            <h1>No extensions available!</h1>
        {:else}
            <div class="extensions">
                {#each extensions as { name }}
                    <div class="extension">
                        <span>{name}</span>
                        <button>Install</button>
                    </div>
                {/each}
            </div>
        {/if}
    {/if}

    {#if selectedTab === 1}
        {#if extensions.length == 0}
            <h1>No extensions installed!</h1>
        {:else}
            <div class="extensions">
                {#each extensions as { name }}
                    <div class="extension">
                        <span>{name}</span>
                        <button>Install</button>
                    </div>
                {/each}
            </div>
        {/if}
    {/if}

    {#if selectedTab === 2}
        {#if $connectedUser}
            <form>
                <h1>Create Extension</h1>
                
                <div class="input-wrapper">
                    <label for=""></label>
                    <input type="text">
                </div>

                <button type="submit">Add to market</button>
            </form>
        {:else}
            <h1>You must be connected to create extensions!</h1>
        {/if}
    {/if}
</Tabs>





<style scoped>
    .extensions {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
    }


    .extension {
        background-color: black;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
        padding: 10px 20px;
        border-radius: 10px;
    }
</style>