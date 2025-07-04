<script lang="ts">
    import validator from "validator"

    import Logo from "../../../ui/Logo.svelte"
    import axiosRequest from "../../../api/axios"
    import { connectedUser } from "../../../stores/auth"


    export let goToLogin = () => {}


    let emailRegisterValue: string = ""
    let error: string = ""
    let usernameExists: boolean = false
    let emailExists: boolean = false


    

    const sendVerificationEmail = async (): Promise<void> => {
        try {
            await axiosRequest.post("/send-code-email", { email: emailRegisterValue })

        }
        catch(error) {

        }
    }




    
    const checkEmailAvailability = async (event: InputEvent): Promise<void> => {
        event.preventDefault()

        const email = (event.target as HTMLInputElement).value.trim()

        try {
            const { data } = await axiosRequest.post("check-email", { email })
            emailExists = data
        }
        catch(error) {
        }
    }



    
    const checkUsernameAvailability = async (event: InputEvent): Promise<void> => {
        event.preventDefault()

        const username = (event.target as HTMLInputElement).value.trim()

        try {
            const { data } = await axiosRequest.post("check-username", { username })
            usernameExists = data
        }
        catch(error) {

        }
    }


    

    const handleRegister = async (event: SubmitEvent): Promise<void> => {
        event.preventDefault()

        const username = (event.target as HTMLFormElement).username.value.trim()
        const email    = (event.target as HTMLFormElement).email.value.trim()
        const password = (event.target as HTMLFormElement).password.value.trim()
        const confirm_password = (event.target as HTMLFormElement).confirm_password.value.trim()
        const code     = (event.target as HTMLFormElement).code.value.trim()


        if (!username) {
            error = "Username field cannot be empty!"
            return
        }

        if (!email) {
            error = "Email field cannot be empty!"
            return
        }

        if (!password) {
            error = "Password field cannot be empty!"
            return
        }

        if (password !== confirm_password) {
            error = "Passwords do not match!"
            return
        }

        if (usernameExists) {
            error = "Username already exists!"
            return
        }

        if (emailExists) {
            error = "Email already exists!"
            return
        }



        if (!validator.isEmail(email)) {
            error = "Email not valid!"
            return
        }

        
        if (!validator.isStrongPassword(password)) {
            error = "Password not strong enough!"
            return
        }


        try {
            const { data: verifyResult } = await axiosRequest.post("/check-email-code", { email, code })
            
            if (verifyResult.error) {
                error = verifyResult.error
                return
            }

            if (verifyResult === false) {
                error = "Invalid verification code!"
                return
            }

            const { data } = await axiosRequest.post("/register", { username, email, password })

            if (data.error) {
                error = data.error
                return
            }

            $connectedUser = data.user

        }
        catch(error) {
            error = "Invalid data!"
        }

    }

</script>


<form on:submit={handleRegister}>
    <Logo text={true} width={500} />

    <h1>Create an account</h1>


    <div class="input-wrapper">
        <label for="username">Username</label>
        <input type="text" name="username" id="username" autoComplete="off" spellcheck="false" placeholder="Username" class:invalid-input={usernameExists} on:change={checkUsernameAvailability}>
    </div>


    <div class="input-wrapper">
        <label for="email">Email</label>
        <input bind:value={emailRegisterValue} type="text" name="email" id="email" autoComplete="off" spellcheck="false" placeholder="Enter your email" class:invalid-input={emailExists} on:change={checkEmailAvailability}>
    </div>

    <button on:click={sendVerificationEmail}>Send Confirmation Code</button>


    <div class="input-wrapper">
        <label for="code">Code</label>
        <input type="text" name="code" id="code" autoComplete="off" spellcheck="false" placeholder="Enter verification code">
    </div>
    
    <div class="input-wrapper">
        <label for="password">Password</label>
        <input type="password" name="password" id="password" autoComplete="off" spellcheck="false" placeholder="••••••••">
    </div>


    <div class="input-wrapper">
        <label for="confirm_password">Confirm Password</label>
        <input type="password" name="confirm_password" id="confirm_password" autoComplete="off" spellcheck="false" placeholder="••••••••">
    </div>

    <button class="form-link" on:click={goToLogin}>Already have an account?</button>

    <span class="error">{error}</span>

    <button type="submit">Register your account</button>
</form>