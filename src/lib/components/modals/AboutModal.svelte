<script lang="ts">
    import { onMount } from "svelte"
    import { getVersion, getTauriVersion } from "@tauri-apps/api/app"
    import { version, type, platform, arch } from "@tauri-apps/api/os"

    import Modal from "../../ui/Modal.svelte"



    let osPlatform: string = ""
    let osVersion: string = ""
    let osArch: string = ""
    let osType: string = ""
    let appVersion: string = ""
    let tauriVersion: string = ""



    onMount(async () => {
        osPlatform = await platform()
        osVersion = await version()
        osArch = await arch()
        osType = await type()
        appVersion = await getVersion()
        tauriVersion = await getTauriVersion()
    })
</script>


<Modal title="About" fitContent={true}>
    <div>
        <h1 class="title">EVO</h1>

        <div>
            <b>EVO Version: </b>
            <span>{appVersion}</span>
        </div>

        <div>
            <b>Tauri Version: </b>
            <span>{tauriVersion}</span>
        </div>

        <div>
            <b>OS Type: </b>
            <span>{osType}</span>
        </div>

        <div>
            <b>OS Architecture: </b>
            <span>{osArch}</span>
        </div>

        <div>
            <b>OS Platform: </b>
            <span>{osPlatform}</span>
        </div>


        <div>
            <b>OS Version: </b>
            <span>{osVersion}</span>
        </div>

    </div>
</Modal>




<style scoped>
    .title {
        text-align: center;
        margin-bottom: 30px;
    }

    div > b {
        font-weight: 700;
        font-size: 18px;
    }

    div > span {
        color: rgb(206, 206, 206);
    }
</style>