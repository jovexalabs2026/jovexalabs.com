export function documentTotal(quantity, price) {
    if (!/^\d{1,5}$/.test(quantity) || !/^\d{1,8}(?:\.\d{1,2})?$/.test(price)) {
        throw new Error("Use a whole quantity (1–99,999) and a non-negative PHP price with at most two decimals.");
    }
    const count = Number(quantity);
    if (count < 1)
        throw new Error("Quantity must be at least one.");
    const [whole, fraction = ""] = price.split(".");
    const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
    const total = count * cents;
    if (!Number.isSafeInteger(total))
        throw new Error("The total exceeds the supported amount.");
    return { cents: total, formatted: new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(total / 100) };
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
