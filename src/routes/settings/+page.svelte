<script>
    import { onMount } from "svelte";
    import UserData from "$lib/UserData";
    import { driver } from "driver.js";
    import "driver.js/dist/driver.css";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    let data = new UserData();

    onMount(() => {
        data.readFromLocalStorage();

        // show tutorial if user navigated from help menu
        if ($page.url.searchParams.get("tutorial") == "true") {
            helpTutorial.drive();
        }
    });

    // shown if user navigated from help menu
    let helpTutorial = driver({
        showProgress: true,
        steps: [
            { element: "button", popover: { title: "Clear All Data", description: "Press this button to delete all your data.", side: "right", align: 'start' }},
        ],
        onDestroyStarted: () => {
            helpTutorial.destroy();
            // if user closes/completes tutorial, go back to help page
            goto("/help");
        }
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