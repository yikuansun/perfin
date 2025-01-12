<script>
    import { onMount } from "svelte";

    /** @type {("mobile" | "desktop")} */
    let layout = "mobile"; // mobile or desktop? For responsive design

    /**
     * Set variable layout based on dimensions of screen.
     */
    function setLayout() {
        if (window.innerWidth < 700) layout = "mobile";
        else layout = "desktop";
    }

    // onMount function is called when app loads
    onMount(() => {
        setLayout();

        // change layout when window resized - for responsive design
        window.addEventListener("resize", setLayout);
    });
</script>

<div id="mainMobile">
    <div id="content">
        <slot></slot>
    </div>
    <div id="navigation">
        <a href="/settings">settings</a>
        <a href="/transactions">transactions</a>
        <a href="/">home</a>
        <a href="/summary">summary</a>
        <a href="/help">help</a>
    </div>
</div>

<style>
    #mainMobile {
        position: fixed;
        width: calc(min(700px, 100vw)); /* 100vw */
        height: 100vh;
        left: 50vw;
        top: 0;
        transform: translateX(-50%);
        background-color: #EEEEEE;
        overflow-x: hidden;
    }

    #mainMobile #navigation {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        background-color: #EEEEEE;
        box-shadow: 0 0 5px grey;
    }

    #mainMobile #content {
        width: 100%;
        height: calc(100% - 50px); /* compensate for navbar height */
        overflow-y: scroll;
        /* slight margins */
        box-sizing: border-box;
        padding: 10px;
    }
</style>