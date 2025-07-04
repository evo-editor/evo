<script lang="ts">
    import { updateUserSettings } from "../stores/settings"

    export let value: string = ""
    export let options: { name: string, id: string }[] = []
    export let id: string = "option_input"


    let showOptions: boolean = false
    let searchValue: string = ""


    if (!options.map(e => e.id).includes(value)) {
        value = options[0].id
        updateUserSettings(id, value)
    }



    const toggleOptions = (): void => {
        showOptions = !showOptions
    }

    const focus = (input: HTMLInputElement): void => {
        input.focus()
    }



    const handleKeydown = (event: KeyboardEvent) => {
        if (event.code === "ArrowUp") {
            const ids = options
                .filter(e => e.name.toLowerCase().includes(searchValue.toLowerCase()))
                .sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)) 
                .map(e => e.id)


            const valueIndex = ids.indexOf(value) - 1
            if (valueIndex < 0) return

            value = ids[valueIndex]
            updateUserSettings(id, value)
        }

        if (event.code === "ArrowDown") {
            const ids = options
                .filter(e => e.name.toLowerCase().includes(searchValue.toLowerCase()))
                .sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)) 
                .map(e => e.id)


            const valueIndex = ids.indexOf(value) + 1
            if (valueIndex > ids.length - 1) return

            value = ids[valueIndex]
            updateUserSettings(id, value)
        }


        if (event.code === "Enter") {
            showOptions = false
        }
    }
</script>


<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="input-wrapper" on:keydown={handleKeydown}>
    <button on:click={toggleOptions}>{ options.find(e => e.id === value)?.name || options[0].name }</button>

    {#if showOptions === true}
        <div class="options">
            <input type="text" placeholder="Select" id={id} bind:value={searchValue} use:focus autocomplete="off" />

            {#each 
                options
                    .filter(e => e.name.toLowerCase().includes(searchValue.toLowerCase()))
                    .sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)) 
                as {name, id: localId}
            }
                <button on:click={() => {value = localId; showOptions = false; updateUserSettings(id, value)}} class:selected={value === localId}>
                    {name}
                </button>
            {/each}
        </div>
    {/if}
</div>


<style scoped>

    .input-wrapper {
        position: relative;
    }

    .options {
        display: flex;
        flex-direction: column;
        align-items: start;
        position: fixed;
    }

    .selected {
        background-color: red;
    }
</style>