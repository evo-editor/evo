<script lang="ts">
    export let src: string = ""
</script>



<div class="player-wrapper">
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img src={src} alt="Image" />
</div>




<style scoped>
    .player-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>