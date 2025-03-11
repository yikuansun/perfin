/**
 * Store all user data in a comprehensive object, which can be read from or written to local storage in any page of the app.
 */
class UserData {
    /** @type {Array.<{ date: string, quantity: number, nickname: string, }>} */
    transactions;
    /** @type {Object[]} */
    recurrences;

    constructor() {
        this.transactions = [];
        this.recurrences = [];
    }

    /**
     * Save all user data to local storage, so it can be accessed at a later time.
     */
    saveToLocalStorage() {
        window.localStorage.setItem("dataExists", "true");
        window.localStorage.setItem("transactions", JSON.stringify(this.transactions));
        window.localStorage.setItem("recurrences", JSON.stringify(this.recurrences));
    }

    /**
     * Fetch previously-saved user data
     */
    readFromLocalStorage() {
        if (window.localStorage.getItem("dataExists")) {
            this.transactions = JSON.parse(window.localStorage.getItem("transactions") || "[]");
            this.recurrences = JSON.parse(window.localStorage.getItem("recurrences") || "[]");
        }
    }

    /**
     * Wipe all user data permanantly! as if the app was never opened before.
     */
    purgeLocalStorage() {
        window.localStorage.removeItem("dataExists");
        window.localStorage.removeItem("transactions");
        window.localStorage.removeItem("recurrences");
    }
}

export default UserData;