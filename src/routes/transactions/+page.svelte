<script>
    import { onMount } from "svelte";
    import UserData from "$lib/UserData";

    let data = new UserData();

    onMount(() => {
        data.readFromLocalStorage();
        data = data; // make sure svelte updates it in the page
    });
</script>

<button on:click={() => {
    data.transactions = [...data.transactions, {
        date: "yikuan",
    }]
    data.saveToLocalStorage(); // save after modification
}}>new transaction</button>

<h2>Past transactions</h2>
{#each data.transactions as transaction}
    <p>hi</p>
{/each}