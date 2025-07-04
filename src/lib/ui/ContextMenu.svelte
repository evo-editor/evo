<script lang="ts">

    export let x: number = 100
    export let y: number = 0


</script>


<div class="context-menu" style="top: {y}px; left: {x}px">

    test
</div>


<style scoped>
    .context-menu {
        z-index: 100;
        position: fixed;
        background-color: blue;
        padding: 10px;
        border-radius: 5px;
    }
</style>