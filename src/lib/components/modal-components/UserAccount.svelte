<script lang="ts">
    import moment from "moment"
    import Icon from "svelte-icons-pack/Icon.svelte"
    import BiLogOut from "svelte-icons-pack/bi/BiLogOut"
    import CgCalendarDates from "svelte-icons-pack/cg/CgCalendarDates"
    import AiOutlineDoubleLeft from "svelte-icons-pack/ai/AiOutlineDoubleLeft"
    import AiOutlineUserDelete from "svelte-icons-pack/ai/AiOutlineUserDelete"



    import axiosRequest from "../../api/axios"
    import { connectedUser } from "../../stores/auth"
    import { showToast, triggerDialog } from "../../stores/modals"




    const logout = () => {
        triggerDialog("Are you sure you want to logout?", "Confirm", logoutServer)
    }


    const logoutAll = () => {
        triggerDialog("Are you sure you want to logout on all of your devices?", "Confirm", logoutAllServer)
    }

    
    const deleteAccount = () => {
        triggerDialog("Are you sure you want to delete your account permanently? Be careful! You will not be able to recover any data!", "Confirm", deleteAccountServer)
    }







    const logoutServer = async (): Promise<void> => {
        try {
            await axiosRequest.get("/logout")
            $connectedUser = null
            showToast("Logged out successfully!", "success")
        }
        catch(error) {
            showToast("Couldn't logout!", "error")
        }
    }





    const logoutAllServer = async (): Promise<void> => {
        try {
            await axiosRequest.get("/logout-all")
            $connectedUser = null
            showToast("Logged out successfully!", "success")
        }
        catch(error) {
            showToast("Couldn't logout!", "error")
        }
    }


    const deleteAccountServer = async (): Promise<void> => {
        try {
            await axiosRequest.delete("/user")
            $connectedUser = null
            showToast("Account deleted successfully!", "success")
        }
        catch(error) {
            showToast("Couldn't delete the account!", "error")
        }
    }

</script>




{#if $connectedUser !== null}
    <div class="user-profile">

        <div class="top-wrapper">
            {#if $connectedUser.type === "email"}
                <div>
                    <h1>{$connectedUser.username}</h1>
                    <h1>{$connectedUser.email}</h1>
                </div>
            {/if}


            {#if $connectedUser.type === "github"}
                <div>
                    <img src={$connectedUser.avatar} alt="User avatar" class="user-avatar" />
                    <h1>{$connectedUser.username}</h1>
                    <span class="join-date">
                        <Icon src={CgCalendarDates} size=24 /> {moment($connectedUser.createdAt).format("MMMM Do YYYY")}
                    </span>
                </div>
            {/if}


            <div class="user-buttons">
                <button on:click={logout}        style="padding-right: 5px; padding-bottom: 2px"> <Icon src={BiLogOut}             size=22 /> </button>
                <button on:click={logoutAll}     style="padding-right: 1px">                      <Icon src={AiOutlineDoubleLeft}  size=22 /> </button>
                <button on:click={deleteAccount} style="padding-left: 1px;">                      <Icon src={AiOutlineUserDelete}  size=24 /> </button>
            </div>
        </div>
    </div>
{/if}




<style scoped>
    @media screen and (max-width: 760px) {
        .top-wrapper {
            flex-direction: column !important;
            align-items: center !important;
        }

        .user-profile {
            padding: 10px !important;
        }
    }

    .user-profile {
        padding: 30px;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .top-wrapper {
        display: flex;
        justify-content: space-between;
        gap: 20px;
    }

    .user-avatar {
        border-radius: 100px;
        width: 100%;
        max-width: 150px;
        max-height: 150px;
    }


    .user-buttons {
        display: flex;
        align-items: start;
        flex-wrap: wrap;
        gap: 20px;
    }

    .user-buttons > button {
        width: 35px;
        height: 35px;
        border-radius: 35px;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        transition: 0.2s;
    }

    .user-buttons > button:hover {
        background-color: rgb(180, 180, 180);
        transition: 0.2s;
    }


    .user-buttons > button:active {
        background-color: gray;
        transition: 0.2s;
    }


    .join-date {
        display: flex;
        align-items: center;
        gap: 10px;
        text-align: center;
    }
</style>