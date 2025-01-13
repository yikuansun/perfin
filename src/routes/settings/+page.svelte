<script>
    import { onMount } from "svelte";
    import UserData from "$lib/UserData";

    let data = new UserData();

    onMount(() => {
        data.readFromLocalStorage();
    });
</script>

<h2>Data and Privacy</h2>
<button on:click={() => {
    // clear data (dangerous action, so we ask the user first)
    if (confirm("are u sure???")) {
        data.purgeLocalStorage();
    }
}}>Clear data</button>
<hr />