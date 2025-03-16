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
     *          "nickName": string,
     *          "tag": string }} */
    let createModalData = {
        dateString: null,
        transactionType: "income",
        amount: null,
        nickName: "",
        tag: "",
    };

    /**
     * Create a transaction and save to UserData. Called when modal submit button pressed.
     * @param {string | null} dateString the date of the transaction, in HTML Date Input format (yyyy-mm-dd)
     * @param {number | null} amount the magnitude of the transaction (absolute value)
     * @param {"income" | "expense"} type decide if the amount be added to or substracted from balance
     * @param {string} nickname title of the transaction (optional)
     * @param {string} tag category of the transaction (optional)
     */
    function createTransaction(dateString, amount, type, nickname="", tag="") {
        // expense is treated the same as negative income
        let quantityReal = amount || 0;
        if (type == "expense") quantityReal *= -1;
        // place the new transaction in the correct place in the array
        let transactionsBefore = data.transactions.filter((transaction) => moment(transaction.date, "MM/DD/YYYY").isSameOrBefore(moment(dateString, "YYYY-MM-DD"), "day"));
        let transactionsAfter = data.transactions.filter((transaction) => moment(transaction.date, "MM/DD/YYYY").isAfter(moment(dateString, "YYYY-MM-DD"), "day"));
        // insert transaction into correct place in array
        data.transactions = [...transactionsAfter, {
            date: moment(dateString, "YYYY-MM-DD").format("MM/DD/YYYY"),
            quantity: quantityReal,
            nickname: nickname,
            tag: tag,
        }, ...transactionsBefore];
        data.saveToLocalStorage(); // save after modification

    }

    let editModalOpen = false;
    /** @type {{ dateString: string | null,
     *          transactionType: "income" | "expense",
     *          amount: number | null,
     *          "nickName": string,
     *          "tag": string,
     *          transactionIndex: number }} */
    let editModalData = {
        transactionIndex: 0,
        dateString: null,
        transactionType: "income",
        amount: null,
        nickName: "",
        tag: "",
    };

    /**
     * Edit a transaction and save to UserData. Called when modal submit button pressed.
     * @param {number} transactionIndex the index of the transaction to edit
     * @param {string | null} dateString the date of the transaction, in HTML Date Input format (yyyy-mm-dd)
     * @param {number | null} amount the magnitude of the transaction (absolute value)
     * @param {"income" | "expense"} type decide if the amount be added to or substracted from balance
     * @param {string} nickname title of the transaction (optional)
     * @param {string} tag category of the transaction (optional)
     */
    function editTransaction(transactionIndex, dateString, amount, type, nickname="", tag="") {
        // expense is treated the same as negative income
        console.log(tag)
        let quantityReal = amount || 0;
        if (type == "expense") quantityReal *= -1;
        data.transactions[transactionIndex] = {
            date: moment(dateString, "YYYY-MM-DD").format("MM/DD/YYYY"),
            quantity: quantityReal,
            nickname: nickname,
            tag: tag,
        };
        data.saveToLocalStorage(); // save after modification
    }

    /**
     * Delete a transaction from the array
     * @param {number} transactionIndex
     */
    function deleteTransaction(transactionIndex) {
        data.transactions.splice(transactionIndex, 1);
        data.saveToLocalStorage();
        data.transactions = data.transactions; // trigger reactivity
    }

    // text to filter transactions by
    let searchQuery = "";
</script>

<button on:click={() => { createModalOpen = true; }}>New Transaction</button>

