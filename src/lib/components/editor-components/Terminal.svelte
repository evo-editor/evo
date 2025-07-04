<script lang="ts">
    import { Terminal } from 'xterm';
    import { FitAddon } from 'xterm-addon-fit';
    import { onMount } from 'svelte';
    import { invoke } from '@tauri-apps/api';
    import { homeDir } from '@tauri-apps/api/path'
    import { defaultPath } from '../../stores/files'
    import 'xterm/css/xterm.css';


    let terminalContainer;
    let terminal;
    let fitAddon;
    let command = '';
    let cursorPosition = 0; 

    $: path = $defaultPath


    onMount(async () => {
        if (path === null) {
            path = (await homeDir()).slice(0, -1)
        }


        terminal = new Terminal({
            cursorBlink: true,
            cursorStyle: 'block'
        });

        fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        terminal.open(terminalContainer);

        terminal.prompt = () => {
            terminal.write(`\r\n${path}> `);
            command = '';
            cursorPosition = 0;
        };

        terminal.write(`\r ${path}> `);

        fitAddon.fit();

        terminal.onData(data => handleInput(data));
    });


    function handleInput(data) {
        switch (data) {
            case '\r': 
                processCommand(command);
                terminal.prompt();
                break;
                
            case '\u007F':
                if (cursorPosition > 0) {
                    command = command.substring(0, cursorPosition - 1) + command.substring(cursorPosition);
                    cursorPosition--;
                    redrawCommand();
                }
                break;

            case '\u001b[D':
                if (cursorPosition > 0) {
                    cursorPosition--;
                    terminal.write('\b');
                }

                break;

            case '\u001b[C':
                if (cursorPosition < command.length) {
                    cursorPosition++;
                    terminal.write('\x1b[C');
                }

                break;

            default:
                if (data >= ' ' && data <= '~') {
                    command = command.substring(0, cursorPosition) + data + command.substring(cursorPosition);
                    cursorPosition++;
                    redrawCommand();
                }

                break;
        }
    }


    const redrawCommand = (): void => {
        terminal.write(`\r\x1b[K${path}> ` + command);  // Clear line and reset cursor position
        const positionFromEnd = command.length - cursorPosition;

        if (positionFromEnd > 0) {
            terminal.write('\x1b[' + positionFromEnd + 'D');  // Move cursor back to the correct position
        }
    }



    const processCommand = async (cmd: string): Promise<void> => {
        try {
            const result = await invoke('exec_command', { command: cmd, path })
            showOutput(result)
            console.log(result)
            command = '';
            cursorPosition = 0;
        } catch (e) {
            showOutput(e)
        }
    }


    const showOutput = (output: string): void => {
        // const result = output.split("\n")

        // for (let index: number = 0; index < result.length; index++) {
        //     terminal.write(result[index] + "\n")
        // }
    }
    

    function handleResize() {
        fitAddon.fit();
    }
</script>


<div bind:this={terminalContainer} on:resize={handleResize} class="terminal" id="terminal"></div>


<style scoped>
    :global(.xterm) {
        height: 100%;
        width: 100%;
    }


    :global(.xterm-rows) {
        padding: 10px;
    }

    
    :global(.xterm-viewport) {
        height: 200px;
    }

    :global(.xterm-rows > div) {
        height: 19px !important;
        display: flex !important;
    }

    :global(.xterm-rows > div > span) {
        height: 19px !important;
        letter-spacing: 0 !important;
    }


    #terminal {
        background-color: black;
        max-height: 50%;
        display: flex;
        flex-direction: column;
    }
</style>