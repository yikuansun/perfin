<!-- Create charts using Chart.js, as a Svelte component. -->

<script>
    import Chart from "chart.js/auto";
    import { onMount } from "svelte";

    export let type = "bar";
    export let data = {};
    export let options = {};
    export let plugins = [];

    /** @type {HTMLCanvasElement} */
    let canvas;

    onMount(() => {
        new Chart(canvas, {
            type: type,
            data: data,
            options: options,
            plugins: plugins,
        })
    });
</script>

<canvas bind:this={canvas}></canvas>