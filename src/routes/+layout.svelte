<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";

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

    let navPages = [
        {
            title: "Settings",
            path: "/settings",
        },
        {
            title: "Transactions",
            path: "/transactions",
        },
        {
            title: "Home",
            path: "/",
        },
        {
            title: "Summary",
            path: "/summary",
        },
        {
            title: "Help",
            path: "/help",
        },
    ];
</script>

<div id="mainMobile">
    <div id="content">
        <slot></slot>
    </div>
    <div id="navigation">
        {#each navPages as navItem}
            <a href={navItem.path}
                style:color={($page.url.pathname == navItem.path)?"steelblue":"grey"}>
                {navItem.title}
            </a>
        {/each}
    </div>
</div>

<style>
    #mainMobile {
        position: fixed;
        width: calc(min(700px, 100vw)); /* 100vw */
        height: 100%;
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

    /* navbar icons */
    #mainMobile #navigation a {
        display: inline-block;
        height: 100%;
        width: calc(100% / 5 - 5px);
        box-sizing: border-box;
        font-size: 9px;
        vertical-align: top;
        color: grey;
        text-decoration: none; /* prevent it from looking like a hyperlink */
        text-transform: capitalize; /* home -> Home; settings -> Settings */
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

<svelte:head>
    <!-- add title and favicon -->

    <!-- Prevent zooming -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
</svelte:head>