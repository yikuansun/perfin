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
    let date = new Date();
    data.transactions = [...data.transactions, {
        date: (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear(),
        quantity: 20,
    }];
    data.saveToLocalStorage(); // save after modification
}}>new transaction</button>

<h2>Past transactions</h2>
{#each data.transactions as transaction}
    <p>
        Date: {transaction["date"]} <br />
        Transaction type: {(transaction.quantity >= 0)?"income":"expense"} <br />
        Amount: {Math.abs(transaction.quantity)}
    </p>
{/each}