<script lang="ts">
    import File from './File.svelte'
	import { slide } from 'svelte/transition'
    import type { ProjectFolder } from "../../../stores/files"


    import Icon from "svelte-icons-pack/Icon.svelte"

    import FaSolidChevronDown from "svelte-icons-pack/fa/FaSolidChevronDown"
    import FaSolidChevronRight from "svelte-icons-pack/fa/FaSolidChevronRight"
    import AiFillFolder from "svelte-icons-pack/ai/AiFillFolder"
    import AiFillFolderOpen from "svelte-icons-pack/ai/AiFillFolderOpen"



    export let folder: ProjectFolder



    const toggle = () => {
        folder.isOpen = !folder.isOpen
    }
</script>



<button title={folder.path} class="file-item-button" on:click={() => toggle()}>
    <Icon src={folder.isOpen ? FaSolidChevronDown : FaSolidChevronRight} color='white' size=12 className="keep-size"  />
    <Icon src={folder.isOpen ? AiFillFolderOpen : AiFillFolder} color='white' size=16 className="keep-size" />
    {folder.name}
</button>

{#if folder.isOpen && folder.content.length > 0}
	<ul class="folder-content" transition:slide={{ duration: 300 }}>
		{#each folder.content as element}
			<li>
				{#if element.type === "folder"}
					<svelte:self folder={element} />
                {/if}
                
				{#if element.type === "file"}
					<File file={element} />
				{/if}
			</li>
		{/each}
	</ul>
{/if}



<style>

    .file-item-button {
        width: 100%;
        padding: 2px 10px;
        padding-left: 3px;
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
        white-space: nowrap;
    }

    .file-item-button:hover {
        background-color: rgba(194, 204, 204, 0.705);
    }

    .folder-content {
        padding: 0.2em 0 0 0.5em;
		margin: 0 0 0 0.5em;
		list-style: none;
		border-left: 1px solid #eee;
    }

    
    :global(.keep-size) {
        flex-shrink: 0;
    }
</style>