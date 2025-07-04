<script lang="ts">
    import { closeDialog } from "../stores/modals"


    export let statement: string = "Dialog"
    
    export let continueButton: string = "Save"
    export let onClickButton = () => {}

    export let secondButton: string | null = "Don't save"
    export let secondButtonClick = () => {}
</script>



<div class="dialog-backdrop">
    <div class="dialog-transition">
        <div class="dialog">
            <div class="dialog-titlebar">
                {statement}
            </div>

            <div class="dialog-buttons">
                <button on:click={() => { onClickButton(); closeDialog() }}>{continueButton}</button>

                {#if secondButton}
                    <button on:click={() => { secondButtonClick(); closeDialog() }}>{secondButton}</button>
                {/if}

                <button on:click={closeDialog}>Cancel</button>
            </div>
        </div>
    </div>
</div>



<style scoped>
    .dialog-backdrop {
        background-color: rgba(0, 0, 0, 0.4);
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow-y: auto;
        z-index: 101;
    }

    .dialog-transition {
        width: 100%;
        min-height: 100%;
        height: fit-content;
        overflow-y: auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .dialog {
        position: absolute;
        min-width: 230px;
        min-height: 100px;
        height: auto;
        padding: 10px 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 14px;
        border-radius: 10px;
        background-color: var(--modal-background);
        /* box-shadow: 0 4px 16px 0 var(--modal-background); */
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    }


    .dialog-buttons {
        display: flex;
        align-items: center;
        justify-content: space-around;
        gap: 10px;
        margin: 0 5px;
    }


    .dialog-buttons > button {
        background-color: gray;
        border: 2px solid black;
        border-radius: 8px;
        padding: 4px 15px;
        width: auto;
    }

    .dialog-titlebar {
        text-align: center;
        font-weight: 600px;
        font-size: 18px;
    }
</style>