<script>
    import { onMount } from "svelte";
    import UserData from "$lib/UserData";
    import { fade, slide } from "svelte/transition";
    import { get } from "svelte/store";

    let data = new UserData();

    onMount(() => {
        data.readFromLocalStorage();
        data = data; // make sure svelte updates it in the page
        selectedStartDate = "2025-01-01"; // fire svelte update
    });

    /**
     * Get all transactions in a date range
     * @param startDate {string} mm/dd/yyyy
     * @param endDate {string} mm/dd/yyyy
     * @returns {Array<{ date: string, quantity: number, nickname: string, }>} transactions in the date range
     */
    function getTransactionsInDateRange(startDate, endDate) {
        // convert string to date
        let startDateObj = new Date(parseInt(startDate.split("/")[2]), parseInt(startDate.split("/")[0]) - 1, parseInt(startDate.split("/")[1]));
        let endDateObj = new Date(parseInt(endDate.split("/")[2]), parseInt(endDate.split("/")[0]) - 1, parseInt(endDate.split("/")[1]));
        // get transactions in range
        let transactionsInRange = data.transactions.filter((transaction) => {
            let date = transaction["date"].split("/").map((x) => parseInt(x));
            let transactionDateObj = new Date(date[2], date[0] - 1, date[1]);
            return (transactionDateObj >= startDateObj && transactionDateObj <= endDateObj);
        });
        return transactionsInRange;
    }

    let selectedStartDate = "2024-12-31"; // using yyyy-mm-dd format, because that's what the date input field uses
    let selectedEndDate = "2025-12-31";

    /**
     * Convert yyyy-mm-dd (what date pickers use) to mm/dd/yyyy (format used by transactions)
     * @param yyyymmdd {string} yyyy-mm-dd
     * @returns {string} mm/dd/yyyy
     */
    function yyyymmddToMmddyyyy(yyyymmdd) {
        let date = yyyymmdd.split("-").map((x) => parseInt(x));
        return date[1] + "/" + date[2] + "/" + date[0];
    }
</script>

<h2>Summary</h2>

<input type="date" bind:value={selectedStartDate} />
<input type="date" bind:value={selectedEndDate} />

<p>Total: {data.balance}</p>
{#each getTransactionsInDateRange(yyyymmddToMmddyyyy(selectedStartDate), yyyymmddToMmddyyyy(selectedEndDate)) as transaction}
    <p>
        {#if transaction["nickname"]} <b style:font-size="large">{transaction["nickname"]}</b> <br /> {/if}
        Date: {transaction["date"]} <br />
        Transaction type: {(transaction.quantity > 0)?"income":"expense"} <br />
        Amount: {Math.abs(transaction.quantity)}
    </p>
{/each}