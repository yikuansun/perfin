<!-- This is the "shell" of the app, which is rendered around every page. The actual content of the page is rendered in the <slot></slot> tag -->

<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    /** @type {("mobile" | "desktop")} */
    let layout = "desktop"; // mobile or desktop? For responsive design

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
            icon: "settings",
        },
        {
            title: "Transactions",
            path: "/transactions",
            icon: "receipt",
        },
        {
            title: "Home",
            path: "/",
            icon: "home",
        },
        {
            title: "Summary",
            path: "/summary",
            icon: "timeline",
        },
        {
            title: "Help",
            path: "/help",
            icon: "help",
        },
    ];
</script>

{#if layout == "mobile"}
<div id="mainMobile">
    <div id="content">
        <slot></slot> <!-- the actual content of the page is rendered here -->
    </div>
    <div id="navigation">
        {#each navPages as navItem}
            <a href={navItem.path}
                style:color={($page.url.pathname == navItem.path)?"hotpink":"grey"}>
                <span style:line-height="1.5" style:vertical-align="middle" style:display="inline-block">
                    <span class="material-symbols-outlined">{navItem.icon}</span>
                    <br />
                    {navItem.title}
                </span>
            </a>
        {/each}
    </div>
</div>
{:else if layout == "desktop"}
<div id="mainDesktop">
    <div id="navigation">
        {#each navPages as navItem}
            <a href={navItem.path}
                style:color={($page.url.pathname == navItem.path)?"hotpink":"grey"}>
                {navItem.title}
            </a>
        {/each}
    </div>
    <div id="content">
        <slot></slot> <!-- the actual content of the page is rendered here -->
    </div>
</div>
{/if}

<style>
    #mainMobile {
        position: fixed;
        width: 100vw;
        height: 100%;
        left: 50vw;
        top: 0;
        transform: translateX(-50%);
        background-color: #1B1B1B;
        overflow-x: hidden;
        color: azure;
        font-family: "Roboto", sans-serif;
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
        box-shadow: 0 4px 14px deeppink;
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
        scrollbar-width: thin;
        scrollbar-color: dimgrey #333333;
    }

    #mainDesktop {
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        background-color: #1B1B1B;
        overflow-y: scroll;
        overflow-x: hidden;
        color: azure;
        scrollbar-width: thin;
        scrollbar-color: dimgrey #333333;
        font-family: "Roboto", sans-serif;
    }

    #mainDesktop #content {
        width: calc(min(100%, 800px));
        box-sizing: border-box;
        padding: 20px;
        margin: 0 calc(50vw - min(100%, 800px) / 2);
    }

    #mainDesktop #navigation {
        position: sticky;
        top: 0;
        box-sizing: border-box;
        padding: 16px;
        background-color: #111111;
        box-shadow: 0 -4px 14px black;
        text-align: center;
    }
    #mainDesktop #navigation a {
        text-decoration: none;
        margin: 0 10px;
        transition: color 0.3s;
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

    :global(input[type=text], input[type=number], input[type=date], select, input[type=search]) {
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

    #mainDesktop :global(.modal) {
        position: fixed;
        top: 50vh;
        left: 50vw;
        transform: translate(-50%, -50%);
        z-index: 123; /* show in front of menubar */
        box-sizing: border-box;
        padding: 16px 24px;
        background-color: #1B1B1B;
        border: 1px solid #333333;
        border-radius: 5px;
        box-shadow: 0 7px 14px hsla(0deg, 0%, 0%, 50%);
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
    <title>Perfin</title>

    <!-- Prevent zooming -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

    <!-- Fonts from Google Fonts - Roboto & Material Symbols -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
</svelte:head>