<!-- The home page shows the user their balance and a list of their recent transactions -->

<script>
    import { onMount } from "svelte";
    import UserData from "$lib/UserData";
    import { Line } from "svelte-chartjs";
    import "chart.js/auto";
    import moment from "moment";
    import "chartjs-adapter-moment";

    let data = new UserData();

    /** @type {{ x: string, y: number, }[]} */
    let graphData = [];

    onMount(() => {
        data.readFromLocalStorage();
        data = data; // svelte only updates after assignment

        // calculate balance after each transaction, and display it in the graph
        graphData = [];
        let balance = 0;
        for (let transaction of data.transactions.toReversed()) {
            balance += transaction.quantity; // income/expense baked into value (positive/negative)
            graphData = [...graphData, {
                x: moment(transaction.date, "MM/DD/YYYY").format("YYYY-MM-DD"),
                y: balance,
            }];
        }
        // add current balance at the end of the graph
        graphData = [...graphData, {
            x: moment().format("YYYY-MM-DD"), // current date
            y: balance,
        }];

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

<h1>YOUR BALANCE: ${balance.toFixed(2)}</h1>

<div style:width="100%" style:margin-bottom="14px">
    {#if graphData.length > 0}
        <Line data={{
                datasets: [{
                    label: 'Balance',
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
    {/if}
</div>
<a href="/summary"><button>View detailed summary</button></a>

<h2>Recent Transactions</h2>
<!-- Show the first 5 transactions -->
{#each data.transactions.slice(0, 5) as transaction}
    <div style:margin-bottom="14px">
        {#if transaction["nickname"]} <b style:font-size="large">{transaction["nickname"]}</b> <br /> {/if}
        Date: {transaction["date"]} <br />
        Transaction type: {(transaction.quantity > 0)?"income":"expense"} <br />
        Amount: ${Math.abs(transaction.quantity).toFixed(2)} <br />
        {#if transaction.tag} Category: {transaction.tag} <br /> {/if}
    </div>
{/each}
<a href="/transactions">
    <button>View all transactions</button>
</a>