<script>
    import { onMount } from "svelte";
    import UserData from "$lib/UserData";
    import { fade, slide } from "svelte/transition";
    import moment from "moment";

    let data = new UserData();

    onMount(() => {
        data.readFromLocalStorage();
        data = data; // make sure svelte updates it in the page
    });

    let createModalOpen = false;
    /** @type {{ dateString: string | null,
     *          transactionType: "income" | "expense",
     *          amount: number | null,
     *          "nickName": string }} */
    let createModalData = {
        dateString: null,
        transactionType: "income",
        amount: null,
        nickName: ""
    };

    /**
     * Create a transaction and save to UserData. Called when modal submit button pressed.
     * @param {string | null} dateString the date of the transaction, in HTML Date Input format (yyyy-mm-dd)
     * @param {number | null} amount the magnitude of the transaction (absolute value)
     * @param {"income" | "expense"} type decide if the amount be added to or substracted from balance
     * @param {string} nickname title of the transaction (optional)
     */
    function createTransaction(dateString, amount, type, nickname="") {
        // expense is treated the same as negative income
        let quantityReal = amount || 0;
        if (type == "expense") quantityReal *= -1;
        // place the new transaction in the correct place in the array
        let transactionsBefore = data.transactions.filter((transaction) => moment(transaction.date, "MM/DD/YYYY").isSameOrBefore(moment(dateString, "YYYY-MM-DD"), "day"));
        let transactionsAfter = data.transactions.filter((transaction) => moment(transaction.date, "MM/DD/YYYY").isAfter(moment(dateString, "YYYY-MM-DD"), "day"));
        data.transactions = [...transactionsAfter, {
            date: moment(dateString, "YYYY-MM-DD").format("MM/DD/YYYY"),
            quantity: quantityReal,
            nickname: nickname,
        }, ...transactionsBefore];
        data.balance += quantityReal; // update balance
        data.saveToLocalStorage(); // save after modification

    }

    let editModalOpen = false;
    /** @type {{ dateString: string | null,
     *          transactionType: "income" | "expense",
     *          amount: number | null,
     *          "nickName": string
     *          transactionIndex: number }} */
    let editModalData = {
        transactionIndex: 0,
        dateString: null,
        transactionType: "income",
        amount: null,
        nickName: ""
    };

    /**
     * Edit a transaction and save to UserData. Called when modal submit button pressed.
     * @param {number} transactionIndex the index of the transaction to edit
     * @param {string | null} dateString the date of the transaction, in HTML Date Input format (yyyy-mm-dd)
     * @param {number | null} amount the magnitude of the transaction (absolute value)
     * @param {"income" | "expense"} type decide if the amount be added to or substracted from balance
     * @param {string} nickname title of the transaction (optional)
     */
    function editTransaction(transactionIndex, dateString, amount, type, nickname="") {
        // expense is treated the same as negative income
        let quantityReal = amount || 0;
        if (type == "expense") quantityReal *= -1;
        data.transactions[transactionIndex] = {
            date: moment(dateString, "YYYY-MM-DD").format("MM/DD/YYYY"),
            quantity: quantityReal,
            nickname: nickname,
        };
        data.balance += quantityReal; // update balance
        data.saveToLocalStorage(); // save after modification
    }
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
        Title (optional): <input type="text" bind:value={createModalData["nickName"]} /> <br />
        <button on:click={() => {
            // add the transaction to user data
            createTransaction(createModalData["dateString"], createModalData["amount"], createModalData["transactionType"], createModalData["nickName"]);
            // close & reset modal
            createModalOpen = false;
            createModalData = {
                dateString: null,
                transactionType: "income",
                amount: null,
                nickName: "",
            };
        }}>Add Transaction</button>
    </div>
{/if}

{#if editModalOpen}
    <button class="greywall" transition:fade={{ duration: 250, }}
        on:click={() => { editModalOpen = false }}></button>
    <div class="modal" transition:slide={{ duration: 500, }}>
        <h2 style:margin-top="4px" style:margin-bottom="14px">Edit transaction</h2>
        Date: <input type="date" bind:value={editModalData["dateString"]} /> <br />
        Type:
        <select bind:value={editModalData["transactionType"]}>
            <option>income</option>
            <option>expense</option>
        </select> <br />
        Amount: <input type="number" min={0} max={10000} bind:value={editModalData["amount"]} /> <br />
        Title (optional): <input type="text" bind:value={editModalData["nickName"]} /> <br />
        <button on:click={() => {
            // add the transaction to user data
            editTransaction(editModalData["transactionIndex"], editModalData["dateString"], editModalData["amount"], editModalData["transactionType"], editModalData["nickName"]);
            // close modal
            editModalOpen = false;
        }}>Edit Transaction</button>
    </div>
{/if}

<h2>Past transactions</h2>
{#each data.transactions as transaction, transactionIndex}
    <p>
        {#if transaction["nickname"]} <b style:font-size="large">{transaction["nickname"]}</b> <br /> {/if}
        Date: {transaction["date"]} <br />
        Transaction type: {(transaction.quantity > 0)?"income":"expense"} <br />
        Amount: {Math.abs(transaction.quantity)} <br />
        <button on:click={() => {
            editModalData["transactionIndex"] = transactionIndex;
            editModalData["dateString"] = moment(transaction["date"], "MM/DD/YYYY").format("YYYY-MM-DD");
            editModalData["transactionType"] = (transaction.quantity > 0)?"income":"expense";
            editModalData["amount"] = Math.abs(transaction.quantity);
            editModalData["nickName"] = transaction["nickname"];
            editModalOpen = true;
        }}>Edit</button>
    </p>
{/each}