<script lang="ts">
    import Logo from "../../../ui/Logo.svelte"


    export let goToLogin = () => {}

    let error: string = ""


    const handlePasswordReset = async (event: SubmitEvent): Promise<void> => {
        event.preventDefault()

        const email = (event.target as HTMLFormElement).email.value.trim()

    }
</script>


<form on:submit={handlePasswordReset}>
    <Logo text={true} width={500} />

    <h1>Forgot password?</h1>

    <div class="input-wrapper">
        <label for="email">Your email</label>
        <input type="text" name="email" id="email" autoComplete="off" spellcheck="false" placeholder="Enter your email">
    </div>

    
    <button class="form-link" on:click={goToLogin}>Back to login</button>


    <span class="error">{error}</span>

    <button type="submit">Find password</button>
</form>