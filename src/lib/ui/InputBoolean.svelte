<script lang="ts">
    import { updateUserSettings } from "../stores/settings"

    export let value: boolean = false
    export let id: string = "boolean_input"



    const onClick = (): void => {
        value = !value
        updateUserSettings(id, value)
    }
</script>



<div class="input-wrapper">
    <button id={id} on:click={onClick} class:active={value}>
        <span class="toggle-knob"></span>
    </button>
</div>



<style scoped>
    .input-wrapper button {
        outline: none;
        display: block;
        width: 35px;
        height: 20px;
        position: relative;
        cursor: pointer;
        background: grey;
        border-radius: 2em;
        border: 2px solid #e8eae9;
        transition: all 0.4s ease;
        padding: 2px;
    }

    .input-wrapper button span.toggle-knob {
        content: "";
        display: block;
        width: 50%;
        height: 100%;
        border-radius: 2em;
        background: white;
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        transform: translateX(0);
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 4px 0 rgba(0, 0, 0, 0.08);
    }

    .input-wrapper button.active span.toggle-knob {
        transform: translateX(13px); 
    }

    .input-wrapper button:hover span.toggle-knob {
        will-change: transform;
    }

    .input-wrapper button:active {
        box-shadow: inset 0 0 0 2em #e8eae9;
    }

    .input-wrapper button.active {
        background: var(--modal-background);
    }
</style>