{#if createModalOpen}
    <button class="greywall" transition:fade={{ duration: 250, }}
        on:click={() => { createModalOpen = false }}></button>
    <div class="modal" transition:slide={{ duration: 500, }}>
        <h2 style:margin-top="4px" style:margin-bottom="14px">Create new transaction</h2>
        Date: <input type="date" bind:value={createModalData["dateString"]} /> <br />
        Type:
        <select bind:value={createModalData["transactionType"]}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
        </select> <br />
        Amount: <input type="number" min={0} max={10000} bind:value={createModalData["amount"]} /> <br />
        Title (optional): <input type="text" bind:value={createModalData["nickName"]} /> <br />
        Tag (optional):
        <select bind:value={createModalData["tag"]} on:change={() => {
            if (createModalData["tag"] == "CREATE_NEW_TAG") {
                let tagName = prompt("Enter new tag name");
                if (tagName && data.tags.indexOf(tagName) == -1) {
                    // add tag to available tag list, if not already there
                    data.tags = [...data.tags, tagName];
                    data.saveToLocalStorage();
                }
                // set tag input box to the new tag name
                createModalData["tag"] = tagName || "";
            }
        }}>
            <option value="">None</option>
            <option value="CREATE_NEW_TAG">New tag</option>
            <optgroup label="Existing tags">
                {#each data.tags as tag}
                    <option value={tag}>{tag}</option>
                {/each}
            </optgroup>
        </select> <br />
        <button on:click={() => {
            // add the transaction to user data
            createTransaction(createModalData["dateString"], createModalData["amount"], createModalData["transactionType"], createModalData["nickName"], createModalData["tag"]);
            // close & reset modal
            createModalOpen = false;
            createModalData = {
                dateString: null,
                transactionType: "income",
                amount: null,
                nickName: "",
                tag: "",
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
            <option value="income">Income</option>
            <option value="expense">Expense</option>
        </select> <br />
        Amount: <input type="number" min={0} max={10000} bind:value={editModalData["amount"]} /> <br />
        Title (optional): <input type="text" bind:value={editModalData["nickName"]} /> <br />
        Tag (optional):
        <select bind:value={editModalData["tag"]} on:change={() => {
            if (editModalData["tag"] == "CREATE_NEW_TAG") {
                let tagName = prompt("Enter new tag name");
                if (tagName && data.tags.indexOf(tagName) == -1) {
                    // add tag to available tag list, if not already there
                    data.tags = [...data.tags, tagName];
                    data.saveToLocalStorage();
                }
                // set tag input box to the new tag name
                editModalData["tag"] = tagName || "";
            }
        }}>
            <option value="">None</option>
            <option value="CREATE_NEW_TAG">New tag</option>
            <optgroup label="Existing tags">
                {#each data.tags as tag}
                    <option value={tag}>{tag}</option>
                {/each}
            </optgroup>
        </select> <br />
        <button on:click={() => {
            // add the transaction to user data
            editTransaction(editModalData["transactionIndex"], editModalData["dateString"], editModalData["amount"], editModalData["transactionType"], editModalData["nickName"], editModalData["tag"]);
            // close modal
            editModalOpen = false;
        }}>Save</button>
    </div>
{/if}

<h2>Past transactions</h2>
<input type="text" bind:value={searchQuery} placeholder="Search transactions by title or category"
    style:width="100%" style:box-sizing="border-box" style:font-size="16px" />
{#each data.transactions as transaction, transactionIndex}
    <!-- if searching, only show transactions that match search query -->
    {#if searchQuery == "" || transaction["nickname"].toLowerCase().includes(searchQuery.toLowerCase()) || transaction["tag"].toLowerCase().includes(searchQuery.toLowerCase())}
        <p>
            {#if transaction["nickname"]} <b style:font-size="large">{transaction["nickname"]}</b> <br /> {/if}
            Date: {transaction["date"]} <br />
            Transaction type: {(transaction.quantity > 0)?"income":"expense"} <br />
            Amount: ${Math.abs(transaction.quantity).toFixed(2)} <br />
            {#if transaction.tag} Category: {transaction.tag} <br /> {/if}
            <button on:click={() => {
                editModalData["transactionIndex"] = transactionIndex;
                editModalData["dateString"] = moment(transaction["date"], "MM/DD/YYYY").format("YYYY-MM-DD");
                editModalData["transactionType"] = (transaction.quantity > 0)?"income":"expense";
                editModalData["amount"] = Math.abs(transaction.quantity);
                editModalData["nickName"] = transaction["nickname"];
                editModalData["tag"] = transaction["tag"];
                editModalOpen = true;
            }}>Edit</button>
            <button on:click={() => { deleteTransaction(transactionIndex); }}>Delete</button>
        </p>
    {/if}
{/each}