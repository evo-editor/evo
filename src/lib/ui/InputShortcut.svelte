<script lang="ts">
    import { convertShortcut } from "../stores/shortcuts"

    export let value: string | null = null
    export let id: string = "shortcut_input"

</script>


<button>
    {#if value === null}
        Emtpy
    {:else}
        {#await convertShortcut(value)}
            ...
        {:then result} 
            {result}
        {/await}
    {/if}
</button>


<style scoped>

</style>