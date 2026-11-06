const CURRENCY_CODE = /^[A-Za-z]{3}$/;

export function documentTotal(quantity, price, currency = "USD") {
    if (!/^\d{1,5}$/.test(quantity) || !/^\d{1,8}(?:\.\d{1,2})?$/.test(price)) {
        throw new Error("Use a whole quantity (1–99,999) and a non-negative unit price with at most two decimals.");
    }
    if (!CURRENCY_CODE.test(currency))
        throw new Error("Use a three-letter currency code such as USD or EUR.");
    const count = Number(quantity);
    if (count < 1)
        throw new Error("Quantity must be at least one.");
    const [whole, fraction = ""] = price.split(".");
    const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
    const total = count * cents;
    if (!Number.isSafeInteger(total))
        throw new Error("The total exceeds the supported amount.");
    const code = currency.toUpperCase();
    // Always show two decimals so the output matches the minor-unit arithmetic above.
    const formatted = new Intl.NumberFormat("en-US", {
        style: "currency", currency: code, currencyDisplay: "code",
        minimumFractionDigits: 2, maximumFractionDigits: 2,
    }).format(total / 100);
    return { cents: total, currency: code, formatted };
}
export function businessPlan(business, customer, offer) {
    if ([business, customer, offer].some((value) => !value.trim() || value.length > 500)) {
        throw new Error("Complete each plan field using 1–500 characters.");
    }
    return [
        `Business: ${business.trim()}`, `Customers: ${customer.trim()}`, `Offer: ${offer.trim()}`,
        "Validate: Interview prospective customers and test a small, clearly priced offer.",
        "Operations: Define delivery steps, suppliers, security controls, and customer support.",
        "Finances: Estimate fixed costs, unit costs, expected sales, and a cash reserve. These are your estimates, not guaranteed returns.",
        "Next steps: Confirm registration and tax requirements with official agencies; review privacy obligations and relevant permits.",
    ].join("\n\n");
}
