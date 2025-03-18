<!-- The help page is a simple page that shows tutorials and a chatbot -->

<script>
    let chatbotInput = "";
    /** @type {{ question: string, answer: string }[]} */
    let chatbotMessages = [];

    /**
     * Create a response to the user's message
     * @param {string} message user input
     * @returns {string} the answer to the message
     */
    function processChatbotMessage(message) {
        if (message.includes("create") && message.includes("transaction")) {
            return `You can create a transaction by navigating to the Transactions page and clicking the "New Transaction" button.
                Enter the date of the transaction, the amount, and whether it was an income or an expense.
                You can also add a title and category. Press "Add Transaction" to save the transaction.`;
        }
        else if (message.includes("edit") && message.includes("transaction")) {
            return `You can edit a transaction by navigating to the Transactions page and clicking the "Edit" button below the transaction you want to edit.
                You can change the date, type, amount, title, and category of the transaction. Press "Save" to save the changes.`;
        }
        else if (message.includes("analyze")) {
            return `You can analyze your income and expenses over time by navigating to the Summary page.
                You can use the data inputs at the top of the page to change the timeframe you want to analyze.
                You can also view your overall balance and compare it to your budget.
                In the Expenditures by Category graph, you can click each category to show or hide it.
                You can also hover over each point on the graph to see specific data points.`;
        }
        return "I'm sorry, I don't understand. Please try again.";
    }
</script>

<h2>What would you like to do?</h2>
<!-- A page with the query ?tutorial=true will show the tutorial when the user navigates to it -->
<a href="/transactions?tutorial=true">
    <button>Create and view transactions</button>
</a>
<br />
<a href="/summary?tutorial=true">
    <button>Analyze your income and expenses over time</button>
</a>
<br />
<a href="/settings?tutorial=true">
    <button>Manage your data and privacy</button>
</a>

<h2>Talk to Us</h2>
{#each chatbotMessages as message}
    <p>
        <b>Q:</b>
        {message.question} <br />
        <b>A:</b>
        {message.answer}
    </p>
{/each}
<input type="text" placeholder="Enter your message here..." bind:value={chatbotInput} on:keydown={(e) => {
    if (chatbotInput.length > 0 && e.key === "Enter") {
        e.preventDefault();
        // create blank message and add it to the chatbotMessages array
        let newMessage = { question: chatbotInput, answer: "" };
        chatbotMessages = [...chatbotMessages, newMessage];
        // answer typing effect
        let answer = processChatbotMessage(chatbotInput);
        let typingEffect = setInterval(() => {
            if (newMessage.answer.length < answer.length) {
                newMessage.answer += answer.charAt(newMessage.answer.length);
                chatbotMessages = [...chatbotMessages]; // trigger reactivity
            } else {
                clearInterval(typingEffect);
            }
        }, 75);
        // reset input box
        chatbotInput = "";
    }
}} style:width="100%" style:box-sizing="border-box" />