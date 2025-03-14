<script>

    import UserData from "$lib/UserData";
    import { onMount } from "svelte";

    let data = new UserData();

    onMount(() => {
        data.readFromLocalStorage();
        data = data; // trigger svelte update
    });

    /** @type {HTMLInputElement} */
    let tagSearchInput;
    /** @type {string} */
    let tagSearch = "";

    /** @type {string[]} */
    export let selectedTags = [];
</script>

<!-- "Fake" text input, so we can add tags inside -->
<div style:background-color="#111111" style:color="azure"
    style:padding="5px 10px" style:border-radius="4px"
    style:border="1px solid #333333" style:margin="2px"
    style:line-height="14px" style:cursor="text"
    on:click={() => {
        // input box is actually way smaller than the div, so we need to focus it when the div is clicked
        tagSearchInput.focus();
    }} role="none">

    {#each selectedTags as selectedTag}
        <span class="tag">
            {selectedTag}
            <button on:click={() => {
                // remove tag from selectedTags
                selectedTags = selectedTags.filter(tag => tag != selectedTag);
            }} class="xButton">&#x2715;</button>
        </span>
    {/each}

    <input type="text" placeholder="Add tag..." id="tagSearchInput" bind:this={tagSearchInput}
        bind:value={tagSearch} on:keydown={(e) => {
            if (e.key == "Enter") {
                // add tag to available tag list, if not already there
                if (!data.tags.includes(tagSearch)) {
                    data.tags = [...data.tags, tagSearch];
                    data.saveToLocalStorage();
                }
                // add tag to selectedTags, if not already there
                if (!selectedTags.includes(tagSearch)) {
                    selectedTags = [...selectedTags, tagSearch];
                }
                // clear input box
                tagSearch = "";
            }
        }} />

    <!-- Use invisible tag to set height of input box -->
    <span class="tag" style:visibility="hidden">hi <button class="xButton">&#x2715;</button></span>
</div>

{#each data.tags as availableTag}
    {#if !selectedTags.includes(availableTag)}
        <!-- Don't show tags that are already selected -->
        {#if tagSearch.length == 0 || availableTag.toLowerCase().includes(tagSearch.toLowerCase())}
            <!-- Don't show tags that don't match the search query (if applicable) -->
            <button on:click={() => {
                // add tag to selectedTags
                selectedTags = [...selectedTags, availableTag];
            }} class="tag">{availableTag}</button>
        {/if}
    {/if}
{/each}
{#if tagSearch}<br />Press enter to create new tag{/if}

<style>
    .tag {
        /* style like a miniature button */
        border-radius: 100px;
        padding: 5px 10px;
        background-color: #363636;
        color: azure;
        margin: 2px;
        display: inline-block;
        font-size: 14px;
    }

    .xButton {
        /* Don't make it look like a normal button */
        background-color: transparent;
        border: 0;
        color: azure;
        margin: 0 0 0 3px;
        padding: 0;
        transition: color 0.2s;
        font-size: 14px;
    }

    .xButton:hover {
        color: grey;
    }

    #tagSearchInput {
        background-color: transparent;
        border: 0;
        color: azure;
        padding: 0;
        font-size: 14px;
    }
</style>