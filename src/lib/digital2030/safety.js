export function assessSafety(input) {
    if (!input.trim() || input.length > 5000)
        throw new Error("Enter 1 to 5,000 characters.");
    const indicators = [];
    if (/\b(otp|password|pin|recovery phrase|seed phrase|one.time code)\b/i.test(input)) {
        indicators.push("Requests or references to passwords, PINs, or recovery codes deserve extra caution. Never share these.");
    }
    if (/\b(urgent|immediately|suspended|winner|prize|guaranteed|act now)\b/i.test(input)) {
        indicators.push("Urgency, threats, or prize language may be used to pressure you.");
    }
    const candidates = input.match(/[a-z][a-z0-9+.-]*:\/\/[^\s<>"']+/gi) ?? [];
    for (const candidate of candidates) {
        let url;
        try {
            url = new URL(candidate);
        }
        catch {
            indicators.push("A link could not be parsed. Do not open it.");
            continue;
        }
        if (url.protocol !== "https:")
            indicators.push("A link does not use HTTPS. HTTPS alone is not proof of legitimacy.");
        if (url.username || url.password)
            indicators.push("A link contains embedded credentials, which can disguise its true destination.");
        const host = url.hostname.toLowerCase();
        if (host.includes("xn--"))
            indicators.push("An internationalized hostname may imitate a familiar brand.");
        if (host === "localhost" || host.endsWith(".local") || host.includes(":") ||
            /^[\d.]+$/.test(host) || host.endsWith(".internal")) {
            indicators.push("A link targets a local hostname or literal network address. Do not follow untrusted network links.");
        }
        if (["bit.ly", "tinyurl.com", "t.co"].includes(host))
            indicators.push("A shortened link hides the final destination.");
    }
    return {
        label: indicators.length ? "Warning signs found — not a definitive scam finding" : "No listed warning signs detected — not a safety guarantee",
        indicators: [...new Set(indicators)],
        note: "Local text analysis only. No URL was opened, resolved, fetched, or sent to an external service.",
    };
}
