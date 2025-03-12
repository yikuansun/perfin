<script>
    import { onMount } from "svelte";
    import UserData from "$lib/UserData";

    let data = new UserData();

    onMount(() => {
        data.readFromLocalStorage();
    });
</script>

<h2>Data and Privacy</h2>
Data are only stored locally on your device. No one else can see your data.
<br /> <br />
<button on:click={() => {
    // clear data (dangerous action, so we ask the user first)
    if (confirm("This action is irreversible. Are you sure you want to clear your data?")) {
        data.purgeLocalStorage();
    }
}}>Clear data</button>
<hr />

<style>
    hr {
        border: 1px solid #444444;
    }
</style>