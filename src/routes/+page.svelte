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
        data = data; // svelte only updates after assignment

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

        getBalance();
    });

    let balance = 0;
    /**
     * Calculate total balance based on past transactions
     */
    function getBalance() {
        balance = 0;
        for (let transaction of data.transactions) {
            balance += transaction.quantity; // income/expense baked into value (positive/negative)
        }
    }
</script>

<h1>YOUR BALANCE: {balance}</h1>

<div style:width="100%">
    <Line data={{
            datasets: [{
                label: '# of Votes',
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
                },
                /*y: {
                    beginAtZero: true,
                },*/
            },
        }} />
</div>