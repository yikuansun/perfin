<script>
    import { onMount } from "svelte";
    import UserData from "$lib/UserData";
    import { Line } from "svelte-chartjs";
    import "chart.js/auto";
    import moment from "moment";
    import "chartjs-adapter-moment";

    let data = new UserData();

    // Though income and expense are stored in the same array, they are plotted separately in the graph
    /** @type {{ x: string, y: number, timeNumeric: number }[]} */
    let incomeGraphData = [];
    /** @type {{ x: string, y: number, timeNumeric: number }[]} */
    let expenseGraphData = [];

    /** @type {{ x: string, y: number, timeNumeric: number }[]} */
    let balanceGraphData = [];

    onMount(() => {
        data.readFromLocalStorage();
        data = data; // make sure svelte updates it in the page

        // convert transactions to graphData
        incomeGraphData = [];
        expenseGraphData = [];
        for (let transaction of data.transactions) {
            if (transaction.quantity > 0) {
                incomeGraphData.push({
                    x: moment(transaction.date, "MM/DD/YYYY").format("YYYY-MM-DD"),
                    y: transaction.quantity,
                    timeNumeric: moment(transaction.date, "MM/DD/YYYY").unix(),
                });
            }
            else {
                expenseGraphData.push({
                    x: moment(transaction.date, "MM/DD/YYYY").format("YYYY-MM-DD"),
                    y: Math.abs(transaction.quantity),
                    timeNumeric: moment(transaction.date, "MM/DD/YYYY").unix(),
                });
            }
        }

        // make sure graph points are in chronological order
        incomeGraphData.sort((a, b) => a.timeNumeric - b.timeNumeric);
        expenseGraphData.sort((a, b) => a.timeNumeric - b.timeNumeric);

        // trigger update in svelte
        incomeGraphData = incomeGraphData;
        expenseGraphData = expenseGraphData;

        // calculate balance after each transaction
        balanceGraphData = [];
        let balance = 0;
        for (let transaction of data.transactions.toReversed()) {
            balance += transaction.quantity; // income/expense baked into value (positive/negative)
            balanceGraphData.push({
                x: moment(transaction.date, "MM/DD/YYYY").format("YYYY-MM-DD"),
                y: balance,
                timeNumeric: moment(transaction.date, "MM/DD/YYYY").unix(),
            });
        }
        // display today's balance at the end of the graph
        balanceGraphData.push({
            x: moment().format("YYYY-MM-DD"), // current date
            y: balance,
            timeNumeric: moment().unix(),
        });
        balanceGraphData.sort((a, b) => a.timeNumeric - b.timeNumeric);
        balanceGraphData = balanceGraphData; // trigger update in svelte

        // the graph has an issue with reactivity, but we can use this workaround to update the graph
        selectedEndDate = moment().subtract(1, "day").format("YYYY-MM-DD");
        setTimeout(() => { selectedEndDate = moment().format("YYYY-MM-DD"); }, 10);
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

    let selectedStartDate = moment().subtract(1, "week").format("YYYY-MM-DD");
    let selectedEndDate = moment().format("YYYY-MM-DD");

</script>

View transactions between <br />
<input type="date" bind:value={selectedStartDate} />
and <input type="date" bind:value={selectedEndDate} />
<br />
<button on:click={() => {
    selectedStartDate = moment().subtract(1, "week").format("YYYY-MM-DD");
    selectedEndDate = moment().format("YYYY-MM-DD");
}} style:font-size="11px">Last week</button>
<button on:click={() => {
    selectedStartDate = moment().subtract(1, "month").format("YYYY-MM-DD");
    selectedEndDate = moment().format("YYYY-MM-DD");
}} style:font-size="11px">Last month</button>
<button on:click={() => {
    selectedStartDate = moment().subtract(3, "month").format("YYYY-MM-DD");
    selectedEndDate = moment().format("YYYY-MM-DD");
}} style:font-size="11px">Last 3 months</button>
<button on:click={() => {
    selectedStartDate = moment().subtract(1, "year").format("YYYY-MM-DD");
    selectedEndDate = moment().format("YYYY-MM-DD");
}} style:font-size="11px">Last year</button>

<!--<h2>Transactions</h2>
{#each getTransactionsInDateRange(yyyymmddToMmddyyyy(selectedStartDate), yyyymmddToMmddyyyy(selectedEndDate)) as transaction}
    <p>
        {#if transaction["nickname"]} <b style:font-size="large">{transaction["nickname"]}</b> <br /> {/if}
        Date: {transaction["date"]} <br />
        Transaction type: {(transaction.quantity > 0)?"income":"expense"} <br />
        Amount: {Math.abs(transaction.quantity)}
    </p>
{/each}-->

<h3>Incomes and Expenses in Selected Time Period</h3>
<div style:width="100%">
    <Line data={{
            datasets: [
                {
                    label: "Incomes",
                    data: incomeGraphData,
                    borderWidth: 1,
                    borderColor: "deepskyblue",
                },
                {
                    label: "Expenses",
                    data: expenseGraphData,
                    borderWidth: 1,
                    borderColor: "hotpink",
                },
            ],
        }} options={{
            scales: {
                x: {
                    type: "time",
                    time: {
                        unit: "day",
                        displayFormats: { day: "MMM DD" }
                    },
                    min: selectedStartDate,
                    max: selectedEndDate,
                },
                y: {
                    beginAtZero: true,
                },
            },
        }} />
</div>

<h3>Balance Over Time</h3>
<div style:width="100%">
    <Line data={{
            datasets: [{
                label: "Balance",
                data: balanceGraphData,
                borderWidth: 1,
                borderColor: "hotpink",
            }],
        }} options={{
            scales: {
                x: {
                    type: "time",
                    time: {
                        unit: "day",
                        displayFormats: { day: "MMM DD" }
                    },
                    min: selectedStartDate,
                    max: selectedEndDate,
                },
                y: {
                    beginAtZero: true,
                },
            },
        }} />
</div>