<script lang="ts">
    import Logo from "../../../ui/Logo.svelte"

    import validator from "validator"
    import axiosRequest from "../../../api/axios"
    import { connectedUser } from "../../../stores/auth"



    let error: string = ""


    export let goToMain = () => {}
    export let goToForget = () => {}
    export let goToRegister = () => {}




    const handleLogin = async (event: SubmitEvent): Promise<void> => {
        // event.preventDefault()

        console.log("login")

        const email    = (event.target as HTMLFormElement).email.value.trim()
        const password = (event.target as HTMLFormElement).password.value.trim()


        if (!email) {
            error = "Email field cannot be empty!"
            return
        }

        if (!password) {
            error = "Password field cannot be empty!"
            return
        }


        if (!validator.isEmail(email)) {
            error = "Email not valid!"
            return
        }


        try {
            const { data } = await axiosRequest.post("/login", { email, password })
            $connectedUser = data.user
        }
        catch(error) {
            error = "Invalid login!"
        }
    }
</script>



<form on:submit={handleLogin}>
    <Logo text={true} width={500} />

    <h1>Welcome back!</h1>

    <div class="input-wrapper">
        <label for="email">Email</label>
        <input type="text" name="email" id="email" autoComplete="off" spellcheck="false" placeholder="Enter your email">
    </div>

    
    <div class="input-wrapper">
        <label for="password">Password</label>
        <input type="password" name="password" id="password" autoComplete="off" spellcheck="false" placeholder="••••••••">
    </div>


    
    <button class="form-link" on:click={goToRegister}>Don't have an account?</button>
    <button class="form-link" on:click={goToMain}>Go back</button>
    <button class="form-link" on:click={goToForget}>Forgot password?</button>



    <span class="error">{error}</span>

    <button type="submit">Sign into your account</button>
</form>
