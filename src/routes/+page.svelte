<script>
    import { onMount } from "svelte";
    import UserData from "$lib/UserData";

    let data = new UserData();

    onMount(() => {
        data.readFromLocalStorage();
    });
</script>

<h1>YOUR BALANCE: {data.balance}</h1>