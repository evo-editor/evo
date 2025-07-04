<script lang="ts">
    import { invoke } from "@tauri-apps/api"
    import { open } from "@tauri-apps/api/shell"
    import { listen } from "@tauri-apps/api/event"


    import Icon from "svelte-icons-pack/Icon.svelte"
    import FaEnvelope from "svelte-icons-pack/fa/FaEnvelope"
    import FaBrandsGithub from "svelte-icons-pack/fa/FaBrandsGithub"


    import Logo from "../../ui/Logo.svelte"
    import axiosRequest from "../../api/axios"

    import { connectedUser } from "../../stores/auth"
    import { showToast } from "../../stores/modals"


    import Login from "./login-components/Login.svelte"
    import Register from "./login-components/Register.svelte"
    import PasswordReset from "./login-components/PasswordReset.svelte"




    enum LoginState {
        LOGIN_BUTTONS,
        LOGIN_PAGE,
        REGISTER_PAGE,
        FORGOT_PASSOWRD_PAGE,
    }


    let pageState: LoginState = LoginState.LOGIN_BUTTONS

    


    const githubLogin = async (): Promise<void> => {
        const PORT = await invoke("start_server")

        const GITHUB_CLIENT_ID = "1a2acc086e09bc388206"
        const githubLink = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=http://localhost:${PORT}`


        const unlisten = await listen<string>("redirect_uri", (event) => {
            const params: string[] = event.payload.split("/")

            const queryString: string = params[params.length - 1]
            const urlParams: URLSearchParams = new URLSearchParams(queryString)
            const codeParam: string | null = urlParams.get("code")


            if (codeParam) {
                axiosRequest.post("/get-user-data", { code: codeParam })
                    .then(({data}) => { 
                        $connectedUser = data.user 
                        showToast("Logged in successfully!", "success")
                    })
                    .catch(error => { 
                        $connectedUser = null
                        showToast("Error when logging in!", "error")
                    })
            }

            invoke("stop_server", { port: PORT })
            unlisten()
        })

        await open(githubLink)
    }






    const goToLogin = (): void => {
        pageState = LoginState.LOGIN_PAGE
    }

    const goToRegister = (): void => {
        pageState = LoginState.REGISTER_PAGE
    }

    const goToMain = (): void => {
        pageState = LoginState.LOGIN_BUTTONS
    }

    const goToForget = (): void => {
        pageState = LoginState.FORGOT_PASSOWRD_PAGE
    }
</script>






<div class="auth-menu">
    {#if pageState === LoginState.LOGIN_BUTTONS}
        <Logo text={true} width={500} />

        <h2>You are not signed in!</h2>

        <div class="login-buttons">
            <button class="github-login login-button" on:click={githubLogin}>
                <Icon src={FaBrandsGithub} color="black" size=22 />
                Login with Github
            </button>

            <span class="button-separator">OR</span>

            <button class="email-login login-button" on:click={goToLogin}>
                <Icon src={FaEnvelope} color="white" size=22 />
                Login with Email
            </button>
        </div>
    {/if}





    {#if pageState === LoginState.LOGIN_PAGE}
        <Login {goToForget} {goToMain} {goToRegister} />
    {/if}

    {#if pageState === LoginState.REGISTER_PAGE}
        <Register {goToLogin} />
    {/if}

    {#if pageState === LoginState.FORGOT_PASSOWRD_PAGE}
        <PasswordReset {goToLogin} />
    {/if}
</div>






<style>
    form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        max-width: 700px;
        margin: 0 auto;
    }



    @media (max-width: 500px) {
        h1 {
            text-align: center;
        }
    }

    h2 {
        text-align: center;
    }


.password-wrapper {
    display: flex;
    flex-direction: row;
    margin: 0px 20px;
}

.password-wrapper > input {
    width: 100%;
    margin-left: 0;
}

    .invalid-input {
        border: 2px solid red;
    }

    h1 {
        margin: 5px 20px;
        color: #c117fc;
    }


    .error {
        color: red;
        font-size: 15px;
        letter-spacing: 1.5px;
        font-weight: 700;
        height: 30px;
        margin: 5px auto;
    }


    .input-wrapper {
        margin: 10px 20px;
        display: flex;
        flex-direction: column;
        gap: 7px;
    }

    label {
        font-weight: 700;
        font-size: 16px;
        color: #c117fc;
    }

    input {
        padding: 7px 15px;
        font-size: 16px;
        background-color: #050130;
        color: white;
        border-radius: 7px;
        letter-spacing: 1.5px;
        transition: 0.2s;
    }

::placeholder { 
    color: #9a00ce;
    opacity: 1;
}

button[type="submit"] {
    padding: 10px 20px;
    font-weight: 700;
    border-radius: 5px;
    border: 2px solid black;
    margin: 10px auto;
    background-color: #1c3d4d;
    color: rgb(255, 208, 0);
    transition: 0.2s;
}

button[type="submit"]:hover {
    background-color: #466468;
    transition: 0.2s;
}

.form-link {
    font-size: 14px;
    color: #466468;
    font-weight: 700;
}

.link-wrapper {
    font-size: 14px;
    font-weight: 500;
    margin: 20px;
    margin-top: 10px;
}


.show-password-button {
    background-color: transparent;
    border: none;
    color: #466468;
    font-size: 24px;
    display: flex;
    align-items: center;
    transition: 0.2s;
}

.show-password-button:hover {
    color: #1c3d4d;
    transition: 0.2s;
}





    .auth-menu {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin-top: 10px;
    }


    .login-buttons {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
        padding: 10px;
    }

    .button-separator {
        font-size: 14px;
        color: rgb(231, 230, 230);
    }

    .login-button {
        font-weight: 700;
        display: flex;
        justify-content: center;
        gap: 15px;
        align-items: center;
        width: 200px;
        padding: 10px 15px;
        border-radius: 10px;
        transition: 0.2s;
    }

    .github-login {
        background-color: rgb(231, 230, 230);
        color: black;
    }

    .github-login:hover {
        background-color: white;
        transition: 0.2s;
    }

    .email-login {
        background-color: rgb(230, 0, 0);
        color: white;
    }

    .email-login:hover {
        background-color: red;
        transition: 0.2s;
    }


    @media only screen and (max-width: 920px) {
        .login-buttons {
            flex-direction: column;
        }
    }
</style>