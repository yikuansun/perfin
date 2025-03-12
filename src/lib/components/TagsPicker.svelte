<script>
    import UserData from "$lib/UserData";
    import { onMount } from "svelte";

    let data = new UserData();

    onMount(() => {
        data.readFromLocalStorage();
    });

    /** @type {string[]} */
    export let selectedTags = [];
</script>

{#each selectedTags as tag, i}
    <select bind:value={tag} on:change={() => {
        // ask user to input a new tag
        if (tag === "CREATE_NEW_TAG") {
            let newTag = prompt("Enter a new tag:");
            if (newTag) {
                if (newTag != "CREATE_NEW_TAG") { // disallow trolling
                    data.tags = [...data.tags, newTag];
                    tag = newTag; // fill input with the newly-created tag
                    data.saveToLocalStorage(); // save tag for future use
                }
                else {
                    tag = "";
                }
            }
        }
    }}>
        {#each data.tags as availableTag}
            <option value={availableTag}>{availableTag}</option>
        {/each}
        <option value="CREATE_NEW_TAG">Create new tag...</option>
    </select> <br />
{/each}
<!-- create a new tag -->
<button on:click={() => { selectedTags = [...selectedTags, ""]; }}>+</button>