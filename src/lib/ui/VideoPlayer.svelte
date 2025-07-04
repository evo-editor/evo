<script lang="ts">
    import Icon from "svelte-icons-pack/Icon.svelte"
    import IoPlay from "svelte-icons-pack/io/IoPlay"
    import IoPauseSharp from "svelte-icons-pack/io/IoPauseSharp"

    export let src: string = ""

    let showControls: boolean = true
    let paused: boolean = true
    let time: number = 0

    let duration;
    let showControlsTimeout;

    function handleMove(e) {
        clearTimeout(showControlsTimeout);
        showControlsTimeout = setTimeout(() => (showControls = false), 2500);
        showControls = true;

        if (!duration) return
        if (e.type !== 'touchmove' && !(e.buttons & 1)) return

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const { left, right } = this.getBoundingClientRect();
        time = (duration * (clientX - left)) / (right - left);
    }

    function handleMousedown() {
        lastMouseDown = new Date();
    }

    function handleMouseup(e) {
        if (new Date() - lastMouseDown < 300) {
            if (paused) e.target.play();
            else e.target.pause();
        }
    }

    function format(seconds) {
        if (isNaN(seconds)) return '...'
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        if (seconds < 10) seconds = '0' + seconds;
        return `${minutes}:${seconds}`;
    }
</script>

<div class="player-wrapper">
    <div class="video-wrapper">
        <video
            src={src}
            on:mousemove={handleMove}
            on:touchmove|preventDefault={handleMove}
            on:mousedown={handleMousedown}
            on:mouseup={handleMouseup}
            bind:currentTime={time}
            bind:duration
            bind:paused
        >
            <track kind="captions" />
        </video>

        <div class="controls" style="opacity: {duration && showControls ? 1 : 0}">
            <input type="range" min="0" max={duration} bind:value={time} on:input={e => time = +e.target.value} />

            <div class="info">
                <span class="time">{format(time)}</span>
                <span class="time">{format(duration)}</span>
            </div>

            <Icon src={!paused ? IoPauseSharp : IoPlay} color="white" size=50 />
        </div>
    </div>
</div>

<style scoped>
    .player-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .video-wrapper {
        position: relative;
        width: 400px;
    }

    .controls {
        position: absolute;
        bottom: 0;
        width: 100%;
        transition: opacity 1s;
    }

    .info {
        display: flex;
        justify-content: space-between;
    }

    span {
        padding: 0.2em 0.5em;
        color: white;
        text-shadow: 0 0 8px black;
        font-size: 1.4em;
        opacity: 0.7;
    }

    .time {
        width: 3em;
    }

    .time:last-child {
        text-align: right;
    }

    input[type="range"] {
        -webkit-appearance: none; /* Override default CSS styles */
        appearance: none;
        width: 100%; /* Specific width is required for 'range' */
        height: 10px; /* Specified height for the track */
        background: rgba(0, 0, 0, 0.2);
        outline: none; /* Remove CSS outline */
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px; /* Set a specific slider handle width */
        height: 20px; /* Slider handle height */
        background: white; /* Slider handle color */
        cursor: pointer; /* Cursor on hover */
    }

    video {
        width: 100%;
    }
</style>
