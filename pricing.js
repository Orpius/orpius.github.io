class PricingManager {

    constructor() {
        /* Pricing data with currency symbols embedded */
        this.pricingData = {
            CHF: {
                symbol: "CHF",
                single: 299,
                hosted: 1999,
                onsite: 9900
            },
            USD: {
                symbol: "$",
                single: 249,
                hosted: 1899,
                onsite: 8900
            },
            EUR: {
                symbol: "€",
                single: 279,
                hosted: 1949,
                onsite: 9400
            },
            GBP: {
                symbol: "£",
                single: 229,
                hosted: 1749,
                onsite: 8400
            }
        };

        this.pricing = {};
        this.currencySymbols = {};
    }

    initialise() {
        /* Load static data into internal structures */
        this.pricing = {};
        this.currencySymbols = {};

        for (const code in this.pricingData) {
            const entry = this.pricingData[code];

            this.pricing[code] = {
                single: entry.single,
                hosted: entry.hosted,
                onsite: entry.onsite
            };

            this.currencySymbols[code] = entry.symbol;
        }

        const culture = this.detectCulture();
        const currency = this.detectCurrencyFromCulture(culture);

        this.updatePrices(currency);
    }

    detectCulture() {
        const params = new URLSearchParams(window.location.search);
        const fromQuery = params.get("culture");

        if (fromQuery && typeof fromQuery === "string" && fromQuery.length >= 2) {
            return fromQuery;
        }

        return navigator.language || navigator.userLanguage || "en-US";
    }

    detectCurrencyFromCulture(culture) {
        const c = culture.toLowerCase();

        if (c.endsWith("ch")) {
            return "CHF";
        }

        if (c.endsWith("us")) {
            return "USD";
        }

        if (c.endsWith("gb")) {
            return "GBP";
        }

        const euCountries = [
            "fr", "it", "es", "pt", "de", "nl", "be", "lu", "ie",
            "gr", "at", "fi", "ee", "lv", "lt", "sk", "si",
            "cy", "mt"
        ];

        for (const code of euCountries) {
            if (c.endsWith(code)) {
                return "EUR";
            }
        }

        return "USD";
    }

    formatPrice(currencyCode, amount) {
        if (amount == null) {
            return "Contact us";
        }

        try {
            return new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: currencyCode,
                maximumFractionDigits: 0
            }).format(amount);
        }
        catch {
            const symbol = this.currencySymbols[currencyCode] || currencyCode;
            return symbol + " " + amount.toLocaleString();
        }
    }

    updatePrices(currencyCode) {
        const planPrices = this.pricing[currencyCode] || this.pricing["CHF"];

        document.querySelectorAll(".price-amount").forEach(el => {
            const plan = el.getAttribute("data-plan");
            const amount = planPrices[plan];
            el.textContent = this.formatPrice(currencyCode, amount);
        });
    }
}
