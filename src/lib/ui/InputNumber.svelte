<script lang="ts">
    import { updateUserSettings } from "../stores/settings"

    import Icon    from "svelte-icons-pack/Icon.svelte"
    import TiPlus  from "svelte-icons-pack/ti/TiPlus"
    import TiMinus from "svelte-icons-pack/ti/TiMinus"

     
    export let min: number = 1
    export let max: number = 10
    export let value: number = 1
    export let step: number = 1
    export let id: string = "number_input"

    let inputElement: HTMLInputElement


    const onChange = (): void => {
        if (value > max)
            value = max

        if (value < min)
            value = min

        inputElement.blur()
        updateUserSettings(id, value)
    }


    const decrement = (): void => {
        if (value - step >= min)
            value -= step

        updateUserSettings(id, value)
    }

    
    const increment = (): void => {
        if (value + step <= max)
            value += step

        updateUserSettings(id, value)
    }
</script>



<div class="input-wrapper">
    <button on:click={decrement} disabled={value === min}>
        <Icon src={TiMinus} color={value === min ? "grey" : "white"} size=16 />
    </button>

    <input type="number" name={id} id={id} bind:value={value} bind:this={inputElement} on:change={onChange} />

    <button on:click={increment} disabled={value === max}>
        <Icon src={TiPlus} color={value === max ? "grey" : "white"} size=16 />
    </button>
</div>



<style scoped>
    .input-wrapper {
        display: flex;
        align-items: center;
        background-color: black;
    }

    input {
        width: 50px;
        text-align: center;
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }


    button {
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.2s;
    }

    button:disabled {
        background: transparent !important;
    }

    button:hover {
        background-color: grey;
        transition: 0.2s;
    }
</style>