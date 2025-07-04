<script lang="ts">
    import { closeModal }   from "../stores/modals"
    import { showDialog }   from "../stores/modals"
    import { clickOutside } from "../stores/click"


    import Icon    from "svelte-icons-pack/Icon.svelte"
    import IoClose from "svelte-icons-pack/io/IoClose"

    export let title: string = "Modal"
    export let fitContent: boolean = false
</script>



<div class="modal-backdrop">
    <div class="modal-transition">
        <div class="modal" class:fit-content={fitContent} use:clickOutside on:click_outside={!$showDialog ? closeModal : () => {}}>
            <div class="modal-titlebar">
                <h1 class="modal-title">{title}</h1>

                <button class="modal-close" on:click={!$showDialog ? closeModal : () => {}}>
                    <Icon src={IoClose} color='var(--modal-close)' size=24 />
                </button>
            </div>

            <hr class="modal-hr">
        
            <div class="modal-content" class:margin-content={fitContent}>
                <slot />
            </div>
        </div>
    </div>
</div>



<style scoped>
    .fit-content {
        width: auto !important;
        height: auto !important;
    }

    .margin-content {
        margin: 20px 50px;
    }


    @media screen and (max-width: 520px) {
        .modal {
            padding: 10px !important;
        }
    }

    .modal-backdrop {
        background-color: rgba(0, 0, 0, 0.4);
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow-y: auto;
        z-index: 100;
    }


    .modal-transition {
        width: 100%;
        min-height: 100%;
        height: fit-content;
        overflow-y: auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal {
        position: absolute;
        width: 60%;
        height: 60%;
        padding: 15px 25px;
        border-radius: 10px;
        background-color: var(--modal-background);
        /* box-shadow: 0 4px 16px 0 var(--modal-background); */
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    }

    .modal-titlebar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        padding: 10px;
    }

    .modal-title {
        font-size: 28px;
        color: var(--modal-title);
    }

    .modal-close {
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.2s;
    }

    :global(.modal-close:hover > *) {
        fill: rgb(196, 196, 196) !important;
        stroke: rgb(196, 196, 196) !important;
        transition: 0.1s;
    }


    .modal-hr {
        border-color: var(--modal-hr);
        background-color: var(--modal-hr);
        height: 3px;
    }


    .modal-content {
        padding: 10px;
    }




</style>