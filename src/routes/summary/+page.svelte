<!-- The summary page shows graphs of the user's income and expenses over time, their balance, and their expenses by category -->

<script>
    import { onMount } from "svelte";
    import UserData from "$lib/UserData";
    import { Line } from "svelte-chartjs";
    import "chart.js/auto";
    import moment from "moment";
    import "chartjs-adapter-moment";
    import { driver } from "driver.js";
    import "driver.js/dist/driver.css";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    let data = new UserData();

    // Though income and expense are stored in the same array, they are plotted separately in the graph
    /** @type {{ x: string, y: number, timeNumeric: number }[]} */
    let incomeGraphData = [];
    /** @type {{ x: string, y: number, timeNumeric: number }[]} */
    let expenseGraphData = [];

    /** @type {{ x: string, y: number, timeNumeric: number }[]} */
    let balanceGraphData = [];

    /** @type {{ label: string, data: { x: string, y: number, timeNumeric: number }[], borderWidth: 1, borderColor: string, }[]} */
    let tagsGraphDatasets = [];

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

        // calculate tags graph data
        tagsGraphDatasets = [];
        for (let i = 0; i < data.tags.length; i++) {
            let tag = data.tags[i];

            // different color for each tag
            let lineColor = `hsl(${(i * 360 / data.tags.length)}deg, 50%, 50%)`;

            tagsGraphDatasets = [...tagsGraphDatasets, {
                label: tag,
                data: [],
                borderWidth: 1,
                borderColor: lineColor,
            }];

            // add data for each tag
            for (let transaction of data.transactions) {
                if (transaction.tag == tag && transaction.quantity < 0) {
                    tagsGraphDatasets[tagsGraphDatasets.length - 1].data = [...tagsGraphDatasets[tagsGraphDatasets.length - 1].data, {
                        x: moment(transaction.date, "MM/DD/YYYY").format("YYYY-MM-DD"),
                        y: Math.abs(transaction.quantity),
                        timeNumeric: moment(transaction.date, "MM/DD/YYYY").unix(),
                    }];
                }
            }

            // sort tagsGraphDatasets[tagsGraphDatasets.length - 1].data by timeNumeric
            tagsGraphDatasets[tagsGraphDatasets.length - 1].data.sort((a, b) => a.timeNumeric - b.timeNumeric);
        }

        // show tutorial if user navigated from help menu
        if ($page.url.searchParams.get("tutorial") == "true") {
            helpTutorial.drive();
        }
    });

    let selectedStartDate = moment().subtract(1, "week").format("YYYY-MM-DD");
    let selectedEndDate = moment().format("YYYY-MM-DD");

    // shown if user navigated from help menu
    let helpTutorial = driver({
        showProgress: true,
        steps: [
            { element: "input[type=date]", popover: { title: "Set Start Date", description: "Use this box to set the start date of the graph.", side: "right", align: 'start' }},
            { element: "input[type=date]:nth-of-type(2)", popover: { title: "Set End Date", description: "Use this box to set the end date of the graph.", side: "right", align: 'start' }},
            { element: "#incomeExpenseGraphContainer", popover: { title: "Analyze Your Income and Expenses", description: "This graph shows your income and expenses over time.", side: "bottom", align: 'start' }},
            { element: "#balanceGraphContainer", popover: { title: "Analyze Your Balance", description: "This graph shows your total balance over time.", side: "bottom", align: 'start' }},
            { element: "#tagsGraphContainer", popover: { title: "Analyze Your Expenses by Category", description: "This graph shows expenses by category over time.", side: "bottom", align: 'start' }},
        ],
        onDestroyStarted: () => {
            helpTutorial.destroy();
            // if user closes/completes tutorial, go back to help page
            goto("/help");
        }
    });
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

<h3>Incomes and Expenses in Selected Time Period</h3>
<div style:width="100%" id="incomeExpenseGraphContainer">
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
<div style:width="100%" id="balanceGraphContainer">
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

<h3>Expenditures by Category</h3>
<div style:width="100%" id="tagsGraphContainer">
    <Line data={{
            datasets: tagsGraphDatasets,
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