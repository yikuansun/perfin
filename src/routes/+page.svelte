<script>
    import { onMount } from "svelte";
    import UserData from "$lib/UserData";
    import { Line } from "svelte-chartjs";
    import "chart.js/auto";

    let data = new UserData();

    onMount(() => {
        data.readFromLocalStorage();
        data = data; // svelte only updates after assignment
    });
</script>

<h1>YOUR BALANCE: {data.balance}</h1>

<div style:width="100%">
    <Line data={{
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1,
            }],
        }} options={{
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        }} />
</div>