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
                style:color={($page.url.pathname == navItem.path)?"deepskyblue":"grey"}>
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
        background-color: #1B1B1B;
        overflow-x: hidden;
        color: azure;
    }

    #mainMobile #navigation {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        background-color: #222222;
        box-shadow: 0 0 5px steelblue;
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

    :global(button) {
        background-color: #363636;
        color: azure;
        padding: 6px 12px;
        border: 0;
        border-radius: 4px;
        transition: background-color 0.2s, box-shadow 0.2s;
        margin: 2px;
    }

    :global(button:active) {
        background-color: dimgrey;
    }

    :global(input[type=text], input[type=number], input[type=date], select) {
        background-color: #111111;
        color: azure;
        padding: 5px 10px;
        border: 1px solid #333333;
        border-radius: 4px;
        outline: none!important;
        margin: 2px;
    }

    #mainMobile :global(.modal) {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 123; /* show in front of menubar */
        width: 100vw;
        box-sizing: border-box;
        padding: 10px;
        background-color: #1B1B1B;
        border-top: 1px solid #333333;
        box-shadow: 0 4px 14px black;
                    /*0 -100vh 100vh 100vh hsla(0deg, 0%, 20%, 80%); /* greywall */
    }

    /* to put behind modals */
    :global(.greywall) {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 121; /* in between page content & modal */
        width: 100vw;
        height: 100vh;
        background-color: hsla(0deg, 0%, 20%, 80%)!important;
        /* For accessibility purposes, I've made greywalls button elements.
            Therefore, the default button properties must be removed. */
        display: block; border: 0; margin: 0; padding: 0; border-radius: 0;
    }
</style>

<svelte:head>
    <!-- add title and favicon -->

    <!-- Prevent zooming -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
</svelte:head>