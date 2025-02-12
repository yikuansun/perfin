<script>
    import { onMount } from "svelte";
    import UserData from "$lib/UserData";
    import { fade, slide } from "svelte/transition";

    let data = new UserData();

    onMount(() => {
        data.readFromLocalStorage();
        data = data; // make sure svelte updates it in the page
    });

    let createModalOpen = false;
    /** @type {{ dateString: string | null,
     *          transactionType: "income" | "expense",
     *          amount: number | null }} */
    let createModalData = {
        dateString: null,
        transactionType: "income",
        amount: null,
    };
</script>

<button on:click={() => { createModalOpen = true; }}>new transaction</button>

{#if createModalOpen}
    <button class="greywall" transition:fade={{ duration: 250, }}
        on:click={() => { createModalOpen = false }}></button>
    <div class="modal" transition:slide={{ duration: 500, }}>
        <h2 style:margin-top="4px" style:margin-bottom="14px">Create new transaction</h2>
        Date: <input type="date" bind:value={createModalData["dateString"]} /> <br />
        Type:
        <select bind:value={createModalData["transactionType"]}>
            <option>income</option>
            <option>expense</option>
        </select> <br />
        Amount: <input type="number" min={0} max={10000} bind:value={createModalData["amount"]} /> <br />
        <button on:click={() => {
            // the HTML date input returns format yyyy-mm-dd - must be changed to mm/dd/yyyy
            let dateYMD = (createModalData["dateString"] || "2025-01-23").split("-");
            // expense is treated the same as negative income
            let quantityReal = createModalData["amount"] || 0;
            if (createModalData["transactionType"] == "expense") quantityReal *= -1;
            data.transactions = [...data.transactions, {
                date: dateYMD[1] + "/" + dateYMD[2] + "/" + dateYMD[0],
                quantity: quantityReal,
            }];
            data.balance += quantityReal; // update balance
            data.saveToLocalStorage(); // save after modification
            // close & reset modal
            createModalData = {
                dateString: null,
                transactionType: "income",
                amount: null,
            };
            createModalOpen = false;
        }}>Add Transaction</button>
    </div>
{/if}

<h2>Past transactions</h2>
{#each data.transactions as transaction}
    <p>
        Date: {transaction["date"]} <br />
        Transaction type: {(transaction.quantity > 0)?"income":"expense"} <br />
        Amount: {Math.abs(transaction.quantity)}
    </p>
{/each}