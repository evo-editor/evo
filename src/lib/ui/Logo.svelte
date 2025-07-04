<script lang="ts">
    export let text: boolean = false
    export let width: number = 100
    export let margin: number = 0

</script>


<div class="logo" style="margin-inline: {margin}px; max-width: {width}px;"> 
    {#if text}
        <img src="/svg/logo-text.svg" alt="EVO Logo">
    {:else}
        <img src="/svg/logo.svg" alt="EVO Logo">
    {/if}
</div>



<style scoped>
    .logo > img {
        height: auto;
        width: 100%;
    }

    .logo {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
</style>