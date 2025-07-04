<script lang="ts">
    import { connectedUser } from "../../stores/auth"

    import Modal from "../../ui/Modal.svelte"
    import Auth from "../modal-components/Auth.svelte"
    import UserAccount from "../modal-components/UserAccount.svelte"
</script>



<Modal title="Account">
    {#if $connectedUser === null}
        <Auth />
    {:else}
        <UserAccount />
    {/if}
</Modal>