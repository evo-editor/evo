<script lang="ts">
    import Icon from "svelte-icons-pack/Icon.svelte"
    import IoPlay from "svelte-icons-pack/io/IoPlay"
    import IoPauseSharp from "svelte-icons-pack/io/IoPauseSharp"
    import BsVolumeMute from "svelte-icons-pack/bs/BsVolumeMute"
    import BsVolumeDown from "svelte-icons-pack/bs/BsVolumeDown"
    import BsVolumeUp from "svelte-icons-pack/bs/BsVolumeUp"


    export let src: string = ""
    export let type: string = ""
    export let file: string = ""


    let audio: HTMLAudioElement
    let paused: boolean = true
    let volume: number = 50
    let artist: string = ""
    let lastVolume: number = 0



    const changeVolume = (): void => {
        if (volume > 100) volume = 100
        if (volume < 0) volume = 0

        audio.volume = volume / 100
    }


    const toggleMute = (): void => {
        if (volume === 0) {
            volume = lastVolume
        }
        else {
            lastVolume = volume
            volume = 0
        }
    }


</script>



<div class="player-wrapper">
    <div class="music-player">
        <div class="cover">
        </div>


        <div class="title">
            <h3>{artist}</h3>
            <h1>{file.split(".")[0]}</h1>
        </div>

        <button on:click={() => paused = !paused}>
            <Icon src={!paused ? IoPauseSharp : IoPlay} color="white" size=50 />
        </button>


        <div class="volume-wrapper">
            <button on:click={toggleMute}>
                <Icon src={volume === 0 ? BsVolumeMute : (volume > 0 && volume < 50) ? BsVolumeDown : BsVolumeUp} color="white" size=24 />
            </button>

            <input type="range" min="0" max="100" bind:value={volume} on:input={changeVolume}>
        </div>

        <div class="audio-wrapper">
            <audio style="width: 100%;" class="fc-media" bind:this={audio} bind:paused>
                <source src={src} type={type}/>
            </audio>
        </div>
    </div>
</div>




<style scoped>
    h1 {
        margin: 0;
        font-size: 33px;
        color: #fff;
        padding: 0 10%;
    }

    h3 {
        margin: 0;
        font-size: 17px;
        font-weight: 500;
        color: #ccc;
        padding: 0 10%;
    }

    .music-player {
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: 400px;
        height: 570px;
        border-radius: 10px;
        background: transparent linear-gradient(to bottom,rgba(10,11,31,0.9) 50%,rgb(10,11,31) 70%) repeat scroll 0 0;
        box-shadow: 1px 10px 20px 5px #222;
    }


    .volume-wrapper {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 10px;
    }

    button {
        margin-top: auto;
    }

    input {
        width: 30%;
    }

    .player-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .title {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }

    .audio-wrapper {
        width: 100%;
        display: block;
        height: auto;
        position: relative;
        float: left;
    }
</style>