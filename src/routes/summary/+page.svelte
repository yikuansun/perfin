<script>
    import { onMount } from "svelte";
    import UserData from "$lib/UserData";
    import { Line } from "svelte-chartjs";
    import "chart.js/auto";
    import moment from "moment";
    import "chartjs-adapter-moment";

    let data = new UserData();

    /** @type {{ x: string, y: number, timeNumeric: number }[]} */
    let graphData = [];

    onMount(() => {
        data.readFromLocalStorage();
        data = data; // make sure svelte updates it in the page

        // convert transactions to graphData
        for (let transaction of data.transactions) {
            graphData.push({
                x: moment(transaction.date, "MM/DD/YYYY").format("YYYY-MM-DD"),
                y: transaction.quantity,
                timeNumeric: moment(transaction.date, "MM/DD/YYYY").unix(),
            });
        }
        graphData.sort((a, b) => a.timeNumeric - b.timeNumeric); // sort by date

        graphData = graphData; // svelte only updates after assignment
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

<h2>Summary</h2>

View transactions between <br />
<input type="date" bind:value={selectedStartDate} />
and <input type="date" bind:value={selectedEndDate} />

<!--<h2>Transactions</h2>
{#each getTransactionsInDateRange(yyyymmddToMmddyyyy(selectedStartDate), yyyymmddToMmddyyyy(selectedEndDate)) as transaction}
    <p>
        {#if transaction["nickname"]} <b style:font-size="large">{transaction["nickname"]}</b> <br /> {/if}
        Date: {transaction["date"]} <br />
        Transaction type: {(transaction.quantity > 0)?"income":"expense"} <br />
        Amount: {Math.abs(transaction.quantity)}
    </p>
{/each}-->

<div style:width="100%">
    <Line data={{
            datasets: [{
                label: "Income/Expenses",
                data: graphData,
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
                /*y: {
                    beginAtZero: true,
                },*/
            },
        }} />
</div>